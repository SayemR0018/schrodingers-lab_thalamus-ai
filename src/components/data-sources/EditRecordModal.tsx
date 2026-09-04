"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDataStore, type DataCategoryType, type DataRecord } from "@/store/data.store";
import { cn } from "@/lib/utils";

interface EditRecordModalProps {
  record: DataRecord;
  category: DataCategoryType;
  onClose: () => void;
}

export function EditRecordModal({ record, category, onClose }: EditRecordModalProps) {
  const { updateRecord } = useDataStore();
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>(record.data);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));
    updateRecord(category, record.id, formData);
    setIsSubmitting(false);
    onClose();
  };

  const fields = Object.keys(record.data);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4">
        <div className="glass rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Edit Record</h2>
            <button onClick={onClose} className="text-foreground-muted hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {fields.map((field) => {
              const value = formData[field];
              const isNumber = typeof record.data[field] === "number";

              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-foreground mb-1.5 capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type={isNumber ? "number" : "text"}
                    value={String(value)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field]: isNumber ? Number(e.target.value) : e.target.value,
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
              );
            })}

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
