"use client";

import type { Habit } from "@/types/habit";
import { lastNDays } from "@/lib/dates";

interface Props {
  habit: Habit;
  onClose: () => void;
}

export default function HabitCalendarModal({ habit, onClose }: Props) {
  const days = lastNDays(30);

  // Map entries for quick lookup
  const entryMap = new Map<string, { rating?: number; note?: string }>();
  (habit.logEntries ?? []).forEach((e) => entryMap.set(e.date, { rating: e.rating, note: e.note }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-2xl dark:border-[#27272a] dark:bg-[#18181b] space-y-5 animate-scale-in">
        <div className="flex items-center justify-between border-b border-[#e5e1d7] dark:border-[#27272a] pb-4">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: habit.color }} />
            <div>
              <h3 className="font-bold text-base text-[#232f26] dark:text-[#f4f4f5]">
                {habit.name}
              </h3>
              <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
                30-Day Completion & Micro-Journal History
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
          >
            ✕
          </button>
        </div>

        {/* 30-Day Grid */}
        <div className="grid grid-cols-6 gap-2">
          {days.map((dateStr) => {
            const isCompleted = habit.history.includes(dateStr);
            const entry = entryMap.get(dateStr);
            const dayNum = dateStr.slice(-2);

            return (
              <div
                key={dateStr}
                className={`flex flex-col items-center justify-between rounded-xl border p-2 text-center text-xs transition-all ${
                  isCompleted
                    ? "border-[#406852]/40 bg-[#e3ede6]/60 dark:border-[#406852] dark:bg-[#121215]"
                    : "border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a]/40"
                }`}
              >
                <span className="text-[10px] text-[#737970] dark:text-[#a1a1aa]">{dayNum}</span>
                <span className="my-1 font-bold text-xs">
                  {isCompleted ? "✓" : "·"}
                </span>
                {entry?.rating ? (
                  <span className="text-[9px] text-amber-500 font-bold">★{entry.rating}</span>
                ) : (
                  <span className="h-3" />
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#e5e1d7] dark:border-[#27272a] flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#e5e1d7] bg-white px-4 py-2 text-xs font-semibold text-[#232f26] dark:border-[#27272a] dark:bg-[#27272a] dark:text-[#f4f4f5]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
