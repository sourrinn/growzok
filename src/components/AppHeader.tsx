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
    <header className="sticky top-0 z-40 mb-8 border-b border-mist/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Brand + Nav Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-charcoal font-display text-base font-bold text-ink">
              G
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-charcoal">
              Growzok
            </span>
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`transition-colors ${
                active === "habits"
                  ? "text-charcoal underline underline-offset-8"
                  : "text-muted hover:text-charcoal"
              }`}
            >
              Habits
            </Link>
            <Link
              href="/reports"
              className={`transition-colors ${
                active === "reports"
                  ? "text-charcoal underline underline-offset-8"
                  : "text-muted hover:text-charcoal"
              }`}
            >
              Reports
            </Link>
            <Link
              href="/templates"
              className={`transition-colors ${
                active === "templates"
                  ? "text-charcoal underline underline-offset-8"
                  : "text-muted hover:text-charcoal"
              }`}
            >
              Templates
            </Link>
          </nav>
        </div>

        {/* Right: User Profile & Sign Out */}
        <div className="flex items-center gap-3.5">
          {userLabel && (
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-mist text-xs font-semibold text-charcoal uppercase">
                {userLabel[0]}
              </div>
              <span className="max-w-[160px] truncate text-xs text-muted">
                {userLabel}
              </span>
            </div>
          )}

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-md border border-mist/80 px-2.5 py-1 text-xs text-muted transition-colors hover:border-ember/40 hover:text-ember"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
