"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { useDataStore } from "@/store/data.store";
import { cn } from "@/lib/utils";

export function VersionHistory() {
  const { versions, activeVersionId, switchVersion, restoreVersion } = useDataStore();
  const [confirmAction, setConfirmAction] = useState<{ type: "switch" | "restore"; versionId: string } | null>(null);

  const handleAction = () => {
    if (!confirmAction) return;
    
    if (confirmAction.type === "switch") {
      switchVersion(confirmAction.versionId);
    } else {
      restoreVersion(confirmAction.versionId);
    }
    setConfirmAction(null);
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-4 w-4 text-foreground-muted" />
        <h3 className="font-medium text-foreground">Version History</h3>
      </div>

      <div className="space-y-3">
        {versions.slice(0, 5).map((version) => {
          const isActive = version.id === activeVersionId;

          return (
            <div
              key={version.id}
              className={cn(
                "p-3 rounded-lg",
                isActive ? "bg-accent-soft border border-accent/20" : "bg-surface-elevated"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">v{version.version}</span>
                  {isActive && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-accent text-accent-foreground">
                      Active
                    </span>
                  )}
                </div>
                <span className="text-xs text-foreground-subtle">{version.createdAt}</span>
              </div>

              <div className="text-xs text-foreground-muted mb-2">
                {version.changes.map((change, i) => (
                  <span key={i}>
                    {i > 0 && " • "}
                    {change.detail}
                  </span>
                ))}
              </div>

              {!isActive && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmAction({ type: "switch", versionId: version.id })}
                    className="text-xs text-accent hover:underline"
                  >
                    Switch to this version
                  </button>
                  <span className="text-foreground-subtle">•</span>
                  <button
                    onClick={() => setConfirmAction({ type: "restore", versionId: version.id })}
                    className="text-xs text-foreground-muted hover:text-foreground"
                  >
                    Restore
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setConfirmAction(null)} />
          <div className="relative glass rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {confirmAction.type === "switch" ? "Switch active version?" : "Restore version?"}
            </h3>
            <p className="text-sm text-foreground-muted mb-4">
              {confirmAction.type === "switch"
                ? `The workspace will use the business data captured in v${versions.find((v) => v.id === confirmAction.versionId)?.version}.`
                : `This will create a new version based on v${versions.find((v) => v.id === confirmAction.versionId)?.version}. Version history will be preserved.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className="flex-1 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium"
              >
                {confirmAction.type === "switch" ? "Switch version" : "Restore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
