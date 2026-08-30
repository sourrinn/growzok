"use client";

import { useCallback, useEffect, useState } from "react";
import type { RoughNote, RoughNoteStatus } from "@/types/note";

export function useRoughNotes(statusFilter?: RoughNoteStatus) {
  const [notes, setNotes] = useState<RoughNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/api/notes?status=${statusFilter}` : "/api/notes";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load rough notes");
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (err: any) {
      setError(err.message || "Error fetching notes");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (content: string): Promise<RoughNote | null> => {
    if (!content.trim()) return null;
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to create note");
      const data = await res.json();
      const newNote: RoughNote = data.note;
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateNoteContent = async (id: string, content: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to update note");
      const data = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === id ? data.note : n)));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateStatus = async (id: string, status: RoughNoteStatus): Promise<boolean> => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === id ? data.note : n)));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteNote = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((n) => n.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    notes,
    loading,
    error,
    refreshNotes: fetchNotes,
    addNote,
    updateNoteContent,
    updateStatus,
    deleteNote,
  };
}
