"use client";

import { useMemo, useState } from "react";
import TemplateCard from "@/components/TemplateCard";
import { HABIT_TEMPLATES, getAvailableCategories } from "@/lib/templates";
import { HABIT_DOMAINS, type HabitDomain } from "@/types/habit";
import type { TemplateCategory } from "@/types/template";

export default function TemplatesView() {
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | "All">("All");
  const [domainFilter, setDomainFilter] = useState<HabitDomain | "All">("All");
  const [search, setSearch] = useState("");

  const availableCategories = useMemo(() => getAvailableCategories(), []);

  const filtered = useMemo(() => {
    return HABIT_TEMPLATES.filter((t) => {
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
  }, [categoryFilter, domainFilter, search]);

  return (
    <div>
      {/* Hero Header */}
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-charcoal">
          Habit Systems Marketplace
        </h1>
        <p className="mt-2 text-sm text-muted">
          Expert-curated habit protocols. Filter by category or biological domain, preview habits, and adopt in one tap.
        </p>
      </header>

      {/* Search Input */}
      <input
        type="search"
        placeholder="Search templates by name, goal, or tags…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-5 w-full rounded-xl border border-mist bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-muted focus:border-sage"
      />

      {/* Category Filter Pills */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(["All", ...availableCategories] as (TemplateCategory | "All")[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
              categoryFilter === cat
                ? "bg-charcoal text-ink shadow-sm"
                : "border border-mist/80 bg-white text-muted hover:border-charcoal/30 hover:text-charcoal"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Domain Filter Pills */}
      <div className="mb-8 flex flex-wrap gap-1.5">
        {(["All", ...HABIT_DOMAINS] as (HabitDomain | "All")[]).map((dom) => (
          <button
            key={dom}
            onClick={() => setDomainFilter(dom)}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
              domainFilter === dom
                ? "bg-sage text-ink"
                : "border border-mist/80 bg-white text-muted hover:border-charcoal/30 hover:text-charcoal"
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          No habit templates match your selected filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <TemplateCard key={t.key} template={t} />
          ))}
        </div>
      )}
    </div>
  );
}
