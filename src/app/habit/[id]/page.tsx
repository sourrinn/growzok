import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppHeader from "@/components/AppHeader";
import HabitDetail from "@/components/HabitDetail";

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;

  return (
    <main className="mx-auto max-w-xl px-5 pb-24 pt-12">
      <AppHeader
        userLabel={session.user.name || session.user.email || ""}
        active="habits"
      />
      <HabitDetail habitId={id} />
    </main>
  );
}
