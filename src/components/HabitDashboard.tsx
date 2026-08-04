"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useHabits } from "@/hooks/useHabits";
import AddHabit from "@/components/AddHabit";
import HabitList from "@/components/HabitList";
import { HABIT_TEMPLATES } from "@/lib/templates";
import type { TemplateHabitOverride } from "@/types/template";

export default function HabitDashboard() {
  const {
    habits,
    loading,
    error,
    addHabit,
    addFromTemplate,
    toggleHabit,
    logProgress,
    deleteHabit,
  } = useHabits();

  const [filter, setFilter] = useState<string>("All");

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Filter tabs are built from userLabel, not category
  const labelsPresent = useMemo(
    () => Array.from(new Set(habits.map((h) => h.userLabel))),
    [habits]
  );
  const filterOptions = ["All", ...labelsPresent];
  const filteredHabits =
    filter === "All" ? habits : habits.filter((h) => h.userLabel === filter);

  const handleQuickTemplate = async (habits: TemplateHabitOverride[]) => {
    await addFromTemplate(habits);
  };

  return (
    <div>
      <header className="mb-10">
        <h1 className="font-display text-4xl font-medium tracking-tight text-charcoal">
          Habits
        </h1>
        <p className="mt-1 text-sm tabular-nums text-muted">{today}</p>
      </header>

      <AddHabit onAdd={addHabit} />

      {!loading && habits.length === 0 && (
        <div className="mb-9">
          <p className="mb-2 text-sm text-muted">Or start from a template:</p>
          <div className="flex flex-wrap gap-2">
            {HABIT_TEMPLATES.map((t) => (
              <button
                key={t.key}
                onClick={() => handleQuickTemplate(t.habits)}
                title={t.description}
                className="rounded-sm border border-mist px-3 py-1.5 text-sm text-muted transition-colors hover:text-charcoal"
              >
                + {t.name}
              </button>
            ))}
          </div>
          <Link
            href="/templates"
            className="mt-3 inline-block text-xs text-muted underline-offset-2 hover:text-charcoal hover:underline"
          >
            Browse all templates →
          </Link>
        </div>
      )}

      {error && (
        <p className="mb-6 rounded border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-ember">
          {error}
        </p>
      )}

      {labelsPresent.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {filterOptions.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-sm px-3 py-1 text-sm transition-colors ${
                filter === c ? "bg-charcoal text-ink" : "text-muted hover:text-charcoal"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <HabitList
        habits={filteredHabits}
        loading={loading}
        onToggle={toggleHabit}
        onLogProgress={logProgress}
        onDelete={deleteHabit}
      />
    </div>
  );
}
