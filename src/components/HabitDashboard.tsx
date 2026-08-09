"use client";

import { useEffect, useMemo, useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import AddHabit from "@/components/AddHabit";
import HabitList from "@/components/HabitList";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardProgressBar from "@/components/DashboardProgressBar";
import { todayStr } from "@/lib/dates";

type ViewMode = "grid" | "compact";
type StatusFilter = "all" | "pending" | "completed";

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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyPending, setOnlyPending] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
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

    const savedView = localStorage.getItem("growzok_dashboard_view_mode");
    if (savedView === "grid" || savedView === "compact") {
      setViewMode(savedView);
    }
  }, []);

  const handleToggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("growzok_dashboard_view_mode", mode);
  };

  // Filter options based on userLabel
  const labelsPresent = useMemo(
    () => Array.from(new Set(habits.map((h) => h.userLabel))),
    [habits]
  );
  const filterOptions = ["All", ...labelsPresent];

  const today = todayStr();

  // Multi-tier filtering for high-density 20+ habits
  const filteredHabits = useMemo(() => {
    return habits.filter((h) => {
      // 1. Label Filter
      if (filter !== "All" && h.userLabel !== filter) return false;

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = h.name.toLowerCase().includes(q);
        const matchDomain = h.domain.toLowerCase().includes(q);
        if (!matchName && !matchDomain) return false;
      }

      // 3. Today Completion Status
      const isDone = h.history.includes(today);

      if (onlyPending && isDone) return false;

      if (statusFilter === "pending" && isDone) return false;
      if (statusFilter === "completed" && !isDone) return false;

      return true;
    });
  }, [habits, filter, searchQuery, statusFilter, onlyPending, today]);

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
            Daily Habits
          </h1>
          {todayFormatted && (
            <p className="mt-1 text-xs sm:text-sm tabular-nums text-[#737970] dark:text-[#a1a1aa]">
              {todayFormatted}
            </p>
          )}
        </div>

        {!loading && habits.length > 0 && (
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* View Mode Switcher (Grid vs Compact) */}
            <div className="flex items-center rounded-xl border border-[#e5e1d7] bg-white p-1 shadow-xs dark:border-[#27272a] dark:bg-[#18181b]">
              <button
                type="button"
                onClick={() => handleToggleViewMode("grid")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === "grid"
                    ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-xs"
                    : "text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
                }`}
                title="Grid Cards View"
              >
                ⊞ Cards
              </button>
              <button
                type="button"
                onClick={() => handleToggleViewMode("compact")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === "compact"
                    ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-xs"
                    : "text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
                }`}
                title="Compact Density View for 20+ Habits"
              >
                ☰ Compact
              </button>
            </div>

            <button
              onClick={() => setIsManagingBoard((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-sm transition-all ${
                isManagingBoard
                  ? "border-[#406852] bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border-[#3f3f46] shadow-md"
                  : "border-[#e5e1d7] bg-white text-[#232f26] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#f4f4f5] dark:hover:bg-[#27272a] hover:bg-[#fbf9f5]"
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
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-[#737970] dark:text-[#a1a1aa]">
                    <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Manage Board</span>
                </>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Daily Progress Command Bar */}
      <DashboardProgressBar
        habits={habits}
        onlyPending={onlyPending}
        onTogglePendingOnly={() => setOnlyPending((prev) => !prev)}
      />

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

          {/* Search Bar & Status Filter Bar for 20+ Habits */}
          {habits.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                type="search"
                placeholder="Search habits by name or domain…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#e5e1d7] bg-white px-3.5 py-2 text-xs text-[#232f26] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa] focus:border-[#232f26]/40 dark:focus:border-[#3f3f46] sm:max-w-xs"
              />

              <div className="flex items-center gap-1 rounded-xl border border-[#e5e1d7] bg-white p-1 shadow-xs dark:border-[#27272a] dark:bg-[#18181b] shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    statusFilter === "all"
                      ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-xs"
                      : "text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26]"
                  }`}
                >
                  All ({habits.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("pending")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    statusFilter === "pending"
                      ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-xs"
                      : "text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26]"
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("completed")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    statusFilter === "completed"
                      ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-xs"
                      : "text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26]"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          )}

          {/* User Label Filters (Morning, Evening, etc.) */}
          {labelsPresent.length > 1 && (
            <div className="flex items-center gap-1.5 border-b border-[#e5e1d7]/60 dark:border-[#27272a] pb-3 overflow-x-auto no-scrollbar flex-nowrap shrink-0">
              {filterOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                    filter === c
                      ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46] shadow-sm"
                      : "border border-[#e5e1d7] bg-white text-[#737970] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#a1a1aa] dark:hover:border-[#3f3f46] dark:hover:text-[#f4f4f5] hover:border-[#232f26]/30 hover:text-[#232f26]"
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
            viewMode={viewMode}
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
