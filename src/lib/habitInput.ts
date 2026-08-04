import {
  DEFAULT_DOMAIN,
  DEFAULT_FREQUENCY,
  DEFAULT_USER_LABEL,
  HABIT_CATEGORIES,
  HABIT_DOMAINS,
  type HabitCategory,
  type HabitDomain,
  type HabitFrequency,
  type HabitTarget,
  type HabitTargetType,
} from "@/types/habit";

/** Shared, lenient parsing for untrusted request bodies — invalid input falls
 * back to a sane default rather than erroring, mirroring the existing color
 * validation in the habits API. */

export function parseCategory(value: unknown): HabitCategory {
  return typeof value === "string" &&
    (HABIT_CATEGORIES as string[]).includes(value)
    ? (value as HabitCategory)
    : "Personal";
}

export function parseDomain(value: unknown): HabitDomain {
  return typeof value === "string" &&
    (HABIT_DOMAINS as string[]).includes(value)
    ? (value as HabitDomain)
    : DEFAULT_DOMAIN;
}

export function parseUserLabel(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_USER_LABEL;
  const trimmed = value.trim().slice(0, 30);
  return trimmed || DEFAULT_USER_LABEL;
}

export function parseFrequency(value: unknown): HabitFrequency {
  if (typeof value !== "object" || value === null) return DEFAULT_FREQUENCY;
  const v = value as Record<string, unknown>;

  if (v.type === "daily" || v.type === "weekdays" || v.type === "weekends") {
    return { type: v.type };
  }
  if (v.type === "timesPerWeek") {
    const times = Number(v.times);
    if (Number.isInteger(times) && times >= 1 && times <= 7) {
      return { type: "timesPerWeek", times };
    }
  }
  if (v.type === "custom") {
    const raw = Array.isArray(v.days) ? v.days : [];
    const days = Array.from(
      new Set(
        raw
          .map((d) => Number(d))
          .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6)
      )
    );
    if (days.length > 0) return { type: "custom", days };
  }
  return DEFAULT_FREQUENCY;
}

const TARGET_TYPES: HabitTargetType[] = ["count", "time", "distance", "currency"];

export function parseTarget(value: unknown): HabitTarget | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (!TARGET_TYPES.includes(v.type as HabitTargetType)) return null;

  const goal = Number(v.goal);
  if (!Number.isFinite(goal) || goal <= 0) return null;

  const unit = typeof v.unit === "string" ? v.unit.trim().slice(0, 20) : "";
  return { type: v.type as HabitTargetType, goal, unit };
}

export function parseMissAllowance(value: unknown): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) return 0;
  return Math.min(n, 7);
}
