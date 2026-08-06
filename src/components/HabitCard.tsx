"use client";

import { useState } from "react";
import Link from "next/link";
import type { Habit } from "@/types/habit";
import { todayStr } from "@/lib/dates";
import {
  computeCurrentStreak,
  computeOnTrackStatus,
  computeSuccessRate,
  computeThisWeekProgress,
} from "@/lib/analytics";
import { frequencyLabel } from "@/lib/frequency";
import StreakStem from "@/components/StreakStem";

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
  onLogProgress: (id: string, value: number) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, onToggle, onLogProgress, onDelete }: Props) {
  const today = todayStr();
  const doneToday = habit.history.includes(today);
  const successRate = computeSuccessRate(habit);
  const streak = computeCurrentStreak(habit);
  const weekProgress = computeThisWeekProgress(habit);
  const onTrack = habit.missAllowance > 0 ? computeOnTrackStatus(habit) : null;

  const [draftValue, setDraftValue] = useState(
    habit.progress[today] !== undefined ? String(habit.progress[today]) : ""
  );

  const commitValue = () => {
    const value = Number(draftValue);
    if (Number.isFinite(value) && value >= 0) onLogProgress(habit.id, value);
  };

  return (
    <li className="group relative flex flex-col justify-between rounded-xl border border-mist/80 bg-white p-4 shadow-sm transition-all hover:border-charcoal/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {/* Toggle / Target Input */}
        <div className="flex items-center gap-3">
          {habit.target ? (
            <input
              type="number"
              min={0}
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
              onBlur={commitValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              aria-label={`Log today's ${habit.name}`}
              className={`h-7 w-14 rounded border px-1.5 text-center text-sm font-semibold outline-none transition-colors ${
                doneToday
                  ? "border-transparent text-ink"
                  : "border-mist text-charcoal focus:border-sage"
              }`}
              style={doneToday ? { backgroundColor: habit.color } : undefined}
            />
          ) : (
            <button
              onClick={() => onToggle(habit.id)}
              aria-pressed={doneToday}
              aria-label={
                doneToday ? `Mark ${habit.name} not done` : `Mark ${habit.name} done`
              }
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform active:scale-90"
              style={{
                borderColor: habit.color,
                backgroundColor: doneToday ? habit.color : "transparent",
              }}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className={`h-3.5 w-3.5 transition-opacity ${
                  doneToday ? "opacity-100" : "opacity-0"
                }`}
              >
                <path
                  d="M3 8.5L6.5 12L13 4"
                  stroke="#fafaf9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Title & Badges */}
          <div className="min-w-0">
            <Link
              href={`/habit/${habit.id}`}
              className="block truncate text-base font-semibold text-charcoal hover:underline"
            >
              {habit.name}
            </Link>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <span className="rounded-md bg-mist/70 px-1.5 py-0.5 text-[10px] font-medium text-charcoal">
                {habit.domain}
              </span>
              <span>{habit.userLabel}</span>
              <span>·</span>
              <span>{frequencyLabel(habit.frequency)}</span>
              {habit.target && (
                <span>
                  · goal {habit.target.goal} {habit.target.unit}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(habit.id)}
          aria-label={`Delete ${habit.name}`}
          className="p-1 text-base text-muted opacity-0 transition-opacity hover:text-ember group-hover:opacity-100"
        >
          &times;
        </button>
      </div>

      {/* Footer: Stem Chart & Stats */}
      <div className="mt-4 flex items-end justify-between border-t border-mist/50 pt-3">
        <StreakStem history={habit.history} color={habit.color} />

        <div className="whitespace-nowrap text-right text-xs tabular-nums text-muted">
          <div>
            <span className="font-semibold text-charcoal">
              {Math.round(successRate.rate * 100)}%
            </span>{" "}
            success
          </div>
          <div>
            {onTrack ? (
              <span className={onTrack.onTrack ? "text-sage font-medium" : "text-ember font-medium"}>
                {onTrack.onTrack
                  ? "On track"
                  : `${onTrack.misses - onTrack.allowance} over`}
              </span>
            ) : weekProgress ? (
              `${weekProgress.completed}/${weekProgress.target} this wk`
            ) : streak > 0 ? (
              `${streak}d streak`
            ) : (
              "—"
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
