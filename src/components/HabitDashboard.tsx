"use client";

import { useEffect, useMemo, useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import AddHabit from "@/components/AddHabit";
import HabitList from "@/components/HabitList";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function HabitDashboard() {
  const {
    habits,
    loading,
    error,
    addHabit,
    toggleHabit,
    logProgress,
    deleteHabit,
  } = useHabits();

  const [filter, setFilter] = useState<string>("All");
  const [todayFormatted, setTodayFormatted] = useState<string>("");

  useEffect(() => {
    setTodayFormatted(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  // Filter tabs are built from userLabel, not category
  const labelsPresent = useMemo(
    () => Array.from(new Set(habits.map((h) => h.userLabel))),
    [habits]
  );
  const filterOptions = ["All", ...labelsPresent];
  const filteredHabits =
    filter === "All" ? habits : habits.filter((h) => h.userLabel === filter);

  return (
    <div>
      {/* Top Banner Header */}
      <header className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-charcoal">
            Daily Habits
          </h1>
          {todayFormatted && (
            <p className="mt-1 text-sm tabular-nums text-muted">{todayFormatted}</p>
          )}
        </div>
        {!loading && habits.length > 0 && (
          <div className="text-xs text-muted">
            <span className="font-semibold text-charcoal">{habits.length}</span> active habits tracked
          </div>
        )}
      </header>

      {/* Main Responsive Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left / Center Main Content (8 cols on desktop) */}
        <div className="space-y-6 lg:col-span-8">
          <AddHabit onAdd={addHabit} />

          {error && (
            <p className="rounded-lg border border-ember/30 bg-ember/5 px-4 py-2.5 text-sm text-ember">
              {error}
            </p>
          )}

          {labelsPresent.length > 1 && (
            <div className="flex flex-wrap gap-1.5 border-b border-mist/60 pb-3">
              {filterOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                    filter === c
                      ? "bg-charcoal text-ink shadow-sm"
                      : "border border-mist/80 bg-white text-muted hover:border-charcoal/30 hover:text-charcoal"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <HabitList
            habits={filteredHabits}
            loading={loading}
            onToggle={toggleHabit}
            onLogProgress={logProgress}
            onDelete={deleteHabit}
          />
        </div>

        {/* Right Sidebar Widgets (4 cols on desktop) */}
        <div className="lg:col-span-4">
          <DashboardSidebar habits={habits} />
        </div>
      </div>
    </div>
  );
}
