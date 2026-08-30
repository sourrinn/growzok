import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import { NotesClient } from "./NotesClient";
import { HorseLoader } from "@/components/HorseLoader";

export const metadata = {
  title: "Rough Notes Scratchpad — Growzok",
  description: "Layer 1 Cognitive Dump — offload working memory, mental noise, and friction points.",
};

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <AppShell userLabel={userName}>
      <Suspense fallback={<HorseLoader size="lg" label="Loading Rough Notes..." />}>
        <NotesClient />
      </Suspense>
    </AppShell>
  );
}
