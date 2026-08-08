"use client";

import { useState } from "react";
import {
  HABIT_DOMAINS,
  type Habit,
  type HabitDomain,
  type HabitFrequency,
  type HabitTarget,
  type HabitTargetType,
} from "@/types/habit";
import type { EditHabitInput } from "@/hooks/useHabits";

interface Props {
  habit: Habit;
  onSave: (id: string, input: EditHabitInput) => Promise<void>;
  onClose: () => void;
}

type FrequencyKind = "daily" | "weekdays" | "weekends" | "timesPerWeek" | "custom";
const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const TARGET_TYPES: { value: HabitTargetType; label: string }[] = [
  { value: "count", label: "Count" },
  { value: "time", label: "Time" },
  { value: "distance", label: "Distance" },
  { value: "currency", label: "Currency" },
];

function freqKindFromFrequency(f: HabitFrequency): FrequencyKind {
  if (f.type === "timesPerWeek") return "timesPerWeek";
  if (f.type === "custom") return "custom";
  return f.type as FrequencyKind;
}

export default function EditHabitModal({ habit, onSave, onClose }: Props) {
  const [name, setName] = useState(habit.name);
  const [userLabel, setUserLabel] = useState(habit.userLabel);
  const [domain, setDomain] = useState<HabitDomain>(habit.domain);

  // Frequency
  const [freqKind, setFreqKind] = useState<FrequencyKind>(freqKindFromFrequency(habit.frequency));
  const [times, setTimes] = useState(
    habit.frequency.type === "timesPerWeek" ? habit.frequency.times : 3
  );
  const [customDays, setCustomDays] = useState<Set<number>>(
    habit.frequency.type === "custom" ? new Set(habit.frequency.days) : new Set([1, 2, 3, 4, 5])
  );
  const [missAllowance, setMissAllowance] = useState(habit.missAllowance);

  // Target/goal
  const [hasTarget, setHasTarget] = useState(Boolean(habit.target));
  const [targetType, setTargetType] = useState<HabitTargetType>(habit.target?.type ?? "count");
  const [goal, setGoal] = useState(habit.target?.goal ?? 1);
  const [unit, setUnit] = useState(habit.target?.unit ?? "");

  const [saving, setSaving] = useState(false);

  const toggleDay = (day: number) => {
    setCustomDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (freqKind === "custom" && customDays.size === 0) return;

    setSaving(true);

    const frequency: HabitFrequency =
      freqKind === "timesPerWeek"
        ? { type: "timesPerWeek", times }
        : freqKind === "custom"
          ? { type: "custom", days: Array.from(customDays) }
          : { type: freqKind };

    const target: HabitTarget | null =
      hasTarget && goal > 0
        ? { type: targetType, goal, unit: unit.trim().slice(0, 20) }
        : null;

    await onSave(habit.id, {
      name: name.trim(),
      userLabel,
      domain,
      frequency,
      target,
      missAllowance,
    });

    setSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e1d7] pb-3">
          <div>
            <h2 className="text-lg font-semibold text-[#232f26]">Edit Habit</h2>
            <p className="mt-0.5 text-xs text-[#737970]">Update name, goal, schedule, or label</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-[#737970] transition-colors hover:bg-[#e5e1d7]/50 hover:text-[#232f26]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Name */}
          <div>
            <label className="font-semibold text-[#232f26]">Habit Name</label>
            <input
              type="text"
              required
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-sm outline-none focus:border-[#232f26]/40"
            />
          </div>

          {/* Label + Domain */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-[#232f26]">Label</label>
              <input
                type="text"
                value={userLabel}
                onChange={(e) => setUserLabel(e.target.value.slice(0, 30))}
                className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 outline-none focus:border-[#232f26]/40"
              />
            </div>
            <div>
              <label className="font-semibold text-[#232f26]">Biological Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as HabitDomain)}
                className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 outline-none"
              >
                {HABIT_DOMAINS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="font-semibold text-[#232f26]">Schedule</label>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <select
                value={freqKind}
                onChange={(e) => setFreqKind(e.target.value as FrequencyKind)}
                className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3 py-2 text-xs font-semibold text-[#232f26] outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="timesPerWeek">Times per week</option>
                <option value="custom">Custom days</option>
              </select>

              {freqKind === "timesPerWeek" && (
                <select
                  value={times}
                  onChange={(e) => setTimes(Number(e.target.value))}
                  className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3 py-2 text-xs font-semibold text-[#232f26] outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <option key={n} value={n}>{n}× / week</option>
                  ))}
                </select>
              )}

              {freqKind === "custom" && (
                <div className="flex items-center gap-1 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-1">
                  {WEEKDAY_SHORT.map((lbl, day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`h-6 w-6 rounded-lg text-[10px] font-bold transition-all ${
                        customDays.has(day)
                          ? "bg-[#232f26] text-white"
                          : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26]"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Goal / Target */}
          <div className="space-y-2 border-t border-[#e5e1d7] pt-3">
            <label className="flex items-center gap-2 font-semibold text-[#232f26] cursor-pointer">
              <input
                type="checkbox"
                checked={hasTarget}
                onChange={(e) => setHasTarget(e.target.checked)}
                className="rounded accent-[#232f26]"
              />
              Track a numeric goal
            </label>

            {hasTarget && (
              <div className="flex items-center gap-2 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-2.5">
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as HabitTargetType)}
                  className="bg-transparent font-semibold text-[#232f26] outline-none"
                >
                  {TARGET_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="w-20 rounded-lg border border-[#e5e1d7] bg-white px-2 py-1.5 text-center font-semibold text-[#232f26] outline-none focus:border-[#232f26]/40"
                />
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="unit (e.g. steps)"
                  maxLength={20}
                  className="flex-1 rounded-lg border border-[#e5e1d7] bg-white px-2 py-1.5 text-[#232f26] outline-none placeholder:text-[#737970] focus:border-[#232f26]/40"
                />
              </div>
            )}
          </div>

          {/* Missed days allowance */}
          {freqKind !== "timesPerWeek" && (
            <div className="flex items-center gap-3">
              <label className="font-semibold text-[#232f26]">Allowed misses / week:</label>
              <select
                value={missAllowance}
                onChange={(e) => setMissAllowance(Number(e.target.value))}
                className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3 py-1.5 font-semibold text-[#232f26] outline-none"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-[#e5e1d7] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#e5e1d7] bg-white px-4 py-2 font-semibold text-[#737970] transition-colors hover:text-[#232f26]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#232f26] px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save Changes →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
