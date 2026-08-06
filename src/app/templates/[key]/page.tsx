import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
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
  return DOMAIN_COLORS[domain] ?? "bg-[#e5e1d7] text-[#232f26]";
}

/** Helper to clean raw markdown headers & bullet syntax for crisp typography. */
function cleanOverviewText(raw?: string): string {
  if (!raw) return "";
  return raw
    .replace(/^###\s+/gm, "")
    .replace(/^- \*\*(.*?)\*\*/gm, "• $1")
    .trim();
}

export default async function TemplateDetailPage({ params }: Props) {
  const { key } = await params;
  const template = getTemplateByKey(key);
  if (!template) notFound();

  const formattedOverview = cleanOverviewText(template.overviewMarkdown);

  return (
    <AppShell>
      <div className="w-full space-y-8">
        {/* Top Breadcrumb & Hero */}
        <div>
          <nav className="mb-4 flex items-center gap-2 text-xs text-[#737970]">
            <Link href="/templates" className="transition-colors hover:text-[#232f26]">
              Habit Systems Marketplace
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#232f26]">{template.name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#e3ede6] px-3 py-1 text-xs font-semibold text-[#406852]">
              {template.category}
            </span>
            <span className="rounded-full bg-[#e5e1d7] px-3 py-1 text-xs font-semibold text-[#232f26]">
              {template.difficulty} Protocol
            </span>
          </div>

          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[#232f26]">
            {template.name}
          </h1>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-[#737970]">
            {template.tagline}
          </p>
        </div>

        {/* Full-Width 2-Column Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content Column (8 cols) */}
          <div className="space-y-8 lg:col-span-8">
            {/* Overview / About This System */}
            {formattedOverview && (
              <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737970]">
                  System Overview & Methodology
                </h2>
                <div className="mt-3 text-sm leading-relaxed text-[#232f26] whitespace-pre-line">
                  {formattedOverview}
                </div>
              </div>
            )}

            {/* Included Habits List */}
            <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#e5e1d7] pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737970]">
                  Included Habits ({template.habits.length})
                </h2>
                <span className="text-xs text-[#737970]">
                  ~{template.estimatedDailyMinutes} mins daily commitment
                </span>
              </div>

              <ul className="space-y-4">
                {template.habits.map((habit, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col gap-2 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-4 transition-all hover:border-[#232f26]/30"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-[#232f26]">
                          {habit.name}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${domainColor(
                            habit.domain
                          )}`}
                        >
                          {habit.domain}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#737970]">
                        <span className="rounded-full bg-[#e5e1d7] px-2.5 py-0.5 text-[11px] font-medium text-[#232f26]">
                          {habit.suggestedLabel}
                        </span>
                        {habit.timeOfDay && habit.timeOfDay !== "Anytime" && (
                          <span className="font-medium text-[#737970]">{habit.timeOfDay}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#737970]">
                      <span className="font-semibold text-[#232f26]">
                        {frequencyLabel(habit.frequency)}
                      </span>
                      {habit.target && (
                        <span>
                          Target: <span className="font-semibold text-[#232f26]">{habit.target.goal} {habit.target.unit}</span>
                        </span>
                      )}
                      {habit.missAllowance ? (
                        <span>Allowed Misses: {habit.missAllowance}/wk</span>
                      ) : null}
                    </div>

                    {habit.description && (
                      <p className="mt-1 text-xs leading-relaxed text-[#737970]">
                        {habit.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Action Sidebar (4 cols) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Adopt Action Card */}
            <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#737970]">
                Adopt System
              </h3>
              <p className="text-xs text-[#737970]">
                Instantly import these habit routines into your Growzok tracker. You can customize targets before saving.
              </p>

              <AdoptSection template={template} />
            </div>

            {/* Author Profile */}
            <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737970]">
                Protocol Author
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#232f26] font-display text-sm font-bold text-white">
                  {template.author.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#232f26]">
                    {template.author.name}
                  </p>
                  <p className="text-xs text-[#737970]">{template.author.role}</p>
                </div>
              </div>
            </div>

            {/* Tags Cloud */}
            {template.tags.length > 0 && (
              <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737970]">
                  System Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-[#e5e1d7] bg-[#fbf9f5] px-2.5 py-1 text-xs text-[#737970]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
