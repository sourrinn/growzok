import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { type Insight, type InsightDoc, type ReflectionNote, type ReflectionNoteDoc, serializeInsight, serializeReflectionNote } from "@/types/reflection";

const NOTES_COLLECTION = "reflection_notes";
const INSIGHTS_COLLECTION = "insights";

async function notesCollection() {
  const db = await getDb();
  return db.collection<ReflectionNoteDoc>(NOTES_COLLECTION);
}

async function insightsCollection() {
  const db = await getDb();
  return db.collection<InsightDoc>(INSIGHTS_COLLECTION);
}

export async function getOrCreateReflection(userId: string, date: string, period: "daily" | "weekly" = "daily"): Promise<ReflectionNote> {
  const col = await notesCollection();
  const existing = await col.findOne({ userId, date, period });
  if (existing) return serializeReflectionNote(existing);
  
  const doc: ReflectionNoteDoc = {
    _id: new ObjectId(),
    userId,
    date,
    period,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await col.insertOne(doc);
  return serializeReflectionNote(doc);
}

export async function saveReflection(userId: string, date: string, fields: Partial<ReflectionNoteDoc>): Promise<ReflectionNote> {
  const col = await notesCollection();
  const updateDoc = { ...fields, updatedAt: new Date() };
  delete updateDoc._id;
  delete updateDoc.userId;
  delete updateDoc.date;
  
  const updated = await col.findOneAndUpdate(
    { userId, date, period: fields.period ?? "daily" },
    { $set: updateDoc },
    { returnDocument: "after", upsert: true }
  );
  return serializeReflectionNote(updated!);
}

export async function getInsights(userId: string): Promise<Insight[]> {
  const col = await insightsCollection();
  const docs = await col.find({ userId, appliedAt: { $exists: false } }).sort({ createdAt: -1 }).toArray();
  return docs.map(serializeInsight);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateInsights(userId: string, habits: any[], logs: any[]): Promise<Insight[]> {
  // Stub for L5 heuristic engine
  return [];
}

export async function applyInsight(userId: string, insightId: string): Promise<boolean> {
  if (!ObjectId.isValid(insightId)) return false;
  const col = await insightsCollection();
  const res = await col.updateOne(
    { _id: new ObjectId(insightId), userId },
    { $set: { appliedAt: new Date() } }
  );
  return res.modifiedCount === 1;
}

export async function dismissInsight(userId: string, insightId: string): Promise<boolean> {
  if (!ObjectId.isValid(insightId)) return false;
  const col = await insightsCollection();
  const res = await col.deleteOne({ _id: new ObjectId(insightId), userId });
  return res.deletedCount === 1;
}
