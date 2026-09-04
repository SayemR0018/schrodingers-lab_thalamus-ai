/**
 * English response templates used by the conversation service when the
 * active language is English (or the user's input is not Bengali).
 *
 * Markdown formatting markers (`**bold**`, lists, blank-line paragraph
 * breaks) are preserved so the lightweight renderer in `src/lib/markdown.tsx`
 * can format them in the UI.
 */

export const responsesEn = {
  /**
   * Response when the assistant detects business information in the
   * user's chat message and offers to add it to the data context.
   */
  dataDetected: (key: string, value: string) =>
    `I detected that you're sharing business information. I can add this to your business context:\n\n**${key}**\n${value}`,

  /**
   * Response after a successful analysis flow for a suggested question
   * that has a generated report.
   */
  reportReady: (agentsCount: number) =>
    `I've completed the analysis. Based on the business data from **${agentsCount} agents** and multiple data sources, I've prepared a detailed report for you.`,

  /**
   * Response after the user adds the suggested business data.
   */
  dataAdded: (key: string, value: string, version: string) =>
    `I've added "${key}: ${value}" to your business context. This is now part of v${version}.`,

  /**
   * Generic fallback for free-form questions without a predefined report.
   */
  genericAnalysis: (content: string, max: number, version: string) =>
    `I understand you're asking about "${content.slice(0, max)}${content.length > max ? "..." : ""}"\n\nI'm analyzing the relevant business data across connected systems. This is a prototype response — in the full product, I would provide real-time insights based on your business context (v${version}).`,

  /**
   * Short fallback used in the basic sendMessage flow when no business
   * info is detected and no report matches.
   */
  basicFallback: (content: string, max: number) =>
    `I understand you're asking about "${content.slice(0, max)}${content.length > max ? "..." : ""}"\n\nI'm analyzing the relevant business data across all connected systems. This is a prototype response — in the full product, I would provide real-time insights based on your business context.`,
};

export type ResponseTemplates = typeof responsesEn;
