import SavedReportsPanel from "@/components/SavedReportsPanel";
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
          Save reports, re-open previous Coverage Scout results, manage your
          policy vault, and check possible coverage gaps.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-2xl font-semibold">Policy vault</h2>

            <p className="mt-3 text-blue-100/70">
              Add and manage policy details such as renewal dates, limits,
              excesses, certificates, and exclusions.
            </p>

            <a
              href="/policies"
              className="mt-6 inline-flex rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] hover:bg-blue-300"
            >
              Open Policy Vault
            </a>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-2xl font-semibold">Coverage gap checker</h2>

            <p className="mt-3 text-blue-100/70">
              Compare your latest saved Coverage Scout report against saved
              policies to find missing or incomplete cover areas.
            </p>

            <a
              href="/gaps"
              className="mt-6 inline-flex rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] hover:bg-blue-300"
            >
              Check Coverage Gaps
            </a>
          </div>
        </div>

        <SavedReportsPanel />
      </section>
    </main>
  );
}
