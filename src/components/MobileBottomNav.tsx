"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Command Hub",
      href: "/dashboard",
      active: pathname === "/dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      ),
    },
    {
      label: "Habits",
      href: "/habits",
      active: pathname === "/habits",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      label: "Bio Suite",
      href: "/bio",
      active: pathname.startsWith("/bio"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 0 0 18M12 7v10" />
        </svg>
      ),
    },
    {
      label: "Protocols",
      href: "/protocols",
      active: pathname.startsWith("/protocols") || pathname.startsWith("/playbooks") || pathname.startsWith("/templates"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      label: "Reports",
      href: "/reports",
      active: pathname === "/reports",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      ),
    },
  ];

  return (
    <nav aria-label="Mobile Bottom Navigation" className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e5e1d7] bg-[#fbf9f5]/95 dark:border-[#27272a] dark:bg-[#121215]/95 backdrop-blur-md md:hidden px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
              item.active
                ? "bg-[#232f26] text-white shadow-xs dark:bg-[#f4f4f5] dark:text-[#18181b] scale-105"
                : "text-[#737970] hover:text-[#232f26] hover:bg-[#e5e1d7]/40 dark:text-[#a1a1aa] dark:hover:text-white dark:hover:bg-[#27272a]"
            }`}
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </nav>
  );
}
