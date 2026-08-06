import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import AccountView from "@/components/AccountView";
import { listHabits } from "@/lib/habits";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userName = session.user.name || "";
  const userEmail = session.user.email || "";
  const habits = await listHabits(session.user.id);

  return (
    <AppShell userLabel={userName || userEmail}>
      <AccountView
        userName={userName}
        userEmail={userEmail}
        habitsCount={habits.length}
      />
    </AppShell>
  );
}
