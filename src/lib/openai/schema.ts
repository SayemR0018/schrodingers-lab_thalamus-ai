/**
 * Strict OpenAI JSON-schema for THALAMUS inference responses.
 *
 * The GPT-5.6 family supports `response_format: { type: "json_schema", strict: true }`
 * which requires `additionalProperties: false` on every object level. The
 * schema below complies with that constraint.
 *
 * It is used by:
 *   - `runThalamusInference` for `/api/agents/[id]/invoke`
 *   - the planner prompt in `orchestrator.ts` (single-object variant)
 */
export const VALID_AGENTS = [
  "sales-analyst",
  "marketing-agent",
  "inventory-agent",
  "customer-success",
  "finance-agent",
  "automation-agent",
  "policy-docs-agent",
] as const;

export type ValidAgent = (typeof VALID_AGENTS)[number];

/**
 * Normalize an inbound agent identifier.
 *
 * Accepts both kebab-case (`sales-analyst`) and snake_case (`sales_analyst`)
 * inputs from the frontend and external callers. Falls back to
 * `sales-analyst` for any unknown identifier so the inference path is
 * always valid.
 */
export function normalizeAgentId(rawId?: string): string {
  if (!rawId) return "sales-analyst";
  const formatted = rawId.replace(/_/g, "-").toLowerCase();
  if ((VALID_AGENTS as readonly string[]).includes(formatted)) {
    return formatted;
  }
  return "sales-analyst";
}

/**
 * Strict JSON-schema for a single THALAMUS insight response. All objects
 * have `additionalProperties: false` to satisfy `strict: true` mode.
 */
export const THALAMUS_OUTPUT_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  required: [
    "agent",
    "analyzed",
    "finding",
    "contributingFactors",
    "evidence",
    "recommendedAction",
  ],
  properties: {
    agent: {
      type: "string" as const,
      enum: [
        "sales-analyst",
        "marketing-agent",
        "inventory-agent",
        "customer-success",
        "finance-agent",
        "automation-agent",
        "policy-docs-agent",
      ],
    },
    analyzed: {
      type: "array" as const,
      items: {
        type: "object" as const,
        additionalProperties: false,
        required: ["domain", "records_scanned"],
        properties: {
          domain: { type: "string" as const },
          records_scanned: { type: "integer" as const },
        },
      },
    },
    finding: {
      type: "string" as const,
      description:
        "Business analysis narrative in the requested language (Bangla or English).",
    },
    contributingFactors: {
      type: "array" as const,
      items: {
        type: "object" as const,
        additionalProperties: false,
        required: ["factor", "magnitude"],
        properties: {
          factor: { type: "string" as const },
          magnitude: { type: "string" as const },
        },
      },
    },
    evidence: {
      type: "array" as const,
      items: {
        type: "object" as const,
        additionalProperties: false,
        required: ["table", "record_ids"],
        properties: {
          table: { type: "string" as const },
          record_ids: {
            type: "array" as const,
            items: { type: "string" as const },
          },
        },
      },
    },
    recommendedAction: {
      type: "object" as const,
      additionalProperties: false,
      required: ["action", "riskTier", "confidence", "requiresApproval"],
      properties: {
        action: { type: "string" as const },
        riskTier: {
          type: "string" as const,
          enum: ["low", "medium", "high"],
        },
        confidence: { type: "number" as const },
        requiresApproval: { type: "boolean" as const },
      },
    },
  },
};

/** TypeScript shape inferred from the schema (for callers). */
export interface ThalamusInsightResponse {
  agent: ValidAgent;
  analyzed: Array<{ domain: string; records_scanned: number }>;
  finding: string;
  contributingFactors: Array<{ factor: string; magnitude: string }>;
  evidence: Array<{ table: string; record_ids: string[] }>;
  recommendedAction: {
    action: string;
    riskTier: "low" | "medium" | "high";
    confidence: number;
    requiresApproval: boolean;
  };
  _meta?: {
    model: string;
    agent: string;
    market: string;
  };
}
