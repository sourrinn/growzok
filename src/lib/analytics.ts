import { dateStrOffset, toDateStr, todayStr } from "@/lib/dates";
import { isTrackableDate } from "@/lib/frequency";
import type { Habit, HabitCategory, HabitDomain } from "@/types/habit";

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
 * habit's lifetime (creation date through today).
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
 * Consecutive trackable days completed, ending today.
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
      continue;
    }
    if (!set.has(dateStr)) break;
    streak++;
    offset--;
  }
  return streak;
}

/**
 * Longest run of consecutive trackable days completed.
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

/** For "timesPerWeek" habits, progress within the current week. */
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
      label = today.toLocaleDateString("en-US", {
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

export interface DomainStat {
  domain: HabitDomain;
  completed: number;
  trackable: number;
  rate: number;
}

export interface HabitReportRow {
  habit: Habit;
  completed: number;
  trackable: number;
  rate: number;
  streak: number;
  bestStreak: number;
}

export interface Report {
  label: string;
  completed: number;
  trackable: number;
  missed: number;
  rate: number;
  activeStreaksCount: number;
  topHabit: { habit: Habit; rate: number } | null;
  weakestHabit: { habit: Habit; rate: number } | null;
  categories: CategoryStat[];
  domains: DomainStat[];
  rows: HabitReportRow[];
}

export function buildReport(habits: Habit[], period: ReportPeriod): Report {
  const { start, end, label } = getPeriodRange(period);

  let completed = 0;
  let trackable = 0;
  let activeStreaksCount = 0;
  let topHabit: { habit: Habit; rate: number } | null = null;
  let weakestHabit: { habit: Habit; rate: number } | null = null;

  const categoryTotals = new Map<HabitCategory, { completed: number; trackable: number }>();
  const domainTotals = new Map<HabitDomain, { completed: number; trackable: number }>();
  const rows: HabitReportRow[] = [];

  for (const habit of habits) {
    const sr = successRateForRange(habit, start, end);
    completed += sr.completed;
    trackable += sr.trackable;

    const streak = computeCurrentStreak(habit);
    const bestStreak = computeBestStreak(habit);
    if (streak > 0) activeStreaksCount++;

    rows.push({
      habit,
      completed: sr.completed,
      trackable: sr.trackable,
      rate: sr.rate,
      streak,
      bestStreak,
    });

    if (sr.trackable > 0) {
      if (!topHabit || sr.rate > topHabit.rate) topHabit = { habit, rate: sr.rate };
      if (!weakestHabit || sr.rate < weakestHabit.rate) {
        weakestHabit = { habit, rate: sr.rate };
      }
    }

    const catTot = categoryTotals.get(habit.category) ?? { completed: 0, trackable: 0 };
    catTot.completed += sr.completed;
    catTot.trackable += sr.trackable;
    categoryTotals.set(habit.category, catTot);

    const domTot = domainTotals.get(habit.domain) ?? { completed: 0, trackable: 0 };
    domTot.completed += sr.completed;
    domTot.trackable += sr.trackable;
    domainTotals.set(habit.domain, domTot);
  }

  // Sort rows descending by success rate
  rows.sort((a, b) => b.rate - a.rate);

  const categories: CategoryStat[] = Array.from(categoryTotals.entries())
    .map(([category, t]) => ({
      category,
      completed: t.completed,
      trackable: t.trackable,
      rate: t.trackable ? t.completed / t.trackable : 0,
    }))
    .sort((a, b) => b.rate - a.rate);

  const domains: DomainStat[] = Array.from(domainTotals.entries())
    .map(([domain, t]) => ({
      domain,
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
    activeStreaksCount,
    topHabit,
    weakestHabit,
    categories,
    domains,
    rows,
  };
}
