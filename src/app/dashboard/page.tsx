import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppHeader from "@/components/AppHeader";
import HabitDashboard from "@/components/HabitDashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || session.user.email || "";

  return (
    <div className="min-h-screen bg-slate-50/40">
      <AppHeader userLabel={userName} active="habits" />
      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <HabitDashboard />
      </main>
    </div>
  );
}
