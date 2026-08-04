"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HabitTemplate, TemplateHabitOverride } from "@/types/template";
import { useHabits } from "@/hooks/useHabits";
import { frequencyLabel } from "@/lib/frequency";

interface Props {
  template: HabitTemplate;
  onClose: () => void;
}

const DOMAIN_COLORS: Record<string, string> = {
  Sleep: "bg-indigo-50 text-indigo-700",
  Hydration: "bg-sky-50 text-sky-700",
  Nutrition: "bg-lime-50 text-lime-700",
  Cardio: "bg-red-50 text-red-700",
  Strength: "bg-orange-50 text-orange-700",
  Mobility: "bg-teal-50 text-teal-700",
  Breathing: "bg-cyan-50 text-cyan-700",
  Grooming: "bg-rose-50 text-rose-700",
  Preventive: "bg-yellow-50 text-yellow-700",
  Recovery: "bg-purple-50 text-purple-700",
  Productivity: "bg-blue-50 text-blue-700",
  Finance: "bg-emerald-50 text-emerald-700",
  Social: "bg-pink-50 text-pink-700",
  Learning: "bg-violet-50 text-violet-700",
  "Digital Minimalism": "bg-slate-100 text-slate-700",
  "Gut Health": "bg-green-50 text-green-700",
};

function domainColor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? "bg-mist text-charcoal";
}

export default function TemplateCustomizerModal({ template, onClose }: Props) {
  const router = useRouter();
  const { addFromTemplate } = useHabits();

  // State: selected habits and per-habit goal overrides
  const [selected, setSelected] = useState<Set<number>>(
    new Set(template.habits.map((_, i) => i))
  );
  const [goalOverrides, setGoalOverrides] = useState<Record<number, number>>(
    Object.fromEntries(
      template.habits.map((h, i) => [i, h.target?.goal ?? 0])
    )
  );
  const [submitting, setSubmitting] = useState(false);

  const toggleHabit = (idx: number) => {
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

    await addFromTemplate(items);
    setSubmitting(false);
    onClose();
    router.push("/");
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
      <div className="w-full max-w-lg rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-charcoal">{template.name}</h2>
            <p className="mt-0.5 text-sm text-muted">{template.tagline}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-muted transition-colors hover:bg-mist hover:text-charcoal"
          >
            ✕
          </button>
        </div>

        {/* Habit list */}
        <ul className="mb-5 space-y-3 max-h-72 overflow-y-auto">
          {template.habits.map((habit, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                selected.has(idx)
                  ? "border-charcoal/20 bg-mist/30"
                  : "border-mist bg-white opacity-50"
              }`}
            >
              <input
                type="checkbox"
                id={`habit-${idx}`}
                checked={selected.has(idx)}
                onChange={() => toggleHabit(idx)}
                className="mt-0.5 h-4 w-4 accent-charcoal"
              />
              <label htmlFor={`habit-${idx}`} className="flex-1 cursor-pointer">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-charcoal">{habit.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${domainColor(habit.domain)}`}
                  >
                    {habit.domain}
                  </span>
                  <span className="rounded-full bg-mist px-1.5 py-0.5 text-[10px] text-muted">
                    {habit.suggestedLabel}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  {frequencyLabel(habit.frequency)}
                  {habit.timeOfDay && habit.timeOfDay !== "Anytime"
                    ? ` · ${habit.timeOfDay}`
                    : ""}
                </p>
              </label>

              {/* Goal override input */}
              {habit.target && selected.has(idx) && (
                <div className="flex shrink-0 items-center gap-1 text-sm">
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
                    className="w-14 rounded border border-mist bg-transparent px-1.5 py-0.5 text-center text-charcoal outline-none focus:border-sage"
                  />
                  <span className="text-xs text-muted">{habit.target.unit}</span>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {selected.size} of {template.habits.length} habits selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-sm px-4 py-2 text-sm text-muted transition-colors hover:text-charcoal"
            >
              Cancel
            </button>
            <button
              onClick={handleAdopt}
              disabled={selected.size === 0 || submitting}
              className="rounded-sm bg-charcoal px-5 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              {submitting
                ? "Adding…"
                : `Add ${selected.size} Habit${selected.size === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
