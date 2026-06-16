import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

type CoverageSuggestion = {
  title?: string;
  category?: string;
};

type SavedReport = {
  id: string;
  title: string;
  suggestions: CoverageSuggestion[] | null;
  created_at: string;
};

type PolicyVaultItem = {
  id: string;
  policy_name: string;
  provider: string | null;
  policy_type: string | null;
  renewal_date: string | null;
  premium_amount: number | null;
  excess_amount: number | null;
  cover_limit_amount: number | null;
  important_exclusions: string | null;
  certificate_of_currency: string | null;
  portable_valuables_note: string | null;
  notes: string | null;
};

type GapStatus = "Likely covered" | "Needs review" | "Missing from saved policies";

type DashboardGap = {
  needTitle: string;
  status: GapStatus;
};

function daysUntil(dateString: string | null) {
  if (!dateString) return null;

  const today = new Date();
  const target = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function policyText(policy: PolicyVaultItem) {
  return [
    policy.policy_name,
    policy.provider,
    policy.policy_type,
    policy.notes,
    policy.important_exclusions,
    policy.certificate_of_currency,
    policy.portable_valuables_note,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getNeedConfig(title: string) {
  const lower = title.toLowerCase();

  if (lower.includes("professional indemnity")) {
    return {
      keywords: ["professional indemnity", "pi insurance", "professional services"],
      requiredFields: ["coverLimit"],
    };
  }

  if (lower.includes("public liability")) {
    return {
      keywords: ["public liability", "business liability", "liability"],
      requiredFields: ["coverLimit", "certificate"],
    };
  }

  if (lower.includes("cyber")) {
    return {
      keywords: ["cyber", "data breach", "online", "technology"],
      requiredFields: ["coverLimit", "exclusions"],
    };
  }

  if (lower.includes("car") || lower.includes("commercial motor")) {
    return {
      keywords: ["car", "vehicle", "motor", "commercial motor"],
      requiredFields: ["excess", "coverLimit"],
    };
  }

  if (lower.includes("contents")) {
    return {
      keywords: ["contents", "home and contents", "personal property"],
      requiredFields: ["coverLimit", "portableValuables"],
    };
  }

  if (lower.includes("portable valuables")) {
    return {
      keywords: ["contents", "portable valuables", "personal items"],
      requiredFields: ["portableValuables"],
    };
  }

  if (lower.includes("landlord")) {
    return {
      keywords: ["landlord", "rental property"],
      requiredFields: ["coverLimit", "exclusions"],
    };
  }

  if (lower.includes("travel")) {
    return {
      keywords: ["travel"],
      requiredFields: ["excess", "exclusions"],
    };
  }

  if (lower.includes("workers compensation")) {
    return {
      keywords: ["workers compensation", "worker", "staff"],
      requiredFields: ["notes"],
    };
  }

  if (lower.includes("natural hazard") || lower.includes("location")) {
    return {
      keywords: ["home", "contents", "landlord", "building"],
      requiredFields: ["exclusions"],
    };
  }

  return {
    keywords: [lower],
    requiredFields: ["notes"],
  };
}

function findMatchingPolicy(
  suggestion: CoverageSuggestion,
  policies: PolicyVaultItem[]
) {
  const title = suggestion.title || "";
  const config = getNeedConfig(title);

  return (
    policies.find((policy) => {
      const text = policyText(policy);
      return config.keywords.some((keyword) =>
        text.includes(keyword.toLowerCase())
      );
    }) ?? null
  );
}

function getReviewPoints(policy: PolicyVaultItem, needTitle: string) {
  const config = getNeedConfig(needTitle);
  const reviewPoints: string[] = [];

  if (config.requiredFields.includes("coverLimit") && !policy.cover_limit_amount) {
    reviewPoints.push("Cover limit missing");
  }

  if (config.requiredFields.includes("excess") && !policy.excess_amount) {
    reviewPoints.push("Excess missing");
  }

  if (
    config.requiredFields.includes("certificate") &&
    !policy.certificate_of_currency
  ) {
    reviewPoints.push("Certificate missing");
  }

  if (
    config.requiredFields.includes("portableValuables") &&
    !policy.portable_valuables_note
  ) {
    reviewPoints.push("Portable valuables note missing");
  }

  if (
    config.requiredFields.includes("exclusions") &&
    !policy.important_exclusions
  ) {
    reviewPoints.push("Exclusions missing");
  }

  if (config.requiredFields.includes("notes") && !policy.notes) {
    reviewPoints.push("Notes missing");
  }

  return reviewPoints;
}

function createGapResults(
  report: SavedReport | null,
  policies: PolicyVaultItem[]
): DashboardGap[] {
  if (!report?.suggestions) return [];

  return report.suggestions.map((suggestion) => {
    const needTitle = suggestion.title || "Unknown cover area";
    const matchedPolicy = findMatchingPolicy(suggestion, policies);

    if (!matchedPolicy) {
      return {
        needTitle,
        status: "Missing from saved policies",
      };
    }

    const reviewPoints = getReviewPoints(matchedPolicy, needTitle);

    if (reviewPoints.length > 0) {
      return {
        needTitle,
        status: "Needs review",
      };
    }

    return {
      needTitle,
      status: "Likely covered",
    };
  });
}

function calculateReadinessScore(gaps: DashboardGap[]) {
  if (gaps.length === 0) return 0;

  const points = gaps.reduce((total, gap) => {
    if (gap.status === "Likely covered") return total + 100;
    if (gap.status === "Needs review") return total + 50;
    return total;
  }, 0);

  return Math.round(points / gaps.length);
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 50) return "Developing";
  if (score > 0) return "Needs work";
  return "Not enough data";
}

function getStatusStyle(status: GapStatus) {
  if (status === "Likely covered") {
    return "border-green-300/20 bg-green-400/10 text-green-100";
  }

  if (status === "Needs review") {
    return "border-yellow-300/20 bg-yellow-300/10 text-yellow-100";
  }

  return "border-red-300/20 bg-red-400/10 text-red-100";
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let latestReport: SavedReport | null = null;
  let policies: PolicyVaultItem[] = [];

  if (user) {
    const { data: reportsData } = await supabase
      .from("coverage_reports")
      .select("id, title, suggestions, created_at")
      .order("created_at", { ascending: false })
      .limit(1);

    latestReport = (reportsData?.[0] as SavedReport) ?? null;

    const { data: policiesData } = await supabase
      .from("policy_vault_items")
      .select("*")
      .order("created_at", { ascending: false });

    policies = (policiesData as PolicyVaultItem[]) ?? [];
  }

  const gapResults = createGapResults(latestReport, policies);

  const readinessScore = calculateReadinessScore(gapResults);
  const scoreLabel = getScoreLabel(readinessScore);

  const missingCoverAreas = gapResults.filter(
    (gap) => gap.status === "Missing from saved policies"
  ).length;

  const needsReview = gapResults.filter(
    (gap) => gap.status === "Needs review"
  ).length;

  const upcomingRenewals = policies.filter((policy) => {
    const days = daysUntil(policy.renewal_date);
    return days !== null && days >= 0 && days <= 30;
  });

  const activeAlerts = missingCoverAreas + needsReview + upcomingRenewals.length;

  const recentPolicies = policies.slice(0, 3);
  const topGaps = gapResults
    .filter((gap) => gap.status !== "Likely covered")
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          Dashboard
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Your insurance command centre.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100/70">
          Track readiness, saved policies, coverage gaps, renewals, alerts, and
          your latest Coverage Scout report.
        </p>

        {!user && (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-2xl font-semibold">Sign in required</h2>
            <p className="mt-3 text-blue-100/70">
              Sign in to see your personalised dashboard.
            </p>

            <a
              href="/auth/sign-in"
              className="mt-6 inline-flex rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] hover:bg-blue-300"
            >
              Sign in
            </a>
          </div>
        )}

        {user && (
          <>
            <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-blue-100/55">
                      Insurance readiness
                    </p>

                    <h2 className="mt-3 text-6xl font-bold">
                      {readinessScore}%
                    </h2>

                    <p className="mt-3 text-blue-100/70">
                      {scoreLabel}. Based on your latest saved Coverage Scout
                      report and current Policy Vault.
                    </p>
                  </div>

                  <div className="h-40 w-40 rounded-full border border-blue-300/20 bg-blue-400/10 p-5">
                    <div className="flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-[#0d1b2f]">
                      <span className="text-4xl font-bold">
                        {readinessScore}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-300"
                    style={{ width: `${Math.max(4, readinessScore)}%` }}
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/gaps"
                    className="rounded-full bg-blue-400 px-5 py-2 text-sm font-semibold text-[#07111f] hover:bg-blue-300"
                  >
                    Check gaps
                  </a>

                  <a
                    href="/estimate"
                    className="rounded-full border border-white/10 px-5 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                  >
                    Create report
                  </a>

                  <a
                    href="/policies"
                    className="rounded-full border border-white/10 px-5 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                  >
                    Manage policies
                  </a>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
                  <p className="text-sm text-blue-100/55">Signed in as</p>
                  <p className="mt-3 break-all text-lg font-semibold">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
                  <p className="text-sm text-blue-100/55">Latest report</p>

                  {latestReport ? (
                    <>
                      <p className="mt-3 font-semibold">
                        {latestReport.title}
                      </p>

                      <p className="mt-2 text-sm text-blue-100/55">
                        Saved{" "}
                        {new Date(latestReport.created_at).toLocaleString()}
                      </p>

                      <a
                        href={`/reports/${latestReport.id}`}
                        className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                      >
                        Open report
                      </a>
                    </>
                  ) : (
                    <>
                      <p className="mt-3 text-blue-100/65">
                        No saved report yet.
                      </p>

                      <a
                        href="/estimate"
                        className="mt-5 inline-flex rounded-full bg-blue-400 px-4 py-2 text-sm font-semibold text-[#07111f] hover:bg-blue-300"
                      >
                        Create report
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                <p className="text-sm text-blue-100/55">Saved policies</p>
                <p className="mt-3 text-4xl font-bold">{policies.length}</p>
                <p className="mt-2 text-sm text-blue-100/55">
                  Policies in your vault
                </p>
              </div>

              <div className="rounded-3xl border border-red-300/20 bg-red-400/10 p-6">
                <p className="text-sm text-red-100/70">Missing cover areas</p>
                <p className="mt-3 text-4xl font-bold text-red-100">
                  {missingCoverAreas}
                </p>
                <p className="mt-2 text-sm text-red-100/65">
                  Based on latest report
                </p>
              </div>

              <div className="rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-6">
                <p className="text-sm text-yellow-100/70">Upcoming renewals</p>
                <p className="mt-3 text-4xl font-bold text-yellow-100">
                  {upcomingRenewals.length}
                </p>
                <p className="mt-2 text-sm text-yellow-100/65">
                  Within 30 days
                </p>
              </div>

              <div className="rounded-3xl border border-blue-300/20 bg-blue-400/10 p-6">
                <p className="text-sm text-blue-100/70">Active alerts</p>
                <p className="mt-3 text-4xl font-bold text-blue-100">
                  {activeAlerts}
                </p>
                <p className="mt-2 text-sm text-blue-100/65">
                  Missing, review, renewals
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Priority review areas
                    </h2>
                    <p className="mt-2 text-sm text-blue-100/60">
                      The most important missing or incomplete cover areas.
                    </p>
                  </div>

                  <a
                    href="/gaps"
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                  >
                    View all
                  </a>
                </div>

                {topGaps.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-white/10 bg-[#0d1b2f] p-4 text-blue-100/65">
                    No priority gaps detected from your latest report.
                  </p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {topGaps.map((gap) => (
                      <div
                        key={gap.needTitle}
                        className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <p className="font-semibold">{gap.needTitle}</p>

                          <span
                            className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              gap.status
                            )}`}
                          >
                            {gap.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">Recent policies</h2>
                    <p className="mt-2 text-sm text-blue-100/60">
                      Latest policies saved in your vault.
                    </p>
                  </div>

                  <a
                    href="/policies"
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                  >
                    Manage
                  </a>
                </div>

                {recentPolicies.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-white/10 bg-[#0d1b2f] p-4 text-blue-100/65">
                    No policies saved yet.
                  </p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {recentPolicies.map((policy) => {
                      const days = daysUntil(policy.renewal_date);

                      return (
                        <div
                          key={policy.id}
                          className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-4"
                        >
                          <p className="text-sm text-blue-100/50">
                            {policy.policy_type || "No policy type"}
                          </p>

                          <p className="mt-1 font-semibold">
                            {policy.policy_name}
                          </p>

                          <p className="mt-1 text-sm text-blue-100/60">
                            {policy.provider || "No provider saved"}
                          </p>

                          <p className="mt-2 text-sm text-blue-100/55">
                            Renewal: {policy.renewal_date || "Not set"}
                            {days !== null
                              ? days >= 0
                                ? ` · ${days} days away`
                                : ` · ${Math.abs(days)} days overdue`
                              : ""}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 p-6">
              <h2 className="text-2xl font-semibold text-yellow-100">
                Prototype note
              </h2>

              <p className="mt-3 leading-7 text-yellow-50/80">
                The dashboard is based on saved data only. The readiness score
                is not a guarantee of coverage and does not replace policy
                wording, licensed advice, or insurer confirmation.
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
