"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Brain, Building2, Plug, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  titleKey: string;
  subtitleKey: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    id: "welcome",
    titleKey: "onboarding.greeting",
    subtitleKey: "onboarding.welcomeSubtitle",
    icon: Brain,
  },
  {
    id: "business",
    titleKey: "onboarding.step1Title",
    subtitleKey: "onboarding.step1Body",
    icon: Building2,
  },
  {
    id: "integrations",
    titleKey: "onboarding.step2Title",
    subtitleKey: "onboarding.step2Body",
    icon: Plug,
  },
  {
    id: "complete",
    titleKey: "onboarding.step3Title",
    subtitleKey: "onboarding.step3Body",
    icon: CheckCircle,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const isBn = useAppStore((s) => s.language) === "bn";
  const { onboardingCompleted, completeOnboarding, getActiveWorkspace } = useUserStore();
  const activeWorkspace = getActiveWorkspace();

  const [currentStep, setCurrentStep] = useState(0);
  const [businessName, setBusinessName] = useState(activeWorkspace?.name || "");
  const [industry, setIndustry] = useState(activeWorkspace?.industry || "E-commerce");

  useEffect(() => {
    if (onboardingCompleted) {
      router.replace("/workspace/brain");
    }
  }, [onboardingCompleted, router]);

  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding(businessName || "Demo Commerce", industry);
      router.push("/workspace/brain");
    }
  };

  const handleSkip = () => {
    completeOnboarding(businessName || "Demo Commerce", industry);
    router.push("/workspace/brain");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "h-1.5 w-12 rounded-full transition-colors",
                i <= currentStep ? "bg-accent" : "bg-surface-elevated"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="glass rounded-2xl p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft mx-auto mb-6">
            <Icon className="h-8 w-8 text-accent" />
          </div>

          <h1 className={cn("text-2xl font-semibold text-foreground mb-2", isBn && "lang-bn")}>
            {t(step.titleKey)}
          </h1>
          <p className={cn("text-foreground-muted mb-8", isBn && "lang-bn")}>
            {t(step.subtitleKey)}
          </p>

          {/* Step Content */}
          {step.id === "welcome" && (
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated text-left">
                <Sparkles className="h-5 w-5 text-accent shrink-0" />
                <p className={cn("text-sm text-foreground", isBn && "lang-bn")}>
                  {t("onboarding.bulletAsk")}
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated text-left">
                <Brain className="h-5 w-5 text-accent shrink-0" />
                <p className={cn("text-sm text-foreground", isBn && "lang-bn")}>
                  {t("onboarding.bulletInsights")}
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated text-left">
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <p className={cn("text-sm text-foreground", isBn && "lang-bn")}>
                  {t("onboarding.bulletApprovals")}
                </p>
              </div>
            </div>
          )}

          {step.id === "business" && (
            <div className="space-y-4 mb-8 text-left">
              <div>
                <label className={cn("block text-sm font-medium text-foreground mb-2", isBn && "lang-bn")}>
                  {t("onboarding.businessNameLabel")}
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={t("onboarding.businessNamePlaceholder")}
                  className="w-full px-4 py-3 rounded-lg bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className={cn("block text-sm font-medium text-foreground mb-2", isBn && "lang-bn")}>
                  {t("onboarding.industryLabel")}
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option>E-commerce</option>
                  <option>Retail</option>
                  <option>SaaS</option>
                  <option>Manufacturing</option>
                  <option>Services</option>
                </select>
              </div>
            </div>
          )}

          {step.id === "integrations" && (
            <div className="space-y-3 mb-8">
              <button className="w-full p-4 rounded-xl bg-surface-elevated hover:bg-border transition-colors text-left flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success-soft flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Google Sheets</p>
                  <p className={cn("text-xs text-foreground-muted", isBn && "lang-bn")}>
                    {t("common.connected")}
                  </p>
                </div>
              </button>
              <button className="w-full p-4 rounded-xl bg-surface-elevated hover:bg-border transition-colors text-left flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success-soft flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Shopify</p>
                  <p className={cn("text-xs text-foreground-muted", isBn && "lang-bn")}>
                    {t("common.connected")}
                  </p>
                </div>
              </button>
              <p className={cn("text-sm text-foreground-subtle", isBn && "lang-bn")}>
                {t("onboarding.helpHint")}
              </p>
            </div>
          )}

          {step.id === "complete" && (
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-soft text-success mb-4">
                <CheckCircle className="h-4 w-4" />
                <span className={cn("text-sm font-medium", isBn && "lang-bn")}>
                  {t("onboarding.completeBadge")}
                </span>
              </div>
              <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
                {t("onboarding.completeBody")}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="flex-1 py-3 rounded-lg border border-border text-foreground-muted hover:text-foreground transition-colors"
              >
                {t("onboarding.skip")}
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium"
            >
              {currentStep === steps.length - 1 ? t("onboarding.finish") : t("onboarding.continue")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
