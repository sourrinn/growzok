"use client";

import { signOut } from "next-auth/react";
import type { Habit } from "@/types/habit";

interface Props {
  userName: string;
  userEmail: string;
  habitsCount: number;
}

export default function AccountView({ userName, userEmail, habitsCount }: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#232f26]">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-[#737970]">
          Manage your profile, active habits data, and session security.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970]">
          Profile Overview
        </h2>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#232f26] font-display text-xl font-bold text-white uppercase">
              {(userName || userEmail || "U")[0]}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#232f26]">
                {userName || "Growzok User"}
              </h3>
              <p className="text-xs text-[#737970]">{userEmail}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-[#e3ede6] px-2 py-0.5 text-[11px] font-semibold text-[#406852]">
                  Active Member
                </span>
                <span className="text-xs text-[#737970]">
                  {habitsCount} habit{habitsCount === 1 ? "" : "s"} tracked
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Authentication */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970]">
          Security & Session
        </h2>
        <div className="mt-3 text-xs text-[#737970] leading-relaxed">
          Your account is secured via standard scrypt password hashing and isolated JWT session tokens.
        </div>

        <div className="mt-6 border-t border-[#e5e1d7] pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#232f26]">End Active Session</h4>
              <p className="text-xs text-[#737970]">
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
