import type { Habit } from "@/types/habit";

interface ExportedHabitPayload {
  name: string;
  domain: string;
  category: string;
  userLabel: string;
  target?: { goal: number; unit: string; type: string } | null;
}

/**
 * Encodes custom habit list into a URL query parameter string
 */
export function encodeRoutineToURL(habits: Habit[]): string {
  const payload: ExportedHabitPayload[] = habits.slice(0, 10).map((h) => ({
    name: h.name,
    domain: h.domain,
    category: h.category,
    userLabel: h.userLabel,
    target: h.target ? { goal: h.target.goal, unit: h.target.unit, type: h.target.type } : null,
  }));

  try {
    const jsonStr = JSON.stringify(payload);
    return typeof window !== "undefined"
      ? `${window.location.origin}/protocols/import?data=${encodeURIComponent(btoa(jsonStr))}`
      : `/protocols/import?data=${encodeURIComponent(btoa(jsonStr))}`;
  } catch {
    return "";
  }
}

/**
 * Decodes URL parameter string back into Habit objects
 */
export function decodeRoutineFromURL(base64Data: string): ExportedHabitPayload[] {
  try {
    const jsonStr = atob(decodeURIComponent(base64Data));
    return JSON.parse(jsonStr) as ExportedHabitPayload[];
  } catch {
    return [];
  }
}
