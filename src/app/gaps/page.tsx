import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

type CoverageSuggestion = {
  title?: string;
  category?: string;
  priority?: string;
  reason?: string;
  signals?: string[];
  nextSteps?: string[];
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

type GapResult = {
  needTitle: string;
  category: string;
  status: GapStatus;
  matchedPolicy: PolicyVaultItem | null;
  explanation: string;
  reviewPoints: string[];
};

function normalise(value: string | null | undefined) {
  return (value || "").toLowerCase();
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
      missingMessage:
        "No professional indemnity policy appears to be saved.",
    };
  }

  if (lower.includes("public liability")) {
    return {
      keywords: ["public liability", "business liability", "liability"],
      requiredFields: ["coverLimit", "certificate"],
      missingMessage:
        "No public liability policy appears to be saved.",
    };
  }

  if (lower.includes("cyber")) {
    return {
      keywords: ["cyber", "data breach", "online", "technology"],
      requiredFields: ["coverLimit", "exclusions"],
      missingMessage:
        "No cyber policy appears to be saved.",
    };
  }

  if (lower.includes("car") || lower.includes("commercial motor")) {
    return {
      keywords: ["car", "vehicle", "motor", "commercial motor"],
      requiredFields: ["excess", "coverLimit"],
      missingMessage:
        "No car or commercial motor policy appears to be saved.",
    };
  }

  if (lower.includes("contents")) {
    return {
      keywords: ["contents", "home and contents", "personal property"],
      requiredFields: ["coverLimit", "portableValuables"],
      missingMessage:
        "No contents or home and contents policy appears to be saved.",
    };
  }

  if (lower.includes("portable valuables")) {
    return {
      keywords: ["contents", "portable valuables", "personal items"],
      requiredFields: ["portableValuables"],
      missingMessage:
        "No portable valuables note appears to be saved.",
    };
  }

  if (lower.includes("landlord")) {
    return {
      keywords: ["landlord", "rental property"],
      requiredFields: ["coverLimit", "exclusions"],
      missingMessage:
        "No landlord policy appears to be saved.",
    };
  }

  if (lower.includes("travel")) {
    return {
      keywords: ["travel"],
      requiredFields: ["excess", "exclusions"],
      missingMessage:
        "No travel policy appears to be saved.",
    };
  }

  if (lower.includes("workers compensation")) {
    return {
      keywords: ["workers compensation", "worker", "staff"],
      requiredFields: ["notes"],
      missingMessage:
        "No workers compensation policy or note appears to be saved.",
    };
  }

  if (lower.includes("natural hazard") || lower.includes("location")) {
    return {
      keywords: ["home", "contents", "landlord", "building"],
      requiredFields: ["exclusions"],
      missingMessage:
        "No saved policy appears to include flood, storm, bushfire, or natural hazard notes.",
    };
  }

  return {
    keywords: [lower],
    requiredFields: ["notes"],
    missingMessage: "No matching saved policy was found.",
  };
}

function findMatchingPolicy(
  suggestion: CoverageSuggestion,
  policies: PolicyVaultItem[]
) {
  const title = suggestion.title || "";
  const config = getNeedConfig(title);

  return policies.find((policy) => {
    const text = policyText(policy);
    return config.keywords.some((keyword) =>
      text.includes(keyword.toLowerCase())
    );
  }) ?? null;
}

function getReviewPoints(policy: PolicyVaultItem, needTitle: string) {
  const config = getNeedConfig(needTitle);
  const reviewPoints: string[] = [];

  if (config.requiredFields.includes("coverLimit") && !policy.cover_limit_amount) {
    reviewPoints.push("Cover limit is not saved.");
  }

  if (config.requiredFields.includes("excess") && !policy.excess_amount) {
    reviewPoints.push("Excess is not saved.");
  }

  if (
    config.requiredFields.includes("certificate") &&
    !policy.certificate_of_currency
  ) {
    reviewPoints.push("Certificate of currency note/link is not saved.");
  }

  if (
    config.requiredFields.includes("portableValuables") &&
    !policy.portable_valuables_note
  ) {
    reviewPoints.push("Portable valuables details are not saved.");
  }

  if (
    config.requiredFields.includes("exclusions") &&
    !policy.important_exclusions
  ) {
    reviewPoints.push("Important exclusions or conditions are not saved.");
  }

  if (config.requiredFields.includes("notes") && !policy.notes) {
    reviewPoints.push("Notes are not saved.");
  }

  if (normalise(needTitle).includes("natural hazard")) {
    const naturalHazardText = `${policy.important_exclusions || ""} ${
      policy.notes || ""
    }`.toLowerCase();

    const mentionsHazards =
      naturalHazardText.includes("flood") ||
      naturalHazardText.includes("storm") ||
      naturalHazardText.includes("bushfire") ||
      naturalHazardText.includes("hail") ||
      naturalHazardText.includes("cyclone");

    if (!mentionsHazards) {
      reviewPoints.push(
        "Flood, storm, bushfire, hail, or cyclone wording is not mentioned."
      );
    }
  }

  return reviewPoints;
}

function createGapResults(
  report: SavedReport | null,
  policies: PolicyVaultItem[]
): GapResult[] {
  if (!report?.suggestions) return [];

  return report.suggestions.map((suggestion) => {
    const needTitle = suggestion.title || "Unknown cover area";
    const matchedPolicy = findMatchingPolicy(suggestion, policies);

    if (!matchedPolicy) {
      return {
        needTitle,
        category: suggestion.category || "Coverage need",
        status: "Missing from saved policies",
        matchedPolicy: null,
        explanation: getNeedConfig(needTitle).missingMessage,
        reviewPoints: [
          "Add a matching policy to the Policy Vault if you already have this cover.",
          "If you do not have this cover, consider whether it needs review with a licensed provider.",
        ],
      };
    }

    const reviewPoints = getReviewPoints(matchedPolicy, needTitle);

    if (reviewPoints.length > 0) {
      return {
        needTitle,
        category: suggestion.category || "Coverage need",
        status: "Needs review",
        matchedPolicy,
        explanation:
          "A matching saved policy was found, but important details are missing or incomplete.",
        reviewPoints,
      };
    }

    return {
      needTitle,
      category: suggestion.category || "Coverage need",
      status: "Likely covered",
      matchedPolicy,
      explanation:
        "A matching saved policy was found and key details appear to be saved.",
      reviewPoints: [
        "Still review the actual policy wording before relying on this.",
      ],
    };
  });
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

export default async function CoverageGapsPage() {
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

    latestReport = ((reportsData?.[0] as SavedReport) ?? null);

    const { data: policiesData } = await supabase
      .from("policy_vault_items")
      .select("*")
      .order("created_at", { ascending: false });

    policies = (policiesData as PolicyVaultItem[]) ?? [];
  }

  const gapResults = createGapResults(latestReport, policies);

  const likelyCovered = gapResults.filter(
    (item) => item.status === "Likely covered"
  ).length;

  const needsReview = gapResults.filter(
    (item) => item.status === "Needs review"
  ).length;

  const missing = gapResults.filter(
    (item) => item.status === "Missing from saved policies"
  ).length;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          Coverage gap checker
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
          Compare detected needs against saved policies.
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100/70">
          Ensured checks your latest saved Coverage Scout report against your
          Policy Vault to identify what appears covered, what needs review, and
          what may be missing.
        </p>

        {!user && (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-2xl font-semibold">Sign in required</h2>
            <p className="mt-3 text-blue-100/70">
              Sign in to compare your saved reports against your policy vault.
            </p>

            <a
              href="/auth/sign-in"
              className="mt-6 inline-flex rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] hover:bg-blue-300"
            >
              Sign in
            </a>
          </div>
        )}

        {user && !latestReport && (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
            <h2 className="text-2xl font-semibold">
              No saved Coverage Scout report yet
            </h2>

            <p className="mt-3 text-blue-100/70">
              Generate and save a report first, then the gap checker can compare
              detected needs against your saved policies.
            </p>

            <a
              href="/estimate"
              className="mt-6 inline-flex rounded-full bg-blue-400 px-6 py-3 font-semibold text-[#07111f] hover:bg-blue-300"
            >
              Create a report
            </a>
          </div>
        )}

        {user && latestReport && (
          <>
            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Latest report checked
                  </h2>

                  <p className="mt-2 text-blue-100/70">
                    {latestReport.title}
                  </p>

                  <p className="mt-1 text-sm text-blue-100/50">
                    Saved {new Date(latestReport.created_at).toLocaleString()}
                  </p>
                </div>

                <a
                  href={`/reports/${latestReport.id}`}
                  className="w-fit rounded-full border border-white/10 px-5 py-2 text-sm text-blue-100/70 hover:bg-white/10"
                >
                  Open report
                </a>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl border border-green-300/20 bg-green-400/10 p-6">
                <p className="text-sm text-green-100/70">Likely covered</p>
                <p className="mt-3 text-4xl font-bold text-green-100">
                  {likelyCovered}
                </p>
              </div>

              <div className="rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-6">
                <p className="text-sm text-yellow-100/70">Needs review</p>
                <p className="mt-3 text-4xl font-bold text-yellow-100">
                  {needsReview}
                </p>
              </div>

              <div className="rounded-3xl border border-red-300/20 bg-red-400/10 p-6">
                <p className="text-sm text-red-100/70">
                  Missing from saved policies
                </p>
                <p className="mt-3 text-4xl font-bold text-red-100">
                  {missing}
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-5">
              {gapResults.map((result) => (
                <div
                  key={result.needTitle}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm text-blue-100/50">
                        {result.category}
                      </p>

                      <h2 className="mt-1 text-2xl font-semibold">
                        {result.needTitle}
                      </h2>

                      <p className="mt-3 leading-7 text-blue-100/70">
                        {result.explanation}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(
                        result.status
                      )}`}
                    >
                      {result.status}
                    </span>
                  </div>

                  {result.matchedPolicy && (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                      <p className="text-sm text-blue-100/50">
                        Matched saved policy
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {result.matchedPolicy.policy_name}
                      </p>

                      <p className="mt-1 text-sm text-blue-100/60">
                        {result.matchedPolicy.provider || "No provider saved"} ·{" "}
                        {result.matchedPolicy.policy_type || "No policy type"}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1b2f] p-4">
                    <p className="text-sm font-semibold text-blue-100">
                      Review points
                    </p>

                    <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-100/70">
                      {result.reviewPoints.map((point) => (
                        <li key={point}>• {point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 p-6">
              <h2 className="text-2xl font-semibold text-yellow-100">
                Important note
              </h2>

              <p className="mt-3 leading-7 text-yellow-50/80">
                The gap checker compares saved data only. It cannot confirm
                actual coverage. Always review the policy wording, certificate,
                exclusions, limits, and speak to a licensed provider where
                needed.
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
