"use client";

import { useEffect, useState } from "react";
import { playFocusFinishChime } from "@/lib/soundChimes";

interface FastingProtocol {
  key: string;
  name: string;
  fastHours: number;
  eatHours: number;
  description: string;
}

const PROTOCOLS: FastingProtocol[] = [
  { key: "16-8", name: "16:8 Intermittent", fastHours: 16, eatHours: 8, description: "Standard circadian metabolic reset. Ideal daily baseline." },
  { key: "18-6", name: "18:6 Leangains", fastHours: 18, eatHours: 6, description: "Accelerated fat oxidation and early autophagy activation." },
  { key: "20-4", name: "20:4 Warrior Fast", fastHours: 20, eatHours: 4, description: "Extended autophagy and deep cellular repair window." },
  { key: "24-0", name: "24h Monk Fast", fastHours: 24, eatHours: 0, description: "Full 24-hour immune system and gut microbiome reset." },
];

export default function FastingClient() {
  const [selectedKey, setSelectedKey] = useState("16-8");
  const [isFasting, setIsFasting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const activeProtocol = PROTOCOLS.find((p) => p.key === selectedKey) || PROTOCOLS[0];
  const targetSeconds = activeProtocol.fastHours * 3600;

  useEffect(() => {
    let interval: any;
    if (isFasting) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFasting]);

  const toggleFast = () => {
    if (isFasting) {
      setIsFasting(false);
    } else {
      setIsFasting(true);
    }
  };

  const resetFast = () => {
    setIsFasting(false);
    setElapsedSeconds(0);
  };

  const formatHMS = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const hoursElapsed = elapsedSeconds / 3600;
  const progressPct = Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100));

  // Determine biological stage
  let stageName = "Digestion & Anabolic Phase";
  let stageDesc = "Insulin levels elevated; body utilizing ingested nutrients.";
  if (hoursElapsed >= 12 && hoursElapsed < 16) {
    stageName = "Glycogen Depletion & Fat Oxidation";
    stageDesc = "Liver glycogen stores depleting. Body shifting into lipolysis (fat burning).";
  } else if (hoursElapsed >= 16 && hoursElapsed < 18) {
    stageName = "Ketosis & Early Autophagy";
    stageDesc = "Blood ketone bodies rising. Cellular recycling mechanism (autophagy) initiates.";
  } else if (hoursElapsed >= 18) {
    stageName = "Deep Autophagy & HGH Peak";
    stageDesc = "Cellular debris clearance at peak rate. Human Growth Hormone production elevated.";
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div>
        <span className="rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
          Metabolic Architecture
        </span>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
          Intermittent Fasting & Autophagy Clock
        </h1>
        <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
          Track fasting duration and monitor real-time cellular autophagy stages with zero paid API dependencies.
        </p>
      </div>

      {/* Protocol Selection Tabs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PROTOCOLS.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setSelectedKey(p.key);
              resetFast();
            }}
            className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
              selectedKey === p.key
                ? "border-[#406852] bg-[#406852]/10 text-[#406852] dark:text-[#a3b899] font-bold"
                : "border-[#e5e1d7] bg-white text-[#737970] dark:border-[#27272a] dark:bg-[#18181b]"
            }`}
          >
            <div className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">{p.name}</div>
            <div className="text-[11px] text-[#737970] mt-0.5">{p.fastHours}h Fast / {p.eatHours}h Eat</div>
          </button>
        ))}
      </div>

      {/* Central Interactive Fasting Timer Display */}
      <div className="rounded-3xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-8 shadow-sm text-center space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            {isFasting ? "⚡ Fasting Session Active" : "⏸️ Fasting Paused"}
          </span>
          <div className="font-mono text-4xl sm:text-6xl font-bold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
            {formatHMS(elapsedSeconds)}
          </div>
          <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
            Target Goal: {activeProtocol.fastHours} Hours ({progressPct}% Completed)
          </p>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#e5e1d7] dark:bg-[#27272a] max-w-md mx-auto">
          <div
            className="h-full bg-[#406852] dark:bg-[#a3b899] transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex justify-center gap-3">
          <button
            onClick={toggleFast}
            className={`rounded-xl px-8 py-3 text-xs font-bold text-white transition-all ${
              isFasting ? "bg-[#be5a38] hover:bg-[#a0482b]" : "bg-[#406852] hover:bg-[#232f26]"
            }`}
          >
            {isFasting ? "Pause Fast" : "Start Fasting Session →"}
          </button>
          <button
            onClick={resetFast}
            className="rounded-xl border border-[#e5e1d7] bg-white px-5 py-3 text-xs font-semibold text-[#232f26] dark:border-[#27272a] dark:bg-[#27272a] dark:text-[#f4f4f5]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Real-Time Biological Stage Indicator */}
      <div className="rounded-2xl border border-[#406852]/30 bg-[#e3ede6]/40 dark:border-[#406852]/40 dark:bg-[#121215] p-5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔬</span>
          <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">
            Current Biological Stage: {stageName}
          </h3>
        </div>
        <p className="text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
          {stageDesc}
        </p>
      </div>
    </div>
  );
}
