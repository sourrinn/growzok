import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTemplateByKey } from "@/lib/templates";
import { frequencyLabel } from "@/lib/frequency";
import AdoptSection from "./AdoptSection";

interface Props {
  params: Promise<{ key: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const template = getTemplateByKey(key);
  if (!template) return { title: "Template not found" };

  return {
    title: `${template.name} — Growzok`,
    description: template.tagline,
    openGraph: {
      title: template.name,
      description: template.tagline,
      type: "article",
    },
  };
}

const DOMAIN_COLORS: Record<string, string> = {
  Sleep: "bg-indigo-50 text-indigo-700",
  Hydration: "bg-sky-50 text-sky-700",
  Nutrition: "bg-lime-50 text-lime-700",
  Cardio: "bg-red-50 text-red-700",
  Strength: "bg-orange-50 text-orange-700",
  Mobility: "bg-teal-50 text-teal-700",
  Breathing: "bg-cyan-50 text-cyan-700",
  Grooming: "bg-rose-50 text-rose-700",
  Preventive: "bg-yellow-50 text-yellow-700",
  Recovery: "bg-purple-50 text-purple-700",
  Productivity: "bg-blue-50 text-blue-700",
  Finance: "bg-emerald-50 text-emerald-700",
  Social: "bg-pink-50 text-pink-700",
  Learning: "bg-violet-50 text-violet-700",
  "Digital Minimalism": "bg-slate-100 text-slate-700",
  "Gut Health": "bg-green-50 text-green-700",
};

function domainColor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? "bg-mist text-charcoal";
}

export default async function TemplateDetailPage({ params }: Props) {
  const { key } = await params;
  const template = getTemplateByKey(key);
  if (!template) notFound();

  // JSON-LD structured data for Google Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: template.name,
    description: template.tagline,
    step: template.habits.map((h, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: h.name,
      text: h.description ?? h.name,
    })),
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    author: {
      "@type": "Organization",
      name: template.author.name,
    },
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/templates" className="transition-colors hover:text-charcoal">
          Templates
        </Link>
        <span>/</span>
        <span className="text-charcoal">{template.name}</span>
      </nav>

      {/* Hero */}
      <header className="mb-8">
        <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-medium text-charcoal">
          {template.category}
        </span>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-charcoal">
          {template.name}
        </h1>
        <p className="mt-2 text-base text-muted">{template.tagline}</p>

        {/* Stats row */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted">
            <span className="text-amber-400">★</span>
            <span className="font-medium text-charcoal">{template.rating.toFixed(1)}</span>
            <span>({template.reviewsCount.toLocaleString()} reviews)</span>
          </div>
          <span className="text-muted">
            <span className="font-medium text-charcoal">
              {template.activeUsersCount.toLocaleString()}
            </span>{" "}
            active users
          </span>
          <span className="text-muted">
            <span className="font-medium text-charcoal">{template.completionRatePct}%</span>{" "}
            completion rate
          </span>
          <span className="text-muted">
            ~{template.estimatedDailyMinutes} min/day
          </span>
          {template.durationDays && (
            <span className="text-muted">
              {template.durationDays}-day challenge
            </span>
          )}
        </div>
      </header>

      {/* Author */}
      <div className="mb-8 flex items-center gap-3 rounded-lg border border-mist p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-sm font-semibold text-charcoal">
          {template.author.name[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-charcoal">
            {template.author.name}
            {template.author.verified && (
              <span className="ml-1.5 text-xs text-sage">✓ Verified</span>
            )}
          </p>
          <p className="text-xs text-muted">{template.author.role}</p>
        </div>
      </div>

      {/* Overview */}
      {template.overviewMarkdown && (
        <section className="mb-8 text-sm text-muted leading-relaxed">
          <h2 className="mb-3 text-base font-semibold text-charcoal">About This System</h2>
          <p className="whitespace-pre-line">{template.overviewMarkdown.trim()}</p>
        </section>
      )}

      {/* Habit breakdown */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-charcoal">
          Included Habits ({template.habits.length})
        </h2>
        <ul className="space-y-3">
          {template.habits.map((habit, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-mist p-4"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-charcoal">{habit.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${domainColor(habit.domain)}`}
                  >
                    {habit.domain}
                  </span>
                  <span className="rounded-full bg-mist px-1.5 py-0.5 text-[10px] text-muted">
                    {habit.suggestedLabel}
                  </span>
                  {habit.timeOfDay && habit.timeOfDay !== "Anytime" && (
                    <span className="text-[10px] text-muted">{habit.timeOfDay}</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted">
                  {frequencyLabel(habit.frequency)}
                  {habit.target
                    ? ` · ${habit.target.goal} ${habit.target.unit}`
                    : ""}
                  {habit.missAllowance
                    ? ` · ${habit.missAllowance} miss${habit.missAllowance > 1 ? "es" : ""}/wk allowed`
                    : ""}
                </p>
                {habit.description && (
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {habit.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Tags */}
      {template.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-mist px-2.5 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Adopt CTA — client component */}
      <AdoptSection template={template} />

      <p className="mt-4 text-center text-xs text-muted">
        <Link href="/templates" className="underline-offset-2 hover:underline">
          ← Back to all templates
        </Link>
      </p>
    </div>
  );
}
