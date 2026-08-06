import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import AdminPortalView from "@/components/AdminPortalView";

export const metadata: Metadata = {
  title: "Admin Portal — Growzok",
  description: "Organization admin management for custom habit systems and master habit catalog.",
};

export default function AdminPage() {
  return (
    <AppShell userLabel="Admin Portal">
      <AdminPortalView />
    </AppShell>
  );
}
