"use client";

import { useState, useEffect } from "react";
import { X, Building2, Globe } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { cn } from "@/lib/utils";

interface AddWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddWorkspaceModal({ open, onClose }: AddWorkspaceModalProps) {
  const { addWorkspace } = useUserStore();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("E-commerce");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOpenState, setLastOpenState] = useState(open);

  if (lastOpenState !== open) {
    setLastOpenState(open);
    if (!open) {
      setName("");
      setIndustry("E-commerce");
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

  const handleSubmit = async () => {
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));
    addWorkspace(name.trim(), industry);
    setIsSubmitting(false);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4">
        <div className="glass rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Add Workspace</h2>
            <button onClick={onClose} className="text-foreground-muted hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Workspace name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Business"
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-lg",
                    "bg-surface-elevated border border-border",
                    "text-foreground placeholder:text-foreground-subtle",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Industry
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-lg appearance-none",
                    "bg-surface-elevated border border-border",
                    "text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  )}
                >
                  <option>E-commerce</option>
                  <option>Retail</option>
                  <option>SaaS</option>
                  <option>Manufacturing</option>
                  <option>Services</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || isSubmitting}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  name.trim() && !isSubmitting
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-surface-elevated text-foreground-subtle cursor-not-allowed"
                )}
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
