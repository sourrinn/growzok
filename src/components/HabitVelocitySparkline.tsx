"use client";

import type { Habit } from "@/types/habit";
import { dateStrOffset } from "@/lib/dates";

interface Props {
  habit: Habit;
  className?: string;
}

export default function HabitVelocitySparkline({ habit, className = "" }: Props) {
  const historySet = new Set(habit.history);
  
  // Get last 14 days (oldest to newest: -13 to 0)
  const points: number[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = dateStrOffset(-i);
    points.push(historySet.has(d) ? 1 : 0);
  }

  // Calculate velocity: sum of last 7 days vs previous 7 days
  const recentSum = points.slice(7, 14).reduce((a, b) => a + b, 0);
  const priorSum = points.slice(0, 7).reduce((a, b) => a + b, 0);
  const diff = recentSum - priorSum;

  let strokeColor = "#737970"; // neutral
  if (diff > 0) strokeColor = "#406852"; // green surge
  else if (diff < 0) strokeColor = "#be5a38"; // rose dip

  // SVG dimensions
  const width = 64;
  const height = 18;
  const step = width / (points.length - 1);

  // Smooth Y points: map 0 -> height - 3, 1 -> 3
  const pathPoints = points.map((val, idx) => {
    const x = idx * step;
    const y = val === 1 ? 4 : height - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${pathPoints.join(" L ")}`;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} title={`14-Day Velocity: ${diff > 0 ? `+${diff}` : diff} completions`}>
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Endpoint marker dot */}
        {points.length > 0 && (
          <circle
            cx={(points.length - 1) * step}
            cy={points[points.length - 1] === 1 ? 4 : height - 4}
            r="2.5"
            fill={strokeColor}
          />
        )}
      </svg>
      <span className={`text-[10px] font-bold tabular-nums ${diff > 0 ? "text-[#406852] dark:text-[#a3b899]" : diff < 0 ? "text-[#be5a38]" : "text-[#737970]"}`}>
        {diff > 0 ? `+${diff}` : diff}
      </span>
    </div>
  );
}
