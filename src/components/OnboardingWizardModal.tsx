"use client";

import { useState } from "react";
import type { HabitDomain } from "@/types/habit";

interface Props {
  onComplete: (selectedHabits: { name: string; domain: HabitDomain; category: string }[]) => void;
  onClose: () => void;
}

const STARTER_PRESETS: Record<
  string,
  { name: string; domain: HabitDomain; category: string; icon: string; desc: string }[]
> = {
  Circadian: [
    { name: "Morning Sunlight Exposure", domain: "Sleep", category: "Health", icon: "☀️", desc: "10-15m viewing natural sunlight within 1 hr of waking" },
    { name: "Hydrate (500ml Water + Minerals)", domain: "Hydration", category: "Health", icon: "💧", desc: "Rehydrate immediately upon waking" },
    { name: "Delayed Coffee (90m post-wake)", domain: "Sleep", category: "Health", icon: "☕", desc: "Prevent mid-afternoon energy crashes" },
  ],
  Physical: [
    { name: "Zone 2 Cardio / Fast Walk", domain: "Cardio", category: "Fitness", icon: "🏃", desc: "25m steady aerobic cardiovascular base" },
    { name: "Daily Joint Mobility Flow", domain: "Mobility", category: "Fitness", icon: "🧘", desc: "10m morning spinal decompression & hip opener" },
    { name: "High-Protein Breakfast", domain: "Nutrition", category: "Health", icon: "🍳", desc: "30g+ protein within 2 hours of waking" },
  ],
  Focus: [
    { name: "Deep Work (90m Block)", domain: "Productivity", category: "Productivity", icon: "🧠", desc: "Single-task focus before checking communications" },
    { name: "Box Breathing Reset", domain: "Breathing", category: "Health", icon: "🫁", desc: "4x4 cadence box breathing to lower stress" },
    { name: "No Phone First 30 Mins", domain: "Digital Minimalism", category: "Personal", icon: "📱", desc: "Protect morning attention bandwidth" },
  ],
};

export default function OnboardingWizardModal({ onComplete, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [chosenPath, setChosenPath] = useState<string>("Circadian");

  const presets = STARTER_PRESETS[chosenPath] ?? STARTER_PRESETS.Circadian;

  const handleFinish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("growzok-onboarded", "true");
    }
    onComplete(presets);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-2xl dark:border-[#27272a] dark:bg-[#18181b] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e1d7] pb-4 dark:border-[#27272a]">
          <div>
            <span className="rounded-full bg-[#406852]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
              Step {step} of 2
            </span>
            <h2 className="font-display text-xl font-bold text-[#232f26] dark:text-[#f4f4f5] mt-1">
              {step === 1 ? "Choose Your Primary Focus" : "Review Recommended Starter Routine"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-white"
          >
            Skip Setup ✕
          </button>
        </div>

        {/* Step 1: Select Focus Track */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
              Select the primary biological protocol track you wish to establish first:
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { key: "Circadian", title: "🌅 Circadian & Sleep", icon: "🌙", desc: "Energy, alertness & sleep quality" },
                { key: "Physical", title: "⚡ Energy & Vitality", icon: "💪", desc: "Cardio, mobility & nutrition" },
                { key: "Focus", title: "🧠 Deep Focus & Calm", icon: "🎯", desc: "Cognitive output & digital detox" },
              ].map((track) => (
                <button
                  key={track.key}
                  onClick={() => setChosenPath(track.key)}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                    chosenPath === track.key
                      ? "border-[#406852] bg-[#406852]/10 text-[#406852] dark:border-[#a3b899] dark:text-[#a3b899]"
                      : "border-[#e5e1d7] hover:border-[#406852]/40 text-[#232f26] dark:border-[#27272a] dark:text-[#f4f4f5]"
                  }`}
                >
                  <span className="text-2xl mb-2">{track.icon}</span>
                  <span className="font-bold text-xs">{track.title}</span>
                  <span className="text-[10px] text-[#737970] dark:text-[#a1a1aa] mt-1">{track.desc}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full rounded-xl bg-[#232f26] py-2.5 text-xs font-semibold text-white hover:bg-[#406852] dark:bg-[#f4f4f5] dark:text-[#18181b] dark:hover:bg-white transition-all shadow-sm"
            >
              Continue to Recommended Habits →
            </button>
          </div>
        )}

        {/* Step 2: Confirm Starter Habits */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
              We will initialize your personal dashboard with these 3 science-backed habits:
            </p>
            <div className="space-y-2.5">
              {presets.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 text-xs dark:border-[#27272a] dark:bg-[#121215]"
                >
                  <span className="text-xl">{p.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-[#232f26] dark:text-[#f4f4f5]">{p.name}</p>
                    <p className="text-[10px] text-[#737970] dark:text-[#a1a1aa]">{p.desc}</p>
                  </div>
                  <span className="rounded-full bg-[#406852]/10 px-2 py-0.5 text-[10px] font-semibold text-[#406852] dark:text-[#a3b899]">
                    {p.domain}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="rounded-xl border border-[#e5e1d7] px-4 py-2.5 text-xs font-semibold text-[#737970] hover:text-[#232f26] dark:border-[#27272a] dark:text-[#a1a1aa]"
              >
                ← Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 rounded-xl bg-[#232f26] py-2.5 text-xs font-semibold text-white hover:bg-[#406852] dark:bg-[#f4f4f5] dark:text-[#18181b] dark:hover:bg-white transition-all shadow-sm"
              >
                🚀 Initialize Dashboard & Plant Habits
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
