"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import CommandPalette from "@/components/CommandPalette";
import MobileBottomNav from "@/components/MobileBottomNav";
import { SessionProvider, useSessionContext } from "@/contexts/SessionContext";
import { SessionOverlay } from "@/components/SessionOverlay";

import { useSession } from "next-auth/react";

interface Props {
  userLabel?: string;
  secondarySidebar?: React.ReactNode;
  children: React.ReactNode;
}

// ─── Active Session Banner ────────────────────────────────────────────────────

function ActiveSessionBanner() {
  const { activeSession, resumeOverlay } = useSessionContext();

  if (!activeSession || activeSession.status !== "in_progress") return null;

  const elapsed = activeSession.elapsedSeconds ?? 0;
  const planned = activeSession.plannedDurationSeconds ?? 1500;
  const remaining = Math.max(0, planned - elapsed);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = Math.min(100, Math.round((elapsed / planned) * 100));

  return (
    <div className="fixed top-0 left-0 right-0 z-[120] flex items-center justify-between gap-3 bg-[#232f26] px-4 py-2 shadow-lg">
      {/* Progress bar underlay */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-[#a3b899] transition-all duration-1000"
        style={{ width: `${pct}%` }}
      />

      <div className="flex items-center gap-3 min-w-0">
        <span className="inline-flex h-2 w-2 rounded-full bg-[#4ade80] animate-pulse shrink-0" />
        <span className="text-xs font-semibold text-[#f4f4f5] truncate">
          Session active
        </span>
        <span className="hidden sm:inline text-xs text-[#a3b899] font-mono tabular-nums">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")} remaining
        </span>
      </div>

      <button
        onClick={resumeOverlay}
        className="shrink-0 rounded-lg bg-[#406852] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#4a7a60] transition-colors"
      >
        Resume →
      </button>
    </div>
  );
}

// ─── Inner Shell (has access to SessionContext) ───────────────────────────────

function AppShellInner({ userLabel = "Workspace", secondarySidebar, children }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session } = useSession();
  const { activeSession } = useSessionContext();

  const isSessionActive = activeSession?.status === "in_progress";

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
    <div className={`min-h-screen bg-[#fbf9f5]/50 dark:bg-[#09090b] ${isSessionActive ? "pt-9" : ""}`}>
      {/* Active Session Banner — persists globally */}
      <ActiveSessionBanner />

      {/* Global Session Focus Overlay */}
      <SessionOverlay />

      {/* Primary Fixed Left Sidebar */}
      <div
        className={`hidden md:fixed md:inset-y-0 md:flex md:flex-col z-30 transition-all duration-300 ${
          isCollapsed ? "md:w-16" : "md:w-64"
        } ${isSessionActive ? "mt-9" : ""}`}
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
          } ${isSessionActive ? "mt-9" : ""}`}
        >
          {secondarySidebar}
        </div>
      )}

      {/* Mobile Top Navigation Bar (Left: Menu, Center: Branding, Right: Profile) */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e5e1d7] bg-[#fbf9f5]/90 dark:border-[#27272a] dark:bg-[#09090b]/90 px-4 py-2.5 backdrop-blur-md md:hidden">
        {/* Left: Menu Toggle Button (Icon-Only Hamburger) */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5e1d7] bg-white text-[#232f26] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#f4f4f5] shadow-xs active:scale-95 transition-all shrink-0"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>

        {/* Center: Branding */}
        <Link href="/" className="flex items-center">
          <span className="font-display text-lg font-bold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
            Growzok
          </span>
        </Link>

        {/* Right: Profile Account Tab */}
        <Link
          href="/account"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5e1d7] bg-white text-[#232f26] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#f4f4f5] shadow-xs active:scale-95 transition-all shrink-0"
          aria-label="Profile Account Settings"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Link>
      </div>

      {/* Mobile Menu Slide-Over Drawer with backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Semi-transparent backdrop — tap to close */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-in panel from left */}
          <div className="absolute inset-y-0 left-0 z-10 w-72 max-w-[85vw] flex flex-col bg-[#fbf9f5] dark:bg-[#18181b] shadow-2xl animate-slide-in-left">
            <div className="flex justify-end p-3 border-b border-[#e5e1d7] dark:border-[#27272a]">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-[#737970] dark:text-[#a1a1aa] hover:bg-[#e5e1d7]/40 dark:hover:bg-[#27272a]"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 p-3">
              <AppSidebar userLabel={userLabel} isCollapsed={false} />
              {secondarySidebar && (
                <div className="border-t border-[#e5e1d7] dark:border-[#27272a] pt-4">
                  {secondarySidebar}
                </div>
              )}
            </div>
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

      {/* Fixed Mobile Bottom Navigation (Icon-Only, Excludes Admin) */}
      <MobileBottomNav />
    </div>
  );
}

// ─── Public Export (wraps with SessionProvider) ───────────────────────────────

export default function AppShell(props: Props) {
  return (
    <SessionProvider>
      <AppShellInner {...props} />
    </SessionProvider>
  );
}
