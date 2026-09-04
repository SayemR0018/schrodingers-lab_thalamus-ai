export type Metric = {
  id: string;
  value: string;
  label: string;
  icon: "users" | "zap" | "chart" | "shield";
};

/**
 * Claim-safe product principles derived from the THALAMUS context.
 * Avoid publishing adoption, accuracy, or customer metrics until verified.
 */
export const metrics: Metric[] = [
  { id: "context", value: "Context", label: "Business-first understanding", icon: "users" },
  { id: "evidence", value: "Evidence", label: "Grounded recommendations", icon: "chart" },
  { id: "control", value: "Control", label: "Human approval for risk", icon: "shield" },
  { id: "loop", value: "Loop", label: "Outcomes update context", icon: "zap" },
];
