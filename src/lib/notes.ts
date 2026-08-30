import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  type Note,
  type NoteDoc,
  type NoteStatus,
  serializeNote,
} from "@/types/note";

const COLLECTION = "rough_notes";

async function collection() {
  const db = await getDb();
  return db.collection<NoteDoc>(COLLECTION);
}

export async function listNotes(
  userId: string,
  options: { status?: NoteStatus; search?: string; tag?: string } = {}
): Promise<Note[]> {
  const col = await collection();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = { userId };

  if (options.status) {
    query.status = options.status;
  } else {
    query.status = "active";
  }

  if (options.tag) {
    query.tags = options.tag;
  }

  if (options.search && options.search.trim()) {
    const s = options.search.trim();
    query.$or = [
      { content: { $regex: s, $options: "i" } },
      { title: { $regex: s, $options: "i" } },
      { tags: { $regex: s, $options: "i" } },
    ];
  }

  const docs = await col
    .find(query)
    .sort({ isPinned: -1, createdAt: -1 })
    .toArray();
  return docs.map(serializeNote);
}

export async function createNote(
  userId: string,
  data: { content: string; title?: string; tags?: string[] }
): Promise<Note> {
  const col = await collection();
  const now = new Date();

  // Extract hashtags from content if not explicitly provided
  const extractedTags =
    data.tags && data.tags.length > 0
      ? data.tags
      : (data.content.match(/#[\w-]+/g) || []).map((t) => t.slice(1).toLowerCase());

  const doc: Omit<NoteDoc, "_id"> = {
    userId,
    title: data.title?.trim() || "",
    content: data.content.trim(),
    tags: Array.from(new Set(extractedTags)),
    isPinned: false,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  const res = await col.insertOne(doc as NoteDoc);
  return serializeNote({ ...doc, _id: res.insertedId });
}

export async function updateNote(
  userId: string,
  noteId: string,
  patch: { content?: string; title?: string; tags?: string[]; isPinned?: boolean; status?: NoteStatus }
): Promise<Note | null> {
  const col = await collection();
  const now = new Date();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { updatedAt: now };

  if (patch.content !== undefined) updateData.content = patch.content.trim();
  if (patch.title !== undefined) updateData.title = patch.title.trim();
  if (patch.tags !== undefined) updateData.tags = patch.tags;
  if (patch.isPinned !== undefined) updateData.isPinned = Boolean(patch.isPinned);
  if (patch.status !== undefined) updateData.status = patch.status;

  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(noteId), userId },
    { $set: updateData },
    { returnDocument: "after" }
  );

  return res ? serializeNote(res) : null;
}

export async function togglePinNote(
  userId: string,
  noteId: string
): Promise<Note | null> {
  const col = await collection();
  const doc = await col.findOne({ _id: new ObjectId(noteId), userId });
  if (!doc) return null;

  const now = new Date();
  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(noteId), userId },
    { $set: { isPinned: !doc.isPinned, updatedAt: now } },
    { returnDocument: "after" }
  );

  return res ? serializeNote(res) : null;
}

export async function deleteNote(
  userId: string,
  noteId: string
): Promise<boolean> {
  const col = await collection();
  const res = await col.deleteOne({ _id: new ObjectId(noteId), userId });
  return res.deletedCount > 0;
}
