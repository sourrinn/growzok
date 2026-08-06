import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppHeader from "@/components/AppHeader";
import ReportsView from "@/components/ReportsView";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <div className="min-h-screen bg-slate-50/40">
      <AppHeader userLabel={userName} active="reports" />
      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <ReportsView />
      </main>
    </div>
  );
}
