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

import { Skeleton, SkeletonStatTile } from "@/components/Skeleton";

import { useRouter } from "next/navigation";
import ConfirmActionModal from "@/components/ConfirmActionModal";

export default function HabitDetail({ habitId }: { habitId: string }) {
  const router = useRouter();
  const { habits, loading, editHabit, deleteHabit } = useHabits();
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const habit = habits.find((h) => h.id === habitId);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-24" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SkeletonStatTile />
          <SkeletonStatTile />
          <SkeletonStatTile />
        </div>
      </div>
    );
  }

  if (!habit) {
    return <p className="text-sm text-[#737970] dark:text-[#a1a1aa]">Habit not found.</p>;
  }

  const successRate = computeSuccessRate(habit);
  const currentStreak = computeCurrentStreak(habit);
  const bestStreak = computeBestStreak(habit);
  const weekProgress = computeThisWeekProgress(habit);
  const onTrack = habit.missAllowance > 0 ? computeOnTrackStatus(habit) : null;
  const completionTime = computeCompletionTimeStats(habit);
  const insights = generateInsights(habit);

  const handleConfirmDelete = async (_reason: string) => {
    await deleteHabit(habit.id);
    router.push("/dashboard");
  };

  return (
    <div>
      <Link href="/" className="text-sm text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26] dark:hover:text-[#f4f4f5]">
        ← Back
      </Link>

      <header className="mb-8 mt-3 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
            {habit.name}
          </h1>
          <p className="mt-1 text-sm text-[#737970] dark:text-[#a1a1aa]">
            <span className="rounded-md bg-[#e5e1d7]/70 dark:bg-[#27272a] px-2 py-0.5 text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5]">
              {habit.domain}
            </span>{" "}
            · {habit.userLabel} · {frequencyLabel(habit.frequency)}
            {habit.target && ` · goal ${habit.target.goal} ${habit.target.unit}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEdit(true)}
            className="rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] px-3.5 py-1.5 text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] shadow-sm transition-all hover:bg-[#fbf9f5] dark:hover:bg-[#27272a]"
          >
            ✎ Edit Habit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl border border-[#be5a38]/30 bg-[#be5a38]/10 px-3.5 py-1.5 text-xs font-semibold text-[#be5a38] shadow-sm transition-all hover:bg-[#be5a38] hover:text-white"
          >
            ✕ Delete
          </button>
        </div>
      </header>

      {showEdit && (
        <EditHabitModal
          habit={habit}
          onSave={editHabit}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmActionModal
          type="delete"
          deleteData={{
            habitId: habit.id,
            habitName: habit.name,
            domain: habit.domain,
          }}
          onConfirm={handleConfirmDelete}
          onClose={() => setShowDeleteConfirm(false)}
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
        <div className="mb-8 rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm dark:border-[#27272a] dark:bg-[#18181b]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Insights & Reflection Patterns
          </p>
          <ul className="space-y-2">
            {insights.map((text) => (
              <li key={text} className="flex items-start gap-2 text-xs leading-relaxed text-[#232f26] dark:text-[#f4f4f5]">
                <span className="text-[#406852] dark:text-[#a1a1aa] font-bold">•</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm dark:border-[#27272a] dark:bg-[#18181b]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
          Completion History Heatmap
        </p>
        <Heatmap history={habit.history} color={habit.color} />
      </div>
    </div>
  );
}
