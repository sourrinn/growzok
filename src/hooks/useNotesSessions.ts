"use client";

import { useCallback, useEffect, useState } from "react";
import type { CanvasNode, NoteSession } from "@/types/note";

export function useNotesSessions() {
  const [sessions, setSessions] = useState<NoteSession[]>([]);
  const [activeSession, setActiveSession] = useState<NoteSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/notes/sessions?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      const list: NoteSession[] = data.sessions || [];
      setSessions(list);

      // Default active session to first available or keep current active
      if (list.length > 0) {
        setActiveSession((curr) => {
          if (!curr) return list[0];
          const found = list.find((s) => s.id === curr.id);
          return found || list[0];
        });
      } else {
        setActiveSession(null);
      }
    } catch (err: any) {
      setError(err.message || "Error fetching sessions");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Create session
  const createNewSession = async (title?: string, initialContent?: string): Promise<NoteSession | null> => {
    try {
      const res = await fetch("/api/notes/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, initialContent }),
      });
      if (!res.ok) throw new Error("Failed to create session");
      const data = await res.json();
      const newSess: NoteSession = data.session;
      setSessions((prev) => [newSess, ...prev]);
      setActiveSession(newSess);
      return newSess;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Toggle Pin session
  const togglePinSession = async (id: string): Promise<boolean> => {
    const sess = sessions.find((s) => s.id === id);
    if (!sess) return false;
    try {
      const res = await fetch(`/api/notes/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !sess.isPinned }),
      });
      if (!res.ok) throw new Error("Failed to toggle pin");
      const data = await res.json();
      const updated: NoteSession = data.session;
      setSessions((prev) =>
        prev
          .map((s) => (s.id === id ? updated : s))
          .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
      );
      if (activeSession?.id === id) setActiveSession(updated);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Delete session
  const deleteSession = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/notes/sessions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete session");
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSession?.id === id) {
        const remaining = sessions.filter((s) => s.id !== id);
        setActiveSession(remaining[0] || null);
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Add Node to active session
  const addNode = async (
    nodeData: Omit<CanvasNode, "id" | "createdAt" | "updatedAt">
  ): Promise<boolean> => {
    if (!activeSession) return false;
    try {
      const res = await fetch(`/api/notes/sessions/${activeSession.id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nodeData),
      });
      if (!res.ok) throw new Error("Failed to add node");
      const data = await res.json();
      const updated: NoteSession = data.session;
      setActiveSession(updated);
      setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Update Node in active session
  const updateNode = async (
    nodeId: string,
    patch: Partial<Omit<CanvasNode, "id" | "createdAt" | "updatedAt">>
  ): Promise<boolean> => {
    if (!activeSession) return false;
    try {
      const res = await fetch(`/api/notes/sessions/${activeSession.id}/nodes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId, ...patch }),
      });
      if (!res.ok) throw new Error("Failed to update node");
      const data = await res.json();
      const updated: NoteSession = data.session;
      setActiveSession(updated);
      setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Delete Node from active session
  const deleteNode = async (nodeId: string): Promise<boolean> => {
    if (!activeSession) return false;
    try {
      const res = await fetch(
        `/api/notes/sessions/${activeSession.id}/nodes?nodeId=${nodeId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete node");
      const data = await res.json();
      const updated: NoteSession = data.session;
      setActiveSession(updated);
      setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Add Connector between nodes
  const addConnector = async (
    fromNodeId: string,
    toNodeId: string,
    label?: string
  ): Promise<boolean> => {
    if (!activeSession) return false;
    try {
      const res = await fetch(`/api/notes/sessions/${activeSession.id}/connectors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromNodeId, toNodeId, label }),
      });
      if (!res.ok) throw new Error("Failed to add connector");
      const data = await res.json();
      const updated: NoteSession = data.session;
      setActiveSession(updated);
      setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Delete Connector
  const deleteConnector = async (connectorId: string): Promise<boolean> => {
    if (!activeSession) return false;
    try {
      const res = await fetch(
        `/api/notes/sessions/${activeSession.id}/connectors?connectorId=${connectorId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete connector");
      const data = await res.json();
      const updated: NoteSession = data.session;
      setActiveSession(updated);
      setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    sessions,
    activeSession,
    setActiveSession,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    createNewSession,
    togglePinSession,
    deleteSession,
    addNode,
    updateNode,
    deleteNode,
    addConnector,
    deleteConnector,
    refreshSessions: fetchSessions,
  };
}
