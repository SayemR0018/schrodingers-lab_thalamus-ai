import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export type DataCategoryType = 
  | "products" 
  | "customers" 
  | "orders" 
  | "inventory" 
  | "suppliers" 
  | "documents"
  | "policies"
  | "business-info";

export interface DataRecord {
  id: string;
  categoryId: DataCategoryType;
  data: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface DataCategory {
  id: DataCategoryType;
  name: string;
  icon: string;
  recordCount: number;
  status: "healthy" | "warning" | "error";
  lastUpdated: string;
}

export interface DataVersion {
  id: string;
  version: string;
  createdAt: string;
  description: string;
  changes: {
    type: "add" | "edit" | "delete" | "restore" | "import";
    category?: DataCategoryType;
    count?: number;
    detail?: string;
  }[];
  snapshot: {
    categories: Record<DataCategoryType, number>;
    totalRecords: number;
  };
}

export interface RecentChange {
  id: string;
  description: string;
  timestamp: string;
  category?: DataCategoryType;
}

interface DataState {
  // Active version
  activeVersionId: string;
  
  // Version history (append-only)
  versions: DataVersion[];
  
  // Current data categories
  categories: DataCategory[];
  
  // Actual records (keyed by category)
  records: Record<DataCategoryType, DataRecord[]>;
  
  // Recent changes
  recentChanges: RecentChange[];
  
  // Actions
  getActiveVersion: () => DataVersion | undefined;
  switchVersion: (versionId: string) => void;
  restoreVersion: (versionId: string) => void;
  
  addRecord: (category: DataCategoryType, data: Record<string, string | number | boolean>) => void;
  updateRecord: (category: DataCategoryType, recordId: string, data: Record<string, string | number | boolean>) => void;
  deleteRecord: (category: DataCategoryType, recordId: string) => void;
  
  addBusinessInfo: (key: string, value: string) => void;
  
  getCategoryRecords: (category: DataCategoryType) => DataRecord[];
  getTotalRecords: () => number;
}

// Initial demo data
const initialCategories: DataCategory[] = [
  { id: "products", name: "Products", icon: "Package", recordCount: 386, status: "healthy", lastUpdated: "2 hours ago" },
  { id: "customers", name: "Customers", icon: "Users", recordCount: 4821, status: "healthy", lastUpdated: "1 hour ago" },
  { id: "orders", name: "Orders", icon: "ShoppingCart", recordCount: 12843, status: "healthy", lastUpdated: "30 min ago" },
  { id: "inventory", name: "Inventory", icon: "Warehouse", recordCount: 386, status: "warning", lastUpdated: "2 hours ago" },
  { id: "suppliers", name: "Suppliers", icon: "Truck", recordCount: 24, status: "healthy", lastUpdated: "1 day ago" },
  { id: "documents", name: "Documents", icon: "FileText", recordCount: 42, status: "healthy", lastUpdated: "3 days ago" },
  { id: "policies", name: "Policies", icon: "Shield", recordCount: 8, status: "healthy", lastUpdated: "1 week ago" },
  { id: "business-info", name: "Business Info", icon: "Building2", recordCount: 12, status: "healthy", lastUpdated: "2 days ago" },
];

const initialRecords: Record<DataCategoryType, DataRecord[]> = {
  products: [
    { id: "prod-1", categoryId: "products", data: { name: "Classic Shirt", category: "Apparel", price: 1200, inventory: 18, supplier: "Premium Textiles Ltd" }, createdAt: "2026-08-15", updatedAt: "2026-09-01" },
    { id: "prod-2", categoryId: "products", data: { name: "Wireless Headphones", category: "Electronics", price: 2500, inventory: 12, supplier: "Tech Supplies Co" }, createdAt: "2026-08-10", updatedAt: "2026-09-02" },
    { id: "prod-3", categoryId: "products", data: { name: "USB-C Hub", category: "Electronics", price: 1800, inventory: 28, supplier: "Tech Supplies Co" }, createdAt: "2026-08-12", updatedAt: "2026-09-01" },
    { id: "prod-4", categoryId: "products", data: { name: "Laptop Stand", category: "Accessories", price: 950, inventory: 45, supplier: "Office Essentials" }, createdAt: "2026-08-20", updatedAt: "2026-08-30" },
    { id: "prod-5", categoryId: "products", data: { name: "Cotton T-Shirt", category: "Apparel", price: 800, inventory: 156, supplier: "Premium Textiles Ltd" }, createdAt: "2026-08-05", updatedAt: "2026-08-28" },
  ],
  customers: [
    { id: "cust-1", categoryId: "customers", data: { name: "Ahmed Rahman", email: "ahmed@example.com", segment: "Premium", orders: 24, spent: 48500 }, createdAt: "2026-01-15", updatedAt: "2026-09-01" },
    { id: "cust-2", categoryId: "customers", data: { name: "Fatima Khan", email: "fatima@example.com", segment: "Regular", orders: 12, spent: 18200 }, createdAt: "2026-02-20", updatedAt: "2026-08-28" },
    { id: "cust-3", categoryId: "customers", data: { name: "Karim Uddin", email: "karim@example.com", segment: "New", orders: 3, spent: 4500 }, createdAt: "2026-08-01", updatedAt: "2026-09-02" },
  ],
  orders: [
    { id: "ord-1", categoryId: "orders", data: { orderId: "ORD-12843", customer: "Ahmed Rahman", total: 3500, status: "Delivered", date: "2026-09-01" }, createdAt: "2026-09-01", updatedAt: "2026-09-01" },
    { id: "ord-2", categoryId: "orders", data: { orderId: "ORD-12842", customer: "Fatima Khan", total: 2800, status: "Shipped", date: "2026-09-01" }, createdAt: "2026-09-01", updatedAt: "2026-09-01" },
  ],
  inventory: [
    { id: "inv-1", categoryId: "inventory", data: { sku: "SKU-001", product: "Classic Shirt", quantity: 18, reorderPoint: 50, location: "Warehouse A" }, createdAt: "2026-08-01", updatedAt: "2026-09-02" },
    { id: "inv-2", categoryId: "inventory", data: { sku: "SKU-002", product: "Wireless Headphones", quantity: 12, reorderPoint: 25, location: "Warehouse B" }, createdAt: "2026-08-01", updatedAt: "2026-09-02" },
  ],
  suppliers: [
    { id: "sup-1", categoryId: "suppliers", data: { name: "Premium Textiles Ltd", contact: "supplier@textiles.com", leadTime: "5 days", rating: 4.8 }, createdAt: "2026-01-01", updatedAt: "2026-08-15" },
    { id: "sup-2", categoryId: "suppliers", data: { name: "Tech Supplies Co", contact: "orders@techsupplies.com", leadTime: "7 days", rating: 4.5 }, createdAt: "2026-01-01", updatedAt: "2026-08-20" },
  ],
  documents: [
    { id: "doc-1", categoryId: "documents", data: { name: "Q2 Sales Report", type: "PDF", size: "2.4 MB", uploadedBy: "Admin" }, createdAt: "2026-07-01", updatedAt: "2026-07-01" },
    { id: "doc-2", categoryId: "documents", data: { name: "Supplier Contracts", type: "PDF", size: "5.1 MB", uploadedBy: "Admin" }, createdAt: "2026-06-15", updatedAt: "2026-06-15" },
  ],
  policies: [
    { id: "pol-1", categoryId: "policies", data: { name: "Return Policy", description: "30-day return window for unused items", status: "Active" }, createdAt: "2026-01-01", updatedAt: "2026-08-01" },
    { id: "pol-2", categoryId: "policies", data: { name: "Payment Terms", description: "Net 30 for B2B customers", status: "Active" }, createdAt: "2026-01-01", updatedAt: "2026-08-15" },
  ],
  "business-info": [
    { id: "info-1", categoryId: "business-info", data: { key: "Business Name", value: "Demo Commerce" }, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
    { id: "info-2", categoryId: "business-info", data: { key: "Industry", value: "E-commerce" }, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
    { id: "info-3", categoryId: "business-info", data: { key: "Currency", value: "BDT" }, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
    { id: "info-4", categoryId: "business-info", data: { key: "Timezone", value: "Asia/Dhaka" }, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  ],
};

const initialVersions: DataVersion[] = [
  {
    id: "v1.4",
    version: "1.4",
    createdAt: "Sep 3, 10:42 AM",
    description: "Latest business data",
    changes: [
      { type: "add", category: "products", count: 12, detail: "12 products added" },
      { type: "edit", category: "policies", detail: "Payment policy updated" },
      { type: "delete", count: 2, detail: "2 duplicate records removed" },
    ],
    snapshot: { categories: { products: 386, customers: 4821, orders: 12843, inventory: 386, suppliers: 24, documents: 42, policies: 8, "business-info": 12 }, totalRecords: 18522 },
  },
  {
    id: "v1.3",
    version: "1.3",
    createdAt: "Aug 31",
    description: "Product expansion",
    changes: [{ type: "add", category: "products", count: 8, detail: "8 products added" }],
    snapshot: { categories: { products: 374, customers: 4821, orders: 12800, inventory: 374, suppliers: 24, documents: 40, policies: 7, "business-info": 12 }, totalRecords: 18452 },
  },
  {
    id: "v1.2",
    version: "1.2",
    createdAt: "Aug 28",
    description: "Inventory update",
    changes: [{ type: "edit", category: "inventory", detail: "Inventory levels updated" }],
    snapshot: { categories: { products: 366, customers: 4800, orders: 12750, inventory: 366, suppliers: 24, documents: 38, policies: 7, "business-info": 12 }, totalRecords: 18363 },
  },
  {
    id: "v1.1",
    version: "1.1",
    createdAt: "Aug 25",
    description: "Customer data import",
    changes: [{ type: "import", category: "customers", count: 500, detail: "500 customers imported from Shopify" }],
    snapshot: { categories: { products: 366, customers: 4300, orders: 12500, inventory: 366, suppliers: 24, documents: 35, policies: 7, "business-info": 12 }, totalRecords: 17610 },
  },
  {
    id: "v1.0",
    version: "1.0",
    createdAt: "Aug 20",
    description: "Initial business data",
    changes: [{ type: "add", detail: "Initial data setup" }],
    snapshot: { categories: { products: 350, customers: 3800, orders: 12000, inventory: 350, suppliers: 20, documents: 30, policies: 5, "business-info": 10 }, totalRecords: 16565 },
  },
];

const initialRecentChanges: RecentChange[] = [
  { id: "rc-1", description: "12 products added", timestamp: "10:42 AM", category: "products" },
  { id: "rc-2", description: "Payment policy updated", timestamp: "10:18 AM", category: "policies" },
  { id: "rc-3", description: "Inventory dataset updated", timestamp: "09:54 AM", category: "inventory" },
  { id: "rc-4", description: "Customer data imported", timestamp: "Yesterday", category: "customers" },
];

function formatTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

// Generates a unique change id. Combines the current timestamp with a
// monotonic counter and a random suffix so two events in the same millisecond
// never collide (which previously caused React duplicate-key warnings).
let changeCounter = 0;
function newChangeId(): string {
  changeCounter = (changeCounter + 1) % 1_000_000;
  return `rc-${Date.now()}-${changeCounter}-${Math.floor(Math.random() * 1000)}`;
}

function getNextVersion(versions: DataVersion[]): string {
  const latest = versions[0];
  const parts = latest.version.split(".");
  return `${parts[0]}.${parseInt(parts[1]) + 1}`;
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      activeVersionId: "v1.4",
      versions: initialVersions,
      categories: initialCategories,
      records: initialRecords,
      recentChanges: initialRecentChanges,

      getActiveVersion: () => {
        const state = get();
        return state.versions.find((v) => v.id === state.activeVersionId);
      },

      switchVersion: (versionId) => {
        const state = get();
        const version = state.versions.find((v) => v.id === versionId);
        if (!version) return;

        // Update categories to match the snapshot
        const updatedCategories = state.categories.map((cat) => ({
          ...cat,
          recordCount: version.snapshot.categories[cat.id] || cat.recordCount,
        }));

        set({
          activeVersionId: versionId,
          categories: updatedCategories,
        });
      },

      restoreVersion: (versionId) => {
        const state = get();
        const version = state.versions.find((v) => v.id === versionId);
        if (!version) return;

        const newVersionId = `v${getNextVersion(state.versions)}`;
        const newVersion: DataVersion = {
          id: newVersionId,
          version: getNextVersion(state.versions),
          createdAt: formatTimestamp(),
          description: `Restored from v${version.version}`,
          changes: [{ type: "restore", detail: `Restored from version ${version.version}` }],
          snapshot: { ...version.snapshot },
        };

        const updatedCategories = state.categories.map((cat) => ({
          ...cat,
          recordCount: version.snapshot.categories[cat.id] || cat.recordCount,
          lastUpdated: "Just now",
        }));

        set({
          activeVersionId: newVersionId,
          versions: [newVersion, ...state.versions],
          categories: updatedCategories,
          recentChanges: [
            { id: newChangeId(), description: `Restored from v${version.version}`, timestamp: formatTimestamp() },
            ...state.recentChanges,
          ],
        });
      },

      addRecord: (category, data) => {
        const state = get();
        const newRecord: DataRecord = {
          id: `${category}-${Date.now()}`,
          categoryId: category,
          data,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };

        const updatedRecords = {
          ...state.records,
          [category]: [...state.records[category], newRecord],
        };

        const updatedCategories = state.categories.map((cat) =>
          cat.id === category
            ? { ...cat, recordCount: cat.recordCount + 1, lastUpdated: "Just now" }
            : cat
        );

        const newVersionId = `v${getNextVersion(state.versions)}`;
        const catName = state.categories.find((c) => c.id === category)?.name || category;
        const newVersion: DataVersion = {
          id: newVersionId,
          version: getNextVersion(state.versions),
          createdAt: formatTimestamp(),
          description: `${catName} added`,
          changes: [{ type: "add", category, count: 1, detail: `1 ${catName.toLowerCase()} added` }],
          snapshot: {
            categories: Object.fromEntries(updatedCategories.map((c) => [c.id, c.recordCount])) as Record<DataCategoryType, number>,
            totalRecords: updatedCategories.reduce((sum, c) => sum + c.recordCount, 0),
          },
        };

        set({
          records: updatedRecords,
          categories: updatedCategories,
          activeVersionId: newVersionId,
          versions: [newVersion, ...state.versions],
          recentChanges: [
            { id: newChangeId(), description: `${catName} added`, timestamp: formatTimestamp(), category },
            ...state.recentChanges,
          ],
        });
      },

      updateRecord: (category, recordId, data) => {
        const state = get();
        const updatedRecords = {
          ...state.records,
          [category]: state.records[category].map((r) =>
            r.id === recordId ? { ...r, data: { ...r.data, ...data }, updatedAt: new Date().toISOString().split("T")[0] } : r
          ),
        };

        const updatedCategories = state.categories.map((cat) =>
          cat.id === category ? { ...cat, lastUpdated: "Just now" } : cat
        );

        const newVersionId = `v${getNextVersion(state.versions)}`;
        const record = state.records[category].find((r) => r.id === recordId);
        const recordName = record?.data.name || record?.data.key || "Record";

        const newVersion: DataVersion = {
          id: newVersionId,
          version: getNextVersion(state.versions),
          createdAt: formatTimestamp(),
          description: `${recordName} updated`,
          changes: [{ type: "edit", category, detail: `${recordName} updated` }],
          snapshot: {
            categories: Object.fromEntries(updatedCategories.map((c) => [c.id, c.recordCount])) as Record<DataCategoryType, number>,
            totalRecords: updatedCategories.reduce((sum, c) => sum + c.recordCount, 0),
          },
        };

        set({
          records: updatedRecords,
          categories: updatedCategories,
          activeVersionId: newVersionId,
          versions: [newVersion, ...state.versions],
          recentChanges: [
            { id: newChangeId(), description: `${recordName} updated`, timestamp: formatTimestamp(), category },
            ...state.recentChanges,
          ],
        });
      },

      deleteRecord: (category, recordId) => {
        const state = get();
        const record = state.records[category].find((r) => r.id === recordId);
        const recordName = record?.data.name || record?.data.key || "Record";

        const updatedRecords = {
          ...state.records,
          [category]: state.records[category].filter((r) => r.id !== recordId),
        };

        const updatedCategories = state.categories.map((cat) =>
          cat.id === category
            ? { ...cat, recordCount: cat.recordCount - 1, lastUpdated: "Just now" }
            : cat
        );

        const newVersionId = `v${getNextVersion(state.versions)}`;

        const newVersion: DataVersion = {
          id: newVersionId,
          version: getNextVersion(state.versions),
          createdAt: formatTimestamp(),
          description: `${recordName} deleted`,
          changes: [{ type: "delete", category, count: 1, detail: `${recordName} deleted` }],
          snapshot: {
            categories: Object.fromEntries(updatedCategories.map((c) => [c.id, c.recordCount])) as Record<DataCategoryType, number>,
            totalRecords: updatedCategories.reduce((sum, c) => sum + c.recordCount, 0),
          },
        };

        set({
          records: updatedRecords,
          categories: updatedCategories,
          activeVersionId: newVersionId,
          versions: [newVersion, ...state.versions],
          recentChanges: [
            { id: newChangeId(), description: `${recordName} deleted`, timestamp: formatTimestamp(), category },
            ...state.recentChanges,
          ],
        });
      },

      addBusinessInfo: (key, value) => {
        const state = get();
        const newRecord: DataRecord = {
          id: `info-${Date.now()}`,
          categoryId: "business-info",
          data: { key, value },
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };

        const updatedRecords = {
          ...state.records,
          "business-info": [...state.records["business-info"], newRecord],
        };

        const updatedCategories = state.categories.map((cat) =>
          cat.id === "business-info"
            ? { ...cat, recordCount: cat.recordCount + 1, lastUpdated: "Just now" }
            : cat
        );

        const newVersionId = `v${getNextVersion(state.versions)}`;
        const newVersion: DataVersion = {
          id: newVersionId,
          version: getNextVersion(state.versions),
          createdAt: formatTimestamp(),
          description: `${key} added`,
          changes: [{ type: "add", category: "business-info", detail: `${key} added to business context` }],
          snapshot: {
            categories: Object.fromEntries(updatedCategories.map((c) => [c.id, c.recordCount])) as Record<DataCategoryType, number>,
            totalRecords: updatedCategories.reduce((sum, c) => sum + c.recordCount, 0),
          },
        };

        set({
          records: updatedRecords,
          categories: updatedCategories,
          activeVersionId: newVersionId,
          versions: [newVersion, ...state.versions],
          recentChanges: [
            { id: newChangeId(), description: `${key} added`, timestamp: formatTimestamp(), category: "business-info" },
            ...state.recentChanges,
          ],
        });
      },

      getCategoryRecords: (category) => {
        return get().records[category] || [];
      },

      getTotalRecords: () => {
        const state = get();
        return state.categories.reduce((sum, cat) => sum + cat.recordCount, 0);
      },
    }),
    {
      name: "thalamus-data-storage",
      partialize: (state) => ({
        activeVersionId: state.activeVersionId,
        versions: state.versions,
        categories: state.categories,
        records: state.records,
        recentChanges: state.recentChanges.slice(0, 20),
      }),
      skipHydration: true,
    }
  )
);

// Rehydrate on client side
if (typeof window !== "undefined") {
  useDataStore.persist.rehydrate();
}
