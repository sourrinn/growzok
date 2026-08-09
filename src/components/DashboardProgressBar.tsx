"use client";

import { useMemo } from "react";
import { todayStr } from "@/lib/dates";
import { computeCurrentStreak } from "@/lib/analytics";
import { isTrackableDate } from "@/lib/frequency";
import type { Habit } from "@/types/habit";

interface Props {
  habits: Habit[];
  onlyPending: boolean;
  onTogglePendingOnly: () => void;
}

export default function DashboardProgressBar({
  habits,
  onlyPending,
  onTogglePendingOnly,
}: Props) {
  const today = todayStr();

  const metrics = useMemo(() => {
    if (habits.length === 0) {
      return { completed: 0, total: 0, pct: 0, activeStreaks: 0 };
    }

    const todayHabits = habits.filter((h) => isTrackableDate(h.frequency, today));
    const total = todayHabits.length > 0 ? todayHabits.length : habits.length;

    const completed = habits.filter((h) => {
      if (h.target && h.target.goal > 1) {
        const val = h.progress?.[today] ?? 0;
        return val >= h.target.goal || h.history.includes(today);
      }
      return h.history.includes(today);
    }).length;

    const activeStreaks = habits.filter((h) => computeCurrentStreak(h) > 0).length;
    const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

    return { completed, total, pct, activeStreaks };
  }, [habits, today]);

  if (habits.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm dark:border-[#27272a] dark:bg-[#18181b] space-y-4">
      {/* Top Meta Line */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e3ede6] dark:bg-[#27272a] text-[#406852] dark:text-[#a1a1aa] font-bold text-sm">
            {metrics.pct}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                Today's Progress
              </h2>
              {metrics.activeStreaks > 0 && (
                <span className="rounded-full bg-[#f4efe2] dark:bg-[#27272a] px-2.5 py-0.5 text-[11px] font-bold text-[#6b4923] dark:text-[#d4cca9]">
                  🔥 {metrics.activeStreaks} Streak{metrics.activeStreaks === 1 ? "" : "s"}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[#737970] dark:text-[#a1a1aa]">
              <strong className="text-[#232f26] dark:text-[#f4f4f5]">{metrics.completed}</strong> of{" "}
              {metrics.total} habits completed for today
            </p>
          </div>
        </div>

        {/* Quick Filter Focus Button */}
        <button
          type="button"
          onClick={onTogglePendingOnly}
          className={`w-fit self-end sm:self-auto rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            onlyPending
              ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46] shadow-sm"
              : "border border-[#e5e1d7] bg-[#fbf9f5] text-[#737970] dark:border-[#27272a] dark:bg-[#27272a] dark:text-[#a1a1aa] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
          }`}
        >
          {onlyPending ? "✓ Showing Pending Only" : "Show Pending Only"}
        </button>
      </div>

      {/* Progress Bar Track */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e5e1d7]/70 dark:bg-[#27272a]">
        <div
          className="h-full bg-gradient-to-r from-[#406852] to-[#232f26] dark:from-[#3f3f46] dark:to-[#f4f4f5] transition-all duration-500 rounded-full"
          style={{ width: `${metrics.pct}%` }}
        />
      </div>
    </div>
  );
}
