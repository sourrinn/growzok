import Link from "next/link";
import type { Protocol } from "@/types/protocol";

interface Props {
  protocol: Protocol;
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
  return DOMAIN_COLORS[domain] ?? "bg-[#e5e1d7] text-[#232f26]";
}

export default function ProtocolCard({ protocol }: Props) {
  const uniqueDomains = Array.from(
    new Set(protocol.habits.map((h) => h.domain))
  ).slice(0, 3);

  const previewHabits = protocol.habits.slice(0, 3);

  return (
    <Link
      href={`/protocols/${protocol.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm transition-all hover:border-[#232f26]/30 hover:shadow-md"
    >
      <div className="space-y-4">
        {/* Category Badge & Rating */}
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-[#e3ede6] px-3 py-1 text-xs font-semibold text-[#406852]">
            {protocol.category}
          </span>
          <div className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-[#737970]">
            {protocol.reviewsCount > 0 ? (
              <>
                <span className="font-semibold text-[#232f26]">
                  Rating {protocol.rating.toFixed(1)}
                </span>
                <span>({protocol.reviewsCount.toLocaleString()})</span>
              </>
            ) : (
              <span className="font-medium text-[#737970]">Standard Protocol</span>
            )}
          </div>
        </div>

        {/* Name & Tagline */}
        <div>
          <h3 className="text-lg font-semibold text-[#232f26] group-hover:underline group-hover:underline-offset-2">
            {protocol.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#737970]">
            {protocol.tagline}
          </p>
        </div>

        {/* Protocol Habits Preview List */}
        <div className="rounded-xl border border-[#e5e1d7]/70 bg-[#fbf9f5] p-3 text-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737970]">
            Includes {protocol.habits.length} Habits
          </p>
          <ul className="mt-1.5 space-y-1 text-[#232f26]">
            {previewHabits.map((h, i) => (
              <li key={i} className="flex items-center gap-1.5 truncate">
                <span className="text-[#406852] font-bold">•</span>
                <span className="truncate font-medium">{h.name}</span>
                {h.target && (
                  <span className="shrink-0 text-[10px] text-[#737970]">
                    ({h.target.goal} {h.target.unit})
                  </span>
                )}
              </li>
            ))}
            {protocol.habits.length > 3 && (
              <li className="pt-0.5 text-[10px] text-[#737970]">
                +{protocol.habits.length - 3} more habit{protocol.habits.length - 3 === 1 ? "" : "s"}
              </li>
            )}
          </ul>
        </div>

        {/* Domain Badges */}
        <div className="flex flex-wrap gap-1.5">
          {uniqueDomains.map((d) => (
            <span
              key={d}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${domainColor(d)}`}
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Metrics & Action CTA */}
      <div className="mt-5 border-t border-[#e5e1d7] pt-4">
        <div className="flex items-center justify-between text-xs text-[#737970]">
          <div>
            <span className="font-semibold text-[#232f26]">
              {protocol.activeUsersCount.toLocaleString()}
            </span>{" "}
            active · {protocol.estimatedDailyMinutes} min/day
          </div>
          <span className="font-semibold text-[#232f26] group-hover:translate-x-0.5 transition-transform">
            Adopt Protocol →
          </span>
        </div>
      </div>
    </Link>
  );
}

export { ProtocolCard as TemplateCard };
