"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Sign in failed: ${error.message}`);
      setLoading(false);
      return;
    }

    window.location.href = "/account";
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            Sign in
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Welcome back.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/70">
            Sign in to access your saved insurance workspace.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <h2 className="text-3xl font-semibold">Sign in</h2>

          <form onSubmit={handleSignIn} className="mt-6">
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full cursor-pointer rounded-full bg-blue-400 px-6 py-4 font-semibold text-[#07111f] transition hover:scale-[1.02] hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {message && (
              <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-blue-100/75">
                {message}
              </p>
            )}
          </form>

          <p className="mt-5 text-center text-sm text-blue-100/50">
            Need an account?{" "}
            <a href="/auth/sign-up" className="text-blue-300 hover:text-blue-200">
              Create one
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
