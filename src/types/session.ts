import type { ObjectId } from "mongodb";

export type SessionStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "skipped"
  | "interrupted";

export type TimerMode = "countdown" | "countup";

export interface CheckIn {
  at: string; // ISO string
  confirmed: boolean;
}

/** L3 Active Execution session. One at a time per user. */
export interface SessionDoc {
  _id: ObjectId;
  userId: string;
  habitId: string;
  /** Which L2 block started this session (optional). */
  blockId?: string;
  status: SessionStatus;
  timerMode: TimerMode;
  /** Target duration in seconds (used in countdown mode). */
  plannedDurationSeconds: number;
  /** Actual elapsed seconds when session closes. */
  actualDurationSeconds?: number;
  startedAt?: Date;
  completedAt?: Date;
  /** Reason if status is 'skipped'. */
  skipReason?: string;
  /** Reason if status is 'interrupted'. */
  interruptReason?: string;
  /** Timestamped check-in log. */
  checkIns: { at: Date; confirmed: boolean }[];
  /** How many times the timer was extended (struggle indicator). */
  struggleCount: number;
  /** Post-completion effort rating, 1–5. */
  effortRating?: number;
  /** Post-completion micro-journal entry (max 280 chars). */
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** JSON-safe client shape for a session. */
export interface Session {
  id: string;
  habitId: string;
  blockId?: string;
  status: SessionStatus;
  timerMode: TimerMode;
  plannedDurationSeconds: number;
  actualDurationSeconds?: number;
  startedAt?: string;
  completedAt?: string;
  skipReason?: string;
  interruptReason?: string;
  checkIns: CheckIn[];
  struggleCount: number;
  effortRating?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
  /** Computed: elapsed seconds since startedAt (if in_progress). */
  elapsedSeconds: number;
}

export function serializeSession(doc: SessionDoc): Session {
  const elapsedSeconds =
    doc.status === "in_progress" && doc.startedAt
      ? Math.floor((Date.now() - doc.startedAt.getTime()) / 1000)
      : (doc.actualDurationSeconds ?? 0);

  return {
    id: doc._id.toString(),
    habitId: doc.habitId,
    blockId: doc.blockId,
    status: doc.status,
    timerMode: doc.timerMode,
    plannedDurationSeconds: doc.plannedDurationSeconds,
    actualDurationSeconds: doc.actualDurationSeconds,
    startedAt: doc.startedAt?.toISOString(),
    completedAt: doc.completedAt?.toISOString(),
    skipReason: doc.skipReason,
    interruptReason: doc.interruptReason,
    checkIns: (doc.checkIns ?? []).map((c) => ({
      at: c.at.toISOString(),
      confirmed: c.confirmed,
    })),
    struggleCount: doc.struggleCount ?? 0,
    effortRating: doc.effortRating,
    note: doc.note,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    elapsedSeconds,
  };
}
