"use client";

import { useEffect, useMemo, useState } from "react";
import ProtocolCard from "@/components/ProtocolCard";
import CustomSelect from "@/components/CustomSelect";
import { STANDARD_PROTOCOLS, getAvailableCategories } from "@/lib/protocols";
import { HABIT_DOMAINS, type HabitDomain } from "@/types/habit";
import type { Protocol, ProtocolCategory } from "@/types/protocol";

type SortMode = "popularity" | "rating" | "time";

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity (Active Users)" },
  { value: "rating", label: "Highest Rating" },
  { value: "time", label: "Fastest Routine (Min/day)" },
];

export default function ProtocolsView() {
  const [categoryFilter, setCategoryFilter] = useState<ProtocolCategory | "All">("All");
  const [domainFilter, setDomainFilter] = useState<HabitDomain | "All">("All");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("popularity");
  const [realtimeStats, setRealtimeStats] = useState<Record<string, { activeUsersCount: number; completionRatePct: number }>>({});
  const [customProtocols, setCustomProtocols] = useState<Protocol[]>([]);

  useEffect(() => {
    // Fetch real-time stats
    fetch("/api/templates/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data?.stats) setRealtimeStats(data.stats);
      })
      .catch(() => {});

    // Fetch custom org protocols
    fetch("/api/admin/templates")
      .then((res) => res.json())
      .then((data) => {
        if (data?.templates) setCustomProtocols(data.templates);
      })
      .catch(() => {});
  }, []);

  const allProtocols = useMemo(() => {
    return [...STANDARD_PROTOCOLS, ...customProtocols];
  }, [customProtocols]);

  const availableCategories = useMemo(() => {
    const set = new Set<ProtocolCategory>(getAvailableCategories());
    customProtocols.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [customProtocols]);

  // Merge real-time DB stats with protocol definitions
  const mergedProtocols = useMemo(() => {
    return allProtocols.map((p) => {
      const stats = realtimeStats[p.key];
      return {
        ...p,
        activeUsersCount: stats ? stats.activeUsersCount : 0,
        completionRatePct: stats ? stats.completionRatePct : 0,
      };
    });
  }, [allProtocols, realtimeStats]);

  const filteredAndSorted = useMemo(() => {
    let list = mergedProtocols.filter((p) => {
      if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
      if (domainFilter !== "All") {
        const domains = p.habits.map((h) => h.domain);
        if (!domains.includes(domainFilter as HabitDomain)) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortMode === "rating") return b.rating - a.rating;
      if (sortMode === "time") return a.estimatedDailyMinutes - b.estimatedDailyMinutes;
      return b.activeUsersCount - a.activeUsersCount; // default: popularity
    });

    return list;
  }, [mergedProtocols, categoryFilter, domainFilter, search, sortMode]);

  const hasActiveFilters = categoryFilter !== "All" || domainFilter !== "All" || search.trim() !== "";

  const resetFilters = () => {
    setCategoryFilter("All");
    setDomainFilter("All");
    setSearch("");
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[#232f26] dark:text-[#f0ede6]">
          Protocol Hub
        </h1>
        <p className="mt-1.5 text-sm text-[#737970] dark:text-[#9eb0a2]">
          Science-backed & organization habit protocols. Preview routines and adopt them into your personal dashboard in one tap.
        </p>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search protocols by goal, name, or tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#e5e1d7] bg-white dark:border-[#2d3c30] dark:bg-[#18201a] px-4 py-3 text-sm text-[#232f26] dark:text-[#f0ede6] outline-none transition-colors placeholder:text-[#737970] dark:placeholder:text-[#9eb0a2] focus:border-[#232f26]/40 dark:focus:border-[#5fa07c] sm:max-w-md"
        />

        <div className="flex items-center gap-2 text-xs text-[#737970] dark:text-[#9eb0a2]">
          <CustomSelect
            prefixLabel="Sort by: "
            options={SORT_OPTIONS}
            value={sortMode}
            onChange={(val) => setSortMode(val as SortMode)}
          />
        </div>
      </div>

      {/* Category Pills Bar (Row 1) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["All", ...availableCategories] as (ProtocolCategory | "All")[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? "bg-[#232f26] text-white dark:bg-[#5fa07c] dark:text-[#0d130e] shadow-sm"
                  : "border border-[#e5e1d7] bg-white text-[#737970] dark:border-[#2d3c30] dark:bg-[#18201a] dark:text-[#9eb0a2] hover:border-[#232f26]/30 dark:hover:border-[#5fa07c]/40 hover:text-[#232f26] dark:hover:text-[#f0ede6]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Biological Domain Dropdown & Counter Row (Row 2) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e1d7]/60 dark:border-[#2d3c30] pt-3 text-xs">
          <div className="flex items-center gap-2">
            <CustomSelect
              prefixLabel="Domain: "
              options={[
                { value: "All", label: "All Biological Domains" },
                ...HABIT_DOMAINS.map((dom) => ({ value: dom, label: dom })),
              ]}
              value={domainFilter}
              onChange={(val) => setDomainFilter(val as HabitDomain | "All")}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#737970] dark:text-[#9eb0a2]">
              Showing <span className="font-semibold text-[#232f26] dark:text-[#f0ede6]">{filteredAndSorted.length}</span> protocol
              {filteredAndSorted.length === 1 ? "" : "s"}
            </span>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="font-semibold text-[#be5a38] underline underline-offset-2 hover:opacity-80"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Protocol Cards Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="rounded-2xl border border-[#e5e1d7] bg-white p-12 text-center">
          <p className="text-sm text-[#737970]">
            No protocols match your selected filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-3 rounded-xl bg-[#232f26] px-4 py-2 text-xs font-semibold text-white"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((p) => (
            <ProtocolCard key={p.key} protocol={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export { ProtocolsView as TemplatesView };
