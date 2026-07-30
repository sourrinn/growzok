import { dateStrOffset, toDateStr, todayStr } from "@/lib/dates";
import { isTrackableDate } from "@/lib/frequency";
import type { Habit, HabitCategory } from "@/types/habit";

export interface SuccessRate {
  completed: number;
  trackable: number;
  /** 0-1. 0 when there are no trackable days yet. */
  rate: number;
}

/** All calendar dates from `startStr` to `endStr` inclusive, oldest first. */
export function datesBetween(startStr: string, endStr: string): string[] {
  if (startStr > endStr) return [];
  const start = new Date(`${startStr}T00:00:00`);
  const end = new Date(`${endStr}T00:00:00`);
  const days: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(toDateStr(d));
  }
  return days;
}

/** Monday-start week key (the Monday's date string) for a given date. */
function weekKeyOf(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  const mondayOffset = (d.getDay() + 6) % 7; // Mon=0..Sun=6
  d.setDate(d.getDate() - mondayOffset);
  return toDateStr(d);
}

/**
 * completed/trackable days within [rangeStart, rangeEnd], clipped to the
 * habit's lifetime (creation date through today — no crediting/penalizing for
 * days before the habit existed or that haven't happened yet).
 *
 * For "timesPerWeek" habits every day is nominally trackable, but credit is
 * capped at the weekly target per Monday-start week so over-completing one
 * week doesn't inflate the rate. A week that's only partially inside the range
 * still counts its full weekly target — a reasonable approximation at the
 * range's edges.
 */
export function successRateForRange(
  habit: Habit,
  rangeStart: string,
  rangeEnd: string
): SuccessRate {
  const createdDateStr = habit.createdAt.slice(0, 10);
  const today = todayStr();
  const start = createdDateStr > rangeStart ? createdDateStr : rangeStart;
  const end = today < rangeEnd ? today : rangeEnd;
  const days = datesBetween(start, end);
  if (days.length === 0) return { completed: 0, trackable: 0, rate: 0 };

  const historySet = new Set(habit.history);

  if (habit.frequency.type === "timesPerWeek") {
    const times = habit.frequency.times;
    const completedByWeek = new Map<string, number>();
    const weeksSeen = new Set<string>();
    for (const day of days) {
      const key = weekKeyOf(day);
      weeksSeen.add(key);
      if (historySet.has(day)) {
        completedByWeek.set(key, (completedByWeek.get(key) ?? 0) + 1);
      }
    }
    let completed = 0;
    let trackable = 0;
    for (const key of weeksSeen) {
      trackable += times;
      completed += Math.min(completedByWeek.get(key) ?? 0, times);
    }
    return { completed, trackable, rate: trackable ? completed / trackable : 0 };
  }

  const trackableDays = days.filter((d) => isTrackableDate(habit.frequency, d));
  const completed = trackableDays.filter((d) => historySet.has(d)).length;
  const trackable = trackableDays.length;
  return { completed, trackable, rate: trackable ? completed / trackable : 0 };
}

/** Success rate since the habit's creation date, through today. */
export function computeSuccessRate(habit: Habit): SuccessRate {
  return successRateForRange(habit, habit.createdAt.slice(0, 10), todayStr());
}

/**
 * Consecutive trackable days completed, ending today (or yesterday if today
 * isn't done yet). Not meaningful for "timesPerWeek" habits — use
 * computeThisWeekProgress for those instead.
 */
export function computeCurrentStreak(habit: Habit): number {
  if (habit.frequency.type === "timesPerWeek") return 0;
  const set = new Set(habit.history);
  const today = todayStr();

  let offset = 0;
  if (isTrackableDate(habit.frequency, today) && !set.has(today)) offset = -1;

  let streak = 0;
  for (let i = 0; i < 3650; i++) {
    const dateStr = dateStrOffset(offset);
    if (!isTrackableDate(habit.frequency, dateStr)) {
      offset--;
      continue; // non-trackable days don't count and don't break the streak
    }
    if (!set.has(dateStr)) break;
    streak++;
    offset--;
  }
  return streak;
}

/**
 * Longest run of consecutive trackable days completed since the habit was
 * created. Not meaningful for "timesPerWeek" habits.
 */
export function computeBestStreak(habit: Habit): number {
  if (habit.frequency.type === "timesPerWeek") return 0;
  const set = new Set(habit.history);
  const createdDateStr = habit.createdAt.slice(0, 10);
  const today = todayStr();

  let best = 0;
  let current = 0;
  for (const day of datesBetween(createdDateStr, today)) {
    if (!isTrackableDate(habit.frequency, day)) continue;
    if (set.has(day)) {
      current++;
      if (current > best) best = current;
    } else {
      current = 0;
    }
  }
  return best;
}

/** For "timesPerWeek" habits, progress within the current Monday-start week. */
export function computeThisWeekProgress(
  habit: Habit
): { completed: number; target: number } | null {
  if (habit.frequency.type !== "timesPerWeek") return null;
  const set = new Set(habit.history);
  const today = todayStr();
  const weekStart = weekKeyOf(today);
  const completed = datesBetween(weekStart, today).filter((d) =>
    set.has(d)
  ).length;
  return { completed, target: habit.frequency.times };
}

export interface OnTrackStatus {
  misses: number;
  allowance: number;
  onTrack: boolean;
}

/**
 * Whether the habit is within its allowed misses (`missAllowance`) for the
 * current Monday-start week so far. Only trackable days from the start of the
 * week through yesterday count as potential misses — today isn't judged until
 * it's actually over, mirroring how a streak survives while today is pending.
 */
export function computeOnTrackStatus(habit: Habit): OnTrackStatus {
  const allowance = habit.missAllowance ?? 0;
  const set = new Set(habit.history);
  const today = todayStr();
  const weekStart = weekKeyOf(today);
  const createdDateStr = habit.createdAt.slice(0, 10);
  const start = createdDateStr > weekStart ? createdDateStr : weekStart;
  const yesterday = dateStrOffset(-1);

  const misses = datesBetween(start, yesterday).filter(
    (d) => isTrackableDate(habit.frequency, d) && !set.has(d)
  ).length;

  return { misses, allowance, onTrack: misses <= allowance };
}

export type ReportPeriod = "week" | "month" | "quarter" | "year";

export function getPeriodRange(
  period: ReportPeriod,
  today: Date = new Date()
): { start: string; end: string; label: string } {
  const end = toDateStr(today);
  let start: Date;
  let label: string;

  switch (period) {
    case "week": {
      start = new Date(today);
      start.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      label = "This week";
      break;
    }
    case "month": {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      label = today.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
      break;
    }
    case "quarter": {
      const q = Math.floor(today.getMonth() / 3);
      start = new Date(today.getFullYear(), q * 3, 1);
      label = `Q${q + 1} ${today.getFullYear()}`;
      break;
    }
    case "year": {
      start = new Date(today.getFullYear(), 0, 1);
      label = `${today.getFullYear()}`;
      break;
    }
  }

  return { start: toDateStr(start), end, label };
}

export interface CategoryStat {
  category: HabitCategory;
  completed: number;
  trackable: number;
  rate: number;
}

export interface Report {
  label: string;
  completed: number;
  trackable: number;
  missed: number;
  rate: number;
  topHabit: { habit: Habit; rate: number } | null;
  weakestHabit: { habit: Habit; rate: number } | null;
  categories: CategoryStat[];
}

export function buildReport(habits: Habit[], period: ReportPeriod): Report {
  const { start, end, label } = getPeriodRange(period);

  let completed = 0;
  let trackable = 0;
  let topHabit: { habit: Habit; rate: number } | null = null;
  let weakestHabit: { habit: Habit; rate: number } | null = null;
  const categoryTotals = new Map<HabitCategory, { completed: number; trackable: number }>();

  for (const habit of habits) {
    const sr = successRateForRange(habit, start, end);
    completed += sr.completed;
    trackable += sr.trackable;

    if (sr.trackable > 0) {
      if (!topHabit || sr.rate > topHabit.rate) topHabit = { habit, rate: sr.rate };
      if (!weakestHabit || sr.rate < weakestHabit.rate) {
        weakestHabit = { habit, rate: sr.rate };
      }
    }

    const totals = categoryTotals.get(habit.category) ?? { completed: 0, trackable: 0 };
    totals.completed += sr.completed;
    totals.trackable += sr.trackable;
    categoryTotals.set(habit.category, totals);
  }

  const categories: CategoryStat[] = Array.from(categoryTotals.entries())
    .map(([category, t]) => ({
      category,
      completed: t.completed,
      trackable: t.trackable,
      rate: t.trackable ? t.completed / t.trackable : 0,
    }))
    .sort((a, b) => b.rate - a.rate);

  return {
    label,
    completed,
    trackable,
    missed: trackable - completed,
    rate: trackable ? completed / trackable : 0,
    topHabit,
    weakestHabit,
    categories,
  };
}
