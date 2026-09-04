"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Brain } from "lucide-react";
import { navigation } from "@/data/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-surface/95 backdrop-blur-sm lg:hidden">
        <div className="flex h-full items-center justify-between px-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Brain className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-semibold text-foreground">
              THALAMUS <span className="text-accent">AI</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                "text-foreground-muted hover:text-foreground",
                "hover:bg-surface-elevated transition-colors"
              )}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <nav
        className={cn(
          "fixed top-14 left-0 bottom-0 z-40 w-72 border-r border-border bg-surface",
          "transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="py-4 overflow-y-auto h-full">
          {navigation.map((group) => (
            <div key={group.id} className="mb-6">
              <div className="mb-2 px-4">
                <span className="text-xs font-medium uppercase tracking-wider text-foreground-subtle">
                  {group.label}
                </span>
              </div>
              <ul className="space-y-1 px-2">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                          "hover:bg-surface-elevated",
                          isActive && "bg-accent-soft text-accent",
                          !isActive && "text-foreground-muted hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-accent")} />
                        <span className="text-sm font-medium">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
