import { Suspense } from "react";
import { SessionClient } from "./SessionClient";
import { HorseLoader } from "@/components/HorseLoader";

export const metadata = {
  title: "Active Session — Growzok",
  description: "L3 Focus Mode — execute your habit with full accountability and a countdown timer.",
};

export default function SessionPage() {
  return (
    <Suspense fallback={<HorseLoader size="lg" label="Loading Session..." />}>
      <SessionClient />
    </Suspense>
  );
}
