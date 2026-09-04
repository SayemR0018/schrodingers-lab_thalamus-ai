"use client";

import { Brain, ExternalLink } from "lucide-react";

export function AboutSection() {
  const links = [
    { label: "Documentation", href: "#" },
    { label: "Roadmap", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ];

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
          <Brain className="h-7 w-7 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            THALAMUS <span className="text-accent">AI</span>
          </h2>
          <p className="text-sm text-foreground-muted">Intelligent Business Co-founder</p>
        </div>
      </div>

      <blockquote className="border-l-2 border-accent pl-4 mb-6">
        <p className="text-foreground-muted italic">
          &ldquo;Technology that adapts to the business, not the business to the technology.&rdquo;
        </p>
      </blockquote>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-foreground-muted">Version</span>
          <span className="text-foreground font-medium">Frontend Prototype</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-foreground-muted">Team</span>
          <span className="text-foreground font-medium">Schr&ouml;dinger&apos;s Cats</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-foreground-muted">Build</span>
          <span className="text-foreground font-medium">2026.09.03</span>
        </div>
      </div>

      <div className="space-y-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-elevated transition-colors group"
          >
            <span className="text-foreground">{link.label}</span>
            <ExternalLink className="h-4 w-4 text-foreground-subtle group-hover:text-foreground" />
          </a>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-sm text-foreground-muted">
          &copy; 2026 Schr&ouml;dinger&apos;s Cats. All rights reserved.
        </p>
      </div>
    </div>
  );
}
