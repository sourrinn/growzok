import type { Habit } from "@/types/habit";

/** Format Date object as UTC string for iCal (YYYYMMDDTHHMMSSZ) */
function formatICalDate(d: Date): string {
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/** Format date string YYYY-MM-DD for iCal VALUE=DATE */
function formatICalDay(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

/**
 * Generate RFC 5545 iCalendar format string for a user's habits list.
 * Compatible with Google Calendar, Apple Calendar, Outlook, and Thunderbird.
 */
export function generateICalFeed(habits: Habit[], userName = "Growzok User"): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Growzok//Habit Tracker iCal Feed//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${userName}'s Growzok Habit Routines`,
    "X-WR-TIMEZONE:UTC",
  ];

  const now = new Date();
  const dtStamp = formatICalDate(now);

  for (const habit of habits) {
    const createdDate = new Date(habit.createdAt || Date.now());
    const startDayStr = habit.createdAt ? habit.createdAt.slice(0, 10) : todayStr();
    const dtStart = formatICalDay(startDayStr);

    // Build VEVENT for the habit
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:habit-${habit.id}@growzok.app`);
    lines.push(`DTSTAMP:${dtStamp}`);
    lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
    lines.push(`SUMMARY:🌱 ${habit.name}`);
    lines.push(
      `DESCRIPTION:Biological Domain: ${habit.domain} | Category: ${habit.userLabel || habit.category}`
    );
    lines.push(`CATEGORIES:${habit.domain},Growzok`);

    // Add Recurrence Rule (RRULE) based on frequency
    if (habit.frequency.type === "daily") {
      lines.push("RRULE:FREQ=DAILY");
    } else if (habit.frequency.type === "weekdays") {
      lines.push("RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR");
    } else if (habit.frequency.type === "weekends") {
      lines.push("RRULE:FREQ=WEEKLY;BYDAY=SA,SU");
    } else if (habit.frequency.type === "custom" && habit.frequency.days.length > 0) {
      const dayMap = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
      const byDays = habit.frequency.days.map((d) => dayMap[d % 7]).join(",");
      lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${byDays}`);
    }

    lines.push("END:VEVENT");
  }

  // Include recent completion events as past achievements
  for (const habit of habits) {
    for (const dateStr of habit.history.slice(-30)) {
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:completion-${habit.id}-${dateStr}@growzok.app`);
      lines.push(`DTSTAMP:${dtStamp}`);
      lines.push(`DTSTART;VALUE=DATE:${formatICalDay(dateStr)}`);
      lines.push(`SUMMARY:✅ Completed: ${habit.name}`);
      lines.push(`DESCRIPTION:Logged completion for ${dateStr} on Growzok.`);
      lines.push("END:VEVENT");
    }
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}
