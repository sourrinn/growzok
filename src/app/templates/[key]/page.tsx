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
  Sleep: "bg-[#e8ebf5] text-[#2c3e6b]",
  Hydration: "bg-[#e2f0f4] text-[#1f5669]",
  Nutrition: "bg-[#e8f1e3] text-[#345c29]",
  Cardio: "bg-[#f5e9e5] text-[#7a3322]",
  Strength: "bg-[#f4efe2] text-[#6b4923]",
  Mobility: "bg-[#e5f2ee] text-[#235848]",
  Breathing: "bg-[#e0f2f5] text-[#1b5e6b]",
  Grooming: "bg-[#f5e8ed] text-[#6e2840]",
  Preventive: "bg-[#f5f0df] text-[#6e561c]",
  Recovery: "bg-[#eee8f5] text-[#502e6b]",
  Productivity: "bg-[#e3ede6] text-[#232f26]",
  Finance: "bg-[#e4ede6] text-[#2d4a3e]",
  Social: "bg-[#f5e8e3] text-[#7a422d]",
  Learning: "bg-[#ebdcd3] text-[#5c3e31]",
  "Digital Minimalism": "bg-[#e5e1d7] text-[#424541]",
  "Gut Health": "bg-[#e8f0e5] text-[#385c2c]",
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
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
        <span className="rounded-full bg-mist/70 px-2.5 py-0.5 text-xs font-medium text-charcoal">
          {template.category}
        </span>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-charcoal sm:text-4xl">
          {template.name}
        </h1>
        <p className="mt-2 text-base text-muted">{template.tagline}</p>

        {/* Stats row */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted">
            <span className="font-semibold text-charcoal">Rating {template.rating.toFixed(1)}</span>
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
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-mist bg-white p-4 shadow-sm">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-sm font-semibold text-charcoal">
          {template.author.name[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-charcoal">
            {template.author.name}
            {template.author.verified && (
              <span className="ml-1.5 text-xs font-medium text-sage">Verified Author</span>
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
              className="flex items-start gap-3 rounded-xl border border-mist bg-white p-4 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-charcoal">{habit.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${domainColor(habit.domain)}`}
                  >
                    {habit.domain}
                  </span>
                  <span className="rounded-full bg-mist/60 px-2 py-0.5 text-[10px] text-muted">
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
              className="rounded-full border border-mist bg-white px-2.5 py-0.5 text-xs text-muted"
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
