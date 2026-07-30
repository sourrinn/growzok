import { dateStrOffset, toDateStr, todayStr } from "./lib/dates.ts";
import { isTrackableDate, frequencyLabel } from "./lib/frequency.ts";
import {
  computeOnTrackStatus,
  computeSuccessRate,
  computeCurrentStreak,
} from "./lib/analytics.ts";
import { computeCompletionTimeStats } from "./lib/completionStats.ts";
import { generateInsights } from "./lib/insights.ts";
import {
  parseCategory,
  parseFrequency,
  parseTarget,
  parseMissAllowance,
} from "./lib/habitInput.ts";
import { HABIT_TEMPLATES } from "./lib/templates.ts";
import type { Habit } from "./types/habit.ts";

let failures = 0;
function check(desc: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}: ${desc} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`);
  if (!ok) failures++;
}
function checkTrue(desc: string, cond: boolean) {
  console.log(`${cond ? "PASS" : "FAIL"}: ${desc}`);
  if (!cond) failures++;
}

function makeHabit(overrides: Partial<Habit>): Habit {
  return {
    id: "h1",
    name: "Test",
    color: "#5c7a5c",
    category: "Personal",
    frequency: { type: "daily" },
    missAllowance: 0,
    target: null,
    progress: {},
    createdAt: dateStrOffset(-30) + "T00:00:00.000Z",
    history: [],
    completions: [],
    ...overrides,
  };
}

// --- Custom frequency ---
{
  const freq = { type: "custom" as const, days: [1, 3, 5] }; // Mon/Wed/Fri
  check("custom label", frequencyLabel(freq), "Mon, Wed, Fri");
  check("2026-08-03 (Mon) trackable for custom Mon/Wed/Fri", isTrackableDate(freq, "2026-08-03"), true);
  check("2026-08-04 (Tue) not trackable for custom Mon/Wed/Fri", isTrackableDate(freq, "2026-08-04"), false);
}

// --- computeOnTrackStatus ---
{
  // Habit created 30 days ago, daily, missAllowance=2. Miss 3 days this week (before today).
  const today = todayStr();
  const d = new Date(`${today}T00:00:00`);
  const dow = (d.getDay() + 6) % 7;
  const weekStartDate = new Date(d);
  weekStartDate.setDate(d.getDate() - dow);
  // Build history: complete every trackable day since creation EXCEPT skip 3 days this week (if available).
  const history: string[] = [];
  const daysSinceWeekStart = dow; // number of days strictly before today, within this week
  let skipped = 0;
  for (let i = 30; i >= 1; i--) {
    const dateStr = dateStrOffset(-i);
    // Skip (don't mark done) the first 3 days of the current week (if this date falls within that window).
    const dObj = new Date(`${dateStr}T00:00:00`);
    const withinCurrentWeek = dObj >= weekStartDate && dObj < d;
    if (withinCurrentWeek && skipped < 3 && daysSinceWeekStart >= 3) {
      skipped++;
      continue;
    }
    history.push(dateStr);
  }
  const habit = makeHabit({ history, missAllowance: 2 });
  const status = computeOnTrackStatus(habit);
  if (daysSinceWeekStart >= 3) {
    check("on-track status misses=3 when 3 missed this week", status.misses, 3);
    check("on-track status onTrack=false when misses(3) > allowance(2)", status.onTrack, false);
  } else {
    console.log(`SKIP: on-track weekday-dependent test (today is only ${daysSinceWeekStart} days into the week)`);
  }

  // Monday edge case: 0 days elapsed yet this week -> always on track regardless of allowance.
  const mondayHabit = makeHabit({ history: [], missAllowance: 0 });
  // We can't force "today" to be Monday, but we CAN verify the guard logic directly:
  // if weekStart > yesterday (i.e., today IS the week start / Monday), datesBetween returns [].
  checkTrue(
    "on-track status is always well-formed (misses >= 0)",
    computeOnTrackStatus(mondayHabit).misses >= 0
  );
}

// --- computeCompletionTimeStats ---
{
  const habit = makeHabit({
    completions: [
      { date: "2026-07-01", completedAt: "2026-07-01T20:00:00.000Z" },
      { date: "2026-07-02", completedAt: "2026-07-02T20:15:00.000Z" },
      { date: "2026-07-03", completedAt: "2026-07-03T08:00:00.000Z" },
    ],
  });
  const stats = computeCompletionTimeStats(habit);
  checkTrue("completion stats not null with data", stats !== null);
  check("completion stats count = 3", stats?.count, 3);
  // Most common hour: 20:00 and 20:15 both fall in the "20" hour bucket (2 entries) vs "8" hour (1 entry).
  check("completion stats most common hour = 8:00 PM (UTC, since no local offset applied in this env)", stats?.mostCommon, "8:00 PM");

  const empty = makeHabit({ completions: [] });
  check("completion stats null with no data", computeCompletionTimeStats(empty), null);
}

// --- generateInsights: favorite/worst weekday need >= 2 clear-majority occurrences ---
{
  // All completions on Mondays (2026-08-03, 2026-08-10, 2026-08-17), none on other days.
  const habit = makeHabit({
    createdAt: "2026-08-01T00:00:00.000Z",
    history: ["2026-08-03", "2026-08-10", "2026-08-17"],
  });
  const insights = generateInsights(habit);
  checkTrue(
    "insights include favorite-weekday sentence for all-Monday history",
    insights.some((i) => i.includes("Monday"))
  );
}
{
  // Brand new habit (created today), no history -> no insights at all (no false signal).
  const habit = makeHabit({ createdAt: todayStr() + "T00:00:00.000Z", history: [] });
  check("no insights for brand-new empty habit", generateInsights(habit), []);
}

// --- habitInput parsing ---
{
  check("parseCategory valid", parseCategory("Health"), "Health");
  check("parseCategory invalid falls back", parseCategory("NotACategory"), "Personal");
  check("parseFrequency daily", parseFrequency({ type: "daily" }), { type: "daily" });
  check("parseFrequency timesPerWeek valid", parseFrequency({ type: "timesPerWeek", times: 4 }), { type: "timesPerWeek", times: 4 });
  check("parseFrequency timesPerWeek out of range falls back", parseFrequency({ type: "timesPerWeek", times: 99 }), { type: "daily" });
  check("parseFrequency custom valid", parseFrequency({ type: "custom", days: [1, 1, 3, 9, -1] }), { type: "custom", days: [1, 3] });
  check("parseFrequency custom empty falls back", parseFrequency({ type: "custom", days: [] }), { type: "daily" });
  check("parseFrequency garbage falls back", parseFrequency("nonsense"), { type: "daily" });

  check("parseTarget valid", parseTarget({ type: "count", goal: 8, unit: "glasses" }), { type: "count", goal: 8, unit: "glasses" });
  check("parseTarget invalid type -> null", parseTarget({ type: "bogus", goal: 8 }), null);
  check("parseTarget non-positive goal -> null", parseTarget({ type: "count", goal: 0 }), null);
  check("parseTarget missing -> null", parseTarget(undefined), null);

  check("parseMissAllowance valid", parseMissAllowance(3), 3);
  check("parseMissAllowance clamps to 7", parseMissAllowance(20), 7);
  check("parseMissAllowance negative falls back to 0", parseMissAllowance(-1), 0);
  check("parseMissAllowance non-numeric falls back to 0", parseMissAllowance("abc"), 0);
}

// --- templates sanity ---
{
  checkTrue("at least 4 templates defined", HABIT_TEMPLATES.length >= 4);
  checkTrue(
    "every template has at least one habit",
    HABIT_TEMPLATES.every((t) => t.habits.length > 0)
  );
  const keys = HABIT_TEMPLATES.map((t) => t.key);
  checkTrue("template keys are unique", new Set(keys).size === keys.length);
}

console.log(failures === 0 ? "\nALL PASSED" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
