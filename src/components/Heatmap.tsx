"use client";

import { toDateStr } from "@/lib/dates";

interface Props {
  history: string[];
  color: string;
  /** How many weeks of history to show, ending with the current week. */
  weeks?: number;
}

/** GitHub-style completion calendar: one column per week, Sun-Sat rows. */
export default function Heatmap({ history, color, weeks = 20 }: Props) {
  const set = new Set(history);
  const today = new Date();
  const todayDateStr = toDateStr(today);

  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7 - 1));
  start.setDate(start.getDate() - start.getDay()); // back to the preceding Sunday

  const end = new Date(today);
  end.setDate(end.getDate() + (6 - end.getDay())); // forward to the coming Saturday

  const days: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(toDateStr(d));
  }

  const columns: string[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex gap-[3px] overflow-x-auto py-1" aria-hidden="true">
      {columns.map((col, i) => (
        <div key={i} className="flex flex-col gap-[3px]">
          {col.map((d) => {
            const isFuture = d > todayDateStr;
            const isDone = set.has(d);
            return (
              <span
                key={d}
                title={d}
                className={`h-[11px] w-[11px] rounded-[2px] transition-transform hover:scale-125 ${
                  isFuture
                    ? "bg-transparent"
                    : isDone
                      ? ""
                      : "bg-[#e8e6e1] dark:bg-[#27272a]"
                }`}
                style={{
                  backgroundColor: !isFuture && isDone ? color : undefined,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
