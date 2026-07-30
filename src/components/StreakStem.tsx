"use client";

import { lastNDays } from "@/lib/dates";

export default function StreakStem({
  history,
  color,
}: {
  history: string[];
  color: string;
}) {
  const days = lastNDays(14);
  const set = new Set(history);

  return (
    <div className="mt-1.5 flex h-4 items-end gap-0.75" aria-hidden="true">
      {days.map((d) => (
        <span
          key={d}
          className="h-1.25 w-1.25 rounded-[1px_6px_1px_6px] transition-colors"
          style={{ backgroundColor: set.has(d) ? color : "#e8e6e1" }}
        />
      ))}
    </div>
  );
}
