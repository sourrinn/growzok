import type { Habit } from "@/types/habit";
import { computeCurrentStreak, computeBestStreak } from "@/lib/analytics";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "streak" | "volume" | "mastery" | "lifestyle";
  unlocked: boolean;
  progressPct: number;
}

export interface UserLevelStats {
  xp: number;
  level: number;
  levelTitle: string;
  xpInCurrentLevel: number;
  xpRequiredForNextLevel: number;
  progressToNextLevelPct: number;
  totalCompletions: number;
  longestStreak: number;
  activeStreaksCount: number;
  badges: Badge[];
  unlockedBadgesCount: number;
}

const LEVEL_TITLES = [
  "Habit Novice",
  "Consistency Seeker",
  "Routine Builder",
  "Momentum Craftsman",
  "Habit Architect",
  "Discipline Scholar",
  "Master Optimizer",
  "Behavioral Titan",
  "Unstoppable Force",
  "Legendary Practitioner",
];

export function computeUserGamification(habits: Habit[]): UserLevelStats {
  let totalCompletions = 0;
  let longestStreak = 0;
  let activeStreaksCount = 0;
  let cardioStrengthCount = 0;
  let breathingMobilityCount = 0;
  let learningProductivityCount = 0;

  for (const habit of habits) {
    const completionsCount = habit.history.length;
    totalCompletions += completionsCount;

    const streak = computeCurrentStreak(habit);
    const maxStreak = computeBestStreak(habit);

    if (streak > 0) activeStreaksCount++;
    if (maxStreak > longestStreak) longestStreak = maxStreak;

    // Track domain totals for domain badges
    if (habit.domain === "Cardio" || habit.domain === "Strength") {
      cardioStrengthCount += completionsCount;
    }
    if (habit.domain === "Breathing" || habit.domain === "Mobility" || habit.domain === "Recovery") {
      breathingMobilityCount += completionsCount;
    }
    if (habit.domain === "Productivity" || habit.domain === "Learning") {
      learningProductivityCount += completionsCount;
    }
  }

  // XP Formula: (completions * 25) + (longestStreak * 50) + (activeStreaks * 30)
  const xp = totalCompletions * 25 + longestStreak * 50 + activeStreaksCount * 30;

  // Level formula: Level = floor(sqrt(XP / 50)) + 1
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const levelTitleIndex = Math.min(Math.floor((level - 1) / 2), LEVEL_TITLES.length - 1);
  const levelTitle = LEVEL_TITLES[levelTitleIndex];

  // XP thresholds for current level vs next level
  const currentLevelBaseXP = 50 * Math.pow(level - 1, 2);
  const nextLevelXP = 50 * Math.pow(level, 2);
  const xpInCurrentLevel = Math.max(0, xp - currentLevelBaseXP);
  const xpRequiredForNextLevel = Math.max(1, nextLevelXP - currentLevelBaseXP);
  const progressToNextLevelPct = Math.min(
    100,
    Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100)
  );

  // Milestone Badges Definition
  const badges: Badge[] = [
    {
      id: "first_step",
      name: "First Step",
      description: "Logged your first habit completion",
      icon: "🌱",
      category: "volume",
      unlocked: totalCompletions >= 1,
      progressPct: Math.min(100, Math.round((totalCompletions / 1) * 100)),
    },
    {
      id: "apprentice",
      name: "Habit Apprentice",
      description: "Reached 25 total habit completions",
      icon: "⚡",
      category: "volume",
      unlocked: totalCompletions >= 25,
      progressPct: Math.min(100, Math.round((totalCompletions / 25) * 100)),
    },
    {
      id: "centurion",
      name: "Habit Centurion",
      description: "Achieved 100 total habit completions",
      icon: "🛡️",
      category: "volume",
      unlocked: totalCompletions >= 100,
      progressPct: Math.min(100, Math.round((totalCompletions / 100) * 100)),
    },
    {
      id: "streak_7",
      name: "Week Warrior",
      description: "Maintained a 7-day active habit streak",
      icon: "🔥",
      category: "streak",
      unlocked: longestStreak >= 7,
      progressPct: Math.min(100, Math.round((longestStreak / 7) * 100)),
    },
    {
      id: "streak_30",
      name: "Iron Momentum",
      description: "Maintained a 30-day streak on any habit",
      icon: "💎",
      category: "streak",
      unlocked: longestStreak >= 30,
      progressPct: Math.min(100, Math.round((longestStreak / 30) * 100)),
    },
    {
      id: "physical_mastery",
      name: "Physical Titan",
      description: "Logged 20+ Strength or Cardio completions",
      icon: "🏋️",
      category: "mastery",
      unlocked: cardioStrengthCount >= 20,
      progressPct: Math.min(100, Math.round((cardioStrengthCount / 20) * 100)),
    },
    {
      id: "mind_mastery",
      name: "Zen Master",
      description: "Logged 20+ Breathing or Mobility completions",
      icon: "🧘",
      category: "mastery",
      unlocked: breathingMobilityCount >= 20,
      progressPct: Math.min(100, Math.round((breathingMobilityCount / 20) * 100)),
    },
    {
      id: "intellect_mastery",
      name: "Cognitive Architect",
      description: "Logged 20+ Productivity or Learning completions",
      icon: "🧠",
      category: "mastery",
      unlocked: learningProductivityCount >= 20,
      progressPct: Math.min(100, Math.round((learningProductivityCount / 20) * 100)),
    },
  ];

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return {
    xp,
    level,
    levelTitle,
    xpInCurrentLevel,
    xpRequiredForNextLevel,
    progressToNextLevelPct,
    totalCompletions,
    longestStreak,
    activeStreaksCount,
    badges,
    unlockedBadgesCount,
  };
}
