import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { type Node, type NodeDoc, type NodeKind, type NodeStatus, serializeNode } from "@/types/node";

const COLLECTION = "nodes";

async function collection() {
  const db = await getDb();
  return db.collection<NodeDoc>(COLLECTION);
}

export async function getNodes(userId: string, status?: NodeStatus): Promise<Node[]> {
  const col = await collection();
  const filter: Record<string, unknown> = { userId };
  if (status) filter.status = status;
  const docs = await col.find(filter).sort({ createdAt: -1 }).toArray();
  return docs.map(serializeNode);
}

export async function getActiveNodeCount(userId: string): Promise<number> {
  const col = await collection();
  return col.countDocuments({ userId, status: "active" });
}

export async function createNode(userId: string, data: { title: string; kind: NodeKind; description?: string; priority?: number }): Promise<Node> {
  const col = await collection();
  const doc: NodeDoc = {
    _id: new ObjectId(),
    userId,
    title: data.title,
    kind: data.kind,
    description: data.description,
    priority: data.priority ?? 3,
    status: "draft",
    linkedHabitIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await col.insertOne(doc);
  return serializeNode(doc);
}

export async function updateNode(userId: string, id: string, patch: Partial<NodeDoc>): Promise<Node | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await collection();
  
  const updateDoc: any = { ...patch, updatedAt: new Date() };
  if (patch.status === "active") {
    updateDoc.activatedAt = new Date();
  }
  
  const updated = await col.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: updateDoc },
    { returnDocument: "after" }
  );
  return updated ? serializeNode(updated) : null;
}

export async function archiveNode(userId: string, id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await collection();
  const updated = await col.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: { status: "archived", updatedAt: new Date() } }
  );
  return !!updated;
}
