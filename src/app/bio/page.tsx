import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import BioSuiteClient from "./BioSuiteClient";

export const metadata = {
  title: "Bio-Optimization Workstation Hub | Growzok Life OS",
  description: "Unified physiological suite for circadian optics, fasting autophagy, breathwork, recovery, and vitals.",
};

export default async function BioSuitePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <AppShell userLabel={userName}>
      <BioSuiteClient />
    </AppShell>
  );
}
