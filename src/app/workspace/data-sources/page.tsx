"use client";

import { useState } from "react";
import {
  Package,
  Users,
  ShoppingCart,
  Warehouse,
  Truck,
  FileText,
  Shield,
  Building2,
  Plus,
  Upload,
  Download,
  CheckCircle,
} from "lucide-react";
import { useDataStore, type DataCategoryType } from "@/store/data.store";
import { DataCategoryCard } from "@/components/data-sources/DataCategoryCard";
import { VersionHistory } from "@/components/data-sources/VersionHistory";
import { RecentChanges } from "@/components/data-sources/RecentChanges";
import { AddDataModal } from "@/components/data-sources/AddDataModal";
import { DataDetailDrawer } from "@/components/data-sources/DataDetailDrawer";
import { UploadModal } from "@/components/data-sources/UploadModal";
import { ImportModal } from "@/components/data-sources/ImportModal";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Package,
  Users,
  ShoppingCart,
  Warehouse,
  Truck,
  FileText,
  Shield,
  Building2,
};

export default function DataSourcesPage() {
  const { categories, getActiveVersion, getTotalRecords } = useDataStore();
  const { t } = useTranslation();
  const isBn = useAppStore((s) => s.language) === "bn";
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DataCategoryType | null>(null);

  const activeVersion = getActiveVersion();
  const totalRecords = getTotalRecords();

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className={cn("text-2xl font-semibold text-foreground mb-2", isBn && "lang-bn")}>
                {t("dataSources.title")}
              </h1>
              <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
                {t("dataSources.subtitle")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                <span className={isBn ? "lang-bn" : undefined}>{t("common.add")}</span>
              </button>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-sm font-medium text-foreground-muted"
              >
                <Upload className="h-4 w-4" />
                <span className={isBn ? "lang-bn" : undefined}>{t("dataSources.tabUpload")}</span>
              </button>
              <button
                onClick={() => setImportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-sm font-medium text-foreground-muted"
              >
                <Download className="h-4 w-4" />
                <span className={isBn ? "lang-bn" : undefined}>{t("common.import")}</span>
              </button>
            </div>
          </div>

          {/* Version Indicator */}
          {activeVersion && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-elevated">
                <CheckCircle className="h-3.5 w-3.5 text-success" />
                <span className="text-foreground-muted">Business Context</span>
                <span className="font-medium text-foreground">v{activeVersion.version}</span>
              </div>
              <span className="text-foreground-subtle">•</span>
              <span className="text-foreground-muted">{totalRecords.toLocaleString()} total records</span>
              <span className="text-foreground-subtle">•</span>
              <span className="text-foreground-subtle">Updated {activeVersion.createdAt}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Data Categories */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Dataset */}
            <div>
              <h2 className="text-sm font-medium text-foreground-subtle uppercase tracking-wider mb-4">
                Current Dataset
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((category) => {
                  const Icon = iconMap[category.icon] || Package;
                  return (
                    <DataCategoryCard
                      key={category.id}
                      category={category}
                      icon={Icon}
                      onClick={() => setSelectedCategory(category.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Version History & Recent Changes */}
          <div className="space-y-6">
            <VersionHistory />
            <RecentChanges />
          </div>
        </div>
      </div>

      {/* Add Data Modal */}
      <AddDataModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Data Detail Drawer */}
      <DataDetailDrawer
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />

      {/* Upload Modal */}
      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      {/* Import Modal */}
      <ImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />
    </div>
  );
}
