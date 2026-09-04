import { buildProducts, type Product } from "@/data/demo/products";
import { buildCustomers, type Customer } from "@/data/demo/customers";
import { buildOrders, type Order, type OrdersByDay } from "@/data/demo/orders";
import { buildInventory, type InventoryRecord } from "@/data/demo/inventory";
import { computeHealth, type HealthSnapshot } from "@/data/demo/analytics";
import { buildInsights, type Insight } from "@/data/demo/insights";
import { buildActivity, type ActivityItem } from "@/data/demo/activity";
import { suppliers, type Supplier } from "@/data/demo/suppliers";

export interface Dataset {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  byDay: OrdersByDay[];
  inventory: InventoryRecord[];
  health: HealthSnapshot;
  insights: Insight[];
  activity: ActivityItem[];
  suppliers: Supplier[];
}

const products = buildProducts();
const customers = buildCustomers();
const { orders, byDay } = buildOrders(customers, products);
const inventory = buildInventory(products, orders);
const health = computeHealth(orders, byDay, customers, inventory);
const insights = buildInsights(health, inventory, products, customers, orders);
const activity = buildActivity();

export const dataset: Dataset = {
  products,
  customers,
  orders,
  byDay,
  inventory,
  health,
  insights,
  activity,
  suppliers,
};
