import SiteHeader from "@/components/SiteHeader";

export default function AccountSettingsPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          Account settings
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Manage your account.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100/70">
          Account settings will go here later. This page can eventually include
          name, email, password reset, notification preferences, privacy
          settings, and account deletion.
        </p>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <h2 className="text-2xl font-semibold">Coming soon</h2>
          <p className="mt-3 text-blue-100/70">
            Settings are not active yet, but the page is ready.
          </p>
        </div>
      </section>
    </main>
  );
}
