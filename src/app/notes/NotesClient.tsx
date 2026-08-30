"use client";

import { useMemo, useState } from "react";
import { useNotesSessions } from "@/hooks/useNotesSessions";
import { getNodeCategoryConfig, NODE_CATEGORY_REGISTRY } from "@/lib/nodeRegistry";
import { HorseLoader } from "@/components/HorseLoader";

export function NotesClient() {
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

  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);

  // Quick Add Node inputs
  const [nodeCategory, setNodeCategory] = useState<string>("optimistic");
  const [nodeContent, setNodeContent] = useState("");
  const [nodeTitle, setNodeTitle] = useState("");
  const [nodeMediaUrl, setNodeMediaUrl] = useState("");

  // Connector Creation state
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [connectorLabel, setConnectorLabel] = useState("");

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNewSession(newSessionTitle.trim() || "Untitled Session");
    setNewSessionTitle("");
    setShowNewSessionModal(false);
  };

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeContent.trim() && nodeCategory !== "image") return;

    // Estimate initial position on canvas
    const currentCount = activeSession?.nodes.length || 0;
    const posX = 40 + (currentCount % 3) * 280;
    const posY = 40 + Math.floor(currentCount / 3) * 220;

    await addNode({
      category: nodeCategory,
      title: nodeTitle.trim(),
      content: nodeContent.trim(),
      mediaUrl: nodeMediaUrl.trim(),
      position: { x: posX, y: posY },
    });

    setNodeContent("");
    setNodeTitle("");
    setNodeMediaUrl("");
  };

  const handleConnectNodes = async (toNodeId: string) => {
    if (!connectingFromId || connectingFromId === toNodeId) {
      setConnectingFromId(null);
      return;
    }
    await addConnector(connectingFromId, toNodeId, connectorLabel.trim());
    setConnectingFromId(null);
    setConnectorLabel("");
  };

  const pinnedSessions = useMemo(() => sessions.filter((s) => s.isPinned), [sessions]);
  const unpinnedSessions = useMemo(() => sessions.filter((s) => !s.isPinned), [sessions]);

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-8rem)] animate-fade-in">
      {/* LEFT SIDEBAR: ChatGPT-Style Sessions List */}
      <div className="w-full md:w-80 shrink-0 space-y-4 rounded-2xl border border-[#e5e1d7] bg-white p-4 dark:border-[#27272a] dark:bg-[#18181b] shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">💬</span>
            <h2 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">
              Thought Sessions
            </h2>
          </div>
          <button
            onClick={() => createNewSession()}
            className="flex items-center gap-1 rounded-xl bg-[#232f26] px-3 py-1.5 text-xs font-bold text-white dark:bg-[#f4f4f5] dark:text-[#18181b] hover:bg-black dark:hover:bg-white transition-all"
            title="Create new session thread"
          >
            <span>+ New</span>
          </button>
        </div>

        {/* Search Session Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions..."
            className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3 py-2 pl-8 text-xs text-[#232f26] outline-none dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#f4f4f5] placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
          />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#737970] dark:text-[#a1a1aa]">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {/* Session Threads Scrollable List */}
        <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar text-xs">
          {loading ? (
            <HorseLoader size="sm" label="Loading..." />
          ) : sessions.length === 0 ? (
            <p className="text-center py-6 text-[#737970] dark:text-[#a1a1aa]">
              No sessions yet. Click + New above.
            </p>
          ) : (
            <>
              {pinnedSessions.map((sess) => (
                <SessionRow
                  key={sess.id}
                  session={sess}
                  isActive={activeSession?.id === sess.id}
                  onClick={() => setActiveSession(sess)}
                  onTogglePin={() => togglePinSession(sess.id)}
                  onDelete={() => deleteSession(sess.id)}
                />
              ))}
              {unpinnedSessions.map((sess) => (
                <SessionRow
                  key={sess.id}
                  session={sess}
                  isActive={activeSession?.id === sess.id}
                  onClick={() => setActiveSession(sess)}
                  onTogglePin={() => togglePinSession(sess.id)}
                  onDelete={() => deleteSession(sess.id)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* RIGHT MAIN AREA: Connected Session Canvas */}
      <div className="flex-1 space-y-6">
        {!activeSession ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] rounded-2xl border border-dashed border-[#e5e1d7] bg-white p-12 text-center dark:border-[#27272a] dark:bg-[#18181b]">
            <span className="text-4xl mb-3 block">🧠</span>
            <h3 className="font-bold text-lg text-[#232f26] dark:text-[#f4f4f5]">
              Select or Create a Session
            </h3>
            <p className="text-xs text-[#737970] dark:text-[#a1a1aa] mt-1 max-w-sm">
              Sessions store your spatial connected nodes and ideas. Choose a thread on the left or create a new one.
            </p>
            <button
              onClick={() => createNewSession("New Session Thread")}
              className="mt-4 rounded-xl bg-[#232f26] px-4 py-2 text-xs font-bold text-white dark:bg-[#f4f4f5] dark:text-[#18181b]"
            >
              + Create Session
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Session Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[#e5e1d7] bg-white p-4 dark:border-[#27272a] dark:bg-[#18181b] shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#406852]/10 px-2 py-0.5 text-[10px] font-bold text-[#406852] dark:bg-[#27272a] dark:text-[#a3b899] uppercase tracking-wider">
                    Session Canvas
                  </span>
                  <span className="text-xs text-[#737970] dark:text-[#a1a1aa]">
                    {activeSession.nodes.length} Nodes · {activeSession.connectors.length} Connectors
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

            {/* Node Creation Toolbar */}
            <form onSubmit={handleAddNode} className="rounded-2xl border border-[#e5e1d7] bg-white p-4 dark:border-[#27272a] dark:bg-[#18181b] shadow-xs space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <span className="text-xs font-bold text-[#737970] dark:text-[#a1a1aa] shrink-0">
                  Node Type:
                </span>
                {Object.values(NODE_CATEGORY_REGISTRY).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setNodeCategory(cat.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
                      nodeCategory === cat.id
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
                {nodeCategory === "image" ? (
                  <input
                    type="text"
                    value={nodeMediaUrl}
                    onChange={(e) => setNodeMediaUrl(e.target.value)}
                    placeholder="Paste Image / Diagram URL..."
                    className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-2.5 text-xs text-[#232f26] outline-none dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#f4f4f5]"
                  />
                ) : null}

                {nodeCategory === "detailed" && (
                  <input
                    type="text"
                    value={nodeTitle}
                    onChange={(e) => setNodeTitle(e.target.value)}
                    placeholder="Node title (optional)..."
                    className="w-full bg-transparent font-semibold text-xs text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970]"
                  />
                )}

                <textarea
                  value={nodeContent}
                  onChange={(e) => setNodeContent(e.target.value)}
                  placeholder={
                    nodeCategory === "optimistic"
                      ? "Write a fast micro spark or optimistic thought..."
                      : nodeCategory === "action"
                      ? "Write an actionable habit/task starter..."
                      : "Write detailed note content..."
                  }
                  rows={2}
                  className="w-full resize-none bg-transparent text-xs text-[#232f26] dark:text-[#f4f4f5] outline-none placeholder:text-[#737970]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#e5e1d7]/60 pt-2.5 dark:border-[#27272a]/60">
                <span className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">
                  {getNodeCategoryConfig(nodeCategory).description}
                </span>
                <button
                  type="submit"
                  disabled={!nodeContent.trim() && !nodeMediaUrl.trim()}
                  className="rounded-xl bg-[#232f26] px-4 py-1.5 text-xs font-bold text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs disabled:opacity-40"
                >
                  + Add Node
                </button>
              </div>
            </form>

            {/* Connectors Feed List */}
            {activeSession.connectors.length > 0 && (
              <div className="rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 dark:border-[#27272a] dark:bg-[#18181b]/60 space-y-2 text-xs">
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
                  Active Relationships ({activeSession.connectors.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeSession.connectors.map((c) => {
                    const fromNode = activeSession.nodes.find((n) => n.id === c.fromNodeId);
                    const toNode = activeSession.nodes.find((n) => n.id === c.toNodeId);
                    return (
                      <div
                        key={c.id}
                        className="flex items-center gap-1.5 rounded-xl border border-[#e5e1d7] bg-white px-2.5 py-1 text-[11px] font-medium dark:border-[#3f3f46] dark:bg-[#27272a]"
                      >
                        <span className="font-bold text-[#406852] dark:text-[#a3b899]">
                          {fromNode?.content.slice(0, 15) || "Node"}
                        </span>
                        <span className="text-[#737970]">➔ {c.label || "links to"} ➔</span>
                        <span className="font-bold text-[#406852] dark:text-[#a3b899]">
                          {toNode?.content.slice(0, 15) || "Node"}
                        </span>
                        <button
                          onClick={() => deleteConnector(c.id)}
                          className="ml-1 text-[10px] text-[#be5a38] hover:underline font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Connected Spatial Nodes Grid */}
            {activeSession.nodes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#e5e1d7] bg-white p-12 text-center dark:border-[#27272a] dark:bg-[#18181b]">
                <span className="text-3xl mb-2 block">⚡</span>
                <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">
                  Empty Session Canvas
                </h3>
                <p className="text-xs text-[#737970] dark:text-[#a1a1aa] mt-1">
                  Use the toolbar above to add your first Optimistic Spark, Detailed Note, or Action Node.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSession.nodes.map((node) => (
                  <CanvasNodeCard
                    key={node.id}
                    node={node}
                    isConnectingFrom={connectingFromId === node.id}
                    onStartConnect={() => setConnectingFromId(node.id)}
                    onCompleteConnect={() => handleConnectNodes(node.id)}
                    onUpgradeCategory={(newCat) => updateNode(node.id, { category: newCat })}
                    onToggleComplete={() => updateNode(node.id, { isCompleted: !node.isCompleted })}
                    onDelete={() => deleteNode(node.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SessionRow({
  session,
  isActive,
  onClick,
  onTogglePin,
  onDelete,
}: {
  session: any;
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
          ? "bg-[#232f26] text-white dark:bg-[#f4f4f5] dark:text-[#18181b] shadow-xs"
          : "hover:bg-[#fbf9f5] dark:hover:bg-[#27272a] text-[#232f26] dark:text-[#f4f4f5]"
      }`}
    >
      <div className="flex items-center gap-2 truncate">
        {session.isPinned && <span className="text-xs">📌</span>}
        <span className="font-medium truncate">{session.title}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className="p-1 hover:text-[#406852]"
          title="Pin thread"
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

function CanvasNodeCard({
  node,
  isConnectingFrom,
  onStartConnect,
  onCompleteConnect,
  onUpgradeCategory,
  onToggleComplete,
  onDelete,
}: {
  node: any;
  isConnectingFrom: boolean;
  onStartConnect: () => void;
  onCompleteConnect: () => void;
  onUpgradeCategory: (category: string) => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}) {
  const catConfig = getNodeCategoryConfig(node.category);

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 shadow-xs transition-all ${
        isConnectingFrom
          ? "ring-2 ring-[#406852] border-[#406852]"
          : "border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] hover:border-[#232f26]/30"
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
            {/* 1-Click Upgrade Button from Optimistic -> Detailed */}
            {node.category === "optimistic" && (
              <button
                onClick={() => onUpgradeCategory("detailed")}
                className="text-[10px] font-bold text-[#406852] hover:underline dark:text-[#a3b899]"
                title="Evolve into Detailed Note"
              >
                ➔ Elaborate
              </button>
            )}

            {/* Connect Button */}
            <button
              onClick={isConnectingFrom ? onStartConnect : onStartConnect}
              className="text-[10px] font-bold text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-white"
              title="Connect to another node"
            >
              🔗 Link
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
