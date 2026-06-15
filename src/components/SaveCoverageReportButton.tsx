"use client";

import { useState } from "react";
import type { CoverageMatch } from "@/lib/coverageMatcher";
import type {
  AustralianState,
  InsuranceSuggestion,
  ScenarioKey,
  UserType,
} from "@/lib/insuranceRules";
import { createClient } from "@/lib/supabase/client";

type SaveCoverageReportButtonProps = {
  userType: UserType;
  state: AustralianState;
  description: string;
  selectedScenarios: ScenarioKey[];
  results: InsuranceSuggestion[];
  coverageMatches: CoverageMatch[];
};

export default function SaveCoverageReportButton({
  userType,
  state,
  description,
  selectedScenarios,
  results,
  coverageMatches,
}: SaveCoverageReportButtonProps) {
  const [supabase] = useState(() => createClient());
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Sign in first to save this report.");
      setSaving(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("insurance_profiles")
      .insert({
        user_id: user.id,
        profile_name: `${userType} profile`,
        user_type: userType,
        state,
        scenarios: selectedScenarios,
        description,
      })
      .select()
      .single();

    if (profileError) {
      setMessage(profileError.message);
      setSaving(false);
      return;
    }

    const { error: reportError } = await supabase.from("coverage_reports").insert({
      user_id: user.id,
      profile_id: profile.id,
      title: "Coverage Scout report",
      suggestions: results,
      matches: coverageMatches,
    });

    if (reportError) {
      setMessage(reportError.message);
      setSaving(false);
      return;
    }

    setMessage("Saved to your account.");
    setSaving(false);
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Save this report</h3>
          <p className="mt-2 text-sm leading-6 text-blue-100/60">
            Save the current profile answers, detected cover areas, and Coverage
            Scout matches to your account.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || results.length === 0}
          className="w-fit rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save report"}
        </button>
      </div>

      {message && (
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-blue-100/75">
          {message}
        </p>
      )}
    </div>
  );
}