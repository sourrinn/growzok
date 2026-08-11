"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { HorseLoader } from "@/components/HorseLoader";

type Mode = "login" | "register";

const inputClass =
  "w-full border-b border-[#e5e1d7] dark:border-[#27272a] bg-transparent px-0.5 py-2 text-base text-[#232f26] dark:text-[#f4f4f5] outline-none transition-colors placeholder:text-[#737970] dark:placeholder:text-[#a1a1aa] focus:border-[#232f26] dark:focus:border-[#3f3f46]";

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
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-[#737970] dark:text-[#a1a1aa]">
          {isRegister
            ? "Start keeping your streaks."
            : "Sign in to keep your streaks."}
        </p>
      </header>

      <form onSubmit={submit} className="space-y-5" noValidate>
        {isRegister && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">
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
          <span className="mb-1.5 block text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">
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
          <span className="mb-1.5 block text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={isRegister ? 8 : undefined}
            maxLength={200}
            required
            placeholder={isRegister ? "At least 8 characters" : "Your password"}
            className={inputClass}
          />
        </label>

        {error && (
          <p className="rounded-xl border border-[#be5a38]/30 bg-[#be5a38]/10 px-3.5 py-2.5 text-xs font-semibold text-[#be5a38]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-[#232f26] py-3 text-xs font-bold text-white dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46] shadow-sm transition-all hover:bg-black dark:hover:bg-[#3f3f46] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {pending ? (
            <>
              <HorseLoader size="sm" inline />
              <span>{isRegister ? "Creating Account..." : "Authenticating..."}</span>
            </>
          ) : isRegister ? (
            "Create account"
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#737970] dark:text-[#a1a1aa]">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#232f26] dark:text-[#f4f4f5] hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/register" className="font-semibold text-[#232f26] dark:text-[#f4f4f5] hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
