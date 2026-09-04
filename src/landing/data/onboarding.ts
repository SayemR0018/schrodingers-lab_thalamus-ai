import type { ConnectionId, OnboardingProfile } from "@/landing/lib/onboarding-storage";

export type OnboardingStepKey = "business" | "goals" | "connect" | "understanding";

export const onboardingSteps: ReadonlyArray<{
  number: string;
  key: OnboardingStepKey;
  label: string;
}> = [
  { number: "01", key: "business", label: "Business" },
  { number: "02", key: "goals", label: "Goals" },
  { number: "03", key: "connect", label: "Connect" },
  { number: "04", key: "understanding", label: "Understanding" },
] as const;

export type ProfileFieldKey = keyof OnboardingProfile;

export const profileFields: ReadonlyArray<{
  key: ProfileFieldKey;
  label: string;
  placeholder: string;
  multiline?: boolean;
}> = [
  {
    key: "companyName",
    label: "Business / Company Name",
    placeholder: "Demo Commerce",
  },
  {
    key: "industry",
    label: "Industry",
    placeholder: "E-commerce",
  },
  {
    key: "products",
    label: "What do you sell?",
    placeholder: "Clothing and accessories",
  },
  {
    key: "customers",
    label: "Who are your customers?",
    placeholder: "Young adults in Bangladesh",
  },
  {
    key: "description",
    label: "Short description of the business",
    placeholder:
      "An online fashion business selling clothing and accessories through digital channels.",
    multiline: true,
  },
] as const;

export type BusinessGoalKey =
  | "grow-repeat-purchases"
  | "reduce-stockouts"
  | "cut-slow-moving-inventory"
  | "improve-customer-response-time"
  | "cut-marketing-waste"
  | "expand-to-new-channels"
  | "improve-cashflow-visibility";

export const businessGoals: ReadonlyArray<{
  key: BusinessGoalKey;
  label: string;
}> = [
  { key: "grow-repeat-purchases", label: "Grow repeat purchases" },
  { key: "reduce-stockouts", label: "Reduce stockouts" },
  { key: "cut-slow-moving-inventory", label: "Cut slow-moving inventory" },
  { key: "improve-customer-response-time", label: "Improve customer response time" },
  { key: "cut-marketing-waste", label: "Cut marketing waste" },
  { key: "expand-to-new-channels", label: "Expand to new channels" },
  { key: "improve-cashflow-visibility", label: "Improve cashflow visibility" },
] as const;

export type ConnectionOption = {
  id: ConnectionId;
  name: string;
  fields: ReadonlyArray<{
    id: string;
    label: string;
    placeholder?: string;
    type?: "text" | "file" | "password";
  }>;
};

export const connectionOptions: ReadonlyArray<ConnectionOption> = [
  {
    id: "google-sheets",
    name: "Google Sheets",
    fields: [
      { id: "sheet-url", label: "Sheet URL", placeholder: "https://docs.google.com/..." },
    ],
  },
  {
    id: "shopify",
    name: "Shopify",
    fields: [
      {
        id: "store-domain",
        label: "Store domain",
        placeholder: "your-store.myshopify.com",
      },
      {
        id: "access-token",
        label: "Access token",
        type: "password",
        placeholder: "Prototype only",
      },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    fields: [
      { id: "country-code", label: "Country code", placeholder: "+880" },
      { id: "business-number", label: "Business number", placeholder: "Business phone" },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    fields: [
      { id: "page-url", label: "Page URL", placeholder: "https://facebook.com/..." },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    fields: [
      { id: "profile-url", label: "Profile URL", placeholder: "https://instagram.com/..." },
    ],
  },
  {
    id: "csv-excel",
    name: "CSV / Excel",
    fields: [{ id: "spreadsheet-file", label: "Upload file", type: "file" }],
  },
  {
    id: "documents",
    name: "Documents",
    fields: [{ id: "document-file", label: "Upload file", type: "file" }],
  },
] as const;

export type UnderstandingStageKey =
  | "reading-profile"
  | "identifying-products"
  | "understanding-customers"
  | "mapping-goals"
  | "organizing-data"
  | "building-context"
  | "preparing-workspace";

export const understandingStages: ReadonlyArray<{
  key: UnderstandingStageKey;
  label: string;
}> = [
  { key: "reading-profile", label: "Reading business profile" },
  { key: "identifying-products", label: "Identifying products" },
  { key: "understanding-customers", label: "Understanding customers" },
  { key: "mapping-goals", label: "Mapping business goals" },
  { key: "organizing-data", label: "Organizing available data" },
  { key: "building-context", label: "Building business context" },
  { key: "preparing-workspace", label: "Preparing your workspace" },
] as const;
