"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

type Mode = "login" | "register";

const inputClass =
  "w-full border-b border-mist bg-transparent px-0.5 py-2 text-base text-charcoal outline-none transition-colors placeholder:text-muted focus:border-sage";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);

    try {
      if (isRegister) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Could not create your account.");
          setPending(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // next-auth's signIn() can resolve to undefined (not an {error} object) in
      // some internal fallback paths, which would otherwise read as success here.
      if (!result || result.error) {
        setError(
          isRegister
            ? "Account created, but sign-in failed. Try logging in."
            : "Invalid email or password."
        );
        setPending(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  };

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-medium tracking-tight text-charcoal">
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {isRegister
            ? "Start keeping your streaks."
            : "Sign in to keep your streaks."}
        </p>
      </header>

      <form onSubmit={submit} className="space-y-5" noValidate>
        {isRegister && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-charcoal">
              Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={60}
              required
              placeholder="Your name"
              className={inputClass}
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-charcoal">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-charcoal">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={isRegister ? 8 : undefined}
            maxLength={200} // mirrors MAX_PASSWORD_LENGTH in src/lib/password.ts
            required
            placeholder={isRegister ? "At least 8 characters" : "Your password"}
            className={inputClass}
          />
        </label>

        {error && (
          <p className="rounded border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-ember">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-sm bg-charcoal py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-80 active:opacity-60 disabled:opacity-50"
        >
          {pending
            ? isRegister
              ? "Creating…"
              : "Signing in…"
            : isRegister
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-sage hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/register" className="text-sage hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
