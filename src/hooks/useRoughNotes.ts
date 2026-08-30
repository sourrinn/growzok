"use client";

import { useCallback, useEffect, useState } from "react";
import type { Note, NoteStatus } from "@/types/note";

interface UseNotesOptions {
  status?: NoteStatus;
  search?: string;
  tag?: string;
}

export function useNotes(options: UseNotesOptions = {}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { status = "active", search, tag } = options;

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      if (tag) params.set("tag", tag);

      const res = await fetch(`/api/notes?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load notes");
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (err: any) {
      setError(err.message || "Error fetching notes");
    } finally {
      setLoading(false);
    }
  }, [status, search, tag]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (
    content: string,
    title?: string,
    tags?: string[]
  ): Promise<Note | null> => {
    if (!content.trim()) return null;
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title, tags }),
      });
      if (!res.ok) throw new Error("Failed to create note");
      const data = await res.json();
      const newNote: Note = data.note;
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateNoteContent = async (
    id: string,
    content: string,
    title?: string,
    tags?: string[]
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title, tags }),
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

  const togglePin = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "togglePin" }),
      });
      if (!res.ok) throw new Error("Failed to toggle pin");
      const data = await res.json();
      setNotes((prev) =>
        prev
          .map((n) => (n.id === id ? data.note : n))
          .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
      );
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateStatus = async (id: string, newStatus: NoteStatus): Promise<boolean> => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
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
    togglePin,
    updateStatus,
    deleteNote,
  };
}

// Alias for backward compatibility
export const useRoughNotes = useNotes;
