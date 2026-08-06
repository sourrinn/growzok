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

      {/* Premium Template Marketplace Ad / Promo Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-charcoal/20 bg-gradient-to-br from-charcoal via-slate-800 to-black p-5 text-white shadow-md transition-all hover:shadow-lg">
        {/* Glow effect background */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sage/20 blur-2xl transition-all group-hover:bg-sage/30" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
              ✨ Presets & Protocols
            </span>
            <span className="text-[10px] text-white/70">6+ Systems</span>
          </div>

          <h2 className="mt-3 text-base font-semibold tracking-tight text-white">
            Habit Systems Marketplace
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            Adopt science-backed morning routines, deep work hyper-focus setups, or stoic night wind-downs.
          </p>

          <Link
            href="/templates"
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-xs font-semibold text-charcoal transition-all hover:bg-slate-100 active:scale-[0.98]"
          >
            <span>Explore Template Hub</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
