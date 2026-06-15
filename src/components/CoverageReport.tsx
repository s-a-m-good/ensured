import {
  formatCoverageFeature,
  type CoverageMatch,
} from "@/lib/coverageMatcher";

type CoverageReportProps = {
  matches: CoverageMatch[];
};

function getFitStyle(score: number) {
  if (score >= 75) {
    return "border-green-300/20 bg-green-400/15 text-green-100";
  }

  if (score >= 45) {
    return "border-yellow-300/20 bg-yellow-300/15 text-yellow-100";
  }

  return "border-blue-300/20 bg-blue-300/15 text-blue-100";
}

export default function CoverageReport({ matches }: CoverageReportProps) {
  if (matches.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
            Coverage scout
          </p>
          <h3 className="mt-2 text-2xl font-semibold">
            Matched sample coverage options
          </h3>
        </div>

        <p className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-blue-100/70">
          Prototype comparison support
        </p>
      </div>

      <p className="mt-4 text-sm leading-6 text-blue-100/60">
        These are sample options used to test the matching experience. They are
        not live quotes, not whole-of-market results, and not personal financial
        advice.
      </p>

      <div className="mt-6 space-y-5">
        {matches.map((match, index) => (
          <div
            key={match.policy.id}
            className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-blue-100/50">
                  #{index + 1} matched option · {match.policy.provider}
                </p>
                <h4 className="mt-1 text-xl font-semibold">
                  {match.policy.name}
                </h4>
                <p className="mt-1 text-sm text-blue-100/55">
                  {match.policy.targetUser}
                </p>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getFitStyle(
                  match.fitScore
                )}`}
              >
                {match.fitScore}/100 fit
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-blue-100/60">
                <span>Coverage fit</span>
                <span>{match.fitScore}%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-300"
                  style={{ width: `${Math.max(8, match.fitScore)}%` }}
                />
              </div>
            </div>

            <p className="mt-4 leading-7 text-blue-100/75">
              {match.explanation}
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.05] p-4">
                <p className="text-sm font-semibold text-blue-100">
                  Matched cover areas
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {match.matchedFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-green-300/20 bg-green-400/10 px-3 py-1 text-xs text-green-100"
                    >
                      {formatCoverageFeature(feature)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.05] p-4">
                <p className="text-sm font-semibold text-blue-100">
                  Missing or separate review
                </p>

                {match.missingFeatures.length === 0 ? (
                  <p className="mt-3 text-sm leading-6 text-blue-100/70">
                    No detected cover areas are missing in this sample match.
                  </p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {match.missingFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-3 py-1 text-xs text-yellow-100"
                      >
                        {formatCoverageFeature(feature)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.05] p-4">
                <p className="text-sm font-semibold text-blue-100">
                  Strengths
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-100/70">
                  {match.policy.strengths.map((strength) => (
                    <li key={strength}>• {strength}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white/[0.05] p-4">
                <p className="text-sm font-semibold text-blue-100">
                  Things to check
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-100/70">
                  {match.warningFlags.map((warning) => (
                    <li key={warning}>• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-blue-100/60 sm:flex-row sm:items-center sm:justify-between">
              <p>Estimated price level: {match.policy.priceLevel}</p>
              <p>{match.policy.dataSourceNote}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}