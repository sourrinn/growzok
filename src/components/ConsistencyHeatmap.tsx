"use client";

import { useMemo } from "react";
import type { Habit } from "@/types/habit";

interface Props {
  habits: Habit[];
}

export default function ConsistencyHeatmap({ habits }: Props) {
  // Build a map of date string YYYY-MM-DD -> total habits completed on that day
  const dateCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const h of habits) {
      for (const d of h.history) {
        map.set(d, (map.get(d) ?? 0) + 1);
      }
    }
    return map;
  }, [habits]);

  // Generate 52 weeks (364 days) of date cells going back from today
  const weeks = useMemo(() => {
    const today = new Date();
    const result: { dateStr: string; count: number; dayOfWeek: number }[][] = [];
    let currentWeek: { dateStr: string; count: number; dayOfWeek: number }[] = [];

    // Start 52 weeks ago
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);

    for (let i = 0; i <= 364; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const count = dateCounts.get(dateStr) ?? 0;
      const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat

      currentWeek.push({ dateStr, count, dayOfWeek });

      if (dayOfWeek === 6 || i === 364) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }
    return result;
  }, [dateCounts]);

  const maxCount = useMemo(() => {
    let max = 1;
    for (const val of dateCounts.values()) {
      if (val > max) max = val;
    }
    return max;
  }, [dateCounts]);

  // Color intensity scale
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-[#e5e1d7]/40 dark:bg-[#27272a]";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-[#b0cca9] dark:bg-[#2d4a3e]";
    if (ratio <= 0.5) return "bg-[#6b8259] dark:bg-[#406852]";
    if (ratio <= 0.75) return "bg-[#406852] dark:bg-[#6b8259]";
    return "bg-[#232f26] dark:bg-[#a3b899]";
  };

  return (
    <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm dark:border-[#27272a] dark:bg-[#18181b] space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            365-Day Consistency Heatmap
          </h2>
          <p className="mt-0.5 text-xs text-[#737970] dark:text-[#a1a1aa]">
            Annual habit execution density across all routines.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-[#737970] dark:text-[#a1a1aa]">
          <span>Less</span>
          <div className="h-2.5 w-2.5 rounded-xs bg-[#e5e1d7]/40 dark:bg-[#27272a]" />
          <div className="h-2.5 w-2.5 rounded-xs bg-[#b0cca9] dark:bg-[#2d4a3e]" />
          <div className="h-2.5 w-2.5 rounded-xs bg-[#6b8259] dark:bg-[#406852]" />
          <div className="h-2.5 w-2.5 rounded-xs bg-[#406852] dark:bg-[#6b8259]" />
          <div className="h-2.5 w-2.5 rounded-xs bg-[#232f26] dark:bg-[#a3b899]" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid Overflow Container */}
      <div className="overflow-x-auto no-scrollbar pt-2">
        <div className="inline-flex gap-1 min-w-[700px]">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((cell) => (
                <div
                  key={cell.dateStr}
                  title={`${cell.dateStr}: ${cell.count} habit completion${
                    cell.count === 1 ? "" : "s"
                  }`}
                  className={`h-3 w-3 rounded-xs transition-all hover:scale-125 hover:z-10 ${getColorClass(
                    cell.count
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
