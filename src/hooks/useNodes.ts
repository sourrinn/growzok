"use client";

import { useCallback, useEffect, useState } from "react";
import type { Node, NodeKind, NodeStatus } from "@/types/node";

interface UseNodesReturn {
  nodes: Node[];
  loading: boolean;
  error: string | null;
  createNode: (data: {
    title: string;
    description?: string;
    kind: NodeKind;
    priority?: number;
    decompositionSteps?: string[];
    linkedHabitIds?: string[];
  }) => Promise<void>;
  updateNode: (
    id: string,
    patch: {
      title?: string;
      description?: string;
      status?: NodeStatus;
      priority?: number;
      decompositionSteps?: string[];
      linkedHabitIds?: string[];
    }
  ) => Promise<void>;
  archiveNode: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNodes(filterStatus?: NodeStatus): UseNodesReturn {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNodes = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterStatus
        ? `/api/nodes?status=${filterStatus}`
        : "/api/nodes";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load nodes");
      const data = await res.json();
      setNodes(data.nodes ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  const createNode = useCallback(
    async (data: {
      title: string;
      description?: string;
      kind: NodeKind;
      priority?: number;
      decompositionSteps?: string[];
      linkedHabitIds?: string[];
    }) => {
      const res = await fetch("/api/nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to create node");
      }
      await fetchNodes();
    },
    [fetchNodes]
  );

  const updateNode = useCallback(
    async (id: string, patch: Record<string, unknown>) => {
      const res = await fetch(`/api/nodes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to update node");
      }
      await fetchNodes();
    },
    [fetchNodes]
  );

  const archiveNode = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/nodes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to archive node");
      await fetchNodes();
    },
    [fetchNodes]
  );

  return {
    nodes,
    loading,
    error,
    createNode,
    updateNode,
    archiveNode,
    refresh: fetchNodes,
  };
}
