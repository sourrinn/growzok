"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import CommandPalette from "@/components/CommandPalette";

interface Props {
  userLabel?: string;
  secondarySidebar?: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({ userLabel = "Workspace", secondarySidebar, children }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("growzok_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("growzok_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5]/50 dark:bg-[#09090b]">
      {/* Primary Fixed Left Sidebar */}
      <div
        className={`hidden md:fixed md:inset-y-0 md:flex md:flex-col z-30 transition-all duration-300 ${
          isCollapsed ? "md:w-16" : "md:w-64"
        }`}
      >
        <AppSidebar
          userLabel={userLabel}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>

      {/* Secondary Fixed Sub-Sidebar (Attached to the right of primary sidebar) */}
      {secondarySidebar && (
        <div
          className={`hidden md:fixed md:inset-y-0 md:flex md:flex-col z-20 transition-all duration-300 ${
            isCollapsed ? "md:left-16" : "md:left-64"
          }`}
        >
          {secondarySidebar}
        </div>
      )}

      {/* Mobile Top Navigation Bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e5e1d7] bg-[#fbf9f5]/90 dark:border-[#27272a] dark:bg-[#09090b]/90 px-4 py-3 backdrop-blur-md md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#232f26] font-display text-sm font-bold text-white dark:bg-[#27272a] dark:text-[#f4f4f5]">
            G
          </span>
          <span className="font-display text-base font-semibold text-[#232f26] dark:text-[#f4f4f5]">
            Growzok
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-lg border border-[#e5e1d7] dark:border-[#27272a] px-2.5 py-1 text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5]"
        >
          {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      {/* Mobile Menu Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#fbf9f5] dark:bg-[#18181b] p-4 md:hidden">
          <div className="flex justify-end pb-3">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#737970] dark:text-[#a1a1aa]"
            >
              ✕ Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
            <AppSidebar userLabel={userLabel} isCollapsed={false} />
            {secondarySidebar && (
              <div className="border-t border-[#e5e1d7] dark:border-[#27272a] pt-4">
                {secondarySidebar}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area (Dynamic padding matching primary + secondary sidebar states) */}
      <div
        className={`transition-all duration-300 ${
          secondarySidebar
            ? isCollapsed
              ? "md:pl-[19rem]" // 4rem (w-16) + 15rem (w-60)
              : "md:pl-[31rem]" // 16rem (w-64) + 15rem (w-60)
            : isCollapsed
              ? "md:pl-16"
              : "md:pl-64"
        }`}
      >
        <main className="mx-auto max-w-7xl px-4 py-5 sm:py-8 pb-20 sm:pb-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Global Ctrl+K Command Palette */}
      <CommandPalette />
    </div>
  );
}
