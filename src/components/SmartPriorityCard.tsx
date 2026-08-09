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
    <div className="rounded-2xl border border-[#e5e1d7] bg-white p-4 dark:border-[#27272a] dark:bg-[#18181b] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-white shadow-xs"
          style={{ backgroundColor: habit.color }}
        >
          <HabitSymbolIcon domain={habit.domain} habitName={habit.name} className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#be5a38]/10 px-2 py-0.5 text-[9px] font-bold text-[#be5a38] uppercase tracking-wider">
              {streak > 0 ? `🔥 ${streak}-Day Streak At Risk` : "Today's #1 Priority"}
            </span>
            <span className="text-[10px] text-[#737970] dark:text-[#a1a1aa] font-medium">
              {habit.domain}
            </span>
          </div>
          <h3 className="font-display text-sm font-bold text-[#232f26] dark:text-[#f4f4f5] mt-0.5">
            {habit.name}
          </h3>
        </div>
      </div>

      <button
        onClick={() => onToggle(habit.id)}
        className="rounded-xl bg-[#232f26] px-4 py-2 text-xs font-semibold text-white hover:bg-[#406852] dark:bg-[#f4f4f5] dark:text-[#18181b] dark:hover:bg-white transition-all shadow-xs shrink-0 self-end sm:self-auto"
      >
        ✓ Complete Priority
      </button>
    </div>
  );
}
