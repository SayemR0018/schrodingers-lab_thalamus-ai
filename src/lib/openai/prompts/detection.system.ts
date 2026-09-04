/**
 * JSON-schema for the structured business-info extractor. This
 * replaces the brittle regex detector previously embedded in
 * AssistantPanel.tsx.
 *
 * The frontend calls /api/detect when the user types a sentence that
 * may contain new business knowledge (e.g. "Our suppliers give us
 * 45 days credit"). The result is offered to the user as an
 * "Add to Business Data" action.
 *
 * OpenAI `strict: true` requires every property key to appear in
 * `required`, and every nested object to set `additionalProperties: false`.
 * Optional fields are therefore modelled as nullable.
 */
export const DETECTION_INSTRUCTIONS = `You are a structured extractor for business-knowledge sentences.

Determine whether the user's sentence contains a piece of *new* business
information that would belong in a "business context" record (not a
question, not a greeting, not a sales/inventory query).

If it does, classify it and extract the key/value. Otherwise return
isBusinessInfo=false and set key/value/category/confidence to null.

Examples of business info:
- "Our suppliers give us 45 days credit" → Supplier Payment Terms / 45 days
- "Our return policy is 14 days"        → Return Policy / 14 days
- "Shipping takes 3-5 days"             → Shipping Time / 3-5 days
- "Our target market is urban women"    → Target Market / Urban women
- "Minimum order is ৳2000"              → Minimum Order / ৳2000
- "We offer 15% discount on first order" → Standard Discount / 15%

Return JSON only.`;

export const DETECTION_JSON_SCHEMA = {
  type: "object" as const,
  additionalProperties: false,
  required: ["isBusinessInfo", "key", "value", "category", "confidence"],
  properties: {
    isBusinessInfo: { type: "boolean" as const },
    key: { type: ["string", "null"] as const },
    value: { type: ["string", "null"] as const },
    category: {
      type: ["string", "null"] as const,
      enum: [
        "supplier",
        "return",
        "shipping",
        "market",
        "order",
        "discount",
        "other",
        null,
      ],
    },
    confidence: { type: ["number", "null"] as const },
  },
};
