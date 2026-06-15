"use client";

import { useState } from "react";
import {
  generateInsuranceSuggestions,
  type InsuranceSuggestion,
  type UserType,
} from "@/lib/insuranceRules";

const userTypes: UserType[] = [
  "Renter",
  "Homeowner",
  "Sole trader",
  "Small business owner",
  "Landlord",
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

export default function EstimateForm() {
  const [userType, setUserType] = useState<UserType>("Renter");
  const [description, setDescription] = useState("");
  const [results, setResults] = useState<InsuranceSuggestion[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  function handleGenerate() {
    const suggestions = generateInsuranceSuggestions(userType, description);
    setResults(suggestions);
    setHasGenerated(true);
  }

  return (
    <div className="space-y-6">
      <form className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
        <label className="block">
          <span className="text-sm font-medium text-blue-100">I am a...</span>

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

        <label className="mt-5 block">
          <span className="text-sm font-medium text-blue-100">
            Describe your situation
          </span>

          <textarea
            rows={6}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Example: I run a small design business from home, meet clients occasionally, own a laptop and camera gear, and rent my apartment in Sydney."
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
          personal financial advice, arrange insurance, or replace a licensed
          broker or insurer.
        </p>
      </form>

      {hasGenerated && (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <h3 className="text-2xl font-semibold">Your guidance preview</h3>

          {results.length === 0 ? (
            <p className="mt-4 leading-7 text-blue-100/70">
              We need a little more information to generate useful guidance. Try
              describing your home, work, assets, vehicles, business activities,
              travel, or valuables.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {results.map((result) => (
                <div
                  key={result.title}
                  className="rounded-2xl border border-white/10 bg-[#0d1b2f] p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="text-xl font-semibold">{result.title}</h4>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                        result.priority
                      )}`}
                    >
                      {result.priority} relevance
                    </span>
                  </div>

                  <p className="mt-3 leading-7 text-blue-100/75">
                    {result.reason}
                  </p>

                  <p className="mt-3 rounded-2xl bg-white/[0.05] p-4 text-sm leading-6 text-blue-100/65">
                    {result.note}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}