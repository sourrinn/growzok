"use client";

import { useEffect, useMemo, useState } from "react";
import { useHabits } from "@/hooks/useHabits";
import AddHabit from "@/components/AddHabit";
import HabitList from "@/components/HabitList";
import DashboardSidebar from "@/components/DashboardSidebar";
import SmartPriorityCard from "@/components/SmartPriorityCard";
import WelcomeBackBanner from "@/components/WelcomeBackBanner";
import OnboardingWizardModal from "@/components/OnboardingWizardModal";
import { todayStr } from "@/lib/dates";
import type { HabitDomain } from "@/types/habit";

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
  const [domainFilter, setDomainFilter] = useState<string>("All");
  const [timeFilter, setTimeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyPending, setOnlyPending] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [todayFormatted, setTodayFormatted] = useState<string>("");
  const [isManagingBoard, setIsManagingBoard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem("growzok-onboarded");
    if (!onboarded && !loading && habits.length === 0) {
      setShowOnboarding(true);
    }
  }, [loading, habits]);


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
      // 1. Label Filter, Domain Filter, and Time of Day Filter
      if (filter !== "All" && h.userLabel !== filter) return false;
      if (domainFilter !== "All" && h.domain !== domainFilter) return false;
      if (timeFilter !== "All") {
        const timeLower = timeFilter.toLowerCase();
        const matchLabel = h.userLabel.toLowerCase().includes(timeLower);
        const matchName = h.name.toLowerCase().includes(timeLower);
        if (!matchLabel && !matchName) return false;
      }

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
  }, [habits, filter, domainFilter, timeFilter, searchQuery, statusFilter, onlyPending, today]);


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
                Cards
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
                Compact
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

      {/* Main Responsive Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left / Center Main Content */}
        <div className="space-y-6 min-w-0">
          {/* Welcome Back Momentum Reset Banner */}
          {!loading && habits.length > 0 && (
            <WelcomeBackBanner habits={habits} />
          )}

          {/* Smart Priority Digest Card */}
          {!loading && habits.length > 0 && (
            <SmartPriorityCard habits={habits} onToggle={toggleHabit} />
          )}

          <AddHabit onAdd={addHabit} />

          {error && (
            <p className="rounded-lg border border-[#be5a38]/30 bg-[#be5a38]/5 px-4 py-2.5 text-sm text-[#be5a38]">
              {error}
            </p>
          )}

          {/* Unified Executive Search & Filter Workstation Card */}
          {habits.length > 0 && (
            <div className="rounded-3xl border border-[#e5e1d7] bg-white p-4 sm:p-5 shadow-sm space-y-3.5 dark:border-[#27272a] dark:bg-[#18181b]">
              {/* Row 1: Search Input & Segmented Status Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 flex items-center rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] px-3.5 py-2.5 text-xs focus-within:border-[#406852] dark:focus-within:border-[#a3b899] transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-[#737970] dark:text-[#a1a1aa] mr-2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search habits by name, domain, or label..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-white font-bold ml-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Segmented Status Switcher */}
                <div className="flex w-full sm:w-auto items-center justify-between gap-1 rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-1 dark:border-[#27272a] dark:bg-[#121215] shrink-0">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`flex-1 sm:flex-initial rounded-xl px-4 py-1.5 text-xs font-bold transition-all text-center ${
                      statusFilter === "all"
                        ? "bg-[#232f26] text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs"
                        : "text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26] dark:hover:text-white"
                    }`}
                  >
                    All ({habits.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("pending")}
                    className={`flex-1 sm:flex-initial rounded-xl px-4 py-1.5 text-xs font-bold transition-all text-center ${
                      statusFilter === "pending"
                        ? "bg-[#232f26] text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs"
                        : "text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26] dark:hover:text-white"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("completed")}
                    className={`flex-1 sm:flex-initial rounded-xl px-4 py-1.5 text-xs font-bold transition-all text-center ${
                      statusFilter === "completed"
                        ? "bg-[#232f26] text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs"
                        : "text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26] dark:hover:text-white"
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Row 2: Domain Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#e5e1d7]/60 dark:border-[#27272a] no-scrollbar scroll-x-safe">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa] shrink-0 mr-1">
                  Domain:
                </span>
                {["All", "Sleep", "Hydration", "Cardio", "Strength", "Breathing", "Productivity", "Digital Minimalism"].map((dom) => (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => setDomainFilter(dom)}
                    className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                      domainFilter === dom
                        ? "bg-[#406852] text-white dark:bg-[#a3b899] dark:text-[#18181b] shadow-xs"
                        : "border border-[#e5e1d7] bg-[#fbf9f5] text-[#737970] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#a1a1aa] hover:border-[#232f26]/30 hover:text-[#232f26] dark:hover:border-[#3f3f46] dark:hover:text-white"
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>

              {/* Row 3: User Label Filter Pills (if custom labels present) */}
              {labelsPresent.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar scroll-x-safe">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa] shrink-0 mr-1">
                    Label:
                  </span>
                  {filterOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilter(c)}
                      className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                        filter === c
                          ? "bg-[#232f26] text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs"
                          : "border border-[#e5e1d7] bg-[#fbf9f5] text-[#737970] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#a1a1aa] hover:border-[#232f26]/30 hover:text-[#232f26] dark:hover:border-[#3f3f46] dark:hover:text-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
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

        {/* Right Sidebar Widgets */}
        <div className="min-w-0">
          <DashboardSidebar
            habits={habits}
            onlyPending={onlyPending}
            onTogglePendingOnly={() => setOnlyPending((prev) => !prev)}
          />
        </div>
      </div>
      {/* First-Run Onboarding Wizard Modal */}
      {showOnboarding && (
        <OnboardingWizardModal
          onClose={() => setShowOnboarding(false)}
          onComplete={async (presets) => {
            setShowOnboarding(false);
            for (const p of presets) {
              await addHabit({
                name: p.name,
                domain: p.domain,
                userLabel: p.category,
                category: p.category as any,
                frequency: { type: "daily" },
                missAllowance: 0,
                target: null,
              });
            }
          }}
        />
      )}
    </div>
  );
}
