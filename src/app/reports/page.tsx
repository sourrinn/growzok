import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppHeader from "@/components/AppHeader";
import ReportsView from "@/components/ReportsView";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <main className="mx-auto max-w-xl px-5 pb-24 pt-12">
      <AppHeader
        userLabel={session.user.name || session.user.email || ""}
        active="reports"
      />
      <ReportsView />
    </main>
  );
}
