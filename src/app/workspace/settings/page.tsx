"use client";

import { useState } from "react";
import {
  User,
  Building2,
  Palette,
  Bell,
  Shield,
  CreditCard,
  Info,
  ChevronRight
} from "lucide-react";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { WorkspaceSettings } from "@/components/settings/WorkspaceSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { SubscriptionSettings } from "@/components/settings/SubscriptionSettings";
import { AboutSection } from "@/components/settings/AboutSection";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

type SettingsSection = "account" | "workspace" | "appearance" | "notifications" | "privacy" | "subscription" | "about";

const sections: { id: SettingsSection; labelKey: string; icon: React.ElementType }[] = [
  { id: "account", labelKey: "settings.tabAccount", icon: User },
  { id: "workspace", labelKey: "settings.tabWorkspace", icon: Building2 },
  { id: "appearance", labelKey: "settings.tabAppearance", icon: Palette },
  { id: "notifications", labelKey: "settings.tabNotifications", icon: Bell },
  { id: "privacy", labelKey: "settings.tabPrivacy", icon: Shield },
  { id: "subscription", labelKey: "settings.tabSubscription", icon: CreditCard },
  { id: "about", labelKey: "settings.tabAbout", icon: Info },
];

export default function SettingsPage() {
  const { t } = useTranslation();
  const isBn = useAppStore((s) => s.language) === "bn";
  const [activeSection, setActiveSection] = useState<SettingsSection>("account");

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings />;
      case "workspace":
        return <WorkspaceSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <PrivacySettings />;
      case "subscription":
        return <SubscriptionSettings />;
      case "about":
        return <AboutSection />;
    }
  };

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className={cn("text-2xl font-semibold text-foreground mb-2", isBn && "lang-bn")}>
            {t("settings.tabSettings")}
          </h1>
          <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
            {t("settings.subtitle")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <nav className="lg:w-56 shrink-0">
            <div className="glass rounded-xl p-2 lg:sticky lg:top-20">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-accent-soft text-accent"
                        : "text-foreground-muted hover:text-foreground hover:bg-surface-elevated"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className={cn("font-medium", isBn && "lang-bn")}>{t(section.labelKey)}</span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
