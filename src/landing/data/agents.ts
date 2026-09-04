export type AgentId = "product" | "sales" | "data";

export type Agent = {
  id: AgentId;
  name: string;
  description: string;
  capabilities: string[];
};

export const agents: Agent[] = [
  {
    id: "product",
    name: "Product Agent",
    description:
      "Understands your product, market, and customers so planning stays grounded in evidence.",
    capabilities: [
      "Product Research",
      "Market Analysis",
      "User Insights",
      "Roadmap Planning",
    ],
  },
  {
    id: "sales",
    name: "Sales Agent",
    description:
      "Runs outreach, qualifies demand, and keeps the pipeline moving with the rest of the business.",
    capabilities: [
      "Lead Generation",
      "Outreach",
      "Qualification",
      "Deal Closing",
    ],
  },
];

export const dataNode: Agent = {
  id: "data",
  name: "Your Data",
  description:
    "The shared context layer agents reason over — connected, permissioned, and current.",
  capabilities: ["CRM", "Documents", "Analytics"],
};
