import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import DashboardCommandHub from "./DashboardCommandHub";

export const metadata = {
  title: "Visionary Life OS Command Center | Growzok",
  description: "Central command control hub for habits, circadian optics, intermittent fasting, and biometrics.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <AppShell userLabel={userName}>
      <DashboardCommandHub />
    </AppShell>
  );
}
