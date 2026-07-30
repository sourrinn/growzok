import type { HabitCategory, HabitFrequency } from "@/types/habit";

export interface HabitTemplateItem {
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
}

export interface HabitTemplate {
  key: string;
  name: string;
  description: string;
  habits: HabitTemplateItem[];
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    key: "fitness30",
    name: "30-Day Fitness",
    description: "Workout, stretch, and hydrate daily.",
    habits: [
      { name: "Workout", category: "Fitness", frequency: { type: "daily" } },
      { name: "Stretching", category: "Fitness", frequency: { type: "daily" } },
      { name: "Drink Water", category: "Health", frequency: { type: "daily" } },
    ],
  },
  {
    key: "student",
    name: "Student",
    description: "Study rhythm for the semester.",
    habits: [
      { name: "Study", category: "Learning", frequency: { type: "weekdays" } },
      { name: "Review Notes", category: "Learning", frequency: { type: "daily" } },
      { name: "Sleep by 11pm", category: "Health", frequency: { type: "daily" } },
    ],
  },
  {
    key: "developer",
    name: "Developer",
    description: "Keep skills and posture sharp.",
    habits: [
      { name: "Code a Side Project", category: "Learning", frequency: { type: "timesPerWeek", times: 4 } },
      { name: "Read Docs / Articles", category: "Learning", frequency: { type: "weekdays" } },
      { name: "Stretch / Walk Break", category: "Health", frequency: { type: "weekdays" } },
    ],
  },
  {
    key: "morning",
    name: "Morning Routine",
    description: "Start the day intentionally.",
    habits: [
      { name: "Make the Bed", category: "Productivity", frequency: { type: "daily" } },
      { name: "Meditate", category: "Health", frequency: { type: "daily" } },
      { name: "Plan the Day", category: "Productivity", frequency: { type: "daily" } },
    ],
  },
];
