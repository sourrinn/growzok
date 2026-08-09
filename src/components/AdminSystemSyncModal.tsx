"use client";

import { useState } from "react";

interface SyncSummary {
  domainsSynced: number;
  categoriesSynced: number;
  catalogHabitsUpserted: number;
  protocolsUpserted: number;
  userHabitsMigrated: number;
  outdatedRecordsPurged: number;
}

interface Props {
  onClose: () => void;
  onSyncComplete?: () => void;
}

export default function AdminSystemSyncModal({ onClose, onSyncComplete }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [summary, setSummary] = useState<SyncSummary | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/system/sync", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to synchronize system data.");
      } else {
        setSummary(data.summary);
        if (onSyncComplete) onSyncComplete();
      }
    } catch {
      setErrorMsg("Network error trying to synchronize system data.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-2xl space-y-5 dark:border-[#27272a] dark:bg-[#18181b] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e1d7] pb-3 dark:border-[#27272a]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#232f26] text-xs text-white dark:bg-[#f4f4f5] dark:text-[#18181b]">
              ⚡
            </span>
            <h3 className="text-base font-semibold text-[#232f26] dark:text-[#f4f4f5]">
              Synchronize System Data & Purge Outdated Data
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#737970] transition-colors hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="rounded-xl border border-[#be5a38]/30 bg-[#be5a38]/10 p-3 text-xs font-semibold text-[#be5a38]">
            {errorMsg}
          </div>
        )}

        {/* Summary Result View */}
        {summary ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#e3ede6] bg-[#e3ede6]/40 p-4 text-xs dark:border-[#27272a] dark:bg-[#27272a]/50 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#2d4a3e] dark:text-[#f4f4f5]">
                <span>✓</span> System Data Synchronized Successfully
              </div>
              <p className="text-[#737970] dark:text-[#a1a1aa]">
                Database collections are now 100% in sync with the latest system specification.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 dark:border-[#27272a] dark:bg-[#27272a]">
                <div className="text-[#737970] dark:text-[#a1a1aa]">Biological Domains</div>
                <div className="text-base font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                  {summary.domainsSynced} Synced
                </div>
              </div>
              <div className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 dark:border-[#27272a] dark:bg-[#27272a]">
                <div className="text-[#737970] dark:text-[#a1a1aa]">Protocol Categories</div>
                <div className="text-base font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                  {summary.categoriesSynced} Synced
                </div>
              </div>
              <div className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 dark:border-[#27272a] dark:bg-[#27272a]">
                <div className="text-[#737970] dark:text-[#a1a1aa]">Master Catalog Habits</div>
                <div className="text-base font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                  {summary.catalogHabitsUpserted} Upserted
                </div>
              </div>
              <div className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 dark:border-[#27272a] dark:bg-[#27272a]">
                <div className="text-[#737970] dark:text-[#a1a1aa]">Marketplace Protocols</div>
                <div className="text-base font-semibold text-[#232f26] dark:text-[#f4f4f5]">
                  {summary.protocolsUpserted} Upserted
                </div>
              </div>
              <div className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 dark:border-[#27272a] dark:bg-[#27272a]">
                <div className="text-[#737970] dark:text-[#a1a1aa]">User Habits Migrated</div>
                <div className="text-base font-semibold text-[#2d4a3e] dark:text-[#f4f4f5]">
                  {summary.userHabitsMigrated} Updated
                </div>
              </div>
              <div className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 dark:border-[#27272a] dark:bg-[#27272a]">
                <div className="text-[#737970] dark:text-[#a1a1aa]">Outdated Data Purged</div>
                <div className="text-base font-semibold text-[#be5a38] dark:text-[#f4f4f5]">
                  {summary.outdatedRecordsPurged} Cleaned
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="rounded-xl bg-[#232f26] px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 dark:bg-[#f4f4f5] dark:text-[#18181b]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <p className="text-[#737970] dark:text-[#a1a1aa]">
              This operation will scan MongoDB collections, delete obsolete/legacy records, and synchronize all defaults with the latest codebase specifications:
            </p>

            <ul className="space-y-2 font-medium text-[#232f26] dark:text-[#f4f4f5]">
              <li className="flex items-center gap-2">
                <span className="text-[#406852]">✓</span>
                Purge obsolete legacy catalog records & malformed custom entries.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#406852]">✓</span>
                Seed all 16 official Biological Domains into system database.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#406852]">✓</span>
                Seed all 10 official Protocol Categories into system database.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#406852]">✓</span>
                Upsert all 16+ Master Catalog Habits with latest targets & frequencies.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#406852]">✓</span>
                Upsert all 6 Standard Marketplace Protocol Systems.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#406852]">✓</span>
                Normalize active user dashboard habits to match official domain casing.
              </li>
            </ul>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-[#e5e1d7] pt-4 dark:border-[#27272a]">
              <button
                type="button"
                onClick={onClose}
                disabled={syncing}
                className="rounded-xl border border-[#e5e1d7] bg-white px-4 py-2 font-semibold text-[#737970] transition-colors hover:bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#a1a1aa]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSync}
                disabled={syncing}
                className="flex items-center gap-2 rounded-xl bg-[#232f26] px-5 py-2 font-semibold text-white transition-opacity hover:opacity-90 dark:bg-[#f4f4f5] dark:text-[#18181b] disabled:opacity-50"
              >
                {syncing ? (
                  <>
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-[#18181b] dark:border-t-transparent" />
                    Synchronizing System Data…
                  </>
                ) : (
                  <>⚡ Confirm & Sync System Data</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
