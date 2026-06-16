"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SavedReport = {
  id: string;
  title: string;
  suggestions: unknown[] | null;
  matches: unknown[] | null;
  created_at: string;
};

export default function SavedReportsPanel() {
  const [supabase] = useState(() => createClient());
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadReports() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Sign in to see saved reports.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("coverage_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setReports((data as SavedReport[]) ?? []);
    setLoading(false);
  }

  async function deleteReport(id: string) {
    const { error } = await supabase
      .from("coverage_reports")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadReports();
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Saved Coverage Scout reports</h2>
          <p className="mt-2 text-sm text-blue-100/60">
            Re-open previous estimate results and coverage matches.
          </p>
        </div>

        <a
          href="/estimate"
          className="w-fit rounded-full bg-blue-400 px-5 py-2 text-sm font-semibold text-[#07111f] hover:bg-blue-300"
        >
          Create new report
        </a>
      </div>

      {loading && <p className="mt-5 text-blue-100/60">Loading reports...</p>}

      {!loading && message && (
        <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-blue-100/75">
          {message}
        </p>
      )}

      {!loading && reports.length === 0 && !message && (
        <p className="mt-5 rounded-2xl border border-white/10 bg-[#0d1b2f] p-4 text-blue-100/60">
          No reports saved yet. Generate one from the Estimate page.
        </p>
      )}

      {!loading && reports.length > 0 && (
        <div className="mt-6 space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">{report.title}</h3>

                  <p className="mt-1 text-sm text-blue-100/60">
                    Saved {new Date(report.created_at).toLocaleString()} ·{" "}
                    {report.suggestions?.length ?? 0} cover areas ·{" "}
                    {report.matches?.length ?? 0} matched options
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/reports/${report.id}`}
                    className="w-fit rounded-full bg-blue-400 px-4 py-2 text-sm font-semibold text-[#07111f] hover:bg-blue-300"
                  >
                    Open report
                  </a>

                  <button
                    type="button"
                    onClick={() => deleteReport(report.id)}
                    className="w-fit cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
