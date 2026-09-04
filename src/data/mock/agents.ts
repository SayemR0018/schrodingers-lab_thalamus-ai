import type { Agent } from "./types";

export interface MockAgent extends Agent {
  nameBn: string;
  descriptionBn: string;
}

export const mockAgents: MockAgent[] = [
  {
    id: "sales-analyst",
    name: "Sales Analyst",
    nameBn: "বিক্রয় বিশ্লেষক",
    status: "active",
    description: "Analyzes sales data and identifies growth opportunities.",
    descriptionBn: "বিক্রয় ডেটা বিশ্লেষণ করে এবং প্রবৃদ্ধির সুযোগ চিহ্নিত করে।",
    colorKey: "agent-sales",
    metrics: {
      insightsGenerated: 8,
      anomaliesDetected: 3,
      reportsCreated: 5,
    },
    capabilities: [
      "Revenue analysis",
      "Pipeline forecasting",
      "Deal scoring",
      "Trend detection",
    ],
  },
  {
    id: "marketing-agent",
    name: "Marketing Agent",
    nameBn: "মার্কেটিং এজেন্ট",
    status: "active",
    description: "Monitors campaigns and optimizes marketing performance.",
    descriptionBn: "ক্যাম্পেইন পর্যবেক্ষণ করে এবং মার্কেটিং পারফরম্যান্স উন্নত করে।",
    colorKey: "agent-marketing",
    metrics: {
      campaignsAnalyzed: 12,
      leadsScored: 847,
      alertsTriggered: 2,
    },
    capabilities: [
      "Campaign analysis",
      "Lead scoring",
      "Channel attribution",
      "Content performance",
    ],
  },
  {
    id: "inventory-agent",
    name: "Inventory Agent",
    nameBn: "মজুদ এজেন্ট",
    status: "active",
    description: "Tracks stock levels and predicts inventory needs.",
    descriptionBn: "মজুদের স্তর ট্র্যাক করে এবং মজুদের প্রয়োজনীয়তা পূর্বাভাস দেয়।",
    colorKey: "agent-inventory",
    metrics: {
      stockAlerts: 4,
      reorderSuggestions: 7,
      anomaliesDetected: 1,
    },
    capabilities: [
      "Stock monitoring",
      "Demand forecasting",
      "Reorder optimization",
      "Supplier analysis",
    ],
  },
  {
    id: "customer-success",
    name: "Customer Success",
    nameBn: "গ্রাহক সাফল্য",
    status: "active",
    description: "Ensures customer satisfaction and reduces churn risk.",
    descriptionBn: "গ্রাহক সন্তুষ্টি নিশ্চিত করে এবং ধারে যাওয়ার ঝুঁকি হ্রাস করে।",
    colorKey: "agent-customer",
    metrics: {
      ticketsResolved: 156,
      satisfactionScore: 94,
      alertsTriggered: 3,
    },
    capabilities: [
      "Churn prediction",
      "Sentiment analysis",
      "Support optimization",
      "NPS tracking",
    ],
  },
  {
    id: "finance-agent",
    name: "Finance Agent",
    nameBn: "অর্থ এজেন্ট",
    status: "active",
    description: "Monitors financial health and generates forecasts.",
    descriptionBn: "আর্থিক স্বাস্থ্য পর্যবেক্ষণ করে এবং পূর্বাভাস তৈরি করে।",
    colorKey: "agent-finance",
    metrics: {
      forecastsGenerated: 4,
      budgetAlerts: 2,
      reportsCreated: 8,
    },
    capabilities: [
      "Cash flow analysis",
      "Budget tracking",
      "Revenue forecasting",
      "Expense monitoring",
    ],
  },
  {
    id: "policy-docs-agent",
    name: "Policy & Docs Agent",
    nameBn: "নীতি ও নথি এজেন্ট",
    status: "active",
    description: "Audits supplier agreements, return terms, and policy compliance.",
    descriptionBn: "সরবরাহকারী চুক্তি, ফেরত শর্ত এবং নীতি পরিপালন নিরীক্ষা করে।",
    colorKey: "agent-policy",
    metrics: {
      insightsGenerated: 5,
      alertsTriggered: 2,
      reportsCreated: 3,
    },
    capabilities: [
      "Supplier SLA audits",
      "Return policy review",
      "Compliance checks",
      "Contract term tracking",
    ],
  },
  {
    id: "automation-agent",
    name: "Automation Agent",
    nameBn: "অটোমেশন এজেন্ট",
    status: "locked",
    description: "Executes automated workflows across business systems.",
    descriptionBn: "ব্যবসায়িক সিস্টেম জুড়ে স্বয়ংক্রিয় কর্মপ্রবাহ সম্পাদন করে।",
    colorKey: "agent-automation",
    metrics: {},
    capabilities: [
      "Workflow automation",
      "System integration",
      "Task scheduling",
      "Process optimization",
    ],
  },
];
