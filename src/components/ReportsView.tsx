"use client";

import { useMemo, useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import { buildReport, computeDayOfWeekStats, computeWeekOverWeek, type ReportPeriod } from "@/lib/analytics";
import { frequencyLabel } from "@/lib/frequency";
import { todayStr } from "@/lib/dates";
import { Skeleton, SkeletonStatTile } from "@/components/Skeleton";
import ConsistencyHeatmap from "@/components/ConsistencyHeatmap";
import DayOfWeekHistogram from "@/components/DayOfWeekHistogram";
import { computeUserGamification } from "@/lib/gamification";
import { generateBehavioralInsights } from "@/lib/heuristicCoach";
import { computeHabitSynergies } from "@/lib/synergy";
import SocialShareModal from "@/components/SocialShareModal";


const PERIODS: { value: ReportPeriod; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

/** Domain badge colour palette — organic nature-inspired hues. */
const DOMAIN_COLORS: Record<string, string> = {
  Sleep: "bg-[#e8ebf5] text-[#2c3e6b]",
  Hydration: "bg-[#e2f0f4] text-[#1f5669]",
  Nutrition: "bg-[#e8f1e3] text-[#345c29]",
  Cardio: "bg-[#f5e9e5] text-[#7a3322]",
  Strength: "bg-[#f4efe2] text-[#6b4923]",
  Mobility: "bg-[#e5f2ee] text-[#235848]",
  Breathing: "bg-[#e0f2f5] text-[#1b5e6b]",
  Grooming: "bg-[#f5e8ed] text-[#6e2840]",
  Preventive: "bg-[#f5f0df] text-[#6e561c]",
  Recovery: "bg-[#eee8f5] text-[#502e6b]",
  Productivity: "bg-[#e3ede6] text-[#232f26]",
  Finance: "bg-[#e4ede6] text-[#2d4a3e]",
  Social: "bg-[#f5e8e3] text-[#7a422d]",
  Learning: "bg-[#ebdcd3] text-[#5c3e31]",
  "Digital Minimalism": "bg-[#e5e1d7] text-[#424541]",
  "Gut Health": "bg-[#e8f0e5] text-[#385c2c]",
};

function domainColor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? "bg-[#e5e1d7] text-[#232f26]";
}

export default function ReportsView() {
  const { habits, loading } = useHabits();
  const [period, setPeriod] = useState<ReportPeriod>("month");
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const report = useMemo(() => buildReport(habits, period), [habits, period]);
  const wowStats = useMemo(() => computeWeekOverWeek(habits), [habits]);
  const dowStats = useMemo(() => computeDayOfWeekStats(habits), [habits]);
  const gamification = useMemo(() => computeUserGamification(habits), [habits]);
  const coachInsights = useMemo(() => generateBehavioralInsights(habits), [habits]);
  const synergies = useMemo(() => computeHabitSynergies(habits), [habits]);

  const today = todayStr();


  // Find top recommended focus area for informative guidance
  const actionHabit = useMemo(() => {
    return habits.find((h) => !h.history.includes(today)) ?? habits[0];
  }, [habits, today]);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-60 rounded-xl" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonStatTile delayClass="animation-delay-75" />
          <SkeletonStatTile delayClass="animation-delay-150" />
          <SkeletonStatTile delayClass="animation-delay-200" />
          <SkeletonStatTile delayClass="animation-delay-300" />
        </div>
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-4">
          <Skeleton className="h-4 w-48" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e5e1d7] bg-white p-12 text-center dark:border-[#27272a] dark:bg-[#18181b]">
        <h2 className="font-display text-2xl font-semibold text-[#232f26] dark:text-[#f4f4f5]">No Habit Data Yet</h2>
        <p className="mt-2 text-sm text-[#737970] dark:text-[#a1a1aa]">
          Plant your first habit on the dashboard to unlock comprehensive analytics and report insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Time Period Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#737970] dark:text-[#a1a1aa]">{report.label}</p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap justify-end">
          <div className="inline-flex w-fit max-w-full items-center gap-1 rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-1 shadow-sm overflow-x-auto no-scrollbar" data-print-hidden>
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`rounded-lg px-3 sm:px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  period === p.value
                    ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46] shadow-sm"
                    : "text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Print / Export PDF — browser native, zero server cost */}
          <button
            type="button"
            onClick={() => window.print()}
            data-print-hidden
            className="flex items-center gap-1.5 rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] px-3.5 py-2 text-xs font-semibold text-[#737970] dark:text-[#a1a1aa] shadow-sm hover:text-[#232f26] dark:hover:text-[#f4f4f5] transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / PDF
          </button>
        </div>
      </div>

      {/* Behavioral AI Coach Insights Rail */}
      {coachInsights.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 print-break-inside-avoid">
          {coachInsights.map((insight) => {
            const isWarn = insight.severity === "warning";
            const isSuccess = insight.severity === "success";
            return (
              <div
                key={insight.id}
                className={`rounded-2xl border p-4 shadow-xs space-y-1.5 transition-all ${
                  isWarn
                    ? "border-[#be5a38]/30 bg-[#be5a38]/5 text-[#be5a38]"
                    : isSuccess
                    ? "border-[#406852]/30 bg-[#406852]/5 text-[#406852] dark:text-[#a3b899]"
                    : "border-[#e5e1d7] bg-white text-[#232f26] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#f4f4f5]"
                }`}
              >
                <h3 className="text-xs font-bold flex items-center justify-between">
                  <span>{insight.title}</span>
                  <span className="text-[10px] opacity-60 uppercase font-semibold">Coach Insight</span>
                </h3>
                <p className="text-xs opacity-90 leading-relaxed">{insight.message}</p>
                <p className="text-[11px] font-medium pt-1 text-[#737970] dark:text-[#a1a1aa]">
                  💡 {insight.recommendation}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Mastery & Badges Showcase Bar */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 dark:border-[#27272a] dark:bg-[#18181b] shadow-sm space-y-4 print-break-inside-avoid">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#406852] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                Level {gamification.level}
              </span>
              <h2 className="font-display text-lg font-bold text-[#232f26] dark:text-[#f4f4f5]">
                {gamification.levelTitle}
              </h2>
            </div>
            <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
              {gamification.xp} Total System XP • {gamification.unlockedBadgesCount} of {gamification.badges.length} Trophies Unlocked
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            data-print-hidden
            className="flex items-center justify-center gap-2 rounded-xl bg-[#232f26] px-4 py-2 text-xs font-semibold text-white hover:bg-[#406852] dark:bg-[#f4f4f5] dark:text-[#18181b] dark:hover:bg-white transition-all shadow-xs shrink-0"
          >
            🎨 Share Achievement Card
          </button>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-[#737970] dark:text-[#a1a1aa]">
            <span>Level {gamification.level} Progress</span>
            <span>{gamification.progressToNextLevelPct}% to Level {gamification.level + 1}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e1d7] dark:bg-[#27272a]">
            <div
              className="h-full rounded-full bg-[#406852] dark:bg-[#a3b899] transition-all duration-500"
              style={{ width: `${gamification.progressToNextLevelPct}%` }}
            />
          </div>
        </div>

        {/* Badges Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {gamification.badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs transition-all ${
                badge.unlocked
                  ? "border-[#406852]/30 bg-[#e3ede6]/40 dark:border-[#a3b899]/30 dark:bg-[#27272a]"
                  : "border-[#e5e1d7] opacity-40 dark:border-[#27272a] grayscale"
              }`}
            >
              <span className="text-xl">{badge.icon}</span>
              <div className="truncate">
                <p className="font-bold text-[#232f26] dark:text-[#f4f4f5] truncate">{badge.name}</p>
                <p className="text-[10px] text-[#737970] dark:text-[#a1a1aa] truncate">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Synergy Matrix (if pairs exist) */}
      {synergies.length > 0 && (
        <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 dark:border-[#27272a] dark:bg-[#18181b] shadow-sm space-y-3 print-break-inside-avoid">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
              Habit Synergy Boosters
            </h2>
            <p className="mt-0.5 text-xs text-[#737970] dark:text-[#a1a1aa]">
              Statistically proven habit pairs that boost each other's execution rate.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {synergies.map((syn, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 text-xs dark:border-[#27272a] dark:bg-[#121215]"
              >
                <span className="text-lg">✨</span>
                <div className="flex-1 truncate">
                  <p className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                    {syn.habitA.name} ➔ {syn.habitB.name}
                  </p>
                  <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] leading-tight mt-0.5">
                    {syn.insightText}
                  </p>
                </div>
                <span className="rounded-full bg-[#406852]/10 px-2 py-0.5 text-[11px] font-bold text-[#406852] dark:text-[#a3b899]">
                  +{syn.boostPct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Top Metric KPI Cards (4 Tiles) */}
      <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Completed */}
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Total Completed
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
              {report.completed}
            </span>
            <span className="text-xs text-[#737970] dark:text-[#a1a1aa]">of {report.trackable} trackable</span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Overall Success Rate
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
              {Math.round(report.rate * 100)}%
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                report.rate >= 0.8
                  ? "bg-[#e3ede6] text-[#406852] dark:bg-[#27272a] dark:text-[#a1a1aa]"
                  : report.rate >= 0.5
                    ? "bg-[#f4efe2] text-[#6b4923] dark:bg-[#27272a] dark:text-[#d4cca9]"
                    : "bg-[#be5a38]/10 text-[#be5a38]"
              }`}
            >
              {report.rate >= 0.8 ? "Optimal" : report.rate >= 0.5 ? "Steady" : "Needs Focus"}
            </span>
          </div>
        </div>

        {/* Active Streaks */}
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Active Momentum
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
              {report.activeStreaksCount}
            </span>
            <span className="text-xs text-[#737970] dark:text-[#a1a1aa]">habits in streak</span>
          </div>
        </div>

        {/* Missed Days */}
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Missed Days
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
              {report.missed}
            </span>
            <span className="text-xs text-[#737970] dark:text-[#a1a1aa]">days unfulfilled</span>
          </div>
        </div>
      </div>

      {/* Analytical Behavioral Intelligence & Insights Banner */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm dark:border-[#27272a] dark:bg-[#18181b]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e3ede6] dark:bg-[#27272a] text-[#406852] dark:text-[#a1a1aa] font-bold text-sm">
            💡
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                Behavioral Performance Intelligence
              </h2>
              {report.domains.length > 0 && (
                <span className="rounded-full bg-[#e3ede6] dark:bg-[#27272a] px-2.5 py-0.5 text-[10px] font-semibold text-[#406852] dark:text-[#a1a1aa]">
                  Top Domain: {report.domains[0].domain}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed max-w-3xl">
              {actionHabit ? (
                actionHabit.history.includes(today) ? (
                  <>
                    <strong>High Routine Consistency Today:</strong> All active routines are logged for today. Your overall period success rate is sitting at{" "}
                    <strong className="text-[#232f26] dark:text-[#f4f4f5]">{Math.round(report.rate * 100)}%</strong> across {report.trackable} trackable days.
                  </>
                ) : (
                  <>
                    <strong>Analytical Insight:</strong> Completing <strong>{actionHabit.name}</strong> on your dashboard will maintain momentum and increase your period success rate by{" "}
                    <strong className="text-[#406852] dark:text-[#f4f4f5]">+{Math.round(100 / Math.max(1, report.trackable))}%</strong>.
                  </>
                )
              ) : (
                "Track habits consistently to generate detailed behavioral insights."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Habit Performance Matrix Table & Mobile Cards */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-4 sm:p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
          Habit Performance Matrix
        </h2>

        {/* Mobile Stacked Card View (Shown on screens < 640px) */}
        <div className="mt-4 space-y-3 sm:hidden">
          {report.rows.map(({ habit, completed, trackable, rate, streak }) => (
            <div
              key={habit.id}
              className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a] p-3.5 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">{habit.name}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#737970] dark:text-[#a1a1aa]">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${domainColor(
                        habit.domain
                      )}`}
                    >
                      {habit.domain}
                    </span>
                    <span>·</span>
                    <span>{frequencyLabel(habit.frequency)}</span>
                  </div>
                </div>
                {streak > 0 && (
                  <span className="shrink-0 rounded-full bg-[#e3ede6] dark:bg-[#18181b] px-2 py-0.5 text-[10px] font-bold text-[#232f26] dark:text-[#f4f4f5]">
                    🔥 {streak}d
                  </span>
                )}
              </div>

              {/* Progress & Completion Info */}
              <div className="border-t border-[#e5e1d7]/60 dark:border-[#3f3f46] pt-2 flex items-center justify-between text-xs">
                <span className="text-[#737970] dark:text-[#a1a1aa]">
                  <strong className="text-[#232f26] dark:text-[#f4f4f5]">{completed}</strong> / {trackable} days
                </span>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[#e5e1d7] dark:bg-[#18181b]">
                    <div
                      className="h-full bg-[#232f26] dark:bg-[#f4f4f5] transition-all"
                      style={{ width: `${Math.round(rate * 100)}%` }}
                    />
                  </div>
                  <span className="font-bold tabular-nums text-[#232f26] dark:text-[#f4f4f5]">
                    {Math.round(rate * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop / Tablet Scrollable Table (Shown on screens >= 640px) */}
        <div className="mt-4 hidden overflow-x-auto sm:block">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead>
              <tr className="border-b border-[#e5e1d7] dark:border-[#27272a] text-[#737970] dark:text-[#a1a1aa]">
                <th className="pb-3 font-semibold whitespace-nowrap">Habit Name</th>
                <th className="pb-3 font-semibold whitespace-nowrap">Domain</th>
                <th className="pb-3 font-semibold whitespace-nowrap">Schedule</th>
                <th className="pb-3 font-semibold whitespace-nowrap">Streak</th>
                <th className="pb-3 font-semibold text-center whitespace-nowrap">Period Progress</th>
                <th className="pb-3 font-semibold text-right whitespace-nowrap">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e1d7]/60 dark:divide-[#27272a]">
              {report.rows.map(({ habit, completed, trackable, rate, streak }) => (
                <tr key={habit.id} className="group hover:bg-[#fbf9f5] dark:hover:bg-[#27272a]">
                  <td className="py-3 font-semibold text-[#232f26] dark:text-[#f4f4f5] whitespace-nowrap">{habit.name}</td>
                  <td className="py-3 whitespace-nowrap">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${domainColor(
                        habit.domain
                      )}`}
                    >
                      {habit.domain}
                    </span>
                  </td>
                  <td className="py-3 text-[#737970] dark:text-[#a1a1aa] whitespace-nowrap">{frequencyLabel(habit.frequency)}</td>
                  <td className="py-3 font-semibold text-[#232f26] dark:text-[#f4f4f5] whitespace-nowrap">
                    {streak > 0 ? `${streak}d streak` : "—"}
                  </td>
                  <td className="py-3 text-center text-[#737970] dark:text-[#a1a1aa] whitespace-nowrap">
                    <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">{completed}</span> / {trackable} days
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#e5e1d7] dark:bg-[#27272a]">
                        <div
                          className="h-full bg-[#232f26] dark:bg-[#f4f4f5] transition-all"
                          style={{ width: `${Math.round(rate * 100)}%` }}
                        />
                      </div>
                      <span className="w-9 font-semibold tabular-nums text-[#232f26] dark:text-[#f4f4f5]">
                        {Math.round(rate * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Biological Domain Breakdown & Spotlights Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Domain Distribution Progress Bars (8 cols) */}
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm lg:col-span-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Biological Domain Performance
          </h2>
          <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
            Completion breakdown across Growzok's 16 biological & behavioral domains.
          </p>

          <div className="mt-5 space-y-4">
            {report.domains.map(({ domain, completed, trackable, rate }) => (
              <div key={domain} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${domainColor(
                        domain
                      )}`}
                    >
                      {domain}
                    </span>
                    <span className="text-[#737970] dark:text-[#a1a1aa]">
                      ({completed} of {trackable} completed)
                    </span>
                  </div>
                  <span className="font-semibold tabular-nums text-[#232f26] dark:text-[#f4f4f5]">
                    {Math.round(rate * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e1d7]/60 dark:bg-[#27272a]">
                  <div
                    className="h-full bg-[#406852] dark:bg-[#f4f4f5] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.round(rate * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spotlight Cards (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Top Performer */}
          {report.topHabit && (
            <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-3">
              <span className="rounded-full bg-[#e3ede6] dark:bg-[#27272a] px-2.5 py-0.5 text-[10px] font-semibold text-[#406852] dark:text-[#a1a1aa]">
                Top Performer
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                  {report.topHabit.habit.name}
                </h3>
                <p className="mt-0.5 text-xs text-[#737970] dark:text-[#a1a1aa]">
                  Domain: <span className="font-medium text-[#232f26] dark:text-[#f4f4f5]">{report.topHabit.habit.domain}</span>
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#e5e1d7] dark:border-[#27272a] pt-3 text-xs">
                <span className="text-[#737970] dark:text-[#a1a1aa]">Success Rate</span>
                <span className="font-bold text-[#406852] dark:text-[#f4f4f5]">
                  {Math.round(report.topHabit.rate * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Needs Momentum or Single Routine Card */}
          {report.weakestHabit ? (
            <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-3">
              <span className="rounded-full bg-[#be5a38]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#be5a38]">
                Needs Attention
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                  {report.weakestHabit.habit.name}
                </h3>
                <p className="mt-0.5 text-xs text-[#737970] dark:text-[#a1a1aa]">
                  Domain: <span className="font-medium text-[#232f26] dark:text-[#f4f4f5]">{report.weakestHabit.habit.domain}</span>
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#e5e1d7] dark:border-[#27272a] pt-3 text-xs">
                <span className="text-[#737970] dark:text-[#a1a1aa]">Success Rate</span>
                <span className="font-bold text-[#be5a38]">
                  {Math.round(report.weakestHabit.rate * 100)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-2 text-xs">
              <span className="rounded-full bg-[#e3ede6] dark:bg-[#27272a] px-2.5 py-0.5 text-[10px] font-semibold text-[#406852] dark:text-[#a1a1aa]">
                Consistency Focus
              </span>
              <p className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                Single Routine Tracked
              </p>
              <p className="text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
                You are currently building momentum on your active habit. Keep completing daily logs to unlock detailed comparative analytics!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Week-Over-Week Momentum Comparison */}
      {wowStats.length > 0 && (
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-4 print-break-inside-avoid">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
              Week-Over-Week Momentum
            </h2>
            <p className="mt-0.5 text-xs text-[#737970] dark:text-[#a1a1aa]">
              Biggest completion rate changes: this 7 days vs the prior 7 days.
            </p>
          </div>

          <div className="divide-y divide-[#e5e1d7] dark:divide-[#27272a]">
            {wowStats.slice(0, 6).map(({ habit, thisWeekRate, lastWeekRate, delta }) => {
              const improved = delta >= 0;
              return (
                <div key={habit.id} className="flex items-center gap-3 py-3">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="flex-1 truncate text-xs font-medium text-[#232f26] dark:text-[#f4f4f5]">
                    {habit.name}
                  </span>

                  {/* Mini sparkline comparison bars */}
                  <div className="flex items-center gap-1 shrink-0 w-28">
                    <div className="flex-1 h-1.5 rounded-full bg-[#e5e1d7] dark:bg-[#27272a] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#a1a1aa] transition-all"
                        style={{ width: `${Math.round(lastWeekRate * 100)}%` }}
                      />
                    </div>
                    <div className="flex-1 h-1.5 rounded-full bg-[#e5e1d7] dark:bg-[#27272a] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          improved ? "bg-[#406852]" : "bg-[#be5a38]"
                        }`}
                        style={{ width: `${Math.round(thisWeekRate * 100)}%` }}
                      />
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold tabular-nums w-14 text-right shrink-0 ${
                      delta === 0
                        ? "text-[#737970] dark:text-[#a1a1aa]"
                        : improved
                        ? "text-[#406852] dark:text-[#a3b899]"
                        : "text-[#be5a38]"
                    }`}
                  >
                    {delta === 0 ? "—" : `${improved ? "+" : ""}${Math.round(delta * 100)}%`}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-[#737970] dark:text-[#a1a1aa]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#a1a1aa] mr-1" /> Last 7 days &nbsp;
            <span className="inline-block h-2 w-2 rounded-full bg-[#406852] mr-1" /> This 7 days
          </p>
        </div>
      )}

      {/* Day-of-Week Execution Histogram */}
      <DayOfWeekHistogram stats={dowStats} />

      {/* Daily Micro-Journal & Reflection Log Feed */}
      {(() => {
        const allLogs: Array<{ habitName: string; domain: string; color: string; date: string; rating?: number; note?: string }> = [];
        habits.forEach((h) => {
          (h.logEntries ?? []).forEach((entry) => {
            if (entry.note || entry.rating) {
              allLogs.push({
                habitName: h.name,
                domain: h.domain,
                color: h.color,
                date: entry.date,
                rating: entry.rating,
                note: entry.note,
              });
            }
          });
        });
        allLogs.sort((a, b) => b.date.localeCompare(a.date));

        if (allLogs.length === 0) return null;

        return (
          <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-4 print-break-inside-avoid">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                Daily Micro-Journal & Effort Reflection Log
              </h2>
              <p className="mt-0.5 text-xs text-[#737970] dark:text-[#a1a1aa]">
                Subjective friction ratings and notes recorded during habit executions.
              </p>
            </div>

            <div className="space-y-3">
              {allLogs.slice(0, 8).map((log, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] p-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: log.color }} />
                      <span className="font-bold text-[#232f26] dark:text-[#f4f4f5]">{log.habitName}</span>
                      <span className="rounded bg-[#e5e1d7]/60 dark:bg-[#27272a] px-1.5 py-0.5 text-[10px] text-[#737970] dark:text-[#a1a1aa]">
                        {log.domain}
                      </span>
                    </div>
                    {log.note && (
                      <p className="text-[#737970] dark:text-[#a1a1aa] italic pl-4">
                        "{log.note}"
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <span className="text-[10px] text-[#737970] font-medium">{log.date}</span>
                    {log.rating && (
                      <div className="text-amber-500 font-bold text-[11px]">
                        {"★".repeat(log.rating)}{"☆".repeat(5 - log.rating)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 365-Day Consistency Heatmap Grid */}
      <ConsistencyHeatmap habits={habits} />

      {/* Social Share Card Modal */}
      {shareModalOpen && (
        <SocialShareModal
          stats={gamification}
          userName="Growzok User"
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </div>
  );
}
