import { Suspense } from "react";
import ImportClient from "./ImportClient";

export const metadata = {
  title: "Import Protocol Stack | Growzok Habits",
  description: "Preview and adopt a shared custom habit routine stack into your Growzok account for free.",
};

export default function ImportProtocolPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#737970]">Loading import protocol...</div>}>
      <ImportClient />
    </Suspense>
  );
}
