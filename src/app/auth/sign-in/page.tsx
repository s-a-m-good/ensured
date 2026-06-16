import SiteHeader from "@/components/SiteHeader";

type SignInPageProps = {
  searchParams?: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

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
            Sign in to access your saved reports, policy vault, reminders, and
            insurance workspace.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <h2 className="text-3xl font-semibold">Sign in</h2>

          {params?.message && (
            <p className="mt-5 rounded-2xl border border-blue-300/20 bg-blue-400/10 p-4 text-sm leading-6 text-blue-100">
              {params.message}
            </p>
          )}

          {params?.error && (
            <p className="mt-5 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
              {params.error}
            </p>
          )}

          <form action="/auth/sign-in/submit" method="post" className="mt-6">
            <label className="block">
              <span className="text-sm font-medium text-blue-100">Email</span>

              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-medium text-blue-100">
                Password
              </span>

              <input
                name="password"
                type="password"
                required
                placeholder="Your password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
              />
            </label>

            <button
              type="submit"
              className="mt-6 w-full cursor-pointer rounded-full bg-blue-400 px-6 py-4 font-semibold text-[#07111f] transition hover:scale-[1.02] hover:bg-blue-300"
            >
              Sign in
            </button>
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
