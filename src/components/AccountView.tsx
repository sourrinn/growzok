"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import CustomSelect from "@/components/CustomSelect";
import { useHabits } from "@/hooks/useHabits";
import { downloadCSVFile } from "@/lib/csvExporter";
import { getChimePreset, setChimePreset, playCompletionChime } from "@/lib/soundChimes";

interface Props {
  userName: string;
  userEmail: string;
  habitsCount: number;
}

const THEME_OPTIONS = [
  { value: "light", label: "☀️ Light Mode" },
  { value: "dark", label: "🌙 Dark Mode" },
  { value: "system", label: "💻 System Default" },
  { value: "amoled", label: "🖤 AMOLED Pitch Black (OLED)" },
  { value: "auto", label: "🌅 Auto (Light 6am – 8pm / Dark otherwise)" },
];

export default function AccountView({ userName, userEmail, habitsCount }: Props) {
  const { theme, setTheme } = useTheme();
  const { habits } = useHabits();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-[#737970] dark:text-[#a1a1aa]">
          Manage your profile, active habits data, theme preferences, and session security.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
          Profile Overview
        </h2>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#232f26] dark:bg-[#27272a] dark:border dark:border-[#3f3f46] font-display text-xl font-bold text-white dark:text-[#f4f4f5] uppercase">
              {(userName || userEmail || "U")[0]}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                {userName || "Growzok User"}
              </h3>
              <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">{userEmail}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-[#e3ede6] dark:bg-[#27272a] px-2 py-0.5 text-[11px] font-semibold text-[#406852] dark:text-[#a1a1aa]">
                  Active Member
                </span>
                <span className="text-xs text-[#737970] dark:text-[#a1a1aa]">
                  {habitsCount} habit{habitsCount === 1 ? "" : "s"} tracked
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Theme Preference */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
          Appearance & Theme
        </h2>
        <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
          Customize how Growzok looks on your display. Preference is automatically saved to your browser.
        </p>

        <div className="mt-4 max-w-sm">
          <label className="block text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] mb-1.5">
            Theme Mode Preference
          </label>
          <CustomSelect
            options={THEME_OPTIONS}
            value={theme}
            onChange={(val) => setTheme(val as "light" | "dark" | "system" | "amoled" | "auto")}
            className="w-full"
          />
        </div>
      </div>

      {/* Calendar iCal Subscription & Data Portability (100% Free) */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
            Calendar Feed & Data Portability
          </h2>
          <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
            Subscribe to your Growzok routines directly inside Google Calendar, Apple Calendar, or Outlook for free using standard iCal feeds.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a] p-3.5">
          <div className="space-y-0.5 truncate pr-2">
            <span className="text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5]">
              📅 iCal Feed URL
            </span>
            <p className="text-[11px] font-mono text-[#737970] dark:text-[#a1a1aa] truncate">
              {typeof window !== "undefined" ? `${window.location.origin}/api/calendar/feed.ics` : "/api/calendar/feed.ics"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const url = `${window.location.origin}/api/calendar/feed.ics`;
                navigator.clipboard.writeText(url);
                alert("Calendar Feed URL copied to clipboard! Paste this into Google Calendar or Apple Calendar.");
              }}
              className="rounded-xl border border-[#e5e1d7] bg-white px-3.5 py-2 text-xs font-semibold text-[#232f26] dark:border-[#3f3f46] dark:bg-[#18181b] dark:text-[#f4f4f5] shadow-xs hover:bg-[#fbf9f5]"
            >
              📋 Copy Feed Link
            </button>

            <button
              type="button"
              onClick={() => downloadCSVFile(habits)}
              className="rounded-xl border border-[#406852] bg-[#406852]/10 px-3.5 py-2 text-xs font-bold text-[#406852] dark:border-[#a3b899] dark:text-[#a3b899] shadow-xs hover:bg-[#406852]/20"
            >
              📊 Export CSV Dataset
            </button>

            <a
              href="/api/user/export"
              download
              className="rounded-xl bg-[#232f26] px-3.5 py-2 text-xs font-semibold text-white dark:bg-[#3f3f46] dark:text-[#f4f4f5] shadow-xs hover:bg-black"
            >
              📥 Export Backup (JSON)
            </a>

            <label className="cursor-pointer rounded-xl border border-[#e5e1d7] bg-white px-3.5 py-2 text-xs font-semibold text-[#232f26] dark:border-[#3f3f46] dark:bg-[#18181b] dark:text-[#f4f4f5] shadow-xs hover:bg-[#fbf9f5]">
              📤 Restore from JSON
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    const res = await fetch("/api/user/restore", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ habits: data }),
                    });
                    if (res.ok) {
                      alert("Successfully restored habits from backup file!");
                      window.location.reload();
                    } else {
                      alert("Failed to restore backup file.");
                    }
                  } catch {
                    alert("Invalid JSON backup file.");
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Security & Authentication */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
          Security & Session
        </h2>
        <div className="mt-3 text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
          Your account is secured via standard scrypt password hashing and isolated JWT session tokens.
        </div>

        <div className="mt-6 border-t border-[#e5e1d7] dark:border-[#27272a] pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">End Active Session</h4>
              <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
                Sign out of your account on this device.
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-xl bg-[#be5a38] px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              Sign Out of Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
