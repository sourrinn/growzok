"use client";

import Link from "next/link";
import type { Habit } from "@/types/habit";
import { todayStr } from "@/lib/dates";
import { computeCurrentStreak, computeSuccessRate } from "@/lib/analytics";

interface Props {
  habits: Habit[];
}

export default function DashboardSidebar({ habits }: Props) {
  const today = todayStr();
  const completedTodayCount = habits.filter((h) => h.history.includes(today)).length;
  const totalHabits = habits.length;
  const completionPct =
    totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  // Active streaks sorted descending
  const habitsWithStreaks = habits
    .map((h) => ({ habit: h, streak: computeCurrentStreak(h) }))
    .filter((s) => s.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 4);

  // Highest success rate habit
  const topHabit = habits
    .map((h) => ({ habit: h, rate: computeSuccessRate(h).rate }))
    .sort((a, b) => b.rate - a.rate)[0];

  return (
    <aside className="space-y-6">
      {/* Today's Completion Card */}
      <div className="rounded-2xl border border-mist bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Today's Rhythm
          </h2>
          <span className="text-xs tabular-nums text-muted">
            {completedTodayCount} of {totalHabits} completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-mist">
            <div
              className="h-full bg-charcoal transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <span className="text-sm font-semibold tabular-nums text-charcoal">
            {completionPct}%
          </span>
        </div>

        {totalHabits > 0 && completionPct === 100 && (
          <p className="mt-2 text-xs font-medium text-sage">
            🎉 All habits completed for today! Great momentum.
          </p>
        )}
      </div>

      {/* Top Active Streaks */}
      {habitsWithStreaks.length > 0 && (
        <div className="rounded-2xl border border-mist bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Active Streaks
          </h2>
          <ul className="space-y-2.5">
            {habitsWithStreaks.map(({ habit, streak }) => (
              <li key={habit.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="truncate font-medium text-charcoal">
                    {habit.name}
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-mist/60 px-2 py-0.5 text-xs font-medium tabular-nums text-charcoal">
                  🔥 {streak}d
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top Performing Habit Insight */}
      {topHabit && topHabit.rate > 0 && (
        <div className="rounded-2xl border border-mist/80 bg-gradient-to-br from-mist/30 to-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Top Performer
          </h2>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-sm font-medium text-charcoal">{topHabit.habit.name}</h3>
            <span className="text-sm font-semibold tabular-nums text-charcoal">
              {Math.round(topHabit.rate * 100)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Domain:{" "}
            <span className="font-medium text-charcoal">{topHabit.habit.domain}</span>
          </p>
        </div>
      )}

      {/* Quick Template Marketplace Shortcut Card */}
      <div className="rounded-2xl border border-dashed border-mist bg-white p-5 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Need Inspiration?
        </h2>
        <p className="mt-1.5 text-xs text-muted">
          Discover science-backed morning protocols, deep work setups, and fitness routines.
        </p>
        <Link
          href="/templates"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal hover:underline"
        >
          Explore All Templates →
        </Link>
      </div>
    </aside>
  );
}
