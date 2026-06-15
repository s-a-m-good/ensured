export type UserType =
  | "Renter"
  | "Homeowner"
  | "Sole trader"
  | "Small business owner"
  | "Landlord";

export type InsuranceSuggestion = {
  title: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
  note: string;
};

const keywordGroups = {
  car: ["car", "vehicle", "drive", "driving", "ute", "van"],
  valuables: ["jewellery", "camera", "laptop", "phone", "bike", "watch"],
  cyber: ["online", "website", "customer data", "payments", "email", "software"],
  travel: ["travel", "overseas", "holiday", "flight", "trip"],
  clients: ["client", "clients", "customer", "customers", "meetings"],
  advice: ["advice", "consulting", "consultant", "design", "accounting", "legal"],
  staff: ["employee", "employees", "staff", "worker", "workers"],
  tools: ["tools", "equipment", "machinery", "stock", "inventory"],
  property: ["house", "apartment", "unit", "home", "building", "property"],
};

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export function generateInsuranceSuggestions(
  userType: UserType,
  description: string
): InsuranceSuggestion[] {
  const text = description.toLowerCase();
  const suggestions: InsuranceSuggestion[] = [];

  if (userType === "Renter") {
    suggestions.push({
      title: "Contents insurance",
      priority: "High",
      reason:
        "Renters usually do not own the building, but may still need protection for belongings inside the property.",
      note: "Check limits for laptops, jewellery, bikes, phones, and accidental damage.",
    });
  }

  if (userType === "Homeowner") {
    suggestions.push({
      title: "Home and contents insurance",
      priority: "High",
      reason:
        "Homeowners may need cover for both the building itself and the belongings inside it.",
      note: "Consider whether flood, storm, temporary accommodation, and rebuilding costs are included.",
    });
  }

  if (userType === "Landlord") {
    suggestions.push({
      title: "Landlord insurance",
      priority: "High",
      reason:
        "Landlords may need cover for rental-property risks that normal home insurance may not fully address.",
      note: "Check rent default, tenant damage, liability, building cover, and loss-of-rent conditions.",
    });
  }

  if (userType === "Sole trader" || userType === "Small business owner") {
    suggestions.push({
      title: "Public liability insurance",
      priority: "High",
      reason:
        "Businesses that interact with clients, customers, suppliers, or the public may face liability risks.",
      note: "This is commonly considered by sole traders and small businesses, especially when contracts require evidence of cover.",
    });
  }

  if (
    userType === "Sole trader" ||
    userType === "Small business owner" ||
    includesAny(text, keywordGroups.advice)
  ) {
    suggestions.push({
      title: "Professional indemnity insurance",
      priority: includesAny(text, keywordGroups.advice) ? "High" : "Medium",
      reason:
        "Professional indemnity may be relevant when a person or business provides advice, designs, consulting, or professional services.",
      note: "Check whether your clients or contracts require a minimum level of cover.",
    });
  }

  if (includesAny(text, keywordGroups.cyber)) {
    suggestions.push({
      title: "Cyber insurance",
      priority: "Medium",
      reason:
        "Cyber cover may be relevant if you take online payments, store customer data, run a website, or rely on digital systems.",
      note: "Check whether cover includes data breaches, business interruption, scams, and recovery costs.",
    });
  }

  if (includesAny(text, keywordGroups.car)) {
    suggestions.push({
      title: "Car or commercial motor insurance",
      priority: "Medium",
      reason:
        "Vehicle insurance may be relevant if you use a car, van, ute, or other vehicle personally or for work.",
      note: "Business use may need to be disclosed to the insurer.",
    });
  }

  if (includesAny(text, keywordGroups.valuables)) {
    suggestions.push({
      title: "Portable valuables cover",
      priority: "Medium",
      reason:
        "Portable valuables may not be fully covered away from home under a standard contents policy.",
      note: "Check item limits, proof-of-ownership requirements, and whether accidental loss is covered.",
    });
  }

  if (includesAny(text, keywordGroups.tools)) {
    suggestions.push({
      title: "Tools, equipment, or stock cover",
      priority: "Medium",
      reason:
        "Business equipment, tools, stock, or machinery may need separate cover from personal contents insurance.",
      note: "Check whether items are covered in transit, at home, on site, or in a vehicle.",
    });
  }

  if (includesAny(text, keywordGroups.staff)) {
    suggestions.push({
      title: "Workers compensation considerations",
      priority: "High",
      reason:
        "If a business has workers or employees, workers compensation obligations may become relevant.",
      note: "Rules vary by state and business structure, so this should be checked carefully.",
    });
  }

  if (includesAny(text, keywordGroups.travel)) {
    suggestions.push({
      title: "Travel insurance",
      priority: "Low",
      reason:
        "Travel insurance may be relevant when travelling interstate or overseas.",
      note: "Check medical, cancellation, luggage, rental vehicle excess, and activity exclusions.",
    });
  }

  const unique = suggestions.filter(
    (suggestion, index, self) =>
      index === self.findIndex((item) => item.title === suggestion.title)
  );

  return unique;
}