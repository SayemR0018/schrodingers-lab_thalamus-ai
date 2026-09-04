import type { BusinessContext, KnowledgeGraphStats } from "./types";

export const mockBusiness: BusinessContext = {
  name: "Demo Commerce",
  industry: "E-commerce",
  entities: {
    products: 386,
    customers: 4821,
    orders: 12843,
    suppliers: 24,
  },
};

export const mockKnowledgeGraph: KnowledgeGraphStats = {
  entities: 1248,
  relations: 3671,
  policies: 24,
  lastUpdated: "2 min ago",
};
