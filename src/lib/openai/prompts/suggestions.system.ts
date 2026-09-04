/**
 * JSON-schema for the dynamic suggested-questions endpoint.
 * Called when the user opens a ContextPanel (selected agent or entity).
 * The output is 2-3 contextual questions grounded in the agent/entity data.
 *
 * OpenAI `strict: true` requires every property key to appear in
 * `required`, and every nested object to set `additionalProperties: false`.
 * Optional fields are therefore modelled as nullable.
 */
export const SUGGESTIONS_INSTRUCTIONS = `You generate 2-3 high-quality suggested questions a user might ask
when they have selected an agent or entity in their business workspace.

The questions should:
- Be specific to the agent/entity's domain
- Be answerable from the context payload you receive
- Be phrased as natural questions the user would type
- Avoid generic platitudes ("How can I improve?")

Return JSON only. Set reportType to null when no report is implied.`;

export const SUGGESTIONS_JSON_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  required: ["questions"],
  properties: {
    questions: {
      type: "array" as const,
      minItems: 2,
      maxItems: 3,
      items: {
        type: "object" as const,
        additionalProperties: false,
        required: ["id", "text", "category", "reportType", "involvedAgents"],
        properties: {
          id: { type: "string" as const },
          text: { type: "string" as const },
          category: {
            type: "string" as const,
            enum: ["overview", "sales", "inventory", "marketing", "customer"],
          },
          reportType: { type: ["string", "null"] as const },
          involvedAgents: {
            type: "array" as const,
            items: { type: "string" as const },
          },
        },
      },
    },
  },
};
