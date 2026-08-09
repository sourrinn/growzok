"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHabits } from "@/hooks/useHabits";
import { STANDARD_PROTOCOLS } from "@/lib/protocols";
import { fuzzyMatch } from "@/lib/fuzzySearch";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { habits, toggleHabit } = useHabits();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!open) return null;

  const filteredHabits = habits.filter(
    (h) => fuzzyMatch(h.name, query) || fuzzyMatch(h.domain, query) || fuzzyMatch(h.userLabel, query)
  );

  const filteredProtocols = STANDARD_PROTOCOLS.filter(
    (p) => fuzzyMatch(p.name, query) || fuzzyMatch(p.description, query) || p.tags.some((t) => fuzzyMatch(t, query))
  );

  const pages = [
    { name: "Dashboard", href: "/dashboard", icon: "•" },
    { name: "Reports & Analytics", href: "/reports", icon: "•" },
    { name: "Protocols Hub", href: "/protocols", icon: "◈" },
    { name: "Account Settings", href: "/account", icon: "•" },
    { name: "Admin Portal", href: "/admin", icon: "•" },
  ].filter((p) => fuzzyMatch(p.name, query));

  const handleNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const handleToggle = async (id: string) => {
    await toggleHabit(id);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-xl rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-[#e5e1d7] dark:border-[#27272a] px-4 py-3">
          <input
            type="text"
            placeholder="Type a command, habit, or search protocols… (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
          />
          <kbd className="hidden sm:inline-block rounded-md border border-[#e5e1d7] bg-[#fbf9f5] px-2 py-0.5 text-[10px] font-mono text-[#737970] dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#a1a1aa]">
            ESC
          </kbd>
        </div>

        {/* Command List Scrollable Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs no-scrollbar">
          {/* Quick Page Navigation */}
          {pages.length > 0 && (
            <div>
              <h4 className="px-2 pb-1.5 font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa] text-[10px]">
                Navigation
              </h4>
              <div className="space-y-1">
                {pages.map((p) => (
                  <button
                    key={p.href}
                    onClick={() => handleNavigate(p.href)}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left font-medium text-[#232f26] dark:text-[#f4f4f5] hover:bg-[#fbf9f5] dark:hover:bg-[#27272a] transition-all"
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Habit Completion */}
          {filteredHabits.length > 0 && (
            <div>
              <h4 className="px-2 pb-1.5 font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa] text-[10px]">
                Active Habits (1-Tap Toggle)
              </h4>
              <div className="space-y-1">
                {filteredHabits.map((h) => {
                  const todayStr = new Date().toISOString().slice(0, 10);
                  const isDone = h.history.includes(todayStr);
                  return (
                    <button
                      key={h.id}
                      onClick={() => handleToggle(h.id)}
                      className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left font-medium text-[#232f26] dark:text-[#f4f4f5] hover:bg-[#fbf9f5] dark:hover:bg-[#27272a] transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: h.color }}
                        />
                        <span className="truncate">{h.name}</span>
                      </div>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          isDone
                            ? "bg-[#e3ede6] text-[#406852] dark:bg-[#27272a] dark:text-[#a1a1aa]"
                            : "bg-[#232f26] text-white dark:bg-[#3f3f46] dark:text-[#f4f4f5]"
                        }`}
                      >
                        {isDone ? "✓ Done" : "Complete"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Preset Protocols */}
          {filteredProtocols.length > 0 && (
            <div>
              <h4 className="px-2 pb-1.5 font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa] text-[10px]">
                Protocol Marketplace
              </h4>
              <div className="space-y-1">
                {filteredProtocols.slice(0, 5).map((proto) => (
                  <button
                    key={proto.key}
                    onClick={() => handleNavigate(`/protocols/${proto.key}`)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left font-medium text-[#232f26] dark:text-[#f4f4f5] hover:bg-[#fbf9f5] dark:hover:bg-[#27272a] transition-all"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>◈</span>
                      <span className="truncate">{proto.name}</span>
                    </div>
                    <span className="text-[10px] text-[#737970] dark:text-[#a1a1aa]">
                      {proto.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
