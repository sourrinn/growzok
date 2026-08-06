"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { HabitTemplate, TemplateHabitOverride } from "@/types/template";
import { useHabits } from "@/hooks/useHabits";
import { frequencyLabel } from "@/lib/frequency";

interface Props {
  template: HabitTemplate;
  onClose: () => void;
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

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export default function TemplateCustomizerModal({ template, onClose }: Props) {
  const router = useRouter();
  const { habits: existingHabits, addFromTemplate } = useHabits();

  // Maps for 2-tier duplicate matching: habitKey + normalized name
  const existingKeysSet = useMemo(() => {
    return new Set(
      existingHabits.map((h) => h.habitKey).filter((k): k is string => Boolean(k))
    );
  }, [existingHabits]);

  const existingNamesSet = useMemo(() => {
    return new Set(existingHabits.map((h) => normalizeName(h.name)));
  }, [existingHabits]);

  // Identify duplicate indices
  const duplicateIndices = useMemo(() => {
    const set = new Set<number>();
    template.habits.forEach((h, i) => {
      const keyMatch = h.habitKey && existingKeysSet.has(h.habitKey);
      const nameMatch = existingNamesSet.has(normalizeName(h.name));
      if (keyMatch || nameMatch) {
        set.add(i);
      }
    });
    return set;
  }, [template.habits, existingKeysSet, existingNamesSet]);

  // State: selected habits (exclude duplicates by default)
  const [selected, setSelected] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    template.habits.forEach((h, i) => {
      const keyMatch = h.habitKey && existingKeysSet.has(h.habitKey);
      const nameMatch = existingNamesSet.has(normalizeName(h.name));
      if (!keyMatch && !nameMatch) {
        initial.add(i);
      }
    });
    return initial;
  });

  const [goalOverrides, setGoalOverrides] = useState<Record<number, number>>(
    Object.fromEntries(
      template.habits.map((h, i) => [i, h.target?.goal ?? 0])
    )
  );
  const [submitting, setSubmitting] = useState(false);

  const toggleHabit = (idx: number) => {
    if (duplicateIndices.has(idx)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleAdopt = async () => {
    if (selected.size === 0) return;
    setSubmitting(true);

    const items: TemplateHabitOverride[] = Array.from(selected).map((idx) => {
      const h = template.habits[idx];
      const goalOverride = goalOverrides[idx];
      return {
        ...h,
        target:
          h.target && goalOverride > 0
            ? { ...h.target, goal: goalOverride }
            : h.target ?? null,
      };
    });

    await addFromTemplate(items, template.key);
    setSubmitting(false);
    onClose();
    router.push("/dashboard");
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Drawer / Modal */}
      <div className="w-full max-w-lg rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#e5e1d7] pb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#232f26]">{template.name}</h2>
            <p className="mt-0.5 text-xs text-[#737970]">{template.tagline}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-[#737970] transition-colors hover:bg-[#e5e1d7]/50 hover:text-[#232f26]"
          >
            ✕
          </button>
        </div>

        {/* Duplicate Info Banner */}
        {duplicateIndices.size > 0 && (
          <div className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 text-xs text-[#737970]">
            <span className="font-semibold text-[#232f26]">
              {duplicateIndices.size} habit{duplicateIndices.size === 1 ? "" : "s"} already active
            </span>{" "}
            in your account will be preserved to prevent duplicate clutter.
          </div>
        )}

        {/* Habit list */}
        <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {template.habits.map((habit, idx) => {
            const isDuplicate = duplicateIndices.has(idx);
            const isChecked = selected.has(idx);

            return (
              <li
                key={idx}
                className={`flex items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                  isDuplicate
                    ? "border-[#e5e1d7] bg-[#fbf9f5] opacity-60"
                    : isChecked
                      ? "border-[#232f26]/30 bg-white shadow-sm"
                      : "border-[#e5e1d7] bg-white opacity-50"
                }`}
              >
                <input
                  type="checkbox"
                  id={`habit-${idx}`}
                  checked={isChecked}
                  disabled={isDuplicate}
                  onChange={() => toggleHabit(idx)}
                  className="mt-0.5 h-4 w-4 accent-[#232f26] disabled:cursor-not-allowed"
                />
                <label
                  htmlFor={`habit-${idx}`}
                  className={`flex-1 ${isDuplicate ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-[#232f26]">{habit.name}</span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${domainColor(
                        habit.domain
                      )}`}
                    >
                      {habit.domain}
                    </span>
                    {isDuplicate && (
                      <span className="rounded-md bg-[#e3ede6] px-2 py-0.5 text-[10px] font-semibold text-[#406852]">
                        Already Active in Dashboard
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[#737970]">
                    {frequencyLabel(habit.frequency)}
                    {habit.timeOfDay && habit.timeOfDay !== "Anytime"
                      ? ` · ${habit.timeOfDay}`
                      : ""}
                  </p>
                </label>

                {/* Goal override input */}
                {habit.target && isChecked && !isDuplicate && (
                  <div className="flex shrink-0 items-center gap-1 text-xs">
                    <input
                      type="number"
                      min={1}
                      value={goalOverrides[idx] || ""}
                      onChange={(e) =>
                        setGoalOverrides((prev) => ({
                          ...prev,
                          [idx]: Number(e.target.value),
                        }))
                      }
                      aria-label={`Goal for ${habit.name}`}
                      className="w-14 rounded-lg border border-[#e5e1d7] bg-white px-2 py-1 text-center font-semibold text-[#232f26] outline-none focus:border-[#232f26]"
                    />
                    <span className="text-[10px] text-[#737970]">{habit.target.unit}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-[#e5e1d7] pt-4">
          <p className="text-xs text-[#737970]">
            <span className="font-semibold text-[#232f26]">{selected.size}</span> of{" "}
            {template.habits.length} selected for adoption
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-[#e5e1d7] bg-white px-4 py-2 text-xs font-semibold text-[#737970] transition-colors hover:text-[#232f26]"
            >
              Cancel
            </button>
            <button
              onClick={handleAdopt}
              disabled={selected.size === 0 || submitting}
              className="rounded-xl bg-[#232f26] px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {submitting
                ? "Adding…"
                : selected.size === 0
                  ? "All Habits Already Active"
                  : `Add ${selected.size} New Habit${selected.size === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
