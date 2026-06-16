"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Estimate", href: "/estimate" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Gaps", href: "/gaps" },
  { label: "Policies", href: "/policies" },
  { label: "Alerts", href: "/alerts" },
  { label: "Account", href: "/account" },
  { label: "About", href: "/about" },
];

function shortenEmail(email: string) {
  if (email.length <= 26) return email;

  const [name, domain] = email.split("@");

  if (!domain) return `${email.slice(0, 24)}...`;

  return `${name.slice(0, 12)}...@${domain}`;
}

export default function SiteHeader() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setEmail(session?.user?.email ?? null);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Ensured
        </Link>

        <div className="hidden items-center gap-5 text-sm text-blue-100/80 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {email ? (
          <div className="group relative">
            <Link
              href="/account"
              className="inline-flex rounded-full border border-blue-300/20 bg-blue-400/10 px-5 py-2 text-sm font-semibold text-blue-100 transition hover:bg-blue-400/20"
            >
              Signed in as {shortenEmail(email)}
            </Link>

            <div className="invisible absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-white/10 bg-[#0d1b2f] p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link
                href="/account/settings"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-blue-100/80 transition hover:bg-white/10 hover:text-white"
              >
                Account settings
              </Link>

              <form action="/auth/sign-out/submit" method="post">
                <button
                  type="submit"
                  className="block w-full cursor-pointer rounded-xl px-4 py-3 text-left text-sm font-medium text-red-100 transition hover:bg-red-400/10"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        ) : (
          <Link
            href="/auth/sign-in"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#07111f] transition hover:scale-105 hover:bg-blue-100"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
