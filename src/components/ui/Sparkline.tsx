"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface SparklineProps {
  data: readonly number[];
  className?: string;
  color?: string;
  height?: number;
  width?: number;
  strokeWidth?: number;
}

/**
 * Lightweight inline SVG sparkline.
 *
 * Normalizes `data` between 0 and 1 using `(val - min) / (max - min)`. If all
 * values are equal, draws a flat mid-line.
 */
export function Sparkline({
  data,
  className,
  color = "currentColor",
  height = 28,
  width = 96,
  strokeWidth = 2,
}: SparklineProps) {
  const path = useMemo(() => {
    if (data.length < 2) return "";
    let min = Infinity;
    let max = -Infinity;
    for (const v of data) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (max === min) {
      // Flat line in the middle.
      const midY = height / 2;
      const step = width / (data.length - 1);
      return `M 0 ${midY} ` + data.map((_, i) => `L ${i * step} ${midY}`).join(" ");
    }
    const stepX = width / (data.length - 1);
    return data
      .map((v, i) => {
        const y = height - ((v - min) / (max - min)) * height;
        const x = i * stepX;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [data, height, width]);

  if (!path) return null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      width={width}
      height={height}
      className={cn("block", className)}
      aria-hidden
    >
      <path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
