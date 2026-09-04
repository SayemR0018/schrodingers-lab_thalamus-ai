"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AgentNode, type AgentNodeData } from "./AgentNode";
import { KnowledgeGraphNode, type KnowledgeGraphNodeData } from "./KnowledgeGraphNode";
import { ConnectionEdge, type ConnectionEdgeData } from "./ConnectionEdge";
import { CanvasLegend } from "./CanvasLegend";
import { mockAgents } from "@/data/mock/agents";
import { useAppStore } from "@/store/app.store";
import { useDataStore } from "@/store/data.store";
import { useUserStore } from "@/store/user.store";

const nodeTypes = {
  agent: AgentNode,
  knowledgeGraph: KnowledgeGraphNode,
};

const edgeTypes = {
  connection: ConnectionEdge,
};

/**
 * Canvas nodes are hand-positioned, so agents are looked up by id. Indexing
 * into `mockAgents` would silently rewire nodes whenever the roster changes.
 */
function agentById(id: string) {
  return mockAgents.find((agent) => agent.id === id);
}

export function BusinessBrainCanvas() {
  const { agentActivities, setSelectedAgent, setSelectedEntity } = useAppStore();
  const { categories, getTotalRecords, getActiveVersion } = useDataStore();
  const { getActiveWorkspace } = useUserStore();
  
  const activeVersion = getActiveVersion();
  const activeWorkspace = getActiveWorkspace();
  const totalRecords = getTotalRecords();
  
  // Derive knowledge graph stats from data store
  const knowledgeGraphStats = useMemo(() => ({
    entities: totalRecords,
    relations: Math.floor(totalRecords * 2.5),
    policies: categories.find(c => c.id === "policies")?.recordCount || 0,
    lastUpdated: activeVersion?.createdAt || "Just now",
  }), [totalRecords, categories, activeVersion]);
  
  const businessContext = useMemo(() => ({
    name: activeWorkspace?.name || "Demo Commerce",
    industry: activeWorkspace?.industry || "E-commerce",
    entities: {
      products: categories.find(c => c.id === "products")?.recordCount || 0,
      customers: categories.find(c => c.id === "customers")?.recordCount || 0,
      orders: categories.find(c => c.id === "orders")?.recordCount || 0,
      suppliers: categories.find(c => c.id === "suppliers")?.recordCount || 0,
    },
  }), [activeWorkspace, categories]);

  const initialNodes: Node[] = useMemo(
    () => [
      // Top row agents
      {
        id: "sales-analyst",
        type: "agent",
        position: { x: 50, y: 50 },
        data: {
          ...agentById("sales-analyst"),
          position: "top",
          activityState: agentActivities["sales-analyst"] || "idle",
        } as AgentNodeData,
      },
      {
        id: "marketing-agent",
        type: "agent",
        position: { x: 300, y: 50 },
        data: {
          ...agentById("marketing-agent"),
          position: "top",
          activityState: agentActivities["marketing-agent"] || "idle",
        } as AgentNodeData,
      },
      {
        id: "inventory-agent",
        type: "agent",
        position: { x: 550, y: 50 },
        data: {
          ...agentById("inventory-agent"),
          position: "top",
          activityState: agentActivities["inventory-agent"] || "idle",
        } as AgentNodeData,
      },
      // Central knowledge graph
      {
        id: "knowledge-graph",
        type: "knowledgeGraph",
        position: { x: 240, y: 320 },
        data: {
          stats: knowledgeGraphStats,
          business: businessContext,
        } as KnowledgeGraphNodeData,
      },
      // Bottom row agents
      {
        id: "customer-success",
        type: "agent",
        position: { x: 50, y: 580 },
        data: {
          ...agentById("customer-success"),
          position: "bottom",
          activityState: agentActivities["customer-success"] || "idle",
        } as AgentNodeData,
      },
      {
        id: "finance-agent",
        type: "agent",
        position: { x: 300, y: 580 },
        data: {
          ...agentById("finance-agent"),
          position: "bottom",
          activityState: agentActivities["finance-agent"] || "idle",
        } as AgentNodeData,
      },
      {
        id: "automation-agent",
        type: "agent",
        position: { x: 550, y: 580 },
        data: {
          ...agentById("automation-agent"),
          position: "bottom",
          activityState: agentActivities["automation-agent"] || "idle",
        } as AgentNodeData,
      },
    ],
    [agentActivities, knowledgeGraphStats, businessContext]
  );

  const initialEdges: Edge[] = useMemo(() => {
    const activeAgents = Object.entries(agentActivities)
      .filter(([, state]) => state !== "idle")
      .map(([id]) => id);

    return [
      // Top agents to knowledge graph
      {
        id: "e-sales-kg",
        source: "sales-analyst",
        target: "knowledge-graph",
        targetHandle: "top-1",
        type: "connection",
        data: {
          type: "data-flow",
          animated: activeAgents.includes("sales-analyst"),
          active: activeAgents.includes("sales-analyst"),
        } as ConnectionEdgeData,
      },
      {
        id: "e-marketing-kg",
        source: "marketing-agent",
        target: "knowledge-graph",
        targetHandle: "top-2",
        type: "connection",
        data: {
          type: "data-flow",
          animated: activeAgents.includes("marketing-agent"),
          active: activeAgents.includes("marketing-agent"),
        } as ConnectionEdgeData,
      },
      {
        id: "e-inventory-kg",
        source: "inventory-agent",
        target: "knowledge-graph",
        targetHandle: "top-3",
        type: "connection",
        data: {
          type: "info-sync",
          animated: activeAgents.includes("inventory-agent"),
          active: activeAgents.includes("inventory-agent"),
        } as ConnectionEdgeData,
      },
      // Bottom agents to knowledge graph
      {
        id: "e-customer-kg",
        source: "customer-success",
        target: "knowledge-graph",
        targetHandle: "bottom-1",
        type: "connection",
        data: {
          type: "info-sync",
          animated: activeAgents.includes("customer-success"),
          active: activeAgents.includes("customer-success"),
        } as ConnectionEdgeData,
      },
      {
        id: "e-finance-kg",
        source: "finance-agent",
        target: "knowledge-graph",
        targetHandle: "bottom-2",
        type: "connection",
        data: {
          type: "data-flow",
          animated: activeAgents.includes("finance-agent"),
          active: activeAgents.includes("finance-agent"),
        } as ConnectionEdgeData,
      },
      {
        id: "e-automation-kg",
        source: "automation-agent",
        target: "knowledge-graph",
        targetHandle: "bottom-3",
        type: "connection",
        data: {
          type: "info-sync",
          animated: false,
          active: false,
        } as ConnectionEdgeData,
      },
    ];
  }, [agentActivities]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      if (node.type === "agent") {
        setSelectedAgent(node.id);
        setSelectedEntity(null);
      } else if (node.type === "knowledgeGraph") {
        setSelectedAgent(null);
        setSelectedEntity("knowledge-graph");
      }
    },
    [setSelectedAgent, setSelectedEntity]
  );

  return (
    <div className="relative h-full w-full canvas-grid">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={{ x: 50, y: 20, zoom: 0.9 }}
        minZoom={0.4}
        maxZoom={1.5}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Controls
          showInteractive={false}
          position="bottom-right"
          className="!bottom-4 !right-4"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="hsl(var(--canvas-grid))"
        />
      </ReactFlow>
      <CanvasLegend />
    </div>
  );
}
