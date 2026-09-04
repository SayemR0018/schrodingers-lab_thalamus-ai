"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { MobileAssistant } from "./MobileAssistant";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  title?: string;
}

export function AppShell({ children, rightPanel, title }: AppShellProps) {
  const { sidebarCollapsed, assistantCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation */}
      <Sidebar />
      <TopBar title={title} />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          "pt-14 lg:pt-14",
          "lg:pl-60",
          sidebarCollapsed && "lg:pl-16",
          !assistantCollapsed && rightPanel && "lg:pr-[340px]"
        )}
      >
        {children}
      </main>

      {/* Desktop Right Panel (Assistant) */}
      {rightPanel && (
        <aside
          className={cn(
            "fixed right-0 top-0 z-30 h-full w-[340px] border-l border-border",
            "bg-surface transition-transform duration-300",
            "hidden lg:block",
            assistantCollapsed ? "translate-x-full" : "translate-x-0"
          )}
        >
          {rightPanel}
        </aside>
      )}

      {/* Mobile Assistant */}
      <MobileAssistant />
    </div>
  );
}
