"use client";

import { useCallback, useEffect, useState } from "react";
import type { Timeline, Block } from "@/types/timeline";

interface UseTimelineReturn {
  timeline: Timeline | null;
  loading: boolean;
  error: string | null;
  addBlock: (data: {
    name: string;
    startMinute: number;
    durationMinutes: number;
    energyZone: "peak" | "trough" | "recovery";
    habitIds?: string[];
    isRestBlock?: boolean;
  }) => Promise<void>;
  updateBlock: (blockId: string, patch: Partial<Block>) => Promise<void>;
  deleteBlock: (blockId: string) => Promise<void>;
  updateStatus: (status: "draft" | "active" | "completed") => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTimeline(date: string): UseTimelineReturn {
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/timelines/${date}`);
      if (!res.ok) throw new Error("Failed to load timeline");
      const data = await res.json();
      setTimeline(data.timeline);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  const addBlock = useCallback(
    async (data: {
      name: string;
      startMinute: number;
      durationMinutes: number;
      energyZone: "peak" | "trough" | "recovery";
      habitIds?: string[];
      isRestBlock?: boolean;
    }) => {
      const res = await fetch(`/api/timelines/${date}/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add block");
      await fetchTimeline();
    },
    [date, fetchTimeline]
  );

  const updateBlock = useCallback(
    async (blockId: string, patch: Partial<Block>) => {
      const res = await fetch(`/api/timelines/${date}/blocks/${blockId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Failed to update block");
      await fetchTimeline();
    },
    [date, fetchTimeline]
  );

  const deleteBlock = useCallback(
    async (blockId: string) => {
      const res = await fetch(`/api/timelines/${date}/blocks/${blockId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete block");
      await fetchTimeline();
    },
    [date, fetchTimeline]
  );

  const updateStatus = useCallback(
    async (status: "draft" | "active" | "completed") => {
      const res = await fetch(`/api/timelines/${date}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update timeline status");
      await fetchTimeline();
    },
    [date, fetchTimeline]
  );

  return {
    timeline,
    loading,
    error,
    addBlock,
    updateBlock,
    deleteBlock,
    updateStatus,
    refresh: fetchTimeline,
  };
}
