"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";

interface BreakdownItem {
  label: string;
  count: number;
}

interface Props {
  entityType: "domain" | "category" | "catalog" | "template";
  entityName: string;
  entityKey: string;
  onConfirmDelete: () => Promise<void>;
  onClose: () => void;
}

export default function AdminDependencyWarningModal({
  entityType,
  entityName,
  entityKey,
  onConfirmDelete,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [canDelete, setCanDelete] = useState(false);
  const [totalDependencies, setTotalDependencies] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/dependencies/check?type=${entityType}&key=${encodeURIComponent(entityKey)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setCanDelete(Boolean(data.canDelete));
          setTotalDependencies(data.totalDependencies || 0);
          setBreakdown(data.breakdown || []);
          setMessage(data.message || "");
        }
      })
      .catch(() => {
        setErrorMsg("Could not perform dependency check.");
      })
      .finally(() => setLoading(false));
  }, [entityType, entityKey]);

  const handleDelete = async () => {
    if (!canDelete || deleting) return;
    setDeleting(true);
    try {
      await onConfirmDelete();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to delete entity.");
    } finally {
      setDeleting(false);
    }
  };

  const entityTitle =
    entityType === "domain"
      ? "Biological Domain"
      : entityType === "category"
        ? "Protocol Category"
        : entityType === "catalog"
          ? "Master Catalog Habit"
          : "Protocol Template";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !deleting) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#18181b] border border-[#e5e1d7] dark:border-[#27272a] p-6 shadow-2xl space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e5e1d7] dark:border-[#27272a] pb-3">
          <div>
            <span className="inline-block rounded-full bg-[#be5a38]/10 text-[#be5a38] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              {entityTitle} Deletion Pre-Check
            </span>
            <h2 className="mt-1 text-lg font-semibold text-[#232f26] dark:text-[#f4f4f5]">
              Delete "{entityName}"?
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={deleting}
            aria-label="Close"
            className="rounded-full p-1 text-[#737970] dark:text-[#a1a1aa] transition-colors hover:bg-[#e5e1d7]/50 dark:hover:bg-[#27272a] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-8 text-center space-y-3">
            <Spinner className="h-6 w-6 text-[#232f26] dark:text-[#f4f4f5] mx-auto" />
            <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
              Scanning database for active dependencies...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="rounded-xl border border-[#be5a38]/40 bg-[#be5a38]/10 p-4 text-xs text-[#be5a38]">
            {errorMsg}
          </div>
        ) : totalDependencies > 0 ? (
          /* BLOCKED DELETION WARNING */
          <div className="space-y-4">
            <div className="rounded-xl border border-[#be5a38]/30 bg-[#be5a38]/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#be5a38]">
                <span>⚠ Deletion Blocked</span>
              </div>
              <p className="text-xs text-[#be5a38] leading-relaxed">
                This {entityTitle.toLowerCase()} cannot be deleted because it has{" "}
                <strong className="font-bold">{totalDependencies}</strong> active dependent reference(s) in the system.
              </p>
            </div>

            {/* Dependency Breakdown */}
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5] block">
                Active Dependencies Breakdown:
              </span>
              <ul className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a] p-3 space-y-2">
                {breakdown.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-[#737970] dark:text-[#a1a1aa]">
                    <span>• {item.label}</span>
                    <span className="font-bold text-[#be5a38] bg-[#be5a38]/10 px-2 py-0.5 rounded-full text-[11px]">
                      {item.count} reference{item.count === 1 ? "" : "s"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] italic text-[#737970] dark:text-[#a1a1aa]">
              To delete this {entityTitle.toLowerCase()}, please first reassign or remove all dependent habits/protocols listed above.
            </p>
          </div>
        ) : (
          /* SAFE DELETION CONFIRMATION */
          <div className="rounded-xl border border-[#406852]/30 bg-[#e3ede6]/40 dark:bg-[#27272a] p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#406852] dark:text-[#f4f4f5]">
              <span>✓ Safe to Delete</span>
            </div>
            <p className="text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
              0 active dependencies found for <strong className="text-[#232f26] dark:text-[#f4f4f5]">"{entityName}"</strong>. Removing this item will not affect any active user habits or protocols.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 border-t border-[#e5e1d7] dark:border-[#27272a] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] px-4 py-2 text-xs font-semibold text-[#737970] dark:text-[#a1a1aa] transition-colors hover:text-[#232f26] dark:hover:text-[#f4f4f5] disabled:opacity-50"
          >
            {totalDependencies > 0 ? "Close" : "Cancel"}
          </button>
          {totalDependencies === 0 && !loading && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={!canDelete || deleting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#be5a38] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {deleting ? (
                <>
                  <Spinner className="h-3.5 w-3.5 text-white" />
                  <span>Deleting...</span>
                </>
              ) : (
                "Confirm & Delete"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
