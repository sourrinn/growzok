import type { ObjectId } from "mongodb";

export type LogStatus = "completed" | "skipped" | "interrupted";

/**
 * L4 Passive Tracking — auto-created from a closed L3 session.
 * The user never writes to this collection directly.
 */
export interface ExecutionLogDoc {
  _id: ObjectId;
  userId: string;
  habitId: string;
  /** The L3 session that produced this log. */
  sessionId: string;
  /** 'YYYY-MM-DD' of the execution day. */
  date: string;
  status: LogStatus;
  durationSeconds: number;
  effortRating?: number;
  note?: string;
  createdAt: Date;
}

/** JSON-safe client shape. */
export interface ExecutionLog {
  id: string;
  habitId: string;
  sessionId: string;
  date: string;
  status: LogStatus;
  durationSeconds: number;
  effortRating?: number;
  note?: string;
  createdAt: string;
}

export function serializeExecutionLog(doc: ExecutionLogDoc): ExecutionLog {
  return {
    id: doc._id.toString(),
    habitId: doc.habitId,
    sessionId: doc.sessionId,
    date: doc.date,
    status: doc.status,
    durationSeconds: doc.durationSeconds,
    effortRating: doc.effortRating,
    note: doc.note,
    createdAt: doc.createdAt.toISOString(),
  };
}

/** System-computed metrics — derived from logs, never stored. */
export interface DerivedMetrics {
  /** "Monday", "Tuesday", etc. */
  mostConsistentDay: string;
  /** habit ID that was skipped most often. */
  mostSkippedHabitId: string | null;
  /** 0–23 hour of day where completions cluster. */
  avgCompletionHour: number;
  /**
   * 0–100: fraction of completions that happened in a block matching the
   * habit's suggested time-of-day (peak energy alignment).
   */
  energyAlignmentScore: number;
}
