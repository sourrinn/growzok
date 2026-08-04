import Link from "next/link";
import { signOut } from "@/auth";

export default function AppHeader({
  userLabel,
  active,
}: {
  userLabel: string;
  active: "habits" | "reports" | "templates";
}) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <nav className="flex items-center gap-4 text-sm">
        <Link
          href="/"
          className={
            active === "habits"
              ? "font-medium text-charcoal"
              : "text-muted transition-colors hover:text-charcoal"
          }
        >
          Habits
        </Link>
        <Link
          href="/reports"
          className={
            active === "reports"
              ? "font-medium text-charcoal"
              : "text-muted transition-colors hover:text-charcoal"
          }
        >
          Reports
        </Link>
        <Link
          href="/templates"
          className={
            active === "templates"
              ? "font-medium text-charcoal"
              : "text-muted transition-colors hover:text-charcoal"
          }
        >
          Templates
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <p className="truncate text-sm text-muted">{userLabel}</p>
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
    </div>
  );
}
