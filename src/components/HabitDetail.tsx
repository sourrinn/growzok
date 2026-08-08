"use client";

import { useState } from "react";
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
import EditHabitModal from "@/components/EditHabitModal";

export default function HabitDetail({ habitId }: { habitId: string }) {
  const { habits, loading, editHabit } = useHabits();
  const [showEdit, setShowEdit] = useState(false);

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
      <Link href="/" className="text-sm text-[#737970] dark:text-[#9eb0a2] hover:text-[#232f26] dark:hover:text-[#f0ede6]">
        ← Back
      </Link>

      <header className="mb-8 mt-3 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight text-[#232f26] dark:text-[#f0ede6]">
            {habit.name}
          </h1>
          <p className="mt-1 text-sm text-[#737970] dark:text-[#9eb0a2]">
            {habit.category} · {frequencyLabel(habit.frequency)}
            {habit.target && ` · goal ${habit.target.goal} ${habit.target.unit}`}
          </p>
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="rounded-xl border border-[#e5e1d7] bg-white dark:border-[#2d3c30] dark:bg-[#18201a] px-3.5 py-1.5 text-xs font-semibold text-[#232f26] dark:text-[#f0ede6] shadow-sm transition-all hover:bg-[#fbf9f5] dark:hover:bg-[#222d25]"
        >
          ✎ Edit Habit
        </button>
      </header>

      {showEdit && (
        <EditHabitModal
          habit={habit}
          onSave={editHabit}
          onClose={() => setShowEdit(false)}
        />
      )}

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
          <p className="mb-2 text-sm font-medium text-[#232f26] dark:text-[#f0ede6]">Insights</p>
          <ul className="space-y-1.5">
            {insights.map((text) => (
              <li key={text} className="text-sm text-[#737970] dark:text-[#9eb0a2]">
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mb-2 text-sm font-medium text-[#232f26] dark:text-[#f0ede6]">History</p>
      <Heatmap history={habit.history} color={habit.color} />
    </div>
  );
}
