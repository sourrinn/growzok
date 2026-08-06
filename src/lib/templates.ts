import type { HabitTemplate, TemplateCategory } from "@/types/template";

export type { HabitTemplate, TemplateHabitOverride, TemplateCategory, TemplateDifficulty } from "@/types/template";

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    key: "huberman-morning",
    slug: "huberman-morning",
    name: "Neuro-Reset Morning Protocol",
    tagline: "Optimize circadian rhythm, alertness, and mood with science-backed habits.",
    description:
      "Designed around neurobiology research to boost morning cortisol awakening response, accelerate fat oxidation, and maximize mental clarity.",
    overviewMarkdown: `
### Why This System Works

Derived from human physiology & neurobiology studies, this 30-day morning protocol aligns your biological clock.

- **Sunlight Exposure**: Triggers early cortisol peak, setting an automatic 16-hour sleep timer for high-quality REM & deep sleep.
- **Delayed Caffeine**: Prevents the mid-afternoon energy crash by allowing adenosine clearing before receptor blockage.
- **Cold Exposure**: Triggers epinephrine release for sustained dopamine elevation throughout the morning.
    `,
    category: "Morning Routine",
    difficulty: "Intermediate",
    estimatedDailyMinutes: 25,
    durationDays: 30,
    rating: 0,
    reviewsCount: 0,
    activeUsersCount: 0,
    completionRatePct: 0,
    author: {
      name: "Growzok Neuroscience Lab",
      role: "Human Performance & Physiology",
      verified: true,
    },
    tags: ["Circadian Rhythm", "Energy", "Focus", "Morning"],
    habits: [
      {
        habitKey: "sunlight-exposure",
        name: "Sunlight Outdoor Exposure",
        domain: "Sleep",
        suggestedLabel: "Health",
        frequency: { type: "daily" },
        target: { type: "time", goal: 10, unit: "mins" },
        timeOfDay: "Morning",
        description: "Get direct outdoor sunlight within 30–60 minutes of waking.",
      },
      {
        habitKey: "hydrate-electrolytes",
        name: "Hydrate + Electrolytes",
        domain: "Hydration",
        suggestedLabel: "Health",
        frequency: { type: "daily" },
        target: { type: "count", goal: 500, unit: "ml" },
        timeOfDay: "Morning",
        description: "Rehydrate with water and a pinch of unrefined salt before coffee.",
      },
      {
        habitKey: "cold-shower-reset",
        name: "Cold Shower Reset",
        domain: "Recovery",
        suggestedLabel: "Health",
        frequency: { type: "daily" },
        target: { type: "time", goal: 2, unit: "mins" },
        timeOfDay: "Morning",
        description: "End shower with 2 minutes of cold water for a dopamine boost.",
      },
      {
        habitKey: "delay-caffeine",
        name: "Delay Caffeine 90 Mins",
        domain: "Nutrition",
        suggestedLabel: "Health",
        frequency: { type: "weekdays" },
        missAllowance: 1,
        timeOfDay: "Morning",
        description: "Wait 90–120 minutes post-waking before consuming your first coffee.",
      },
    ],
  },
  {
    key: "deep-work-focus",
    slug: "deep-work-focus",
    name: "Deep Work & Hyper-Focus Engine",
    tagline: "Build intense concentration habits to produce high-value creative output.",
    description:
      "Eliminate low-value distractions and establish uninterrupted 90-minute hyper-focus blocks every working day.",
    overviewMarkdown: `
### Master Distraction-Free Execution

Context switching destroys cognitive capacity. This system enforces strict boundaries around high-yield work blocks.

- **90-Minute Focus Cycles**: Matches human ultradian rhythms for peak cognitive performance.
- **Zero Phone First Hour**: Protects your proactive mindset before reactive inputs hijack attention.
    `,
    category: "Productivity & Focus",
    difficulty: "Advanced",
    estimatedDailyMinutes: 120,
    rating: 0,
    reviewsCount: 0,
    activeUsersCount: 0,
    completionRatePct: 0,
    author: {
      name: "Marcus Vance",
      role: "Productivity Strategist & Author",
      verified: true,
    },
    tags: ["Deep Work", "Focus", "Flow State", "Career"],
    habits: [
      {
        habitKey: "uninterrupted-focus-block",
        name: "Uninterrupted Focus Block",
        domain: "Productivity",
        suggestedLabel: "Work",
        frequency: { type: "weekdays" },
        target: { type: "time", goal: 90, unit: "mins" },
        timeOfDay: "Morning",
        description: "Single-task on priority #1 with zero notifications or open tabs.",
      },
      {
        habitKey: "zero-phone-first-hour",
        name: "Zero Phone First Hour",
        domain: "Digital Minimalism",
        suggestedLabel: "Mindset",
        frequency: { type: "daily" },
        missAllowance: 1,
        timeOfDay: "Morning",
        description: "Do not open email or social media during your first waking hour.",
      },
      {
        habitKey: "evening-daily-shutdown",
        name: "Evening Daily Shutdown",
        domain: "Productivity",
        suggestedLabel: "Work",
        frequency: { type: "weekdays" },
        timeOfDay: "Evening",
        description: "Review open tasks, plan tomorrow's top priority, and close all work tabs.",
      },
    ],
  },
  {
    key: "fitness30",
    slug: "fitness30",
    name: "30-Day Fitness & Strength",
    tagline: "Build a consistent athletic routine with progressive daily movement.",
    description:
      "A balanced, approachable daily movement system combining resistance training, daily steps, and mobility work.",
    overviewMarkdown: `
### Build Habitual Consistency First

Intensity without consistency leads to burnout. This 30-day program focuses on daily physical momentum.
    `,
    category: "Fitness & Movement",
    difficulty: "Beginner",
    estimatedDailyMinutes: 45,
    durationDays: 30,
    rating: 0,
    reviewsCount: 0,
    activeUsersCount: 0,
    completionRatePct: 0,
    author: {
      name: "Coach Sarah Jenkins",
      role: "Strength & Conditioning Specialist",
      verified: true,
    },
    tags: ["Fitness", "Strength", "Movement", "Health"],
    habits: [
      {
        habitKey: "daily-movement-workout",
        name: "Daily Movement / Workout",
        domain: "Strength",
        suggestedLabel: "Fitness",
        frequency: { type: "daily" },
        target: { type: "time", goal: 30, unit: "mins" },
        timeOfDay: "Anytime",
        description: "Resistance training, run, or brisk exercise session.",
      },
      {
        habitKey: "daily-step-goal",
        name: "Daily Step Goal",
        domain: "Cardio",
        suggestedLabel: "Fitness",
        frequency: { type: "daily" },
        target: { type: "count", goal: 8000, unit: "steps" },
        timeOfDay: "Anytime",
        description: "Maintain active non-exercise activity thermogenesis (NEAT).",
      },
      {
        habitKey: "post-workout-mobility",
        name: "Post-Workout Mobility",
        domain: "Mobility",
        suggestedLabel: "Health",
        frequency: { type: "daily" },
        target: { type: "time", goal: 10, unit: "mins" },
        timeOfDay: "Evening",
        description: "Stretching and foam rolling for muscle recovery.",
      },
    ],
  },
  {
    key: "developer-rhythm",
    slug: "developer-rhythm",
    name: "Software Engineer Growth System",
    tagline: "Keep coding skills sharp, posture healthy, and knowledge expanding.",
    description:
      "Tailored for developers: balances deep coding sessions, technical reading, and ergonomic wellness breaks.",
    overviewMarkdown: `
### Sustainable Engineering Habits

Prevent engineering burnout while consistently shipping code and keeping up with evolving tech stacks.
    `,
    category: "Developer & Career",
    difficulty: "Intermediate",
    estimatedDailyMinutes: 60,
    rating: 0,
    reviewsCount: 0,
    activeUsersCount: 0,
    completionRatePct: 0,
    author: {
      name: "Growzok Tech Collective",
      role: "Senior Engineering Mentors",
      verified: true,
    },
    tags: ["Coding", "Developer", "Learning", "Career"],
    habits: [
      {
        habitKey: "code-side-project",
        name: "Code Side Project / OSS",
        domain: "Learning",
        suggestedLabel: "Learning",
        frequency: { type: "timesPerWeek", times: 4 },
        target: { type: "time", goal: 45, unit: "mins" },
        timeOfDay: "Evening",
        description: "Build personal projects or contribute to open-source repos.",
      },
      {
        habitKey: "read-engineering-docs",
        name: "Read Engineering Docs/Articles",
        domain: "Learning",
        suggestedLabel: "Learning",
        frequency: { type: "weekdays" },
        target: { type: "time", goal: 15, unit: "mins" },
        timeOfDay: "Afternoon",
        description: "Stay current on architecture patterns, blog posts, or RFCs.",
      },
      {
        habitKey: "ergonomic-stretch-walk",
        name: "Ergonomic Stretch & Walk",
        domain: "Preventive",
        suggestedLabel: "Health",
        frequency: { type: "weekdays" },
        target: { type: "count", goal: 3, unit: "breaks" },
        timeOfDay: "Anytime",
        description: "Stand up, stretch wrists and posture every 90 minutes.",
      },
    ],
  },
  {
    key: "financial-hygiene",
    slug: "financial-hygiene",
    name: "Wealth Hygiene & Cash Flow Control",
    tagline: "Gain clarity over cash flow, eliminate impulsive spending, and invest systematically.",
    description:
      "Simple daily and weekly check-ins to manage personal finances with confidence and intent.",
    overviewMarkdown: `
### Financial Peace Through Daily Systems

Small daily awareness practices prevent end-of-month budget surprises.
    `,
    category: "Financial Hygiene",
    difficulty: "Beginner",
    estimatedDailyMinutes: 10,
    rating: 0,
    reviewsCount: 0,
    activeUsersCount: 0,
    completionRatePct: 0,
    author: {
      name: "David Chen, CFP",
      role: "Wealth Architect",
      verified: true,
    },
    tags: ["Finance", "Money", "Budgeting", "Wealth"],
    habits: [
      {
        habitKey: "log-daily-expenses",
        name: "Log Daily Expenses",
        domain: "Finance",
        suggestedLabel: "Finance",
        frequency: { type: "daily" },
        timeOfDay: "Evening",
        description: "Record all transactions for complete financial visibility.",
      },
      {
        habitKey: "zero-impulse-buy",
        name: "Zero Impulse Buy Challenge",
        domain: "Finance",
        suggestedLabel: "Finance",
        frequency: { type: "daily" },
        missAllowance: 1,
        timeOfDay: "Anytime",
        description: "Enforce a 48-hour cooling period for non-essential purchases.",
      },
      {
        habitKey: "weekly-budget-audit",
        name: "Weekly Net Worth & Budget Audit",
        domain: "Finance",
        suggestedLabel: "Finance",
        frequency: { type: "custom", days: [0] },
        target: { type: "time", goal: 15, unit: "mins" },
        timeOfDay: "Morning",
        description: "Review savings targets, subscriptions, and portfolio growth.",
      },
    ],
  },
  {
    key: "stoic-evening",
    slug: "stoic-evening",
    name: "Stoic Nightly Wind-Down",
    tagline: "Reflect on your day, quiet the mind, and ensure deep restorative sleep.",
    description:
      "Rooted in classic Stoic philosophy and sleep hygiene science to process the day and decompress.",
    overviewMarkdown: `
### Evening Reflection (The Stoic Evening Audit)

Seneca & Marcus Aurelius practiced reviewing their day before sleep.
    `,
    category: "Evening Wind-Down",
    difficulty: "Beginner",
    estimatedDailyMinutes: 15,
    rating: 0,
    reviewsCount: 0,
    activeUsersCount: 0,
    completionRatePct: 0,
    author: {
      name: "Mindful Living Guild",
      role: "Philosophy & Wellbeing",
      verified: true,
    },
    tags: ["Mindfulness", "Stoicism", "Sleep", "Personal"],
    habits: [
      {
        habitKey: "nightly-stoic-journal",
        name: "Nightly Stoic Journal",
        domain: "Sleep",
        suggestedLabel: "Personal",
        frequency: { type: "daily" },
        target: { type: "time", goal: 10, unit: "mins" },
        timeOfDay: "Evening",
        description: "Answer: What went well? What could I have done better?",
      },
      {
        habitKey: "screen-free-before-sleep",
        name: "Screen-Free 60 Mins Before Sleep",
        domain: "Digital Minimalism",
        suggestedLabel: "Health",
        frequency: { type: "daily" },
        missAllowance: 1,
        timeOfDay: "Evening",
        description: "Turn off phone/laptop screens to allow natural melatonin production.",
      },
      {
        habitKey: "prepare-environment-tomorrow",
        name: "Prepare Environment for Tomorrow",
        domain: "Productivity",
        suggestedLabel: "Personal",
        frequency: { type: "daily" },
        timeOfDay: "Evening",
        description: "Tidy your space, prep tomorrow's items, and make your bed.",
      },
    ],
  },
];

/** Look up a template by its key or slug. */
export function getTemplateByKey(key: string): HabitTemplate | undefined {
  return HABIT_TEMPLATES.find((t) => t.key === key || t.slug === key);
}

/** Filter templates by Template Category. */
export function getTemplatesByCategory(category: TemplateCategory | "All"): HabitTemplate[] {
  if (category === "All") return HABIT_TEMPLATES;
  return HABIT_TEMPLATES.filter((t) => t.category === category);
}

/** Get the unique set of Template Categories present in the catalog. */
export function getAvailableCategories(): TemplateCategory[] {
  return Array.from(new Set(HABIT_TEMPLATES.map((t) => t.category)));
}
