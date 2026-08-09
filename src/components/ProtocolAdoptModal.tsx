"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Protocol, ProtocolHabit } from "@/types/protocol";
import { useHabits } from "@/hooks/useHabits";
import { frequencyLabel } from "@/lib/frequency";

interface Props {
  protocol?: Protocol;
  template?: Protocol;
  onClose: () => void;
}

const DOMAIN_COLORS: Record<string, string> = {
  Sleep: "bg-[#e8ebf5] text-[#2c3e6b]",
  Hydration: "bg-[#e2f0f4] text-[#1f5669]",
  Nutrition: "bg-[#e8f1e3] text-[#345c29]",
  Cardio: "bg-[#f5e9e5] text-[#7a3322]",
  Strength: "bg-[#f4efe2] text-[#6b4923]",
  Mobility: "bg-[#e5f2ee] text-[#235848]",
  Breathing: "bg-[#e0f2f5] text-[#1b5e6b]",
  Grooming: "bg-[#f5e8ed] text-[#6e2840]",
  Preventive: "bg-[#f5f0df] text-[#6e561c]",
  Recovery: "bg-[#eee8f5] text-[#502e6b]",
  Productivity: "bg-[#e3ede6] text-[#232f26]",
  Finance: "bg-[#e4ede6] text-[#2d4a3e]",
  Social: "bg-[#f5e8e3] text-[#7a422d]",
  Learning: "bg-[#ebdcd3] text-[#5c3e31]",
  "Digital Minimalism": "bg-[#e5e1d7] text-[#424541]",
  "Gut Health": "bg-[#e8f0e5] text-[#385c2c]",
};

function domainColor(domain: string): string {
  return DOMAIN_COLORS[domain] ?? "bg-[#e5e1d7] text-[#232f26]";
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

import ConfirmActionModal, { type ConfirmAdoptData } from "@/components/ConfirmActionModal";

export default function ProtocolAdoptModal({ protocol: protocolProp, template: templateProp, onClose }: Props) {
  const protocol = (protocolProp || templateProp)!;
  const router = useRouter();
  const { habits: existingHabits, addFromTemplate } = useHabits();

  // Maps for 2-tier duplicate matching: habitKey + normalized name
  const existingKeysSet = useMemo(() => {
    return new Set(
      existingHabits.map((h) => h.habitKey).filter((k): k is string => Boolean(k))
    );
  }, [existingHabits]);

  const existingNamesSet = useMemo(() => {
    return new Set(existingHabits.map((h) => normalizeName(h.name)));
  }, [existingHabits]);

  // Identify duplicate indices
  const duplicateIndices = useMemo(() => {
    const set = new Set<number>();
    protocol.habits.forEach((h, i) => {
      const keyMatch = h.habitKey && existingKeysSet.has(h.habitKey);
      const nameMatch = existingNamesSet.has(normalizeName(h.name));
      if (keyMatch || nameMatch) {
        set.add(i);
      }
    });
    return set;
  }, [protocol.habits, existingKeysSet, existingNamesSet]);

  // State: selected habits (exclude duplicates by default)
  const [selected, setSelected] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    protocol.habits.forEach((h, i) => {
      const keyMatch = h.habitKey && existingKeysSet.has(h.habitKey);
      const nameMatch = existingNamesSet.has(normalizeName(h.name));
      if (!keyMatch && !nameMatch) {
        initial.add(i);
      }
    });
    return initial;
  });

  const [goalOverrides, setGoalOverrides] = useState<Record<number, number>>(
    Object.fromEntries(
      protocol.habits.map((h, i) => [i, h.target?.goal ?? 0])
    )
  );
  const [submitting, setSubmitting] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<ConfirmAdoptData | null>(null);

  const toggleHabit = (idx: number) => {
    if (duplicateIndices.has(idx)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleAdoptClick = () => {
    if (selected.size === 0) return;
    const selectedHabitNames = Array.from(selected).map((idx) => protocol.habits[idx].name);
    setPendingConfirm({
      title: protocol.name,
      category: protocol.category,
      habitCount: selected.size,
      habitsPreview: selectedHabitNames,
    });
  };

  const handleConfirmAdopt = async (_reason: string) => {
    setSubmitting(true);
    const items: ProtocolHabit[] = Array.from(selected).map((idx) => {
      const h = protocol.habits[idx];
      const goalOverride = goalOverrides[idx];
      return {
        ...h,
        target:
          h.target && goalOverride > 0
            ? { ...h.target, goal: goalOverride }
            : h.target ?? null,
      };
    });

    await addFromTemplate(items, protocol.key);
    setSubmitting(false);
    setPendingConfirm(null);
    onClose();
    router.push("/dashboard");
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-xs sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Drawer / Modal */}
      <div className="w-full max-w-lg rounded-t-2xl bg-white dark:bg-[#18181b] border border-[#e5e1d7] dark:border-[#27272a] p-6 shadow-2xl sm:rounded-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#e5e1d7] dark:border-[#27272a] pb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#232f26] dark:text-[#f4f4f5]">{protocol.name}</h2>
            <p className="mt-0.5 text-xs text-[#737970] dark:text-[#a1a1aa]">{protocol.tagline}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-[#737970] dark:text-[#a1a1aa] transition-colors hover:bg-[#e5e1d7]/50 dark:hover:bg-[#27272a] hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
          >
            ✕
          </button>
        </div>

        {/* Duplicate Info Banner */}
        {duplicateIndices.size > 0 && (
          <div className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#27272a] p-3 text-xs text-[#737970] dark:text-[#a1a1aa]">
            <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5]">
              {duplicateIndices.size} habit{duplicateIndices.size === 1 ? "" : "s"} already active
            </span>{" "}
            in your account will be preserved to prevent duplicate clutter.
          </div>
        )}

        {/* Habit list */}
        <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {protocol.habits.map((habit, idx) => {
            const isDup = duplicateIndices.has(idx);
            const isChecked = selected.has(idx);

            return (
              <li
                key={idx}
                className={`flex flex-col gap-2 rounded-xl border p-3 text-xs transition-all ${
                  isDup
                    ? "border-[#e5e1d7]/50 bg-[#fbf9f5]/50 dark:border-[#27272a]/50 dark:bg-[#27272a]/50 opacity-60 cursor-not-allowed"
                    : isChecked
                      ? "border-[#406852]/40 bg-[#e3ede6]/30 dark:border-[#3f3f46] dark:bg-[#27272a]"
                      : "border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    disabled={isDup}
                    checked={isChecked}
                    onChange={() => toggleHabit(idx)}
                    className="mt-0.5 rounded accent-[#232f26] dark:accent-[#f4f4f5]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#232f26] dark:text-[#f4f4f5] truncate">
                        {habit.name}
                      </span>
                      {isDup && (
                        <span className="shrink-0 rounded bg-[#e5e1d7] dark:bg-[#27272a] px-1.5 py-0.5 text-[10px] font-medium text-[#737970] dark:text-[#a1a1aa]">
                          Already added
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#737970] dark:text-[#a1a1aa]">
                      {habit.domain} · {frequencyLabel(habit.frequency)}
                    </p>
                  </div>
                </div>

                {/* Editable Goal row */}
                {habit.target && isChecked && !isDup && (
                  <div className="mt-1 flex items-center gap-2 pl-7 text-[11px] text-[#737970] dark:text-[#a1a1aa]">
                    <span>Goal:</span>
                    <input
                      type="number"
                      min={1}
                      value={goalOverrides[idx] ?? habit.target.goal}
                      onChange={(e) =>
                        setGoalOverrides((prev) => ({
                          ...prev,
                          [idx]: Number(e.target.value),
                        }))
                      }
                      className="w-16 rounded-md border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] px-2 py-0.5 text-center font-semibold text-[#232f26] dark:text-[#f4f4f5] outline-none"
                    />
                    <span>{habit.target.unit}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#e5e1d7] dark:border-[#27272a] pt-4">
          <span className="text-xs text-[#737970] dark:text-[#a1a1aa]">
            {selected.size} of {protocol.habits.length} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] px-4 py-2 text-xs font-semibold text-[#737970] dark:text-[#a1a1aa] transition-colors hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
            >
              Cancel
            </button>
            <button
              onClick={handleAdoptClick}
              disabled={submitting || selected.size === 0}
              className="rounded-xl bg-[#232f26] px-5 py-2 text-xs font-semibold text-white dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46] transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {submitting ? "Adopting…" : `Adopt ${selected.size} Habits →`}
            </button>
          </div>
        </div>
      </div>

      {pendingConfirm && (
        <ConfirmActionModal
          type="adopt"
          adoptData={pendingConfirm}
          onConfirm={handleConfirmAdopt}
          onClose={() => setPendingConfirm(null)}
        />
      )}
    </div>
  );
}

export { ProtocolAdoptModal as TemplateCustomizerModal };
