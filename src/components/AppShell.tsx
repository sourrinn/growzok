"use client";

import { useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";

interface Props {
  userLabel: string;
  children: React.ReactNode;
}

export default function AppShell({ userLabel, children }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbf9f5]/50">
      {/* Desktop Fixed Left Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <AppSidebar userLabel={userLabel} />
      </div>

      {/* Mobile Top Navigation Bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e5e1d7] bg-[#fbf9f5]/90 px-4 py-3 backdrop-blur-md md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#232f26] font-display text-sm font-bold text-white">
            G
          </span>
          <span className="font-display text-base font-semibold text-[#232f26]">
            Growzok
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-lg border border-[#e5e1d7] px-2.5 py-1 text-xs font-semibold text-[#232f26]"
        >
          {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      {/* Mobile Menu Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#fbf9f5] p-4 md:hidden">
          <div className="flex justify-end pb-3">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#737970]"
            >
              ✕ Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AppSidebar userLabel={userLabel} />
          </div>
        </div>
      )}

      {/* Main Content Area (Pushed over by 64 cols on desktop) */}
      <div className="md:pl-64">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
