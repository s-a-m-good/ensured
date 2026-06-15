import SiteHeader from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          About Ensured
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Insurance guidance before insurance sales.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100/70">
          Ensured is being built as an Australian-first insurance intelligence
          platform. The goal is to help individuals and small businesses
          understand, compare, organise, and monitor insurance coverage over time.
        </p>

        <div className="mt-10 rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 p-6">
          <h2 className="text-2xl font-semibold text-yellow-100">
            Important prototype note
          </h2>

          <p className="mt-3 leading-7 text-yellow-50/80">
            Ensured currently provides general information and prototype
            comparison support only. It does not provide personal financial
            advice, arrange insurance, compare the whole market, or replace a
            licensed broker or insurer.
          </p>
        </div>
      </section>
    </main>
  );
}