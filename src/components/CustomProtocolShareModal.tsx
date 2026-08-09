"use client";

import { useState } from "react";
import type { Habit } from "@/types/habit";
import { encodeRoutineToURL } from "@/lib/protocolExporter";

interface Props {
  habits: Habit[];
  onClose: () => void;
}

export default function CustomProtocolShareModal({ habits, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = encodeRoutineToURL(habits);

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-2xl dark:border-[#27272a] dark:bg-[#18181b] space-y-5 animate-scale-in">
        <div className="flex items-center justify-between border-b border-[#e5e1d7] dark:border-[#27272a] pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔗</span>
            <h3 className="font-bold text-base text-[#232f26] dark:text-[#f4f4f5]">
              Share Custom Protocol Stack
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#737970] dark:text-[#a1a1aa] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
          Share your custom routine stack ({habits.length} habits) via a direct link. Anyone with this link can import your routine into their account for free.
        </p>

        {/* URL Input Row */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Direct Import Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3.5 py-2 text-xs font-mono text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5] outline-none"
            />
            <button
              onClick={handleCopy}
              className="rounded-xl bg-[#232f26] px-4 py-2 text-xs font-bold text-white dark:bg-[#3f3f46] dark:text-[#f4f4f5] transition-all hover:bg-black shrink-0"
            >
              {copied ? "✓ Copied!" : "📋 Copy Link"}
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-[#e5e1d7] dark:border-[#27272a] flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#e5e1d7] bg-white px-4 py-2 text-xs font-semibold text-[#232f26] dark:border-[#27272a] dark:bg-[#27272a] dark:text-[#f4f4f5]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
