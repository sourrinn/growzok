import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import CircadianClient from "./CircadianClient";

export const metadata = {
  title: "Circadian Solar Window Calculator | Growzok OS",
  description: "Calculate solar noon, morning photic window, and digital sunset cutoff for free.",
};

export default async function CircadianPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <AppShell userLabel={userName}>
      <CircadianClient />
    </AppShell>
  );
}
