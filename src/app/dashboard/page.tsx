import SiteHeader from "@/components/SiteHeader";

const cards = [
  { title: "Profile completeness", value: "42%", note: "Add assets, business activities, and renewal dates." },
  { title: "Cover areas detected", value: "5", note: "Based on your latest estimate." },
  { title: "Upcoming renewals", value: "0", note: "Policy vault not connected yet." },
  { title: "Risk alerts", value: "2", note: "Prototype alerts based on location and scenario signals." },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          Dashboard
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Your insurance profile at a glance.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100/70">
          This will become the user’s main insurance command centre: profile,
          cover gaps, policy documents, renewals, and alerts.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <p className="text-sm text-blue-100/60">{card.title}</p>
              <p className="mt-4 text-4xl font-bold">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-blue-100/65">{card.note}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}