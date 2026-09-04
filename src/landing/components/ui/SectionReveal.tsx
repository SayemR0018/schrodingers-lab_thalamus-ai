"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/landing/lib/cn";

type SectionRevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

export function SectionReveal({
  children,
  className,
  delayMs = 0,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(visible ? "reveal" : "reveal-pending", className)}
      style={{ "--reveal-delay": `${delayMs}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
