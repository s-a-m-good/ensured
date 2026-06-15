import AccountWorkspace from "@/components/AccountWorkspace";
import SiteHeader from "@/components/SiteHeader";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          Account
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Your Ensured workspace.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100/70">
          Save coverage reports, insurance profile answers, policy details,
          renewal reminders, and alerts in one account.
        </p>

        <AccountWorkspace />
      </section>
    </main>
  );
}