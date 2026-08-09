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
      {/* Header Banner */}
      <div>
        <span className="rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
          Enterprise Human Telemetry & Bio-Optimization Suite
        </span>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
          Bio-Optimization Workstation Hub
        </h1>
        <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
          Unified physiological suite for circadian optics, fasting autophagy, breathwork, recovery, and vitals.
        </p>
      </div>

      {/* Scalable Multi-Tab Navigation Bar */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-[#e5e1d7] bg-white p-2 dark:border-[#27272a] dark:bg-[#18181b] shadow-xs">
        <button
          onClick={() => setActiveTab("fasting")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "fasting"
              ? "bg-[#406852] text-white"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>⏱️</span> Fasting Clock
        </button>

        <button
          onClick={() => setActiveTab("vitals")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "vitals"
              ? "bg-[#406852] text-white"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>📈</span> Biometric Vitals
        </button>

        <button
          onClick={() => setActiveTab("breathwork")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "breathwork"
              ? "bg-[#406852] text-white"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>🫁</span> Breath Pacer
        </button>

        <button
          onClick={() => setActiveTab("circadian")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "circadian"
              ? "bg-[#406852] text-white"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>☀️</span> Solar Optics
        </button>

        <button
          onClick={() => setActiveTab("recovery")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "recovery"
              ? "bg-[#406852] text-white"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>🧊</span> Thermal Recovery
        </button>

        <button
          onClick={() => setActiveTab("playbooks")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "playbooks"
              ? "bg-[#406852] text-white"
              : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <span>🧠</span> Bio Playbooks
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="pt-2">
        {activeTab === "fasting" && <FastingClient />}
        {activeTab === "vitals" && <VitalsClient />}
        {activeTab === "breathwork" && <BreathworkClient />}
        {activeTab === "circadian" && <CircadianClient />}
        {activeTab === "recovery" && <RecoveryClient />}
        {activeTab === "playbooks" && <PlaybooksClient />}
      </div>
    </div>
  );
}
