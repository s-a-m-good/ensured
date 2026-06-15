"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    }

    loadUser();
  }, [supabase.auth]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          Account
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Your Ensured account.
        </h1>

        {loading && (
          <p className="mt-8 text-blue-100/70">Loading your account...</p>
        )}

        {!loading && !user && (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-2xl font-semibold">You are not signed in.</h2>
            <p className="mt-3 leading-7 text-blue-100/70">
              Sign in or create an account to save your insurance profile.
            </p>

            <a
              href="/auth"
              className="mt-6 inline-flex rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] transition hover:bg-blue-300"
            >
              Go to sign in
            </a>
          </div>
        )}

        {!loading && user && (
          <div className="mt-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
              <h2 className="text-2xl font-semibold">Signed in</h2>

              <p className="mt-4 text-sm text-blue-100/50">Email</p>
              <p className="mt-1 text-lg">{user.email}</p>

              <p className="mt-4 text-sm text-blue-100/50">User ID</p>
              <p className="mt-1 break-all text-sm text-blue-100/70">
                {user.id}
              </p>

              <button
                type="button"
                onClick={handleSignOut}
                className="mt-6 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Sign out
              </button>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
              <h2 className="text-2xl font-semibold">Coming next</h2>

              <div className="mt-5 space-y-4">
                {[
                  "Save latest coverage scout report",
                  "Store insurance profile answers",
                  "Add policy vault",
                  "Add renewal reminders",
                  "Add saved alerts",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4"
                  >
                    <p className="text-blue-100/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}