/**
 * Demo dataset summary: aggregated metrics the LLM can reason about.
 * We DO NOT send raw rows (386 products × 4 fields ≈ a few thousand
 * tokens); we send compact aggregates only.
 */
import { dataset } from "@/services/dataset";
import { policies } from "@/data/demo/policies";
import type { HealthSnapshot } from "@/data/demo/analytics";

export interface DemoSummarySlice {
  health: HealthSnapshot;
  inventoryAtRisk: Array<{
    sku: string;
    productName: string;
    currentStock: number;
    daysUntilStockout: number;
    recentDailyDemand: number;
  }>;
  topProducts: Array<{
    sku: string;
    name: string;
    category: string;
    priceBdt: number;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    region: string;
    ltvBdt: number;
    churnRisk: number;
  }>;
  churnRiskCustomers: Array<{
    id: string;
    name: string;
    region: string;
    churnRisk: number;
    lastOrderDaysAgo: number;
  }>;
  recentOrdersSummary: {
    totalOrders30d: number;
    revenue30dBdt: number;
    revenuePrev30dBdt: number;
    revenueTrendPct: number;
    dhakaDipPct: number;
    topCategories: Array<{ category: string; revenueBdt: number; orders: number }>;
  };
  suppliers: Array<{
    id: string;
    name: string;
    region: string;
    leadTimeDays: number;
    onTimeRate: number;
  }>;
  policies: Array<{ id: string; title: string; category: string; body: string }>;
}

export function buildDemoSummary(): DemoSummarySlice {
  const h = dataset.health;

  const inventoryAtRisk = dataset.inventory
    .filter((i) => i.atRisk || i.daysUntilStockout < 14)
    .slice(0, 20)
    .map((i) => ({
      sku: i.sku,
      productName: i.productName,
      currentStock: i.currentStock,
      daysUntilStockout: i.daysUntilStockout,
      recentDailyDemand: Number(i.recentDailyDemand.toFixed(2)),
    }));

  const topProducts = dataset.products.slice(0, 10).map((p) => ({
    sku: p.sku,
    name: p.name,
    category: p.category,
    priceBdt: p.priceBdt,
  }));

  const topCustomers = [...dataset.customers]
    .sort((a, b) => b.ltvBdt - a.ltvBdt)
    .slice(0, 10)
    .map((c) => ({
      id: c.id,
      name: c.name,
      region: c.region,
      ltvBdt: c.ltvBdt,
      churnRisk: Number(c.churnRisk.toFixed(2)),
    }));

  const churnRiskCustomers = dataset.customers
    .filter((c) => c.churnRisk >= 0.6)
    .sort((a, b) => b.churnRisk - a.churnRisk)
    .slice(0, 10)
    .map((c) => ({
      id: c.id,
      name: c.name,
      region: c.region,
      churnRisk: Number(c.churnRisk.toFixed(2)),
      lastOrderDaysAgo: c.lastOrderDays,
    }));

  const revenueTrendPct =
    h.revenuePrev30 > 0
      ? Number(
          (((h.revenue30 - h.revenuePrev30) / h.revenuePrev30) * 100).toFixed(1)
        )
      : 0;

  const recentOrdersSummary = {
    totalOrders30d: dataset.orders.filter((o) => o.daysAgo <= 30).length,
    revenue30dBdt: h.revenue30,
    revenuePrev30dBdt: h.revenuePrev30,
    revenueTrendPct,
    dhakaDipPct: Number((h.dhakaDip.pct * 100).toFixed(1)),
    topCategories: h.topCategories.slice(0, 5),
  };

  const suppliers = dataset.suppliers.map((s) => ({
    id: s.id,
    name: s.name,
    region: s.region,
    leadTimeDays: s.leadTimeDays,
    onTimeRate: Number((s.onTimeRate * 100).toFixed(1)),
  }));

  const pol = policies.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    body: p.body,
  }));

  return {
    health: h,
    inventoryAtRisk,
    topProducts,
    topCustomers,
    churnRiskCustomers,
    recentOrdersSummary,
    suppliers,
    policies: pol,
  };
}
