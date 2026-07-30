import { datesBetween, getPeriodRange, successRateForRange } from "@/lib/analytics";
import { toDateStr, todayStr } from "@/lib/dates";
import { isTrackableDate } from "@/lib/frequency";
import type { Habit } from "@/types/habit";

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function localDay(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00`).getDay();
}

/** Success-rate change vs the previous calendar month, if both have data. */
function computeMonthTrend(habit: Habit): string | null {
  const current = getPeriodRange("month");
  const [y, m] = current.start.split("-").map(Number);
  const prevStart = toDateStr(new Date(y, m - 2, 1));
  const prevEnd = toDateStr(new Date(y, m - 1, 0)); // day 0 = last day of previous month

  const currentSr = successRateForRange(habit, current.start, current.end);
  const prevSr = successRateForRange(habit, prevStart, prevEnd);
  if (currentSr.trackable === 0 || prevSr.trackable === 0) return null;

  const deltaPct = Math.round((currentSr.rate - prevSr.rate) * 100);
  if (deltaPct === 0) return null;

  const direction = deltaPct > 0 ? "up" : "down";
  return `Your success rate is ${direction} ${Math.abs(deltaPct)}% compared to last month.`;
}

/** The weekday with a clearly-highest completion count, if there is one. */
function computeFavoriteWeekday(habit: Habit): string | null {
  const counts = new Array(7).fill(0);
  for (const d of habit.history) counts[localDay(d)]++;

  const max = Math.max(...counts);
  if (max < 2) return null; // not enough signal yet
  const maxIdx = counts.indexOf(max);
  const rest = counts.filter((_, i) => i !== maxIdx);
  if (max <= Math.max(...rest, 0)) return null; // tie — no clear favorite

  return `You complete this habit most often on ${WEEKDAY_NAMES[maxIdx]}s.`;
}

/** The weekday with a clearly-highest miss count, if there is one. */
function computeWorstWeekday(habit: Habit): string | null {
  const createdDateStr = habit.createdAt.slice(0, 10);
  const historySet = new Set(habit.history);
  const misses = new Array(7).fill(0);

  for (const d of datesBetween(createdDateStr, todayStr())) {
    if (isTrackableDate(habit.frequency, d) && !historySet.has(d)) {
      misses[localDay(d)]++;
    }
  }

  const max = Math.max(...misses);
  if (max < 2) return null;
  const maxIdx = misses.indexOf(max);
  const rest = misses.filter((_, i) => i !== maxIdx);
  if (max <= Math.max(...rest, 0)) return null;

  return `You miss this habit primarily on ${WEEKDAY_NAMES[maxIdx]}s.`;
}

/**
 * Simple, non-AI trend insights from period-over-period diffing and weekday
 * distribution — only surfaced when there's enough signal to say something
 * meaningful (a brand-new habit won't show any of these yet).
 */
export function generateInsights(habit: Habit): string[] {
  return [computeMonthTrend(habit), computeFavoriteWeekday(habit), computeWorstWeekday(habit)].filter(
    (i): i is string => i !== null
  );
}
