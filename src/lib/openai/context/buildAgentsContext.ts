/**
 * Agents roster — fed to the orchestrator for routing decisions.
 */
import { mockAgents } from "@/data/mock/agents";

export interface AgentsContextSlice {
  agents: Array<{
    id: string;
    name: string;
    status: "active" | "locked";
    purpose: string;
    capabilities: string[];
  }>;
}

export function buildAgentsContext(): AgentsContextSlice {
  return {
    agents: mockAgents.map((a) => ({
      id: a.id,
      name: a.name,
      status: a.status,
      purpose: a.description,
      capabilities: a.capabilities,
    })),
  };
}
