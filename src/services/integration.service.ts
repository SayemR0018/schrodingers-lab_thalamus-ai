import type { Integration } from "./types";
import {
  getIntegrations,
  getConnectedIntegrations,
  getAvailableIntegrations,
} from "@/data/mock/integrations";

export interface IntegrationService {
  getIntegrations(): Promise<Integration[]>;
  getConnectedIntegrations(): Promise<Integration[]>;
  getAvailableIntegrations(): Promise<Integration[]>;
  connect(id: string): Promise<void>;
}

export const integrationService: IntegrationService = {
  async getIntegrations() {
    return getIntegrations();
  },

  async getConnectedIntegrations() {
    return getConnectedIntegrations();
  },

  async getAvailableIntegrations() {
    return getAvailableIntegrations();
  },

  async connect(id: string) {
    // Simulated connection - in real app this would update state
    console.log(`Connecting integration: ${id}`);
  },
};
