"use client";

import type { Habit } from "@/types/habit";
import { computeStreak, todayStr } from "@/lib/dates";
import StreakStem from "@/components/StreakStem";

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, onToggle, onDelete }: Props) {
  const doneToday = habit.history.includes(todayStr());
  const streak = computeStreak(habit.history);

  return (
    <li className="group flex items-center justify-between gap-4 border-b border-mist py-5">
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <button
          onClick={() => onToggle(habit.id)}
          aria-pressed={doneToday}
          aria-label={
            doneToday ? `Mark ${habit.name} not done` : `Mark ${habit.name} done`
          }
          className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full border transition-transform active:scale-90"
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

        <div className="min-w-0">
          <p className="truncate text-base font-medium text-charcoal">
            {habit.name}
          </p>
          <StreakStem history={habit.history} color={habit.color} />
        </div>
      </div>

      <div className="whitespace-nowrap text-right text-sm tabular-nums text-muted">
        {streak > 0 ? (
          <span>
            <span className="font-medium text-charcoal">{streak}</span> day
            {streak === 1 ? "" : "s"}
          </span>
        ) : (
          "—"
        )}
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
