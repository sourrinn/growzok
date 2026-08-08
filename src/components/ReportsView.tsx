"use client";

import { useMemo, useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import { buildReport, type ReportPeriod } from "@/lib/analytics";
import { frequencyLabel } from "@/lib/frequency";

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

  const report = useMemo(() => buildReport(habits, period), [habits, period]);

  if (loading) {
    return <p className="py-16 text-center text-sm text-[#737970]">Loading analytics…</p>;
  }

  if (habits.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e5e1d7] bg-white p-12 text-center">
        <h2 className="font-display text-2xl font-semibold text-[#232f26]">No Habit Data Yet</h2>
        <p className="mt-2 text-sm text-[#737970]">
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
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[#232f26] dark:text-[#f0ede6]">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-[#737970] dark:text-[#9eb0a2]">{report.label}</p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-[#e5e1d7] bg-white dark:border-[#2d3c30] dark:bg-[#18201a] p-1 shadow-sm">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                period === p.value
                  ? "bg-[#232f26] text-white dark:bg-[#5fa07c] dark:text-[#0d130e] shadow-sm"
                  : "text-[#737970] dark:text-[#9eb0a2] hover:text-[#232f26] dark:hover:text-[#f0ede6]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metric KPI Cards (4 Tiles) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Completed */}
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#2d3c30] dark:bg-[#18201a] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9eb0a2]">
            Total Completed
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-[#232f26] dark:text-[#f0ede6]">
              {report.completed}
            </span>
            <span className="text-xs text-[#737970] dark:text-[#9eb0a2]">of {report.trackable} trackable</span>
          </div>
        </div>

        {/* Success Rate */}
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#2d3c30] dark:bg-[#18201a] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9eb0a2]">
            Overall Success Rate
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-[#232f26] dark:text-[#f0ede6]">
              {Math.round(report.rate * 100)}%
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                report.rate >= 0.8
                  ? "bg-[#e3ede6] text-[#406852] dark:bg-[#1d3326] dark:text-[#5fa07c]"
                  : report.rate >= 0.5
                    ? "bg-[#f4efe2] text-[#6b4923] dark:bg-[#2d291f] dark:text-[#d4cca9]"
                    : "bg-[#be5a38]/10 text-[#be5a38]"
              }`}
            >
              {report.rate >= 0.8 ? "Optimal" : report.rate >= 0.5 ? "Steady" : "Needs Focus"}
            </span>
          </div>
        </div>

        {/* Active Streaks */}
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#2d3c30] dark:bg-[#18201a] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9eb0a2]">
            Active Momentum
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-[#232f26] dark:text-[#f0ede6]">
              {report.activeStreaksCount}
            </span>
            <span className="text-xs text-[#737970] dark:text-[#9eb0a2]">habits in streak</span>
          </div>
        </div>

        {/* Missed Days */}
        <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#2d3c30] dark:bg-[#18201a] p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#737970]">
            Missed Days
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold text-[#232f26]">
              {report.missed}
            </span>
            <span className="text-xs text-[#737970]">days unfulfilled</span>
          </div>
        </div>
      </div>

      {/* Habit Performance Matrix Table */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737970]">
          Habit Performance Matrix
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5e1d7] text-[#737970]">
                <th className="pb-3 font-semibold">Habit Name</th>
                <th className="pb-3 font-semibold">Domain</th>
                <th className="pb-3 font-semibold">Schedule</th>
                <th className="pb-3 font-semibold">Streak</th>
                <th className="pb-3 font-semibold text-center">Period Progress</th>
                <th className="pb-3 font-semibold text-right">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e1d7]/60">
              {report.rows.map(({ habit, completed, trackable, rate, streak }) => (
                <tr key={habit.id} className="group hover:bg-[#fbf9f5]">
                  <td className="py-3 font-semibold text-[#232f26]">{habit.name}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${domainColor(
                        habit.domain
                      )}`}
                    >
                      {habit.domain}
                    </span>
                  </td>
                  <td className="py-3 text-[#737970]">{frequencyLabel(habit.frequency)}</td>
                  <td className="py-3 font-semibold text-[#232f26]">
                    {streak > 0 ? `${streak}d streak` : "—"}
                  </td>
                  <td className="py-3 text-center text-[#737970]">
                    <span className="font-semibold text-[#232f26]">{completed}</span> / {trackable} days
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#e5e1d7]">
                        <div
                          className="h-full bg-[#232f26] transition-all"
                          style={{ width: `${Math.round(rate * 100)}%` }}
                        />
                      </div>
                      <span className="w-9 font-semibold tabular-nums text-[#232f26]">
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
        <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm lg:col-span-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737970]">
            Biological Domain Performance
          </h2>
          <p className="mt-1 text-xs text-[#737970]">
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
                    <span className="text-[#737970]">
                      ({completed} of {trackable} completed)
                    </span>
                  </div>
                  <span className="font-semibold tabular-nums text-[#232f26]">
                    {Math.round(rate * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e1d7]/60">
                  <div
                    className="h-full bg-[#406852] transition-all duration-500"
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
            <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm">
              <span className="rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-[10px] font-semibold text-[#406852]">
                Top Performer
              </span>
              <h3 className="mt-3 text-base font-semibold text-[#232f26]">
                {report.topHabit.habit.name}
              </h3>
              <p className="mt-1 text-xs text-[#737970]">
                Domain: <span className="font-medium text-[#232f26]">{report.topHabit.habit.domain}</span>
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[#e5e1d7] pt-3 text-xs">
                <span className="text-[#737970]">Success Rate</span>
                <span className="font-bold text-[#406852]">
                  {Math.round(report.topHabit.rate * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Needs Momentum */}
          {report.weakestHabit && (
            <div className="rounded-2xl border border-[#e5e1d7] bg-white p-5 shadow-sm">
              <span className="rounded-full bg-[#be5a38]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#be5a38]">
                Needs Attention
              </span>
              <h3 className="mt-3 text-base font-semibold text-[#232f26]">
                {report.weakestHabit.habit.name}
              </h3>
              <p className="mt-1 text-xs text-[#737970]">
                Domain: <span className="font-medium text-[#232f26]">{report.weakestHabit.habit.domain}</span>
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[#e5e1d7] pt-3 text-xs">
                <span className="text-[#737970]">Success Rate</span>
                <span className="font-bold text-[#be5a38]">
                  {Math.round(report.weakestHabit.rate * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
