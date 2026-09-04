/**
 * Bengali response templates used by the conversation service when the
 * active language is Bengali OR the user's input contains Bengali script.
 *
 * Markdown formatting markers (`**bold**`, lists, blank-line paragraph
 * breaks) are preserved so the lightweight renderer in `src/lib/markdown.tsx`
 * can format them in the UI. Bengali uses the sentence-final `।` (U+0964)
 * and a slightly more formal register than casual English.
 */

export const responsesBn: {
  dataDetected: (key: string, value: string) => string;
  reportReady: (agentsCount: number) => string;
  dataAdded: (key: string, value: string, version: string) => string;
  genericAnalysis: (content: string, max: number, version: string) => string;
  basicFallback: (content: string, max: number) => string;
} = {
  /**
   * Response when business information is detected in the user's message.
   */
  dataDetected: (key, value) =>
    `আমি লক্ষ্য করলাম যে আপনি ব্যবসায়িক তথ্য শেয়ার করছেন। আমি এটি আপনার ব্যবসায়িক প্রসঙ্গে যোগ করতে পারি:\n\n**${key}**\n${value}`,

  /**
   * Response after a successful analysis flow.
   */
  reportReady: (agentsCount) =>
    `বিশ্লেষণ সম্পন্ন হয়েছে। **${agentsCount}টি এজেন্ট** এবং একাধিক ডেটা উৎসের ভিত্তিতে আমি আপনার জন্য একটি বিস্তারিত রিপোর্ট তৈরি করেছি।`,

  /**
   * Response after the user confirms adding business data.
   */
  dataAdded: (key, value, version) =>
    `আমি "${key}: ${value}" আপনার ব্যবসায়িক প্রসঙ্গে যোগ করেছি। এটি এখন v${version} এর অংশ।`,

  /**
   * Generic analysis fallback for free-form questions.
   */
  genericAnalysis: (content, max, version) =>
    `আমি বুঝতে পেরেছি আপনি জানতে চাইছেন "${content.slice(0, max)}${content.length > max ? "..." : ""}"\n\nআমি সংযুক্ত সিস্টেমগুলোর প্রাসঙ্গিক ব্যবসায়িক ডেটা বিশ্লেষণ করছি। এটি একটি প্রোটোটাইপ প্রতিক্রিয়া — সম্পূর্ণ পণ্যটি আপনার ব্যবসায়িক প্রসঙ্গ (v${version}) অনুযায়ী নির্দিষ্ট অন্তর্দৃষ্টি প্রদান করবে।`,

  /**
   * Short fallback for the basic sendMessage flow.
   */
  basicFallback: (content, max) =>
    `আমি বুঝতে পেরেছি আপনি জানতে চাইছেন "${content.slice(0, max)}${content.length > max ? "..." : ""}"\n\nআমি সমস্ত সংযুক্ত সিস্টেমের প্রাসঙ্গিক ব্যবসায়িক ডেটা বিশ্লেষণ করছি। এটি একটি প্রোটোটাইপ প্রতিক্রিয়া — সম্পূর্ণ পণ্যটি আপনার ব্যবসায়িক প্রসঙ্গ অনুযায়ী রিয়েল-টাইম অন্তর্দৃষ্টি প্রদান করবে।`,
};
