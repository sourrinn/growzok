"use client";

import { useEffect, useState } from "react";
import type { UserLevelStats } from "@/lib/gamification";
import { generateSocialShareCard } from "@/lib/canvasShareCard";

interface Props {
  stats: UserLevelStats;
  userName?: string;
  onClose: () => void;
}

export default function SocialShareModal({ stats, userName, onClose }: Props) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = generateSocialShareCard({ stats, userName, theme: "dark" });
    setDataUrl(url);
  }, [stats, userName]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `growzok-mastery-card-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
  };

  const handleCopyImage = async () => {
    try {
      if (!dataUrl) return;
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-2xl dark:border-[#27272a] dark:bg-[#18181b] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
              Share System Mastery
            </h2>
            <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
              Download your high-res achievement card for Twitter/X, LinkedIn, or Instagram.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-transparent p-1.5 text-xs text-[#737970] hover:border-[#e5e1d7] dark:hover:border-[#27272a] dark:text-[#a1a1aa]"
          >
            ✕
          </button>
        </div>

        {/* Image Preview */}
        {dataUrl ? (
          <div className="overflow-hidden rounded-xl border border-[#e5e1d7] dark:border-[#27272a] shadow-inner bg-black">
            <img src={dataUrl} alt="Growzok Social Achievement Card" className="w-full h-auto object-contain" />
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-[#121215] text-xs text-gray-400">
            Generating high-res card...
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleCopyImage}
            className="rounded-xl border border-[#e5e1d7] bg-white px-4 py-2 text-xs font-semibold text-[#232f26] hover:bg-gray-50 dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#f4f4f5] dark:hover:bg-[#27272a] transition-all"
          >
            {copied ? "✓ Copied Image!" : "📋 Copy Image"}
          </button>
          <button
            onClick={handleDownload}
            className="rounded-xl bg-[#232f26] px-5 py-2 text-xs font-semibold text-white hover:bg-[#406852] dark:bg-[#f4f4f5] dark:text-[#18181b] dark:hover:bg-white transition-all shadow-sm"
          >
            ⬇️ Download High-Res PNG
          </button>
        </div>
      </div>
    </div>
  );
}
