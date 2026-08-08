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
import EditHabitModal from "@/components/EditHabitModal";
import type { EditHabitInput } from "@/hooks/useHabits";

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
  onLogProgress: (id: string, value: number) => void;
  onEdit: (id: string, input: EditHabitInput) => Promise<void>;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, onToggle, onLogProgress, onEdit, onDelete }: Props) {
  const today = todayStr();
  const doneToday = habit.history.includes(today);
  const successRate = computeSuccessRate(habit);
  const streak = computeCurrentStreak(habit);
  const weekProgress = computeThisWeekProgress(habit);
  const onTrack = habit.missAllowance > 0 ? computeOnTrackStatus(habit) : null;

  const savedValue = habit.progress[today] !== undefined ? String(habit.progress[today]) : "";
  const [draftValue, setDraftValue] = useState(savedValue);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Sync draft value if saved progress changes externally
  const isDirty = draftValue !== savedValue;

  const handleSaveProgress = async () => {
    const num = Number(draftValue);
    if (!Number.isFinite(num) || num < 0) return;
    setIsSaving(true);
    try {
      await onLogProgress(habit.id, num);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setDraftValue(savedValue);
  };

  // Dynamic input width calculated based on digit length to prevent clipping numbers
  const inputWidthRem = Math.max(3.5, (draftValue || "0").length * 0.7 + 1.2);

  return (
    <li className="group relative flex flex-col justify-between rounded-xl border border-mist/80 bg-white p-4 shadow-sm transition-all hover:border-charcoal/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {/* Toggle / Target Input (Aligned Top Left) */}
        <div className="flex items-start gap-3">
          {habit.target ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <input
                type="number"
                min={0}
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveProgress();
                  if (e.key === "Escape") handleDiscard();
                }}
                aria-label={`Log today's ${habit.name}`}
                className={`h-8 shrink-0 rounded-lg border px-2 text-center text-sm font-semibold outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                  doneToday
                    ? "border-transparent text-white font-bold shadow-sm"
                    : "border-[#e5e1d7] bg-white text-[#232f26] focus:border-[#232f26]"
                }`}
                style={{
                  width: `${inputWidthRem}rem`,
                  backgroundColor: doneToday ? habit.color : undefined,
                }}
              />

              {/* Explicit Save and Discard Buttons */}
              {isDirty ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleSaveProgress}
                    disabled={isSaving}
                    title="Save progress (Enter)"
                    className="flex h-8 items-center gap-1 rounded-lg bg-[#232f26] px-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-black active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? (
                      "…"
                    ) : (
                      <>
                        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                          <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Save</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDiscard}
                    title="Discard changes (Esc)"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e1d7] text-xs font-semibold text-[#737970] transition-colors hover:bg-[#e5e1d7]/40 hover:text-[#232f26]"
                  >
                    ✕
                  </button>
                </div>
              ) : justSaved ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#e3ede6] px-2 py-1 text-[11px] font-semibold text-[#406852]">
                  <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Saved!
                </span>
              ) : null}
            </div>
          ) : (
            <button
              onClick={() => onToggle(habit.id)}
              aria-pressed={doneToday}
              aria-label={
                doneToday ? `Mark ${habit.name} not done` : `Mark ${habit.name} done`
              }
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-transform active:scale-90"
              style={{
                borderColor: habit.color,
                backgroundColor: doneToday ? habit.color : "transparent",
              }}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className={`h-4 w-4 transition-opacity ${
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
            {/* Provenance badge — subtle but informative */}
            <div className="mt-1">
              {habit.isPersonal ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f4efe2] px-2 py-0.5 text-[10px] font-semibold text-[#6b4923]">
                  ✦ Personal
                </span>
              ) : habit.templateKey ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e3ede6] px-2 py-0.5 text-[10px] font-semibold text-[#2d4a3e]">
                  ◈ Protocol
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Delete + Edit Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowEdit(true)}
            aria-label={`Edit ${habit.name}`}
            className="rounded-full p-1 text-sm text-muted opacity-0 transition-opacity hover:text-[#232f26] group-hover:opacity-100"
            title="Edit habit"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            aria-label={`Delete ${habit.name}`}
            className="p-1 text-base text-muted opacity-0 transition-opacity hover:text-ember group-hover:opacity-100"
          >
            &times;
          </button>
        </div>
      </div>

      {showEdit && (
        <EditHabitModal
          habit={habit}
          onSave={onEdit}
          onClose={() => setShowEdit(false)}
        />
      )}

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
