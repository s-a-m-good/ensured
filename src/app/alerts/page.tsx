import SiteHeader from "@/components/SiteHeader";

const alerts = [
  {
    title: "Renewal reminder",
    description: "Notify users before a policy expires or auto-renews.",
  },
  {
    title: "Location risk prompt",
    description: "Flag flood, storm, bushfire, or other local risk checks.",
  },
  {
    title: "Business change prompt",
    description: "Ask users to review cover when staff, vehicles, equipment, or services change.",
  },
];

export default function AlertsPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          Alerts
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Stay ahead of insurance changes.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100/70">
          Ensured will eventually alert users when renewals, risks, or life and
          business changes may require a cover review.
        </p>

        <div className="mt-12 space-y-5">
          {alerts.map((alert) => (
            <div key={alert.title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <h2 className="text-2xl font-semibold">{alert.title}</h2>
              <p className="mt-3 leading-7 text-blue-100/65">{alert.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}