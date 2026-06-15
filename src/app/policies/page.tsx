import SiteHeader from "@/components/SiteHeader";

const policyItems = [
  "Upload policy documents",
  "Track renewal dates",
  "Store certificates of currency",
  "Save receipts, photos, and valuations",
  "Flag missing limits, exclusions, and excesses",
];

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          Policy vault
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Keep insurance documents organised.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100/70">
          This page will eventually let users upload policies, certificates,
          claim evidence, receipts, valuations, and renewal information.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {policyItems.map((item) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <p className="text-xl font-semibold">{item}</p>
              <p className="mt-3 leading-7 text-blue-100/65">
                Coming soon in the policy vault prototype.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}