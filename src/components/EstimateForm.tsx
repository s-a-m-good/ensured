"use client";

import { useState } from "react";
import CoverageReport from "@/components/CoverageReport";
import {
  matchCoverageOptions,
  type CoverageMatch,
} from "@/lib/coverageMatcher";
import {
  generateInsuranceSuggestions,
  type AustralianState,
  type InsuranceSuggestion,
  type ScenarioKey,
  type UserType,
} from "@/lib/insuranceRules";

const userTypes: UserType[] = [
  "Renter",
  "Homeowner",
  "Sole trader",
  "Small business owner",
  "Landlord",
];

const states: AustralianState[] = [
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
  "TAS",
  "ACT",
  "NT",
  "Not sure",
];

const scenarioOptions: { key: ScenarioKey; label: string }[] = [
  { key: "worksFromHome", label: "Works from home" },
  { key: "meetsClients", label: "Meets clients/customers" },
  { key: "storesCustomerData", label: "Stores customer data" },
  { key: "ownsValuables", label: "Owns valuables/equipment" },
  { key: "usesVehicle", label: "Uses a vehicle" },
  { key: "hasStaff", label: "Has staff or contractors" },
  { key: "travels", label: "Travels" },
  { key: "floodStormBushfire", label: "Flood/storm/bushfire concern" },
];

function getPriorityStyle(priority: InsuranceSuggestion["priority"]) {
  if (priority === "High") {
    return "bg-red-400/15 text-red-100 border-red-300/20";
  }

  if (priority === "Medium") {
    return "bg-yellow-300/15 text-yellow-100 border-yellow-300/20";
  }

  return "bg-blue-300/15 text-blue-100 border-blue-300/20";
}

function getScoreBarWidth(score: number) {
  return `${Math.max(8, Math.min(score, 100))}%`;
}

export default function EstimateForm() {
  const [userType, setUserType] = useState<UserType>("Renter");
  const [state, setState] = useState<AustralianState>("NSW");
  const [description, setDescription] = useState("");
  const [selectedScenarios, setSelectedScenarios] = useState<ScenarioKey[]>([]);
  const [results, setResults] = useState<InsuranceSuggestion[]>([]);
  const [coverageMatches, setCoverageMatches] = useState<CoverageMatch[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  function toggleScenario(scenario: ScenarioKey) {
    setSelectedScenarios((current) =>
      current.includes(scenario)
        ? current.filter((item) => item !== scenario)
        : [...current, scenario]
    );
  }

  function handleGenerate() {
    const suggestions = generateInsuranceSuggestions(
      userType,
      description,
      state,
      selectedScenarios
    );

    const matches = matchCoverageOptions(suggestions);

    setResults(suggestions);
    setCoverageMatches(matches);
    setHasGenerated(true);
  }

  return (
    <div className="space-y-6">
      <form className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-blue-100">
              I am a...
            </span>

            <select
              value={userType}
              onChange={(event) => setUserType(event.target.value as UserType)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none"
            >
              {userTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-blue-100">
              State or territory
            </span>

            <select
              value={state}
              onChange={(event) =>
                setState(event.target.value as AustralianState)
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none"
            >
              {states.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-blue-100">
            Select common scenarios
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {scenarioOptions.map((scenario) => {
              const isSelected = selectedScenarios.includes(scenario.key);

              return (
                <button
                  key={scenario.key}
                  type="button"
                  onClick={() => toggleScenario(scenario.key)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    isSelected
                      ? "border-blue-300 bg-blue-300 text-[#07111f]"
                      : "border-white/10 bg-white/[0.06] text-blue-100/75 hover:bg-white/[0.1]"
                  }`}
                >
                  {scenario.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-medium text-blue-100">
            Describe your situation
          </span>

          <textarea
            rows={7}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Example: I run a small design business from home, meet clients, store customer information, use online payments, drive to meetings, and own a laptop and camera gear."
            className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-[#0d1b2f] px-4 py-3 text-white outline-none placeholder:text-blue-100/40"
          />
        </label>

        <button
          type="button"
          onClick={handleGenerate}
          className="mt-6 w-full rounded-full bg-blue-400 px-6 py-4 font-semibold text-[#07111f] transition hover:scale-[1.02] hover:bg-blue-300"
        >
          Generate guidance preview
        </button>

        <p className="mt-4 text-xs leading-6 text-blue-100/50">
          This prototype provides general information only. It does not provide
          personal financial advice, arrange insurance, compare the whole market,
          or replace a licensed broker or insurer.
        </p>
      </form>

      {hasGenerated && (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                Guidance preview
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                {results.length > 0
                  ? `${results.length} cover areas detected`
                  : "More information needed"}
              </h3>
            </div>

            <p className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-blue-100/70">
              Jurisdiction: Australia {state !== "Not sure" ? `· ${state}` : ""}
            </p>
          </div>

          {results.length === 0 ? (
            <p className="mt-4 leading-7 text-blue-100/70">
              Try describing your home, work, assets, vehicles, business
              activities, staff, travel, valuables, or location risks.
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              {results.map((result) => (
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

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-blue-100/60">
                      <span>Relevance score</span>
                      <span>{result.score}/100</span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-blue-300"
                        style={{ width: getScoreBarWidth(result.score) }}
                      />
                    </div>
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

                  <p className="mt-4 text-xs leading-6 text-blue-100/45">
                    Confidence: {result.confidence}. This is a rules-based
                    prototype and should be treated as general guidance only.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {hasGenerated && <CoverageReport matches={coverageMatches} />}
    </div>
  );
}