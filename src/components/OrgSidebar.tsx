"use client";

interface Props {
  activeSection: "habits" | "templates" | "domains" | "categories";
  onSelectSection: (section: "habits" | "templates" | "domains" | "categories") => void;
  habitsCount: number;
  templatesCount: number;
  domainsCount?: number;
  categoriesCount?: number;
}

export default function OrgSidebar({
  activeSection,
  onSelectSection,
  habitsCount,
  templatesCount,
  domainsCount = 0,
  categoriesCount = 0,
}: Props) {
  return (
    <aside className="flex h-full w-60 flex-col justify-between border-r border-[#e5e1d7] bg-[#fbf9f5] p-3 text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5]">
      <div className="space-y-5">
        {/* Header Badge */}
        <div className="px-1 py-1">
          <span className="rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-[10px] font-semibold text-[#406852] dark:bg-[#27272a] dark:text-[#a1a1aa]">
            Org Management
          </span>
          <h2 className="mt-2 font-display text-base font-semibold text-[#232f26] dark:text-[#f4f4f5]">
            Organization Admin
          </h2>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Catalog & Systems
          </p>

          <nav className="mt-2 space-y-1.5">
            {/* Standalone Habits Sub-Nav */}
            <button
              onClick={() => onSelectSection("habits")}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                activeSection === "habits"
                  ? "bg-[#232f26] text-[#fbf9f5] dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-sm font-semibold border border-transparent dark:border-[#3f3f46]"
                  : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:bg-[#27272a] dark:hover:text-[#f4f4f5]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Habit Catalog</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeSection === "habits" ? "bg-white/20 text-white dark:bg-white/10 dark:text-[#f4f4f5]" : "bg-[#e5e1d7] text-[#232f26] dark:bg-[#27272a] dark:text-[#a1a1aa]"}`}>
                {habitsCount}
              </span>
            </button>

            {/* Protocols Sub-Nav */}
            <button
              onClick={() => onSelectSection("templates")}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                activeSection === "templates"
                  ? "bg-[#232f26] text-[#fbf9f5] dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-sm font-semibold border border-transparent dark:border-[#3f3f46]"
                  : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:bg-[#27272a] dark:hover:text-[#f4f4f5]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                </svg>
                <span>Protocols</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeSection === "templates" ? "bg-white/20 text-white dark:bg-white/10 dark:text-[#f4f4f5]" : "bg-[#e5e1d7] text-[#232f26] dark:bg-[#27272a] dark:text-[#a1a1aa]"}`}>
                {templatesCount}
              </span>
            </button>

            {/* Biological Domains Sub-Nav */}
            <button
              onClick={() => onSelectSection("domains")}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                activeSection === "domains"
                  ? "bg-[#232f26] text-[#fbf9f5] dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-sm font-semibold border border-transparent dark:border-[#3f3f46]"
                  : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:bg-[#27272a] dark:hover:text-[#f4f4f5]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Biological Domains</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeSection === "domains" ? "bg-white/20 text-white dark:bg-white/10 dark:text-[#f4f4f5]" : "bg-[#e5e1d7] text-[#232f26] dark:bg-[#27272a] dark:text-[#a1a1aa]"}`}>
                {domainsCount}
              </span>
            </button>

            {/* Protocol Categories Sub-Nav */}
            <button
              onClick={() => onSelectSection("categories")}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                activeSection === "categories"
                  ? "bg-[#232f26] text-[#fbf9f5] dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-sm font-semibold border border-transparent dark:border-[#3f3f46]"
                  : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:bg-[#27272a] dark:hover:text-[#f4f4f5]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                  <path d="M4 6h16M4 12h16M4 18h7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Protocol Categories</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeSection === "categories" ? "bg-white/20 text-white dark:bg-white/10 dark:text-[#f4f4f5]" : "bg-[#e5e1d7] text-[#232f26] dark:bg-[#27272a] dark:text-[#a1a1aa]"}`}>
                {categoriesCount}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <div className="border-t border-[#e5e1d7] dark:border-[#27272a] pt-3 text-[10px] text-[#737970] dark:text-[#a1a1aa] text-center">
        Syncs in real-time with database
      </div>
    </aside>
  );
}
