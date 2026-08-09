"use client";

import { useMemo } from "react";

export default function StreakProtectionCard() {
  const monthName = useMemo(() => {
    return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, []);

  return (
    <div className="rounded-2xl border border-[#406852]/30 bg-[#e3ede6]/40 dark:border-[#406852]/40 dark:bg-[#18181b] p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#406852] dark:text-[#a3b899]">
            Monthly Streak Protection
          </h3>
        </div>
        <span className="rounded-full bg-[#406852] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
          Active
        </span>
      </div>

      <p className="text-xs text-[#232f26] dark:text-[#f4f4f5] font-medium leading-relaxed">
        1 Grace Pass Available for <strong className="font-bold">{monthName}</strong>. Single missing days during travel or illness are automatically shielded to protect long-standing routine momentum.
      </p>
    </div>
  );
}
