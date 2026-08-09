"use client";

import { useState } from "react";
import Link from "next/link";
import { todayStr } from "@/lib/dates";
import { computeCurrentStreak } from "@/lib/analytics";
import { frequencyLabel } from "@/lib/frequency";
import HabitSymbolIcon from "@/components/HabitSymbolIcon";
import type { Habit } from "@/types/habit";

interface Props {
  habit: Habit;
  isManaging?: boolean;
  onToggle: (id: string) => void;
  onLogProgress: (id: string, current: number) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const DOMAIN_COLORS: Record<string, string> = {
  Sleep: "bg-[#e8ebf5] text-[#2c3e6b]",
  Hydration: "bg-[#e2f0f4] text-[#1f5669]",
  Nutrition: "bg-[#e8f1e3] text-[#345c29]",
  Cardio: "bg-[#f5e9e5] text-[#7a3322]",
  Strength: "bg-[#f4efe2] text-[#6b4923]",
  Mobility: "bg-[#e5f2ee] text-[#235848]",
  Breathing: "bg-[#e0f2f5] text-[#1b5e6b]",
  Grooming: "bg-[#f5e8ed] text-[#6e2840]",
  Preventive: "bg-[#f5f0df] text-[#6e561c]",
  Recovery: "bg-[#eee8f5] text-[#502e6b]",
  Productivity: "bg-[#e3ede6] text-[#232f26]",
  Finance: "bg-[#e4ede6] text-[#2d4a3e]",
  Social: "bg-[#f5e8e3] text-[#7a422d]",
  Learning: "bg-[#ebdcd3] text-[#5c3e31]",
  "Digital Minimalism": "bg-[#e5e1d7] text-[#424541]",
  "Gut Health": "bg-[#e8f0e5] text-[#385c2c]",
};

function domainColor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? "bg-[#e5e1d7] text-[#232f26]";
}

export default function CompactHabitRow({
  habit,
  isManaging = false,
  onToggle,
  onLogProgress,
  onEdit,
  onDelete,
}: Props) {
  const today = todayStr();
  const isDone = habit.history.includes(today);
  const currentVal = habit.progress?.[today] ?? (isDone ? habit.target?.goal ?? 1 : 0);
  const streak = computeCurrentStreak(habit);

  const target = habit.target;
  const isNumeric = Boolean(target && target.goal > 1);
  const targetGoal = target?.goal ?? 1;

  const [inputVal, setInputVal] = useState(String(currentVal));
  const [editingTarget, setEditingTarget] = useState(false);

  const handleCheckboxClick = () => {
    onToggle(habit.id);
  };

  const handleSaveProgress = () => {
    const num = Math.max(0, parseInt(inputVal, 10) || 0);
    onLogProgress(habit.id, num);
    setEditingTarget(false);
  };

  return (
    <div
      className={`group flex items-center justify-between gap-3 rounded-xl border p-3 transition-all ${
        isDone
          ? "border-[#e5e1d7]/60 bg-[#fbf9f5]/60 dark:border-[#27272a]/60 dark:bg-[#18181b]/50 opacity-90"
          : "border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] hover:border-[#232f26]/30 dark:hover:border-[#3f3f46] shadow-xs"
      }`}
    >
      {/* Left Checkbox & Habit Name */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={handleCheckboxClick}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
            isDone
              ? "border-[#406852] bg-[#232f26] text-white dark:border-[#f4f4f5] dark:bg-[#f4f4f5] dark:text-[#18181b]"
              : "border-[#e5e1d7] bg-white dark:border-[#3f3f46] dark:bg-[#27272a] hover:border-[#232f26]"
          }`}
          aria-label={isDone ? `Mark ${habit.name} incomplete` : `Mark ${habit.name} complete`}
        >
          {isDone && (
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
              <path
                d="M3 8.5L6.5 12L13 4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <HabitSymbolIcon domain={habit.domain} habitName={habit.name} className="h-4 w-4 shrink-0 text-[#737970] dark:text-[#a1a1aa]" />
            <Link
              href={`/habit/${habit.id}`}
              className={`truncate text-sm font-semibold transition-colors hover:underline ${
                isDone
                  ? "text-[#737970] line-through dark:text-[#a1a1aa]"
                  : "text-[#232f26] dark:text-[#f4f4f5]"
              }`}
            >
              {habit.name}
            </Link>

            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${domainColor(
                habit.domain
              )}`}
            >
              {habit.domain}
            </span>

            {habit.templateKey && (
              <span className="rounded-full bg-[#e3ede6] dark:bg-[#27272a] px-2 py-0.5 text-[10px] font-bold text-[#406852] dark:text-[#a1a1aa]">
                ◈ Protocol
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Metrics & Target Inputs */}
      <div className="flex items-center gap-3 shrink-0 text-xs">
        {/* Streak Badge */}
        {streak > 0 && (
          <span className="hidden sm:inline-flex rounded-full bg-[#f4efe2] dark:bg-[#27272a] px-2 py-0.5 text-[10px] font-bold text-[#6b4923] dark:text-[#d4cca9]">
            🔥 {streak}d
          </span>
        )}

        {/* Target Progress Control */}
        {isNumeric && target ? (
          editingTarget ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={99999}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-14 rounded-lg border border-[#e5e1d7] bg-white px-2 py-0.5 text-center text-xs font-semibold text-[#232f26] dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#f4f4f5] outline-none"
                autoFocus
              />
              <span className="text-[#737970] dark:text-[#a1a1aa]">/ {target.goal}</span>
              <button
                type="button"
                onClick={handleSaveProgress}
                className="rounded-lg bg-[#232f26] px-2 py-0.5 text-[10px] font-bold text-white dark:bg-[#27272a] dark:text-[#f4f4f5]"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setInputVal(String(currentVal));
                setEditingTarget(true);
              }}
              className="rounded-lg border border-[#e5e1d7] bg-[#fbf9f5] px-2.5 py-1 text-xs font-semibold text-[#232f26] dark:border-[#27272a] dark:bg-[#27272a] dark:text-[#f4f4f5] hover:bg-white"
            >
              {currentVal} / {target.goal} {target.unit}
            </button>
          )
        ) : (
          <span className="hidden sm:inline text-xs text-[#737970] dark:text-[#a1a1aa]">
            {frequencyLabel(habit.frequency)}
          </span>
        )}

        {/* Management Mode Edit / Delete Controls */}
        {isManaging && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(habit)}
              className="rounded-lg border border-[#e5e1d7] bg-white px-2 py-1 text-[11px] font-semibold text-[#232f26] dark:border-[#27272a] dark:bg-[#27272a] dark:text-[#f4f4f5]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(habit.id)}
              className="rounded-lg border border-[#be5a38]/30 bg-[#be5a38]/10 px-2 py-1 text-[11px] font-semibold text-[#be5a38]"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
