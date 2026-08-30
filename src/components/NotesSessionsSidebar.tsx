"use client";

import { useMemo } from "react";
import type { NoteSession } from "@/types/note";
import { HorseLoader } from "@/components/HorseLoader";

interface Props {
  sessions: NoteSession[];
  activeSession: NoteSession | null;
  loading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectSession: (session: NoteSession) => void;
  onCreateSession: () => void;
  onTogglePinSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

export default function NotesSessionsSidebar({
  sessions,
  activeSession,
  loading,
  searchQuery,
  onSearchChange,
  onSelectSession,
  onCreateSession,
  onTogglePinSession,
  onDeleteSession,
}: Props) {
  const pinnedSessions = useMemo(() => sessions.filter((s) => s.isPinned), [sessions]);
  const unpinnedSessions = useMemo(() => sessions.filter((s) => !s.isPinned), [sessions]);

  return (
    <div className="flex h-full w-64 flex-col border-r border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] text-xs select-none">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-[#e5e1d7] px-3.5 py-3 dark:border-[#27272a]">
        <div className="flex items-center gap-2">
          <span className="text-base">💬</span>
          <h2 className="font-bold text-xs uppercase tracking-wider text-[#232f26] dark:text-[#f4f4f5]">
            Thought Sessions
          </h2>
        </div>
        <button
          onClick={onCreateSession}
          className="flex items-center gap-1 rounded-lg bg-[#232f26] px-2.5 py-1 text-[11px] font-bold text-white dark:bg-[#f4f4f5] dark:text-[#18181b] hover:bg-black dark:hover:bg-white transition-all shadow-xs"
          title="Create new session thread"
        >
          <span>+ New</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-[#e5e1d7]/60 dark:border-[#27272a]/60">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search sessions..."
            className="w-full rounded-xl border border-[#e5e1d7] bg-white px-3 py-1.5 pl-8 text-xs text-[#232f26] outline-none dark:border-[#3f3f46] dark:bg-[#18181b] dark:text-[#f4f4f5] placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
          />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#737970] dark:text-[#a1a1aa]">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* Scrollable Threads List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
        {loading ? (
          <HorseLoader size="sm" label="Loading sessions..." />
        ) : sessions.length === 0 ? (
          <div className="p-6 text-center text-[#737970] dark:text-[#a1a1aa]">
            <p className="text-xs">No sessions found.</p>
            <button
              onClick={onCreateSession}
              className="mt-2 text-[11px] font-bold text-[#406852] underline"
            >
              + Create Thread
            </button>
          </div>
        ) : (
          <>
            {pinnedSessions.length > 0 && (
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                📌 Pinned Threads
              </div>
            )}
            {pinnedSessions.map((sess) => (
              <SessionItemRow
                key={sess.id}
                session={sess}
                isActive={activeSession?.id === sess.id}
                onClick={() => onSelectSession(sess)}
                onTogglePin={() => onTogglePinSession(sess.id)}
                onDelete={() => onDeleteSession(sess.id)}
              />
            ))}

            {pinnedSessions.length > 0 && unpinnedSessions.length > 0 && (
              <div className="px-2 pt-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                Recent Threads
              </div>
            )}
            {unpinnedSessions.map((sess) => (
              <SessionItemRow
                key={sess.id}
                session={sess}
                isActive={activeSession?.id === sess.id}
                onClick={() => onSelectSession(sess)}
                onTogglePin={() => onTogglePinSession(sess.id)}
                onDelete={() => onDeleteSession(sess.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function SessionItemRow({
  session,
  isActive,
  onClick,
  onTogglePin,
  onDelete,
}: {
  session: NoteSession;
  isActive: boolean;
  onClick: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between rounded-xl px-3 py-2 cursor-pointer transition-all ${
        isActive
          ? "bg-[#232f26] text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs font-semibold"
          : "hover:bg-[#e5e1d7]/40 dark:hover:bg-[#27272a] text-[#232f26] dark:text-[#f4f4f5]"
      }`}
    >
      <div className="flex items-center gap-2 truncate">
        {session.isPinned && <span className="text-xs">📌</span>}
        <span className="truncate text-xs">{session.title}</span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className="p-1 hover:text-[#406852]"
          title={session.isPinned ? "Unpin thread" : "Pin thread"}
        >
          📌
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 hover:text-[#be5a38]"
          title="Delete thread"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
