"use client";

import { useState } from "react";

export default function BeforeAfterSimulator() {
  const [mode, setMode] = useState<"before" | "after">("after");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <span className="inline-block rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#406852] mb-1">
          System Comparison Engine
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#232f26]">
          Why Generic To-Do Apps Fail — And How Growzok Succeeds
        </h2>
        <p className="text-xs sm:text-sm text-[#737970] max-w-xl mx-auto leading-relaxed">
          Toggle between traditional task managers and Growzok's biological architecture.
        </p>

        {/* Interactive Toggle Switch */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex rounded-2xl border border-[#e5e1d7] bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setMode("before")}
              className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
                mode === "before"
                  ? "bg-[#be5a38] text-white shadow-sm"
                  : "text-[#737970] hover:text-[#232f26]"
              }`}
            >
              ❌ Traditional Task Apps
            </button>
            <button
              onClick={() => setMode("after")}
              className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
                mode === "after"
                  ? "bg-[#406852] text-white shadow-sm"
                  : "text-[#737970] hover:text-[#232f26]"
              }`}
            >
              🌱 The Growzok System
            </button>
          </div>
        </div>
      </div>

      {/* Comparison View Card */}
      {mode === "before" ? (
        <div className="rounded-2xl border border-[#be5a38]/30 bg-[#be5a38]/5 p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <h3 className="font-bold text-base text-[#be5a38]">
              The Broken Cycle of Generic Productivity Tools
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs text-[#737970]">
            <div className="rounded-xl border border-[#be5a38]/20 bg-white p-3.5 space-y-1">
              <strong className="text-[#be5a38] font-bold">1. Punitive Streak Resets</strong>
              <p>Miss 1 day due to travel or sickness, and your entire 90-day streak resets to zero, destroying intrinsic motivation.</p>
            </div>

            <div className="rounded-xl border border-[#be5a38]/20 bg-white p-3.5 space-y-1">
              <strong className="text-[#be5a38] font-bold">2. Constant Phone Distraction</strong>
              <p>Push notification spam pulls your attention back to your smartphone, triggering social media doomscrolling.</p>
            </div>

            <div className="rounded-xl border border-[#be5a38]/20 bg-white p-3.5 space-y-1">
              <strong className="text-[#be5a38] font-bold">3. Zero Biological Context</strong>
              <p>Treats "Drink 2L Water" the same as "File Taxes"—ignoring circadian rhythms, energy cycles, and friction.</p>
            </div>

            <div className="rounded-xl border border-[#be5a38]/20 bg-white p-3.5 space-y-1">
              <strong className="text-[#be5a38] font-bold">4. Proprietary Data Lock-In</strong>
              <p>Your history is trapped inside a paid walled garden. No open calendar feeds or raw dataset exports.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#406852]/30 bg-[#e3ede6]/50 p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h3 className="font-bold text-base text-[#406852]">
              The Growzok Biological Architecture
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs text-[#232f26]">
            <div className="rounded-xl border border-[#406852]/20 bg-white p-3.5 space-y-1 shadow-xs">
              <strong className="text-[#406852] font-bold">1. Monthly Streak Protection</strong>
              <p className="text-[#737970]">Automatic grace passes protect long-term routine momentum during legitimate life disruptions.</p>
            </div>

            <div className="rounded-xl border border-[#406852]/20 bg-white p-3.5 space-y-1 shadow-xs">
              <strong className="text-[#406852] font-bold">2. Full-Screen Focus Mode</strong>
              <p className="text-[#737970]">GPU-accelerated ambient focus soundscapes (white noise, rain, forest) block out digital clutter.</p>
            </div>

            <div className="rounded-xl border border-[#406852]/20 bg-white p-3.5 space-y-1 shadow-xs">
              <strong className="text-[#406852] font-bold">3. 16 Biological Domains</strong>
              <p className="text-[#737970]">Routines categorized by circadian science, hydration needs, and cognitive load states.</p>
            </div>

            <div className="rounded-xl border border-[#406852]/20 bg-white p-3.5 space-y-1 shadow-xs">
              <strong className="text-[#406852] font-bold">4. Absolute Data Sovereignty</strong>
              <p className="text-[#737970]">Open iCal calendar subscription feeds, 1-click JSON backups, and raw CSV dataset exports.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
