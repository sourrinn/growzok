"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Session } from "@/types/session";

// ─── Types ─────────────────────────────────────────────────────────────────

interface OpenSessionParams {
  habitId: string;
  habitName: string;
  plannedMins?: number;
  blockId?: string;
  timerMode?: "countdown" | "countup";
}

interface SessionContextValue {
  /** Currently active or just-completed session */
  activeSession: Session | null;
  /** Whether the focus overlay is open */
  isOverlayOpen: boolean;
  /** Whether we are loading the current session from the API */
  sessionLoading: boolean;
  /** Open the session overlay for a habit (starts a new session or resumes existing) */
  openSession: (params: OpenSessionParams) => void;
  /** Close/dismiss the overlay (does NOT close the session — session still runs) */
  closeOverlay: () => void;
  /** Re-open the overlay for a running session */
  resumeOverlay: () => void;
  /** Internal: called by SessionOverlay when a session fully closes */
  onSessionClosed: (session: Session) => void;
  /** The params of the currently opened/opening session */
  pendingParams: OpenSessionParams | null;
  /** Refresh the active session from API */
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [pendingParams, setPendingParams] = useState<OpenSessionParams | null>(null);

  // Fetch running session on mount
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        const s = data.session ?? null;
        setActiveSession(s);
        // If there's a running session and we have no pendingParams, set them from session
        if (s?.status === "in_progress" && !pendingParams) {
          setPendingParams({
            habitId: s.habitId,
            habitName: "(resumed)",
            plannedMins: Math.round(s.plannedDurationSeconds / 60),
            blockId: s.blockId,
          });
        }
      }
    } catch {
      // silent
    } finally {
      setSessionLoading(false);
    }
  }, [pendingParams]);

  useEffect(() => {
    refreshSession();
    // Poll every 60s to keep banner in sync across tabs
    const t = setInterval(refreshSession, 60_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openSession = useCallback((params: OpenSessionParams) => {
    setPendingParams(params);
    setIsOverlayOpen(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setIsOverlayOpen(false);
  }, []);

  const resumeOverlay = useCallback(() => {
    setIsOverlayOpen(true);
  }, []);

  const onSessionClosed = useCallback((session: Session) => {
    setActiveSession(session);
    setIsOverlayOpen(false);
    // Clear params so banner re-check works correctly
    if (session.status !== "in_progress") {
      setPendingParams(null);
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{
        activeSession,
        isOverlayOpen,
        sessionLoading,
        openSession,
        closeOverlay,
        resumeOverlay,
        onSessionClosed,
        pendingParams,
        refreshSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useSessionContext(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSessionContext must be used inside SessionProvider");
  return ctx;
}
