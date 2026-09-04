import type { Report } from "./types";

export interface MockReport extends Report {
  titleBn: string;
  summaryBn: string;
  findingsBn: Array<{
    id: string;
    titleBn: string;
    detailBn?: string;
  }>;
  recommendationBn: string;
  evidenceBn: Array<{
    id: string;
    nameBn: string;
    relevantFindingBn?: string;
  }>;
  contextUsedBn: string[];
  generatedAtBn: string;
}

export const mockReports: MockReport[] = [
  {
    id: "report-sales-drop",
    title: "Why did sales drop this month?",
    titleBn: "এই মাসে বিক্রয় কেন কমেছে?",
    question: "Why did sales drop this month?",
    generatedAt: "Today, 10:42 AM",
    generatedAtBn: "আজ, সকাল ১০:৪২",
    generatedBy: ["sales-analyst", "customer-success", "inventory-agent"],
    confidence: 91,
    summary: "Sales decreased 8.4% compared with the previous month. The primary drivers are reduced performance in Dhaka region and stockout issues with top-selling products.",
    summaryBn:
      "গত মাসের তুলনায় বিক্রয় ৮.৪% কমেছে। প্রধান কারণগুলো হলো ঢাকা অঞ্চলে পারফরম্যান্স হ্রাস এবং শীর্ষ বিক্রয় পণ্যের স্টকআউট সমস্যা।",
    findings: [
      {
        id: "f1",
        title: "Dhaka sales",
        titleBn: "ঢাকা বিক্রয়",
        change: "↓ 13.2%",
        changeType: "negative",
        detail: "Regional performance below target for 3 consecutive weeks",
        detailBn: "টানা ৩ সপ্তাহ আঞ্চলিক পারফরম্যান্স লক্ষ্যমাত্রার নিচে",
      },
      {
        id: "f2",
        title: "Classic Shirt",
        titleBn: "ক্লাসিক শার্ট",
        change: "↓ 21%",
        changeType: "negative",
        detail: "Top product experiencing stockout since last week",
        detailBn: "গত সপ্তাহ থেকে শীর্ষ পণ্য স্টকআউটের সম্মুখীন",
      },
      {
        id: "f3",
        title: "Repeat customers",
        titleBn: "পুনরায় গ্রাহক",
        change: "↓ 7.8%",
        changeType: "negative",
        detail: "Customer retention declining in urban segments",
        detailBn: "শহুরে সেগমেন্টে গ্রাহক ধরে রাখা হ্রাস পাচ্ছে",
      },
    ],
    findingsBn: [
      { id: "f1", titleBn: "ঢাকা বিক্রয়", detailBn: "টানা ৩ সপ্তাহ আঞ্চলিক পারফরম্যান্স লক্ষ্যমাত্রার নিচে" },
      { id: "f2", titleBn: "ক্লাসিক শার্ট", detailBn: "গত সপ্তাহ থেকে শীর্ষ পণ্য স্টকআউটের সম্মুখীন" },
      { id: "f3", titleBn: "পুনরায় গ্রাহক", detailBn: "শহুরে সেগমেন্টে গ্রাহক ধরে রাখা হ্রাস পাচ্ছে" },
    ],
    evidence: [
      {
        id: "ev1",
        name: "Shopify Orders",
        nameBn: "Shopify অর্ডার",
        type: "shopify",
        recordCount: 12843,
        timeRange: "Jan — Jun 2026",
        relevantFinding: "Order volume decreased 8.4%",
        relevantFindingBn: "অর্ডারের পরিমাণ ৮.৪% কমেছে",
      },
      {
        id: "ev2",
        name: "Customer Records",
        nameBn: "গ্রাহক রেকর্ড",
        type: "customer",
        recordCount: 2104,
        relevantFinding: "Repeat purchase rate fell 7.8%",
        relevantFindingBn: "পুনরায় ক্রয়ের হার ৭.৮% কমেছে",
      },
      {
        id: "ev3",
        name: "Inventory Data",
        nameBn: "মজুদ ডেটা",
        type: "inventory",
        recordCount: 386,
        relevantFinding: "Classic Shirt below reorder point",
        relevantFindingBn: "ক্লাসিক শার্ট পুনঃঅর্ডার পয়েন্টের নিচে",
      },
      {
        id: "ev4",
        name: "Historical Sales",
        nameBn: "ঐতিহাসিক বিক্রয়",
        type: "internal",
        recordCount: 48721,
        timeRange: "12 months",
        relevantFinding: "Seasonal pattern deviation detected",
        relevantFindingBn: "মৌসুমী প্যাটার্ন বিচ্যুতি শনাক্ত",
      },
    ],
    evidenceBn: [
      { id: "ev1", nameBn: "Shopify অর্ডার", relevantFindingBn: "অর্ডারের পরিমাণ ৮.৪% কমেছে" },
      { id: "ev2", nameBn: "গ্রাহক রেকর্ড", relevantFindingBn: "পুনরায় ক্রয়ের হার ৭.৮% কমেছে" },
      { id: "ev3", nameBn: "মজুদ ডেটা", relevantFindingBn: "ক্লাসিক শার্ট পুনঃঅর্ডার পয়েন্টের নিচে" },
      { id: "ev4", nameBn: "ঐতিহাসিক বিক্রয়", relevantFindingBn: "মৌসুমী প্যাটার্ন বিচ্যুতি শনাক্ত" },
    ],
    recommendation: {
      text: "Increase promotion of Classic Shirt in Dhaka for the next 7 days. Prioritize restocking to prevent further revenue loss.",
      risk: "low",
      actionRequired: true,
      actionId: "approval-restock",
    },
    recommendationBn:
      "পরবর্তী ৭ দিনের জন্য ঢাকায় ক্লাসিক শার্টের প্রচার বাড়ান। আরও রাজস্ব ক্ষতি প্রতিরোধে পুনঃস্টককে অগ্রাধিকার দিন।",
    contextUsed: ["Products", "Customers", "Orders", "Inventory", "Regions"],
    contextUsedBn: ["পণ্য", "গ্রাহক", "অর্ডার", "মজুদ", "অঞ্চল"],
    status: "ready",
  },
  {
    id: "report-inventory-risk",
    title: "Which products are at risk?",
    titleBn: "কোন পণ্যগুলো ঝুঁকিতে?",
    question: "Which products are at risk of stockout?",
    generatedAt: "Today, 9:15 AM",
    generatedAtBn: "আজ, সকাল ৯:১৫",
    generatedBy: ["inventory-agent", "sales-analyst"],
    confidence: 87,
    summary: "7 products are at risk of stockout within the next 14 days. Immediate action required for 3 high-priority items.",
    summaryBn:
      "পরবর্তী ১৪ দিনের মধ্যে ৭টি পণ্য স্টকআউটের ঝুঁকিতে রয়েছে। ৩টি উচ্চ-অগ্রাধিকার পণ্যের জন্য তাৎক্ষণিক পদক্ষেপ প্রয়োজন।",
    findings: [
      {
        id: "f1",
        title: "Wireless Headphones",
        titleBn: "ওয়্যারলেস হেডফোন",
        change: "3 days",
        changeType: "negative",
        detail: "SKU-2847 — Current stock: 12 units",
        detailBn: "SKU-2847 — বর্তমান স্টক: ১২ ইউনিট",
      },
      {
        id: "f2",
        title: "USB-C Hub",
        titleBn: "USB-C হাব",
        change: "5 days",
        changeType: "negative",
        detail: "SKU-1293 — Current stock: 28 units",
        detailBn: "SKU-1293 — বর্তমান স্টক: ২৮ ইউনিট",
      },
      {
        id: "f3",
        title: "Laptop Stand",
        titleBn: "ল্যাপটপ স্ট্যান্ড",
        change: "7 days",
        changeType: "negative",
        detail: "SKU-0847 — Current stock: 45 units",
        detailBn: "SKU-0847 — বর্তমান স্টক: ৪৫ ইউনিট",
      },
    ],
    findingsBn: [
      { id: "f1", titleBn: "ওয়্যারলেস হেডফোন", detailBn: "SKU-2847 — বর্তমান স্টক: ১২ ইউনিট" },
      { id: "f2", titleBn: "USB-C হাব", detailBn: "SKU-1293 — বর্তমান স্টক: ২৮ ইউনিট" },
      { id: "f3", titleBn: "ল্যাপটপ স্ট্যান্ড", detailBn: "SKU-0847 — বর্তমান স্টক: ৪৫ ইউনিট" },
    ],
    evidence: [
      {
        id: "ev1",
        name: "Inventory Levels",
        nameBn: "মজুদের স্তর",
        type: "inventory",
        recordCount: 386,
        relevantFinding: "7 products below safety stock",
        relevantFindingBn: "৭টি পণ্য নিরাপত্তা স্টকের নিচে",
      },
      {
        id: "ev2",
        name: "Sales Velocity",
        nameBn: "বিক্রয় গতি",
        type: "shopify",
        recordCount: 12843,
        relevantFinding: "Daily demand exceeds supply rate",
        relevantFindingBn: "দৈনিক চাহিদা সরবরাহের হার ছাড়িয়ে গেছে",
      },
    ],
    evidenceBn: [
      { id: "ev1", nameBn: "মজুদের স্তর", relevantFindingBn: "৭টি পণ্য নিরাপত্তা স্টকের নিচে" },
      { id: "ev2", nameBn: "বিক্রয় গতি", relevantFindingBn: "দৈনিক চাহিদা সরবরাহের হার ছাড়িয়ে গেছে" },
    ],
    recommendation: {
      text: "Initiate emergency restock for Wireless Headphones. Review supplier lead times for other at-risk items.",
      risk: "medium",
      actionRequired: true,
      actionId: "approval-emergency-restock",
    },
    recommendationBn:
      "ওয়্যারলেস হেডফোনের জরুরি পুনঃস্টক শুরু করুন। অন্যান্য ঝুঁকিপূর্ণ পণ্যের জন্য সরবরাহকারীর লিড টাইম পর্যালোচনা করুন।",
    contextUsed: ["Products", "Inventory", "Suppliers"],
    contextUsedBn: ["পণ্য", "মজুদ", "সরবরাহকারী"],
    status: "ready",
  },
  {
    id: "report-customer-churn",
    title: "Why are customers leaving?",
    titleBn: "গ্রাহকরা কেন চলে যাচ্ছে?",
    question: "Why are customers leaving?",
    generatedAt: "Yesterday",
    generatedAtBn: "গতকাল",
    generatedBy: ["customer-success", "sales-analyst", "marketing-agent"],
    confidence: 84,
    summary: "Customer churn increased 12% this quarter. Primary factors are delayed shipping and reduced product availability.",
    summaryBn:
      "এই কোয়ার্টারে গ্রাহক ধারে যাওয়া ১২% বেড়েছে। প্রধান কারণগুলো হলো বিলম্বিত শিপিং এবং পণ্যের প্রাপ্যতা হ্রাস।",
    findings: [
      {
        id: "f1",
        title: "Shipping delays",
        titleBn: "শিপিং বিলম্ব",
        change: "+3.2 days",
        changeType: "negative",
        detail: "Average delivery time increased significantly",
        detailBn: "গড় ডেলিভারি সময় উল্লেখযোগ্যভাবে বেড়েছে",
      },
      {
        id: "f2",
        title: "Product availability",
        titleBn: "পণ্যের প্রাপ্যতা",
        change: "↓ 15%",
        changeType: "negative",
        detail: "Popular items frequently out of stock",
        detailBn: "জনপ্রিয় পণ্য প্রায়ই স্টকের বাইরে",
      },
      {
        id: "f3",
        title: "Support response",
        titleBn: "সাপোর্ট প্রতিক্রিয়া",
        change: "↓ 8%",
        changeType: "negative",
        detail: "Customer satisfaction with support declining",
        detailBn: "সাপোর্টে গ্রাহক সন্তুষ্টি হ্রাস পাচ্ছে",
      },
    ],
    findingsBn: [
      { id: "f1", titleBn: "শিপিং বিলম্ব", detailBn: "গড় ডেলিভারি সময় উল্লেখযোগ্যভাবে বেড়েছে" },
      { id: "f2", titleBn: "পণ্যের প্রাপ্যতা", detailBn: "জনপ্রিয় পণ্য প্রায়ই স্টকের বাইরে" },
      { id: "f3", titleBn: "সাপোর্ট প্রতিক্রিয়া", detailBn: "সাপোর্টে গ্রাহক সন্তুষ্টি হ্রাস পাচ্ছে" },
    ],
    evidence: [
      {
        id: "ev1",
        name: "Customer Feedback",
        nameBn: "গ্রাহক প্রতিক্রিয়া",
        type: "customer",
        recordCount: 847,
        relevantFinding: "67% cite shipping as concern",
        relevantFindingBn: "৬৭% শিপিংকে উদ্বেগ হিসেবে উল্লেখ করেছে",
      },
      {
        id: "ev2",
        name: "Churn Analysis",
        nameBn: "ধারে যাওয়া বিশ্লেষণ",
        type: "internal",
        recordCount: 312,
        relevantFinding: "Churn correlated with order delays",
        relevantFindingBn: "অর্ডার বিলম্বের সাথে ধারে যাওয়া সম্পর্কিত",
      },
    ],
    evidenceBn: [
      { id: "ev1", nameBn: "গ্রাহক প্রতিক্রিয়া", relevantFindingBn: "৬৭% শিপিংকে উদ্বেগ হিসেবে উল্লেখ করেছে" },
      { id: "ev2", nameBn: "ধারে যাওয়া বিশ্লেষণ", relevantFindingBn: "অর্ডার বিলম্বের সাথে ধারে যাওয়া সম্পর্কিত" },
    ],
    recommendation: {
      text: "Review logistics partnerships and implement proactive shipping notifications. Consider offering expedited shipping options.",
      risk: "medium",
      actionRequired: false,
    },
    recommendationBn:
      "লজিস্টিক অংশীদারিত্ব পর্যালোচনা করুন এবং সক্রিয় শিপিং বিজ্ঞপ্তি বাস্তবায়ন করুন। দ্রুত শিপিং বিকল্প প্রদানের কথা বিবেচনা করুন।",
    contextUsed: ["Customers", "Orders", "Support Tickets"],
    contextUsedBn: ["গ্রাহক", "অর্ডার", "সাপোর্ট টিকিট"],
    status: "ready",
  },
  {
    id: "report-daily-priorities",
    title: "What should I focus on today?",
    titleBn: "আজ আমার কোন বিষয়ে মনোযোগ দেওয়া উচিত?",
    question: "What should I focus on today?",
    generatedAt: "Today, 8:00 AM",
    generatedAtBn: "আজ, সকাল ৮:০০",
    generatedBy: ["sales-analyst", "inventory-agent", "customer-success", "finance-agent"],
    confidence: 95,
    summary: "3 priority items require your attention today. Revenue is on track, but inventory and customer issues need immediate action.",
    summaryBn:
      "আজ ৩টি অগ্রাধিকার বিষয় আপনার মনোযোগ প্রয়োজন। রাজস্ব ঠিক ঠাক আছে, তবে মজুদ ও গ্রাহক সমস্যার জন্য তাৎক্ষণিক পদক্ষেপ দরকার।",
    findings: [
      {
        id: "f1",
        title: "Pending approval",
        titleBn: "বিচারাধীন অনুমোদন",
        change: "1 action",
        changeType: "neutral",
        detail: "Restock recommendation awaiting decision",
        detailBn: "পুনঃস্টক সুপারিশ সিদ্ধান্তের অপেক্ষায়",
      },
      {
        id: "f2",
        title: "Revenue today",
        titleBn: "আজকের রাজস্ব",
        change: "+8%",
        changeType: "positive",
        detail: "$47,293 — above daily target",
        detailBn: "$৪৭,২৯৩ — দৈনিক লক্ষ্যমাত্রার উপরে",
      },
      {
        id: "f3",
        title: "Open issues",
        titleBn: "ওপেন ইস্যু",
        change: "23 tickets",
        changeType: "neutral",
        detail: "Support queue within normal range",
        detailBn: "সাপোর্ট সারি স্বাভাবিক পরিসরে",
      },
    ],
    findingsBn: [
      { id: "f1", titleBn: "বিচারাধীন অনুমোদন", detailBn: "পুনঃস্টক সুপারিশ সিদ্ধান্তের অপেক্ষায়" },
      { id: "f2", titleBn: "আজকের রাজস্ব", detailBn: "$৪৭,২৯৩ — দৈনিক লক্ষ্যমাত্রার উপরে" },
      { id: "f3", titleBn: "ওপেন ইস্যু", detailBn: "সাপোর্ট সারি স্বাভাবিক পরিসরে" },
    ],
    evidence: [
      {
        id: "ev1",
        name: "Today's Metrics",
        nameBn: "আজকের মেট্রিক্স",
        type: "internal",
        recordCount: 1,
        relevantFinding: "All systems operational",
        relevantFindingBn: "সব সিস্টেম চালু আছে",
      },
    ],
    evidenceBn: [
      { id: "ev1", nameBn: "আজকের মেট্রিক্স", relevantFindingBn: "সব সিস্টেম চালু আছে" },
    ],
    recommendation: {
      text: "Review the pending restock approval first, then check the inventory risk report for proactive planning.",
      risk: "low",
      actionRequired: false,
    },
    recommendationBn:
      "প্রথমে বিচারাধীন পুনঃস্টক অনুমোদন পর্যালোচনা করুন, তারপর সক্রিয় পরিকল্পনার জন্য মজুদ ঝুঁকি প্রতিবেদন দেখুন।",
    contextUsed: ["All business context"],
    contextUsedBn: ["সম্পূর্ণ ব্যবসায়িক প্রসঙ্গ"],
    status: "ready",
  },
] as unknown as MockReport[];

export function getReportById(id: string): MockReport | undefined {
  return mockReports.find((r) => r.id === id);
}

export function getReportByQuestion(questionId: string): Report | undefined {
  const questionToReportMap: Record<string, string> = {
    "sales-1": "report-sales-drop",
    "inventory-1": "report-inventory-risk",
    "customer-1": "report-customer-churn",
    "overview-1": "report-daily-priorities",
  };
  return mockReports.find((r) => r.id === questionToReportMap[questionId]);
}
