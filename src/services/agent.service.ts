import type { Agent } from "./types";
import { mockAgents } from "@/data/mock/agents";

export interface AgentService {
  getAgents(): Promise<Agent[]>;
  getAgentById(id: string): Promise<Agent | null>;
}

export const agentService: AgentService = {
  async getAgents() {
    return mockAgents;
  },
  
  async getAgentById(id: string) {
    return mockAgents.find((a) => a.id === id) ?? null;
  },
};
