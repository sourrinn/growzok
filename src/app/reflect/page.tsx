import { Suspense } from "react";
import { ReflectClient } from "./ReflectClient";
import { HorseLoader } from "@/components/HorseLoader";

export const metadata = {
  title: "Daily Reflect — Growzok",
  description: "L5 Reflective — review today, learn from patterns, adapt your system.",
};

export default function ReflectPage() {
  return (
    <Suspense fallback={<HorseLoader size="lg" label="Loading Your Reflection..." />}>
      <ReflectClient />
    </Suspense>
  );
}
