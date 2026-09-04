"use client";

import { useState, useEffect } from "react";
import { X, Package, Users, Warehouse, Truck, FileText, Shield, Building2 } from "lucide-react";
import { useDataStore, type DataCategoryType } from "@/store/data.store";
import { cn } from "@/lib/utils";

interface AddDataModalProps {
  open: boolean;
  onClose: () => void;
}

const dataTypes: { id: DataCategoryType; name: string; icon: React.ElementType }[] = [
  { id: "business-info", name: "Business Information", icon: Building2 },
  { id: "products", name: "Product", icon: Package },
  { id: "customers", name: "Customer", icon: Users },
  { id: "inventory", name: "Inventory", icon: Warehouse },
  { id: "suppliers", name: "Supplier", icon: Truck },
  { id: "policies", name: "Policy", icon: Shield },
  { id: "documents", name: "Document", icon: FileText },
];

const formFields: Record<DataCategoryType, { key: string; label: string; type: "text" | "number" }[]> = {
  products: [
    { key: "name", label: "Product name", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "price", label: "Price", type: "number" },
    { key: "inventory", label: "Inventory", type: "number" },
    { key: "supplier", label: "Supplier", type: "text" },
  ],
  customers: [
    { key: "name", label: "Customer name", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "segment", label: "Segment", type: "text" },
  ],
  inventory: [
    { key: "sku", label: "SKU", type: "text" },
    { key: "product", label: "Product", type: "text" },
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "reorderPoint", label: "Reorder point", type: "number" },
    { key: "location", label: "Location", type: "text" },
  ],
  suppliers: [
    { key: "name", label: "Supplier name", type: "text" },
    { key: "contact", label: "Contact email", type: "text" },
    { key: "leadTime", label: "Lead time", type: "text" },
  ],
  policies: [
    { key: "name", label: "Policy name", type: "text" },
    { key: "description", label: "Description", type: "text" },
    { key: "status", label: "Status", type: "text" },
  ],
  documents: [
    { key: "name", label: "Document name", type: "text" },
    { key: "type", label: "Type", type: "text" },
  ],
  "business-info": [
    { key: "key", label: "Information type", type: "text" },
    { key: "value", label: "Value", type: "text" },
  ],
  orders: [],
};

export function AddDataModal({ open, onClose }: AddDataModalProps) {
  const { addRecord } = useDataStore();
  const [step, setStep] = useState<"type" | "form">("type");
  const [selectedType, setSelectedType] = useState<DataCategoryType | null>(null);
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOpenState, setLastOpenState] = useState(open);

  // Reset on close (track previous open state)
  if (lastOpenState !== open) {
    setLastOpenState(open);
    if (!open) {
      setStep("type");
      setSelectedType(null);
      setFormData({});
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleSelectType = (type: DataCategoryType) => {
    setSelectedType(type);
    setFormData({});
    setStep("form");
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    
    setIsSubmitting(true);
    
    // Simulate a brief delay
    await new Promise((r) => setTimeout(r, 300));
    
    addRecord(selectedType, formData);
    setIsSubmitting(false);
    onClose();
  };

  if (!open) return null;

  const fields = selectedType ? formFields[selectedType] : [];
  const isFormValid = fields.every((f) => formData[f.key] !== undefined && formData[f.key] !== "");

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4">
        <div className="glass rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              {step === "type" ? "Add Business Data" : `Add ${dataTypes.find((t) => t.id === selectedType)?.name}`}
            </h2>
            <button onClick={onClose} className="text-foreground-muted hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "type" ? (
              <div className="space-y-2">
                <p className="text-sm text-foreground-muted mb-4">Choose the type of data to add:</p>
                {dataTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleSelectType(type.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-elevated transition-colors text-left"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated">
                        <Icon className="h-5 w-5 text-foreground-muted" />
                      </div>
                      <span className="font-medium text-foreground">{type.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={formData[field.key] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                        })
                      }
                      className={cn(
                        "w-full px-4 py-2.5 rounded-lg",
                        "bg-surface-elevated border border-border",
                        "text-foreground placeholder:text-foreground-subtle",
                        "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      )}
                    />
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setStep("type")}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isSubmitting}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isFormValid && !isSubmitting
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "bg-surface-elevated text-foreground-subtle cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? "Adding..." : "Add data"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
