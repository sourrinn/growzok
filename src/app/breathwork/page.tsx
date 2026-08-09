import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import BreathworkClient from "./BreathworkClient";

export const metadata = {
  title: "Breathwork Pacing Studio | Growzok OS",
  description: "Interactive paced breathing workstation for parasympathetic nervous system activation.",
};

export default async function BreathworkPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <AppShell userLabel={userName}>
      <BreathworkClient />
    </AppShell>
  );
}
