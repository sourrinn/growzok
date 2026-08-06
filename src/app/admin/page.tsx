import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminPortalView from "@/components/AdminPortalView";

export const metadata: Metadata = {
  title: "Admin Portal — Growzok",
  description: "Organization admin management for custom habit systems and master habit catalog.",
};

const ADMIN_EMAIL = "sourinbiswas002@gmail.com";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  return <AdminPortalView />;
}
