import type { Habit } from "@/types/habit";
import { todayStr } from "@/lib/dates";

/**
 * Converts array of Habits into an RFC 4180 compliant CSV string
 */
export function exportHabitsToCSV(habits: Habit[]): string {
  const headers = ["Habit Name", "Domain", "Category", "User Label", "Frequency", "Target Goal", "Target Unit", "Status", "Completion Date", "Completed Timestamp"];
  const rows: string[][] = [headers];

  habits.forEach((h) => {
    const targetGoal = h.target ? String(h.target.goal) : "";
    const targetUnit = h.target ? h.target.unit : "";

    if (h.completions && h.completions.length > 0) {
      h.completions.forEach((c) => {
        rows.push([
          escapeCSV(h.name),
          escapeCSV(h.domain),
          escapeCSV(h.category),
          escapeCSV(h.userLabel),
          escapeCSV(h.frequency.type),
          targetGoal,
          escapeCSV(targetUnit),
          h.status,
          c.date,
          c.completedAt,
        ]);
      });
    } else {
      // Habit without completion history yet
      rows.push([
        escapeCSV(h.name),
        escapeCSV(h.domain),
        escapeCSV(h.category),
        escapeCSV(h.userLabel),
        escapeCSV(h.frequency.type),
        targetGoal,
        escapeCSV(targetUnit),
        h.status,
        "",
        "",
      ]);
    }
  });

  return rows.map((r) => r.join(",")).join("\n");
}

/**
 * Triggers a browser file download of the CSV dataset
 */
export function downloadCSVFile(habits: Habit[]) {
  const csvContent = exportHabitsToCSV(habits);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `growzok-habit-history-${todayStr()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(str: string): string {
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
