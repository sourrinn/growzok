"use client";

import { useState } from "react";

interface EnergyBlock {
  time: string;
  phase: string;
  icon: string;
  domain: string;
  guidance: string;
  x: number;
  y: number;
}

const CIRCADIAN_BLOCKS: EnergyBlock[] = [
  {
    time: "06:00 – 08:30",
    phase: "Cortisol Awakening & Photonic Cue",
    icon: "🌅",
    domain: "Sleep Hygiene & Hydration",
    guidance: "View 10-15 minutes of outdoor morning sunlight within 30 minutes of waking. Hydrate with 500ml water and electrolytes.",
    x: 40,
    y: 45,
  },
  {
    time: "09:00 – 12:30",
    phase: "Peak Cognitive Output Window",
    icon: "☀️",
    domain: "Deep Work & Productivity",
    guidance: "Execute highest friction cognitive tasks during peak morning alertness. Utilize 90-minute focus blocks with ambient noise.",
    x: 120,
    y: 20,
  },
  {
    time: "13:30 – 16:00",
    phase: "Postprandial Recovery & Mobility",
    icon: "🚶",
    domain: "Cardiovascular & Mobility",
    guidance: "Engage in a 10-15 minute post-meal walk to stabilize blood glucose and mitigate afternoon alertness dips.",
    x: 200,
    y: 50,
  },
  {
    time: "17:00 – 19:30",
    phase: "Neuromuscular Strength Window",
    icon: "🏋️",
    domain: "Strength & Physical Health",
    guidance: "Optimal window for high-intensity physical training when body temperature and muscle torque reach daily peak.",
    x: 280,
    y: 35,
  },
  {
    time: "20:00 – 22:30",
    phase: "Melatonin Offset & Wind-Down",
    icon: "🌙",
    domain: "Recovery & Digital Minimalism",
    guidance: "Dim overhead lighting, eliminate high-intensity screen exposure, and initiate wind-down breathing routines.",
    x: 360,
    y: 60,
  },
];

export default function CircadianClockMatrix() {
  const [activeIdx, setActiveIdx] = useState<number>(1);
  const activeBlock = CIRCADIAN_BLOCKS[activeIdx];

  return (
    <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex mb-2 rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#406852] dark:text-[#a3b899]">
            Biological Rhythm Architecture
          </span>
          <h2 className="font-display text-lg font-semibold text-[#232f26] dark:text-[#f4f4f5]">
            24-Hour Circadian Execution Clock
          </h2>
          <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
            Map routine execution to human physiological energy peaks and melatonin offset windows.
          </p>
        </div>
      </div>

      {/* SVG Circadian Sine Curve */}
      <div className="relative h-28 w-full overflow-hidden rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] p-2">
        <svg viewBox="0 0 400 80" className="h-full w-full overflow-visible">
          {/* Continuous Cubic Bézier Path passing precisely through all (x, y) coordinates */}
          <path
            d="M 20 52 C 70 20, 90 20, 120 20 C 160 20, 175 50, 200 50 C 235 50, 255 35, 280 35 C 315 35, 335 60, 360 60 C 380 60, 390 62, 395 62"
            fill="none"
            stroke="#406852"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Timeline Points Snapped Exactly on Path */}
          {CIRCADIAN_BLOCKS.map((b, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <g key={idx} onClick={() => setActiveIdx(idx)} className="cursor-pointer">
                {/* Node Circle */}
                <circle
                  cx={b.x}
                  cy={b.y}
                  r={isSelected ? "8" : "5"}
                  className={`transition-all duration-200 ${
                    isSelected
                      ? "fill-[#232f26] dark:fill-white stroke-[#406852] stroke-2"
                      : "fill-[#406852] hover:r-7"
                  }`}
                />
                {/* Floating Emoji Label above node */}
                <text
                  x={b.x}
                  y={b.y - 12}
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-[#232f26] dark:fill-[#f4f4f5]"
                >
                  {b.icon}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Time Window Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CIRCADIAN_BLOCKS.map((b, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
              idx === activeIdx
                ? "bg-[#232f26] text-white dark:bg-[#3f3f46] dark:text-[#f4f4f5] shadow-xs"
                : "border border-[#e5e1d7] bg-white text-[#737970] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#a1a1aa] hover:text-[#232f26]"
            }`}
          >
            {b.icon} {b.time}
          </button>
        ))}
      </div>

      {/* Active Phase Guidance Spotlight Card */}
      <div className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[#232f26] dark:text-[#f4f4f5]">
            {activeBlock.icon} {activeBlock.phase}
          </span>
          <span className="rounded bg-[#e3ede6] dark:bg-[#27272a] px-2 py-0.5 text-[10px] font-bold text-[#406852] dark:text-[#a3b899]">
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
