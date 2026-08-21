import { Suspense } from "react";
import { StrategicClient } from "./StrategicClient";
import { HorseLoader } from "@/components/HorseLoader";

export const metadata = {
  title: "Strategic Board — Growzok",
  description: "L1 Strategic — define your goals, themes, projects, and questions.",
};

export default function StrategicPage() {
  return (
    <Suspense fallback={<HorseLoader size="lg" label="Loading Your Strategic Board..." />}>
      <StrategicClient />
    </Suspense>
  );
}
