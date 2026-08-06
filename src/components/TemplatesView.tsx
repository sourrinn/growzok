"use client";

import { useMemo, useState } from "react";
import TemplateCard from "@/components/TemplateCard";
import { HABIT_TEMPLATES, getAvailableCategories } from "@/lib/templates";
import { HABIT_DOMAINS, type HabitDomain } from "@/types/habit";
import type { TemplateCategory } from "@/types/template";

type SortMode = "popularity" | "rating" | "time";

export default function TemplatesView() {
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | "All">("All");
  const [domainFilter, setDomainFilter] = useState<HabitDomain | "All">("All");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("popularity");

  const availableCategories = useMemo(() => getAvailableCategories(), []);

  const filteredAndSorted = useMemo(() => {
    let list = HABIT_TEMPLATES.filter((t) => {
      if (categoryFilter !== "All" && t.category !== categoryFilter) return false;
      if (domainFilter !== "All") {
        const domains = t.habits.map((h) => h.domain);
        if (!domains.includes(domainFilter as HabitDomain)) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
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
  }, [categoryFilter, domainFilter, search, sortMode]);

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
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[#232f26]">
          Habit Systems Marketplace
        </h1>
        <p className="mt-1.5 text-sm text-[#737970]">
          Expert-curated biological & behavioral protocols. Preview habit routines and adopt into your account in one tap.
        </p>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search templates by goal, name, or tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#e5e1d7] bg-white px-4 py-3 text-sm text-[#232f26] outline-none transition-colors placeholder:text-[#737970] focus:border-[#232f26]/40 sm:max-w-md"
        />

        <div className="flex items-center gap-2 text-xs text-[#737970]">
          <span className="font-semibold text-[#232f26]">Sort by:</span>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="rounded-xl border border-[#e5e1d7] bg-white px-3 py-2.5 font-semibold text-[#232f26] outline-none cursor-pointer"
          >
            <option value="popularity">Popularity (Active Users)</option>
            <option value="rating">Highest Rating</option>
            <option value="time">Fastest Routine (Min/day)</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar (Row 1) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["All", ...availableCategories] as (TemplateCategory | "All")[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? "bg-[#232f26] text-white shadow-sm"
                  : "border border-[#e5e1d7] bg-white text-[#737970] hover:border-[#232f26]/30 hover:text-[#232f26]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Biological Domain Dropdown & Counter Row (Row 2) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e1d7]/60 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#737970]">Filter Domain:</span>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value as HabitDomain | "All")}
              className="rounded-xl border border-[#e5e1d7] bg-white px-3 py-1.5 font-semibold text-[#232f26] outline-none cursor-pointer"
            >
              <option value="All">All Biological Domains</option>
              {HABIT_DOMAINS.map((dom) => (
                <option key={dom} value={dom}>
                  {dom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#737970]">
              Showing <span className="font-semibold text-[#232f26]">{filteredAndSorted.length}</span> system
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

      {/* Template Cards Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="rounded-2xl border border-[#e5e1d7] bg-white p-12 text-center">
          <p className="text-sm text-[#737970]">
            No habit systems match your selected filters.
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
          {filteredAndSorted.map((t) => (
            <TemplateCard key={t.key} template={t} />
          ))}
        </div>
      )}
    </div>
  );
}
