import SiteHeader from "@/components/SiteHeader";

type SignUpPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            Create account
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Start your Ensured workspace.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/70">
            Create an account to save insurance estimates, Coverage Scout
            reports, policy details, reminders, and alerts.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <h2 className="text-3xl font-semibold">Create account</h2>

          <form action="/auth/sign-up/submit" method="post" className="mt-6">
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
                minLength={6}
                placeholder="At least 6 characters"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
              />
            </label>

            <button
              type="submit"
              className="mt-6 w-full cursor-pointer rounded-full bg-blue-400 px-6 py-4 font-semibold text-[#07111f] transition hover:scale-[1.02] hover:bg-blue-300"
            >
              Create account
            </button>

            {error && (
              <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
                {error}
              </p>
            )}
          </form>

          <p className="mt-5 text-center text-sm text-blue-100/50">
            Already have an account?{" "}
            <a href="/auth/sign-in" className="text-blue-300 hover:text-blue-200">
              Sign in
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
