/** Format a Date as a local 'YYYY-MM-DD' string. */
export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayStr(): string {
  return toDateStr(new Date());
}

/** Local date string offset by `offset` days from today (negative = past). */
export function dateStrOffset(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toDateStr(d);
}

/**
 * Consecutive completed days ending today, or ending yesterday when today
 * isn't done yet (so a streak survives until you actually miss a day).
 */
export function computeStreak(history: string[]): number {
  const set = new Set(history);
  let streak = 0;
  let offset = set.has(todayStr()) ? 0 : -1;
  while (set.has(dateStrOffset(offset))) {
    streak++;
    offset--;
  }
  return streak;
}

/** The last `n` calendar days, oldest first. */
export function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) days.push(dateStrOffset(-i));
  return days;
}
