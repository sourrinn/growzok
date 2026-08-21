"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { SessionTimer } from "@/components/SessionTimer";
import { HorseLoader } from "@/components/HorseLoader";

// ─── Effort Rating Stars ──────────────────────────────────────────────────────

function EffortStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            fontSize: "28px",
            background: "none",
            border: "none",
            cursor: "pointer",
            opacity: n <= value ? 1 : 0.25,
            transition: "opacity 0.15s, transform 0.1s",
            transform: n <= value ? "scale(1.15)" : "scale(1)",
          }}
          aria-label={`Effort ${n}`}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}

// ─── Check-In Overlay ─────────────────────────────────────────────────────────

function CheckInOverlay({
  onConfirm,
  onNotFocused,
}: {
  onConfirm: () => void;
  onNotFocused: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "rgba(24,24,27,0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "32px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "14px" }}>🎯</div>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#f4f4f5",
            margin: "0 0 8px 0",
          }}
        >
          Still focused?
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.45)",
            margin: "0 0 24px 0",
          }}
        >
          Tap to confirm you are still on task.
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              background: "#22c55e",
              border: "none",
              color: "#000",
              fontSize: "15px",
              fontWeight: 800,
              padding: "14px",
              borderRadius: "14px",
              cursor: "pointer",
            }}
          >
            Yes, still focused
          </button>
          <button
            onClick={onNotFocused}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.6)",
              fontSize: "15px",
              fontWeight: 700,
              padding: "14px",
              borderRadius: "14px",
              cursor: "pointer",
            }}
          >
            No, I lost focus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Struggle Overlay ─────────────────────────────────────────────────────────

function StruggleOverlay({
  onContinue,
  onSkip,
  onBreakDown,
}: {
  onContinue: () => void;
  onSkip: () => void;
  onBreakDown: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(10px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <div
        style={{
          background: "rgba(24,24,27,0.97)",
          border: "1px solid rgba(245,158,11,0.3)",
          borderRadius: "24px",
          padding: "32px",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "14px" }}>🤔</div>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#f59e0b", margin: "0 0 8px 0" }}>
          Looks like this is tough
        </h3>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 24px 0" }}>
          You&apos;ve extended the timer several times. Is this task too difficult right now?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={onBreakDown}
            style={{
              background: "rgba(245,158,11,0.15)",
              border: "1px solid rgba(245,158,11,0.4)",
              color: "#f59e0b",
              fontSize: "14px",
              fontWeight: 700,
              padding: "14px",
              borderRadius: "14px",
              cursor: "pointer",
            }}
          >
            Break it down into smaller steps
          </button>
          <button
            onClick={onContinue}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              fontWeight: 700,
              padding: "14px",
              borderRadius: "14px",
              cursor: "pointer",
            }}
          >
            Continue anyway
          </button>
          <button
            onClick={onSkip}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              fontSize: "13px",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            Skip this habit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Completion Overlay ───────────────────────────────────────────────────────

function CompletionOverlay({
  onSubmit,
}: {
  onSubmit: (effortRating: number, note: string) => void;
}) {
  const [effort, setEffort] = useState(3);
  const [note, setNote] = useState("");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <div
        style={{
          background: "rgba(24,24,27,0.97)",
          border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "24px",
          padding: "36px",
          maxWidth: "440px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "6px" }}>🏆</div>
        <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#22c55e", margin: "0 0 6px 0" }}>
          Session Complete
        </h3>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 28px 0" }}>
          Excellent work. How hard was it?
        </p>

        <div style={{ marginBottom: "24px" }}>
          <EffortStars value={effort} onChange={setEffort} />
        </div>

        <textarea
          placeholder="Quick note (optional) — what did you notice?"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 280))}
          maxLength={280}
          rows={3}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "12px 14px",
            color: "#f4f4f5",
            fontSize: "13px",
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={() => onSubmit(effort, note)}
          style={{
            width: "100%",
            background: "#22c55e",
            border: "none",
            color: "#000",
            fontSize: "15px",
            fontWeight: 800,
            padding: "16px",
            borderRadius: "14px",
            cursor: "pointer",
            letterSpacing: "0.02em",
          }}
        >
          Save Session
        </button>
      </div>
    </div>
  );
}

// ─── Skip/Interrupt Modal ─────────────────────────────────────────────────────

const SKIP_REASONS = [
  "Not feeling well",
  "Ran out of time",
  "Too tired",
  "Something came up",
  "Habit no longer fits",
];

function SkipModal({
  type,
  onConfirm,
  onCancel,
}: {
  type: "skip" | "interrupt";
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(10px)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <div
        style={{
          background: "rgba(24,24,27,0.97)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "28px",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f4f4f5", margin: "0 0 6px 0" }}>
          {type === "skip" ? "Skip Session" : "Interrupt Session"}
        </h3>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: "0 0 18px 0" }}>
          What happened?
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "16px" }}>
          {SKIP_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                background: reason === r ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)",
                border: reason === r ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.08)",
                color: reason === r ? "#ef4444" : "rgba(255,255,255,0.5)",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <input
          placeholder="Or describe..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "10px 12px",
            color: "#f4f4f5",
            fontSize: "13px",
            outline: "none",
            fontFamily: "inherit",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onConfirm(reason || "No reason given")}
            style={{
              flex: 1,
              background: "#ef4444",
              border: "none",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              padding: "12px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            {type === "skip" ? "Skip" : "Interrupt"}
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
              fontWeight: 600,
              padding: "12px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main SessionClient ───────────────────────────────────────────────────────

type UIPhase =
  | "idle"
  | "running"
  | "checkin"
  | "struggle"
  | "completing"
  | "done"
  | "skipping";

export function SessionClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const habitId = searchParams.get("habitId") ?? "";
  const habitName = searchParams.get("name") ?? "Habit";
  const blockId = searchParams.get("blockId") ?? undefined;
  const plannedMins = parseInt(searchParams.get("mins") ?? "25", 10);

  const { session, loading, startSession, submitCheckIn, extendTimer, closeSession } =
    useSession();

  const [uiPhase, setUIPhase] = useState<UIPhase>("idle");
  const [inactivityTimer, setInactivityTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [checkInTimer, setCheckInTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // On mount — if a session already in progress exists for this habit, resume it
  useEffect(() => {
    if (!loading && session?.status === "in_progress") {
      setUIPhase("running");
      scheduleCheckIn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, session]);

  const scheduleCheckIn = useCallback(() => {
    if (checkInTimer) clearTimeout(checkInTimer);
    // Check-in every 8 minutes
    const t = setTimeout(() => setUIPhase("checkin"), 8 * 60 * 1000);
    setCheckInTimer(t);
  }, [checkInTimer]);

  const resetInactivity = useCallback(() => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    const t = setTimeout(() => {
      setUIPhase("checkin");
    }, 2 * 60 * 1000);
    setInactivityTimer(t);
  }, [inactivityTimer]);

  const handleStart = async () => {
    if (!habitId) return;
    await startSession({
      habitId,
      blockId,
      timerMode: "countdown",
      plannedDurationSeconds: plannedMins * 60,
    });
    setUIPhase("running");
    scheduleCheckIn();
    resetInactivity();
  };

  const handleCheckInConfirm = async () => {
    await submitCheckIn(true);
    setUIPhase("running");
    scheduleCheckIn();
    resetInactivity();
  };

  const handleCheckInLost = async () => {
    await submitCheckIn(false);
    setUIPhase("running");
    scheduleCheckIn();
  };

  const handleExtend = async () => {
    await extendTimer(5 * 60); // extend 5 min
    if (session && session.struggleCount + 1 >= 2) {
      setUIPhase("struggle");
    } else {
      setUIPhase("running");
    }
  };

  const handleComplete = () => {
    setUIPhase("completing");
  };

  const handleCompletionSubmit = async (effortRating: number, note: string) => {
    await closeSession({ status: "completed", effortRating, note });
    setUIPhase("done");
  };

  const handleSkipConfirm = async (reason: string) => {
    await closeSession({ status: "skipped", reason });
    setUIPhase("done");
  };

  const elapsedSec = session?.elapsedSeconds ?? 0;
  const plannedSec = session?.plannedDurationSeconds ?? plannedMins * 60;

  // Idle state — show start screen
  if (uiPhase === "idle" || (!session && !loading)) {
    return (
      <div style={fullScreenStyles}>
        <div style={centerPanelStyles}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#f4f4f5", margin: "0 0 8px 0" }}>
            {habitName}
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 32px 0" }}>
            {plannedMins} minute session · Focus mode
          </p>

          {loading ? (
            <HorseLoader size="md" label="Checking session state..." />
          ) : (
            <button
              onClick={handleStart}
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                border: "none",
                color: "#000",
                fontSize: "17px",
                fontWeight: 800,
                padding: "18px 48px",
                borderRadius: "18px",
                cursor: "pointer",
                letterSpacing: "0.03em",
                boxShadow: "0 8px 32px rgba(34,197,94,0.35)",
              }}
            >
              Start Session
            </button>
          )}

          <button
            onClick={() => router.back()}
            style={{
              marginTop: "20px",
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.25)",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Done state
  if (uiPhase === "done") {
    return (
      <div style={fullScreenStyles}>
        <div style={centerPanelStyles}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#22c55e", margin: "0 0 10px 0" }}>
            Session Logged
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", margin: "0 0 32px 0" }}>
            Your progress has been recorded automatically.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#f4f4f5",
              fontSize: "14px",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: "14px",
              cursor: "pointer",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Running state
  return (
    <div style={fullScreenStyles} onClick={resetInactivity}>
      {/* Overlays */}
      {uiPhase === "checkin" && (
        <CheckInOverlay onConfirm={handleCheckInConfirm} onNotFocused={handleCheckInLost} />
      )}
      {uiPhase === "struggle" && (
        <StruggleOverlay
          onContinue={() => setUIPhase("running")}
          onSkip={() => setUIPhase("skipping")}
          onBreakDown={() => router.push(`/strategic`)}
        />
      )}
      {uiPhase === "completing" && (
        <CompletionOverlay onSubmit={handleCompletionSubmit} />
      )}
      {uiPhase === "skipping" && (
        <SkipModal
          type="skip"
          onConfirm={handleSkipConfirm}
          onCancel={() => setUIPhase("running")}
        />
      )}

      {/* Main focus UI */}
      <div style={centerPanelStyles}>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "12px", letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase" }}>
          Focus Mode
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#f4f4f5", margin: "0 0 40px 0", textAlign: "center" }}>
          {habitName}
        </h1>

        <SessionTimer
          plannedSeconds={plannedSec}
          elapsedSeconds={elapsedSec}
          mode="countdown"
          running={uiPhase === "running"}
          onExpire={handleComplete}
        />

        {/* Struggle counter badge */}
        {(session?.struggleCount ?? 0) > 0 && (
          <div style={{ marginTop: "16px", fontSize: "12px", color: "#f59e0b" }}>
            Extended {session?.struggleCount}x
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
          <button
            onClick={handleComplete}
            style={{
              background: "#22c55e",
              border: "none",
              color: "#000",
              fontSize: "14px",
              fontWeight: 800,
              padding: "14px 24px",
              borderRadius: "14px",
              cursor: "pointer",
            }}
          >
            Done
          </button>
          <button
            onClick={handleExtend}
            style={{
              background: "rgba(245,158,11,0.15)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "#f59e0b",
              fontSize: "14px",
              fontWeight: 700,
              padding: "14px 20px",
              borderRadius: "14px",
              cursor: "pointer",
            }}
          >
            +5 min
          </button>
          <button
            onClick={() => setUIPhase("skipping")}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.3)",
              fontSize: "13px",
              fontWeight: 600,
              padding: "14px 16px",
              borderRadius: "14px",
              cursor: "pointer",
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

const fullScreenStyles: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a0a0c 0%, #111318 50%, #0d1410 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px",
};

const centerPanelStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  maxWidth: "480px",
  width: "100%",
};
