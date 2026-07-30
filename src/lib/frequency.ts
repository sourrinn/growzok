import type { HabitFrequency } from "@/types/habit";

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Whether `dateStr` ('YYYY-MM-DD') counts as a trackable day for this frequency.
 * Non-trackable days don't count toward success rate and don't break a streak
 * (e.g. a weekday-only habit isn't penalized for a Saturday).
 */
export function isTrackableDate(freq: HabitFrequency, dateStr: string): boolean {
  if (freq.type === "daily" || freq.type === "timesPerWeek") return true;
  const day = new Date(`${dateStr}T00:00:00`).getDay(); // 0=Sun..6=Sat, local time
  if (freq.type === "weekdays") return day >= 1 && day <= 5;
  if (freq.type === "weekends") return day === 0 || day === 6;
  return freq.days.includes(day); // custom
}

export function frequencyLabel(freq: HabitFrequency): string {
  switch (freq.type) {
    case "daily":
      return "Daily";
    case "weekdays":
      return "Weekdays";
    case "weekends":
      return "Weekends";
    case "timesPerWeek":
      return `${freq.times}x / week`;
    case "custom":
      return [...freq.days]
        .sort((a, b) => a - b)
        .map((d) => WEEKDAY_SHORT[d])
        .join(", ");
  }
}
