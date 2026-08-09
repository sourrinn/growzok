"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Protocol, ProtocolHabit } from "@/types/protocol";
import { STANDARD_PROTOCOLS } from "@/lib/protocols";
import ProtocolAdoptModal from "@/components/ProtocolAdoptModal";

import { Spinner } from "@/components/Spinner";

interface Props {
  onAdopt: (items: ProtocolHabit[]) => Promise<void>;
}

type GoalFilter = "All" | "Morning & Sleep" | "Focus & Career" | "Fitness & Recovery" | "Financial";

const DOMAIN_COLORS: Record<string, string> = {
  Sleep: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Hydration: "bg-sky-50 text-sky-700 border-sky-100",
  Nutrition: "bg-lime-50 text-lime-700 border-lime-100",
  Cardio: "bg-red-50 text-red-700 border-red-100",
  Strength: "bg-orange-50 text-orange-700 border-orange-100",
  Mobility: "bg-teal-50 text-teal-700 border-teal-100",
  Breathing: "bg-cyan-50 text-cyan-700 border-cyan-100",
  Grooming: "bg-rose-50 text-rose-700 border-rose-100",
  Preventive: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Recovery: "bg-purple-50 text-purple-700 border-purple-100",
  Productivity: "bg-blue-50 text-blue-700 border-blue-100",
  Finance: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Social: "bg-pink-50 text-pink-700 border-pink-100",
  Learning: "bg-violet-50 text-violet-700 border-violet-100",
  "Digital Minimalism": "bg-slate-100 text-slate-700 border-slate-200",
  "Gut Health": "bg-green-50 text-green-700 border-green-100",
};

function domainColor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? "bg-mist text-charcoal border-mist";
}

import ConfirmActionModal, { type ConfirmAdoptData } from "@/components/ConfirmActionModal";

export default function ProtocolStarterGrid({ onAdopt }: Props) {
  const [goalFilter, setGoalFilter] = useState<GoalFilter>("All");
  const [previewProtocol, setPreviewProtocol] = useState<Protocol | null>(null);
  const [adoptingKey, setAdoptingKey] = useState<string | null>(null);
  const [pendingProtocol, setPendingProtocol] = useState<{
    protocol: Protocol;
    summary: ConfirmAdoptData;
  } | null>(null);

  const filteredProtocols = useMemo(() => {
    if (goalFilter === "All") return STANDARD_PROTOCOLS;
    return STANDARD_PROTOCOLS.filter((p) => {
      if (goalFilter === "Morning & Sleep")
        return p.category === "Morning Routine" || p.category === "Evening Wind-Down";
      if (goalFilter === "Focus & Career")
        return p.category === "Productivity & Focus" || p.category === "Developer & Career";
      if (goalFilter === "Fitness & Recovery")
        return p.category === "Fitness & Movement";
      if (goalFilter === "Financial")
        return p.category === "Financial Hygiene";
      return true;
    });
  }, [goalFilter]);

  const handleQuickAdoptClick = (protocol: Protocol) => {
    setPendingProtocol({
      protocol,
      summary: {
        title: protocol.name,
        category: protocol.category,
        habitCount: protocol.habits.length,
        habitsPreview: protocol.habits.map((h) => h.name),
      },
    });
  };

  const handleConfirmAdopt = async (_reason: string) => {
    if (!pendingProtocol) return;
    const { protocol } = pendingProtocol;
    setAdoptingKey(protocol.key);
    try {
      await onAdopt(protocol.habits);
    } finally {
      setAdoptingKey(null);
      setPendingProtocol(null);
    }
  };

  return (
    <div className="mb-10 rounded-2xl border border-[#e5e1d7] bg-gradient-to-b from-[#fbf9f5] to-white dark:border-[#27272a] dark:from-[#18181b] dark:to-[#09090b] p-5 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
            ✨ Choose a preset protocol
          </h2>
          <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
            Tap a protocol to adopt it instantly, or preview to customize habits.
          </p>
        </div>

        <Link
          href="/protocols"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#232f26] dark:text-[#f4f4f5] transition-colors hover:underline"
        >
          Explore Protocol Hub →
        </Link>
      </div>

      {/* Goal Filter Tabs */}
      <div className="mb-5 flex flex-wrap gap-1.5 border-b border-[#e5e1d7]/60 dark:border-[#27272a] pb-3">
        {(
          [
            "All",
            "Morning & Sleep",
            "Focus & Career",
            "Fitness & Recovery",
            "Financial",
          ] as GoalFilter[]
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setGoalFilter(tab)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              goalFilter === tab
                ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46] shadow-sm font-semibold"
                : "border border-[#e5e1d7] bg-white text-[#737970] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#a1a1aa] hover:border-[#232f26]/30 dark:hover:border-[#3f3f46] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Protocol Grid */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        {filteredProtocols.map((protocol) => {
          const isAdopting = adoptingKey === protocol.key;

          return (
            <div
              key={protocol.key}
              className="group flex h-full flex-col rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-4 shadow-sm transition-all hover:border-[#232f26]/30 dark:hover:border-[#3f3f46] hover:shadow-md"
            >
              <div className="flex-1">
                {/* Meta row */}
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#e5e1d7]/60 dark:bg-[#27272a] px-2.5 py-0.5 text-[11px] font-medium text-[#232f26] dark:text-[#f4f4f5]">
                    {protocol.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#737970] dark:text-[#a1a1aa]">
                    <span className="tabular-nums">★ {protocol.rating.toFixed(1)}</span>
                    <span>·</span>
                    <span>~{protocol.estimatedDailyMinutes}m/day</span>
                  </div>
                </div>

                {/* Title & description */}
                <h3 className="text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                  {protocol.name}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[#737970] dark:text-[#a1a1aa]">
                  {protocol.tagline}
                </p>

                {/* Habit preview pills */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {protocol.habits.slice(0, 3).map((h, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${domainColor(
                        h.domain
                      )}`}
                    >
                      <span>{h.name}</span>
                    </span>
                  ))}
                  {protocol.habits.length > 3 && (
                    <span className="rounded-md border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a] px-1.5 py-0.5 text-[10px] text-[#737970] dark:text-[#a1a1aa]">
                      +{protocol.habits.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex items-center gap-2 border-t border-[#e5e1d7]/50 dark:border-[#27272a] pt-3">
                <button
                  onClick={() => handleQuickAdoptClick(protocol)}
                  disabled={isAdopting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#232f26] py-1.5 text-xs font-medium text-white dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46] transition-all hover:bg-black dark:hover:bg-[#3f3f46] active:scale-[0.98] disabled:opacity-50"
                >
                  {isAdopting ? (
                    <>
                      <Spinner className="h-3.5 w-3.5 text-white dark:text-[#f4f4f5]" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    "+ One-Tap Add"
                  )}
                </button>
                <button
                  onClick={() => setPreviewProtocol(protocol)}
                  className="rounded-lg border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] px-3 py-1.5 text-xs font-medium text-[#737970] dark:text-[#a1a1aa] transition-colors hover:border-[#232f26]/40 hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
                >
                  Preview
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Marketplace Link Card */}
      <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-mist/80 bg-white/60 px-4 py-3 text-xs">
        <span className="text-muted">
          Looking for science-backed protocols or specialized developer routines?
        </span>
        <Link
          href="/protocols"
          className="shrink-0 font-medium text-charcoal underline-offset-2 hover:underline"
        >
          Browse Protocol Hub →
        </Link>
      </div>

      {/* Modal when user clicks 'Preview' */}
      {previewProtocol && (
        <ProtocolAdoptModal
          protocol={previewProtocol}
          onClose={() => setPreviewProtocol(null)}
        />
      )}

      {/* Confirmation Modal when user clicks 'One-Tap Add' */}
      {pendingProtocol && (
        <ConfirmActionModal
          type="adopt"
          adoptData={pendingProtocol.summary}
          onConfirm={handleConfirmAdopt}
          onClose={() => setPendingProtocol(null)}
        />
      )}
    </div>
  );
}

export { ProtocolStarterGrid as TemplateStarterGrid };
