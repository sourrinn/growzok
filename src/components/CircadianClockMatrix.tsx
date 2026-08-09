"use client";

import { useState } from "react";

interface EnergyBlock {
  time: string;
  phase: string;
  icon: string;
  domain: string;
  guidance: string;
  energyLevel: string;
  colorClass: string;
}

const CIRCADIAN_BLOCKS: EnergyBlock[] = [
  {
    time: "06:00 – 08:30",
    phase: "Cortisol Awakening & Photonic Cue",
    icon: "🌅",
    domain: "Sleep Hygiene & Hydration",
    guidance: "View 10-15 minutes of outdoor morning sunlight within 30 minutes of waking. Hydrate with 500ml water and electrolytes.",
    energyLevel: "Rising Alertness",
    colorClass: "bg-[#b38340]",
  },
  {
    time: "09:00 – 12:30",
    phase: "Peak Cognitive Output Window",
    icon: "☀️",
    domain: "Deep Work & Productivity",
    guidance: "Execute highest friction cognitive tasks during peak morning alertness. Utilize 90-minute focus blocks with ambient noise.",
    energyLevel: "100% Peak Alertness",
    colorClass: "bg-[#406852]",
  },
  {
    time: "13:30 – 16:00",
    phase: "Postprandial Recovery & Mobility",
    icon: "🚶",
    domain: "Cardiovascular & Mobility",
    guidance: "Engage in a 10-15 minute post-meal walk to stabilize blood glucose and mitigate afternoon alertness dips.",
    energyLevel: "Active Recovery",
    colorClass: "bg-[#b86b53]",
  },
  {
    time: "17:00 – 19:30",
    phase: "Neuromuscular Strength Window",
    icon: "🏋️",
    domain: "Strength & Physical Health",
    guidance: "Optimal window for high-intensity physical training when body temperature and muscle torque reach daily peak.",
    energyLevel: "Physical Power Peak",
    colorClass: "bg-[#6b8259]",
  },
  {
    time: "20:00 – 22:30",
    phase: "Melatonin Offset & Wind-Down",
    icon: "🌙",
    domain: "Recovery & Digital Minimalism",
    guidance: "Dim overhead lighting, eliminate high-intensity screen exposure, and initiate wind-down breathing routines.",
    energyLevel: "Melatonin Pulse",
    colorClass: "bg-[#3a5a6b]",
  },
];

export default function CircadianClockMatrix() {
  const [activeIdx, setActiveIdx] = useState<number>(1);
  const activeBlock = CIRCADIAN_BLOCKS[activeIdx];

  return (
    <div className="rounded-3xl border border-[#e5e1d7] bg-white p-6 sm:p-8 shadow-sm dark:border-[#27272a] dark:bg-[#18181b] space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex mb-2 rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#406852] dark:text-[#a3b899]">
            Biological Rhythm Architecture
          </span>
          <h2 className="font-display text-xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
            24-Hour Circadian Energy Timeline
          </h2>
          <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
            Synchronize routine execution to human biological alertness peaks and melatonin offset windows.
          </p>
        </div>
      </div>

      {/* Sleek 24-Hour Horizontal Circadian Energy Bar */}
      <div className="relative space-y-2">
        <div className="h-3.5 w-full overflow-hidden rounded-full bg-[#e5e1d7] dark:bg-[#27272a] p-0.5">
          <div
            className="h-full w-full rounded-full bg-gradient-to-r from-[#b38340] via-[#406852] via-[#b86b53] via-[#6b8259] to-[#3a5a6b] transition-all"
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono font-bold text-[#737970] dark:text-[#a1a1aa] px-1">
          <span>🌅 06:00</span>
          <span className="hidden sm:inline">☀️ 12:00 Noon</span>
          <span className="hidden sm:inline">🌆 18:00 Dusk</span>
          <span>🌙 23:00</span>
        </div>
      </div>

      {/* 5 Interactive Phase Segment Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CIRCADIAN_BLOCKS.map((b, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all space-y-2 ${
                isSelected
                  ? "border-[#406852] bg-[#406852]/10 dark:border-[#a3b899] dark:bg-[#406852]/20 shadow-xs"
                  : "border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] hover:border-[#406852]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{b.icon}</span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    isSelected ? "bg-[#406852] dark:bg-[#a3b899] animate-pulse" : "bg-[#e5e1d7] dark:bg-[#27272a]"
                  }`}
                />
              </div>

              <div>
                <div className="font-mono text-[10px] font-bold text-[#737970] dark:text-[#a1a1aa]">
                  {b.time}
                </div>
                <div className="font-bold text-xs text-[#232f26] dark:text-[#f4f4f5] line-clamp-1 mt-0.5">
                  {b.phase}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Guidance Spotlight Card */}
      <div className="rounded-2xl border border-[#406852]/30 bg-[#e3ede6]/40 dark:border-[#406852]/40 dark:bg-[#121215] p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeBlock.icon}</span>
            <div>
              <span className="rounded bg-[#406852] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                {activeBlock.energyLevel}
              </span>
              <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5] mt-1">
                {activeBlock.phase}
              </h3>
            </div>
          </div>

          <span className="self-start sm:self-auto rounded-full border border-[#406852]/30 bg-white px-3 py-1 text-xs font-semibold text-[#406852] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#a3b899]">
            {activeBlock.domain}
          </span>
        </div>

        <p className="text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
          {activeBlock.guidance}
        </p>
      </div>
    </div>
  );
}
