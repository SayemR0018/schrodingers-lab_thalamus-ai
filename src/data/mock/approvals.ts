import type { Approval } from "./types";

export interface MockApproval extends Approval {
  titleBn: string;
  descriptionBn: string;
  reasonBn: string;
  agentNameBn: string;
}

export const mockApprovals: MockApproval[] = [
  {
    id: "approval-restock",
    title: "Restock Classic Shirt",
    titleBn: "ক্লাসিক শার্ট পুনঃস্টক",
    description: "Restock 120 units of Classic Shirt to prevent stockout",
    descriptionBn: "স্টকআউট প্রতিরোধে ক্লাসিক শার্টের ১২০ ইউনিট পুনঃস্টক",
    agentId: "inventory-agent",
    agentName: "Inventory Agent",
    agentNameBn: "মজুদ এজেন্ট",
    risk: "low",
    reason: "Current inventory critically low. Stockout probability 84% within 2 days based on sales velocity.",
    reasonBn:
      "বর্তমান মজুদ গুরুতরভাবে কম। বিক্রয় গতির ভিত্তিতে ২ দিনের মধ্যে স্টকআউটের সম্ভাবনা ৮৪%।",
    details: {
      "Current inventory": "18 units",
      "Average daily sales": "24 units",
      "Supplier lead time": "5 days",
      "Recommended quantity": "120 units",
      "Estimated cost": "$2,400",
    },
    evidence: [
      {
        id: "ev1",
        name: "Inventory Levels",
        nameBn: "মজুদের স্তর",
        type: "inventory",
        recordCount: 1,
        relevantFinding: "Classic Shirt at 18 units",
        relevantFindingBn: "ক্লাসিক শার্ট ১৮ ইউনিটে",
      },
      {
        id: "ev2",
        name: "Sales History",
        nameBn: "বিক্রয় ইতিহাস",
        type: "shopify",
        recordCount: 847,
        relevantFinding: "24 units/day average",
        relevantFindingBn: "গড়ে দৈনিক ২৪ ইউনিট",
      },
    ],
    status: "pending",
    createdAt: "Today, 10:31 AM",
    createdAtBn: "আজ, সকাল ১০:৩১",
  },
  {
    id: "approval-campaign",
    title: "Launch promotional campaign",
    titleBn: "প্রচার ক্যাম্পেইন শুরু",
    description: "Launch 15% discount campaign for Dhaka region",
    descriptionBn: "ঢাকা অঞ্চলের জন্য ১৫% ছাড় ক্যাম্পেইন শুরু",
    agentId: "marketing-agent",
    agentName: "Marketing Agent",
    agentNameBn: "মার্কেটিং এজেন্ট",
    risk: "medium",
    reason: "Discount exceeds standard business policy limit of 10%. Requires human approval.",
    reasonBn:
      "ছাড় প্রমিত ব্যবসায়িক নীতির সীমা ১০% ছাড়িয়ে গেছে। মানব অনুমোদন প্রয়োজন।",
    details: {
      "Discount amount": "15%",
      "Target region": "Dhaka",
      "Duration": "7 days",
      "Estimated reach": "12,000 customers",
      "Projected revenue impact": "+$8,500",
      "Policy limit": "10%",
    },
    evidence: [
      {
        id: "ev1",
        name: "Regional Performance",
        nameBn: "আঞ্চলিক পারফরম্যান্স",
        type: "shopify",
        recordCount: 3421,
        relevantFinding: "Dhaka sales -13.2%",
        relevantFindingBn: "ঢাকা বিক্রয় -১৩.২%",
      },
      {
        id: "ev2",
        name: "Campaign History",
        nameBn: "ক্যাম্পেইন ইতিহাস",
        type: "internal",
        recordCount: 24,
        relevantFinding: "Similar campaigns achieved 2.8x ROI",
        relevantFindingBn: "অনুরূপ ক্যাম্পেইন ২.৮x ROI অর্জন করেছে",
      },
    ],
    status: "pending",
    createdAt: "Today, 9:45 AM",
    createdAtBn: "আজ, সকাল ৯:৪৫",
  },
];

let approvalState: MockApproval[] = [...mockApprovals];

export function getApprovals(): MockApproval[] {
  return approvalState;
}

export function getPendingApprovals(): MockApproval[] {
  return approvalState.filter((a) => a.status === "pending");
}

export function getApprovalById(id: string): MockApproval | undefined {
  return approvalState.find((a) => a.id === id);
}

export function approveAction(id: string, decidedBy: string): void {
  approvalState = approvalState.map((a) =>
    a.id === id
      ? { ...a, status: "approved" as const, decidedAt: "Just now", decidedBy }
      : a
  );
}

export function rejectAction(id: string, decidedBy: string): void {
  approvalState = approvalState.map((a) =>
    a.id === id
      ? { ...a, status: "rejected" as const, decidedAt: "Just now", decidedBy }
      : a
  );
}

export function resetApprovals(): void {
  approvalState = [...mockApprovals];
}
