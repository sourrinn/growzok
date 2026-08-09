"use client";

import { useMemo } from "react";
import type { Habit } from "@/types/habit";
import { todayStr } from "@/lib/dates";
import { computeCurrentStreak } from "@/lib/analytics";

import HabitSymbolIcon from "@/components/HabitSymbolIcon";

interface Props {
  habits: Habit[];
  onToggle: (habitId: string) => void;
}

export default function SmartPriorityCard({ habits, onToggle }: Props) {
  const today = todayStr();

  const priorityHabit = useMemo(() => {
    const pending = habits.filter((h) => !h.history.includes(today));
    if (pending.length === 0) return null;

    // Rank pending habits: active streak > 0 first (streak at risk!), then total history
    const ranked = [...pending].sort((a, b) => {
      const streakA = computeCurrentStreak(a);
      const streakB = computeCurrentStreak(b);
      if (streakA !== streakB) return streakB - streakA;
      return b.history.length - a.history.length;
    });

    const top = ranked[0];
    const streak = computeCurrentStreak(top);
    return { habit: top, streak };
  }, [habits, today]);

  if (!priorityHabit) {
    return (
      <div className="rounded-2xl border border-[#406852]/30 bg-[#406852]/5 p-4 dark:border-[#a3b899]/30 dark:bg-[#27272a] text-xs flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-bold text-[#406852] dark:text-[#a3b899]">
              All Habits Completed Today!
            </p>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">
              You've maintained 100% daily rhythm momentum. Rest & recover.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { habit, streak } = priorityHabit;

  return (
    <div className="rounded-3xl border border-[#e5e1d7] bg-white p-4 sm:p-5 shadow-sm transition-all dark:border-[#27272a] dark:bg-[#18181b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div
          className="h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-xs"
          style={{ backgroundColor: habit.color }}
        >
          <HabitSymbolIcon domain={habit.domain} habitName={habit.name} className="h-5.5 w-5.5 text-white" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-md bg-[#be5a38]/10 px-2 py-0.5 text-[10px] font-bold text-[#be5a38] uppercase tracking-wider">
              {streak > 0 ? `🔥 ${streak}-Day Streak At Risk` : "Today's #1 Priority"}
            </span>
            <span className="rounded-md bg-[#e3ede6] dark:bg-[#27272a] px-2 py-0.5 text-[10px] font-semibold text-[#406852] dark:text-[#a3b899]">
              {habit.domain}
            </span>
          </div>
          <h3 className="font-display text-sm sm:text-base font-bold text-[#232f26] dark:text-[#f4f4f5] truncate">
            {habit.name}
          </h3>
        </div>
      </div>

      <button
        onClick={() => onToggle(habit.id)}
        className="w-full sm:w-auto rounded-xl bg-[#232f26] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#406852] dark:bg-[#f4f4f5] dark:text-[#18181b] dark:hover:bg-white transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5 active:scale-95"
      >
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
          <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Complete Priority</span>
      </button>
    </div>
  );
}
