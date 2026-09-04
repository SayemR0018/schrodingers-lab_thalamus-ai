import { makeRng, intBetween, pick } from "./seed";
import type { Customer, Region } from "./customers";
import { REGIONS } from "./customers";
import type { Product, ProductCategory } from "./products";

export type Channel = "Web" | "App" | "POS" | "Phone" | "Wholesale";

export const CHANNELS: Channel[] = ["Web", "App", "POS", "Phone", "Wholesale"];

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  totalBdt: number;
  region: Region;
  channel: Channel;
  daysAgo: number;
  date: string;
}

export interface OrdersByDay {
  daysAgo: number;
  date: string;
  orders: number;
  revenueBdt: number;
  byRegion: Record<Region, { orders: number; revenueBdt: number }>;
}

const HOT_CATEGORIES: ProductCategory[] = ["Apparel", "Beauty", "Grocery"];

function weightedProduct(rng: () => number, products: readonly Product[]): Product {
  // Build weighted list: hot categories get weight 2, others weight 1.
  const weights = products.map((p) => (HOT_CATEGORIES.includes(p.category) ? 2 : 1));
  const total = weights.reduce((s, w) => s + w, 0);
  let r = rng() * total;
  for (let i = 0; i < products.length; i++) {
    r -= weights[i];
    if (r <= 0) return products[i];
  }
  return products[products.length - 1];
}

function seasonalityMultiplier(date: Date): number {
  const month = date.getMonth(); // 0-11
  // Mar–Apr (months 10–11) multiplier ×1.55; Dec–Jan ×1.20; Jun–Aug ×0.85.
  if (month === 10 || month === 11) return 1.55;
  if (month === 11 || month === 0) return 1.2;
  if (month === 5 || month === 6 || month === 7) return 0.85;
  return 1.0;
}

function dateFor(daysAgo: number): Date {
  const now = new Date();
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export interface BuildOrdersResult {
  orders: Order[];
  byDay: OrdersByDay[];
}

export function buildOrders(customers: readonly Customer[], products: readonly Product[]): BuildOrdersResult {
  const rng = makeRng(0xf00d0001);
  const target = 14200;
  const orders: Order[] = [];
  const ordersByDayMap = new Map<number, OrdersByDay>();

  // Initialize 361-day window with empty aggregates (0..360 inclusive).
  for (let d = 0; d <= 360; d++) {
    const date = dateFor(d);
    const emptyByRegion = REGIONS.reduce((acc, region) => {
      acc[region] = { orders: 0, revenueBdt: 0 };
      return acc;
    }, {} as Record<Region, { orders: number; revenueBdt: number }>);
    ordersByDayMap.set(d, {
      daysAgo: d,
      date: isoDate(date),
      orders: 0,
      revenueBdt: 0,
      byRegion: emptyByRegion,
    });
  }

  // Base acceptance chance per attempt; tuned so we get roughly `target` orders.
  const baseAccept = 0.085;
  let attempts = 0;
  const maxAttempts = target * 25; // safety cap

  while (orders.length < target && attempts < maxAttempts) {
    attempts++;
    // Bias daysAgo toward more recent days.
    const u = rng();
    const daysAgo = Math.min(360, Math.floor(u * u * 360));
    const date = dateFor(daysAgo);

    const accept = baseAccept * seasonalityMultiplier(date);

    if (rng() > accept) continue;

    const customer = pick(rng, customers);
    // Dhaka dip application: 22% lower acceptance for recent Dhaka customers.
    let dhakaAdjust = 1;
    if (daysAgo <= 30 && customer.region === "Dhaka") {
      dhakaAdjust = 0.78;
    }
    if (rng() > dhakaAdjust) continue;

    const product = weightedProduct(rng, products);
    const quantity = intBetween(rng, 1, 4);
    const totalBdt = product.priceBdt * quantity;
    const channel = pick(rng, CHANNELS);

    orders.push({
      id: `ord-${orders.length + 1}`,
      customerId: customer.id,
      productId: product.id,
      quantity,
      totalBdt,
      region: customer.region,
      channel,
      daysAgo,
      date: isoDate(date),
    });
  }

  // Aggregate byDay from orders.
  for (const order of orders) {
    const entry = ordersByDayMap.get(order.daysAgo);
    if (!entry) continue;
    entry.orders += 1;
    entry.revenueBdt += order.totalBdt;
    const regionEntry = entry.byRegion[order.region];
    regionEntry.orders += 1;
    regionEntry.revenueBdt += order.totalBdt;
  }

  const byDay: OrdersByDay[] = Array.from(ordersByDayMap.values()).sort(
    (a, b) => a.daysAgo - b.daysAgo
  );

  return { orders, byDay };
}
