"use client";

import React from "react";
import { HorseLoader } from "./HorseLoader";

export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-shimmer rounded-lg bg-[#e5e1d7]/60 dark:bg-[#27272a] ${className}`}
      style={style}
    />
  );
}

/** Card Skeleton for Habit Items with Horse Motion Track */
export function SkeletonHabitCard({ delayClass = "" }: { delayClass?: string }) {
  return (
    <div
      className={`flex h-full flex-col justify-between rounded-3xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-4 animate-fade-in ${delayClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-full">
          <div className="h-10 w-10 shrink-0 rounded-2xl bg-[#e5e1d7]/40 dark:bg-[#27272a] flex items-center justify-center">
            <HorseLoader size="sm" inline />
          </div>
          <div className="space-y-2 w-3/4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#e5e1d7]/50 dark:border-[#27272a]">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

/** Protocol Card Skeleton */
export function SkeletonProtocolCard({ delayClass = "" }: { delayClass?: string }) {
  return (
    <div
      className={`flex flex-col justify-between rounded-3xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-4 animate-fade-in ${delayClass}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <HorseLoader size="sm" inline />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="rounded-xl bg-[#fbf9f5] dark:bg-[#27272a] p-3 space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-2.5 w-4/5" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#e5e1d7] dark:border-[#27272a] pt-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

/** KPI Stat Tile Skeleton */
export function SkeletonStatTile({ delayClass = "" }: { delayClass?: string }) {
  return (
    <div
      className={`rounded-3xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-3 animate-fade-in ${delayClass}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <HorseLoader size="sm" inline />
      </div>
      <div className="flex items-baseline justify-between pt-1">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>
    </div>
  );
}
