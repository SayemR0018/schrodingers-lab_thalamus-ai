/**
 * Bangladesh-localised business context for THALAMUS inference.
 *
 * Two exports live here:
 *
 *   1. `buildBusinessContext(params)`  — NEW spec-shaped aggregator used by
 *      `runThalamusInference` and the `/api/chat/stream` route. It pulls
 *      live derived summaries from `src/services/dataset.ts`, formats
 *      currency in BDT (৳), and stamps `Asia/Dhaka` as the timezone.
 *
 *   2. `buildBusinessContextSlice()`  — Legacy slice kept for the existing
 *      `buildChatContext` composer (UI context payload).
 */
import { dataset, type Dataset } from "@/services/dataset";
import type { InventoryRecord } from "@/data/demo/inventory";
import type { Product } from "@/data/demo/products";
import type { Supplier } from "@/data/demo/suppliers";
import type { Order } from "@/data/demo/orders";

// ---------------------------------------------------------------------------
// Legacy slice (used by `context/index.ts` → `buildChatContext`).
// ---------------------------------------------------------------------------

export interface BusinessContextSlice {
  name: string;
  industry: string;
  totals: {
    products: number;
    customers: number;
    orders: number;
    suppliers: number;
  };
  currency: string;
  timezone: string;
  datasetVersion: string;
}

export function buildBusinessContextSlice(): BusinessContextSlice {
  return {
    name: "Demo Commerce",
    industry: "E-commerce / Retail (Bangladesh)",
    totals: {
      products: dataset.products.length,
      customers: dataset.customers.length,
      orders: dataset.orders.length,
      suppliers: dataset.suppliers.length,
    },
    currency: "BDT",
    timezone: "Asia/Dhaka",
    datasetVersion: "v1.4",
  };
}

// ---------------------------------------------------------------------------
// New BD-localised context for inference (per THALAMUS_Demo_Dataset_BD_v1).
// ---------------------------------------------------------------------------

export interface BuildBusinessContextParams {
  selectedAgentId?: string;
  selectedEntityId?: string;
  language?: "en" | "bn";
}

export interface BdAtRiskSku {
  product_id: string;
  product_name: string;
  current_stock: number;
  reorder_point: number;
  avg_daily_units: number;
  lead_time_days: number;
  unit_cost_bdt: number;
  supplier_id: string;
  supplier_name: string;
  stock_status: string;
}

export interface BdSupplier {
  supplier_id: string;
  name: string;
  lead_time_days: number;
  on_time_rate: number;
}

export interface BusinessContext {
  market: string;
  currency: string;
  timezone: string;
  overview: {
    revenue30d_bdt: number;
    revenue_prev30d_bdt: number;
    active_customers_30d: number;
    active_customers_prev30d: number;
    dhaka_region_status: { region: "Dhaka"; pct: number };
    skus_at_risk_count: number;
  };
  critical_at_risk_skus: BdAtRiskSku[];
  suppliers_directory: BdSupplier[];
  sample_order_ids: string[];
  selected_agent?: string;
  selected_entity_id?: string;
  language: "en" | "bn";
}

/**
 * BD dataset fields used for context extraction. The demo `dataset.ts`
 * exposes typed arrays (`Product[]`, `InventoryRecord[]`, `Supplier[]`,
 * `Order[]`) — this interface describes the *optional* snake_case
 * aliases that may appear if the upstream schema is later migrated to the
 * localised BD dataset (per `THALAMUS_Demo_Dataset_BD_v1`).
 */
interface BdDatasetExtensions {
  inventory?: ReadonlyArray<Partial<InventoryRecord> & Record<string, unknown>>;
  products?: ReadonlyArray<Partial<Product> & Record<string, unknown>>;
  suppliers?: ReadonlyArray<Partial<Supplier> & Record<string, unknown>>;
  orders?: ReadonlyArray<Partial<Order> & Record<string, unknown>>;
}

/**
 * Aggregate live derived context from the BD dataset facade.
 * Used as the LLM grounding payload for both chat stream and agent invoke.
 */
export function buildBusinessContext(
  params: BuildBusinessContextParams = {}
): BusinessContext {
  const data = dataset as Dataset & BdDatasetExtensions;
  const health = data.health;
  const inventory = data.inventory;
  const products = data.products;
  const suppliers = data.suppliers;
  const orders = data.orders;

  const atRiskInventory: BdAtRiskSku[] = inventory
    .filter((i) => i.atRisk === true)
    .slice(0, 10)
    .map((i) => {
      const prod = products.find((p) => p.id === i.productId);
      // Inventory records key on product, so the supplier is reached through
      // the product's `supplierId` rather than the product id itself.
      const supplierId = prod?.supplierId;
      const sup = supplierId
        ? suppliers.find((s) => s.id === supplierId)
        : undefined;
      return {
        product_id: i.productId,
        product_name: prod?.name ?? "Unknown Product",
        current_stock: i.currentStock,
        reorder_point: i.reorderPoint,
        avg_daily_units: i.recentDailyDemand,
        lead_time_days: i.leadTimeDays,
        unit_cost_bdt: prod?.costBdt ?? 0,
        supplier_id: sup?.id ?? supplierId ?? "unknown",
        supplier_name: sup?.name ?? "Unknown Supplier",
        stock_status: "at_risk",
      };
    });

  const suppliersDirectory: BdSupplier[] = suppliers
    .slice(0, 12)
    .map((s) => ({
      supplier_id: s.id,
      name: s.name,
      lead_time_days: s.leadTimeDays,
      on_time_rate: s.onTimeRate,
    }));

  return {
    market: "Bangladesh",
    currency: "BDT (৳)",
    timezone: "Asia/Dhaka",
    overview: {
      revenue30d_bdt: health.revenue30,
      revenue_prev30d_bdt: health.revenuePrev30,
      active_customers_30d: health.activeCustomers,
      active_customers_prev30d: health.activeCustomersPrev,
      dhaka_region_status: health.dhakaDip ?? { region: "Dhaka", pct: -0.22 },
      skus_at_risk_count: atRiskInventory.length,
    },
    critical_at_risk_skus: atRiskInventory,
    suppliers_directory: suppliersDirectory,
    sample_order_ids: orders.slice(0, 10).map((o) => o.id),
    selected_agent: params.selectedAgentId,
    selected_entity_id: params.selectedEntityId,
    language: params.language ?? "en",
  };
}
