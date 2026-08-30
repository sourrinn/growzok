"use client";

import { useState } from "react";
import { useRoughNotes } from "@/hooks/useRoughNotes";
import { HorseLoader } from "@/components/HorseLoader";

export function NotesClient() {
  const { notes, loading, addNote, updateNoteContent, updateStatus, deleteNote } = useRoughNotes();
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState<"all" | "raw" | "planned">("all");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    await addNote(newContent);
    setNewContent("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingText.trim()) return;
    await updateNoteContent(id, editingText);
    setEditingId(null);
  };

  const filteredNotes = notes.filter((n) => {
    if (filter === "raw") return n.status === "raw";
    if (filter === "planned") return n.status === "planned";
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#406852]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#406852] dark:bg-[#27272a] dark:text-[#a3b899] uppercase tracking-wider">
              Layer 1 · Cognitive Dump
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#232f26] dark:text-[#f4f4f5] mt-1">
            Rough Notes Scratchpad
          </h1>
          <p className="text-xs sm:text-sm text-[#737970] dark:text-[#a1a1aa] mt-0.5">
            Dump raw thoughts, mental friction, or unorganized ideas without cognitive load.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-[#e5e1d7] bg-white p-1 dark:border-[#27272a] dark:bg-[#18181b] shadow-xs">
          {(["all", "raw", "planned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-xs"
                  : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Dump Input Box */}
      <form onSubmit={handleAdd} className="rounded-2xl border border-[#e5e1d7] bg-white p-4 shadow-sm dark:border-[#27272a] dark:bg-[#18181b] space-y-3">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Dump a rough note, thought, or friction point... (Press Shift+Enter for line breaks)"
          rows={3}
          className="w-full resize-none bg-transparent text-sm text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
        />
        <div className="flex items-center justify-between border-t border-[#e5e1d7]/60 pt-3 dark:border-[#27272a]/60">
          <span className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">
            Zero formatting needed. Just capture it out of your head.
          </span>
          <button
            type="submit"
            disabled={!newContent.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-[#232f26] px-4 py-2 text-xs font-bold text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs hover:bg-black dark:hover:bg-white transition-all disabled:opacity-40"
          >
            <span>+ Dump Note</span>
          </button>
        </div>
      </form>

      {/* Notes Feed */}
      {loading ? (
        <HorseLoader size="md" label="Loading rough notes..." />
      ) : filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e5e1d7] bg-white p-12 text-center dark:border-[#27272a] dark:bg-[#18181b]">
          <span className="text-3xl mb-2 block">📝</span>
          <h3 className="font-bold text-base text-[#232f26] dark:text-[#f4f4f5]">
            No Rough Notes Yet
          </h3>
          <p className="text-xs text-[#737970] dark:text-[#a1a1aa] mt-1">
            Type anything above to dump thoughts out of working memory.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => {
            const isEditing = editingId === note.id;
            const isPlanned = note.status === "planned";

            return (
              <div
                key={note.id}
                className={`group flex flex-col gap-3 rounded-2xl border p-4 shadow-xs transition-all ${
                  isPlanned
                    ? "border-[#406852]/30 bg-[#e3ede6]/20 dark:border-[#27272a] dark:bg-[#18181b]/50"
                    : "border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] hover:border-[#232f26]/30"
                }`}
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 text-sm text-[#232f26] outline-none dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#f4f4f5]"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleSaveEdit(note.id)}
                        className="rounded-lg bg-[#232f26] px-3 py-1.5 text-xs font-bold text-white dark:bg-[#f4f4f5] dark:text-[#18181b]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border border-[#e5e1d7] px-3 py-1.5 text-xs font-medium text-[#737970] dark:border-[#27272a] dark:text-[#a1a1aa]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-[#232f26] dark:text-[#f4f4f5] whitespace-pre-wrap flex-1">
                        {note.content}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 capitalize ${
                          isPlanned
                            ? "bg-[#e3ede6] text-[#406852] dark:bg-[#27272a] dark:text-[#a3b899]"
                            : "bg-[#e5e1d7] text-[#737970] dark:bg-[#27272a] dark:text-[#a1a1aa]"
                        }`}
                      >
                        {note.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#e5e1d7]/40 pt-2.5 dark:border-[#27272a]/40 text-xs">
                      <span className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        {!isPlanned ? (
                          <button
                            onClick={() => updateStatus(note.id, "planned")}
                            className="flex items-center gap-1 rounded-lg bg-[#e3ede6] px-2.5 py-1 text-[11px] font-bold text-[#406852] hover:bg-[#406852] hover:text-white dark:bg-[#27272a] dark:text-[#a3b899] transition-all"
                            title="Mark ready for Layer 2 Rough Plan"
                          >
                            <span>➔ Send to Plan</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(note.id, "raw")}
                            className="text-[11px] text-[#737970] hover:underline dark:text-[#a1a1aa]"
                          >
                            Move back to Raw
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setEditingId(note.id);
                            setEditingText(note.content);
                          }}
                          className="text-[11px] font-medium text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-[11px] font-medium text-[#be5a38] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
