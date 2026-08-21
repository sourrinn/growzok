"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@/types/session";

interface UseSessionReturn {
  session: Session | null;
  loading: boolean;
  error: string | null;
  startSession: (params: {
    habitId: string;
    blockId?: string;
    timerMode?: "countdown" | "countup";
    plannedDurationSeconds: number;
  }) => Promise<void>;
  submitCheckIn: (confirmed: boolean) => Promise<void>;
  extendTimer: (extraSeconds: number) => Promise<void>;
  closeSession: (params: {
    status: "completed" | "skipped" | "interrupted";
    reason?: string;
    effortRating?: number;
    note?: string;
  }) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchActive = useCallback(async () => {
    try {
      const res = await fetch("/api/sessions");
      if (!res.ok) throw new Error("Failed to fetch session");
      const data = await res.json();
      setSession(data.session ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActive();
    // Poll every 30s to keep session state fresh across tabs
    pollRef.current = setInterval(fetchActive, 30_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchActive]);

  const startSession = useCallback(
    async ({
      habitId,
      blockId,
      timerMode = "countdown",
      plannedDurationSeconds,
    }: {
      habitId: string;
      blockId?: string;
      timerMode?: "countdown" | "countup";
      plannedDurationSeconds: number;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ habitId, blockId, timerMode, plannedDurationSeconds }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to start session");
        }
        const data = await res.json();
        setSession(data.session);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const submitCheckIn = useCallback(
    async (confirmed: boolean) => {
      if (!session) return;
      try {
        const res = await fetch(`/api/sessions/${session.id}/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmed }),
        });
        if (!res.ok) throw new Error("Check-in failed");
        const data = await res.json();
        setSession(data.session);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    },
    [session]
  );

  const extendTimer = useCallback(
    async (extraSeconds: number) => {
      if (!session) return;
      try {
        const res = await fetch(`/api/sessions/${session.id}/extend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ extraSeconds }),
        });
        if (!res.ok) throw new Error("Extend failed");
        const data = await res.json();
        setSession(data.session);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    },
    [session]
  );

  const closeSession = useCallback(
    async ({
      status,
      reason,
      effortRating,
      note,
    }: {
      status: "completed" | "skipped" | "interrupted";
      reason?: string;
      effortRating?: number;
      note?: string;
    }) => {
      if (!session) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/sessions/${session.id}/close`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, reason, effortRating, note }),
        });
        if (!res.ok) throw new Error("Close failed");
        const data = await res.json();
        setSession(data.session);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  return {
    session,
    loading,
    error,
    startSession,
    submitCheckIn,
    extendTimer,
    closeSession,
    refresh: fetchActive,
  };
}
