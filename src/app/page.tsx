import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import HabitDashboard from "@/components/HabitDashboard";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <main className="mx-auto max-w-xl px-5 pb-24 pt-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="truncate text-sm text-muted">
          {session.user.name || session.user.email}
        </p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="flex-shrink-0 text-sm text-muted transition-colors hover:text-ember"
          >
            Sign out
          </button>
        </form>
      </div>

      <HabitDashboard />
    </main>
  );
}
