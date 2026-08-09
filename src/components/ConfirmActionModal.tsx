"use client";

import { useState } from "react";
import { Spinner } from "@/components/Spinner";

export type ConfirmActionType = "add" | "adopt" | "delete";

export interface ConfirmAddData {
  name: string;
  domain: string;
  userLabel: string;
  scheduleLabel: string;
  targetGoalLabel?: string;
}

export interface ConfirmAdoptData {
  title: string;
  category: string;
  habitCount: number;
  habitsPreview: string[];
}

export interface ConfirmDeleteData {
  habitId: string;
  habitName: string;
  domain: string;
}

interface Props {
  type: ConfirmActionType;
  addData?: ConfirmAddData;
  adoptData?: ConfirmAdoptData;
  deleteData?: ConfirmDeleteData;
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
}

const DELETE_REASON_TAGS = [
  "Achieved my goal",
  "Routine changed",
  "No longer relevant",
  "Too difficult",
  "Replacing with another habit",
];

export default function ConfirmActionModal({
  type,
  addData,
  adoptData,
  deleteData,
  onConfirm,
  onClose,
}: Props) {
  const [reason, setReason] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fullReason = [selectedTag, reason.trim()].filter(Boolean).join(" - ");
      await onConfirm(fullReason);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#18181b] border border-[#e5e1d7] dark:border-[#27272a] p-6 shadow-2xl space-y-5 animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#e5e1d7] dark:border-[#27272a] pb-3">
          <div>
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                type === "delete"
                  ? "bg-[#be5a38]/10 text-[#be5a38]"
                  : type === "adopt"
                    ? "bg-[#e3ede6] dark:bg-[#27272a] text-[#406852] dark:text-[#f4f4f5]"
                    : "bg-[#f4efe2] dark:bg-[#27272a] text-[#6b4923] dark:text-[#d4cca9]"
              }`}
            >
              {type === "delete"
                ? "Confirm Deletion"
                : type === "adopt"
                  ? "Confirm Protocol Adoption"
                  : "Confirm New Habit"}
            </span>
            <h2 className="mt-1.5 text-lg font-semibold text-[#232f26] dark:text-[#f4f4f5]">
              {type === "delete"
                ? `Remove "${deleteData?.habitName}"?`
                : type === "adopt"
                  ? `Adopt ${adoptData?.title}?`
                  : `Plant "${addData?.name}"?`}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-full p-1 text-[#737970] dark:text-[#a1a1aa] transition-colors hover:bg-[#e5e1d7]/50 dark:hover:bg-[#27272a] hover:text-[#232f26] dark:hover:text-[#f4f4f5] disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Action Item Summary */}
        <div className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a] p-3.5 text-xs space-y-2">
          {type === "add" && addData && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[#737970] dark:text-[#a1a1aa]">Biological Domain:</span>
                <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">{addData.domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737970] dark:text-[#a1a1aa]">Schedule & Label:</span>
                <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                  {addData.scheduleLabel} · {addData.userLabel}
                </span>
              </div>
              {addData.targetGoalLabel && (
                <div className="flex justify-between">
                  <span className="text-[#737970] dark:text-[#a1a1aa]">Numeric Goal:</span>
                  <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">{addData.targetGoalLabel}</span>
                </div>
              )}
            </div>
          )}

          {type === "adopt" && adoptData && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#737970] dark:text-[#a1a1aa]">Category:</span>
                <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">{adoptData.category}</span>
              </div>
              <div>
                <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                  {adoptData.habitCount} Included Habits:
                </span>
                <ul className="mt-1 space-y-0.5 text-[#737970] dark:text-[#a1a1aa]">
                  {adoptData.habitsPreview.map((name, i) => (
                    <li key={i} className="truncate">• {name}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {type === "delete" && deleteData && (
            <div className="flex justify-between items-center">
              <span className="text-[#737970] dark:text-[#a1a1aa]">Domain:</span>
              <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">{deleteData.domain}</span>
            </div>
          )}
        </div>

        {/* Intention / Reflection Form */}
        <form onSubmit={handleConfirm} className="space-y-4 text-xs">
          {type === "delete" ? (
            <div className="space-y-2">
              <label className="font-semibold text-[#232f26] dark:text-[#f4f4f5] block">
                Select a reason for deletion:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DELETE_REASON_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                      selectedTag === tag
                        ? "bg-[#be5a38] text-white shadow-sm font-semibold"
                        : "border border-[#e5e1d7] bg-white text-[#737970] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#a1a1aa] hover:border-[#be5a38]/40 hover:text-[#be5a38]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="font-semibold text-[#232f26] dark:text-[#f4f4f5] block mb-1">
                  Additional reflection note (Optional):
                </label>
                <textarea
                  rows={2}
                  placeholder="Why are you removing this habit from your routine?"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#27272a] dark:text-[#f4f4f5] p-2.5 outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="font-semibold text-[#232f26] dark:text-[#f4f4f5] block mb-1">
                {type === "add"
                  ? "What is your main intention for starting this habit? (Optional)"
                  : "Why are you adopting this protocol system? (Optional)"}
              </label>
              <textarea
                rows={2}
                placeholder={
                  type === "add"
                    ? "e.g. Boost daily energy, improve focus, build consistency..."
                    : "e.g. Optimizing morning routine for high executive workload..."
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#27272a] dark:text-[#f4f4f5] p-2.5 outline-none placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa]"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 border-t border-[#e5e1d7] dark:border-[#27272a] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] px-4 py-2 font-semibold text-[#737970] dark:text-[#a1a1aa] transition-colors hover:text-[#232f26] dark:hover:text-[#f4f4f5] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2 font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50 ${
                type === "delete"
                  ? "bg-[#be5a38]"
                  : "bg-[#232f26] dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46]"
              }`}
            >
              {submitting ? (
                <>
                  <Spinner className="h-3.5 w-3.5 text-white dark:text-[#f4f4f5]" />
                  <span>Processing...</span>
                </>
              ) : type === "delete" ? (
                "Confirm & Delete"
              ) : type === "adopt" ? (
                "Confirm & Adopt Protocol →"
              ) : (
                "Confirm & Plant Habit →"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
