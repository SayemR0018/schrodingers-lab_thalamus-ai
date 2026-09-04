import type { BusinessEntity } from "./types";

export const mockEntities: BusinessEntity[] = [
  {
    id: "entity-classic-shirt",
    type: "product",
    name: "Classic Shirt",
    metrics: {
      "Sales": "↓ 21%",
      "Inventory": "18 units",
      "Customers": "1,284",
      "Revenue": "$24,680",
    },
    relatedEntities: ["entity-supplier-textile", "entity-dhaka"],
    relatedInsights: ["insight-inventory-risk"],
  },
  {
    id: "entity-wireless-headphones",
    type: "product",
    name: "Wireless Headphones",
    metrics: {
      "Sales": "+12%",
      "Inventory": "12 units",
      "Customers": "847",
      "Revenue": "$18,940",
    },
    relatedEntities: ["entity-supplier-electronics"],
    relatedInsights: ["insight-inventory-risk"],
  },
  {
    id: "entity-repeat-customers",
    type: "customer",
    name: "Repeat Customers",
    metrics: {
      "Purchase frequency": "↓ 7.8%",
      "Revenue contribution": "31%",
      "Total customers": "2,104",
      "Avg order value": "$68",
    },
    relatedEntities: [],
    relatedInsights: ["insight-customer-behavior"],
  },
  {
    id: "entity-dhaka",
    type: "region",
    name: "Dhaka Region",
    metrics: {
      "Sales": "↓ 13.2%",
      "Orders": "3,421",
      "Customers": "1,847",
      "Growth": "-8%",
    },
    relatedEntities: ["entity-classic-shirt"],
    relatedInsights: ["insight-sales-anomaly"],
  },
  {
    id: "entity-supplier-textile",
    type: "supplier",
    name: "Premium Textiles Ltd",
    metrics: {
      "Lead time": "5 days",
      "Products supplied": "24",
      "On-time delivery": "94%",
      "Quality rating": "4.8/5",
    },
    relatedEntities: ["entity-classic-shirt"],
  },
  {
    id: "entity-return-policy",
    type: "policy",
    name: "Return Policy",
    metrics: {
      "Return window": "30 days",
      "Return rate": "4.2%",
      "Refund processed": "847",
      "Avg processing": "3 days",
    },
    relatedEntities: [],
  },
];

export function getEntityById(id: string): BusinessEntity | undefined {
  return mockEntities.find((e) => e.id === id);
}

export function getEntitiesByType(type: BusinessEntity["type"]): BusinessEntity[] {
  return mockEntities.filter((e) => e.type === type);
}
