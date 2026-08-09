"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FastingClient from "../fasting/FastingClient";
import VitalsClient from "../vitals/VitalsClient";
import BreathworkClient from "../breathwork/BreathworkClient";
import CircadianClient from "../circadian/CircadianClient";
import RecoveryClient from "../recovery/RecoveryClient";
import PlaybooksClient from "../playbooks/PlaybooksClient";

export default function BioSuiteClient() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") as any;
  const [activeTab, setActiveTab] = useState<"fasting" | "vitals" | "breathwork" | "circadian" | "recovery" | "playbooks">(
    initialTab || "fasting"
  );

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["fasting", "vitals", "breathwork", "circadian", "recovery", "playbooks"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* Master Workstation Header */}
      <div>
        <span className="inline-flex mb-3 rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
          Human Telemetry & Bio-Optimization Suite
        </span>
        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
          Bio Workstation Hub
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#737970] dark:text-[#a1a1aa]">
          Unified suite for circadian optics, fasting autophagy, breathwork, recovery, and life guides.
        </p>
      </div>

      {/* Executive Segmented Control Tab Switcher */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-[#e5e1d7] bg-white p-2 dark:border-[#27272a] dark:bg-[#18181b] shadow-xs">
        <button
          onClick={() => setActiveTab("fasting")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "fasting"
              ? "bg-[#232f26] text-white dark:bg-[#3f3f46] shadow-xs"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>⏱️</span> Fasting Clock
        </button>

        <button
          onClick={() => setActiveTab("vitals")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "vitals"
              ? "bg-[#232f26] text-white dark:bg-[#3f3f46] shadow-xs"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>📈</span> Biometric Vitals
        </button>

        <button
          onClick={() => setActiveTab("breathwork")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "breathwork"
              ? "bg-[#232f26] text-white dark:bg-[#3f3f46] shadow-xs"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>🫁</span> Breath Pacer
        </button>

        <button
          onClick={() => setActiveTab("circadian")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "circadian"
              ? "bg-[#232f26] text-white dark:bg-[#3f3f46] shadow-xs"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>☀️</span> Solar Optics
        </button>

        <button
          onClick={() => setActiveTab("recovery")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "recovery"
              ? "bg-[#232f26] text-white dark:bg-[#3f3f46] shadow-xs"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>🧊</span> Thermal Recovery
        </button>

        <button
          onClick={() => setActiveTab("playbooks")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "playbooks"
              ? "bg-[#232f26] text-white dark:bg-[#3f3f46] shadow-xs"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>🧠</span> Life Guides
        </button>
      </div>

      {/* Tab Content Display (Passing embedded=true to hide duplicate sub-headers) */}
      <div className="pt-2">
        {activeTab === "fasting" && <FastingClient embedded={true} />}
        {activeTab === "vitals" && <VitalsClient embedded={true} />}
        {activeTab === "breathwork" && <BreathworkClient embedded={true} />}
        {activeTab === "circadian" && <CircadianClient embedded={true} />}
        {activeTab === "recovery" && <RecoveryClient embedded={true} />}
        {activeTab === "playbooks" && <PlaybooksClient embedded={true} />}
      </div>
    </div>
  );
}
