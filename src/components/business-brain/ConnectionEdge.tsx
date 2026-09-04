"use client";

import { memo } from "react";
import { BaseEdge, getSmoothStepPath, type Position } from "@xyflow/react";

export interface ConnectionEdgeData {
  type: "data-flow" | "info-sync";
  animated?: boolean;
  active?: boolean;
  [key: string]: unknown;
}

interface ConnectionEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  data?: ConnectionEdgeData;
  selected?: boolean;
}

function ConnectionEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: ConnectionEdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const isDataFlow = data?.type === "data-flow";
  const isActive = data?.active;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected || isActive
            ? "hsl(var(--accent))"
            : "hsl(var(--canvas-line-subtle))",
          strokeWidth: selected || isActive ? 2 : 1.5,
          strokeDasharray: isDataFlow ? "none" : "4 4",
          opacity: isActive ? 1 : 0.6,
          transition: "all 0.3s ease",
        }}
      />
      {data?.animated && (
        <circle r="3" fill="hsl(var(--accent))">
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  );
}

export const ConnectionEdge = memo(ConnectionEdgeComponent);
