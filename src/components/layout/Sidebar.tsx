"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, ChevronLeft, CheckCircle } from "lucide-react";
import { navigation } from "@/data/navigation";
import { useAppStore } from "@/store/app.store";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, language } = useAppStore();
  const { t } = useTranslation();

  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-full border-r border-border bg-surface",
        "flex flex-col transition-all duration-300",
        "hidden lg:flex",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
          <Brain className="h-4 w-4 text-accent-foreground" />
        </div>
        {!sidebarCollapsed && (
          <span className="font-semibold text-foreground">
            THALAMUS <span className="text-accent">AI</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigation.map((group) => (
          <div key={group.id} className="mb-6">
            {!sidebarCollapsed && (
              <div className="mb-2 px-4">
                <span className="text-xs font-medium uppercase tracking-wider text-foreground-subtle">
                  {t(group.labelKey)}
                </span>
              </div>
            )}
            <ul className="space-y-1 px-2">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                const translated = t(item.labelKey);

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                        "hover:bg-surface-elevated",
                        isActive && "bg-accent-soft text-accent",
                        !isActive && "text-foreground-muted hover:text-foreground",
                        sidebarCollapsed && "justify-center px-0"
                      )}
                      title={sidebarCollapsed ? translated : undefined}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-accent")} />
                      {!sidebarCollapsed && (
                        <span className={cn("text-sm font-medium", bengaliClass)}>
                          {translated}
                        </span>
                      )}
                      {isActive && !sidebarCollapsed && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Status */}
      <div className="border-t border-border p-4">
        {!sidebarCollapsed ? (
          <div className="rounded-lg bg-surface-elevated p-3">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-xs font-medium text-foreground">
                Thalamus Status
              </span>
            </div>
            <p className="text-xs text-foreground-muted">All systems operational</p>
            <p className="mt-1 text-xs text-foreground-subtle">Updated 2 min ago</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <CheckCircle className="h-4 w-4 text-success" />
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "absolute -right-3 top-20 z-50",
          "flex h-6 w-6 items-center justify-center",
          "rounded-full border border-border bg-surface shadow-sm",
          "text-foreground-muted hover:text-foreground",
          "transition-transform hover:scale-110"
        )}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          className={cn(
            "h-3 w-3 transition-transform",
            sidebarCollapsed && "rotate-180"
          )}
        />
      </button>
    </aside>
  );
}
