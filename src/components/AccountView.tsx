"use client";

import { signOut } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";
import CustomSelect from "@/components/CustomSelect";

interface Props {
  userName: string;
  userEmail: string;
  habitsCount: number;
}

const THEME_OPTIONS = [
  { value: "light", label: "☀️ Light Mode" },
  { value: "dark", label: "🌙 Dark Mode" },
  { value: "system", label: "💻 System Default" },
];

export default function AccountView({ userName, userEmail, habitsCount }: Props) {
  const { theme, setTheme } = useTheme();

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
            onChange={(val) => setTheme(val as "light" | "dark" | "system")}
            className="w-full"
          />
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
