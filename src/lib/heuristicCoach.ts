import type { Habit } from "@/types/habit";
import { successRateForRange } from "@/lib/analytics";
import { dateStrOffset, todayStr } from "@/lib/dates";

export type BehavioralInsightType = "burnout_risk" | "momentum_surge" | "target_adjustment" | "synergy_booster";

export interface BehavioralInsight {
  id: string;
  type: BehavioralInsightType;
  title: string;
  message: string;
  recommendation: string;
  severity: "info" | "success" | "warning";
  habitId?: string;
  habitName?: string;
}

/**
 * Evaluates user habit history 100% client-side with zero external API calls.
 * Returns tailored behavioral insights & coaching prompts based on velocity rules.
 */
export function generateBehavioralInsights(habits: Habit[]): BehavioralInsight[] {
  if (habits.length === 0) return [];

  const insights: BehavioralInsight[] = [];
  const today = todayStr();
  const last7Start = dateStrOffset(-6);
  const last30Start = dateStrOffset(-29);

  // 1. Momentum Surge Check: User completed 100% of habits for 3+ consecutive days
  const recent3Days = [dateStrOffset(0), dateStrOffset(-1), dateStrOffset(-2)];
  const isSurging = habits.length > 0 && recent3Days.every((d) =>
    habits.every((h) => h.history.includes(d))
  );

  if (isSurging) {
    insights.push({
      id: "momentum_surge_active",
      type: "momentum_surge",
      title: "🔥 High Momentum Detected",
      message: "You have completed 100% of your daily routines for 3 days straight.",
      recommendation: "Now is the optimal neurological window to stack a new high-value habit or raise daily focus duration.",
      severity: "success",
    });
  }

  // Check per-habit velocity shifts
  for (const habit of habits) {
    const rate7 = successRateForRange(habit, last7Start, today);
    const rate30 = successRateForRange(habit, last30Start, today);

    // 2. Burnout Risk Check: High 30-day consistency (>70%), but 7-day rate dropped significantly (<30%)
    if (rate30.rate >= 0.65 && rate7.rate <= 0.35 && rate7.trackable >= 5) {
      insights.push({
        id: `burnout_${habit.id}`,
        type: "burnout_risk",
        title: `⚠️ Fatigue Warning: ${habit.name}`,
        message: `Your 7-day completion rate (${Math.round(rate7.rate * 100)}%) has dropped below your 30-day baseline (${Math.round(rate30.rate * 100)}%).`,
        recommendation: "Reduce friction: scale back duration or target by 50% for 3 days to protect your identity momentum.",
        severity: "warning",
        habitId: habit.id,
        habitName: habit.name,
      });
    }

    // 3. Target Adjustment Suggestion: Long-standing habit struggling to pass 40% completion
    if (rate30.trackable >= 14 && rate30.rate > 0 && rate30.rate <= 0.35) {
      insights.push({
        id: `target_adj_${habit.id}`,
        type: "target_adjustment",
        title: `💡 Friction Reduction: ${habit.name}`,
        message: `Current 30-day execution rate is ${Math.round(rate30.rate * 100)}%. The target frequency may be set too high.`,
        recommendation: "Consider switching frequency to 'Weekdays' or lower the daily count to establish a reliable baseline.",
        severity: "info",
        habitId: habit.id,
        habitName: habit.name,
      });
    }

    // 4. Target Level-Up Alert: Target goal met 14 days straight!
    if (habit.target && rate30.trackable >= 14 && rate30.rate >= 0.95) {
      const suggestedGoal = Math.round(habit.target.goal * 1.2);
      insights.push({
        id: `target_levelup_${habit.id}`,
        type: "momentum_surge",
        title: `🚀 Goal Level-Up Ready: ${habit.name}`,
        message: `You've achieved 100% target consistency for 14 straight days! (${habit.target.goal} ${habit.target.unit})`,
        recommendation: `Consider upgrading your daily target to ${suggestedGoal} ${habit.target.unit} (+20%) to continue your physiological progress!`,
        severity: "success",
        habitId: habit.id,
        habitName: habit.name,
      });
    }
  }

  // 4. Default baseline insight if no warnings/surges active
  if (insights.length === 0 && habits.length >= 2) {
    insights.push({
      id: "baseline_healthy",
      type: "synergy_booster",
      title: "🌱 Steady Behavioral Cadence",
      message: "Your habits are progressing smoothly without sudden burnout signals.",
      recommendation: "Group complementary habits into Morning and Evening routines to minimize cognitive switching cost.",
      severity: "info",
    });
  }

  return insights.slice(0, 3); // Top 3 insights
}
