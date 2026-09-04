"use client";

import { Clock, Package, Users, ShoppingCart, Warehouse, Truck, FileText, Shield, Building2 } from "lucide-react";
import { useDataStore, type DataCategoryType } from "@/store/data.store";

const iconMap: Record<DataCategoryType, React.ElementType> = {
  products: Package,
  customers: Users,
  orders: ShoppingCart,
  inventory: Warehouse,
  suppliers: Truck,
  documents: FileText,
  policies: Shield,
  "business-info": Building2,
};

export function RecentChanges() {
  const { recentChanges } = useDataStore();

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-foreground-muted" />
        <h3 className="font-medium text-foreground">Recent Changes</h3>
      </div>

      <div className="space-y-3">
        {recentChanges.slice(0, 6).map((change, index) => {
          const Icon = change.category ? iconMap[change.category] : Clock;
          // Defensive: fall back to the index if a duplicate id ever slips
          // through (e.g. stale localStorage state). This keeps React happy
          // without dropping rows from the visible list.
          const key = change.id ? `${change.id}-${index}` : `change-${index}`;

          return (
            <div key={key} className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-surface-elevated mt-0.5">
                <Icon className="h-3 w-3 text-foreground-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{change.description}</p>
                <p className="text-xs text-foreground-subtle">{change.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
