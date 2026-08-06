"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  Habit,
  HabitCategory,
  HabitDomain,
  HabitFrequency,
  HabitTarget,
} from "@/types/habit";
import { todayStr } from "@/lib/dates";
import type { TemplateHabitOverride } from "@/types/template";

export interface NewHabitInput {
  name: string;
  category: HabitCategory;
  domain: HabitDomain;
  userLabel: string;
  frequency: HabitFrequency;
  target?: HabitTarget | null;
  missAllowance?: number;
}

interface UseHabits {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  addHabit: (input: NewHabitInput) => Promise<void>;
  addFromTemplate: (items: TemplateHabitOverride[], templateKey?: string) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  logProgress: (id: string, value: number) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

/** Session expired or missing → send the user to the login page. */
function redirectToLogin() {
  if (typeof window !== "undefined") window.location.href = "/login";
}

export function useHabits(): UseHabits {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/habits", { cache: "no-store" });
      if (res.status === 401) {
        setHabits([]);
        return redirectToLogin();
      }
      if (!res.ok) throw new Error("load");
      const data = await res.json();
      setHabits(data.habits as Habit[]);
      setError(null);
    } catch {
      setError("Couldn't load your habits. Check your database connection and refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addHabit = useCallback(async (input: NewHabitInput) => {
    const trimmed = input.name.trim();
    if (!trimmed) return;
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          category: input.category,
          domain: input.domain,
          userLabel: input.userLabel,
          frequency: input.frequency,
          target: input.target ?? null,
          missAllowance: input.missAllowance ?? 0,
        }),
      });
      if (res.status === 401) {
        setHabits([]);
        return redirectToLogin();
      }
      if (!res.ok) throw new Error("add");
      const data = await res.json();
      setHabits((prev) => [...prev, data.habit as Habit]);
      setError(null);
    } catch {
      setError("Couldn't add that habit. Try again.");
    }
  }, []);

  /**
   * Bulk-create from a customized list of TemplateHabitOverride items.
   */
  const addFromTemplate = useCallback(async (items: TemplateHabitOverride[], templateKey?: string) => {
    if (items.length === 0) return;
    try {
      const res = await fetch("/api/habits/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habits: items, templateKey }),
      });
      if (res.status === 401) {
        setHabits([]);
        return redirectToLogin();
      }
      if (!res.ok) throw new Error("bulk");
      const data = await res.json();
      setHabits((prev) => [...prev, ...(data.habits as Habit[])]);
      setError(null);
    } catch {
      setError("Couldn't add that template. Try again.");
    }
  }, []);

  const toggleHabit = useCallback(
    async (id: string) => {
      const date = todayStr();
      setHabits((prev) =>
        prev.map((h) =>
          h.id === id
            ? {
                ...h,
                history: h.history.includes(date)
                  ? h.history.filter((d) => d !== date)
                  : [...h.history, date],
              }
            : h
        )
      );
      try {
        const res = await fetch(`/api/habits/${id}/toggle`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date }),
        });
        if (res.status === 401) {
          setHabits([]);
          return redirectToLogin();
        }
        if (!res.ok) throw new Error("toggle");
        const data = await res.json();
        const updated = data.habit as Habit;
        setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
      } catch {
        setError("Couldn't save that change. Refreshing…");
        refresh();
      }
    },
    [refresh]
  );

  const logProgress = useCallback(
    async (id: string, value: number) => {
      const date = todayStr();
      try {
        const res = await fetch(`/api/habits/${id}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, value }),
        });
        if (res.status === 401) {
          setHabits([]);
          return redirectToLogin();
        }
        if (!res.ok) throw new Error("progress");
        const data = await res.json();
        const updated = data.habit as Habit;
        setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
        setError(null);
      } catch {
        setError("Couldn't save that value. Refreshing…");
        refresh();
      }
    },
    [refresh]
  );

  const deleteHabit = useCallback(
    async (id: string) => {
      const snapshot = habits;
      setHabits((prev) => prev.filter((h) => h.id !== id));
      try {
        const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });
        if (res.status === 401) {
          setHabits([]);
          return redirectToLogin();
        }
        if (!res.ok) throw new Error("delete");
      } catch {
        setError("Couldn't delete that habit.");
        setHabits(snapshot);
      }
    },
    [habits]
  );

  return {
    habits,
    loading,
    error,
    addHabit,
    addFromTemplate,
    toggleHabit,
    logProgress,
    deleteHabit,
  };
}
