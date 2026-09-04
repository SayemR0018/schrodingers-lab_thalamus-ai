import type { Insight } from "./types";

export interface MockInsight extends Insight {
  titleBn: string;
  summaryBn: string;
  recommendationBn?: string;
}

export const mockInsights: MockInsight[] = [
  {
    id: "insight-sales-anomaly",
    title: "Sales anomaly detected",
    titleBn: "বিক্রয় অস্বাভাবিকতা শনাক্ত",
    summary: "Sales in Dhaka region are down 13.2% compared to the same period last month. This exceeds the normal variance threshold.",
    summaryBn:
      "গত মাসের একই সময়ের তুলনায় ঢাকা অঞ্চলে বিক্রয় ১৩.২% কমেছে। এটি স্বাভাবিক বিচ্যুতির সীমা ছাড়িয়ে গেছে।",
    severity: "medium",
    category: "sales",
    detectedAt: "2 hours ago",
    detectedAtBn: "২ ঘণ্টা আগে",
    affectedEntities: ["Dhaka Region", "Classic Shirt", "Casual Collection"],
    affectedEntitiesBn: ["ঢাকা অঞ্চল", "ক্লাসিক শার্ট", "ক্যাজুয়াল কালেকশন"],
    evidence: [
      {
        id: "ev1",
        name: "Regional Sales Data",
        nameBn: "আঞ্চলিক বিক্রয় ডেটা",
        type: "shopify",
        recordCount: 3421,
        relevantFinding: "Dhaka underperforming vs other regions",
        relevantFindingBn: "অন্যান্য অঞ্চলের তুলনায় ঢাকা পিছিয়ে",
      },
    ],
    relatedAgents: ["sales-analyst"],
    confidence: 89,
    recommendation: "Investigate regional marketing effectiveness and local competition.",
    recommendationBn: "আঞ্চলিক মার্কেটিং কার্যকারিতা ও স্থানীয় প্রতিযোগিতা তদন্ত করুন।",
    status: "new",
  },
  {
    id: "insight-inventory-risk",
    title: "Classic Shirt stockout risk",
    titleBn: "ক্লাসিক শার্ট স্টকআউট ঝুঁকি",
    summary: "Classic Shirt may stock out within 2 days based on current sales velocity and inventory levels.",
    summaryBn:
      "বর্তমান বিক্রয় গতি ও মজুদের স্তরের ভিত্তিতে ২ দিনের মধ্যে ক্লাসিক শার্ট স্টকআউট হতে পারে।",
    severity: "high",
    category: "inventory",
    detectedAt: "1 hour ago",
    detectedAtBn: "১ ঘণ্টা আগে",
    affectedEntities: ["Classic Shirt", "Inventory", "Sales"],
    affectedEntitiesBn: ["ক্লাসিক শার্ট", "মজুদ", "বিক্রয়"],
    evidence: [
      {
        id: "ev1",
        name: "Inventory Levels",
        nameBn: "মজুদের স্তর",
        type: "inventory",
        recordCount: 1,
        relevantFinding: "Current stock: 18 units",
        relevantFindingBn: "বর্তমান স্টক: ১৮ ইউনিট",
      },
      {
        id: "ev2",
        name: "Sales Velocity",
        nameBn: "বিক্রয় গতি",
        type: "shopify",
        recordCount: 847,
        relevantFinding: "Average daily sales: 24 units",
        relevantFindingBn: "গড় দৈনিক বিক্রয়: ২৪ ইউনিট",
      },
    ],
    relatedAgents: ["inventory-agent"],
    confidence: 94,
    recommendation: "Restock 120 units immediately.",
    recommendationBn: "এখনই ১২০ ইউনিট পুনঃস্টক করুন।",
    actionId: "approval-restock",
    status: "new",
  },
  {
    id: "insight-customer-behavior",
    title: "Repeat customer decline",
    titleBn: "পুনরায় গ্রাহক হ্রাস",
    summary: "Repeat customers have reduced purchase frequency by 7.8% this month. Early indicator of potential churn.",
    summaryBn:
      "পুনরায় গ্রাহকদের ক্রয়ের হার এই মাসে ৭.৮% কমেছে। সম্ভাব্য ধারে যাওয়ার প্রাথমিক সংকেত।",
    severity: "medium",
    category: "customer",
    detectedAt: "4 hours ago",
    detectedAtBn: "৪ ঘণ্টা আগে",
    affectedEntities: ["Repeat Customers", "Urban Segment"],
    affectedEntitiesBn: ["পুনরায় গ্রাহক", "শহুরে সেগমেন্ট"],
    evidence: [
      {
        id: "ev1",
        name: "Customer Behavior",
        nameBn: "গ্রাহক আচরণ",
        type: "customer",
        recordCount: 2104,
        relevantFinding: "Purchase frequency declining",
        relevantFindingBn: "ক্রয়ের হার হ্রাস পাচ্ছে",
      },
    ],
    relatedAgents: ["customer-success"],
    confidence: 82,
    recommendation: "Launch re-engagement campaign for at-risk customers.",
    recommendationBn: "ঝুঁকিপূর্ণ গ্রাহকদের জন্য পুনঃসংযুক্তি ক্যাম্পেইন শুরু করুন।",
    status: "new",
  },
  {
    id: "insight-marketing-roi",
    title: "Email campaign outperforming",
    titleBn: "ইমেইল ক্যাম্পেইন ভালো করছে",
    summary: "Current email campaign achieving 3.2x ROI, significantly above the 2.5x target.",
    summaryBn:
      "বর্তমান ইমেইল ক্যাম্পেইন ৩.২x ROI অর্জন করছে, যা ২.৫x লক্ষ্যমাত্রার চেয়ে উল্লেখযোগ্যভাবে বেশি।",
    severity: "low",
    category: "marketing",
    detectedAt: "Yesterday",
    detectedAtBn: "গতকাল",
    affectedEntities: ["Email Campaign Q2", "Marketing Budget"],
    affectedEntitiesBn: ["ইমেইল ক্যাম্পেইন Q2", "মার্কেটিং বাজেট"],
    evidence: [
      {
        id: "ev1",
        name: "Campaign Analytics",
        nameBn: "ক্যাম্পেইন বিশ্লেষণ",
        type: "internal",
        recordCount: 12847,
        relevantFinding: "Open rate 24.7%, conversion 4.8%",
        relevantFindingBn: "ওপেন রেট ২৪.৭%, রূপান্তর ৪.৮%",
      },
    ],
    relatedAgents: ["marketing-agent"],
    confidence: 96,
    recommendation: "Consider increasing email campaign budget allocation.",
    recommendationBn: "ইমেইল ক্যাম্পেইনের বাজেট বরাদ্দ বাড়ানোর কথা বিবেচনা করুন।",
    status: "acknowledged",
  },
  {
    id: "insight-finance-budget",
    title: "Marketing spend approaching limit",
    titleBn: "মার্কেটিং ব্যয় সীমার কাছে",
    summary: "Marketing budget utilization at 87% with 2 weeks remaining in the period.",
    summaryBn:
      "মার্কেটিং বাজেটের ব্যয়হার ৮৭%, সময়কালে আরও ২ সপ্তাহ বাকি।",
    severity: "medium",
    category: "finance",
    detectedAt: "Yesterday",
    detectedAtBn: "গতকাল",
    affectedEntities: ["Marketing Budget", "Q2 Financials"],
    affectedEntitiesBn: ["মার্কেটিং বাজেট", "Q2 আর্থিক"],
    evidence: [
      {
        id: "ev1",
        name: "Budget Tracking",
        nameBn: "বাজেট ট্র্যাকিং",
        type: "internal",
        recordCount: 1,
        relevantFinding: "87% utilized, 13% remaining",
        relevantFindingBn: "৮৭% ব্যবহৃত, ১৩% অবশিষ্ট",
      },
    ],
    relatedAgents: ["finance-agent"],
    confidence: 100,
    recommendation: "Review remaining campaigns and prioritize high-ROI activities.",
    recommendationBn: "অবশিষ্ট ক্যাম্পেইনগুলো পর্যালোচনা করুন এবং উচ্চ-ROI কার্যক্রমকে অগ্রাধিকার দিন।",
    status: "acknowledged",
  },
];

export function getInsightById(id: string): MockInsight | undefined {
  return mockInsights.find((i) => i.id === id);
}

export function getInsightsByCategory(category: string): MockInsight[] {
  if (category === "all") return mockInsights;
  return mockInsights.filter((i) => i.category === category);
}

export function getInsightsNeedingAttention(): MockInsight[] {
  return mockInsights.filter((i) => i.status === "new" && i.severity !== "low");
}
