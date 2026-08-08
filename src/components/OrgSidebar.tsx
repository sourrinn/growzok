"use client";

interface Props {
  activeSection: "habits" | "templates";
  onSelectSection: (section: "habits" | "templates") => void;
  habitsCount: number;
  templatesCount: number;
}

export default function OrgSidebar({
  activeSection,
  onSelectSection,
  habitsCount,
  templatesCount,
}: Props) {
  return (
    <aside className="flex h-full w-60 flex-col justify-between border-r border-[#e5e1d7] bg-[#fbf9f5] p-3 text-[#232f26] dark:border-[#2d3c30] dark:bg-[#121a14] dark:text-[#f0ede6]">
      <div className="space-y-5">
        {/* Header Badge */}
        <div className="px-1 py-1">
          <span className="rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-[10px] font-semibold text-[#406852] dark:bg-[#1d3326] dark:text-[#5fa07c]">
            Org Management
          </span>
          <h2 className="mt-2 font-display text-base font-semibold text-[#232f26] dark:text-[#f0ede6]">
            Organization Admin
          </h2>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9eb0a2]">
            Organization Control
          </p>

          <nav className="mt-2 space-y-1.5">
            {/* Standalone Habits Sub-Nav */}
            <button
              onClick={() => onSelectSection("habits")}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                activeSection === "habits"
                  ? "bg-[#232f26] text-[#fbf9f5] dark:bg-[#5fa07c] dark:text-[#0d130e] shadow-sm font-semibold"
                  : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26] dark:text-[#9eb0a2] dark:hover:bg-[#222d25] dark:hover:text-[#f0ede6]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Habit Catalog</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeSection === "habits" ? "bg-white/20 text-white dark:bg-black/20 dark:text-[#0d130e]" : "bg-[#e5e1d7] text-[#232f26] dark:bg-[#2d3c30] dark:text-[#f0ede6]"}`}>
                {habitsCount}
              </span>
            </button>

            {/* Protocols Sub-Nav */}
            <button
              onClick={() => onSelectSection("templates")}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                activeSection === "templates"
                  ? "bg-[#232f26] text-[#fbf9f5] dark:bg-[#5fa07c] dark:text-[#0d130e] shadow-sm font-semibold"
                  : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26] dark:text-[#9eb0a2] dark:hover:bg-[#222d25] dark:hover:text-[#f0ede6]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                </svg>
                <span>Protocols</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeSection === "templates" ? "bg-white/20 text-white dark:bg-black/20 dark:text-[#0d130e]" : "bg-[#e5e1d7] text-[#232f26] dark:bg-[#2d3c30] dark:text-[#f0ede6]"}`}>
                {templatesCount}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <div className="border-t border-[#e5e1d7] dark:border-[#2d3c30] pt-3 text-[10px] text-[#737970] dark:text-[#9eb0a2] text-center">
        Syncs in real-time with database
      </div>
    </aside>
  );
}
