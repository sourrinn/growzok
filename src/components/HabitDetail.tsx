"use client";

import Link from "next/link";
import { useHabits } from "@/hooks/useHabits";
import {
  computeBestStreak,
  computeCurrentStreak,
  computeOnTrackStatus,
  computeSuccessRate,
  computeThisWeekProgress,
} from "@/lib/analytics";
import { computeCompletionTimeStats } from "@/lib/completionStats";
import { frequencyLabel } from "@/lib/frequency";
import { generateInsights } from "@/lib/insights";
import Heatmap from "@/components/Heatmap";
import StatTile from "@/components/StatTile";

export default function HabitDetail({ habitId }: { habitId: string }) {
  const { habits, loading } = useHabits();

  if (loading) {
    return <p className="py-16 text-center text-sm text-muted">Loading…</p>;
  }

  const habit = habits.find((h) => h.id === habitId);
  if (!habit) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-lg italic text-muted">Habit not found.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-sage hover:underline">
          Back to habits
        </Link>
      </div>
    );
  }

  const successRate = computeSuccessRate(habit);
  const currentStreak = computeCurrentStreak(habit);
  const bestStreak = computeBestStreak(habit);
  const weekProgress = computeThisWeekProgress(habit);
  const onTrack = habit.missAllowance > 0 ? computeOnTrackStatus(habit) : null;
  const completionTime = computeCompletionTimeStats(habit);
  const insights = generateInsights(habit);

  return (
    <div>
      <Link href="/" className="text-sm text-muted hover:text-charcoal">
        ← Back
      </Link>

      <header className="mb-8 mt-3">
        <h1 className="font-display text-3xl font-medium tracking-tight text-charcoal">
          {habit.name}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {habit.category} · {frequencyLabel(habit.frequency)}
          {habit.target && ` · goal ${habit.target.goal} ${habit.target.unit}`}
        </p>
      </header>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatTile label="Success rate" value={`${Math.round(successRate.rate * 100)}%`} />
        {weekProgress ? (
          <>
            <StatTile
              label="This week"
              value={`${weekProgress.completed}/${weekProgress.target}`}
            />
            <StatTile label="Trackable days" value={`${successRate.trackable}`} />
          </>
        ) : (
          <>
            <StatTile label="Current streak" value={`${currentStreak}`} />
            <StatTile label="Best streak" value={`${bestStreak}`} />
          </>
        )}
      </div>

      {(onTrack || completionTime) && (
        <div className="mb-8 grid grid-cols-2 gap-4">
          {onTrack && (
            <StatTile
              label={`Misses this week (${onTrack.allowance} allowed)`}
              value={`${onTrack.misses}`}
            />
          )}
          {completionTime && (
            <StatTile label="Usual completion time" value={completionTime.mostCommon} />
          )}
        </div>
      )}

      {insights.length > 0 && (
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-charcoal">Insights</p>
          <ul className="space-y-1.5">
            {insights.map((text) => (
              <li key={text} className="text-sm text-muted">
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mb-2 text-sm font-medium text-charcoal">History</p>
      <Heatmap history={habit.history} color={habit.color} />
    </div>
  );
}
