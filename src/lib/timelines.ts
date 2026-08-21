import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { type Timeline, type TimelineDoc, type Block, type BlockDoc, type TimelineStatus, serializeTimeline, serializeBlock } from "@/types/timeline";

const TIMELINES = "timelines";
const BLOCKS = "blocks";

async function getTimelinesCol() {
  return (await getDb()).collection<TimelineDoc>(TIMELINES);
}
async function getBlocksCol() {
  return (await getDb()).collection<BlockDoc>(BLOCKS);
}

export async function getOrCreateTimeline(userId: string, date: string): Promise<Timeline> {
  const tCol = await getTimelinesCol();
  const existing = await tCol.findOne({ userId, date });
  if (existing) {
    return serializeTimeline(existing, await getBlocksForTimeline(existing._id.toString()));
  }
  
  const doc: TimelineDoc = {
    _id: new ObjectId(),
    userId,
    date,
    status: "draft",
    totalPlannedMinutes: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await tCol.insertOne(doc);
  return serializeTimeline(doc, []);
}

export async function updateTimelineStatus(userId: string, date: string, status: TimelineStatus): Promise<Timeline | null> {
  const tCol = await getTimelinesCol();
  const updated = await tCol.findOneAndUpdate(
    { userId, date },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  if (!updated) return null;
  return serializeTimeline(updated, await getBlocksForTimeline(updated._id.toString()));
}

export async function getBlocksForTimeline(timelineId: string): Promise<Block[]> {
  const bCol = await getBlocksCol();
  const docs = await bCol.find({ timelineId }).sort({ order: 1 }).toArray();
  return docs.map(serializeBlock);
}

export async function addBlock(userId: string, date: string, blockData: Partial<BlockDoc>): Promise<Block> {
  const timeline = await getOrCreateTimeline(userId, date);
  const bCol = await getBlocksCol();
  const doc: BlockDoc = {
    _id: new ObjectId(),
    userId,
    timelineId: timeline.id,
    name: blockData.name ?? "New Block",
    startMinute: blockData.startMinute ?? 480,
    durationMinutes: blockData.durationMinutes ?? 30,
    energyZone: blockData.energyZone ?? "recovery",
    habitIds: blockData.habitIds ?? [],
    isRestBlock: blockData.isRestBlock ?? false,
    order: blockData.order ?? 0,
  };
  await bCol.insertOne(doc);
  await recomputeTotalMinutes(timeline.id);
  return serializeBlock(doc);
}

export async function updateBlock(userId: string, blockId: string, patch: Partial<BlockDoc>): Promise<Block | null> {
  if (!ObjectId.isValid(blockId)) return null;
  const bCol = await getBlocksCol();
  const updated = await bCol.findOneAndUpdate(
    { _id: new ObjectId(blockId), userId },
    { $set: patch },
    { returnDocument: "after" }
  );
  if (updated) {
    await recomputeTotalMinutes(updated.timelineId);
    return serializeBlock(updated);
  }
  return null;
}

export async function deleteBlock(userId: string, blockId: string): Promise<boolean> {
  if (!ObjectId.isValid(blockId)) return false;
  const bCol = await getBlocksCol();
  const block = await bCol.findOne({ _id: new ObjectId(blockId), userId });
  if (block) {
    const res = await bCol.deleteOne({ _id: new ObjectId(blockId) });
    if (res.deletedCount === 1) {
      await recomputeTotalMinutes(block.timelineId);
      return true;
    }
  }
  return false;
}

export async function autoInsertRestBlock(userId: string, timelineId: string, afterBlockId: string): Promise<Block | null> {
  if (!ObjectId.isValid(afterBlockId)) return null;
  const bCol = await getBlocksCol();
  const block = await bCol.findOne({ _id: new ObjectId(afterBlockId), userId });
  if (!block) return null;
  
  const restDoc: BlockDoc = {
    _id: new ObjectId(),
    userId,
    timelineId,
    name: "Rest",
    startMinute: block.startMinute + block.durationMinutes,
    durationMinutes: 15,
    energyZone: "recovery",
    habitIds: [],
    isRestBlock: true,
    order: block.order + 1,
  };
  
  await bCol.updateMany(
    { timelineId, order: { $gt: block.order } },
    { $inc: { order: 1 } }
  );
  
  await bCol.insertOne(restDoc);
  return serializeBlock(restDoc);
}

export async function recomputeTotalMinutes(timelineId: string): Promise<void> {
  if (!ObjectId.isValid(timelineId)) return;
  const blocks = await getBlocksForTimeline(timelineId);
  const total = blocks.filter(b => !b.isRestBlock).reduce((acc, b) => acc + b.durationMinutes, 0);
  const tCol = await getTimelinesCol();
  await tCol.updateOne({ _id: new ObjectId(timelineId) }, { $set: { totalPlannedMinutes: total, updatedAt: new Date() } });
}
