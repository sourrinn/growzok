import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  type RoughNote,
  type RoughNoteDoc,
  type RoughNoteStatus,
  serializeRoughNote,
} from "@/types/note";

const COLLECTION = "rough_notes";

async function collection() {
  const db = await getDb();
  return db.collection<RoughNoteDoc>(COLLECTION);
}

export async function listRoughNotes(
  userId: string,
  statusFilter?: RoughNoteStatus
): Promise<RoughNote[]> {
  const col = await collection();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = { userId };
  if (statusFilter) {
    query.status = statusFilter;
  }
  const docs = await col.find(query).sort({ createdAt: -1 }).toArray();
  return docs.map(serializeRoughNote);
}

export async function createRoughNote(
  userId: string,
  content: string
): Promise<RoughNote> {
  const col = await collection();
  const now = new Date();
  const doc: Omit<RoughNoteDoc, "_id"> = {
    userId,
    content: content.trim(),
    status: "raw",
    createdAt: now,
    updatedAt: now,
  };
  const res = await col.insertOne(doc as RoughNoteDoc);
  return serializeRoughNote({ ...doc, _id: res.insertedId });
}

export async function updateRoughNote(
  userId: string,
  noteId: string,
  content: string
): Promise<RoughNote | null> {
  const col = await collection();
  const now = new Date();
  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(noteId), userId },
    { $set: { content: content.trim(), updatedAt: now } },
    { returnDocument: "after" }
  );
  return res ? serializeRoughNote(res) : null;
}

export async function updateRoughNoteStatus(
  userId: string,
  noteId: string,
  status: RoughNoteStatus
): Promise<RoughNote | null> {
  const col = await collection();
  const now = new Date();
  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(noteId), userId },
    { $set: { status, updatedAt: now } },
    { returnDocument: "after" }
  );
  return res ? serializeRoughNote(res) : null;
}

export async function deleteRoughNote(
  userId: string,
  noteId: string
): Promise<boolean> {
  const col = await collection();
  const res = await col.deleteOne({ _id: new ObjectId(noteId), userId });
  return res.deletedCount > 0;
}
