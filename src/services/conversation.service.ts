import type { ConversationMessage, SuggestedQuestion } from "./types";
import {
  suggestedQuestions,
  mockConversation,
  mockResponses,
} from "@/data/mock/conversation";
import { containsBengali } from "@/lib/bengali";
import type { Language } from "@/store/app.store";

export interface ConversationService {
  getSuggestedQuestions(): Promise<SuggestedQuestion[]>;
  getConversation(): Promise<ConversationMessage[]>;
  getResponseForQuestion(questionId: string): Promise<ConversationMessage | null>;
  sendMessage(content: string, language?: Language): Promise<ConversationMessage>;
}

export const conversationService: ConversationService = {
  async getSuggestedQuestions() {
    return suggestedQuestions;
  },

  async getConversation() {
    return mockConversation;
  },

  async getResponseForQuestion(questionId: string) {
    return mockResponses[questionId] ?? null;
  },

  async sendMessage(content: string, language: Language = "en") {
    const useBengali =
      language === "bn" ||
      // Mirror back in Bengali if user typed Bengali regardless of UI language
      containsBengali(content);

    const snippet = `${content.slice(0, 50)}${content.length > 50 ? "..." : ""}`;
    const responseText = useBengali
      ? `আমি আপনার "${snippet}" সম্পর্কে প্রশ্ন বুঝতে পেরেছি।\n\nসমস্ত সংযুক্ত সিস্টেমে প্রাসঙ্গিক ব্যবসায়িক তথ্য বিশ্লেষণ করছি। এটি একটি প্রোটোটাইপ প্রতিক্রিয়া — সম্পূর্ণ পণ্যে আমি আপনার ব্যবসায়িক প্রসঙ্গের ভিত্তিতে রিয়েল-টাইম অন্তর্দৃষ্টি প্রদান করব।`
      : `I understand you're asking about "${snippet}"\n\nI'm analyzing the relevant business data across all connected systems. This is a prototype response — in the full product, I would provide real-time insights based on your business context.`;

    const response: ConversationMessage = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: responseText,
      timestamp: useBengali ? "এইমাত্র" : "Just now",
    };
    return response;
  },
};
