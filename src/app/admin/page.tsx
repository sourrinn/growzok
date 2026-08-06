import type { Metadata } from "next";
import AdminPortalView from "@/components/AdminPortalView";

export const metadata: Metadata = {
  title: "Admin Portal — Growzok",
  description: "Organization admin management for custom habit systems and master habit catalog.",
};

export default function AdminPage() {
  return <AdminPortalView />;
}
