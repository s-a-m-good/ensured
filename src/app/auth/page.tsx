import SiteHeader from "@/components/SiteHeader";

export default function AuthPage() {
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
            Create an account or sign in to save Coverage Scout reports, policy
            details, renewal reminders, and alerts.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <h2 className="text-3xl font-semibold">Get started</h2>

          <p className="mt-3 leading-7 text-blue-100/65">
            Choose whether you want to create a new account or sign in to an
            existing one.
          </p>

          <div className="mt-8 grid gap-4">
            <a
              href="/auth/sign-up"
              className="block rounded-full bg-blue-400 px-6 py-4 text-center font-semibold text-[#07111f] transition hover:scale-[1.02] hover:bg-blue-300"
            >
              Create account
            </a>

            <a
              href="/auth/sign-in"
              className="block rounded-full border border-white/20 px-6 py-4 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Sign in
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
