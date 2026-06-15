export type UserType =
  | "Renter"
  | "Homeowner"
  | "Sole trader"
  | "Small business owner"
  | "Landlord";

export type AustralianState =
  | "NSW"
  | "VIC"
  | "QLD"
  | "WA"
  | "SA"
  | "TAS"
  | "ACT"
  | "NT"
  | "Not sure";

export type ScenarioKey =
  | "worksFromHome"
  | "meetsClients"
  | "storesCustomerData"
  | "ownsValuables"
  | "usesVehicle"
  | "hasStaff"
  | "travels"
  | "floodStormBushfire";

export type InsuranceSuggestion = {
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  confidence: "Strong" | "Moderate" | "Early signal";
  score: number;
  reason: string;
  signals: string[];
  nextSteps: string[];
};

const keywordGroups = {
  car: ["car", "vehicle", "drive", "driving", "ute", "van", "truck"],
  valuables: [
    "jewellery",
    "jewelry",
    "camera",
    "laptop",
    "phone",
    "bike",
    "watch",
    "equipment",
  ],
  cyber: [
    "online",
    "website",
    "customer data",
    "payments",
    "email",
    "software",
    "database",
    "client data",
    "store information",
  ],
  travel: ["travel", "overseas", "holiday", "flight", "trip"],
  clients: ["client", "clients", "customer", "customers", "meetings"],
  advice: [
    "advice",
    "consulting",
    "consultant",
    "design",
    "accounting",
    "legal",
    "marketing",
    "strategy",
    "professional service",
  ],
  staff: ["employee", "employees", "staff", "worker", "workers", "contractor"],
  tools: ["tools", "equipment", "machinery", "stock", "inventory"],
  floodStormBushfire: [
    "flood",
    "storm",
    "bushfire",
    "fire",
    "hail",
    "cyclone",
    "river",
    "coast",
  ],
};

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function matchedSignals(text: string, words: string[]) {
  return words.filter((word) => text.includes(word));
}

function hasScenario(scenarios: ScenarioKey[], scenario: ScenarioKey) {
  return scenarios.includes(scenario);
}

function priorityFromScore(score: number): InsuranceSuggestion["priority"] {
  if (score >= 80) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}

function confidenceFromScore(score: number): InsuranceSuggestion["confidence"] {
  if (score >= 80) return "Strong";
  if (score >= 50) return "Moderate";
  return "Early signal";
}

function createSuggestion(params: {
  title: string;
  category: string;
  score: number;
  reason: string;
  signals: string[];
  nextSteps: string[];
}): InsuranceSuggestion {
  return {
    title: params.title,
    category: params.category,
    score: Math.min(params.score, 100),
    priority: priorityFromScore(params.score),
    confidence: confidenceFromScore(params.score),
    reason: params.reason,
    signals: params.signals.length > 0 ? params.signals : ["Profile type"],
    nextSteps: params.nextSteps,
  };
}

export function generateInsuranceSuggestions(
  userType: UserType,
  description: string,
  state: AustralianState,
  scenarios: ScenarioKey[]
): InsuranceSuggestion[] {
  const text = description.toLowerCase();
  const suggestions: InsuranceSuggestion[] = [];

  const isBusiness =
    userType === "Sole trader" || userType === "Small business owner";

  const usesVehicle =
    includesAny(text, keywordGroups.car) || hasScenario(scenarios, "usesVehicle");

  const ownsValuables =
    includesAny(text, keywordGroups.valuables) ||
    hasScenario(scenarios, "ownsValuables");

  const hasCyberRisk =
    includesAny(text, keywordGroups.cyber) ||
    hasScenario(scenarios, "storesCustomerData");

  const meetsClients =
    includesAny(text, keywordGroups.clients) ||
    hasScenario(scenarios, "meetsClients");

  const providesAdvice =
    includesAny(text, keywordGroups.advice) || isBusiness;

  const hasStaff =
    includesAny(text, keywordGroups.staff) || hasScenario(scenarios, "hasStaff");

  const travels =
    includesAny(text, keywordGroups.travel) || hasScenario(scenarios, "travels");

  const hasNaturalHazardSignal =
    includesAny(text, keywordGroups.floodStormBushfire) ||
    hasScenario(scenarios, "floodStormBushfire");

  if (userType === "Renter") {
    suggestions.push(
      createSuggestion({
        title: "Contents insurance",
        category: "Personal property",
        score: ownsValuables ? 88 : 75,
        reason:
          "Contents insurance may be relevant because renters usually do not own the building, but may still need protection for belongings inside the property.",
        signals: [
          "Renter profile",
          ...(ownsValuables ? ["Valuables or personal items"] : []),
          ...matchedSignals(text, keywordGroups.valuables),
        ],
        nextSteps: [
          "List high-value belongings such as laptops, bikes, jewellery, phones, and camera gear.",
          "Check whether portable items are covered away from home.",
          "Check sub-limits, excesses, and accidental damage conditions.",
        ],
      })
    );
  }

  if (userType === "Homeowner") {
    suggestions.push(
      createSuggestion({
        title: "Home and contents insurance",
        category: "Property",
        score: hasNaturalHazardSignal ? 92 : 82,
        reason:
          "Home and contents insurance may be relevant because homeowners may need cover for both the building and belongings inside it.",
        signals: [
          "Homeowner profile",
          ...(hasNaturalHazardSignal ? ["Natural hazard signal"] : []),
          ...matchedSignals(text, keywordGroups.floodStormBushfire),
        ],
        nextSteps: [
          "Check rebuilding cost assumptions, not just the purchase price of the home.",
          "Review flood, storm, bushfire, temporary accommodation, and excess settings.",
          "Store photos, receipts, and renovation records in a policy vault.",
        ],
      })
    );
  }

  if (userType === "Landlord") {
    suggestions.push(
      createSuggestion({
        title: "Landlord insurance",
        category: "Property investment",
        score: 90,
        reason:
          "Landlord insurance may be relevant because rental properties can involve tenant, rent, property damage, and liability risks.",
        signals: ["Landlord profile"],
        nextSteps: [
          "Check tenant damage, rent default, loss of rent, liability, and building cover.",
          "Keep lease documents and inspection reports organised.",
          "Review cover whenever tenant status or property use changes.",
        ],
      })
    );
  }

  if (isBusiness || meetsClients) {
    suggestions.push(
      createSuggestion({
        title: "Public liability insurance",
        category: "Business liability",
        score: meetsClients ? 90 : 78,
        reason:
          "Public liability may be relevant where a business interacts with clients, customers, suppliers, or members of the public.",
        signals: [
          ...(isBusiness ? ["Business profile"] : []),
          ...(meetsClients ? ["Meets clients or customers"] : []),
          ...matchedSignals(text, keywordGroups.clients),
        ],
        nextSteps: [
          "Check whether clients, landlords, markets, venues, or contracts require evidence of cover.",
          "Think about whether you meet people at home, on site, in public, or at client premises.",
          "Keep certificates of currency easy to access.",
        ],
      })
    );
  }

  if (providesAdvice) {
    suggestions.push(
      createSuggestion({
        title: "Professional indemnity insurance",
        category: "Professional services",
        score: includesAny(text, keywordGroups.advice) ? 88 : 60,
        reason:
          "Professional indemnity may be relevant when a person or business provides advice, designs, consulting, or professional services.",
        signals: [
          ...(isBusiness ? ["Business profile"] : []),
          ...matchedSignals(text, keywordGroups.advice),
        ],
        nextSteps: [
          "Check whether your work involves advice, designs, recommendations, or professional judgement.",
          "Review client contracts for minimum insurance requirements.",
          "Keep records of project scope, approvals, and client instructions.",
        ],
      })
    );
  }

  if (hasCyberRisk) {
    suggestions.push(
      createSuggestion({
        title: "Cyber insurance",
        category: "Digital risk",
        score: isBusiness ? 78 : 58,
        reason:
          "Cyber insurance may be relevant if you take online payments, store customer data, run a website, or rely on digital systems.",
        signals: [
          ...(hasScenario(scenarios, "storesCustomerData")
            ? ["Stores customer data"]
            : []),
          ...matchedSignals(text, keywordGroups.cyber),
        ],
        nextSteps: [
          "Check whether you store personal information, payment details, or client files.",
          "Review whether cover includes scams, data breaches, recovery costs, and interruption.",
          "Use strong passwords, MFA, backups, and software updates as basic risk controls.",
        ],
      })
    );
  }

  if (usesVehicle) {
    suggestions.push(
      createSuggestion({
        title: "Car or commercial motor insurance",
        category: "Vehicle",
        score: isBusiness ? 74 : 62,
        reason:
          "Vehicle insurance may be relevant if you use a car, van, ute, or other vehicle personally or for work.",
        signals: [
          ...(hasScenario(scenarios, "usesVehicle") ? ["Uses a vehicle"] : []),
          ...matchedSignals(text, keywordGroups.car),
        ],
        nextSteps: [
          "Check whether the vehicle is used for personal use, business use, deliveries, or client visits.",
          "Business use may need to be disclosed to the insurer.",
          "Compare comprehensive, third party property, and other vehicle options.",
        ],
      })
    );
  }

  if (ownsValuables) {
    suggestions.push(
      createSuggestion({
        title: "Portable valuables cover",
        category: "Personal items",
        score: 68,
        reason:
          "Portable valuables may not be fully covered away from home under a standard contents policy.",
        signals: [
          ...(hasScenario(scenarios, "ownsValuables")
            ? ["Owns valuables"]
            : []),
          ...matchedSignals(text, keywordGroups.valuables),
        ],
        nextSteps: [
          "Check item limits for phones, laptops, cameras, bikes, watches, and jewellery.",
          "Keep receipts, serial numbers, photos, and valuations.",
          "Check whether accidental loss and theft away from home are covered.",
        ],
      })
    );
  }

  if (hasStaff) {
    suggestions.push(
      createSuggestion({
        title: "Workers compensation considerations",
        category: "Employment obligations",
        score: 88,
        reason:
          "If a business has workers, employees, or some contractors, workers compensation obligations may become relevant.",
        signals: [
          ...(hasScenario(scenarios, "hasStaff") ? ["Has staff"] : []),
          ...matchedSignals(text, keywordGroups.staff),
        ],
        nextSteps: [
          "Check the rules for your state or territory.",
          "Clarify whether people are employees, contractors, subcontractors, or casual workers.",
          "This area should be checked carefully before relying on any automated guidance.",
        ],
      })
    );
  }

  if (travels) {
    suggestions.push(
      createSuggestion({
        title: "Travel insurance",
        category: "Travel",
        score: 55,
        reason:
          "Travel insurance may be relevant when travelling interstate or overseas.",
        signals: [
          ...(hasScenario(scenarios, "travels") ? ["Travels"] : []),
          ...matchedSignals(text, keywordGroups.travel),
        ],
        nextSteps: [
          "Check medical, cancellation, luggage, rental vehicle excess, and activity exclusions.",
          "Review pre-existing condition rules where relevant.",
          "Check whether business travel needs different cover from personal travel.",
        ],
      })
    );
  }

  if (state !== "Not sure" && hasNaturalHazardSignal) {
    suggestions.push(
      createSuggestion({
        title: "Location and natural hazard review",
        category: "Location risk",
        score: 72,
        reason:
          "Location-related risks such as flood, storm, bushfire, hail, or cyclone can affect which policy features may matter.",
        signals: [
          state,
          ...(hasScenario(scenarios, "floodStormBushfire")
            ? ["Flood, storm, or bushfire concern"]
            : []),
          ...matchedSignals(text, keywordGroups.floodStormBushfire),
        ],
        nextSteps: [
          "Check official warnings and local hazard information for your area.",
          "Review policy definitions for flood, storm, bushfire, temporary accommodation, and exclusions.",
          "Do not switch or cancel cover purely because of an automated prompt.",
        ],
      })
    );
  }

  return suggestions
    .filter(
      (suggestion, index, self) =>
        index === self.findIndex((item) => item.title === suggestion.title)
    )
    .sort((a, b) => b.score - a.score);
}