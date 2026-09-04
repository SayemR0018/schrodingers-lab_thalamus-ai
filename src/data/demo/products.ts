import { makeRng, intBetween, pick, range } from "./seed";

export type ProductCategory =
  | "Apparel"
  | "Beauty"
  | "Electronics"
  | "Home"
  | "Grocery"
  | "Footwear"
  | "Accessories"
  | "Kids";

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameBn: string;
  category: ProductCategory;
  costBdt: number;
  priceBdt: number;
  supplierId: string;
  leadTimeDays: number;
}

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

const PREFIXES_BY_CATEGORY: Record<ProductCategory, string[]> = {
  Apparel: ["Classic", "Premium", "Heritage", "Modern", "Linen", "Casual", "Urban", "Studio"],
  Beauty: ["Glow", "Aura", "Pure", "Velvet", "Bloom", "Essence", "Radiance", "Silk"],
  Electronics: ["Nova", "Pulse", "Quantum", "Orbit", "Apex", "Volt", "Echo", "Spark"],
  Home: ["Cozy", "Nimbus", "Hearth", "Garden", "Harbor", "Nest", "Cedar", "Lumen"],
  Grocery: ["Harvest", "Golden", "Saffron", "Orchard", "Meadow", "Spice", "Field", "Sunrise"],
  Footwear: ["Stride", "Summit", "Drift", "Trail", "Wave", "Trek", "Voyage", "Sprint"],
  Accessories: ["Echo", "Luxe", "Vivid", "Onyx", "Pearl", "Mira", "Halo", "Nova"],
  Kids: ["Sunny", "Joy", "Spark", "Wonder", "Buddy", "Cub", "Tiny", "Star"],
};

const SUFFIXES_BY_CATEGORY: Record<ProductCategory, string[]> = {
  Apparel: ["Shirt", "Tee", "Kurta", "Polo", "Jacket", "Saree", "Blazer", "Tunic"],
  Beauty: ["Serum", "Cream", "Mist", "Mask", "Balm", "Lotion", "Toner", "Oil"],
  Electronics: ["Earbuds", "Speaker", "Hub", "Charger", "Cable", "Adapter", "Light", "Band"],
  Home: ["Lamp", "Pillow", "Mug", "Throw", "Vase", "Clock", "Mat", "Tray"],
  Grocery: ["Rice", "Tea", "Honey", "Oil", "Spice", "Cereal", "Nuts", "Sauce"],
  Footwear: ["Sneaker", "Sandal", "Loafer", "Boot", "Mule", "Slip-on", "Runner", "Flat"],
  Accessories: ["Wallet", "Belt", "Scarf", "Cap", "Sunglasses", "Bracelet", "Watch", "Ring"],
  Kids: ["Tee", "Toy", "Lunchbox", "Boots", "Cap", "Backpack", "Bibs", "Puzzle"],
};

const SKU_PREFIX_BY_CATEGORY: Record<ProductCategory, string> = {
  Apparel: "APP",
  Beauty: "BEAU",
  Electronics: "ELEC",
  Home: "HOME",
  Grocery: "GRO",
  Footwear: "FOOT",
  Accessories: "ACCS",
  Kids: "KIDS",
};

const BN_TRANSLITERATION: Record<string, string> = {
  Classic: "ক্লাসিক",
  Premium: "প্রিমিয়াম",
  Heritage: "ঐতিহ্য",
  Modern: "আধুনিক",
  Linen: "লিনেন",
  Casual: "ক্যাজুয়াল",
  Urban: "শহুরে",
  Studio: "স্টুডিও",
  Glow: "আভা",
  Aura: "করোটি",
  Pure: "বিশুদ্ধ",
  Velvet: "মখমল",
  Bloom: "প্রস্ফুটিত",
  Essence: "সার",
  Radiance: "উজ্জ্বলতা",
  Silk: "রেশম",
  Nova: "নোভা",
  Pulse: "স্পন্দন",
  Quantum: "কোয়ান্টাম",
  Orbit: "কক্ষপথ",
  Apex: "শিখর",
  Volt: "ভোল্ট",
  Echo: "প্রতিধ্বনি",
  Spark: "স্ফুলিঙ্গ",
  Cozy: "আরামদায়ক",
  Nimbus: "মেঘ",
  Hearth: "আঁচ",
  Garden: "বাগান",
  Harbor: "বন্দর",
  Nest: "বাসা",
  Cedar: "দেবদারু",
  Lumen: "আলো",
  Harvest: "ফসল",
  Golden: "সোনালি",
  Saffron: "জাফরান",
  Orchard: "বাগান",
  Meadow: "তৃণভূমি",
  Spice: "মশলা",
  Field: "ক্ষেত",
  Sunrise: "সূর্যোদয়",
  Stride: "পদক্ষেপ",
  Summit: "শিখর",
  Drift: "ভাসা",
  Trail: "পথ",
  Wave: "তরঙ্গ",
  Trek: "যাত্রা",
  Voyage: "সমুদ্রযাত্রা",
  Sprint: "দৌড়",
  Luxe: "বিলাসবহুল",
  Vivid: "প্রাণবন্ত",
  Onyx: "নীলকান্তমণি",
  Pearl: "মুক্তা",
  Mira: "মীরা",
  Halo: "আভা",
  Sunny: "রৌদ্রোজ্জ্বল",
  Joy: "আনন্দ",
  Wonder: "বিস্ময়",
  Buddy: "বন্ধু",
  Cub: "ছানা",
  Tiny: "ক্ষুদ্র",
  Star: "তারা",
  Shirt: "শার্ট",
  Tee: "টি-শার্ট",
  Kurta: "কুর্তা",
  Polo: "পোলো",
  Jacket: "জ্যাকেট",
  Saree: "শাড়ি",
  Blazer: "ব্লেজার",
  Tunic: "টিউনিক",
  Serum: "সিরাম",
  Cream: "ক্রিম",
  Mist: "কুয়াশা",
  Mask: "মুখোশ",
  Balm: "বাম",
  Lotion: "লোশন",
  Toner: "টোনার",
  Oil: "তেল",
  Earbuds: "ইয়ারবাড",
  Speaker: "স্পিকার",
  Hub: "হাব",
  Charger: "চার্জার",
  Cable: "কেবল",
  Adapter: "অ্যাডাপ্টার",
  Light: "আলো",
  Band: "ব্যান্ড",
  Lamp: "বাতি",
  Pillow: "বালিশ",
  Mug: "মগ",
  Throw: "থ্রো",
  Vase: "ফুলদানি",
  Clock: "ঘড়ি",
  Mat: "মাদুর",
  Tray: "ট্রে",
  Rice: "চাল",
  Tea: "চা",
  Honey: "মধু",
  Cereal: "সিরিয়াল",
  Nuts: "বাদাম",
  Sauce: "সস",
  Sneaker: "স্নিকার",
  Sandal: "স্যান্ডেল",
  Loafer: "লোফার",
  Boot: "বুট",
  Mule: "মিউল",
  "Slip-on": "স্লিপ-অন",
  Runner: "রানার",
  Flat: "ফ্ল্যাট",
  Wallet: "মানিব্যাগ",
  Belt: "বেল্ট",
  Scarf: "স্কার্ফ",
  Cap: "টুপি",
  Sunglasses: "সানগ্লাস",
  Bracelet: "ব্রেসলেট",
  Watch: "ঘড়ি",
  Ring: "আংটি",
  Toy: "খেলনা",
  Lunchbox: "লাঞ্চবক্স",
  Boots: "বুট",
  Backpack: "ব্যাকপ্যাক",
  Bibs: "বিবস",
  Puzzle: "ধাঁধা",
};

function bnName(parts: string[]): string {
  return parts.map((p) => BN_TRANSLITERATION[p] ?? p).join(" ");
}

export function buildProducts(): Product[] {
  const rng = makeRng(0xc0de0001);
  // 342 products / 8 categories = roughly 42–43 each. Distribute via deterministic cycle.
  const totalCount = 342;
  const base = Math.floor(totalCount / CATEGORIES.length);
  const remainder = totalCount % CATEGORIES.length;
  const products: Product[] = [];

  CATEGORIES.forEach((category, ci) => {
    const count = base + (ci < remainder ? 1 : 0);
    for (let i = 0; i < count; i++) {
      const idx = products.length;
      const sku = `${SKU_PREFIX_BY_CATEGORY[category]}-${String(idx + 1).padStart(4, "0")}`;
      const prefix = pick(rng, PREFIXES_BY_CATEGORY[category]);
      const suffix = pick(rng, SUFFIXES_BY_CATEGORY[category]);
      const name = `${prefix} ${suffix}`;
      const nameBn = bnName([prefix, suffix]);
      const costBdt = intBetween(rng, 150, 1800);
      const markup = 0.28 + rng() * (0.65 - 0.28); // 28-65%
      const priceBdt = Math.round(costBdt * (1 + markup));
      const supplierId = `sup-${intBetween(rng, 1, 12)}`;
      const leadTimeDays = intBetween(rng, 3, 21);
      products.push({
        id: `prod-${idx + 1}`,
        sku,
        name,
        nameBn,
        category,
        costBdt,
        priceBdt,
        supplierId,
        leadTimeDays,
      });
    }
  });

  // Ensure we hit 342 exactly. (Already guaranteed by construction.)
  return products.slice(0, totalCount);
}
