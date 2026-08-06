import type { HabitDomain, HabitFrequency, HabitTarget } from "@/types/habit";

export interface TemplateAuthor {
  name: string;
  role: string;
  avatarUrl?: string;
  verified: boolean;
}

/**
 * A single habit within a template bundle. Each item carries its unique master
 * habitKey, scientific Domain, suggested User Label, and optional target / miss allowance overrides.
 */
export interface TemplateHabitOverride {
  habitKey: string;              // Immutable master habit key (e.g. "sunlight-exposure")
  name: string;
  domain: HabitDomain;           // 16-enum scientific domain (immutable)
  suggestedLabel: string;        // Suggested user-facing label (e.g. "Health", "Work")
  frequency: HabitFrequency;
  target?: HabitTarget | null;
  missAllowance?: number;
  timeOfDay?: "Morning" | "Afternoon" | "Evening" | "Anytime";
  description?: string;
}

/** Template Category — the curatorial wrapper for bundles (admin-managed). */
export type TemplateCategory =
  | "Morning Routine"
  | "Sleep & Rest"
  | "Nutrition & Hydration"
  | "Fitness & Movement"
  | "Productivity & Focus"
  | "Digital Detox"
  | "Financial Hygiene"
  | "Evening Wind-Down"
  | "Developer & Career"
  | "Mindset & Wellbeing";

export type TemplateDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface HabitTemplate {
  key: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  overviewMarkdown: string;
  category: TemplateCategory;
  difficulty: TemplateDifficulty;
  estimatedDailyMinutes: number;
  durationDays?: number;
  rating: number;
  reviewsCount: number;
  activeUsersCount: number;
  completionRatePct: number;
  author: TemplateAuthor;
  tags: string[];
  habits: TemplateHabitOverride[];
}
