"use client";

import { useCallback, useEffect, useState } from "react";
import type { Insight, ReflectionNote, DailySummary } from "@/types/reflection";

interface UseReflectionReturn {
  reflection: ReflectionNote | null;
  insights: Insight[];
  dailySummary: DailySummary | null;
  loading: boolean;
  error: string | null;
  saveReflection: (fields: {
    whatWorked?: string;
    whatDidnt?: string;
    tomorrowChange?: string;
    moodRating?: number;
    energyRating?: number;
  }) => Promise<void>;
  generateInsights: () => Promise<void>;
  applyInsight: (insightId: string) => Promise<void>;
  dismissInsight: (insightId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useReflection(date: string): UseReflectionReturn {
  const [reflection, setReflection] = useState<ReflectionNote | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [refRes, insRes, logRes] = await Promise.all([
        fetch(`/api/reflections/${date}`),
        fetch("/api/insights"),
        fetch(`/api/execution-logs?date=${date}`),
      ]);

      if (refRes.ok) {
        const d = await refRes.json();
        setReflection(d.reflection ?? null);
      }
      if (insRes.ok) {
        const d = await insRes.json();
        setInsights(d.insights ?? []);
      }
      if (logRes.ok) {
        const d = await logRes.json();
        setDailySummary(d.dailySummary ?? null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const saveReflection = useCallback(
    async (fields: {
      whatWorked?: string;
      whatDidnt?: string;
      tomorrowChange?: string;
      moodRating?: number;
      energyRating?: number;
    }) => {
      const res = await fetch(`/api/reflections/${date}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error("Failed to save reflection");
      const data = await res.json();
      setReflection(data.reflection);
    },
    [date]
  );

  const generateInsights = useCallback(async () => {
    const res = await fetch("/api/insights/generate", { method: "POST" });
    if (!res.ok) throw new Error("Failed to generate insights");
    const data = await res.json();
    setInsights((prev) => [...data.insights, ...prev]);
  }, []);

  const applyInsight = useCallback(async (insightId: string) => {
    const res = await fetch(`/api/insights/${insightId}/apply`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to apply insight");
    setInsights((prev) =>
      prev.map((i) =>
        i.id === insightId
          ? { ...i, appliedAt: new Date().toISOString() }
          : i
      )
    );
  }, []);

  const dismissInsight = useCallback(async (insightId: string) => {
    const res = await fetch(`/api/insights/${insightId}/dismiss`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to dismiss insight");
    setInsights((prev) => prev.filter((i) => i.id !== insightId));
  }, []);

  return {
    reflection,
    insights,
    dailySummary,
    loading,
    error,
    saveReflection,
    generateInsights,
    applyInsight,
    dismissInsight,
    refresh: fetchAll,
  };
}
