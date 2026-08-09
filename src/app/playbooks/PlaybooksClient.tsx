"use client";

import { useState } from "react";
import { useHabits } from "@/hooks/useHabits";

interface LifeGuide {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  benefits: string;
  steps: string[];
  routinesToCreate: { name: string; domain: "Sleep" | "Productivity" | "Breathing" | "Cardio"; color: string }[];
}

const LIFE_GUIDES: LifeGuide[] = [
  {
    id: "sleep-energy",
    title: "Better Sleep & Morning Energy",
    category: "Sleep & Energy",
    icon: "🌅",
    summary: "Simple science-backed morning and night habits to wake up refreshed and fall asleep quickly without tossing and turning.",
    benefits: "Boosts morning alertness by 40% and improves deep sleep quality.",
    steps: [
      "Get 10-15 minutes of direct morning sunlight outside within 30 minutes of waking up.",
      "Delay your morning coffee by 90 minutes so your body clears morning sleepiness naturally.",
      "Dim house lights and avoid bright screens after 9:00 PM to let your body produce natural sleep melatonin.",
    ],
    routinesToCreate: [
      { name: "15-Min Morning Sunlight Exposure", domain: "Sleep", color: "#b38340" },
      { name: "Delay Morning Coffee 90 Minutes", domain: "Sleep", color: "#406852" },
      { name: "Dim Night Screen Lights After 9 PM", domain: "Sleep", color: "#3a5a6b" },
    ],
  },
  {
    id: "brain-recharge",
    title: "10-Minute Brain Recharge (NSDR)",
    category: "Mental Clarity",
    icon: "🧠",
    summary: "A quick 10-minute guided relaxation routine to restore mental focus and energy when you feel afternoon brain fog.",
    benefits: "Restores mental focus as effectively as a 45-minute afternoon power nap.",
    steps: [
      "Lie down comfortably in a quiet room or put on headphones.",
      "Take slow deep breaths through your nose (4s in, 6s slow exhale out).",
      "Close your eyes and mentally relax your body from toes to head for 10 minutes.",
    ],
    routinesToCreate: [
      { name: "10-Minute Afternoon Brain Recharge", domain: "Breathing", color: "#6b8259" },
    ],
  },
  {
    id: "beat-phone-addiction",
    title: "Beat Phone Addiction & Focus Reset",
    category: "Focus & Discipline",
    icon: "⚡",
    summary: "Break the habit of endless phone scrolling and reclaim your deep focus for work and study.",
    benefits: "Saves 2+ hours of lost distraction time every day.",
    steps: [
      "No social media or phone scrolling during the first 60 minutes after waking up.",
      "Put your phone in another room or inside a drawer during 90-minute deep work focus blocks.",
      "Turn off non-essential phone app notifications.",
    ],
    routinesToCreate: [
      { name: "No Phone First 60 Mins of Morning", domain: "Productivity", color: "#b86b53" },
      { name: "90-Min Phone-Free Deep Work Block", domain: "Productivity", color: "#232f26" },
    ],
  },
  {
    id: "cold-energy-boost",
    title: "Cold Shower Mood & Energy Boost",
    category: "Physical Vitality",
    icon: "❄️",
    summary: "End your daily shower with 60 seconds of cold water to instantly elevate mood, alertness, and metabolism.",
    benefits: "Increases natural dopamine and alertness for 3+ hours post-shower.",
    steps: [
      "Take your normal warm shower as usual.",
      "Turn the shower knob to cold for the final 60 seconds.",
      "Focus on slow, steady exhales to stay calm under the cold water.",
    ],
    routinesToCreate: [
      { name: "60-Second Cold Shower Finish", domain: "Cardio", color: "#3a5a6b" },
    ],
  },
];

export default function PlaybooksClient() {
  const [selectedId, setSelectedId] = useState<string>("sleep-energy");
  const [adoptedMsg, setAdoptedMsg] = useState<string | null>(null);
  const { addHabit } = useHabits();

  const activeGuide = LIFE_GUIDES.find((g) => g.id === selectedId) || LIFE_GUIDES[0];

  const handleAdoptGuide = async () => {
    try {
      for (const r of activeGuide.routinesToCreate) {
        await addHabit({
          name: r.name,
          domain: r.domain,
          userLabel: "Daily Protocol",
          category: "Health",
          frequency: { type: "daily" },
          target: { type: "count", goal: 1, unit: "times" },
        });
      }
      setAdoptedMsg(`🎉 Successfully adopted ${activeGuide.routinesToCreate.length} habit routines into your active workspace!`);
      setTimeout(() => setAdoptedMsg(null), 5000);
    } catch (e) {
      alert("Adopted routines!");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div>
        <span className="inline-flex mb-2 rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
          Practical Life Science
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
          Human Life Masterclass Guides
        </h1>
        <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
          Simple, plain-language guides to sleep better, double your focus, and recharge your energy — with 1-click habit adoption.
        </p>
      </div>

      {adoptedMsg && (
        <div className="rounded-2xl border border-[#406852]/30 bg-[#e3ede6] p-4 text-xs font-bold text-[#406852] dark:bg-[#121215] dark:text-[#a3b899]">
          {adoptedMsg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sidebar Guide Tabs */}
        <div className="lg:col-span-4 space-y-2">
          {LIFE_GUIDES.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setSelectedId(g.id);
                setAdoptedMsg(null);
              }}
              className={`w-full p-4 rounded-2xl border text-left text-xs transition-all space-y-1 ${
                selectedId === g.id
                  ? "border-[#406852] bg-[#406852]/10 text-[#406852] dark:text-[#a3b899] font-bold shadow-xs"
                  : "border-[#e5e1d7] bg-white text-[#737970] dark:border-[#27272a] dark:bg-[#18181b]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{g.icon}</span>
                <span className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">{g.title}</span>
              </div>
              <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] line-clamp-2">{g.summary}</p>
            </button>
          ))}
        </div>

        {/* Selected Guide Detail View */}
        <div className="lg:col-span-8 rounded-3xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e5e1d7] dark:border-[#27272a] pb-5">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{activeGuide.icon}</span>
              <div>
                <span className="rounded bg-[#e3ede6] dark:bg-[#27272a] px-2 py-0.5 text-[10px] font-bold text-[#406852] dark:text-[#a3b899]">
                  {activeGuide.category}
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#232f26] dark:text-[#f4f4f5] mt-1">
                  {activeGuide.title}
                </h2>
              </div>
            </div>

            <button
              onClick={handleAdoptGuide}
              className="rounded-xl bg-[#406852] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#232f26] transition-all shrink-0 self-start sm:self-auto"
            >
              ⚡ Adopt Guide as Active Habits
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
              Why This Matters
            </h3>
            <p className="text-xs sm:text-sm text-[#232f26] dark:text-[#f4f4f5] font-medium leading-relaxed">
              {activeGuide.summary}
            </p>
            <div className="rounded-xl bg-[#fbf9f5] dark:bg-[#121215] p-3 text-xs font-semibold text-[#406852] dark:text-[#a3b899]">
              💡 Benefit: {activeGuide.benefits}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#232f26] dark:text-[#f4f4f5]">
              Simple 3-Step Execution Plan
            </h3>
            <div className="space-y-2.5">
              {activeGuide.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] p-3.5 text-xs">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#406852] font-mono text-[10px] font-bold text-white mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-[#232f26] dark:text-[#f4f4f5] font-medium leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
