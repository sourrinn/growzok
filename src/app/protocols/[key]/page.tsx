import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { getProtocolByKey, getSimilarProtocols } from "@/lib/protocols";
import { frequencyLabel } from "@/lib/frequency";
import AdoptSection from "./AdoptSection";
import { getDb } from "@/lib/mongodb";
import type { Protocol } from "@/types/protocol";

interface Props {
  params: Promise<{ key: string }>;
}

async function resolveProtocol(key: string): Promise<Protocol | undefined> {
  const staticP = getProtocolByKey(key);
  if (staticP) return staticP;

  try {
    const db = await getDb();
    const col = db.collection("custom_templates");
    const doc = await col.findOne({ $or: [{ key }, { slug: key }] });
    if (!doc) return undefined;

    return {
      key: doc.key,
      slug: doc.slug || doc.key,
      name: doc.name,
      tagline: doc.tagline,
      description: doc.description || "",
      overviewMarkdown: doc.overviewMarkdown || "",
      category: doc.category,
      difficulty: doc.difficulty || "Intermediate",
      estimatedDailyMinutes: doc.estimatedDailyMinutes || 30,
      durationDays: doc.durationDays,
      rating: doc.rating || 0,
      reviewsCount: doc.reviewsCount || 0,
      activeUsersCount: doc.activeUsersCount || 0,
      completionRatePct: doc.completionRatePct || 0,
      author: doc.author || { name: "Org Admin", role: "Custom Protocol", verified: true },
      tags: doc.tags || [],
      habits: doc.habits || [],
    };
  } catch {
    return undefined;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const protocol = await resolveProtocol(key);
  if (!protocol) return { title: "Protocol not found" };

  return {
    title: `${protocol.name} — Growzok Protocols`,
    description: protocol.tagline,
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

export default async function ProtocolDetailPage({ params }: Props) {
  const { key } = await params;
  const protocol = await resolveProtocol(key);
  if (!protocol) notFound();

  const formattedOverview = cleanOverviewText(protocol.overviewMarkdown);

  return (
    <AppShell userLabel="Protocol Hub">
      <div className="w-full space-y-8">
        {/* Top Breadcrumb & Hero */}
        <div>
          <nav className="mb-4 flex items-center gap-2 text-xs text-[#737970] dark:text-[#a1a1aa]">
            <Link href="/protocols" className="transition-colors hover:text-[#232f26] dark:hover:text-[#f4f4f5]">
              Protocol Hub
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">{protocol.name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#e3ede6] dark:bg-[#27272a] px-3 py-1 text-xs font-semibold text-[#406852] dark:text-[#a1a1aa]">
              {protocol.category}
            </span>
            <span className="rounded-full bg-[#e5e1d7] dark:bg-[#27272a] px-3 py-1 text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5]">
              {protocol.difficulty} Protocol
            </span>
          </div>

          <h1 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
            {protocol.name}
          </h1>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-[#737970] dark:text-[#a1a1aa]">
            {protocol.tagline}
          </p>
        </div>

        {/* Full-Width 2-Column Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content Column (8 cols) */}
          <div className="space-y-8 lg:col-span-8">
            {/* Overview / About This System */}
            {formattedOverview && (
              <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                  Protocol Overview & Methodology
                </h2>
                <div className="mt-3 text-sm leading-relaxed text-[#232f26] dark:text-[#f4f4f5] whitespace-pre-line">
                  {formattedOverview}
                </div>
              </div>
            )}

            {/* Included Habits List */}
            <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#e5e1d7] dark:border-[#27272a] pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                  Included Habits ({protocol.habits.length})
                </h2>
                <span className="text-xs text-[#737970] dark:text-[#a1a1aa]">
                  ~{protocol.estimatedDailyMinutes} mins daily commitment
                </span>
              </div>

              <ul className="space-y-4">
                {protocol.habits.map((habit, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col gap-2 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a] p-4 transition-all hover:border-[#232f26]/30 dark:hover:border-[#3f3f46]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-[#232f26] dark:text-[#f4f4f5]">
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

                      <div className="flex items-center gap-2 text-xs text-[#737970] dark:text-[#a1a1aa]">
                        <span className="rounded-full bg-[#e5e1d7] dark:bg-[#18181b] px-2.5 py-0.5 text-[11px] font-medium text-[#232f26] dark:text-[#f4f4f5]">
                          {habit.suggestedLabel}
                        </span>
                        {habit.timeOfDay && habit.timeOfDay !== "Anytime" && (
                          <span className="font-medium text-[#737970] dark:text-[#a1a1aa]">{habit.timeOfDay}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#737970] dark:text-[#a1a1aa]">
                      <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                        {frequencyLabel(habit.frequency)}
                      </span>
                      {habit.target && (
                        <span>
                          Target: <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">{habit.target.goal} {habit.target.unit}</span>
                        </span>
                      )}
                      {habit.missAllowance ? (
                        <span>Allowed Misses: {habit.missAllowance}/wk</span>
                      ) : null}
                    </div>

                    {habit.description && (
                      <p className="mt-1 text-xs leading-relaxed text-[#737970] dark:text-[#a1a1aa]">
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
            <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                Adopt Protocol
              </h3>
              <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
                Instantly import these habit routines into your personal Growzok dashboard. You can customize targets before saving.
              </p>

              <AdoptSection protocol={protocol} />
            </div>

            {/* Author Profile */}
            <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                Protocol Author
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#232f26] dark:bg-[#27272a] font-display text-sm font-bold text-white dark:text-[#f4f4f5]">
                  {protocol.author.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                    {protocol.author.name}
                  </p>
                  <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">{protocol.author.role}</p>
                </div>
              </div>
            </div>

            {/* Tags Cloud */}
            {protocol.tags.length > 0 && (
              <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                  Protocol Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {protocol.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a] px-2.5 py-1 text-xs text-[#737970] dark:text-[#a1a1aa]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Protocols Recommendation Rail */}
            {(() => {
              const similar = getSimilarProtocols(protocol.key);
              if (similar.length === 0) return null;
              return (
                <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-4">
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                      Recommended Biological Synergies
                    </h2>
                    <p className="text-sm font-bold text-[#232f26] dark:text-[#f4f4f5] mt-0.5">
                      Similar Science-Backed Protocols You May Like
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {similar.map((p) => (
                      <Link
                        key={p.key}
                        href={`/protocols/${p.key}`}
                        className="group flex flex-col justify-between rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-4 dark:border-[#27272a] dark:bg-[#121215] hover:border-[#406852] transition-all"
                      >
                        <div>
                          <span className="rounded-full bg-[#406852]/10 px-2 py-0.5 text-[9px] font-bold text-[#406852] dark:text-[#a3b899]">
                            {p.category}
                          </span>
                          <h3 className="font-display font-bold text-sm text-[#232f26] dark:text-[#f4f4f5] mt-2 group-hover:text-[#406852] transition-colors">
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] line-clamp-2 mt-1">
                            {p.tagline}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-[#406852] dark:text-[#a3b899] mt-3 group-hover:underline">
                          View Protocol →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
