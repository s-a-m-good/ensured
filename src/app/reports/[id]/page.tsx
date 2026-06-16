"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import CoverageReport from "@/components/CoverageReport";
import { createClient } from "@/lib/supabase/client";
import type { CoverageMatch } from "@/lib/coverageMatcher";
import type { InsuranceSuggestion } from "@/lib/insuranceRules";

type SavedReport = {
  id: string;
  title: string;
  suggestions: InsuranceSuggestion[];
  matches: CoverageMatch[];
  created_at: string;
  profile_id: string | null;
};

type SavedProfile = {
  id: string;
  profile_name: string;
  user_type: string;
  state: string;
  scenarios: string[];
  description: string;
  created_at: string;
};

function getPriorityStyle(priority: InsuranceSuggestion["priority"]) {
  if (priority === "High") {
    return "border-red-300/20 bg-red-400/15 text-red-100";
  }

  if (priority === "Medium") {
    return "border-yellow-300/20 bg-yellow-300/15 text-yellow-100";
  }

  return "border-blue-300/20 bg-blue-300/15 text-blue-100";
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const [supabase] = useState(() => createClient());

  const [report, setReport] = useState<SavedReport | null>(null);
  const [profile, setProfile] = useState<SavedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("You need to sign in to view this saved report.");
        setLoading(false);
        return;
      }

      const { data: reportData, error: reportError } = await supabase
        .from("coverage_reports")
        .select("*")
        .eq("id", params.id)
        .single();

      if (reportError || !reportData) {
        setMessage("Report not found, or you do not have access to it.");
        setLoading(false);
        return;
      }

      const savedReport = reportData as SavedReport;
      setReport(savedReport);

      if (savedReport.profile_id) {
        const { data: profileData } = await supabase
          .from("insurance_profiles")
          .select("*")
          .eq("id", savedReport.profile_id)
          .single();

        if (profileData) {
          setProfile(profileData as SavedProfile);
        }
      }

      setLoading(false);
    }

    loadReport();
  }, [params.id, supabase]);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <a
          href="/account"
          className="inline-flex rounded-full border border-white/10 px-5 py-2 text-sm text-blue-100/70 transition hover:bg-white/10 hover:text-white"
        >
          ← Back to account
        </a>

        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          Saved report
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Coverage Scout report.
        </h1>

        {loading && (
          <p className="mt-8 text-blue-100/70">Loading saved report...</p>
        )}

        {!loading && message && (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-2xl font-semibold">Unable to open report</h2>
            <p className="mt-3 leading-7 text-blue-100/70">{message}</p>

            <a
              href="/auth/sign-in"
              className="mt-6 inline-flex rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] transition hover:bg-blue-300"
            >
              Sign in
            </a>
          </div>
        )}

        {!loading && report && (
          <div className="mt-10 space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{report.title}</h2>
                  <p className="mt-2 text-sm text-blue-100/60">
                    Saved {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-blue-100/70">
                  {report.suggestions.length} cover areas ·{" "}
                  {report.matches.length} matched options
                </div>
              </div>
            </div>

            {profile && (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
                <h2 className="text-2xl font-semibold">
                  Saved profile answers
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                    <p className="text-sm text-blue-100/50">User type</p>
                    <p className="mt-1 text-lg">{profile.user_type}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                    <p className="text-sm text-blue-100/50">
                      State or territory
                    </p>
                    <p className="mt-1 text-lg">{profile.state}</p>
                  </div>
                </div>

                {profile.scenarios.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm text-blue-100/50">Scenarios</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {profile.scenarios.map((scenario) => (
                        <span
                          key={scenario}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-blue-100/70"
                        >
                          {scenario}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <p className="text-sm text-blue-100/50">Description</p>
                  <p className="mt-2 leading-7 text-blue-100/75">
                    {profile.description || "No written description saved."}
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                Guidance preview
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                {report.suggestions.length} cover areas detected
              </h3>

              <div className="mt-6 space-y-5">
                {report.suggestions.map((result) => (
                  <div
                    key={result.title}
                    className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm text-blue-100/50">
                          {result.category}
                        </p>

                        <h4 className="mt-1 text-xl font-semibold">
                          {result.title}
                        </h4>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                          result.priority
                        )}`}
                      >
                        {result.priority} relevance
                      </span>
                    </div>

                    <p className="mt-4 leading-7 text-blue-100/75">
                      {result.reason}
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-white/[0.05] p-4">
                        <p className="text-sm font-semibold text-blue-100">
                          Signals detected
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {result.signals.map((signal) => (
                            <span
                              key={signal}
                              className="rounded-full border border-white/10 px-3 py-1 text-xs text-blue-100/70"
                            >
                              {signal}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/[0.05] p-4">
                        <p className="text-sm font-semibold text-blue-100">
                          Possible next steps
                        </p>

                        <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-100/70">
                          {result.nextSteps.map((step) => (
                            <li key={step}>• {step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <CoverageReport matches={report.matches} />

            <div className="rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 p-6">
              <h2 className="text-2xl font-semibold text-yellow-100">
                Important note
              </h2>

              <p className="mt-3 leading-7 text-yellow-50/80">
                This saved report is general information and prototype
                comparison support only. It is not personal financial advice, a
                live quote, a whole-of-market comparison, or an offer to arrange
                insurance.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
