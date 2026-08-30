import type { ObjectId } from "mongodb";

export type BuiltInNodeCategory = "optimistic" | "detailed" | "image" | "action";
export type NodeCategory = BuiltInNodeCategory | (string & {});

export interface CanvasNode {
  id: string;
  category: NodeCategory;
  title?: string;
  content: string;
  mediaUrl?: string;
  isCompleted?: boolean;
  metadata?: Record<string, any>;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CanvasConnector {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  color?: string;
  createdAt: string;
}

export interface NoteSessionDoc {
  _id: ObjectId;
  userId: string;
  title: string;
  nodes: CanvasNode[];
  connectors: CanvasConnector[];
  isPinned: boolean;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteSession {
  id: string;
  userId: string;
  title: string;
  nodes: CanvasNode[];
  connectors: CanvasConnector[];
  isPinned: boolean;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export function serializeNoteSession(doc: NoteSessionDoc): NoteSession {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    title: doc.title || "Untitled Session",
    nodes: Array.isArray(doc.nodes) ? doc.nodes : [],
    connectors: Array.isArray(doc.connectors) ? doc.connectors : [],
    isPinned: Boolean(doc.isPinned),
    status: doc.status || "active",
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
  };
}
