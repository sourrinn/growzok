"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { HabitTemplate, TemplateHabitOverride } from "@/types/template";
import { HABIT_TEMPLATES } from "@/lib/templates";
import TemplateCustomizerModal from "@/components/TemplateCustomizerModal";

interface Props {
  onAdopt: (items: TemplateHabitOverride[]) => Promise<void>;
}

type GoalFilter = "All" | "Morning & Sleep" | "Focus & Career" | "Fitness & Recovery" | "Financial";

const DOMAIN_COLORS: Record<string, string> = {
  Sleep: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Hydration: "bg-sky-50 text-sky-700 border-sky-100",
  Nutrition: "bg-lime-50 text-lime-700 border-lime-100",
  Cardio: "bg-red-50 text-red-700 border-red-100",
  Strength: "bg-orange-50 text-orange-700 border-orange-100",
  Mobility: "bg-teal-50 text-teal-700 border-teal-100",
  Breathing: "bg-cyan-50 text-cyan-700 border-cyan-100",
  Grooming: "bg-rose-50 text-rose-700 border-rose-100",
  Preventive: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Recovery: "bg-purple-50 text-purple-700 border-purple-100",
  Productivity: "bg-blue-50 text-blue-700 border-blue-100",
  Finance: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Social: "bg-pink-50 text-pink-700 border-pink-100",
  Learning: "bg-violet-50 text-violet-700 border-violet-100",
  "Digital Minimalism": "bg-slate-100 text-slate-700 border-slate-200",
  "Gut Health": "bg-green-50 text-green-700 border-green-100",
};

function domainColor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? "bg-mist text-charcoal border-mist";
}

export default function TemplateStarterGrid({ onAdopt }: Props) {
  const [goalFilter, setGoalFilter] = useState<GoalFilter>("All");
  const [previewTemplate, setPreviewTemplate] = useState<HabitTemplate | null>(null);
  const [adoptingKey, setAdoptingKey] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    if (goalFilter === "All") return HABIT_TEMPLATES;
    return HABIT_TEMPLATES.filter((t) => {
      if (goalFilter === "Morning & Sleep")
        return t.category === "Morning Routine" || t.category === "Evening Wind-Down";
      if (goalFilter === "Focus & Career")
        return t.category === "Productivity & Focus" || t.category === "Developer & Career";
      if (goalFilter === "Fitness & Recovery")
        return t.category === "Fitness & Movement";
      if (goalFilter === "Financial")
        return t.category === "Financial Hygiene";
      return true;
    });
  }, [goalFilter]);

  const handleQuickAdopt = async (template: HabitTemplate) => {
    setAdoptingKey(template.key);
    try {
      await onAdopt(template.habits);
    } finally {
      setAdoptingKey(null);
    }
  };

  return (
    <div className="mb-10 rounded-2xl border border-mist/80 bg-gradient-to-b from-mist/20 to-transparent p-5 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-charcoal">
            ✨ Choose a preset habit system
          </h2>
          <p className="text-xs text-muted">
            Tap a system to adopt it instantly, or preview to select habits.
          </p>
        </div>

        <Link
          href="/templates"
          className="inline-flex items-center gap-1 text-xs font-medium text-charcoal transition-colors hover:text-sage"
        >
          Explore Marketplace →
        </Link>
      </div>

      {/* Goal Filter Tabs */}
      <div className="mb-5 flex flex-wrap gap-1.5 border-b border-mist/60 pb-3">
        {(
          [
            "All",
            "Morning & Sleep",
            "Focus & Career",
            "Fitness & Recovery",
            "Financial",
          ] as GoalFilter[]
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setGoalFilter(tab)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              goalFilter === tab
                ? "bg-charcoal text-ink shadow-sm"
                : "border border-mist/80 bg-white text-muted hover:border-charcoal/30 hover:text-charcoal"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        {filteredTemplates.map((template) => {
          const isAdopting = adoptingKey === template.key;

          return (
            <div
              key={template.key}
              className="group flex flex-col justify-between rounded-xl border border-mist/80 bg-white p-4 shadow-sm transition-all hover:border-charcoal/30 hover:shadow-md"
            >
              <div>
                {/* Meta row */}
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-mist/60 px-2.5 py-0.5 text-[11px] font-medium text-charcoal">
                    {template.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <span className="tabular-nums">★ {template.rating.toFixed(1)}</span>
                    <span>·</span>
                    <span>~{template.estimatedDailyMinutes}m/day</span>
                  </div>
                </div>

                {/* Title & description */}
                <h3 className="text-sm font-semibold text-charcoal group-hover:text-black">
                  {template.name}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">
                  {template.tagline}
                </p>

                {/* Habit preview pills */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {template.habits.slice(0, 3).map((h, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${domainColor(
                        h.domain
                      )}`}
                    >
                      <span>{h.name}</span>
                    </span>
                  ))}
                  {template.habits.length > 3 && (
                    <span className="rounded-md border border-mist bg-mist/40 px-1.5 py-0.5 text-[10px] text-muted">
                      +{template.habits.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center gap-2 border-t border-mist/50 pt-3">
                <button
                  onClick={() => handleQuickAdopt(template)}
                  disabled={isAdopting}
                  className="flex-1 rounded-lg bg-charcoal py-1.5 text-xs font-medium text-ink transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
                >
                  {isAdopting ? "Adding..." : "+ One-Tap Add"}
                </button>
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="rounded-lg border border-mist bg-white px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-charcoal/40 hover:text-charcoal"
                >
                  Preview
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Marketplace Link Card */}
      <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-mist/80 bg-white/60 px-4 py-3 text-xs">
        <span className="text-muted">
          Looking for science-backed protocols or specialized developer routines?
        </span>
        <Link
          href="/templates"
          className="shrink-0 font-medium text-charcoal underline-offset-2 hover:underline"
        >
          Browse Full Marketplace →
        </Link>
      </div>

      {/* Modal when user clicks 'Preview' */}
      {previewTemplate && (
        <TemplateCustomizerModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
}
