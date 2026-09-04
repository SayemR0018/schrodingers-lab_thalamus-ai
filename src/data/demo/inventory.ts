import { makeRng, intBetween } from "./seed";
import type { Product } from "./products";
import type { Order } from "./orders";

export interface InventoryRecord {
  productId: string;
  sku: string;
  productName: string;
  currentStock: number;
  recentDailyDemand: number;
  leadTimeDays: number;
  reorderPoint: number;
  reorderQty: number;
  daysUntilStockout: number;
  atRisk: boolean;
}

const PLANTED_CRITICAL_SKUS = new Set(["APP-0042", "GRO-0117"]);

export function buildInventory(products: readonly Product[], orders: readonly Order[]): InventoryRecord[] {
  const rng = makeRng(0x1a2b0001);

  // recentDailyDemand = sum(quantity in daysAgo <= 30) / 30
  const demandByProduct = new Map<string, number>();
  for (const order of orders) {
    if (order.daysAgo <= 30) {
      demandByProduct.set(
        order.productId,
        (demandByProduct.get(order.productId) ?? 0) + order.quantity
      );
    }
  }

  return products.map((product) => {
    const totalRecentQty = demandByProduct.get(product.id) ?? 0;
    const recentDailyDemand = totalRecentQty / 30;

    let currentStock: number;
    if (PLANTED_CRITICAL_SKUS.has(product.sku)) {
      // 6-10 days of stock
      currentStock = Math.round(recentDailyDemand * intBetween(rng, 6, 10));
    } else if (recentDailyDemand > 0.4) {
      // Other active SKUs: 30-90 days
      currentStock = Math.round(recentDailyDemand * intBetween(rng, 30, 90));
    } else {
      // Slow movers: 5-30 days
      currentStock = intBetween(rng, 5, 30);
    }

    const reorderPoint = Math.max(2, Math.round(recentDailyDemand * 14));
    const reorderQty = Math.max(5, Math.round(recentDailyDemand * 30));
    const safeDaily = Math.max(recentDailyDemand, 0.0001);
    const daysUntilStockout = Math.max(
      0,
      Math.floor(currentStock / safeDaily) - product.leadTimeDays
    );
    const atRisk = daysUntilStockout < 14;

    return {
      productId: product.id,
      sku: product.sku,
      productName: product.name,
      currentStock,
      recentDailyDemand,
      leadTimeDays: product.leadTimeDays,
      reorderPoint,
      reorderQty,
      daysUntilStockout,
      atRisk,
    };
  });
}
