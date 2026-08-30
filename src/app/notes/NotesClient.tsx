"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import NotesSessionsSidebar from "@/components/NotesSessionsSidebar";
import { useNotesSessions } from "@/hooks/useNotesSessions";
import { getElementCategoryConfig, ELEMENT_REGISTRY } from "@/lib/nodeRegistry";
import { calculateCollisionFreePath } from "@/lib/connectorRouting";
import { HorseLoader } from "@/components/HorseLoader";

interface NotesClientProps {
  userLabel: string;
}

export function NotesClient({ userLabel }: NotesClientProps) {
  const {
    sessions,
    activeSession,
    setActiveSession,
    loading,
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
  } = useNotesSessions();

  // Quick Add Element inputs
  const [elementCategory, setElementCategory] = useState<string>("sticky");
  const [elementContent, setElementContent] = useState("");
  const [elementTitle, setElementTitle] = useState("");
  const [elementMediaUrl, setElementMediaUrl] = useState("");

  // Connector Creation state
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);

  const handleAddElement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!elementContent.trim() && elementCategory !== "image") return;

    const currentCount = activeSession?.nodes.length || 0;
    const posX = 40 + (currentCount % 3) * 280;
    const posY = 40 + Math.floor(currentCount / 3) * 220;

    await addNode({
      category: elementCategory,
      title: elementTitle.trim(),
      content: elementContent.trim(),
      mediaUrl: elementMediaUrl.trim(),
      position: { x: posX, y: posY },
    });

    setElementContent("");
    setElementTitle("");
    setElementMediaUrl("");
  };

  const handleConnectNodes = async (toNodeId: string) => {
    if (!connectingFromId || connectingFromId === toNodeId) {
      setConnectingFromId(null);
      return;
    }
    await addConnector(connectingFromId, toNodeId);
    setConnectingFromId(null);
  };

  // Secondary Sub-Sidebar docked flush to global AppSidebar
  const secondarySidebar = (
    <NotesSessionsSidebar
      sessions={sessions}
      activeSession={activeSession}
      loading={loading}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSelectSession={(sess) => setActiveSession(sess)}
      onCreateSession={() => createNewSession("New Session Deck")}
      onTogglePinSession={togglePinSession}
      onDeleteSession={deleteSession}
    />
  );

  return (
    <AppShell userLabel={userLabel} secondarySidebar={secondarySidebar}>
      <div className="space-y-6 animate-fade-in">
        {!activeSession ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] rounded-2xl border border-dashed border-[#e5e1d7] bg-white p-12 text-center dark:border-[#27272a] dark:bg-[#18181b]">
            <span className="text-4xl mb-3 block">🔲</span>
            <h3 className="font-bold text-lg text-[#232f26] dark:text-[#f4f4f5]">
              Select or Create a Session
            </h3>
            <p className="text-xs text-[#737970] dark:text-[#a1a1aa] mt-1 max-w-sm">
              Sessions store your PowerPoint-style note cards, sticky notes, containers, and collision-free connectors.
            </p>
            <button
              onClick={() => createNewSession("New Session Deck")}
              className="mt-4 rounded-xl bg-[#232f26] px-4 py-2 text-xs font-bold text-white dark:bg-[#f4f4f5] dark:text-[#18181b]"
            >
              + Create Session Deck
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Session Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[#e5e1d7] bg-white p-4 dark:border-[#27272a] dark:bg-[#18181b] shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#406852]/10 px-2 py-0.5 text-[10px] font-bold text-[#406852] dark:bg-[#27272a] dark:text-[#a3b899] uppercase tracking-wider">
                    PowerPoint Note Canvas
                  </span>
                  <span className="text-xs text-[#737970] dark:text-[#a1a1aa]">
                    {activeSession.nodes.length} Elements · {activeSession.connectors.length} Auto-Connectors
                  </span>
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-[#232f26] dark:text-[#f4f4f5] mt-0.5">
                  {activeSession.title}
                </h1>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => togglePinSession(activeSession.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    activeSession.isPinned
                      ? "bg-[#406852] text-white"
                      : "border border-[#e5e1d7] text-[#737970] dark:border-[#27272a] dark:text-[#a1a1aa]"
                  }`}
                >
                  📌 {activeSession.isPinned ? "Pinned" : "Pin Thread"}
                </button>
              </div>
            </div>

            {/* PPT Element Toolbar */}
            <form onSubmit={handleAddElement} className="rounded-2xl border border-[#e5e1d7] bg-white p-4 dark:border-[#27272a] dark:bg-[#18181b] shadow-xs space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <span className="text-xs font-bold text-[#737970] dark:text-[#a1a1aa] shrink-0">
                  Element Palette:
                </span>
                {Object.values(ELEMENT_REGISTRY).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setElementCategory(cat.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
                      elementCategory === cat.id
                        ? "bg-[#232f26] text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs"
                        : "bg-[#fbf9f5] text-[#737970] dark:bg-[#27272a] dark:text-[#a1a1aa] hover:text-[#232f26]"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {elementCategory === "image" ? (
                  <input
                    type="text"
                    value={elementMediaUrl}
                    onChange={(e) => setElementMediaUrl(e.target.value)}
                    placeholder="Paste Image / Diagram URL..."
                    className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-2.5 text-xs text-[#232f26] outline-none dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#f4f4f5]"
                  />
                ) : null}

                {(elementCategory === "shape" || elementCategory === "text" || elementCategory === "detailed") && (
                  <input
                    type="text"
                    value={elementTitle}
                    onChange={(e) => setElementTitle(e.target.value)}
                    placeholder="Title / Container Header (optional)..."
                    className="w-full bg-transparent font-semibold text-xs text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970]"
                  />
                )}

                <textarea
                  value={elementContent}
                  onChange={(e) => setElementContent(e.target.value)}
                  placeholder={
                    elementCategory === "sticky"
                      ? "Write a yellow sticky note thought..."
                      : elementCategory === "shape"
                      ? "Write container notes or concepts..."
                      : elementCategory === "action"
                      ? "Write an actionable task starter..."
                      : "Write freeform note content..."
                  }
                  rows={2}
                  className="w-full resize-none bg-transparent text-xs text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#e5e1d7]/60 pt-2.5 dark:border-[#27272a]/60">
                <span className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">
                  {getElementCategoryConfig(elementCategory).description}
                </span>
                <button
                  type="submit"
                  disabled={!elementContent.trim() && !elementMediaUrl.trim()}
                  className="rounded-xl bg-[#232f26] px-4 py-1.5 text-xs font-bold text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs disabled:opacity-40"
                >
                  + Add Element
                </button>
              </div>
            </form>

            {/* Canvas Stage & Collision-Free SVG Auto-Routing Overlay */}
            <div className="relative min-h-[500px] rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5]/50 p-4 dark:border-[#27272a] dark:bg-[#121215]/50 overflow-hidden">
              {/* SVG Auto-Routing Connectors Overlay */}
              <svg className="absolute inset-0 pointer-events-none h-full w-full z-10 overflow-visible">
                {activeSession.connectors.map((c) => {
                  const sourceNode = activeSession.nodes.find((n) => n.id === c.fromNodeId);
                  const targetNode = activeSession.nodes.find((n) => n.id === c.toNodeId);

                  if (!sourceNode || !targetNode) return null;

                  const pathD = calculateCollisionFreePath(
                    sourceNode.position,
                    targetNode.position,
                    activeSession.nodes.map((n) => ({ id: n.id, ...n.position })),
                    c.fromNodeId,
                    c.toNodeId
                  );

                  return (
                    <path
                      key={c.id}
                      d={pathD}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#406852] dark:text-[#a3b899] opacity-80 transition-all duration-300"
                    />
                  );
                })}
              </svg>

              {/* Elements Grid */}
              {activeSession.nodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[350px] text-center p-8">
                  <span className="text-3xl mb-2 block">📌</span>
                  <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">
                    Empty Canvas Stage
                  </h3>
                  <p className="text-xs text-[#737970] dark:text-[#a1a1aa] mt-1">
                    Use the Palette Toolbar above to add Sticky Notes, Shapes, Text Boxes, or Action Starters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-20">
                  {activeSession.nodes.map((node) => (
                    <PPTElementCard
                      key={node.id}
                      node={node}
                      isConnectingFrom={connectingFromId === node.id}
                      onStartConnect={() => setConnectingFromId(node.id)}
                      onCompleteConnect={() => handleConnectNodes(node.id)}
                      onToggleComplete={() => updateNode(node.id, { isCompleted: !node.isCompleted })}
                      onDelete={() => deleteNode(node.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function PPTElementCard({
  node,
  isConnectingFrom,
  onStartConnect,
  onCompleteConnect,
  onToggleComplete,
  onDelete,
}: {
  node: any;
  isConnectingFrom: boolean;
  onStartConnect: () => void;
  onCompleteConnect: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}) {
  const catConfig = getElementCategoryConfig(node.category);

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 shadow-xs transition-all ${catConfig.cardBg} ${catConfig.cardBorder} ${
        isConnectingFrom ? "ring-2 ring-[#406852] border-[#406852]" : ""
      }`}
    >
      <div className="space-y-2">
        {/* Category Header */}
        <div className="flex items-center justify-between">
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${catConfig.badgeBg} ${catConfig.badgeText}`}
          >
            <span>{catConfig.icon}</span>
            <span>{catConfig.label}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {/* Auto-Connector Button */}
            <button
              onClick={isConnectingFrom ? onStartConnect : onStartConnect}
              className="text-[10px] font-bold text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-white"
              title="Connect smoothly to another node without overlaps"
            >
              🔗 Auto-Connect
            </button>

            <button
              onClick={onDelete}
              className="text-[10px] font-bold text-[#be5a38] hover:underline"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Content Body */}
        {node.category === "action" ? (
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              checked={Boolean(node.isCompleted)}
              onChange={onToggleComplete}
              className="mt-1 rounded accent-[#406852]"
            />
            <span
              className={`text-xs font-medium ${
                node.isCompleted ? "line-through text-[#737970]" : "text-[#232f26] dark:text-[#f4f4f5]"
              }`}
            >
              {node.content}
            </span>
          </div>
        ) : (
          <div className="space-y-1">
            {node.title && (
              <h4 className="font-bold text-xs text-[#232f26] dark:text-[#f4f4f5]">
                {node.title}
              </h4>
            )}
            <p className="text-xs text-[#232f26]/90 dark:text-[#f4f4f5]/90 whitespace-pre-wrap leading-relaxed">
              {node.content}
            </p>
          </div>
        )}

        {/* Media Preview if available */}
        {node.mediaUrl && (
          <div className="mt-2 rounded-xl overflow-hidden border border-[#e5e1d7] dark:border-[#3f3f46]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={node.mediaUrl} alt="Node Media" className="max-h-40 w-full object-cover" />
          </div>
        )}
      </div>

      {/* Footer Timestamp */}
      <div className="border-t border-[#e5e1d7]/40 pt-2 mt-3 dark:border-[#27272a]/40 text-[10px] text-[#737970] dark:text-[#a1a1aa]">
        Created {new Date(node.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}
