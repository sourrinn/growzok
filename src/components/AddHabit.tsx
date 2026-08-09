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
    <div className="mb-8 rounded-3xl border border-[#e5e1d7] bg-white p-4 sm:p-5 shadow-sm transition-all dark:border-[#27272a] dark:bg-[#18181b] focus-within:border-[#232f26]/40 dark:focus-within:border-[#3f3f46] space-y-3.5">
      {/* Primary Input Container */}
      <div className="relative rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] px-3.5 py-2.5 sm:px-4 sm:py-3 focus-within:border-[#406852] dark:focus-within:border-[#a3b899] transition-all">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          maxLength={60}
          placeholder="What habit do you want to plant today?"
          className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970]/80 dark:placeholder:text-[#a1a1aa]/80"
        />
      </div>

      {/* Interactive Controls Grid */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 pt-1 text-xs">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full">
          {/* Label Pill */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] px-3 py-2 font-medium text-[#232f26] dark:text-[#f4f4f5] justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa] shrink-0">
              Label
            </span>
            <input
              type="text"
              value={userLabel}
              onChange={(e) => setUserLabel(e.target.value.slice(0, 30))}
              placeholder="Personal"
              aria-label="Label"
              className="w-full text-right bg-transparent text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
            />
          </div>

          {/* Biological Domain Dropdown */}
          <CustomSelect
            prefixLabel="Domain "
            options={HABIT_DOMAINS.map((d) => ({ value: d, label: d }))}
            value={domain}
            onChange={(val) => setDomain(val as HabitDomain)}
            className="w-full sm:w-auto"
          />

          {/* Schedule Dropdown */}
          <CustomSelect
            prefixLabel="Schedule "
            options={FREQ_OPTIONS}
            value={freqKind}
            onChange={(val) => setFreqKind(val as FrequencyKind)}
            className="w-full sm:w-auto"
          />

          {/* Frequency Times per Week Selector */}
          {freqKind === "timesPerWeek" && (
            <CustomSelect
              options={[1, 2, 3, 4, 5, 6, 7].map((n) => ({
                value: String(n),
                label: `${n}x / week`,
              }))}
              value={String(times)}
              onChange={(val) => setTimes(Number(val))}
              className="w-full sm:w-auto"
            />
          )}

          {/* Goal Config Toggle Pill */}
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all text-center justify-center ${
              showAdvanced || hasTarget
                ? "border-[#406852] bg-[#406852]/10 text-[#406852] dark:border-[#a3b899] dark:bg-[#a3b899]/20 dark:text-[#a3b899]"
                : "border-[#e5e1d7] bg-[#fbf9f5] text-[#737970] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#a1a1aa] hover:border-[#232f26]/30 dark:hover:border-[#3f3f46] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
            }`}
          >
            {showAdvanced ? "Hide Goal Config" : "+ Numeric Goal"}
          </button>
        </div>

        {freqKind === "custom" && (
          <div className="flex items-center gap-1 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] p-1 w-full justify-between sm:w-auto mt-1 sm:mt-0">
            {WEEKDAY_SHORT.map((label, day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                aria-pressed={customDays.has(day)}
                className={`h-7 flex-1 sm:flex-initial sm:w-7 rounded-lg text-[10px] font-bold transition-all ${
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
      </div>

      {/* Expandable Advanced Options Box */}
      {showAdvanced && (
        <div className="rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-3.5 dark:border-[#27272a] dark:bg-[#121215] space-y-3 text-xs animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="flex items-center gap-2 font-semibold text-[#232f26] dark:text-[#f4f4f5] cursor-pointer">
              <input
                type="checkbox"
                checked={hasTarget}
                onChange={(e) => setHasTarget(e.target.checked)}
                className="rounded accent-[#232f26] dark:accent-[#f4f4f5] h-4 w-4"
              />
              Track numeric target
            </label>

            {hasTarget && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-2">
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
                  className="w-16 rounded-lg border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] px-2 py-1 text-center font-bold text-[#232f26] dark:text-[#f4f4f5] outline-none text-xs"
                />
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="unit e.g. pages"
                  maxLength={20}
                  className="w-28 rounded-lg border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] px-2 py-1 font-medium text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa] text-xs"
                />
              </div>
            )}
          </div>

          {freqKind !== "timesPerWeek" && (
            <div className="flex items-center gap-2 text-xs text-[#737970] dark:text-[#a1a1aa]">
              <span>Allowed misses per week:</span>
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

      {/* Primary Action Button Bar */}
      <div className="pt-1">
        <button
          onClick={submit}
          className="w-full sm:w-auto sm:ml-auto rounded-xl bg-[#232f26] px-6 py-2.5 text-xs font-bold text-white dark:bg-[#f4f4f5] dark:text-[#18181b] dark:hover:bg-white transition-all hover:bg-black active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
        >
          <span>Plant Habit</span>
          <span>→</span>
        </button>
      </div>

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
