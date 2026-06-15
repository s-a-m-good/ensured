export type CoverageFeature =
  | "contents"
  | "portableValuables"
  | "homeBuilding"
  | "landlord"
  | "publicLiability"
  | "professionalIndemnity"
  | "cyber"
  | "commercialMotor"
  | "toolsEquipment"
  | "workersComp"
  | "travel"
  | "naturalHazardReview";

export type PriceLevel = "$" | "$$" | "$$$";

export type PolicyOption = {
  id: string;
  name: string;
  provider: string;
  targetUser: string;
  features: CoverageFeature[];
  strengths: string[];
  limitations: string[];
  priceLevel: PriceLevel;
  dataSourceNote: string;
};

export const samplePolicyOptions: PolicyOption[] = [
  {
    id: "sample-business-essentials",
    name: "Business Essentials Pack",
    provider: "Sample insurer",
    targetUser: "Sole traders and small service businesses",
    features: ["publicLiability", "toolsEquipment", "commercialMotor"],
    strengths: [
      "Good basic business liability fit",
      "Can suit businesses that meet clients or visit worksites",
      "Includes business asset and vehicle-related signals",
    ],
    limitations: [
      "Professional indemnity may need to be added separately",
      "Cyber cover may be limited or unavailable",
      "This is sample data only",
    ],
    priceLevel: "$$",
    dataSourceNote: "Prototype sample option, not a live policy.",
  },
  {
    id: "sample-professional-services",
    name: "Professional Services Cover",
    provider: "Sample broker panel",
    targetUser: "Consultants, designers, accountants, marketers, and advisers",
    features: ["professionalIndemnity", "publicLiability", "cyber"],
    strengths: [
      "Strong fit for advice, design, consulting, and professional service risks",
      "Combines professional indemnity and public liability signals",
      "Includes cyber-related signals for client data and online systems",
    ],
    limitations: [
      "May not cover stock, tools, or trade equipment",
      "Motor cover would usually need separate review",
      "Contract-required limits still need checking",
    ],
    priceLevel: "$$$",
    dataSourceNote: "Prototype sample option, not a live policy.",
  },
  {
    id: "sample-contents-plus",
    name: "Contents Plus",
    provider: "Sample insurer",
    targetUser: "Renters with personal belongings and portable valuables",
    features: ["contents", "portableValuables", "travel"],
    strengths: [
      "Good fit for renters with laptops, phones, bikes, camera gear, or jewellery",
      "Highlights portable valuables away from home",
      "Can support users who travel with belongings",
    ],
    limitations: [
      "Does not cover the building itself",
      "Business equipment may need separate cover",
      "Item limits and proof of ownership must be checked",
    ],
    priceLevel: "$",
    dataSourceNote: "Prototype sample option, not a live policy.",
  },
  {
    id: "sample-home-protect",
    name: "Home Protect",
    provider: "Sample insurer",
    targetUser: "Homeowners needing building and contents review",
    features: ["homeBuilding", "contents", "naturalHazardReview"],
    strengths: [
      "Good fit for homeowners reviewing building and contents cover",
      "Flags flood, storm, bushfire, and rebuilding-cost questions",
      "Useful for keeping photos and documents organised",
    ],
    limitations: [
      "Flood and storm definitions vary and must be checked in the PDS",
      "Does not automatically include landlord cover",
      "Rebuilding sum insured needs careful review",
    ],
    priceLevel: "$$",
    dataSourceNote: "Prototype sample option, not a live policy.",
  },
  {
    id: "sample-landlord-protect",
    name: "Landlord Protect",
    provider: "Sample insurer",
    targetUser: "Residential landlords",
    features: ["landlord", "homeBuilding", "naturalHazardReview"],
    strengths: [
      "Good fit for rental property risks",
      "Flags rent loss, tenant damage, liability, and building-cover questions",
      "Useful for property-document organisation",
    ],
    limitations: [
      "Tenant damage and rent default conditions vary heavily",
      "Strata and standalone properties may need different treatment",
      "Not a substitute for broker or insurer review",
    ],
    priceLevel: "$$",
    dataSourceNote: "Prototype sample option, not a live policy.",
  },
  {
    id: "sample-cyber-lite",
    name: "Cyber Lite",
    provider: "Sample cyber partner",
    targetUser: "Small businesses using websites, online payments, or customer data",
    features: ["cyber"],
    strengths: [
      "Focused on digital risk signals",
      "Useful where customer information, online payments, or websites are involved",
      "Can sit beside other business cover",
    ],
    limitations: [
      "Does not replace public liability or professional indemnity",
      "Cover for scams, recovery costs, and interruption must be checked",
      "Security controls may be required",
    ],
    priceLevel: "$",
    dataSourceNote: "Prototype sample option, not a live policy.",
  },
];