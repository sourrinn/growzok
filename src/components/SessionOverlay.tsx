"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSessionContext } from "@/contexts/SessionContext";
import { SessionTimer } from "@/components/SessionTimer";
import { HorseLoader } from "@/components/HorseLoader";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SKIP_REASONS = [
  "Not feeling well",
  "Ran out of time",
  "Too tired",
  "Something came up",
  "Habit no longer fits",
];

type UIPhase = "idle" | "running" | "checkin" | "struggle" | "completing" | "done" | "skipping";

// ─── Effort Stars ─────────────────────────────────────────────────────────────

function EffortStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            fontSize: "30px",
            background: "none",
            border: "none",
            cursor: "pointer",
            opacity: n <= value ? 1 : 0.2,
            transition: "all 0.15s",
            transform: n <= value ? "scale(1.18)" : "scale(1)",
          }}
        >⭐</button>
      ))}
    </div>
  );
}

// ─── Overlay base ─────────────────────────────────────────────────────────────

function Modal({ children, tight }: { children: React.ReactNode; tight?: boolean }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(12px)",
      zIndex: 200,
      display: "flex",
      alignItems: tight ? "flex-end" : "center",
      justifyContent: "center",
      padding: tight ? "0" : "32px",
    }}>
      <div style={{
        background: "rgba(15,15,18,0.98)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: tight ? "24px 24px 0 0" : "24px",
        padding: "32px",
        maxWidth: "440px",
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Check-In ────────────────────────────────────────────────────────────────

function CheckInModal({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <Modal tight>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>🎯</div>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#f4f4f5", margin: "0 0 8px" }}>Still focused?</h3>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 24px" }}>
          Tap to confirm you&apos;re still on task.
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onYes} style={btnStyle("#22c55e", "#000")}>Yes, still focused</button>
          <button onClick={onNo} style={btnStyle("rgba(255,255,255,0.06)", "rgba(255,255,255,0.6)", "1px solid rgba(255,255,255,0.12)")}>
            Lost focus
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Struggle ────────────────────────────────────────────────────────────────

function StruggleModal({ onContinue, onSkip }: { onContinue: () => void; onSkip: () => void }) {
  return (
    <Modal>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>🤔</div>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#f59e0b", margin: "0 0 8px" }}>
          Looks like this is tough
        </h3>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 24px" }}>
          You&apos;ve extended the timer multiple times. Is this the right moment for this habit?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={onContinue} style={btnStyle("rgba(255,255,255,0.06)", "rgba(255,255,255,0.6)", "1px solid rgba(255,255,255,0.1)")}>
            Push through
          </button>
          <button onClick={onSkip} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "13px", padding: "10px", cursor: "pointer" }}>
            Skip for now
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Completion ───────────────────────────────────────────────────────────────

function CompletionModal({ onSubmit }: { onSubmit: (effort: number, note: string) => void }) {
  const [effort, setEffort] = useState(3);
  const [note, setNote] = useState("");
  return (
    <Modal>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "58px", marginBottom: "8px" }}>🏆</div>
        <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#22c55e", margin: "0 0 6px" }}>Done!</h3>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: "0 0 24px" }}>
          How hard was it?
        </p>
        <div style={{ marginBottom: "20px" }}><EffortStars value={effort} onChange={setEffort} /></div>
        <textarea
          placeholder="Quick note (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 280))}
          rows={3}
          style={{
            width: "100%", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
            padding: "12px 14px", color: "#f4f4f5", fontSize: "13px",
            resize: "none", outline: "none", fontFamily: "inherit",
            marginBottom: "20px", boxSizing: "border-box",
          }}
        />
        <button onClick={() => onSubmit(effort, note)} style={btnStyle("#22c55e", "#000", undefined, "100%")}>
          Save & Close
        </button>
      </div>
    </Modal>
  );
}

// ─── Skip Modal ───────────────────────────────────────────────────────────────

function SkipModal({ onConfirm, onCancel }: { onConfirm: (r: string) => void; onCancel: () => void }) {
  const [reason, setReason] = useState("");
  return (
    <Modal tight>
      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f4f4f5", margin: "0 0 6px" }}>Skip Session</h3>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: "0 0 16px" }}>What happened?</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "14px" }}>
        {SKIP_REASONS.map((r) => (
          <button key={r} onClick={() => setReason(r)} style={{
            fontSize: "12px", fontWeight: 600, padding: "6px 12px", borderRadius: "8px", cursor: "pointer",
            background: reason === r ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)",
            border: reason === r ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.08)",
            color: reason === r ? "#ef4444" : "rgba(255,255,255,0.5)",
          }}>{r}</button>
        ))}
      </div>
      <input
        placeholder="Or describe..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={{
          width: "100%", background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
          padding: "10px 12px", color: "#f4f4f5", fontSize: "13px",
          outline: "none", fontFamily: "inherit", marginBottom: "14px", boxSizing: "border-box",
        }}
      />
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => onConfirm(reason || "No reason given")} style={btnStyle("#ef4444", "#fff", undefined, undefined)}>Skip</button>
        <button onClick={onCancel} style={btnStyle("rgba(255,255,255,0.06)", "rgba(255,255,255,0.5)", "1px solid rgba(255,255,255,0.1)")}>Cancel</button>
      </div>
    </Modal>
  );
}

// ─── Main Session Overlay ─────────────────────────────────────────────────────

export function SessionOverlay() {
  const {
    activeSession,
    isOverlayOpen,
    closeOverlay,
    onSessionClosed,
    pendingParams,
    refreshSession,
  } = useSessionContext();

  const [uiPhase, setUIPhase] = useState<UIPhase>("idle");
  const [localSession, setLocalSession] = useState(activeSession);
  const checkInRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local session from context
  useEffect(() => {
    setLocalSession(activeSession);
    if (activeSession?.status === "in_progress") setUIPhase("running");
    else if (!activeSession) setUIPhase("idle");
  }, [activeSession]);

  const scheduleCheckIn = useCallback(() => {
    if (checkInRef.current) clearTimeout(checkInRef.current);
    checkInRef.current = setTimeout(() => {
      setUIPhase((p) => (p === "running" ? "checkin" : p));
    }, 8 * 60 * 1000);
  }, []);

  useEffect(() => {
    return () => { if (checkInRef.current) clearTimeout(checkInRef.current); };
  }, []);

  // ── API calls ──────────────────────────────────────────────────────────────

  const apiPost = useCallback(async (url: string, body?: object) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, []);

  const handleStart = useCallback(async () => {
    if (!pendingParams) return;
    try {
      const data = await apiPost("/api/sessions", {
        habitId: pendingParams.habitId,
        blockId: pendingParams.blockId,
        timerMode: pendingParams.timerMode ?? "countdown",
        plannedDurationSeconds: (pendingParams.plannedMins ?? 25) * 60,
      });
      setLocalSession(data.session);
      setUIPhase("running");
      scheduleCheckIn();
    } catch {
      // If 409 conflict, a session is already running — refresh and show it
      await refreshSession();
      setUIPhase("running");
    }
  }, [pendingParams, apiPost, scheduleCheckIn, refreshSession]);

  const handleCheckInYes = useCallback(async () => {
    if (!localSession) return;
    await apiPost(`/api/sessions/${localSession.id}/checkin`, { confirmed: true });
    setUIPhase("running");
    scheduleCheckIn();
  }, [localSession, apiPost, scheduleCheckIn]);

  const handleCheckInNo = useCallback(async () => {
    if (!localSession) return;
    await apiPost(`/api/sessions/${localSession.id}/checkin`, { confirmed: false });
    setUIPhase("running");
    scheduleCheckIn();
  }, [localSession, apiPost, scheduleCheckIn]);

  const handleExtend = useCallback(async () => {
    if (!localSession) return;
    const data = await apiPost(`/api/sessions/${localSession.id}/extend`, { extraSeconds: 300 });
    setLocalSession(data.session);
    const newCount = (localSession.struggleCount ?? 0) + 1;
    if (newCount >= 2) setUIPhase("struggle");
    else { setUIPhase("running"); scheduleCheckIn(); }
  }, [localSession, apiPost, scheduleCheckIn]);

  const handleClose = useCallback(async (
    status: "completed" | "skipped" | "interrupted",
    opts?: { reason?: string; effortRating?: number; note?: string }
  ) => {
    if (!localSession) return;
    const data = await apiPost(`/api/sessions/${localSession.id}/close`, { status, ...opts });
    setLocalSession(data.session);
    onSessionClosed(data.session);
    setUIPhase("done");
    // Auto-dismiss after 2s on done
    setTimeout(() => {
      setUIPhase("idle");
    }, 2000);
  }, [localSession, apiPost, onSessionClosed]);

  // ── If overlay is closed, render nothing ──────────────────────────────────

  if (!isOverlayOpen) return null;

  const params = pendingParams;
  const habitName = params?.habitName ?? localSession?.habitId ?? "Habit";
  const plannedSec = localSession?.plannedDurationSeconds ?? (params?.plannedMins ?? 25) * 60;
  const elapsedSec = localSession?.elapsedSeconds ?? 0;

  // ── Idle / Start screen ────────────────────────────────────────────────────

  if (uiPhase === "idle" || (!localSession && uiPhase !== "done")) {
    return (
      <div style={fullScreenStyle}>
        <button onClick={closeOverlay} style={closeBtnStyle}>✕</button>
        <div style={centerStyle}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>🎯</div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#f4f4f5", margin: "0 0 8px", textAlign: "center" }}>
            {habitName}
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 40px", textAlign: "center" }}>
            {params?.plannedMins ?? 25} minute focus session
          </p>
          <button onClick={handleStart} style={btnStyle(
            "linear-gradient(135deg, #22c55e, #16a34a)", "#000", "none", "auto",
            "0 8px 32px rgba(34,197,94,0.35)"
          )}>
            Start Session
          </button>
          <button onClick={closeOverlay} style={{ marginTop: "16px", background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: "13px", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Done screen ────────────────────────────────────────────────────────────

  if (uiPhase === "done") {
    return (
      <div style={fullScreenStyle}>
        <div style={centerStyle}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#22c55e", margin: "0 0 8px", textAlign: "center" }}>
            Session Logged
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
            Tracked automatically. Closing…
          </p>
        </div>
      </div>
    );
  }

  // ── Running / focus screen ─────────────────────────────────────────────────

  return (
    <div style={fullScreenStyle}>
      <button onClick={closeOverlay} style={closeBtnStyle} title="Minimize (session keeps running)">
        ↓ Minimize
      </button>

      {/* Overlays */}
      {uiPhase === "checkin" && (
        <CheckInModal onYes={handleCheckInYes} onNo={handleCheckInNo} />
      )}
      {uiPhase === "struggle" && (
        <StruggleModal onContinue={() => { setUIPhase("running"); scheduleCheckIn(); }} onSkip={() => setUIPhase("skipping")} />
      )}
      {uiPhase === "completing" && (
        <CompletionModal onSubmit={(effort, note) => handleClose("completed", { effortRating: effort, note })} />
      )}
      {uiPhase === "skipping" && (
        <SkipModal onConfirm={(r) => handleClose("skipped", { reason: r })} onCancel={() => setUIPhase("running")} />
      )}

      {/* Main focus UI */}
      <div style={centerStyle}>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
          Focus Mode
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#f4f4f5", margin: "0 0 40px", textAlign: "center" }}>
          {habitName}
        </h1>

        <SessionTimer
          plannedSeconds={plannedSec}
          elapsedSeconds={elapsedSec}
          mode="countdown"
          running={uiPhase === "running"}
          onExpire={() => setUIPhase("completing")}
        />

        {(localSession?.struggleCount ?? 0) > 0 && (
          <div style={{ marginTop: "12px", fontSize: "12px", color: "#f59e0b", textAlign: "center" }}>
            Extended {localSession!.struggleCount}×
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
          <button onClick={() => setUIPhase("completing")} style={btnStyle("#22c55e", "#000")}>Done</button>
          <button onClick={handleExtend} style={btnStyle("rgba(245,158,11,0.15)", "#f59e0b", "1px solid rgba(245,158,11,0.3)")}>+5 min</button>
          <button onClick={() => setUIPhase("skipping")} style={btnStyle("rgba(255,255,255,0.05)", "rgba(255,255,255,0.3)", "1px solid rgba(255,255,255,0.08)")}>Skip</button>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const fullScreenStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "linear-gradient(135deg, #08080a 0%, #0f1113 50%, #080e0b 100%)",
  zIndex: 150,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px",
};

const centerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "480px",
  width: "100%",
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "20px",
  right: "24px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.45)",
  fontSize: "13px",
  fontWeight: 600,
  padding: "8px 14px",
  borderRadius: "10px",
  cursor: "pointer",
};

function btnStyle(
  bg: string,
  color: string,
  border?: string,
  width?: string,
  boxShadow?: string
): React.CSSProperties {
  return {
    background: bg,
    border: border ?? "none",
    color,
    fontSize: "14px",
    fontWeight: 800,
    padding: "14px 24px",
    borderRadius: "14px",
    cursor: "pointer",
    width,
    boxShadow,
    letterSpacing: "0.02em",
  };
}
