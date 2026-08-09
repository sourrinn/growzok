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

import CustomSelect from "@/components/CustomSelect";
import ConfirmActionModal, { type ConfirmAddData } from "@/components/ConfirmActionModal";

type FrequencyKind = "daily" | "weekdays" | "weekends" | "timesPerWeek" | "custom";

const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const TARGET_TYPES: { value: HabitTargetType; label: string }[] = [
  { value: "count", label: "Count" },
  { value: "time", label: "Time" },
  { value: "distance", label: "Distance" },
  { value: "currency", label: "Currency" },
];

const FREQ_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "timesPerWeek", label: "Times per week" },
  { value: "custom", label: "Custom days" },
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

  const [pendingInput, setPendingInput] = useState<{
    input: NewHabitInput;
    summary: ConfirmAddData;
  } | null>(null);

  const toggleDay = (day: number) => {
    setCustomDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const submit = () => {
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

    const scheduleLabel =
      freqKind === "timesPerWeek"
        ? `${times}× / week`
        : freqKind === "custom"
          ? "Custom days"
          : freqKind.charAt(0).toUpperCase() + freqKind.slice(1);

    const targetGoalLabel = target ? `${target.goal} ${target.unit || target.type}` : undefined;

    setPendingInput({
      input: { name, category, domain, userLabel, frequency, target, missAllowance },
      summary: { name, domain, userLabel, scheduleLabel, targetGoalLabel },
    });
  };

  const handleConfirmAdd = async (_reason: string) => {
    if (!pendingInput) return;
    setValue("");
    await onAdd(pendingInput.input);
    setPendingInput(null);
  };

  return (
    <div className="mb-8 rounded-2xl border border-[#e5e1d7] bg-white p-4 shadow-sm transition-all dark:border-[#27272a] dark:bg-[#18181b] focus-within:border-[#232f26]/40 dark:focus-within:border-[#3f3f46] focus-within:shadow-md">
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
          className="flex-1 bg-transparent py-1.5 text-base font-medium text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
        />
        <button
          onClick={submit}
          className="rounded-xl bg-[#232f26] px-5 py-2.5 text-xs font-semibold text-white dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46] transition-all hover:bg-black dark:hover:bg-[#3f3f46] active:scale-[0.98]"
        >
          Plant Habit
        </button>
      </div>

      {/* Interactive Pill Controls Row */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#e5e1d7]/60 dark:border-[#27272a] pt-3 text-xs">
        {/* User Label / Category */}
        <div className="flex items-center gap-1 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a] px-3 py-1.5 font-medium text-[#232f26] dark:text-[#f4f4f5]">
          <span className="text-[10px] text-[#737970] dark:text-[#a1a1aa]">Label:</span>
          <input
            type="text"
            value={userLabel}
            onChange={(e) => setUserLabel(e.target.value.slice(0, 30))}
            placeholder="Personal"
            aria-label="Label"
            className="w-20 bg-transparent text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
          />
        </div>

        {/* Biological Domain Dropdown */}
        <CustomSelect
          prefixLabel="Domain: "
          options={HABIT_DOMAINS.map((d) => ({ value: d, label: d }))}
          value={domain}
          onChange={(val) => setDomain(val as HabitDomain)}
        />

        {/* Schedule / Frequency Dropdown */}
        <CustomSelect
          prefixLabel="Schedule: "
          options={FREQ_OPTIONS}
          value={freqKind}
          onChange={(val) => setFreqKind(val as FrequencyKind)}
        />

        {freqKind === "timesPerWeek" && (
          <CustomSelect
            options={[1, 2, 3, 4, 5, 6, 7].map((n) => ({
              value: String(n),
              label: `${n}x / week`,
            }))}
            value={String(times)}
            onChange={(val) => setTimes(Number(val))}
          />
        )}

        {freqKind === "custom" && (
          <div className="flex items-center gap-1 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a] p-1">
            {WEEKDAY_SHORT.map((label, day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                aria-pressed={customDays.has(day)}
                className={`h-6 w-6 rounded-lg text-[10px] font-bold transition-all ${
                  customDays.has(day)
                    ? "bg-[#232f26] text-white dark:bg-[#3f3f46] dark:text-[#f4f4f5]"
                    : "text-[#737970] dark:text-[#a1a1aa] hover:bg-[#e5e1d7]/50 dark:hover:bg-[#3f3f46] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
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
              ? "border-[#406852] bg-[#e3ede6] text-[#406852] dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#f4f4f5] font-semibold"
              : "border-[#e5e1d7] bg-white text-[#737970] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#a1a1aa] hover:border-[#232f26]/30 dark:hover:border-[#3f3f46] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
          }`}
        >
          {showAdvanced ? "Hide Goal Config" : "Add Numeric Goal"}
        </button>
      </div>

      {/* Expandable Advanced Options Box */}
      {showAdvanced && (
        <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-[#e5e1d7]/60 dark:border-[#27272a] pt-3 text-xs text-[#737970] dark:text-[#a1a1aa]">
          {/* Numeric Target Checkbox & Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 font-medium text-[#232f26] dark:text-[#f4f4f5] cursor-pointer">
              <input
                type="checkbox"
                checked={hasTarget}
                onChange={(e) => setHasTarget(e.target.checked)}
                className="rounded accent-[#232f26] dark:accent-[#f4f4f5]"
              />
              Track target number
            </label>

            {hasTarget && (
              <div className="flex items-center gap-2 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a] p-1.5">
                <CustomSelect
                  options={TARGET_TYPES}
                  value={targetType}
                  onChange={(val) => setTargetType(val as HabitTargetType)}
                />
                <input
                  type="number"
                  min={1}
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  aria-label="Goal number"
                  className="w-16 rounded-lg border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] px-2 py-1 text-center font-semibold text-[#232f26] dark:text-[#f4f4f5] outline-none"
                />
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="unit e.g. steps"
                  maxLength={20}
                  className="w-28 rounded-lg border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] px-2 py-1 font-medium text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
                />
              </div>
            )}
          </div>

          {/* Miss Allowance Picker */}
          {freqKind !== "timesPerWeek" && (
            <div className="flex items-center gap-2">
              <span>Allowed misses / week:</span>
              <CustomSelect
                options={[0, 1, 2, 3, 4, 5, 6, 7].map((n) => ({
                  value: String(n),
                  label: String(n),
                }))}
                value={String(missAllowance)}
                onChange={(val) => setMissAllowance(Number(val))}
              />
            </div>
          )}
        </div>
      )}

      {pendingInput && (
        <ConfirmActionModal
          type="add"
          addData={pendingInput.summary}
          onConfirm={handleConfirmAdd}
          onClose={() => setPendingInput(null)}
        />
      )}
    </div>
  );
}
