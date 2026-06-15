import SiteHeader from "@/components/SiteHeader";
import EstimateForm from "@/components/EstimateForm";
const features = [
  {
    title: "Insurance guidance",
    description:
      "Describe your situation in plain English and see which types of cover may be relevant.",
  },
  {
    title: "Built for Australia first",
    description:
      "Designed first for Australian individuals, renters, homeowners, sole traders, and small businesses.",
  },
  {
    title: "Policy vault",
    description:
      "Eventually store policies, renewal dates, claim documents, receipts, valuations, and certificates.",
  },
  {
    title: "Risk alerts",
    description:
      "Receive prompts when renewals, location risks, business changes, or life events may affect your cover.",
  },
  {
    title: "Explainable results",
    description:
      "Outputs should explain why a cover type may matter, rather than just pushing a quote.",
  },
  {
    title: "Licensed handoff later",
    description:
      "When regulated advice or arranging cover is needed, Ensured can later connect users to licensed providers.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us your situation",
    description:
      "Answer simple questions about your home, work, assets, business, travel, and risks.",
  },
  {
    number: "02",
    title: "Understand possible cover",
    description:
      "See insurance categories that may be relevant, with plain-language explanations.",
  },
  {
    number: "03",
    title: "Organise over time",
    description:
      "Build a reusable insurance profile, track documents, and manage renewals in one place.",
  },
];

const coverTypes = [
  "Home & contents",
  "Car insurance",
  "Landlord insurance",
  "Public liability",
  "Professional indemnity",
  "Cyber insurance",
  "Business interruption",
  "Travel insurance",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section
        id="home"
        className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32"
      >
        <div>
          <div className="mb-6 inline-flex rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-100">
            Australian-first insurance intelligence
          </div>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            Understand your insurance before you buy it.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100/80">
            Ensured helps individuals and small businesses describe their
            situation, understand which types of insurance may be relevant, and
            organise cover over time.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#estimate"
              className="rounded-full bg-blue-400 px-7 py-4 text-center font-semibold text-[#07111f] transition hover:scale-105 hover:bg-blue-300"
            >
              Try the first estimate
            </a>

            <a
              href="#features"
              className="rounded-full border border-white/20 px-7 py-4 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Explore features
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <div className="rounded-[1.5rem] bg-[#0d1b2f] p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-blue-100/60">Profile preview</p>
                <h2 className="text-2xl font-semibold">Sole trader</h2>
              </div>

              <div className="rounded-full bg-green-400/20 px-3 py-1 text-sm text-green-200">
                Draft
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-blue-100/60">Situation</p>
                <p className="mt-1 text-white">
                  Runs a small business from home, meets clients, owns a laptop,
                  stores customer information, and travels locally.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-blue-100/60">Cover types that may matter</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-400/20 px-3 py-1 text-sm text-blue-100">
                    Public liability
                  </span>
                  <span className="rounded-full bg-blue-400/20 px-3 py-1 text-sm text-blue-100">
                    Professional indemnity
                  </span>
                  <span className="rounded-full bg-blue-400/20 px-3 py-1 text-sm text-blue-100">
                    Cyber
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4">
                <p className="text-sm font-medium text-yellow-100">
                  Guidance only
                </p>
                <p className="mt-1 text-sm leading-6 text-yellow-50/80">
                  Ensured can explain what may be relevant, but it does not
                  provide personal financial advice, arrange insurance, or
                  replace a licensed broker or insurer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            Features
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            A smarter insurance layer, not just another quote site.
          </h2>

          <p className="mt-5 text-lg leading-8 text-blue-100/70">
            Ensured is being built to help users understand, monitor, and
            organise their insurance position over time.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:bg-white/[0.09]"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-blue-100/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            How it works
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number}>
                <p className="text-5xl font-bold text-blue-300/40">
                  {step.number}
                </p>
                <h3 className="mt-5 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-blue-100/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="estimate" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
              First estimate
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Tell Ensured what your situation looks like.
            </h2>

            <p className="mt-5 text-lg leading-8 text-blue-100/70">
              This is the first visual version. Next, we will make this form
              generate basic insurance category suggestions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {coverTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-blue-100/80"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <EstimateForm />
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-blue-100/50 md:flex-row">
          <p>© 2026 Ensured. Australian-first insurance guidance platform.</p>
          <p>Guidance only. Not financial product advice.</p>
        </div>
      </footer>
    </main>
  );
}