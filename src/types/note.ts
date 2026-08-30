import type { ObjectId } from "mongodb";

export type RoughNoteStatus = "raw" | "planned" | "archived";

export interface RoughNoteDoc {
  _id: ObjectId;
  userId: string;
  content: string;
  status: RoughNoteStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoughNote {
  id: string;
  userId: string;
  content: string;
  status: RoughNoteStatus;
  createdAt: string;
  updatedAt: string;
}

export function serializeRoughNote(doc: RoughNoteDoc): RoughNote {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    content: doc.content,
    status: doc.status || "raw",
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
  };
}
