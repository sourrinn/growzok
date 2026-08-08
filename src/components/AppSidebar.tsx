"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { useTheme } from "@/components/ThemeProvider";

interface Props {
  userLabel?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ADMIN_EMAIL = "sourinbiswas002@gmail.com";

export default function AppSidebar({
  isCollapsed = false,
  onToggleCollapse,
}: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme, isDark } = useTheme();

  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  const baseNavItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0">
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0">
          <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Protocols",
      href: "/protocols",
      active: pathname.startsWith("/protocols") || pathname.startsWith("/templates"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
  ];

  const adminNavItem = {
    label: "Admin Portal",
    href: "/admin",
    active: pathname.startsWith("/admin"),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;

  const isAccountActive = pathname === "/account";

  return (
    <aside className="flex h-full flex-col justify-between border-r border-[#e5e1d7] bg-[#fbf9f5] p-3 text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5] transition-all duration-300">
      {/* Top Section */}
      <div className="space-y-5">
        {/* Brand & Toggle Header */}
        <div className="flex items-center justify-between px-1 py-1">
          {!isCollapsed ? (
            <>
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#232f26] font-display text-lg font-bold text-[#fbf9f5] dark:bg-[#27272a] dark:text-[#f4f4f5]">
                  G
                </span>
                <div>
                  <span className="font-display text-lg font-semibold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
                    Growzok
                  </span>
                  <span className="ml-2 rounded-full bg-[#e3ede6] px-2 py-0.5 text-[10px] font-semibold text-[#406852] dark:bg-[#27272a] dark:text-[#a1a1aa]">
                    v2.0
                  </span>
                </div>
              </Link>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  title="Collapse sidebar"
                  className="rounded-lg p-1.5 text-[#737970] transition-colors hover:bg-[#e5e1d7]/60 hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:bg-[#27272a] dark:hover:text-[#f4f4f5]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 3v18" />
                    <path d="M14 9l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </>
          ) : (
            <div className="flex w-full items-center justify-center">
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  title="Expand sidebar"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#232f26] text-sm font-bold text-white dark:bg-[#27272a] dark:text-[#f4f4f5] transition-opacity hover:opacity-90"
                >
                  G
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
              Workspace
            </p>
          )}
          <nav className="mt-2 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-xl transition-all ${
                  isCollapsed ? "justify-center py-2.5 px-0" : "gap-3 px-3 py-2.5 text-sm"
                } font-medium ${
                  item.active
                    ? "bg-[#232f26] text-[#fbf9f5] dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-sm font-semibold border border-transparent dark:border-[#3f3f46]"
                    : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:bg-[#27272a] dark:hover:text-[#f4f4f5]"
                }`}
              >
                <span>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Theme Switcher & Account Settings */}
      <div className="space-y-1.5 border-t border-[#e5e1d7] pt-3 dark:border-[#27272a]">
        {/* Theme Switcher Button */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          title={isCollapsed ? (isDark ? "Light Mode" : "Dark Mode") : undefined}
          className={`flex w-full items-center rounded-xl transition-all ${
            isCollapsed ? "justify-center py-2.5 px-0" : "gap-3 px-3 py-2.5 text-sm"
          } font-medium text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:bg-[#27272a] dark:hover:text-[#f4f4f5]`}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 text-amber-400">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 text-[#232f26]">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
          {!isCollapsed && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        <Link
          href="/account"
          title={isCollapsed ? "Account Settings" : undefined}
          className={`flex items-center rounded-xl transition-all ${
            isCollapsed ? "justify-center py-2.5 px-0" : "gap-3 px-3 py-2.5 text-sm"
          } font-medium ${
            isAccountActive
              ? "bg-[#232f26] text-[#fbf9f5] dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-sm font-semibold border border-transparent dark:border-[#3f3f46]"
              : "text-[#737970] hover:bg-[#e5e1d7]/50 hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:bg-[#27272a] dark:hover:text-[#f4f4f5]"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          {!isCollapsed && <span>Account Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
