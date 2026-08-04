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
    <div className="mx-auto max-w-2xl px-5 py-8">
      {/* Minimal nav — AppHeader is a Server Component with a sign-out action, so use a plain nav here */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-muted transition-colors hover:text-charcoal">
            Habits
          </Link>
          <Link href="/reports" className="text-muted transition-colors hover:text-charcoal">
            Reports
          </Link>
          <span className="font-medium text-charcoal">Templates</span>
        </nav>
      </div>

      {/* Hero */}
      <header className="mb-8">
        <h1 className="font-display text-4xl font-medium tracking-tight text-charcoal">
          Habit Templates
        </h1>
        <p className="mt-2 text-sm text-muted">
          Expert-curated habit systems. Browse, customise, and adopt in one tap.
        </p>
      </header>

      {/* Search */}
      <input
        type="search"
        placeholder="Search templates…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-5 w-full rounded-lg border border-mist bg-transparent px-4 py-2.5 text-sm text-charcoal outline-none transition-colors placeholder:text-muted focus:border-sage"
      />

      {/* Category filter pills */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(["All", ...availableCategories] as (TemplateCategory | "All")[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              categoryFilter === cat
                ? "bg-charcoal text-ink"
                : "border border-mist text-muted hover:text-charcoal"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Domain filter pills */}
      <div className="mb-7 flex flex-wrap gap-1.5">
        {(["All", ...HABIT_DOMAINS] as (HabitDomain | "All")[]).map((dom) => (
          <button
            key={dom}
            onClick={() => setDomainFilter(dom)}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
              domainFilter === dom
                ? "bg-sage text-ink"
                : "border border-mist text-muted hover:text-charcoal"
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted">No templates match your filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((t) => (
            <TemplateCard key={t.key} template={t} />
          ))}
        </div>
      )}

      {/* CTA bottom */}
      <p className="mt-10 text-center text-xs text-muted">
        Want to track without a template?{" "}
        <Link href="/" className="underline underline-offset-2 hover:text-charcoal">
          Go to your habits →
        </Link>
      </p>
    </div>
  );
}
