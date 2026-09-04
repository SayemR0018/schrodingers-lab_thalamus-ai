import { makeRng, bn } from "./seed";
import type { HealthSnapshot } from "./analytics";
import type { InventoryRecord } from "./inventory";
import type { Product } from "./products";
import type { Customer } from "./customers";
import type { Order } from "./orders";

export type Stage =
  | "suggested"
  | "pending_approval"
  | "executing"
  | "done"
  | "logged"
  | "rejected";

export type RiskTier = "low" | "medium" | "high";

export interface Insight {
  id: string;
  agentId: string;
  title: string;
  titleBn: string;
  body: string;
  bodyBn: string;
  stage: Stage;
  pinned: boolean;
  confidence: number;
  riskTier: RiskTier;
  category: "sales" | "inventory" | "customer" | "finance" | "marketing" | "automation";
  metric?: string;
  evidence: string[];
  createdAt: string;
  updatedAt: string;
}

function nowIso(offsetMs = 0): string {
  return new Date(Date.now() - offsetMs).toISOString();
}

export function buildInsights(
  health: HealthSnapshot,
  inventory: readonly InventoryRecord[],
  products: readonly Product[],
  customers: readonly Customer[],
  orders: readonly Order[]
): Insight[] {
  void products;
  void customers;
  void orders;
  const rng = makeRng(0x1aced005);

  const dhakaPct = (health.dhakaDip.pct * 100).toFixed(1);
  const atRisk = health.inventoryAtRisk;
  const churnPct = (health.churnRisePct * 100).toFixed(1);
  const low = atRisk > 0 ? inventory.find((i) => i.atRisk)?.sku ?? "—" : "—";

  return [
    {
      id: "ins-1",
      agentId: "sales-analyst",
      title: "Dhaka region revenue decline",
      titleBn: "ঢাকা অঞ্চলের রাজস্ব হ্রাস",
      body: `Dhaka revenue down ${dhakaPct}% vs prior 30 days — single largest regional risk.`,
      bodyBn: `ঢাকার রাজস্ব গত ৩০ দিনের তুলনায় ${bn(dhakaPct)}% কমেছে — সবচেয়ে বড় আঞ্চলিক ঝুঁকি।`,
      stage: "suggested",
      pinned: true,
      confidence: 89,
      riskTier: "high",
      category: "sales",
      metric: `${dhakaPct}%`,
      evidence: ["orders:30d:region:Dhaka"],
      createdAt: nowIso(1000 * 60 * 12),
      updatedAt: nowIso(1000 * 60 * 12),
    },
    {
      id: "ins-2",
      agentId: "inventory-agent",
      title: "Critical stockout risk on high-velocity items",
      titleBn: "উচ্চ-চাহিদার পণ্যে স্টকআউটের ঝুঁকি",
      body: `${atRisk} SKUs will stockout within 14 days. Replenish top offenders (${low} and others).`,
      bodyBn: `${bn(String(atRisk))}টি SKU আগামী ১৪ দিনে স্টকআউট হবে। শীর্ষ ঝুঁকিপূর্ণ পণ্য পুনরায় মজুদ করুন (${bn(low)} সহ)।`,
      stage: "pending_approval",
      pinned: true,
      confidence: 92,
      riskTier: "medium",
      category: "inventory",
      metric: `${atRisk} SKUs`,
      evidence: ["inventory:atRisk"],
      createdAt: nowIso(1000 * 60 * 30),
      updatedAt: nowIso(1000 * 60 * 30),
    },
    {
      id: "ins-3",
      agentId: "customer-success",
      title: "Rising churn risk in inactive cohort",
      titleBn: "নিষ্ক্রিয় গ্রাহকদের মধ্যে বাড়তি চার্ন ঝুঁকি",
      body: `Churn-risk customers up ${churnPct}% over the last 90 days. Re-engagement recommended.`,
      bodyBn: `গত ৯০ দিনে চার্ন-ঝুঁকিপূর্ণ গ্রাহক ${bn(churnPct)}% বেড়েছে। পুনঃসংযুক্তি প্রচারণা চালানোর সুপারিশ।`,
      stage: "suggested",
      pinned: false,
      confidence: 84,
      riskTier: "medium",
      category: "customer",
      metric: `${churnPct}%`,
      evidence: ["customers:churnRisk>=0.7"],
      createdAt: nowIso(1000 * 60 * 90),
      updatedAt: nowIso(1000 * 60 * 90),
    },
    {
      id: "ins-4",
      agentId: "marketing-agent",
      title: "Targeted weekend basket promotions",
      titleBn: "উইকেন্ড বাস্কেট প্রমোশন চালু করুন",
      body: `Weekend basket conversion is 2.4x the weekday average. Launch 12% bundle promotion.`,
      bodyBn: `উইকেন্ডে বাস্কেট রূপান্তর সাপ্তাহিক গড়ের ২.৪ গুণ। ১২% বান্ডেল প্রমোশন চালু করুন।`,
      stage: "pending_approval",
      pinned: false,
      confidence: 88,
      riskTier: "low",
      category: "marketing",
      metric: "2.4x",
      evidence: ["orders:weekend"],
      createdAt: nowIso(1000 * 60 * 60 * 4),
      updatedAt: nowIso(1000 * 60 * 60 * 4),
    },
    {
      id: "ins-5",
      agentId: "finance-agent",
      title: "Supplier renegotiation & margin recovery",
      titleBn: "সরবরাহকারী পুনর্বিধান ও মার্জিন উদ্ধার",
      body: `Two suppliers (sup-3, sup-7) are above market on Apparel cost. Renegotiate to recover ~3.2% margin.`,
      bodyBn: `দুটি সরবরাহকারী (sup-3, sup-7) অ্যাপারেল খরচে বাজারের চেয়ে বেশি। পুনর্বিধানে প্রায় ৩.২% মার্জিন পুনরুদ্ধার সম্ভব।`,
      stage: "pending_approval",
      pinned: false,
      confidence: 80,
      riskTier: "medium",
      category: "finance",
      metric: "+3.2%",
      evidence: ["suppliers:cost-anomaly"],
      createdAt: nowIso(1000 * 60 * 60 * 7),
      updatedAt: nowIso(1000 * 60 * 60 * 7),
    },
    {
      id: "ins-6",
      agentId: "automation-agent",
      title: "Daily multi-channel catalog sync complete",
      titleBn: "দৈনিক মাল্টি-চ্যানেল ক্যাটালগ সিঙ্ক সম্পন্ন",
      body: `Catalog pushed to Shopify, WooCommerce and POS. 0 discrepancies detected.`,
      bodyBn: `ক্যাটালগ Shopify, WooCommerce ও POS-এ পাঠানো হয়েছে। কোনো অসঙ্গতি পাওয়া যায়নি।`,
      stage: "done",
      pinned: false,
      confidence: 100,
      riskTier: "low",
      category: "automation",
      evidence: ["integrations:status"],
      createdAt: nowIso(1000 * 60 * 60 * 24),
      updatedAt: nowIso(1000 * 60 * 60 * 22),
    },
  ];
}
