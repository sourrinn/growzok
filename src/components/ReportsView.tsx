"use client";

import { useMemo, useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import { buildReport, type ReportPeriod } from "@/lib/analytics";
import StatTile from "@/components/StatTile";

const PERIODS: { value: ReportPeriod; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

export default function ReportsView() {
  const { habits, loading } = useHabits();
  const [period, setPeriod] = useState<ReportPeriod>("month");

  const report = useMemo(() => buildReport(habits, period), [habits, period]);

  if (loading) {
    return <p className="py-16 text-center text-sm text-muted">Loading…</p>;
  }

  if (habits.length === 0) {
    return (
      <p className="py-16 text-center font-display text-lg italic text-muted">
        Add a habit to see your reports.
      </p>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-4xl font-medium tracking-tight text-charcoal">
          Reports
        </h1>
        <p className="mt-1 text-sm tabular-nums text-muted">{report.label}</p>
      </header>

      <div className="mb-8 flex gap-1">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`rounded-sm px-3 py-1.5 text-sm transition-colors ${
              period === p.value
                ? "bg-charcoal text-ink"
                : "text-muted hover:text-charcoal"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatTile label="Completed" value={`${report.completed}`} />
        <StatTile label="Missed" value={`${report.missed}`} />
        <StatTile label="Success rate" value={`${Math.round(report.rate * 100)}%`} />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-sm border border-mist px-4 py-3">
          <p className="text-xs text-muted">Top habit</p>
          <p className="mt-1 truncate font-medium text-charcoal">
            {report.topHabit ? report.topHabit.habit.name : "—"}
          </p>
          {report.topHabit && (
            <p className="text-xs text-muted">
              {Math.round(report.topHabit.rate * 100)}%
            </p>
          )}
        </div>
        <div className="rounded-sm border border-mist px-4 py-3">
          <p className="text-xs text-muted">Weakest habit</p>
          <p className="mt-1 truncate font-medium text-charcoal">
            {report.weakestHabit ? report.weakestHabit.habit.name : "—"}
          </p>
          {report.weakestHabit && (
            <p className="text-xs text-muted">
              {Math.round(report.weakestHabit.rate * 100)}%
            </p>
          )}
        </div>
      </div>

      {report.categories.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-charcoal">By category</p>
          <ul className="space-y-2">
            {report.categories.map((c) => (
              <li
                key={c.category}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted">{c.category}</span>
                <span className="tabular-nums text-charcoal">
                  {Math.round(c.rate * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
