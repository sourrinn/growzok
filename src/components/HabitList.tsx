"use client";

import { useState } from "react";
import type { Habit } from "@/types/habit";
import HabitCard from "@/components/HabitCard";
import type { EditHabitInput } from "@/hooks/useHabits";
import { SkeletonHabitCard } from "@/components/Skeleton";
import EditHabitModal from "@/components/EditHabitModal";

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
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        <SkeletonHabitCard delayClass="animation-delay-75" />
        <SkeletonHabitCard delayClass="animation-delay-150" />
        <SkeletonHabitCard delayClass="animation-delay-200" />
        <SkeletonHabitCard delayClass="animation-delay-300" />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#e5e1d7] dark:border-[#27272a] p-12 text-center animate-fade-in">
        <p className="font-display text-lg italic text-[#737970] dark:text-[#a1a1aa]">
          Nothing planted yet. Add your first habit above or pick a preset system.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {habits.map((habit, idx) => {
          const delays = [
            "animation-delay-75",
            "animation-delay-100",
            "animation-delay-150",
            "animation-delay-200",
            "animation-delay-300",
          ];
          const delayClass = delays[idx % delays.length];

          return (
            <li key={habit.id} className={`h-full animate-slide-up ${delayClass}`}>
              <HabitCard
                habit={habit}
                isManaging={isManaging}
                onToggle={onToggle}
                onLogProgress={onLogProgress}
                onEditClick={() => setEditingHabit(habit)}
                onDelete={onDelete}
              />
            </li>
          );
        })}
      </ul>

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onSave={onEdit}
          onClose={() => setEditingHabit(null)}
        />
      )}
    </>
  );
}
