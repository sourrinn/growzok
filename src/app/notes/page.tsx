import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import { NotesClient } from "./NotesClient";
import { HorseLoader } from "@/components/HorseLoader";

export const metadata = {
  title: "Notes Workspace — Growzok",
  description: "Standalone Notes Engine — capture thoughts, pin key ideas, tag friction points, and organize your mind.",
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
