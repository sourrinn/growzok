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
    <li className="group flex items-center justify-between gap-4 border-b border-mist py-5">
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        {habit.target ? (
          <div className="flex shrink-0 items-center gap-1">
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
              className={`h-6.5 w-14 rounded-sm border px-1.5 text-center text-sm outline-none transition-colors ${
                doneToday
                  ? "border-transparent text-ink"
                  : "border-mist text-charcoal focus:border-sage"
              }`}
              style={doneToday ? { backgroundColor: habit.color } : undefined}
            />
          </div>
        ) : (
          <button
            onClick={() => onToggle(habit.id)}
            aria-pressed={doneToday}
            aria-label={
              doneToday ? `Mark ${habit.name} not done` : `Mark ${habit.name} done`
            }
            className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full border transition-transform active:scale-90"
            style={{
              borderColor: habit.color,
              backgroundColor: doneToday ? habit.color : "transparent",
            }}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className={`h-3 w-3 transition-opacity ${
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

        <div className="min-w-0">
          <Link
            href={`/habit/${habit.id}`}
            className="block truncate text-base font-medium text-charcoal hover:underline"
          >
            {habit.name}
          </Link>
          <p className="mt-0.5 truncate text-xs text-muted">
            {habit.category} · {frequencyLabel(habit.frequency)}
            {habit.target ? ` · goal ${habit.target.goal} ${habit.target.unit}` : ""}
          </p>
          <StreakStem history={habit.history} color={habit.color} />
        </div>
      </div>

      <div className="whitespace-nowrap text-right text-sm tabular-nums text-muted">
        <div>
          <span className="font-medium text-charcoal">
            {Math.round(successRate.rate * 100)}%
          </span>{" "}
          success
        </div>
        <div className="text-xs">
          {onTrack ? (
            <span className={onTrack.onTrack ? "text-sage" : "text-ember"}>
              {onTrack.onTrack
                ? "On track"
                : `${onTrack.misses - onTrack.allowance} over`}
            </span>
          ) : weekProgress ? (
            `${weekProgress.completed}/${weekProgress.target} this week`
          ) : streak > 0 ? (
            `${streak} day${streak === 1 ? "" : "s"}`
          ) : (
            "—"
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(habit.id)}
        aria-label={`Delete ${habit.name}`}
        className="p-1 text-lg leading-none text-muted opacity-0 transition-opacity hover:text-ember group-hover:opacity-100"
      >
        &times;
      </button>
    </li>
  );
}
