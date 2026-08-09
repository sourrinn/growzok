"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useHabits } from "@/hooks/useHabits";
import { computeUserGamification } from "@/lib/gamification";

export default function LifeHUDHeader() {
  const [timeStr, setTimeStr] = useState("");
  const { habits } = useHabits();
  const gamification = computeUserGamification(habits);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: System Status & Time */}
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 shrink-0 rounded-full bg-[#406852] animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#232f26] dark:text-[#f4f4f5]">
                {timeStr || "12:00:00 PM"}
              </span>
              <span className="rounded-full bg-[#406852]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#406852] dark:text-[#a3b899] uppercase">
                🌅 Morning Photonic Window
              </span>
            </div>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">
              Growzok Visionary Life OS • All Systems Operational
            </p>
          </div>
        </div>

        {/* Right: XP Level Badge & Command Palette Trigger */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3 py-1.5 dark:border-[#27272a] dark:bg-[#121215]">
            <span className="text-xs">🏆</span>
            <div className="text-xs">
              <span className="font-bold text-[#232f26] dark:text-[#f4f4f5]">
                Level {gamification.level}
              </span>
              <span className="text-[10px] text-[#737970] dark:text-[#a1a1aa] ml-1.5">
                ({gamification.xp} XP)
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });
              window.dispatchEvent(event);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-[#e5e1d7] bg-white px-3 py-1.5 text-xs font-semibold text-[#737970] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#a1a1aa] hover:text-[#232f26]"
          >
            <span>Search</span>
            <kbd className="rounded bg-[#e5e1d7]/60 dark:bg-[#27272a] px-1.5 py-0.5 font-mono text-[10px] font-bold">
              Ctrl+K
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
