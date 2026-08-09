import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import FastingClient from "./FastingClient";

export const metadata = {
  title: "Intermittent Fasting & Autophagy Clock | Growzok OS",
  description: "Track intermittent fasting duration and monitor real-time cellular autophagy stages for free.",
};

export default async function FastingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <AppShell userLabel={userName}>
      <FastingClient />
    </AppShell>
  );
}
