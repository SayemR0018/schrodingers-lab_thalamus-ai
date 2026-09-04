import type { BusinessContext, KnowledgeGraphStats } from "./types";
import { mockBusiness, mockKnowledgeGraph } from "@/data/mock/business";

export interface BusinessService {
  getBusinessContext(): Promise<BusinessContext>;
  getKnowledgeGraphStats(): Promise<KnowledgeGraphStats>;
}

export const businessService: BusinessService = {
  async getBusinessContext() {
    return mockBusiness;
  },
  
  async getKnowledgeGraphStats() {
    return mockKnowledgeGraph;
  },
};
