"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const supabase = createClient();

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "sign-up") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Account created. Check your email if confirmation is enabled, then sign in."
        );
      }
    }

    if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        window.location.href = "/account";
      }
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            Ensured account
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Save your insurance profile.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/70">
            Create an account so Ensured can eventually save estimates, policy
            documents, alerts, renewal dates, and coverage reports.
          </p>

          <div className="mt-8 rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 p-5">
            <p className="text-sm leading-6 text-yellow-50/80">
              Prototype note: account features are being added gradually. Do not
              upload real policy documents yet.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <div className="mb-6 flex rounded-full border border-white/10 bg-[#0d1b2f] p-1">
            <button
              type="button"
              onClick={() => {
                setMode("sign-in");
                setMessage("");
              }}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
                mode === "sign-in"
                  ? "bg-blue-300 text-[#07111f]"
                  : "text-blue-100/70 hover:text-white"
              }`}
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("sign-up");
                setMessage("");
              }}
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
                mode === "sign-up"
                  ? "bg-blue-300 text-[#07111f]"
                  : "text-blue-100/70 hover:text-white"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-blue-100">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-medium text-blue-100">
                Password
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-blue-400 px-6 py-4 font-semibold text-[#07111f] transition hover:scale-[1.02] hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "sign-in"
                ? "Sign in"
                : "Create account"}
            </button>

            {message && (
              <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-blue-100/75">
                {message}
              </p>
            )}
          </form>

          <p className="mt-5 text-center text-sm text-blue-100/50">
            After signing in, go to{" "}
            <Link href="/account" className="text-blue-300 hover:text-blue-200">
              your account
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}