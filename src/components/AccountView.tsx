import { signOut } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";

interface Props {
  userName: string;
  userEmail: string;
  habitsCount: number;
}

export default function AccountView({ userName, userEmail, habitsCount }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#232f26] dark:text-[#f0ede6]">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-[#737970] dark:text-[#9eb0a2]">
          Manage your profile, active habits data, theme preferences, and session security.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#2d3c30] dark:bg-[#18201a] p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9eb0a2]">
          Profile Overview
        </h2>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#232f26] dark:bg-[#5fa07c] font-display text-xl font-bold text-white dark:text-[#0d130e] uppercase">
              {(userName || userEmail || "U")[0]}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#232f26] dark:text-[#f0ede6]">
                {userName || "Growzok User"}
              </h3>
              <p className="text-xs text-[#737970] dark:text-[#9eb0a2]">{userEmail}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-[#e3ede6] dark:bg-[#1d3326] px-2 py-0.5 text-[11px] font-semibold text-[#406852] dark:text-[#5fa07c]">
                  Active Member
                </span>
                <span className="text-xs text-[#737970] dark:text-[#9eb0a2]">
                  {habitsCount} habit{habitsCount === 1 ? "" : "s"} tracked
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Theme Preference */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#2d3c30] dark:bg-[#18201a] p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9eb0a2]">
          Appearance & Theme
        </h2>
        <p className="mt-1 text-xs text-[#737970] dark:text-[#9eb0a2]">
          Customize how Growzok looks on your display. Preference is automatically saved to your browser.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
              theme === "light"
                ? "border-[#232f26] bg-[#232f26] text-white shadow-sm"
                : "border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#2d3c30] dark:bg-[#222d25] text-[#232f26] dark:text-[#f0ede6] hover:bg-white dark:hover:bg-[#18201a]"
            }`}
          >
            <span>☀️ Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
              theme === "dark"
                ? "border-[#5fa07c] bg-[#5fa07c] text-[#0d130e] shadow-sm font-bold"
                : "border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#2d3c30] dark:bg-[#222d25] text-[#232f26] dark:text-[#f0ede6] hover:bg-white dark:hover:bg-[#18201a]"
            }`}
          >
            <span>🌙 Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
              theme === "system"
                ? "border-[#232f26] bg-[#232f26] text-white dark:border-[#5fa07c] dark:bg-[#5fa07c] dark:text-[#0d130e] shadow-sm"
                : "border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#2d3c30] dark:bg-[#222d25] text-[#232f26] dark:text-[#f0ede6] hover:bg-white dark:hover:bg-[#18201a]"
            }`}
          >
            <span>💻 System Default</span>
          </button>
        </div>
      </div>

      {/* Security & Authentication */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#2d3c30] dark:bg-[#18201a] p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9eb0a2]">
          Security & Session
        </h2>
        <div className="mt-3 text-xs text-[#737970] dark:text-[#9eb0a2] leading-relaxed">
          Your account is secured via standard scrypt password hashing and isolated JWT session tokens.
        </div>

        <div className="mt-6 border-t border-[#e5e1d7] dark:border-[#2d3c30] pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#232f26] dark:text-[#f0ede6]">End Active Session</h4>
              <p className="text-xs text-[#737970] dark:text-[#9eb0a2]">
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
