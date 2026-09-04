"use client";

import { useState } from "react";
import { X, Upload, CheckCircle, Loader2 } from "lucide-react";
import { useDataStore, type DataCategoryType } from "@/store/data.store";
import { cn } from "@/lib/utils";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

type UploadStage = "select" | "uploading" | "processing" | "detected" | "complete";

const stageLabels: Record<UploadStage, string> = {
  select: "Select file",
  uploading: "Uploading...",
  processing: "Processing file...",
  detected: "Records detected",
  complete: "Upload complete",
};

const mockDetectedData = {
  products: { count: 24, category: "products" as DataCategoryType },
  customers: { count: 156, category: "customers" as DataCategoryType },
};

export function UploadModal({ open, onClose }: UploadModalProps) {
  const { addRecord } = useDataStore();
  const [stage, setStage] = useState<UploadStage>("select");
  const [selectedType, setSelectedType] = useState<"products" | "customers">("products");
  const [dragOver, setDragOver] = useState(false);
  const [lastOpenState, setLastOpenState] = useState(open);

  if (lastOpenState !== open) {
    setLastOpenState(open);
    if (!open) {
      setStage("select");
      setSelectedType("products");
    }
  }

  const simulateUpload = async () => {
    setStage("uploading");
    await new Promise((r) => setTimeout(r, 1200));
    
    setStage("processing");
    await new Promise((r) => setTimeout(r, 1500));
    
    setStage("detected");
  };

  const handleFileSelect = () => {
    simulateUpload();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    simulateUpload();
  };

  const handleConfirmImport = async () => {
    const detected = mockDetectedData[selectedType];
    
    // Add mock records
    for (let i = 0; i < Math.min(detected.count, 5); i++) {
      addRecord(detected.category, {
        name: `Imported ${selectedType === "products" ? "Product" : "Customer"} ${i + 1}`,
        source: "CSV Upload",
        importedAt: new Date().toISOString(),
      });
    }
    
    setStage("complete");
    await new Promise((r) => setTimeout(r, 1000));
    onClose();
  };

  if (!open) return null;

  const detected = mockDetectedData[selectedType];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4">
        <div className="glass rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Upload Data</h2>
            <button onClick={onClose} className="text-foreground-muted hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {stage === "select" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Data type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as "products" | "customers")}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-elevated border border-border text-foreground"
                  >
                    <option value="products">Products</option>
                    <option value="customers">Customers</option>
                  </select>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={handleFileSelect}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                    dragOver ? "border-accent bg-accent-soft" : "border-border hover:border-foreground-subtle"
                  )}
                >
                  <Upload className="h-10 w-10 text-foreground-muted mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-1">Drop your file here</p>
                  <p className="text-sm text-foreground-muted">or click to browse</p>
                  <p className="text-xs text-foreground-subtle mt-2">CSV, Excel, JSON supported</p>
                </div>
              </>
            )}

            {(stage === "uploading" || stage === "processing") && (
              <div className="py-8 text-center">
                <Loader2 className="h-10 w-10 text-accent mx-auto mb-4 animate-spin" />
                <p className="text-foreground font-medium">{stageLabels[stage]}</p>
                <p className="text-sm text-foreground-muted mt-1">This will not take long...</p>
              </div>
            )}

            {stage === "detected" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-success-soft border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium text-foreground">Records detected</span>
                  </div>
                  <p className="text-2xl font-semibold text-foreground">{detected.count}</p>
                  <p className="text-sm text-foreground-muted">{selectedType} ready to import</p>
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
                    Add to business data
                  </button>
                </div>
              </div>
            )}

            {stage === "complete" && (
              <div className="py-8 text-center">
                <CheckCircle className="h-10 w-10 text-success mx-auto mb-4" />
                <p className="text-foreground font-medium">Upload complete</p>
                <p className="text-sm text-foreground-muted mt-1">Data has been added to your business context</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
