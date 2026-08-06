"use client";

import { useState } from "react";
import {
  HABIT_CATEGORIES,
  HABIT_DOMAINS,
  type HabitCategory,
  type HabitDomain,
  type HabitFrequency,
  type HabitTarget,
  type HabitTargetType,
} from "@/types/habit";
import type { NewHabitInput } from "@/hooks/useHabits";

type FrequencyKind = "daily" | "weekdays" | "weekends" | "timesPerWeek" | "custom";

const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const TARGET_TYPES: { value: HabitTargetType; label: string }[] = [
  { value: "count", label: "Count" },
  { value: "time", label: "Time" },
  { value: "distance", label: "Distance" },
  { value: "currency", label: "Currency" },
];

export default function AddHabit({
  onAdd,
}: {
  onAdd: (input: NewHabitInput) => void | Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [userLabel, setUserLabel] = useState("Personal");
  const [domain, setDomain] = useState<HabitDomain>("Productivity");
  const [freqKind, setFreqKind] = useState<FrequencyKind>("daily");
  const [times, setTimes] = useState(3);
  const [customDays, setCustomDays] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]));

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [missAllowance, setMissAllowance] = useState(0);
  const [hasTarget, setHasTarget] = useState(false);
  const [targetType, setTargetType] = useState<HabitTargetType>("count");
  const [goal, setGoal] = useState(1);
  const [unit, setUnit] = useState("");

  const toggleDay = (day: number) => {
    setCustomDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const submit = async () => {
    const name = value.trim();
    if (!name) return;
    if (freqKind === "custom" && customDays.size === 0) return;

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

    const category: HabitCategory =
      (HABIT_CATEGORIES as string[]).includes(userLabel)
        ? (userLabel as HabitCategory)
        : "Personal";

    setValue("");
    await onAdd({ name, category, domain, userLabel, frequency, target, missAllowance });
  };

  return (
    <div className="mb-8 rounded-2xl border border-[#e5e1d7] bg-white p-4 shadow-sm transition-all focus-within:border-[#232f26]/40 focus-within:shadow-md">
      {/* Primary Input Row */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          maxLength={60}
          placeholder="What habit do you want to plant today? e.g. Read 10 pages"
          className="flex-1 bg-transparent py-1.5 text-base font-medium text-[#232f26] outline-none placeholder:text-[#737970]"
        />
        <button
          onClick={submit}
          className="rounded-xl bg-[#232f26] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-black active:scale-[0.98]"
        >
          + Plant Habit
        </button>
      </div>

      {/* Interactive Pill Controls Row */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#e5e1d7]/60 pt-3 text-xs">
        {/* User Label / Category */}
        <div className="flex items-center gap-1 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3 py-1.5 font-medium text-[#232f26]">
          <span className="text-[10px] text-[#737970]">Label:</span>
          <input
            type="text"
            value={userLabel}
            onChange={(e) => setUserLabel(e.target.value.slice(0, 30))}
            placeholder="Personal"
            aria-label="Label"
            className="w-20 bg-transparent text-xs font-semibold text-[#232f26] outline-none placeholder:text-[#737970]"
          />
        </div>

        {/* Biological Domain Pill Dropdown */}
        <div className="flex items-center gap-1 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3 py-1.5 font-medium text-[#232f26]">
          <span className="text-[10px] text-[#737970]">Domain:</span>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value as HabitDomain)}
            className="bg-transparent text-xs font-semibold text-[#232f26] outline-none cursor-pointer"
            aria-label="Domain"
          >
            {HABIT_DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Schedule / Frequency Pill Dropdown */}
        <div className="flex items-center gap-1 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3 py-1.5 font-medium text-[#232f26]">
          <span className="text-[10px] text-[#737970]">Schedule:</span>
          <select
            value={freqKind}
            onChange={(e) => setFreqKind(e.target.value as FrequencyKind)}
            className="bg-transparent text-xs font-semibold text-[#232f26] outline-none cursor-pointer"
            aria-label="Frequency"
          >
            <option value="daily">Daily</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="timesPerWeek">Times per week</option>
            <option value="custom">Custom days</option>
          </select>
        </div>

        {freqKind === "timesPerWeek" && (
          <select
            value={times}
            onChange={(e) => setTimes(Number(e.target.value))}
            className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3 py-1.5 text-xs font-semibold text-[#232f26] outline-none cursor-pointer"
            aria-label="Times per week"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>
                {n}x / week
              </option>
            ))}
          </select>
        )}

        {freqKind === "custom" && (
          <div className="flex items-center gap-1 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-1">
            {WEEKDAY_SHORT.map((label, day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                aria-pressed={customDays.has(day)}
                className={`h-6 w-6 rounded-lg text-[10px] font-bold transition-all ${
                  customDays.has(day)
                    ? "bg-[#232f26] text-white"
                    : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Toggle Numeric Target & Advanced Config Button */}
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
            showAdvanced || hasTarget
              ? "border-[#406852] bg-[#e3ede6] text-[#406852] font-semibold"
              : "border-[#e5e1d7] bg-white text-[#737970] hover:border-[#232f26]/30 hover:text-[#232f26]"
          }`}
        >
          {showAdvanced ? "Hide Goal Config" : "+ Add Numeric Goal"}
        </button>
      </div>

      {/* Expandable Advanced Options Box */}
      {showAdvanced && (
        <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-[#e5e1d7]/60 pt-3 text-xs text-[#737970]">
          {/* Numeric Target Checkbox & Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 font-medium text-[#232f26] cursor-pointer">
              <input
                type="checkbox"
                checked={hasTarget}
                onChange={(e) => setHasTarget(e.target.checked)}
                className="rounded accent-[#232f26]"
              />
              Track target number
            </label>

            {hasTarget && (
              <div className="flex items-center gap-2 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-1.5">
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as HabitTargetType)}
                  className="bg-transparent font-semibold text-[#232f26] outline-none cursor-pointer"
                  aria-label="Target type"
                >
                  {TARGET_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  aria-label="Goal number"
                  className="w-16 rounded-lg border border-[#e5e1d7] bg-white px-2 py-1 text-center font-semibold text-[#232f26] outline-none"
                />
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="unit e.g. steps"
                  maxLength={20}
                  className="w-28 rounded-lg border border-[#e5e1d7] bg-white px-2 py-1 font-medium text-[#232f26] outline-none placeholder:text-[#737970]"
                />
              </div>
            )}
          </div>

          {/* Miss Allowance Picker */}
          {freqKind !== "timesPerWeek" && (
            <label className="flex items-center gap-2">
              <span>Allowed misses / week:</span>
              <select
                value={missAllowance}
                onChange={(e) => setMissAllowance(Number(e.target.value))}
                className="rounded-lg border border-[#e5e1d7] bg-white px-2.5 py-1 font-semibold text-[#232f26] outline-none cursor-pointer"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
    </div>
  );
}
