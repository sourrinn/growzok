import type { Habit } from "@/types/habit";

export interface HabitSynergyPair {
  habitA: Habit;
  habitB: Habit;
  /** Percentage point boost (e.g. +38%) */
  boostPct: number;
  baselineRate: number;
  boostedRate: number;
  insightText: string;
}

/**
 * Computes co-occurrence statistics across habit history.
 * Identifies habit pairs where completing Habit A significantly boosts Habit B's completion.
 */
export function computeHabitSynergies(habits: Habit[]): HabitSynergyPair[] {
  if (habits.length < 2) return [];

  const pairs: HabitSynergyPair[] = [];

  for (let i = 0; i < habits.length; i++) {
    for (let j = 0; j < habits.length; j++) {
      if (i === j) continue;
      const habitA = habits[i];
      const habitB = habits[j];

      // Need at least 5 logs on habitA to draw statistical correlation
      if (habitA.history.length < 5) continue;

      const historyA = new Set(habitA.history);
      const historyB = new Set(habitB.history);

      // Total days Habit B was logged when Habit A was ALSO logged
      let bGivenALoggedCount = 0;
      for (const date of habitA.history) {
        if (historyB.has(date)) {
          bGivenALoggedCount++;
        }
      }

      // Baseline rate of Habit B across its total active lifetime
      const bBaselineRate = habitB.history.length / Math.max(1, habitA.history.length);
      const bGivenARate = bGivenALoggedCount / Math.max(1, habitA.history.length);

      const boost = Math.round((bGivenARate - bBaselineRate) * 100);

      // Only include meaningful positive synergies (>= +15% boost)
      if (boost >= 15 && bGivenALoggedCount >= 3) {
        pairs.push({
          habitA,
          habitB,
          boostPct: boost,
          baselineRate: Math.round(bBaselineRate * 100),
          boostedRate: Math.round(bGivenARate * 100),
          insightText: `On days you log ${habitA.name}, completion of ${habitB.name} is ${boost}% higher.`,
        });
      }
    }
  }

  // Sort by highest boost percentage descending
  return pairs.sort((a, b) => b.boostPct - a.boostPct).slice(0, 4);
}
