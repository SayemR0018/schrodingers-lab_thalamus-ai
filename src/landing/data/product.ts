export type ContextSource = {
  name: string;
  status: string;
};

export type ResourceLink = {
  label: string;
  href: string;
  detail: string;
};

export const contextSources: ContextSource[] = [
  { name: "Sales", status: "Context" },
  { name: "Documents", status: "Evidence" },
  { name: "Workflows", status: "Control" },
];

export const resourceLinks: ResourceLink[] = [
  { label: "Business Brain", href: "#product", detail: "How persistent context works" },
  { label: "AI Workforce", href: "#platform", detail: "How objectives map to agents" },
  { label: "Questions", href: "#questions", detail: "Examples of grounded business answers" },
  { label: "Governance", href: "#governance", detail: "Evidence, confidence, and approval" },
];
