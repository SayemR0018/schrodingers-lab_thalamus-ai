import type { Order, OrdersByDay } from "./orders";
import type { Customer, Region } from "./customers";
import type { InventoryRecord } from "./inventory";

export interface HealthSnapshot {
  revenue30: number;
  revenuePrev30: number;
  revenueTrend: number[];
  activeCustomers: number;
  activeCustomersPrev: number;
  byRegion30: Array<{ region: Region; revenueBdt: number; orders: number }>;
  dhakaDip: { region: "Dhaka"; pct: number };
  inventoryAtRisk: number;
  inventoryAtRiskPrev: number;
  churnRisePct: number;
  churnRiskCount: number;
  topCategories: Array<{ category: string; revenueBdt: number; orders: number }>;
}

export function computeHealth(
  orders: readonly Order[],
  byDay: readonly OrdersByDay[],
  customers: readonly Customer[],
  inventory: readonly InventoryRecord[]
): HealthSnapshot {
  // Last 30-day window is daysAgo in [0..30]; prev30 is (30..60].
  // byDay is sorted ascending by daysAgo, so byDay[0] is today and last is 360.
  // Last 30 (inclusive of today, i.e., daysAgo <= 30).
  const last30 = byDay.filter((d) => d.daysAgo <= 30);
  const prev30 = byDay.filter((d) => d.daysAgo > 30 && d.daysAgo <= 60);

  const revenue30 = last30.reduce((s, d) => s + d.revenueBdt, 0);
  const revenuePrev30 = prev30.reduce((s, d) => s + d.revenueBdt, 0);

  // revenueTrend is the last 30 daily points (daysAgo 0..29).
  const trendByDay = byDay.filter((d) => d.daysAgo >= 0 && d.daysAgo < 30);
  trendByDay.sort((a, b) => a.daysAgo - b.daysAgo);
  const revenueTrend = trendByDay.map((d) => d.revenueBdt);

  // Active customers: unique customer IDs in each window.
  const last30Cust = new Set<string>();
  const prev30Cust = new Set<string>();
  for (const o of orders) {
    if (o.daysAgo <= 30) last30Cust.add(o.customerId);
    else if (o.daysAgo <= 60) prev30Cust.add(o.customerId);
  }

  // byRegion30 — rollup of last-30 revenue & orders by region, sorted desc.
  const regionAgg: Record<string, { revenueBdt: number; orders: number }> = {};
  for (const d of last30) {
    for (const [region, agg] of Object.entries(d.byRegion)) {
      if (!regionAgg[region]) regionAgg[region] = { revenueBdt: 0, orders: 0 };
      regionAgg[region].revenueBdt += agg.revenueBdt;
      regionAgg[region].orders += agg.orders;
    }
  }
  const byRegion30 = Object.entries(regionAgg)
    .map(([region, agg]) => ({ region: region as Region, ...agg }))
    .sort((a, b) => b.revenueBdt - a.revenueBdt);

  // Dhaka dip: (dhaka30 - dhakaPrev) / dhakaPrev.
  const dhaka30 = regionAgg.Dhaka?.revenueBdt ?? 0;
  const dhakaPrev = prev30.reduce((s, d) => s + (d.byRegion.Dhaka?.revenueBdt ?? 0), 0);
  const dhakaDipPct = dhakaPrev > 0 ? (dhaka30 - dhakaPrev) / dhakaPrev : 0;

  const inventoryAtRisk = inventory.filter((i) => i.atRisk).length;
  const inventoryAtRiskPrev = inventory.filter(
    (i) => i.daysUntilStockout >= 14 && i.daysUntilStockout < 21
  ).length;

  // Churn rise: rate of churn>=0.7 in last-90 vs prior 90-day cohorts.
  const recentCustomers = customers.filter((c) => c.lastOrderDays <= 90);
  const prevCustomers = customers.filter((c) => c.lastOrderDays > 90);
  const recentChurned = recentCustomers.filter((c) => c.churnRisk >= 0.7).length;
  const prevChurned = prevCustomers.filter((c) => c.churnRisk >= 0.7).length;
  const recentRate = recentCustomers.length > 0 ? recentChurned / recentCustomers.length : 0;
  const prevRate = prevCustomers.length > 0 ? prevChurned / prevCustomers.length : 0;
  const churnRisePct = prevRate > 0 ? (recentRate - prevRate) / prevRate : 0;
  const churnRiskCount = customers.filter((c) => c.churnRisk >= 0.7).length;

  return {
    revenue30,
    revenuePrev30,
    revenueTrend,
    activeCustomers: last30Cust.size,
    activeCustomersPrev: prev30Cust.size,
    byRegion30,
    dhakaDip: { region: "Dhaka", pct: dhakaDipPct },
    inventoryAtRisk,
    inventoryAtRiskPrev,
    churnRisePct,
    churnRiskCount,
    topCategories: [],
  };
}

/**
 * Normalize a series of numbers to [0..1] for sparkline rendering.
 */
export function sparklineSeries(values: readonly number[]): number[] {
  if (values.length === 0) return [];
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (max === min) return values.map(() => 0.5);
  return values.map((v) => (v - min) / (max - min));
}
