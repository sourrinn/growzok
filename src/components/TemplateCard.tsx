import Link from "next/link";
import type { HabitTemplate } from "@/types/template";

interface Props {
  template: HabitTemplate;
}

/** Domain badge colour palette — organic nature-inspired hues. */
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
        <span className="rounded-full bg-mist/70 px-2.5 py-0.5 text-xs font-medium text-charcoal">
          {template.category}
        </span>
        <div className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted">
          <span className="font-semibold text-charcoal">Rating {template.rating.toFixed(1)}</span>
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
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${domainColor(d)}`}
          >
            {d}
          </span>
        ))}
        {template.habits.length > 3 && (
          <span className="rounded-full bg-mist/60 px-2 py-0.5 text-[11px] text-muted">
            +{template.habits.length - 3} more
          </span>
        )}
      </div>

      {/* Footer stats */}
      <div className="mt-auto flex items-center gap-4 border-t border-mist/60 pt-3 text-xs text-muted">
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
