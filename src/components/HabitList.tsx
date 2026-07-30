"use client";

import type { Habit } from "@/types/habit";
import HabitCard from "@/components/HabitCard";

interface Props {
  habits: Habit[];
  loading: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitList({ habits, loading, onToggle, onDelete }: Props) {
  if (loading) {
    return <p className="py-16 text-center text-sm text-muted">Loading…</p>;
  }

  if (habits.length === 0) {
    return (
      <p className="py-16 text-center font-display text-lg italic text-muted">
        Nothing planted yet. Add your first habit above.
      </p>
    );
  }

  return (
    <ul className="border-t border-mist">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
