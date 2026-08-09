import type { Habit } from "@/types/habit";

/**
 * Given a list of active habits and a starting habit ID,
 * returns the sequence of habits chained via `stackedAfterId`.
 */
export function getHabitStackSequence(habits: Habit[], startHabitId: string): Habit[] {
  const habitMap = new Map(habits.map((h) => [h.id, h]));
  const startHabit = habitMap.get(startHabitId);
  if (!startHabit) return [];

  const sequence: Habit[] = [startHabit];
  const visited = new Set<string>([startHabitId]);

  let currentId = startHabitId;
  while (true) {
    // Find any habit that is stacked AFTER currentId
    const nextHabit = habits.find((h) => h.stackedAfterId === currentId && !visited.has(h.id));
    if (!nextHabit) break;

    sequence.push(nextHabit);
    visited.add(nextHabit.id);
    currentId = nextHabit.id;
  }

  return sequence;
}

/**
 * Returns the name of the antecedent habit that `habit` is stacked after.
 */
export function getStackedAfterHabitName(habits: Habit[], stackedAfterId?: string): string | null {
  if (!stackedAfterId) return null;
  const parent = habits.find((h) => h.id === stackedAfterId);
  return parent ? parent.name : null;
}
