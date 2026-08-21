import { Suspense } from "react";
import { TimelineClient } from "./TimelineClient";
import { HorseLoader } from "@/components/HorseLoader";

export const metadata = {
  title: "Day Planner — Growzok",
  description: "L2 Temporal — plan your day with energy-aware time blocks.",
};

export default function TimelinePage() {
  return (
    <Suspense fallback={<HorseLoader size="lg" label="Building Your Day..." />}>
      <TimelineClient />
    </Suspense>
  );
}
