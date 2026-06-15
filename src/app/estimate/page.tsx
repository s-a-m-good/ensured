import EstimateForm from "@/components/EstimateForm";
import SiteHeader from "@/components/SiteHeader";

export default function EstimatePage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            Coverage scout
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Find cover areas and compare sample options.
          </h1>

          <p className="mt-5 text-lg leading-8 text-blue-100/70">
            Tell Ensured about your situation. The prototype will detect
            relevant cover areas, then compare them against sample coverage
            options.
          </p>
        </div>

        <div className="mt-12">
          <EstimateForm />
        </div>
      </section>
    </main>
  );
}