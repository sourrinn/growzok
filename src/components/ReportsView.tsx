"use client";

import { useMemo, useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import { buildReport, type ReportPeriod } from "@/lib/analytics";
import { frequencyLabel } from "@/lib/frequency";
import { todayStr } from "@/lib/dates";
import { Skeleton, SkeletonStatTile } from "@/components/Skeleton";

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
  const { habits, loading, toggleHabit } = useHabits();
  const [period, setPeriod] = useState<ReportPeriod>("month");

  const report = useMemo(() => buildReport(habits, period), [habits, period]);

  const today = todayStr();

  // Find recommended action habit
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

        <div className="inline-flex w-fit max-w-full self-end sm:self-auto items-center gap-1 rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-1 shadow-sm overflow-x-auto no-scrollbar shrink-0">
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
      </div>

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

      {/* Actionable Intelligence & Behavioral Guidance Banner */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm dark:border-[#27272a] dark:bg-[#18181b]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e3ede6] dark:bg-[#27272a] text-[#406852] dark:text-[#a1a1aa] font-bold text-sm">
              💡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                  Actionable Intelligence & Focus Recommendation
                </h2>
                {report.domains.length > 0 && (
                  <span className="rounded-full bg-[#e3ede6] dark:bg-[#27272a] px-2.5 py-0.5 text-[10px] font-semibold text-[#406852] dark:text-[#a1a1aa]">
                    Top Domain: {report.domains[0].domain}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed max-w-2xl">
                {actionHabit ? (
                  actionHabit.history.includes(today) ? (
                    <>
                      <strong>Great consistency today!</strong> All active routines are logged. Your overall success rate is sitting at{" "}
                      <strong className="text-[#232f26] dark:text-[#f4f4f5]">{Math.round(report.rate * 100)}%</strong> for this period.
                    </>
                  ) : (
                    <>
                      <strong>Immediate Focus Target:</strong> Toggling <strong>{actionHabit.name}</strong> today will maintain your momentum and boost your period rate by{" "}
                      <strong className="text-[#406852] dark:text-[#f4f4f5]">+{Math.round(100 / Math.max(1, report.trackable))}%</strong>.
                    </>
                  )
                ) : (
                  "Track habits consistently to generate personalized performance insights."
                )}
              </p>
            </div>
          </div>

          {actionHabit && !actionHabit.history.includes(today) && (
            <button
              type="button"
              onClick={() => toggleHabit(actionHabit.id)}
              className="shrink-0 self-end sm:self-auto rounded-xl bg-[#232f26] px-4 py-2 text-xs font-semibold text-white dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46] shadow-sm transition-all hover:bg-black dark:hover:bg-[#3f3f46]"
            >
              ⚡ Complete {actionHabit.name} Now →
            </button>
          )}
        </div>
      </div>

      {/* Habit Performance Matrix Table & Mobile Cards */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-4 sm:p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
          Habit Performance Matrix
        </h2>

        {/* Mobile Stacked Card View (Shown on screens < 640px) */}
        <div className="mt-4 space-y-3 sm:hidden">
          {report.rows.map(({ habit, completed, trackable, rate, streak }) => {
            const isDoneToday = habit.history.includes(today);
            return (
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

                {/* Progress & Quick Action Bar */}
                <div className="border-t border-[#e5e1d7]/60 dark:border-[#3f3f46] pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#737970] dark:text-[#a1a1aa]">
                    <strong className="text-[#232f26] dark:text-[#f4f4f5]">{completed}</strong> / {trackable} days ({Math.round(rate * 100)}%)
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleHabit(habit.id)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                      isDoneToday
                        ? "bg-[#e3ede6] text-[#406852] dark:bg-[#18181b] dark:text-[#a1a1aa]"
                        : "bg-[#232f26] text-white dark:bg-[#3f3f46] dark:text-[#f4f4f5]"
                    }`}
                  >
                    {isDoneToday ? "✓ Done Today" : "⚡ Complete Today"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop / Tablet Scrollable Table (Shown on screens >= 640px) */}
        <div className="mt-4 hidden overflow-x-auto sm:block">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead>
              <tr className="border-b border-[#e5e1d7] dark:border-[#27272a] text-[#737970] dark:text-[#a1a1aa]">
                <th className="pb-3 font-semibold whitespace-nowrap">Habit Name</th>
                <th className="pb-3 font-semibold whitespace-nowrap">Domain</th>
                <th className="pb-3 font-semibold whitespace-nowrap">Schedule</th>
                <th className="pb-3 font-semibold whitespace-nowrap">Streak</th>
                <th className="pb-3 font-semibold text-center whitespace-nowrap">Period Progress</th>
                <th className="pb-3 font-semibold text-center whitespace-nowrap">Success Rate</th>
                <th className="pb-3 font-semibold text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e1d7]/60 dark:divide-[#27272a]">
              {report.rows.map(({ habit, completed, trackable, rate, streak }) => {
                const isDoneToday = habit.history.includes(today);
                return (
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
                    <td className="py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
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
                    <td className="py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleHabit(habit.id)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                          isDoneToday
                            ? "border border-[#e5e1d7] bg-[#fbf9f5] text-[#406852] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#a1a1aa]"
                            : "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46] shadow-xs hover:bg-black"
                        }`}
                      >
                        {isDoneToday ? "✓ Done Today" : "⚡ Complete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
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

              <button
                type="button"
                onClick={() => toggleHabit(report.weakestHabit!.habit.id)}
                className="w-full rounded-xl border border-[#be5a38]/30 bg-[#be5a38]/10 py-2 text-xs font-semibold text-[#be5a38] transition-all hover:bg-[#be5a38] hover:text-white"
              >
                ⚡ Boost Habit Today
              </button>
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
    </div>
  );
}
