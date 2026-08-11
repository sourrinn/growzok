"use client";

import { useMemo, useState } from "react";
import type { Habit } from "@/types/habit";
import HabitCard from "@/components/HabitCard";
import CompactHabitRow from "@/components/CompactHabitRow";
import type { EditHabitInput } from "@/hooks/useHabits";
import { SkeletonHabitCard } from "@/components/Skeleton";
import { HorseLoader } from "@/components/HorseLoader";
import EditHabitModal from "@/components/EditHabitModal";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import { todayStr } from "@/lib/dates";

interface Props {
  habits: Habit[];
  loading: boolean;
  isManaging?: boolean;
  viewMode?: "grid" | "compact";
  onToggle: (id: string) => void;
  onLogProgress: (id: string, value: number) => void;
  onEdit: (id: string, input: EditHabitInput) => Promise<void>;
  onDelete: (id: string) => void;
}

interface GroupSection {
  id: string;
  title: string;
  icon: string;
  habits: Habit[];
  defaultOpen: boolean;
}

export default function HabitList({
  habits,
  loading,
  isManaging = false,
  viewMode = "grid",
  onToggle,
  onLogProgress,
  onEdit,
  onDelete,
}: Props) {
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  // Accordion state tracking open/collapsed sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    completed: true, // Default collapse completed section when habits count is high
  });

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const today = todayStr();

  // Group habits by Time of Day & Completion status
  const sections = useMemo<GroupSection[]>(() => {
    if (habits.length <= 4) {
      return [
        {
          id: "all",
          title: "Active Routines",
          icon: "",
          habits,
          defaultOpen: true,
        },
      ];
    }

    const morning: Habit[] = [];
    const afternoon: Habit[] = [];
    const evening: Habit[] = [];
    const flexible: Habit[] = [];
    const completed: Habit[] = [];

    habits.forEach((h) => {
      const isDone = h.history.includes(today);
      if (isDone) {
        completed.push(h);
        return;
      }

      const label = (h.userLabel || "").toLowerCase();
      if (label.includes("morning")) morning.push(h);
      else if (label.includes("afternoon")) afternoon.push(h);
      else if (label.includes("evening") || label.includes("night")) evening.push(h);
      else flexible.push(h);
    });

    const result: GroupSection[] = [];

    if (morning.length > 0) {
      result.push({ id: "morning", title: "Morning Routines", icon: "", habits: morning, defaultOpen: true });
    }
    if (afternoon.length > 0) {
      result.push({ id: "afternoon", title: "Afternoon Focus", icon: "", habits: afternoon, defaultOpen: true });
    }
    if (evening.length > 0) {
      result.push({ id: "evening", title: "Evening Wind Down", icon: "", habits: evening, defaultOpen: true });
    }
    if (flexible.length > 0) {
      result.push({ id: "flexible", title: "Flexible & Anytime", icon: "", habits: flexible, defaultOpen: true });
    }
    if (completed.length > 0) {
      result.push({ id: "completed", title: "Completed Today", icon: "", habits: completed, defaultOpen: false });
    }

    return result;
  }, [habits, today]);

  if (loading) {
    return (
      <div className="space-y-6 py-4">
        <HorseLoader size="lg" label="Synchronizing Biological Rhythms..." />
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <SkeletonHabitCard delayClass="animation-delay-75" />
          <SkeletonHabitCard delayClass="animation-delay-150" />
        </div>
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

  const handleConfirmDelete = async (_reason: string) => {
    if (!deletingHabit) return;
    await onDelete(deletingHabit.id);
    setDeletingHabit(null);
  };

  return (
    <>
      <div className="space-y-6">
        {sections.map((section) => {
          const isCollapsed = Boolean(collapsedSections[section.id]);
          const showAccordionHeader = sections.length > 1;

          return (
            <div key={section.id} className="space-y-3">
              {/* Accordion Group Header */}
              {showAccordionHeader && (
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between border-b border-[#e5e1d7]/60 pb-2 text-left dark:border-[#27272a]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{section.icon}</span>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                      {section.title}
                    </h3>
                    <span className="rounded-full bg-[#e5e1d7]/60 dark:bg-[#27272a] px-2 py-0.5 text-[10px] font-bold text-[#232f26] dark:text-[#f4f4f5]">
                      {section.habits.length}
                    </span>
                  </div>

                  <span className="text-xs text-[#737970] dark:text-[#a1a1aa]">
                    {isCollapsed ? "▼ Expand" : "▲ Collapse"}
                  </span>
                </button>
              )}

              {/* Section Body */}
              {!isCollapsed && (
                <>
                  {viewMode === "compact" ? (
                    <div className="space-y-2">
                      {section.habits.map((habit) => (
                        <CompactHabitRow
                          key={habit.id}
                          habit={habit}
                          isManaging={isManaging}
                          onToggle={onToggle}
                          onLogProgress={onLogProgress}
                          onEdit={(h) => setEditingHabit(h)}
                          onDelete={(id) => {
                            const found = habits.find((item) => item.id === id);
                            if (found) setDeletingHabit(found);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                      {section.habits.map((habit) => (
                        <li key={habit.id} className="h-full">
                          <HabitCard
                            habit={habit}
                            isManaging={isManaging}
                            onToggle={onToggle}
                            onLogProgress={onLogProgress}
                            onEditClick={() => setEditingHabit(habit)}
                            onDeleteClick={() => setDeletingHabit(habit)}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onSave={onEdit}
          onClose={() => setEditingHabit(null)}
        />
      )}

      {deletingHabit && (
        <ConfirmActionModal
          type="delete"
          deleteData={{
            habitId: deletingHabit.id,
            habitName: deletingHabit.name,
            domain: deletingHabit.domain,
          }}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingHabit(null)}
        />
      )}
    </>
  );
}
