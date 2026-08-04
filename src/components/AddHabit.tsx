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

const selectClass =
  "bg-transparent border-b border-mist py-1 text-charcoal outline-none transition-colors focus:border-sage";
const smallInputClass =
  "w-16 border-b border-mist bg-transparent py-1 text-charcoal outline-none transition-colors focus:border-sage";

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

  const [showMore, setShowMore] = useState(false);
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

    // Derive category from userLabel for backward compat with existing analytics
    const category: HabitCategory =
      (HABIT_CATEGORIES as string[]).includes(userLabel)
        ? (userLabel as HabitCategory)
        : "Personal";

    setValue("");
    await onAdd({ name, category, domain, userLabel, frequency, target, missAllowance });
  };

  return (
    <div className="mb-9 space-y-2.5">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          maxLength={60}
          placeholder="Add a habit — e.g. Read 10 pages"
          className="flex-1 border-b border-mist bg-transparent px-0.5 py-2.5 text-base text-charcoal outline-none transition-colors placeholder:text-muted focus:border-sage"
        />
        <button
          onClick={submit}
          className="rounded-sm bg-charcoal px-5 text-sm font-medium text-ink transition-opacity hover:opacity-80 active:opacity-60"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        {/* User Label — dashboard filter */}
        <input
          type="text"
          value={userLabel}
          onChange={(e) => setUserLabel(e.target.value.slice(0, 30))}
          placeholder="Label (e.g. Health)"
          aria-label="Label"
          className="w-28 border-b border-mist bg-transparent py-1 text-charcoal outline-none transition-colors placeholder:text-muted focus:border-sage"
        />

        {/* Scientific domain */}
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value as HabitDomain)}
          className={selectClass}
          aria-label="Domain"
        >
          {HABIT_DOMAINS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={freqKind}
          onChange={(e) => setFreqKind(e.target.value as FrequencyKind)}
          className={selectClass}
          aria-label="Frequency"
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
            className={selectClass}
            aria-label="Times per week"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>
                {n}x
              </option>
            ))}
          </select>
        )}

        {freqKind === "custom" && (
          <div className="flex gap-1" role="group" aria-label="Days of the week">
            {WEEKDAY_SHORT.map((label, day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                aria-pressed={customDays.has(day)}
                className={`h-6 w-6 rounded-full text-xs transition-colors ${
                  customDays.has(day)
                    ? "bg-charcoal text-ink"
                    : "bg-mist text-muted hover:text-charcoal"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="text-muted underline-offset-2 hover:text-charcoal hover:underline"
        >
          {showMore ? "Fewer options" : "More options"}
        </button>
      </div>

      {showMore && (
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          {freqKind !== "timesPerWeek" && (
            <label className="flex items-center gap-1.5">
              Allowed misses/week
              <select
                value={missAllowance}
                onChange={(e) => setMissAllowance(Number(e.target.value))}
                className={selectClass}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={hasTarget}
              onChange={(e) => setHasTarget(e.target.checked)}
            />
            Track a number
          </label>

          {hasTarget && (
            <>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as HabitTargetType)}
                className={selectClass}
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
                className={smallInputClass}
                aria-label="Goal"
              />
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="unit, e.g. glasses"
                maxLength={20}
                className="w-32 border-b border-mist bg-transparent py-1 text-charcoal outline-none transition-colors placeholder:text-muted focus:border-sage"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
