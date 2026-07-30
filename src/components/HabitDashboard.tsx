"use client";

import { useHabits } from "@/hooks/useHabits";
import AddHabit from "@/components/AddHabit";
import HabitList from "@/components/HabitList";

export default function HabitDashboard() {
  const { habits, loading, error, addHabit, toggleHabit, deleteHabit } =
    useHabits();

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <header className="mb-10">
        <h1 className="font-display text-4xl font-medium tracking-tight text-charcoal">
          Habits
        </h1>
        <p className="mt-1 text-sm tabular-nums text-muted">{today}</p>
      </header>

      <AddHabit onAdd={addHabit} />

      {error && (
        <p className="mb-6 rounded border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-ember">
          {error}
        </p>
      )}

      <HabitList
        habits={habits}
        loading={loading}
        onToggle={toggleHabit}
        onDelete={deleteHabit}
      />
    </div>
  );
}
