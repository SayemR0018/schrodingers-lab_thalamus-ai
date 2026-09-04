import type { SuggestedQuestion } from "./types";

export const suggestedQuestions: SuggestedQuestion[] = [
  {
    id: "overview-1",
    text: "What should I focus on today?",
    textBn: "আজ আমার কোন বিষয়ে মনোযোগ দেওয়া উচিত?",
    category: "overview",
    reportType: "daily-priorities",
    involvedAgents: ["sales-analyst", "inventory-agent", "customer-success", "finance-agent"],
  },
  {
    id: "sales-1",
    text: "Why did sales drop this month?",
    textBn: "এই মাসে বিক্রয় কেন কমেছে?",
    category: "sales",
    reportType: "sales-analysis",
    involvedAgents: ["sales-analyst", "customer-success", "inventory-agent"],
  },
  {
    id: "inventory-1",
    text: "Which products are at risk of stockout?",
    textBn: "কোন পণ্য স্টকআউটের ঝুঁকিতে আছে?",
    category: "inventory",
    reportType: "inventory-risk",
    involvedAgents: ["inventory-agent", "sales-analyst"],
  },
  {
    id: "customer-1",
    text: "Why are customers leaving?",
    textBn: "গ্রাহকরা কেন চলে যাচ্ছে?",
    category: "customer",
    reportType: "customer-churn",
    involvedAgents: ["customer-success", "sales-analyst", "marketing-agent"],
  },
];

export const questionToReportMap: Record<string, string> = {
  "overview-1": "report-daily-priorities",
  "sales-1": "report-sales-drop",
  "inventory-1": "report-inventory-risk",
  "customer-1": "report-customer-churn",
};

export const contextualQuestions: Record<string, SuggestedQuestion[]> = {
  "entity-classic-shirt": [
    {
      id: "ctx-shirt-1",
      text: "Why are Classic Shirt sales declining?",
      textBn: "ক্লাসিক শার্টের বিক্রয় কেন কমছে?",
      category: "sales",
      reportType: "product-analysis",
      involvedAgents: ["sales-analyst", "inventory-agent"],
    },
    {
      id: "ctx-shirt-2",
      text: "Should we restock Classic Shirt?",
      textBn: "আমাদের কি ক্লাসিক শার্ট পুনরায় মজুদ করা উচিত?",
      category: "inventory",
      reportType: "restock-recommendation",
      involvedAgents: ["inventory-agent"],
    },
  ],
  "sales-analyst": [
    {
      id: "ctx-sales-1",
      text: "Show me today's sales performance",
      textBn: "আজকের বিক্রয় কর্মক্ষমতা দেখান",
      category: "sales",
      reportType: "daily-sales",
      involvedAgents: ["sales-analyst"],
    },
    {
      id: "ctx-sales-2",
      text: "What are the top selling products?",
      textBn: "শীর্ষ বিক্রয় পণ্যগুলো কী কী?",
      category: "sales",
      reportType: "top-products",
      involvedAgents: ["sales-analyst"],
    },
  ],
  "inventory-agent": [
    {
      id: "ctx-inv-1",
      text: "What's the current inventory status?",
      textBn: "বর্তমান মজুদের অবস্থা কী?",
      category: "inventory",
      reportType: "inventory-status",
      involvedAgents: ["inventory-agent"],
    },
    {
      id: "ctx-inv-2",
      text: "Which suppliers are most reliable?",
      textBn: "কোন সরবরাহকারীরা সবচেয়ে নির্ভরযোগ্য?",
      category: "inventory",
      reportType: "supplier-analysis",
      involvedAgents: ["inventory-agent"],
    },
  ],
};

// Legacy exports for backward compatibility
export const mockConversation: never[] = [];
export const mockResponses: Record<string, never> = {};

// Add textBn to contextual questions
// (kept here so the existing export shape stays the same; callers can rely
// on SuggestedQuestion.textBn being optional.)
