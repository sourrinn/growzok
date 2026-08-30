import type { ObjectId } from "mongodb";

export type NoteStatus = "active" | "archived";

export interface NoteDoc {
  _id: ObjectId;
  userId: string;
  title?: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  status: NoteStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  userId: string;
  title?: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  status: NoteStatus;
  createdAt: string;
  updatedAt: string;
}

export function serializeNote(doc: NoteDoc): Note {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    title: doc.title || "",
    content: doc.content || "",
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    isPinned: Boolean(doc.isPinned),
    status: doc.status || "active",
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
  };
}
