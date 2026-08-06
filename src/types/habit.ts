import type { ObjectId } from "mongodb";

export type HabitCategory =
  | "Health"
  | "Fitness"
  | "Learning"
  | "Finance"
  | "Productivity"
  | "Personal";

export const HABIT_CATEGORIES: HabitCategory[] = [
  "Health",
  "Fitness",
  "Learning",
  "Finance",
  "Productivity",
  "Personal",
];

export type HabitDomain =
  | "Sleep"
  | "Hydration"
  | "Nutrition"
  | "Cardio"
  | "Strength"
  | "Mobility"
  | "Breathing"
  | "Grooming"
  | "Preventive"
  | "Recovery"
  | "Productivity"
  | "Finance"
  | "Social"
  | "Learning"
  | "Digital Minimalism"
  | "Gut Health";

export const HABIT_DOMAINS: HabitDomain[] = [
  "Sleep",
  "Hydration",
  "Nutrition",
  "Cardio",
  "Strength",
  "Mobility",
  "Breathing",
  "Grooming",
  "Preventive",
  "Recovery",
  "Productivity",
  "Finance",
  "Social",
  "Learning",
  "Digital Minimalism",
  "Gut Health",
];

export type HabitFrequency =
  | { type: "daily" }
  | { type: "weekdays" }
  | { type: "weekends" }
  | { type: "timesPerWeek"; times: number }
  /** Specific days of the week. `days`: 0=Sun..6=Sat, non-empty, unique. */
  | { type: "custom"; days: number[] };

export const DEFAULT_CATEGORY: HabitCategory = "Personal";
export const DEFAULT_USER_LABEL: string = "Personal";
export const DEFAULT_DOMAIN: HabitDomain = "Productivity";
export const DEFAULT_FREQUENCY: HabitFrequency = { type: "daily" };

export type HabitTargetType = "count" | "time" | "distance" | "currency";

/** A daily numeric goal (e.g. "8 glasses of water"). Optional — most habits are binary. */
export interface HabitTarget {
  type: HabitTargetType;
  goal: number;
  /** Freeform unit label, e.g. "glasses", "minutes", "km", "$". */
  unit: string;
}

/** One logged completion, for completion-time analytics. */
export interface Completion {
  date: string;
  completedAt: string;
}

/** Infer domain for legacy MongoDB documents that only have a category */
export function inferDomainFromCategory(cat?: string): HabitDomain {
  switch (cat) {
    case "Health":
      return "Hydration";
    case "Fitness":
      return "Cardio";
    case "Learning":
      return "Learning";
    case "Finance":
      return "Finance";
    case "Productivity":
      return "Productivity";
    default:
      return "Productivity";
  }
}

/** Shape stored in MongoDB. */
export interface HabitDoc {
  _id: ObjectId;
  /** Owner's user id. Every query is scoped by this. */
  userId: string;
  name: string;
  color: string;
  category?: HabitCategory;
  userLabel?: string;
  domain?: HabitDomain;
  templateKey?: string;
  habitKey?: string;
  frequency: HabitFrequency;
  /** Allowed misses per Monday-start week before the habit reads as "off track". 0 = strict. */
  missAllowance: number;
  target: HabitTarget | null;
  /** Logged numeric value per date, only meaningful when `target` is set. */
  progress: Record<string, number>;
  createdAt: Date;
  /** Completed days as 'YYYY-MM-DD' strings. */
  history: string[];
  completions: { date: string; completedAt: Date }[];
}

/** Shape sent to the client (JSON-safe). Deliberately omits `userId`. */
export interface Habit {
  id: string;
  name: string;
  color: string;
  category: HabitCategory;
  userLabel: string;
  domain: HabitDomain;
  templateKey?: string;
  habitKey?: string;
  frequency: HabitFrequency;
  missAllowance: number;
  target: HabitTarget | null;
  progress: Record<string, number>;
  createdAt: string;
  history: string[];
  completions: Completion[];
}

export function serializeHabit(doc: HabitDoc): Habit {
  const category = doc.category ?? DEFAULT_CATEGORY;
  const userLabel = doc.userLabel ?? doc.category ?? DEFAULT_USER_LABEL;
  const domain = doc.domain ?? inferDomainFromCategory(doc.category);

  return {
    id: doc._id.toString(),
    name: doc.name,
    color: doc.color,
    category,
    userLabel,
    domain,
    templateKey: doc.templateKey,
    habitKey: doc.habitKey,
    frequency: doc.frequency ?? DEFAULT_FREQUENCY,
    missAllowance: doc.missAllowance ?? 0,
    target: doc.target ?? null,
    progress: doc.progress ?? {},
    createdAt: doc.createdAt.toISOString(),
    history: doc.history ?? [],
    completions: (doc.completions ?? []).map((c) => ({
      date: c.date,
      completedAt: c.completedAt.toISOString(),
    })),
  };
}
