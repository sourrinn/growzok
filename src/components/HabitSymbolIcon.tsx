"use client";

import type { HabitDomain } from "@/types/habit";

interface HabitSymbolIconProps {
  domain?: HabitDomain | string;
  habitName?: string;
  className?: string;
}

export default function HabitSymbolIcon({
  domain,
  habitName = "",
  className = "h-5 w-5",
}: HabitSymbolIconProps) {
  const d = (domain || "").toLowerCase();
  const name = (habitName || "").toLowerCase();

  // 1. Sleep
  if (d.includes("sleep") || name.includes("sleep") || name.includes("bed") || name.includes("night")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }

  // 2. Hydration / Water
  if (d.includes("hydration") || name.includes("water") || name.includes("hydrate") || name.includes("drink")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    );
  }

  // 3. Nutrition / Food
  if (d.includes("nutrition") || d.includes("gut") || name.includes("food") || name.includes("eat") || name.includes("meal") || name.includes("protein")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.5 10-10 10z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    );
  }

  // 4. Cardio / Running / Walking
  if (d.includes("cardio") || name.includes("run") || name.includes("walk") || name.includes("cardio") || name.includes("heart")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    );
  }

  // 5. Strength / Workout
  if (d.includes("strength") || name.includes("gym") || name.includes("lift") || name.includes("workout") || name.includes("pushup")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6.5 6.5h11M6.5 17.5h11M4 9v6M20 9v6M9 6.5v11M15 6.5v11" />
      </svg>
    );
  }

  // 6. Mobility / Stretch
  if (d.includes("mobility") || name.includes("stretch") || name.includes("yoga") || name.includes("joint")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="5" r="2" />
        <path d="M9 20l3-7 3 7M6 10l6-2 6 2M12 13V7" />
      </svg>
    );
  }

  // 7. Breathing / Breathwork
  if (d.includes("breath") || name.includes("breath") || name.includes("nsdr") || name.includes("meditat")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44L7 19.5a2.5 2.5 0 0 1 2.5-2.5" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44L17 19.5a2.5 2.5 0 0 0-2.5-2.5" />
      </svg>
    );
  }

  // 8. Recovery / Thermal
  if (d.includes("recovery") || name.includes("sauna") || name.includes("cold") || name.includes("shower") || name.includes("ice")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M23 4v6h-6M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    );
  }

  // 9. Finance / Money
  if (d.includes("finance") || name.includes("money") || name.includes("budget") || name.includes("expense") || name.includes("save")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    );
  }

  // 10. Digital Minimalism / Phone
  if (d.includes("digital") || name.includes("phone") || name.includes("screen") || name.includes("scroll") || name.includes("app")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
      </svg>
    );
  }

  // 11. Learning / Reading
  if (d.includes("learning") || name.includes("read") || name.includes("book") || name.includes("study") || name.includes("learn")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }

  // 12. Productivity / Focus
  if (d.includes("productivity") || name.includes("work") || name.includes("focus") || name.includes("task") || name.includes("plan")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }

  // Default Universal Geometric Compass / Spark Symbol (No Letters!)
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
