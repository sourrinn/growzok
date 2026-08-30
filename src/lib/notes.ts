import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  type CanvasConnector,
  type CanvasNode,
  type NoteSession,
  type NoteSessionDoc,
  serializeNoteSession,
} from "@/types/note";

const COLLECTION = "note_sessions";

async function collection() {
  const db = await getDb();
  return db.collection<NoteSessionDoc>(COLLECTION);
}

// List sessions for the left sidebar
export async function listSessions(
  userId: string,
  options: { status?: "active" | "archived"; search?: string } = {}
): Promise<NoteSession[]> {
  const col = await collection();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = { userId };

  query.status = options.status || "active";

  if (options.search && options.search.trim()) {
    const s = options.search.trim();
    query.$or = [
      { title: { $regex: s, $options: "i" } },
      { "nodes.content": { $regex: s, $options: "i" } },
      { "nodes.title": { $regex: s, $options: "i" } },
    ];
  }

  const docs = await col
    .find(query)
    .sort({ isPinned: -1, updatedAt: -1 })
    .toArray();

  return docs.map(serializeNoteSession);
}

// Create a new session thread
export async function createSession(
  userId: string,
  title?: string,
  initialContent?: string
): Promise<NoteSession> {
  const col = await collection();
  const now = new Date();

  const initialNodes: CanvasNode[] = initialContent
    ? [
        {
          id: new ObjectId().toString(),
          category: "optimistic",
          title: "",
          content: initialContent.trim(),
          position: { x: 50, y: 50 },
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ]
    : [];

  const doc: Omit<NoteSessionDoc, "_id"> = {
    userId,
    title: title?.trim() || "Untitled Session",
    nodes: initialNodes,
    connectors: [],
    isPinned: false,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  const res = await col.insertOne(doc as NoteSessionDoc);
  return serializeNoteSession({ ...doc, _id: res.insertedId });
}

// Fetch a single session by ID
export async function getSession(
  userId: string,
  sessionId: string
): Promise<NoteSession | null> {
  const col = await collection();
  const doc = await col.findOne({ _id: new ObjectId(sessionId), userId });
  return doc ? serializeNoteSession(doc) : null;
}

// Update session title, pin, or status
export async function updateSession(
  userId: string,
  sessionId: string,
  patch: { title?: string; isPinned?: boolean; status?: "active" | "archived" }
): Promise<NoteSession | null> {
  const col = await collection();
  const now = new Date();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { updatedAt: now };
  if (patch.title !== undefined) updateData.title = patch.title.trim();
  if (patch.isPinned !== undefined) updateData.isPinned = Boolean(patch.isPinned);
  if (patch.status !== undefined) updateData.status = patch.status;

  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(sessionId), userId },
    { $set: updateData },
    { returnDocument: "after" }
  );

  return res ? serializeNoteSession(res) : null;
}

// Delete session
export async function deleteSession(
  userId: string,
  sessionId: string
): Promise<boolean> {
  const col = await collection();
  const res = await col.deleteOne({ _id: new ObjectId(sessionId), userId });
  return res.deletedCount > 0;
}

// Node CRUD within session
export async function addNodeToSession(
  userId: string,
  sessionId: string,
  nodeData: Omit<CanvasNode, "id" | "createdAt" | "updatedAt">
): Promise<NoteSession | null> {
  const col = await collection();
  const now = new Date();
  const newNode: CanvasNode = {
    ...nodeData,
    id: new ObjectId().toString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(sessionId), userId },
    {
      $push: { nodes: newNode },
      $set: { updatedAt: now },
    },
    { returnDocument: "after" }
  );

  return res ? serializeNoteSession(res) : null;
}

export async function updateNodeInSession(
  userId: string,
  sessionId: string,
  nodeId: string,
  patch: Partial<Omit<CanvasNode, "id" | "createdAt" | "updatedAt">>
): Promise<NoteSession | null> {
  const col = await collection();
  const now = new Date();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFields: any = { updatedAt: now };

  Object.entries(patch).forEach(([key, val]) => {
    if (val !== undefined) {
      setFields[`nodes.$[elem].${key}`] = val;
    }
  });

  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(sessionId), userId },
    { $set: setFields },
    {
      arrayFilters: [{ "elem.id": nodeId }],
      returnDocument: "after",
    }
  );

  return res ? serializeNoteSession(res) : null;
}

export async function deleteNodeFromSession(
  userId: string,
  sessionId: string,
  nodeId: string
): Promise<NoteSession | null> {
  const col = await collection();
  const now = new Date();

  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(sessionId), userId },
    {
      $pull: {
        nodes: { id: nodeId },
        connectors: { $or: [{ fromNodeId: nodeId }, { toNodeId: nodeId }] },
      } as any,
      $set: { updatedAt: now },
    },
    { returnDocument: "after" }
  );

  return res ? serializeNoteSession(res) : null;
}

// Connector CRUD within session
export async function addConnectorToSession(
  userId: string,
  sessionId: string,
  connectorData: Omit<CanvasConnector, "id" | "createdAt">
): Promise<NoteSession | null> {
  const col = await collection();
  const now = new Date();
  const newConnector: CanvasConnector = {
    ...connectorData,
    id: new ObjectId().toString(),
    createdAt: now.toISOString(),
  };

  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(sessionId), userId },
    {
      $push: { connectors: newConnector },
      $set: { updatedAt: now },
    },
    { returnDocument: "after" }
  );

  return res ? serializeNoteSession(res) : null;
}

export async function deleteConnectorFromSession(
  userId: string,
  sessionId: string,
  connectorId: string
): Promise<NoteSession | null> {
  const col = await collection();
  const now = new Date();

  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(sessionId), userId },
    {
      $pull: { connectors: { id: connectorId } } as any,
      $set: { updatedAt: now },
    },
    { returnDocument: "after" }
  );

  return res ? serializeNoteSession(res) : null;
}
