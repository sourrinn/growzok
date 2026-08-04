import Link from "next/link";
import type { HabitTemplate } from "@/types/template";

interface Props {
  template: HabitTemplate;
}

/** Domain badge colour palette — cycles through subtle accent tones. */
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

export default function TemplateCard({ template }: Props) {
  const uniqueDomains = Array.from(
    new Set(template.habits.map((h) => h.domain))
  ).slice(0, 3);

  return (
    <Link
      href={`/templates/${template.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-mist bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Category + rating */}
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-medium text-charcoal">
          {template.category}
        </span>
        <div className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted">
          <span className="text-amber-400">★</span>
          <span className="font-medium text-charcoal">{template.rating.toFixed(1)}</span>
          <span>({template.reviewsCount.toLocaleString()})</span>
        </div>
      </div>

      {/* Name & tagline */}
      <div>
        <h3 className="text-base font-semibold text-charcoal group-hover:underline group-hover:underline-offset-2">
          {template.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{template.tagline}</p>
      </div>

      {/* Domain badges */}
      <div className="flex flex-wrap gap-1.5">
        {uniqueDomains.map((d) => (
          <span
            key={d}
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${domainColor(d)}`}
          >
            {d}
          </span>
        ))}
        {template.habits.length > 3 && (
          <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] text-muted">
            +{template.habits.length - 3} more
          </span>
        )}
      </div>

      {/* Footer stats */}
      <div className="mt-auto flex items-center gap-4 border-t border-mist pt-3 text-xs text-muted">
        <span>
          <span className="font-medium text-charcoal">
            {template.activeUsersCount.toLocaleString()}
          </span>{" "}
          active
        </span>
        <span>
          <span className="font-medium text-charcoal">{template.completionRatePct}%</span>{" "}
          completion
        </span>
        <span className="ml-auto">{template.estimatedDailyMinutes} min/day</span>
      </div>
    </Link>
  );
}
