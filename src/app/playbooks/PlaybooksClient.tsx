"use client";

import { useState } from "react";

interface Playbook {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  steps: string[];
}

const PLAYBOOKS: Playbook[] = [
  {
    id: "sleep-photonic",
    title: "Circadian Photonic Reset Protocol",
    category: "Sleep Hygiene",
    icon: "🌅",
    summary: "Leverage morning solar photons to anchor your master circadian pacemaker (Suprachiasmatic Nucleus).",
    steps: [
      "View 10-15 minutes of outdoor morning sunlight within 30 minutes of waking (no sunglasses).",
      "If overcast, extend exposure to 20-30 minutes.",
      "Avoid overhead bright artificial lighting after 9:00 PM to protect natural melatonin synthesis.",
    ],
  },
  {
    id: "nsdr",
    title: "Non-Sleep Deep Rest (NSDR) Recovery",
    category: "Cognitive Recovery",
    icon: "🧠",
    summary: "Restore striatal dopamine and reduce autonomic arousal in 10-20 minutes without sleeping.",
    steps: [
      "Lie down comfortably in a quiet, low-light environment.",
      "Inhale deeply through the nose (4s), hold (2s), exhale slowly through mouth (6s).",
      "Perform a mental body scan from feet to head, releasing physical tension on each exhale.",
    ],
  },
  {
    id: "dopamine-reset",
    title: "Dopamine Baseline Recalibration",
    category: "Neuro-Reset",
    icon: "⚡",
    summary: "Restore baseline dopamine sensitivity by eliminating cheap high-dopamine friction loops.",
    steps: [
      "Eliminate phone usage during the first 60 minutes after waking.",
      "Delay caffeine consumption by 90-120 minutes post-waking to allow adenosine clearance.",
      "Pair high-effort tasks with intrinsic progress tracking rather than external rewards.",
    ],
  },
];

export default function PlaybooksClient() {
  const [selectedId, setSelectedId] = useState<string>("sleep-photonic");
  const activePlaybook = PLAYBOOKS.find((p) => p.id === selectedId) || PLAYBOOKS[0];

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div>
        <span className="rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
          Neuroscience Masterclasses
        </span>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
          Bio-Optimization Playbooks
        </h1>
        <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
          Peer-reviewed protocols for circadian alignment, cognitive recovery, and dopamine baseline regulation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sidebar Playbook Tabs */}
        <div className="lg:col-span-4 space-y-2">
          {PLAYBOOKS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full p-4 rounded-2xl border text-left text-xs transition-all space-y-1 ${
                selectedId === p.id
                  ? "border-[#406852] bg-[#406852]/10 text-[#406852] dark:text-[#a3b899] font-bold shadow-sm"
                  : "border-[#e5e1d7] bg-white text-[#737970] dark:border-[#27272a] dark:bg-[#18181b]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{p.icon}</span>
                <span className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">{p.title}</span>
              </div>
              <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] line-clamp-2">{p.summary}</p>
            </button>
          ))}
        </div>

        {/* Selected Playbook Reader */}
        <div className="lg:col-span-8 rounded-3xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#e5e1d7] dark:border-[#27272a] pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activePlaybook.icon}</span>
              <div>
                <span className="rounded bg-[#e3ede6] dark:bg-[#27272a] px-2 py-0.5 text-[10px] font-bold text-[#406852] dark:text-[#a3b899]">
                  {activePlaybook.category}
                </span>
                <h2 className="font-display text-xl font-bold text-[#232f26] dark:text-[#f4f4f5] mt-1">
                  {activePlaybook.title}
                </h2>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
            {activePlaybook.summary}
          </p>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#232f26] dark:text-[#f4f4f5]">
              Protocol Execution Steps
            </h3>
            <div className="space-y-2">
              {activePlaybook.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] p-3 text-xs">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#406852] font-mono text-[10px] font-bold text-white">
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
