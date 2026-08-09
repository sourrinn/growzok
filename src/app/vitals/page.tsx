import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import VitalsClient from "./VitalsClient";

export const metadata = {
  title: "Biometric Vitals & Biomarker Tracker | Growzok OS",
  description: "Track resting heart rate, HRV recovery, sleep duration, and body weight for free.",
};

export default async function VitalsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <AppShell userLabel={userName}>
      <VitalsClient />
    </AppShell>
  );
}
