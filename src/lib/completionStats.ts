import type { Habit } from "@/types/habit";

export interface CompletionTimeStats {
  /** Most common completion hour, e.g. "8:00 PM" (viewer's local time). */
  mostCommon: string;
  /** Average completion time of day, e.g. "7:42 PM" (viewer's local time). */
  average: string;
  count: number;
}

function formatTimeOfDay(minutesSinceMidnight: number): string {
  const h24 = Math.floor(minutesSinceMidnight / 60) % 24;
  const m = Math.round(minutesSinceMidnight % 60);
  const period = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Completion-time-of-day stats, or null if there's no completion data yet. */
export function computeCompletionTimeStats(
  habit: Habit
): CompletionTimeStats | null {
  if (habit.completions.length === 0) return null;

  const minutesList = habit.completions.map((c) => {
    const d = new Date(c.completedAt);
    return d.getHours() * 60 + d.getMinutes();
  });

  const hourCounts = new Map<number, number>();
  for (const minutes of minutesList) {
    const hour = Math.floor(minutes / 60);
    hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
  }
  let mostCommonHour = 0;
  let bestCount = -1;
  for (const [hour, count] of hourCounts) {
    if (count > bestCount) {
      bestCount = count;
      mostCommonHour = hour;
    }
  }

  const avgMinutes =
    minutesList.reduce((sum, m) => sum + m, 0) / minutesList.length;

  return {
    mostCommon: formatTimeOfDay(mostCommonHour * 60),
    average: formatTimeOfDay(avgMinutes),
    count: habit.completions.length,
  };
}
