"use client";

import { useTimeline } from "@/hooks/useTimeline";
import { useSessionContext } from "@/contexts/SessionContext";
import { useHabits } from "@/hooks/useHabits";
import Link from "next/link";

function formatMinTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}


export function DayPlanPanel() {
  const today = new Date().toISOString().slice(0, 10);
  const { timeline, loading } = useTimeline(today);
  const { openSession } = useSessionContext();
  const { habits } = useHabits();

  if (loading || !timeline) return null;
  const blocks = timeline.blocks || [];

  const getEnergyClasses = (energy: string) => {
    switch (energy) {
      case "peak": return "text-[#854d0e] bg-[#fef3c7]";
      case "trough": return "text-[#3730a3] bg-[#e0e7ff]";
      case "recovery": return "text-[#6b21a8] bg-[#f3e8ff]";
      default: return "text-[#737970] bg-[#e5e1d7]";
    }
  };

  const todayBlocks = [...blocks].sort((a, b) => a.startMinute - b.startMinute);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#e5e1d7] bg-white p-4 dark:border-[#27272a] dark:bg-[#18181b]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#232f26] dark:text-[#f4f4f5]">Today's Plan</h3>
        <Link href="/timeline" className="text-[11px] font-semibold text-[#406852] hover:underline dark:text-[#a1a1aa]">
          Edit Day Plan
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {todayBlocks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <p className="text-xs text-[#737970] dark:text-[#a1a1aa] mb-2">No time blocks assigned for today.</p>
            <Link href="/timeline" className="rounded-lg bg-[#232f26] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-black dark:bg-[#f4f4f5] dark:text-[#18181b] dark:hover:bg-white">
              Plan your day
            </Link>
          </div>
        ) : (
          todayBlocks.map((block) => {
            const firstHabitId = block.habitIds[0];
            const firstHabit = habits.find(h => h.id === firstHabitId);
            return (
              <div key={block.id} className="flex items-center justify-between rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 shadow-sm dark:border-[#3f3f46] dark:bg-[#27272a]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#232f26] dark:text-[#f4f4f5]">{block.name}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${getEnergyClasses(block.energyZone)}`}>
                      {block.energyZone}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-[#737970] dark:text-[#a1a1aa]">
                    {formatMinTime(block.startMinute)} – {formatMinTime(block.startMinute + block.durationMinutes)}
                    <span className="ml-2">• {block.habitIds.length} habits</span>
                  </div>
                </div>
                {firstHabit && (
                  <button
                    onClick={() => openSession({ habitId: firstHabit.id, habitName: firstHabit.name, plannedMins: block.durationMinutes })}
                    className="shrink-0 rounded-lg bg-[#22c55e] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-sm transition-colors hover:bg-[#16a34a]"
                  >
                    Start Block
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
