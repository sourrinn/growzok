"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface Props {
  userLabel: string;
}

export default function AppSidebar({ userLabel }: Props) {
  const pathname = usePathname();

  const workspaceItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      ),
    },
    {
      label: "Reports & Analytics",
      href: "/reports",
      active: pathname === "/reports",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Habit Systems",
      href: "/templates",
      active: pathname.startsWith("/templates"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
  ];

  const isAccountActive = pathname === "/account";

  return (
    <aside className="flex h-full flex-col justify-between border-r border-[#e5e1d7] bg-[#fbf9f5] p-4 text-[#232f26]">
      {/* Top Section: Brand & Workspace Nav */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-1">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#232f26] font-display text-lg font-bold text-[#fbf9f5]">
              G
            </span>
            <div>
              <span className="font-display text-lg font-semibold tracking-tight text-[#232f26]">
                Growzok
              </span>
              <span className="ml-2 rounded-full bg-[#e3ede6] px-2 py-0.5 text-[10px] font-semibold text-[#406852]">
                v2.0
              </span>
            </div>
          </Link>
        </div>

        {/* Workspace Navigation Group */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#737970]">
            Workspace
          </p>
          <nav className="mt-2 space-y-1">
            {workspaceItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  item.active
                    ? "bg-[#232f26] text-[#fbf9f5] shadow-sm font-semibold"
                    : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26]"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Account Settings Nav Item & Profile Card */}
      <div className="space-y-3 border-t border-[#e5e1d7] pt-4">
        {/* Dedicated Bottom Account Nav Item */}
        <Link
          href="/account"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
            isAccountActive
              ? "bg-[#232f26] text-[#fbf9f5] shadow-sm font-semibold"
              : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26]"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          <span>Account Settings</span>
        </Link>

        {/* User Card with Sign Out Action */}
        {userLabel ? (
          <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-[#e5e1d7] shadow-sm">
            <Link href="/account" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#232f26] text-xs font-bold text-white uppercase">
                {userLabel[0]}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#232f26]">
                  {userLabel}
                </p>
                <p className="text-[10px] text-[#737970]">Active Member</p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign out"
              className="rounded-lg p-1.5 text-xs text-[#737970] transition-colors hover:bg-[#be5a38]/10 hover:text-[#be5a38]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/login"
              className="flex-1 rounded-xl border border-[#e5e1d7] py-2 text-center text-xs font-semibold text-[#232f26]"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
