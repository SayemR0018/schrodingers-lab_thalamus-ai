"use client";

import { MessageSquare, X } from "lucide-react";
import { useAppStore } from "@/store/app.store";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { cn } from "@/lib/utils";

export function MobileAssistant() {
  const { assistantCollapsed, toggleAssistant } = useAppStore();

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleAssistant}
        className={cn(
          "fixed bottom-4 right-4 z-50 lg:hidden",
          "flex h-14 w-14 items-center justify-center rounded-full",
          "bg-accent text-accent-foreground shadow-lg",
          "hover:bg-accent/90 transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          !assistantCollapsed && "bg-surface border border-border text-foreground"
        )}
        aria-label={assistantCollapsed ? "Open assistant" : "Close assistant"}
      >
        {assistantCollapsed ? (
          <MessageSquare className="h-6 w-6" />
        ) : (
          <X className="h-6 w-6" />
        )}
      </button>

      {/* Backdrop */}
      {!assistantCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={toggleAssistant}
        />
      )}

      {/* Slide-up Panel */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 lg:hidden",
          "h-[80vh] rounded-t-2xl border-t border-border bg-surface shadow-2xl",
          "transform transition-transform duration-300 ease-in-out",
          assistantCollapsed ? "translate-y-full" : "translate-y-0"
        )}
      >
        {/* Handle */}
        <div className="flex justify-center py-2 cursor-grab active:cursor-grabbing" onClick={toggleAssistant}>
          <div className="h-1 w-12 rounded-full bg-border" />
        </div>
        <div className="h-[calc(80vh-32px)] overflow-y-auto overscroll-contain">
          <AssistantPanel />
        </div>
      </div>
    </>
  );
}
