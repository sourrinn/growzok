"use client";

import type { DayOfWeekStat } from "@/lib/analytics";

interface Props {
  stats: DayOfWeekStat[];
}

export default function DayOfWeekHistogram({ stats }: Props) {
  if (stats.length === 0) return null;

  // Find peak execution day
  const peakDay = [...stats].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 dark:border-[#27272a] dark:bg-[#18181b] shadow-sm space-y-4 print-break-inside-avoid">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Weekly Execution Distribution
          </h2>
          <p className="mt-0.5 text-xs text-[#737970] dark:text-[#a1a1aa]">
            Habit completion density by day of the week.
          </p>
        </div>
        {peakDay && peakDay.count > 0 && (
          <span className="rounded-full bg-[#406852]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#406852] dark:text-[#a3b899]">
            Peak: {peakDay.dayLabel} ({peakDay.count} logs)
          </span>
        )}
      </div>

      {/* SVG Bar Chart */}
      <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4 border-b border-[#e5e1d7] dark:border-[#27272a] pb-2">
        {stats.map((item) => {
          const isPeak = peakDay && peakDay.dayLabel === item.dayLabel && item.count > 0;
          return (
            <div key={item.dayLabel} className="flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[10px] font-bold tabular-nums text-[#737970] dark:text-[#a1a1aa] opacity-0 group-hover:opacity-100 transition-opacity">
                {item.count}
              </span>
              <div className="w-full bg-[#e5e1d7] dark:bg-[#27272a] rounded-t-lg h-24 relative overflow-hidden">
                <div
                  className={`w-full absolute bottom-0 rounded-t-lg transition-all duration-500 ${
                    isPeak
                      ? "bg-[#406852] dark:bg-[#a3b899]"
                      : "bg-[#737970]/50 dark:bg-[#a1a1aa]/40 group-hover:bg-[#406852]"
                  }`}
                  style={{ height: `${Math.max(6, item.pct)}%` }}
                />
              </div>
              <span
                className={`text-[11px] font-semibold ${
                  isPeak ? "text-[#406852] dark:text-[#a3b899] font-bold" : "text-[#737970] dark:text-[#a1a1aa]"
                }`}
              >
                {item.dayLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
