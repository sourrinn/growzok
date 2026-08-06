"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface Props {
  userLabel: string;
}

export default function AppSidebar({ userLabel }: Props) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "⚡",
      active: pathname === "/dashboard",
    },
    {
      label: "Reports & Analytics",
      href: "/reports",
      icon: "📊",
      active: pathname === "/reports",
    },
    {
      label: "Habit Systems",
      href: "/templates",
      icon: "📦",
      active: pathname.startsWith("/templates"),
    },
  ];

  return (
    <aside className="flex h-full flex-col justify-between border-r border-[#e5e1d7] bg-[#fbf9f5] p-4 text-[#232f26]">
      {/* Top Section: Brand & Nav Links */}
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

        {/* Navigation Group */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#737970]">
            Workspace
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  item.active
                    ? "bg-[#232f26] text-[#fbf9f5] shadow-sm font-semibold"
                    : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-1 pt-2 border-t border-[#e5e1d7]/60">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#737970]">
            Platform
          </p>
          <nav className="mt-1 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-[#737970] transition-colors hover:bg-[#e5e1d7]/40 hover:text-[#232f26]"
            >
              <span>🌿</span>
              <span>Marketing Overview</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom Section: User Profile Card */}
      <div className="border-t border-[#e5e1d7] pt-4">
        {userLabel ? (
          <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-[#e5e1d7] shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#232f26] text-xs font-bold text-white uppercase">
                {userLabel[0]}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#232f26]">
                  {userLabel}
                </p>
                <p className="text-[10px] text-[#737970]">Active Member</p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign out"
              className="rounded-lg p-1.5 text-xs text-[#737970] transition-colors hover:bg-[#be5a38]/10 hover:text-[#be5a38]"
            >
              🚪
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
