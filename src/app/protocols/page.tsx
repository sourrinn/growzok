import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import ProtocolsView from "@/components/ProtocolsView";

export default async function ProtocolsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <AppShell userLabel={userName}>
      <ProtocolsView />
    </AppShell>
  );
}
