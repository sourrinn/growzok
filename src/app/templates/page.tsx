"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TemplateCard from "@/components/TemplateCard";
import { HABIT_TEMPLATES, getAvailableCategories } from "@/lib/templates";
import { HABIT_DOMAINS, type HabitDomain } from "@/types/habit";
import type { TemplateCategory } from "@/types/template";

export default function TemplatesPage() {
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
    <div className="min-h-screen bg-slate-50/40">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 mb-8 border-b border-mist/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-charcoal font-display text-base font-bold text-ink">
                G
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-charcoal">
                Growzok
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/" className="text-muted transition-colors hover:text-charcoal">
                Habits
              </Link>
              <Link href="/reports" className="text-muted transition-colors hover:text-charcoal">
                Reports
              </Link>
              <span className="text-charcoal underline underline-offset-8">Templates</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* Hero */}
        <header className="mb-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-charcoal">
            Habit Systems Marketplace
          </h1>
          <p className="mt-2 text-sm text-muted">
            Expert-curated habit protocols. Filter by category or biological domain, preview habits, and adopt in one tap.
          </p>
        </header>

        {/* Search */}
        <input
          type="search"
          placeholder="Search templates by name, goal, or tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-5 w-full rounded-xl border border-mist bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-muted focus:border-sage"
        />

        {/* Category filter pills */}
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

        {/* Domain filter pills */}
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

        {/* Results */}
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

        {/* Bottom CTA */}
        <p className="mt-12 text-center text-xs text-muted">
          Want to track custom habits without a template?{" "}
          <Link href="/" className="font-semibold text-charcoal underline underline-offset-2 hover:text-sage">
            Go to your habits dashboard →
          </Link>
        </p>
      </main>
    </div>
  );
}
