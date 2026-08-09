"use client";

import Link from "next/link";
import { useHabits } from "@/hooks/useHabits";
import LifeHUDHeader from "@/components/LifeHUDHeader";
import CircadianClockMatrix from "@/components/CircadianClockMatrix";
import HabitVelocitySparkline from "@/components/HabitVelocitySparkline";
import { computeUserGamification } from "@/lib/gamification";

export default function DashboardCommandHub() {
  const { habits, loading, toggleHabit } = useHabits();

  const todayStr = new Date().toISOString().slice(0, 10);
  const completedTodayCount = habits.filter((h) => h.history.includes(todayStr)).length;
  const totalHabitsCount = habits.length;
  const completionRatePct = totalHabitsCount > 0 ? Math.round((completedTodayCount / totalHabitsCount) * 100) : 100;

  // Gamification metrics
  const gamification = computeUserGamification(habits);

  // Pending top priority habits for today
  const pendingHabits = habits.filter((h) => !h.history.includes(todayStr)).slice(0, 4);

  // SVG Gauge calculations (radius = 32, circumference ~ 201)
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (circumference * completionRatePct) / 100;

  return (
    <div className="space-y-8">
      {/* Sci-Fi Global Command Status HUD Bar */}
      <LifeHUDHeader />

      {/* Hero Command Hub Score Card */}
      <div className="rounded-3xl border border-[#e5e1d7] bg-white p-6 sm:p-8 shadow-sm dark:border-[#27272a] dark:bg-[#18181b] space-y-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="inline-flex mb-3 rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
              Visionary Life Control Center
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
              Life Optimization Index
            </h1>
            <p className="text-xs sm:text-sm text-[#737970] dark:text-[#a1a1aa]">
              Central Command Control Hub for habits, circadian rhythm, fasting, and biometrics.
            </p>
          </div>

          {/* SVG Circular Progress Gauge & Level Badge */}
          <div className="flex items-center gap-5 shrink-0 self-start sm:self-auto">
            <div className="relative flex items-center justify-center h-24 w-24">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 80 80">
                {/* Background Ring */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-[#e5e1d7] dark:text-[#27272a]"
                  fill="transparent"
                />
                {/* Foreground Animated Ring */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="text-[#406852] dark:text-[#a3b899] transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
                  {completionRatePct}%
                </span>
                <span className="text-[9px] font-bold uppercase text-[#737970] dark:text-[#a1a1aa]">
                  Score
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 rounded-full bg-[#406852]/10 px-3 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899]">
                <span>🏆</span> Level {gamification.level}
              </div>
              <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">
                {gamification.xp} Total XP Earned
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Pillar HUD Metric Tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/habits"
            className="rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-4 text-left dark:border-[#27272a] dark:bg-[#121215] transition-all hover:border-[#406852]"
          >
            <span className="text-lg">⚡</span>
            <div className="mt-1 font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">
              {completedTodayCount} of {totalHabitsCount} Habits
            </div>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">Routine execution</p>
          </Link>

          <Link
            href="/bio?tab=fasting"
            className="rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-4 text-left dark:border-[#27272a] dark:bg-[#121215] transition-all hover:border-[#406852]"
          >
            <span className="text-lg">⏱️</span>
            <div className="mt-1 font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">
              16:8 Fasting
            </div>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">Autophagy active</p>
          </Link>

          <Link
            href="/bio?tab=vitals"
            className="rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-4 text-left dark:border-[#27272a] dark:bg-[#121215] transition-all hover:border-[#406852]"
          >
            <span className="text-lg">📈</span>
            <div className="mt-1 font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">
              75 ms HRV
            </div>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">Optimal recovery</p>
          </Link>

          <Link
            href="/bio?tab=breathwork"
            className="rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-4 text-left dark:border-[#27272a] dark:bg-[#121215] transition-all hover:border-[#406852]"
          >
            <span className="text-lg">🫁</span>
            <div className="mt-1 font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">
              Box Breathing
            </div>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">Vagus pacer ready</p>
          </Link>
        </div>
      </div>

      {/* Embedded Circadian 24-Hour Photonic Curve HUD */}
      <CircadianClockMatrix />

      {/* Main Grid: Priority Habits Rail (8 cols) + Workstation Quick Launch (4 cols) */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Priority Habits Rail */}
        <div className="space-y-4 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#232f26] dark:text-[#f4f4f5] uppercase tracking-wider">
              Pending Habits For Today ({pendingHabits.length})
            </h2>
            <Link
              href="/habits"
              className="text-xs font-bold text-[#406852] dark:text-[#a3b899] hover:underline"
            >
              View Full Habits Workspace →
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#737970]">Loading command hub...</div>
          ) : pendingHabits.length === 0 ? (
            <div className="rounded-2xl border border-[#406852]/30 bg-[#e3ede6]/40 p-6 text-center space-y-2">
              <span className="text-2xl">🎉</span>
              <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">
                All Daily Routines Executed!
              </h3>
              <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
                You have completed 100% of today's habits. Open the <Link href="/habits" className="underline font-bold">Habits Workspace</Link> to review history or add new routines.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingHabits.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between rounded-2xl border border-[#e5e1d7] bg-white p-4 dark:border-[#27272a] dark:bg-[#18181b] shadow-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#406852] text-[#406852] dark:border-[#a3b899] dark:text-[#a3b899] font-bold text-xs hover:bg-[#406852]/10"
                    >
                      ✓
                    </button>
                    <div>
                      <h4 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">{habit.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#737970] dark:text-[#a1a1aa]">
                        <span className="rounded bg-[#e3ede6] dark:bg-[#27272a] px-2 py-0.5 text-[10px] font-bold text-[#406852] dark:text-[#a3b899]">
                          {habit.domain}
                        </span>
                        <span>{habit.userLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <HabitVelocitySparkline habit={habit} />
                    <Link href="/habits" className="text-xs font-bold text-[#406852] dark:text-[#a3b899] hover:underline">
                      Manage →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Bio Workstations Quick Launch Rail & Smart Advisory */}
        <div className="space-y-6 lg:col-span-4">
          {/* Smart Neuroscience Advisory Card */}
          <div className="rounded-2xl border border-[#406852]/30 bg-[#e3ede6]/40 dark:border-[#406852]/40 dark:bg-[#121215] p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#232f26] dark:text-[#f4f4f5]">
                Circadian Photonic Advisory
              </h3>
            </div>
            <p className="text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
              Optimum photic window active. Ensure 10-15 minutes of outdoor sunlight exposure to set central suprachiasmatic clock.
            </p>
          </div>

          {/* Quick Launch Bio Workstations Rail */}
          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm dark:border-[#27272a] dark:bg-[#18181b] space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
              Quick Launch Bio Workstations
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/bio?tab=circadian"
                className="flex items-center justify-between p-3 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] font-semibold text-[#232f26] dark:text-[#f4f4f5] hover:border-[#406852]"
              >
                <span>☀️ Solar Optics Calculator</span>
                <span>→</span>
              </Link>
              <Link
                href="/bio?tab=playbooks"
                className="flex items-center justify-between p-3 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] font-semibold text-[#232f26] dark:text-[#f4f4f5] hover:border-[#406852]"
              >
                <span>🧠 Bio-Optimization Playbooks</span>
                <span>→</span>
              </Link>
              <Link
                href="/bio?tab=recovery"
                className="flex items-center justify-between p-3 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] font-semibold text-[#232f26] dark:text-[#f4f4f5] hover:border-[#406852]"
              >
                <span>🧊 Thermal Recovery Log</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
