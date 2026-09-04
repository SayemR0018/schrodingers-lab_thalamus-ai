/**
 * Entity-level context: when the user has selected a product/customer/etc.
 * in the Business Brain, surface that entity's metrics so the LLM can
 * answer context-scoped questions.
 *
 * Entity ids follow the convention: `<type>-<index>` or are looked up by
 * id from the demo data.
 */
import { dataset } from "@/services/dataset";
import type { Product } from "@/data/demo/products";
import type { Customer } from "@/data/demo/customers";
import type { Supplier } from "@/data/demo/suppliers";

export type EntityKind = "product" | "customer" | "supplier";

export interface EntityContextSlice {
  id: string;
  type: EntityKind;
  name: string;
  metrics: Record<string, string | number>;
}

function productMetrics(p: Product): Record<string, string | number> {
  return {
    sku: p.sku,
    category: p.category,
    priceBdt: p.priceBdt,
    costBdt: p.costBdt,
    marginPct: Math.round(((p.priceBdt - p.costBdt) / p.priceBdt) * 100),
    leadTimeDays: p.leadTimeDays,
  };
}

function customerMetrics(c: Customer): Record<string, string | number> {
  return {
    region: c.region,
    totalOrders: c.totalOrders,
    ltvBdt: c.ltvBdt,
    lastOrderDaysAgo: c.lastOrderDays,
    churnRisk: Number(c.churnRisk.toFixed(2)),
    repeatBuyer: c.repeatBuyer ? "yes" : "no",
    preferredCategory: c.preferredCategory,
  };
}

function supplierMetrics(s: Supplier): Record<string, string | number> {
  return {
    region: s.region,
    leadTimeDays: s.leadTimeDays,
    onTimeRate: Number((s.onTimeRate * 100).toFixed(1)),
    contractRef: s.contractRef,
  };
}

export function buildEntityContext(
  entityId: string,
  kind: EntityKind
): EntityContextSlice | null {
  if (kind === "product") {
    const p = dataset.products.find((x) => x.id === entityId);
    if (!p) return null;
    return {
      id: p.id,
      type: "product",
      name: p.name,
      metrics: productMetrics(p),
    };
  }
  if (kind === "customer") {
    const c = dataset.customers.find((x) => x.id === entityId);
    if (!c) return null;
    return {
      id: c.id,
      type: "customer",
      name: c.name,
      metrics: customerMetrics(c),
    };
  }
  if (kind === "supplier") {
    const s = dataset.suppliers.find((x) => x.id === entityId);
    if (!s) return null;
    return {
      id: s.id,
      type: "supplier",
      name: s.name,
      metrics: supplierMetrics(s),
    };
  }
  return null;
}
