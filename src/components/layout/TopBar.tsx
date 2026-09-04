"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, PanelRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { SearchDialog } from "./SearchDialog";
import { NotificationsPanel } from "./NotificationsPanel";
import { ProfileMenu } from "./ProfileMenu";
import { useAppStore } from "@/store/app.store";
import { useUserStore } from "@/store/user.store";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, assistantCollapsed, toggleAssistant, language } = useAppStore();
  const { currentUser } = useUserStore();
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Determine page title from pathname (localized)
  const pageTitleKey: Record<string, string> = {
    "/workspace": "nav.overview",
    "/workspace/brain": "nav.businessBrain",
    "/workspace/ask": "nav.askThalamus",
    "/workspace/reports": "nav.reports",
    "/workspace/workforce": "nav.workforce",
    "/workspace/insights": "nav.insights",
    "/workspace/approvals": "nav.approvals",
    "/workspace/activity": "nav.activity",
    "/workspace/integrations": "nav.integrations",
    "/workspace/data-sources": "nav.dataSources",
    "/workspace/settings": "nav.settings",
  };
  const pageTitle = title || (pageTitleKey[pathname] ? t(pageTitleKey[pathname]) : "Thalamus");

  // Notification count (mock)
  const unreadCount = 2;

  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-30 h-14 border-b border-border bg-surface/80 backdrop-blur-sm",
          "items-center justify-between px-4",
          "hidden lg:flex",
          "transition-all duration-300",
          sidebarCollapsed ? "left-16" : "left-60",
          assistantCollapsed ? "right-0" : "right-[340px]"
        )}
      >
        {/* Left: Title */}
        <div className="flex items-center gap-4">
          <h1 className={cn("text-lg font-semibold text-foreground", bengaliClass)}>{pageTitle}</h1>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              "w-full rounded-lg border border-border bg-surface-elevated",
              "py-2 px-4 text-sm text-left",
              "text-foreground-subtle",
              "hover:bg-surface-elevated hover:border-foreground-subtle",
              "transition-colors flex items-center gap-3"
            )}
          >
            <Search className="h-4 w-4" />
            <span className={cn("flex-1", bengaliClass)}>{t("topbar.searchPlaceholder")}</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface text-xs text-foreground-subtle">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 relative">
          <LanguageToggle size="sm" />
          <ThemeToggle />

          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg relative",
              "text-foreground-muted hover:text-foreground",
              "hover:bg-surface-elevated transition-colors",
              notificationsOpen && "bg-surface-elevated text-foreground"
            )}
            aria-label={t("topbar.notifications")}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationsPanel
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />

          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className={cn(
                "flex h-9 items-center gap-2 px-2 rounded-lg",
                "text-foreground-muted hover:text-foreground",
                "hover:bg-surface-elevated transition-colors",
                profileOpen && "bg-surface-elevated text-foreground"
              )}
              aria-label={t("topbar.profile")}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-accent text-xs font-semibold">
                {currentUser?.initials || "FH"}
              </div>
            </button>
            <ProfileMenu
              open={profileOpen}
              onClose={() => setProfileOpen(false)}
            />
          </div>

          <div className="mx-2 h-6 w-px bg-border" />

          <button
            onClick={toggleAssistant}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              "transition-colors",
              assistantCollapsed
                ? "text-accent bg-accent-soft hover:bg-accent-muted"
                : "text-foreground-muted hover:text-foreground hover:bg-surface-elevated"
            )}
            aria-label={assistantCollapsed ? t("topbar.showAssistant") : t("topbar.hideAssistant")}
          >
            <PanelRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
