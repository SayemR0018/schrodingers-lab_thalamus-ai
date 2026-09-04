import { makeRng, intBetween, pick } from "./seed";
import type { ProductCategory } from "./products";

export type Region =
  | "Dhaka"
  | "Chittagong"
  | "Sylhet"
  | "Rajshahi"
  | "Khulna"
  | "Barisal"
  | "Rangpur"
  | "Mymensingh";

export const REGIONS: Region[] = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
];

export interface Customer {
  id: string;
  name: string;
  region: Region;
  firstOrderDays: number;
  totalOrders: number;
  ltvBdt: number;
  lastOrderDays: number;
  repeatBuyer: boolean;
  preferredCategory: ProductCategory;
  churnRisk: number;
}

const FIRST_NAMES = [
  "Rahim", "Karim", "Jamal", "Faruk", "Imran", "Sabbir", "Tariq", "Saif",
  "Nadia", "Sumaiya", "Rina", "Mitu", "Tania", "Sharmin", "Mim", "Tisha",
  "Asif", "Reza", "Aminul", "Shahin", "Rumi", "Anika", "Priya", "Sadia",
];

const LAST_NAMES = [
  "Ahmed", "Hossain", "Rahman", "Khan", "Islam", "Chowdhury", "Miah", "Sheikh",
  "Begum", "Akter", "Sultana", "Aktar", "Uddin", "Mahmud", "Sarker", "Das",
];

const CATEGORIES: ProductCategory[] = [
  "Apparel",
  "Beauty",
  "Electronics",
  "Home",
  "Grocery",
  "Footwear",
  "Accessories",
  "Kids",
];

export function buildCustomers(count = 4218): Customer[] {
  const rng = makeRng(0xcafe0001);
  const avgTicket = 1850;
  return Array.from({ length: count }, (_, i) => {
    const totalOrders = intBetween(rng, 1, 22);
    const firstOrderDays = intBetween(rng, 0, 360);
    const lastOrderDays = intBetween(rng, 0, 180);
    const ltvBdt = totalOrders * Math.round(avgTicket * (0.7 + rng() * 0.6));
    const repeatBuyer = totalOrders >= 2;
    const preferredCategory = pick(rng, CATEGORIES);

    const inactivity = Math.min(1, lastOrderDays / 90);
    const recency = totalOrders >= 4 ? 0.2 : 0.5;
    const churnRisk = Math.max(
      0,
      Math.min(1, inactivity * 0.7 + recency - rng() * 0.2)
    );

    return {
      id: `cust-${i + 1}`,
      name: `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`,
      region: pick(rng, REGIONS),
      firstOrderDays,
      totalOrders,
      ltvBdt,
      lastOrderDays,
      repeatBuyer,
      preferredCategory,
      churnRisk,
    };
  });
}
