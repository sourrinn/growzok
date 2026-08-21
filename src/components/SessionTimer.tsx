"use client";

import { useEffect, useRef, useState } from "react";

interface SessionTimerProps {
  /** Total planned duration in seconds */
  plannedSeconds: number;
  /** Already elapsed seconds (used to resume mid-session) */
  elapsedSeconds?: number;
  mode?: "countdown" | "countup";
  running?: boolean;
  /** Called every second with current elapsed seconds */
  onTick?: (elapsed: number) => void;
  /** Called when countdown reaches zero */
  onExpire?: () => void;
}

function formatTime(seconds: number): string {
  const abs = Math.abs(seconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function SessionTimer({
  plannedSeconds,
  elapsedSeconds: initialElapsed = 0,
  mode = "countdown",
  running = true,
  onTick,
  onExpire,
}: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(initialElapsed);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        onTick?.(next);
        if (mode === "countdown" && next >= plannedSeconds && !expiredRef.current) {
          expiredRef.current = true;
          onExpire?.();
        }
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode, plannedSeconds, onTick, onExpire]);

  const displaySeconds =
    mode === "countdown" ? Math.max(0, plannedSeconds - elapsed) : elapsed;
  const progress =
    mode === "countdown"
      ? Math.min(1, elapsed / Math.max(1, plannedSeconds))
      : Math.min(1, elapsed / Math.max(1, plannedSeconds));

  // Color phases: green → amber → red
  const isOvertime = mode === "countdown" && elapsed > plannedSeconds;
  const phase =
    isOvertime
      ? "over"
      : progress > 0.8
      ? "warning"
      : progress > 0.5
      ? "mid"
      : "early";

  const arcColor =
    phase === "over"
      ? "#ef4444"
      : phase === "warning"
      ? "#f59e0b"
      : phase === "mid"
      ? "#3b82f6"
      : "#22c55e";

  const RADIUS = 110;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="session-timer-root" aria-label="Session timer">
      <svg
        viewBox="0 0 280 280"
        width="280"
        height="280"
        className="session-timer-svg"
      >
        {/* Background track */}
        <circle
          cx="140"
          cy="140"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
        />
        {/* Animated progress arc */}
        <circle
          cx="140"
          cy="140"
          r={RADIUS}
          fill="none"
          stroke={arcColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 140 140)"
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.5s ease" }}
        />
        {/* Glow dot at progress head */}
        {running && (
          <circle
            cx={
              140 +
              RADIUS *
                Math.cos(
                  -Math.PI / 2 + 2 * Math.PI * progress
                )
            }
            cy={
              140 +
              RADIUS *
                Math.sin(
                  -Math.PI / 2 + 2 * Math.PI * progress
                )
            }
            r="7"
            fill={arcColor}
            style={{ filter: `drop-shadow(0 0 8px ${arcColor})` }}
          />
        )}
        {/* Time display */}
        <text
          x="140"
          y="130"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="46"
          fontWeight="700"
          fontFamily="monospace"
          letterSpacing="-2"
        >
          {isOvertime ? "+" : ""}
          {formatTime(displaySeconds)}
        </text>
        <text
          x="140"
          y="172"
          textAnchor="middle"
          fill="rgba(255,255,255,0.45)"
          fontSize="13"
          fontFamily="system-ui"
          fontWeight="500"
        >
          {mode === "countdown" ? "remaining" : "elapsed"}
        </text>
      </svg>

      <style>{`
        .session-timer-root {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .session-timer-svg {
          filter: drop-shadow(0 0 30px rgba(0,0,0,0.4));
        }
      `}</style>
    </div>
  );
}
