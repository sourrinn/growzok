import type { ObjectId } from "mongodb";

export type InsightType =
  | "skip_pattern"
  | "timing_suggestion"
  | "streak_risk"
  | "energy_mismatch"
  | "overload_warning";

/** Which layer an insight targets for adaptation. */
export type InsightTargetLayer = "L1" | "L2";

/**
 * L5 system-generated pattern insight.
 * Created by the heuristic engine, surfaced to the user in /reflect.
 */
export interface InsightDoc {
  _id: ObjectId;
  userId: string;
  type: InsightType;
  /** The habit implicated by this insight (if applicable). */
  habitId?: string;
  /** Human-readable finding: "You skip Stretch 4 of 5 afternoons." */
  message: string;
  /** Actionable suggestion: "Move Stretch to your morning block." */
  suggestion: string;
  targetLayer: InsightTargetLayer;
  /** Mutation payload — a JSON patch the system can apply to L1 or L2 on "Apply" click. */
  mutationPayload?: Record<string, unknown>;
  /** When the user clicked "Apply". Null = pending. */
  appliedAt?: Date;
  /** When to show this insight again (spaced repetition). */
  showAgainAt?: Date;
  createdAt: Date;
}

/** JSON-safe client shape. */
export interface Insight {
  id: string;
  type: InsightType;
  habitId?: string;
  message: string;
  suggestion: string;
  targetLayer: InsightTargetLayer;
  appliedAt?: string;
  showAgainAt?: string;
  createdAt: string;
}

export function serializeInsight(doc: InsightDoc): Insight {
  return {
    id: doc._id.toString(),
    type: doc.type,
    habitId: doc.habitId,
    message: doc.message,
    suggestion: doc.suggestion,
    targetLayer: doc.targetLayer,
    appliedAt: doc.appliedAt?.toISOString(),
    showAgainAt: doc.showAgainAt?.toISOString(),
    createdAt: doc.createdAt.toISOString(),
  };
}

/** L5 user-authored reflection for a specific day or week. */
export interface ReflectionNoteDoc {
  _id: ObjectId;
  userId: string;
  /** 'YYYY-MM-DD' */
  date: string;
  period: "daily" | "weekly";
  whatWorked?: string;
  whatDidnt?: string;
  tomorrowChange?: string;
  /** 1–5 subjective mood rating. */
  moodRating?: number;
  /** 1–5 subjective energy rating. */
  energyRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

/** JSON-safe client shape. */
export interface ReflectionNote {
  id: string;
  date: string;
  period: "daily" | "weekly";
  whatWorked?: string;
  whatDidnt?: string;
  tomorrowChange?: string;
  moodRating?: number;
  energyRating?: number;
  createdAt: string;
  updatedAt: string;
}

export function serializeReflectionNote(doc: ReflectionNoteDoc): ReflectionNote {
  return {
    id: doc._id.toString(),
    date: doc.date,
    period: doc.period,
    whatWorked: doc.whatWorked,
    whatDidnt: doc.whatDidnt,
    tomorrowChange: doc.tomorrowChange,
    moodRating: doc.moodRating,
    energyRating: doc.energyRating,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

/** Auto-generated daily summary — computed, not stored. */
export interface DailySummary {
  date: string;
  totalHabits: number;
  completed: number;
  skipped: number;
  interrupted: number;
  strongestBlock?: string;
  weakestBlock?: string;
  totalActiveMinutes: number;
  /** Natural language summary sentence. */
  headline: string;
}
