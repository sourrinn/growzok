import { Suspense } from "react";
import { HorseLoader } from "@/components/HorseLoader";
import ImportClient from "./ImportClient";

export const metadata = {
  title: "Import Protocol Stack | Growzok Habits",
  description: "Preview and adopt a shared custom habit routine stack into your Growzok account for free.",
};

export default function ImportProtocolPage() {
  return (
    <Suspense fallback={<HorseLoader size="lg" label="Importing Protocol Stack..." />}>
      <ImportClient />
    </Suspense>
  );
}
