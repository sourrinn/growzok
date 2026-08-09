import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import PlaybooksClient from "./PlaybooksClient";

export const metadata = {
  title: "Neuroscience Playbooks | Growzok OS",
  description: "Peer-reviewed masterclass guides for circadian light, NSDR, and dopamine baseline reset.",
};

export default async function PlaybooksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <AppShell userLabel={userName}>
      <PlaybooksClient />
    </AppShell>
  );
}
