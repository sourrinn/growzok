import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { type Session, type SessionDoc, type SessionStatus, type TimerMode, serializeSession } from "@/types/session";
import { createLogFromSession } from "./executionLogs";

const COLLECTION = "sessions";

async function collection() {
  const db = await getDb();
  return db.collection<SessionDoc>(COLLECTION);
}

export async function getActiveSession(userId: string): Promise<Session | null> {
  const col = await collection();
  const doc = await col.findOne({ userId, status: "in_progress" });
  return doc ? serializeSession(doc) : null;
}

export async function startSession(
  userId: string,
  habitId: string,
  blockId: string | undefined,
  timerMode: TimerMode,
  plannedDurationSeconds: number
): Promise<Session> {
  const col = await collection();
  const existing = await getActiveSession(userId);
  if (existing) {
    throw new Error("Active session already exists");
  }

  const doc: SessionDoc = {
    _id: new ObjectId(),
    userId,
    habitId,
    blockId,
    status: "in_progress",
    timerMode,
    plannedDurationSeconds,
    startedAt: new Date(),
    checkIns: [],
    struggleCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await col.insertOne(doc);
  return serializeSession(doc);
}

export async function recordCheckIn(userId: string, sessionId: string, confirmed: boolean): Promise<Session | null> {
  if (!ObjectId.isValid(sessionId)) return null;
  const col = await collection();
  const updated = await col.findOneAndUpdate(
    { _id: new ObjectId(sessionId), userId },
    { 
      $push: { checkIns: { at: new Date(), confirmed } },
      $set: { updatedAt: new Date() } 
    },
    { returnDocument: "after" }
  );
  return updated ? serializeSession(updated) : null;
}

export async function extendSession(userId: string, sessionId: string, extraSeconds: number): Promise<Session | null> {
  if (!ObjectId.isValid(sessionId)) return null;
  const col = await collection();
  const updated = await col.findOneAndUpdate(
    { _id: new ObjectId(sessionId), userId },
    { 
      $inc: { plannedDurationSeconds: extraSeconds, struggleCount: 1 },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: "after" }
  );
  return updated ? serializeSession(updated) : null;
}

export async function closeSession(
  userId: string, 
  sessionId: string, 
  status: SessionStatus, 
  opts?: {skipReason?: string, interruptReason?: string, effortRating?: number, note?: string, actualDurationSeconds?: number}
): Promise<Session | null> {
  if (!ObjectId.isValid(sessionId)) return null;
  const col = await collection();
  const session = await col.findOne({ _id: new ObjectId(sessionId), userId });
  if (!session) return null;

  const actualDurationSeconds = opts?.actualDurationSeconds ?? 
    (session.startedAt ? Math.floor((Date.now() - session.startedAt.getTime()) / 1000) : 0);

  const updateDoc: Partial<SessionDoc> = {
    status,
    actualDurationSeconds,
    completedAt: new Date(),
    updatedAt: new Date(),
    skipReason: opts?.skipReason,
    interruptReason: opts?.interruptReason,
    effortRating: opts?.effortRating,
    note: opts?.note,
  };

  const updated = await col.findOneAndUpdate(
    { _id: new ObjectId(sessionId), userId },
    { $set: updateDoc },
    { returnDocument: "after" }
  );
  
  if (updated) {
    if (["completed", "skipped", "interrupted"].includes(status)) {
      await createLogFromSession(updated);
    }
    return serializeSession(updated);
  }
  return null;
}

export async function getSession(userId: string, sessionId: string): Promise<Session | null> {
  if (!ObjectId.isValid(sessionId)) return null;
  const col = await collection();
  const doc = await col.findOne({ _id: new ObjectId(sessionId), userId });
  return doc ? serializeSession(doc) : null;
}

export function detectStruggle(session: Session): boolean {
  return session.struggleCount > 2 || session.checkIns.filter(c => !c.confirmed).length >= 2;
}
