"use client";

import { useMemo, useState } from "react";
import {
  knowledgeLinks,
  knowledgeNodes,
  type KnowledgeNodeId,
} from "@/landing/data/landing";
import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

export function ProductStory() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const [selectedId, setSelectedId] = useState<KnowledgeNodeId>("products");
  const selectedNode =
    knowledgeNodes.find((node) => node.id === selectedId) ?? knowledgeNodes[0];
  const relatedIds = useMemo(
    () => new Set<KnowledgeNodeId>([selectedNode.id, ...selectedNode.related]),
    [selectedNode],
  );

  const labels: Record<KnowledgeNodeId, string> = {
    products: t("product.nodes.products.label"),
    customers: t("product.nodes.customers.label"),
    orders: t("product.nodes.orders.label"),
    suppliers: t("product.nodes.suppliers.label"),
    policies: t("product.nodes.policies.label"),
    workflows: t("product.nodes.workflows.label"),
    goals: t("product.nodes.goals.label"),
  };

  const details: Record<KnowledgeNodeId, string> = {
    products: t("product.nodes.products.detail"),
    customers: t("product.nodes.customers.detail"),
    orders: t("product.nodes.orders.detail"),
    suppliers: t("product.nodes.suppliers.detail"),
    policies: t("product.nodes.policies.detail"),
    workflows: t("product.nodes.workflows.detail"),
    goals: t("product.nodes.goals.detail"),
  };

  return (
    <section
      id="product"
      className="py-20 sm:py-28"
      aria-labelledby="product-heading"
    >
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <SectionReveal>
          <p className={cn("eyebrow", isBn && "lang-bn")}>{t("product.eyebrow")}</p>
          <h2
            id="product-heading"
            className={cn(
              "mt-4 max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl",
              isBn && "lang-bn"
            )}
          >
            {t("product.heading")}
          </h2>
          <p
            className={cn(
              "mt-5 max-w-md text-[15px] leading-7 text-muted",
              isBn && "lang-bn"
            )}
          >
            {t("product.subtitle")}
          </p>
          <dl className="mt-8 space-y-5">
            <div>
              <dt className={cn("text-sm font-semibold", isBn && "lang-bn")}>
                {t("product.dt1Title")}
              </dt>
              <dd className={cn("mt-1 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                {t("product.dt1Body")}
              </dd>
            </div>
            <div>
              <dt className={cn("text-sm font-semibold", isBn && "lang-bn")}>
                {t("product.dt2Title")}
              </dt>
              <dd className={cn("mt-1 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                {t("product.dt2Body")}
              </dd>
            </div>
            <div>
              <dt className={cn("text-sm font-semibold", isBn && "lang-bn")}>
                {t("product.dt3Title")}
              </dt>
              <dd className={cn("mt-1 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                {t("product.dt3Body")}
              </dd>
            </div>
          </dl>
        </SectionReveal>

        <SectionReveal delayMs={90}>
          <div className="product-frame rounded-[28px] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className={cn("eyebrow", isBn && "lang-bn")}>
                {t("product.knowledgeGraphTitle")}
              </p>
              <p className={cn("hidden text-xs text-muted sm:block", isBn && "lang-bn")}>
                {t("product.selectNodeToTrace")}
              </p>
            </div>

            <div className="relative hidden min-h-[420px] lg:block">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {knowledgeLinks.map(([fromId, toId]) => {
                  const from = knowledgeNodes.find((node) => node.id === fromId);
                  const to = knowledgeNodes.find((node) => node.id === toId);
                  if (!from || !to) return null;

                  const active =
                    from.id === selectedId ||
                    to.id === selectedId ||
                    (relatedIds.has(from.id) && relatedIds.has(to.id));

                  return (
                    <line
                      key={`${fromId}-${toId}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="currentColor"
                      strokeWidth={active ? 0.42 : 0.22}
                      strokeOpacity={active ? 0.54 : 0.16}
                      className="text-accent transition-all"
                    />
                  );
                })}
              </svg>

              <div className="absolute left-1/2 top-1/2 z-10 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface-glass-strong)] px-5 py-4 text-center backdrop-blur-xl">
                <p className={cn("text-[10px] font-semibold tracking-[0.16em] text-muted uppercase", isBn && "lang-bn")}>
                  {t("product.businessLabel")}
                </p>
                <p className={cn("mt-1 text-sm font-semibold", isBn && "lang-bn")}>
                  {t("product.knowledgeGraphLabel")}
                </p>
              </div>

              {knowledgeNodes.map((node) => {
                const isSelected = node.id === selectedId;
                const isRelated = relatedIds.has(node.id);

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedId(node.id)}
                    onFocus={() => setSelectedId(node.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-4 py-3 text-sm transition-all",
                      isSelected
                        ? "border-[color:var(--accent)] bg-[color:var(--surface)] text-foreground shadow-[0_16px_34px_-24px_var(--accent-glow)]"
                        : isRelated
                          ? "border-[color:var(--border-strong)] bg-[color:var(--surface-glass)] text-foreground"
                          : "border-[color:var(--border)] bg-[color:var(--surface-glass)] text-muted opacity-55",
                      isBn && "lang-bn",
                    )}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    {labels[node.id]}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 lg:hidden">
              {knowledgeNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedId(node.id)}
                  aria-pressed={node.id === selectedId}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                    node.id === selectedId
                      ? "border-[color:var(--accent)] bg-[color:var(--surface)]"
                      : "border-[color:var(--border)] bg-transparent text-muted",
                    isBn && "lang-bn",
                  )}
                >
                  {labels[node.id]}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] p-5">
              <p className={cn("text-[11px] font-semibold tracking-[0.16em] text-muted uppercase", isBn && "lang-bn")}>
                {t("product.selectedContext")}
              </p>
              <h3 className={cn("mt-2 text-lg font-semibold", isBn && "lang-bn")}>
                {labels[selectedNode.id]}
              </h3>
              <p className={cn("mt-2 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                {details[selectedNode.id]}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedNode.related.map((id) => (
                  <span
                    key={id}
                    className={cn(
                      "rounded-full border border-[color:var(--border)] px-3 py-1 text-xs text-muted",
                      isBn && "lang-bn"
                    )}
                  >
                    {labels[id]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
