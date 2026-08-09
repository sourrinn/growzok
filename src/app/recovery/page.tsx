import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import RecoveryClient from "./RecoveryClient";

export const metadata = {
  title: "Cold Thermogenesis & Sauna Recovery Log | Growzok OS",
  description: "Log deliberate cold exposure and sauna recovery sessions for free.",
};

export default async function RecoveryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <AppShell userLabel={userName}>
      <RecoveryClient />
    </AppShell>
  );
}
