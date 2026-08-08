"use client";

import type { Habit } from "@/types/habit";
import HabitCard from "@/components/HabitCard";
import type { EditHabitInput } from "@/hooks/useHabits";

interface Props {
  habits: Habit[];
  loading: boolean;
  isManaging?: boolean;
  onToggle: (id: string) => void;
  onLogProgress: (id: string, value: number) => void;
  onEdit: (id: string, input: EditHabitInput) => Promise<void>;
  onDelete: (id: string) => void;
}

export default function HabitList({
  habits,
  loading,
  isManaging = false,
  onToggle,
  onLogProgress,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return <p className="py-16 text-center text-sm text-muted">Loading habits…</p>;
  }

  if (habits.length === 0) {
    return (
      <p className="py-16 text-center font-display text-lg italic text-muted">
        Nothing planted yet. Add your first habit above or pick a preset system.
      </p>
    );
  }

  return (
    <ul className="grid gap-3.5 sm:grid-cols-1 md:grid-cols-2">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          isManaging={isManaging}
          onToggle={onToggle}
          onLogProgress={onLogProgress}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
