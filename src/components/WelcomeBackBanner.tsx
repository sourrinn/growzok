"use client";

import { useState } from "react";
import type { Habit } from "@/types/habit";
import { dateStrOffset } from "@/lib/dates";

interface Props {
  habits: Habit[];
}

export default function WelcomeBackBanner({ habits }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || habits.length === 0) return null;

  // Find latest completion date across all habits
  let latestDate: string | null = null;
  habits.forEach((h) => {
    h.history.forEach((d) => {
      if (!latestDate || d > latestDate) {
        latestDate = d;
      }
    });
  });

  if (!latestDate) return null;

  // Compute days since last completion
  const today = dateStrOffset(0);
  const diffTime = new Date(today).getTime() - new Date(latestDate).getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

  // Only surface if user was away for 2+ days
  if (diffDays < 2) return null;

  return (
    <div className="relative rounded-2xl border border-[#406852]/30 bg-[#e3ede6]/60 dark:border-[#406852]/40 dark:bg-[#121215] p-5 shadow-sm space-y-2 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">
            Welcome Back! Let's Reset Your Daily Rhythm
          </h3>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs font-semibold text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
        >
          ✕ Dismiss
        </button>
      </div>

      <p className="text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
        You were away for <strong className="text-[#406852] dark:text-[#a3b899]">{diffDays} days</strong>. No pressure or guilt—your frequency-aware streaks and Monthly Streak Freeze are protecting your progress. Pick 1 easy habit to lock in quick momentum today!
      </p>
    </div>
  );
}
