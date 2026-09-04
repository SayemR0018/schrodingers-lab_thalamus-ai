"use client";

import { useState } from "react";
import { X, FileSpreadsheet, ShoppingBag, Database, CheckCircle, Loader2 } from "lucide-react";
import { useDataStore } from "@/store/data.store";

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
}

type ImportStage = "select" | "connecting" | "syncing" | "mapping" | "detected" | "complete";

const sources = [
  { id: "sheets", name: "Google Sheets", icon: FileSpreadsheet, records: 248 },
  { id: "shopify", name: "Shopify", icon: ShoppingBag, records: 1847 },
  { id: "database", name: "External Database", icon: Database, records: 5200 },
];

const stageMessages: Record<ImportStage, string> = {
  select: "",
  connecting: "Connecting to source...",
  syncing: "Syncing data...",
  mapping: "Mapping to business context...",
  detected: "",
  complete: "Import complete",
};

export function ImportModal({ open, onClose }: ImportModalProps) {
  const { addRecord } = useDataStore();
  const [stage, setStage] = useState<ImportStage>("select");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [lastOpenState, setLastOpenState] = useState(open);

  if (lastOpenState !== open) {
    setLastOpenState(open);
    if (!open) {
      setStage("select");
      setSelectedSource(null);
    }
  }

  const handleSelectSource = async (sourceId: string) => {
    setSelectedSource(sourceId);
    
    setStage("connecting");
    await new Promise((r) => setTimeout(r, 1000));
    
    setStage("syncing");
    await new Promise((r) => setTimeout(r, 1500));
    
    setStage("mapping");
    await new Promise((r) => setTimeout(r, 1200));
    
    setStage("detected");
  };

  const handleConfirmImport = async () => {
    const source = sources.find((s) => s.id === selectedSource);
    if (!source) return;

    // Add mock records
    for (let i = 0; i < Math.min(5, source.records); i++) {
      addRecord("products", {
        name: `${source.name} Product ${i + 1}`,
        source: source.name,
        importedAt: new Date().toISOString(),
      });
    }
    
    setStage("complete");
    await new Promise((r) => setTimeout(r, 1000));
    onClose();
  };

  if (!open) return null;

  const selectedSourceData = sources.find((s) => s.id === selectedSource);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4">
        <div className="glass rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Import Data</h2>
            <button onClick={onClose} className="text-foreground-muted hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {stage === "select" && (
              <div className="space-y-3">
                <p className="text-sm text-foreground-muted mb-4">Select a data source to import from:</p>
                {sources.map((source) => {
                  const Icon = source.icon;
                  return (
                    <button
                      key={source.id}
                      onClick={() => handleSelectSource(source.id)}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-surface-elevated hover:bg-border transition-colors text-left"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                        <Icon className="h-5 w-5 text-foreground-muted" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{source.name}</p>
                        <p className="text-xs text-foreground-muted">~{source.records.toLocaleString()} records available</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {(stage === "connecting" || stage === "syncing" || stage === "mapping") && (
              <div className="py-8 text-center">
                <Loader2 className="h-10 w-10 text-accent mx-auto mb-4 animate-spin" />
                <p className="text-foreground font-medium">{stageMessages[stage]}</p>
                {selectedSourceData && (
                  <p className="text-sm text-foreground-muted mt-1">
                    {selectedSourceData.name}
                  </p>
                )}
              </div>
            )}

            {stage === "detected" && selectedSourceData && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-success-soft border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium text-foreground">Data ready</span>
                  </div>
                  <p className="text-2xl font-semibold text-foreground">
                    {selectedSourceData.records.toLocaleString()}
                  </p>
                  <p className="text-sm text-foreground-muted">
                    records from {selectedSourceData.name}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium"
                  >
                    Import data
                  </button>
                </div>
              </div>
            )}

            {stage === "complete" && (
              <div className="py-8 text-center">
                <CheckCircle className="h-10 w-10 text-success mx-auto mb-4" />
                <p className="text-foreground font-medium">Import complete</p>
                <p className="text-sm text-foreground-muted mt-1">
                  Data has been added to your business context
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
