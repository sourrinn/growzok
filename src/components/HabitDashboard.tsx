"use client";

import { useMemo, useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import AddHabit from "@/components/AddHabit";
import HabitList from "@/components/HabitList";
import TemplateStarterGrid from "@/components/TemplateStarterGrid";

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
        <TemplateStarterGrid onAdopt={addFromTemplate} />
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
