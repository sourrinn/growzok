import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import HabitsClient from "./HabitsClient";

export const metadata = {
  title: "Habits & Routines Workspace | Growzok Life OS",
  description: "Track habits, manage habit stacks, and view 14-day completion velocity sparklines.",
};

export default async function HabitsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <AppShell userLabel={userName}>
      <HabitsClient />
    </AppShell>
  );
}
