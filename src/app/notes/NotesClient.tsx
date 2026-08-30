"use client";

import { useMemo, useState } from "react";
import { useNotes } from "@/hooks/useRoughNotes";
import { HorseLoader } from "@/components/HorseLoader";

export function NotesClient() {
  const [statusTab, setStatusTab] = useState<"active" | "archived">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { notes, loading, addNote, updateNoteContent, togglePin, updateStatus, deleteNote } = useNotes({
    status: statusTab,
    search: searchQuery,
    tag: selectedTag || undefined,
  });

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const parsedTags = newTags
      .split(/[\s,]+/)
      .map((t) => t.replace(/^#/, "").trim().toLowerCase())
      .filter(Boolean);

    await addNote(newContent, newTitle, parsedTags);
    setNewTitle("");
    setNewContent("");
    setNewTags("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingContent.trim()) return;
    await updateNoteContent(id, editingContent, editingTitle);
    setEditingId(null);
  };

  // Collect all unique tags across current notes
  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => n.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [notes]);

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const unpinnedNotes = notes.filter((n) => !n.isPinned);

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#406852]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#406852] dark:bg-[#27272a] dark:text-[#a3b899] uppercase tracking-wider">
              Notes Workspace
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#232f26] dark:text-[#f4f4f5] mt-1">
            Notes Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#737970] dark:text-[#a1a1aa] mt-0.5">
            Capture thoughts, pin key ideas, tag friction points, and organize your mind.
          </p>
        </div>

        {/* Status Tabs (Active vs Archived) */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-[#e5e1d7] bg-white p-1 dark:border-[#27272a] dark:bg-[#18181b] shadow-xs">
          <button
            onClick={() => setStatusTab("active")}
            className={`rounded-lg px-3.5 py-1 text-xs font-semibold capitalize transition-all ${
              statusTab === "active"
                ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-xs"
                : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusTab("archived")}
            className={`rounded-lg px-3.5 py-1 text-xs font-semibold capitalize transition-all ${
              statusTab === "archived"
                ? "bg-[#232f26] text-white dark:bg-[#27272a] dark:text-[#f4f4f5] shadow-xs"
                : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by keyword or #tag..."
            className="w-full rounded-xl border border-[#e5e1d7] bg-white px-4 py-2.5 pl-9 text-xs text-[#232f26] outline-none dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#f4f4f5] placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa] shadow-xs"
          />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-3 h-4 w-4 text-[#737970] dark:text-[#a1a1aa]">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {/* Tag Filter Pills */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedTag(null)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all shrink-0 ${
                selectedTag === null
                  ? "bg-[#406852] text-white"
                  : "bg-[#e5e1d7]/60 text-[#737970] dark:bg-[#27272a] dark:text-[#a1a1aa]"
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all shrink-0 ${
                  selectedTag === tag
                    ? "bg-[#406852] text-white"
                    : "bg-[#e5e1d7]/60 text-[#737970] dark:bg-[#27272a] dark:text-[#a1a1aa]"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Note Form */}
      {statusTab === "active" && (
        <form onSubmit={handleAdd} className="rounded-2xl border border-[#e5e1d7] bg-white p-4 shadow-sm dark:border-[#27272a] dark:bg-[#18181b] space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Note title (optional)..."
            className="w-full bg-transparent font-semibold text-sm text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your note or thought... (Tip: Add #tags directly in text)"
            rows={3}
            className="w-full resize-none bg-transparent text-sm text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
          />
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-[#e5e1d7]/60 pt-3 dark:border-[#27272a]/60 gap-3">
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Tags (e.g. idea, friction, learning)..."
              className="bg-transparent text-xs text-[#737970] dark:text-[#a1a1aa] outline-none placeholder:text-[#737970]/60 dark:placeholder:text-[#a1a1aa]/60 flex-1"
            />
            <button
              type="submit"
              disabled={!newContent.trim()}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#232f26] px-4 py-2 text-xs font-bold text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs hover:bg-black dark:hover:bg-white transition-all disabled:opacity-40 shrink-0"
            >
              <span>+ Save Note</span>
            </button>
          </div>
        </form>
      )}

      {/* Notes Feed */}
      {loading ? (
        <HorseLoader size="md" label="Loading notes..." />
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e5e1d7] bg-white p-12 text-center dark:border-[#27272a] dark:bg-[#18181b]">
          <span className="text-3xl mb-2 block">📝</span>
          <h3 className="font-bold text-base text-[#232f26] dark:text-[#f4f4f5]">
            No Notes Found
          </h3>
          <p className="text-xs text-[#737970] dark:text-[#a1a1aa] mt-1">
            {searchQuery
              ? "No notes matched your search query."
              : "Capture your first note above to start organizing your thoughts."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Section */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa] flex items-center gap-1.5">
                <span>📌</span> Pinned Notes ({pinnedNotes.length})
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    editingId={editingId}
                    editingTitle={editingTitle}
                    editingContent={editingContent}
                    setEditingId={setEditingId}
                    setEditingTitle={setEditingTitle}
                    setEditingContent={setEditingContent}
                    handleSaveEdit={handleSaveEdit}
                    togglePin={togglePin}
                    updateStatus={updateStatus}
                    deleteNote={deleteNote}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Section */}
          {unpinnedNotes.length > 0 && (
            <div className="space-y-3">
              {pinnedNotes.length > 0 && (
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                  Other Notes ({unpinnedNotes.length})
                </h2>
              )}
              <div className="grid grid-cols-1 gap-3">
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    editingId={editingId}
                    editingTitle={editingTitle}
                    editingContent={editingContent}
                    setEditingId={setEditingId}
                    setEditingTitle={setEditingTitle}
                    setEditingContent={setEditingContent}
                    handleSaveEdit={handleSaveEdit}
                    togglePin={togglePin}
                    updateStatus={updateStatus}
                    deleteNote={deleteNote}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface NoteCardProps {
  note: any;
  editingId: string | null;
  editingTitle: string;
  editingContent: string;
  setEditingId: (id: string | null) => void;
  setEditingTitle: (val: string) => void;
  setEditingContent: (val: string) => void;
  handleSaveEdit: (id: string) => void;
  togglePin: (id: string) => void;
  updateStatus: (id: string, status: "active" | "archived") => void;
  deleteNote: (id: string) => void;
}

function NoteCard({
  note,
  editingId,
  editingTitle,
  editingContent,
  setEditingId,
  setEditingTitle,
  setEditingContent,
  handleSaveEdit,
  togglePin,
  updateStatus,
  deleteNote,
}: NoteCardProps) {
  const isEditing = editingId === note.id;

  return (
    <div
      className={`group flex flex-col gap-3 rounded-2xl border p-4 shadow-xs transition-all ${
        note.isPinned
          ? "border-[#406852]/40 bg-[#e3ede6]/20 dark:border-[#406852]/40 dark:bg-[#18181b]"
          : "border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] hover:border-[#232f26]/30"
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            placeholder="Title..."
            className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-2.5 text-xs font-semibold text-[#232f26] outline-none dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#f4f4f5]"
          />
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 text-xs text-[#232f26] outline-none dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#f4f4f5]"
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
            <div className="space-y-1 flex-1">
              {note.title && (
                <h3 className="font-semibold text-sm text-[#232f26] dark:text-[#f4f4f5]">
                  {note.title}
                </h3>
              )}
              <p className="text-xs sm:text-sm text-[#232f26]/90 dark:text-[#f4f4f5]/90 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
            </div>

            {/* Pin Toggle Button */}
            <button
              onClick={() => togglePin(note.id)}
              className={`rounded-lg p-1.5 transition-all ${
                note.isPinned
                  ? "bg-[#406852] text-white"
                  : "text-[#737970] hover:bg-[#e5e1d7]/50 dark:text-[#a1a1aa] dark:hover:bg-[#27272a]"
              }`}
              title={note.isPinned ? "Unpin note" : "Pin note to top"}
            >
              📌
            </button>
          </div>

          {/* Tags List */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {note.tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-md bg-[#e5e1d7]/50 px-2 py-0.5 text-[10px] font-bold text-[#737970] dark:bg-[#27272a] dark:text-[#a1a1aa]"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Footer Controls */}
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
              <button
                onClick={() => {
                  setEditingId(note.id);
                  setEditingTitle(note.title || "");
                  setEditingContent(note.content);
                }}
                className="text-[11px] font-medium text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
              >
                Edit
              </button>

              <button
                onClick={() => updateStatus(note.id, note.status === "active" ? "archived" : "active")}
                className="text-[11px] font-medium text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
              >
                {note.status === "active" ? "Archive" : "Unarchive"}
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
}
