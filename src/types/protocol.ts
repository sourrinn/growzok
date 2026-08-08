import type { HabitDomain, HabitFrequency, HabitTarget } from "@/types/habit";

export interface ProtocolAuthor {
  name: string;
  role: string;
  avatarUrl?: string;
  verified: boolean;
}

/**
 * A single habit within a protocol framework. Each item carries its unique master
 * habitKey, scientific Domain, suggested User Label, and optional target / miss allowance overrides.
 */
export interface ProtocolHabit {
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

/** Protocol Category — the curatorial wrapper for protocol frameworks (admin-managed). */
export type ProtocolCategory =
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

export type ProtocolDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Protocol {
  key: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  overviewMarkdown: string;
  category: ProtocolCategory;
  difficulty: ProtocolDifficulty;
  estimatedDailyMinutes: number;
  durationDays?: number;
  rating: number;
  reviewsCount: number;
  activeUsersCount: number;
  completionRatePct: number;
  author: ProtocolAuthor;
  tags: string[];
  habits: ProtocolHabit[];
}

// Aliases for transition
export type HabitTemplate = Protocol;
export type TemplateCategory = ProtocolCategory;
export type TemplateDifficulty = ProtocolDifficulty;
export type TemplateHabitOverride = ProtocolHabit;
export type TemplateAuthor = ProtocolAuthor;
