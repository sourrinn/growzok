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
    editHabit,
    toggleHabit,
    logProgress,
    deleteHabit,
  } = useHabits();

  const [filter, setFilter] = useState<string>("All");
  const [todayFormatted, setTodayFormatted] = useState<string>("");
  const [isManagingBoard, setIsManagingBoard] = useState(false);

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
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[#232f26] dark:text-[#f0ede6]">
            Daily Habits
          </h1>
          {todayFormatted && (
            <p className="mt-1 text-sm tabular-nums text-[#737970] dark:text-[#9eb0a2]">{todayFormatted}</p>
          )}
        </div>
        {!loading && habits.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[#737970] dark:text-[#9eb0a2] sm:inline">
              <span className="font-semibold text-[#232f26] dark:text-[#f0ede6]">{habits.length}</span> active habits
            </span>
            <button
              onClick={() => setIsManagingBoard((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-sm transition-all ${
                isManagingBoard
                  ? "border-[#406852] bg-[#232f26] text-white dark:bg-[#5fa07c] dark:text-[#0d130e] shadow-md"
                  : "border-[#e5e1d7] bg-white text-[#232f26] dark:border-[#2d3c30] dark:bg-[#18201a] dark:text-[#f0ede6] dark:hover:bg-[#222d25] hover:bg-[#fbf9f5]"
              }`}
            >
              {isManagingBoard ? (
                <>
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Done Editing</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-[#737970] dark:text-[#9eb0a2]">
                    <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Manage Board</span>
                </>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Main Responsive Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left / Center Main Content (8 cols on desktop) */}
        <div className="space-y-6 lg:col-span-8">
          <AddHabit onAdd={addHabit} />

          {error && (
            <p className="rounded-lg border border-[#be5a38]/30 bg-[#be5a38]/5 px-4 py-2.5 text-sm text-[#be5a38]">
              {error}
            </p>
          )}

          {labelsPresent.length > 1 && (
            <div className="flex flex-wrap gap-1.5 border-b border-[#e5e1d7]/60 dark:border-[#2d3c30] pb-3">
              {filterOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                    filter === c
                      ? "bg-[#232f26] text-white dark:bg-[#5fa07c] dark:text-[#0d130e] shadow-sm"
                      : "border border-[#e5e1d7] bg-white text-[#737970] dark:border-[#2d3c30] dark:bg-[#18201a] dark:text-[#9eb0a2] dark:hover:border-[#5fa07c]/40 dark:hover:text-[#f0ede6] hover:border-[#232f26]/30 hover:text-[#232f26]"
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
            isManaging={isManagingBoard}
            onToggle={toggleHabit}
            onLogProgress={logProgress}
            onEdit={editHabit}
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
