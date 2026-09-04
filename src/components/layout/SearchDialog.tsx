"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileBarChart, Lightbulb, Users, Clock, Package } from "lucide-react";
import { mockReports } from "@/data/mock/reports";
import { mockInsights } from "@/data/mock/insights";
import { mockAgents } from "@/data/mock/agents";
import { useDataStore } from "@/store/data.store";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

type SearchResult = {
  id: string;
  title: string;
  type: "report" | "insight" | "agent" | "page" | "product";
  href: string;
  subtitle?: string;
};

const defaultResults: SearchResult[] = [
  { id: "page-brain", title: "Business Brain", type: "page", href: "/workspace/brain" },
  { id: "page-insights", title: "Insights", type: "page", href: "/workspace/insights" },
  { id: "page-approvals", title: "Approvals", type: "page", href: "/workspace/approvals" },
];

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter();
  const { records } = useDataStore();
  const [query, setQuery] = useState("");

  // Close on escape
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

  // Compute results with useMemo instead of useEffect + setState
  const results = useMemo(() => {
    if (!query.trim()) {
      return defaultResults;
    }

    const q = query.toLowerCase();
    const found: SearchResult[] = [];

    // Search reports
    mockReports.forEach((r) => {
      if (r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q)) {
        found.push({
          id: r.id,
          title: r.title,
          type: "report",
          href: `/workspace/reports/${r.id}`,
          subtitle: r.generatedAt,
        });
      }
    });

    // Search insights
    mockInsights.forEach((i) => {
      if (i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q)) {
        found.push({
          id: i.id,
          title: i.title,
          type: "insight",
          href: `/workspace/insights/${i.id}`,
          subtitle: i.category,
        });
      }
    });

    // Search agents
    mockAgents.forEach((a) => {
      if (a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)) {
        found.push({
          id: a.id,
          title: a.name,
          type: "agent",
          href: `/workspace/workforce/${a.id}`,
          subtitle: a.status,
        });
      }
    });

    // Search products/entities from data store
    records.products.forEach((p) => {
      const name = String(p.data.name || "");
      const category = String(p.data.category || "");
      if (name.toLowerCase().includes(q) || category.toLowerCase().includes(q)) {
        found.push({
          id: p.id,
          title: name,
          type: "product",
          href: "/workspace/data-sources",
          subtitle: category,
        });
      }
    });

    return found.slice(0, 10);
  }, [query, records]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    onClose();
    setQuery("");
  };

  if (!open) return null;

  const typeIcons = {
    report: FileBarChart,
    insight: Lightbulb,
    agent: Users,
    page: Clock,
    product: Package,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 p-4">
        <div className="glass rounded-xl overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="h-5 w-5 text-foreground-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports, insights, agents..."
              className="flex-1 bg-transparent text-foreground placeholder:text-foreground-subtle focus:outline-none"
              autoFocus
            />
            <button onClick={onClose}>
              <X className="h-5 w-5 text-foreground-muted hover:text-foreground" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-6 text-center text-foreground-muted">
                No results found
              </div>
            ) : (
              <ul>
                {results.map((result) => {
                  const Icon = typeIcons[result.type];
                  return (
                    <li key={result.id}>
                      <button
                        onClick={() => handleSelect(result)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-elevated transition-colors text-left"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated">
                          <Icon className="h-4 w-4 text-foreground-muted" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {result.title}
                          </p>
                          {result.subtitle && (
                            <p className="text-xs text-foreground-muted capitalize">
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-foreground-subtle capitalize">
                          {result.type}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border text-xs text-foreground-subtle">
            Press <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated">↵</kbd> to select,{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated">Esc</kbd> to close
          </div>
        </div>
      </div>
    </>
  );
}
