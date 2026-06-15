import type { InsuranceSuggestion } from "@/lib/insuranceRules";
import {
  samplePolicyOptions,
  type CoverageFeature,
  type PolicyOption,
} from "@/lib/policyOptions";

export type CoverageMatch = {
  policy: PolicyOption;
  fitScore: number;
  matchedFeatures: CoverageFeature[];
  missingFeatures: CoverageFeature[];
  explanation: string;
  warningFlags: string[];
};

const suggestionToFeatureMap: Record<string, CoverageFeature> = {
  "Contents insurance": "contents",
  "Home and contents insurance": "homeBuilding",
  "Landlord insurance": "landlord",
  "Public liability insurance": "publicLiability",
  "Professional indemnity insurance": "professionalIndemnity",
  "Cyber insurance": "cyber",
  "Car or commercial motor insurance": "commercialMotor",
  "Portable valuables cover": "portableValuables",
  "Tools, equipment, or stock cover": "toolsEquipment",
  "Workers compensation considerations": "workersComp",
  "Travel insurance": "travel",
  "Location and natural hazard review": "naturalHazardReview",
};

function getNeededFeatures(suggestions: InsuranceSuggestion[]) {
  return suggestions
    .map((suggestion) => suggestionToFeatureMap[suggestion.title])
    .filter(Boolean);
}

function labelFeature(feature: CoverageFeature) {
  const labels: Record<CoverageFeature, string> = {
    contents: "contents",
    portableValuables: "portable valuables",
    homeBuilding: "home/building",
    landlord: "landlord",
    publicLiability: "public liability",
    professionalIndemnity: "professional indemnity",
    cyber: "cyber",
    commercialMotor: "commercial motor",
    toolsEquipment: "tools/equipment",
    workersComp: "workers compensation",
    travel: "travel",
    naturalHazardReview: "natural hazard review",
  };

  return labels[feature];
}

export function formatCoverageFeature(feature: CoverageFeature) {
  return labelFeature(feature);
}

export function matchCoverageOptions(
  suggestions: InsuranceSuggestion[]
): CoverageMatch[] {
  const neededFeatures = getNeededFeatures(suggestions);

  if (neededFeatures.length === 0) {
    return [];
  }

  const matches = samplePolicyOptions.map((policy) => {
    const matchedFeatures = neededFeatures.filter((feature) =>
      policy.features.includes(feature)
    );

    const missingFeatures = neededFeatures.filter(
      (feature) => !policy.features.includes(feature)
    );

    const coverageRatio = matchedFeatures.length / neededFeatures.length;
    const fitScore = Math.round(coverageRatio * 100);

    const explanation =
      matchedFeatures.length > 0
        ? `This option matches ${matchedFeatures.length} of ${neededFeatures.length} detected cover areas.`
        : "This option has a weak match against the detected cover areas.";

    const warningFlags = [
      ...policy.limitations,
      ...(fitScore < 50
        ? ["Low coverage fit based on the current profile signals."]
        : []),
      ...(missingFeatures.length > 0
        ? [
            `Missing detected areas: ${missingFeatures
              .map(labelFeature)
              .join(", ")}.`,
          ]
        : []),
    ];

    return {
      policy,
      fitScore,
      matchedFeatures,
      missingFeatures,
      explanation,
      warningFlags,
    };
  });

  return matches
    .filter((match) => match.fitScore > 0)
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 4);
}