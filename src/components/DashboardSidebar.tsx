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
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Today's Rhythm
          </h2>
          <span className="text-xs tabular-nums text-[#737970] dark:text-[#a1a1aa]">
            {completedTodayCount} of {totalHabits} completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#e5e1d7] dark:bg-[#27272a]">
            <div
              className="h-full bg-[#232f26] dark:bg-[#f4f4f5] transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <span className="text-sm font-semibold tabular-nums text-[#232f26] dark:text-[#f4f4f5]">
            {completionPct}%
          </span>
        </div>

        {totalHabits > 0 && completionPct === 100 && (
          <p className="mt-2 text-xs font-medium text-[#406852] dark:text-[#f4f4f5]">
            All habits completed for today. Great momentum.
          </p>
        )}
      </div>

      {/* Top Active Streaks */}
      {habitsWithStreaks.length > 0 && (
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
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
                  <span className="truncate font-medium text-[#232f26] dark:text-[#f4f4f5]">
                    {habit.name}
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-[#e5e1d7]/60 dark:bg-[#27272a] px-2.5 py-0.5 text-xs font-medium tabular-nums text-[#232f26] dark:text-[#f4f4f5]">
                  {streak}d streak
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top Performing Habit Insight */}
      {topHabit && topHabit.rate > 0 && (
        <div className="rounded-2xl border border-[#e5e1d7]/80 bg-gradient-to-br from-[#e5e1d7]/30 to-white dark:border-[#27272a] dark:from-[#27272a]/40 dark:to-[#18181b] p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Top Performer
          </h2>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-sm font-medium text-[#232f26] dark:text-[#f4f4f5]">{topHabit.habit.name}</h3>
            <span className="text-sm font-semibold tabular-nums text-[#232f26] dark:text-[#f4f4f5]">
              {Math.round(topHabit.rate * 100)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
            Domain:{" "}
            <span className="font-medium text-[#232f26] dark:text-[#f4f4f5]">{topHabit.habit.domain}</span>
          </p>
        </div>
      )}

      {/* Premium Protocol Hub Promo Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-[#232f26]/20 bg-gradient-to-br from-[#232f26] via-slate-800 to-black dark:from-[#18181b] dark:via-[#27272a] dark:to-[#09090b] dark:border-[#27272a] p-5 text-white shadow-md transition-all hover:shadow-lg">
        {/* Glow effect background */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 dark:bg-white/5 blur-2xl transition-all group-hover:bg-white/20" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-xs">
              Presets & Protocols
            </span>
            <span className="text-[10px] text-white/70">6+ Systems</span>
          </div>

          <h2 className="mt-3 text-base font-semibold tracking-tight text-white">
            Protocol Marketplace
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            Adopt science-backed morning routines, deep work hyper-focus setups, or stoic night wind-downs.
          </p>

          <Link
            href="/protocols"
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white dark:bg-[#27272a] dark:border dark:border-[#3f3f46] py-2 text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] transition-all hover:bg-slate-100 dark:hover:bg-[#3f3f46] active:scale-[0.98]"
          >
            <span>Explore Protocol Hub</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
