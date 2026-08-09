"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { decodeRoutineFromURL } from "@/lib/protocolExporter";
import { useHabits } from "@/hooks/useHabits";

export default function ImportClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addHabit } = useHabits();
  const [adopting, setAdopting] = useState(false);
  const [adopted, setAdopted] = useState(false);

  const rawData = searchParams.get("data");
  const habitsToImport = rawData ? decodeRoutineFromURL(rawData) : [];

  const handleAdoptAll = async () => {
    if (habitsToImport.length === 0) return;
    setAdopting(true);
    try {
      for (const h of habitsToImport) {
        await addHabit({
          name: h.name,
          category: h.category as any,
          userLabel: h.userLabel || "Personal",
          domain: h.domain as any,
          frequency: { type: "daily" },
          missAllowance: 0,
          target: h.target ? { goal: h.target.goal, unit: h.target.unit, type: h.target.type as any } : null,
        });
      }
      setAdopted(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } finally {
      setAdopting(false);
    }
  };

  if (!rawData || habitsToImport.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center space-y-4">
        <span className="text-4xl">⚠️</span>
        <h1 className="font-display text-2xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
          Invalid or Expired Protocol Link
        </h1>
        <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
          The protocol import link appears to be incomplete or corrupted.
        </p>
        <div className="pt-2">
          <Link
            href="/protocols"
            className="rounded-xl bg-[#232f26] px-4 py-2.5 text-xs font-bold text-white dark:bg-[#3f3f46] dark:text-[#f4f4f5]"
          >
            Browse Protocol Library →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
            Custom Shared Protocol Stack
          </span>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
            Import Custom Routine Stack
          </h1>
          <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
            Preview the {habitsToImport.length} habits included in this shared routine before adding them to your account.
          </p>
        </div>
        <button
          onClick={handleAdoptAll}
          disabled={adopting || adopted}
          className="rounded-xl bg-[#406852] px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-[#232f26] transition-all disabled:opacity-50"
        >
          {adopted ? "✓ Added to Dashboard!" : adopting ? "Adding Routine..." : "Adopt Routine Stack →"}
        </button>
      </div>

      {/* Habit Preview Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {habitsToImport.map((h, i) => (
          <div key={i} className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-[#e3ede6] dark:bg-[#27272a] px-2 py-0.5 text-[10px] font-bold text-[#406852] dark:text-[#a1a1aa]">
                {h.domain}
              </span>
              <span className="text-[10px] font-semibold text-[#737970] dark:text-[#a1a1aa]">
                {h.userLabel}
              </span>
            </div>
            <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">
              {h.name}
            </h3>
            {h.target && (
              <p className="text-xs font-medium text-[#406852] dark:text-[#a3b899]">
                Target Goal: {h.target.goal} {h.target.unit}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
