export type AgentStatus = "active" | "locked";
export type AgentActivityState = "idle" | "analyzing" | "reviewing" | "syncing";

export interface AgentMetrics {
  insightsGenerated?: number;
  anomaliesDetected?: number;
  reportsCreated?: number;
  campaignsAnalyzed?: number;
  leadsScored?: number;
  alertsTriggered?: number;
  stockAlerts?: number;
  reorderSuggestions?: number;
  ticketsResolved?: number;
  satisfactionScore?: number;
  forecastsGenerated?: number;
  budgetAlerts?: number;
}

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  description: string;
  colorKey: string;
  metrics: AgentMetrics;
  capabilities: string[];
  purpose?: string;
  contextUsed?: string[];
}

export interface KnowledgeGraphStats {
  entities: number;
  relations: number;
  policies: number;
  lastUpdated: string;
}

export interface BusinessContext {
  name: string;
  industry: string;
  entities: {
    products: number;
    customers: number;
    orders: number;
    suppliers: number;
  };
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  action?: {
    label: string;
    type: "report" | "view" | "action";
    reportId?: string;
  };
}

export interface SuggestedQuestion {
  id: string;
  /** English prompt text shown in the suggestion list. */
  text: string;
  /** Optional Bengali variant; when present and active language is `bn`,
   *  the assistant renders this string instead of `text`. */
  textBn?: string;
  category: "overview" | "sales" | "inventory" | "marketing" | "customer";
  reportType: string;
  involvedAgents: string[];
}

// Report Types
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface ReportFinding {
  id: string;
  title: string;
  titleBn?: string;
  change: string;
  changeType: "negative" | "positive" | "neutral";
  detail?: string;
  detailBn?: string;
}

export interface EvidenceSource {
  id: string;
  name: string;
  nameBn?: string;
  type: "shopify" | "sheets" | "internal" | "customer" | "inventory";
  recordCount: number;
  timeRange?: string;
  relevantFinding?: string;
  relevantFindingBn?: string;
}

export interface Report {
  id: string;
  title: string;
  titleBn?: string;
  question: string;
  generatedAt: string;
  generatedAtBn?: string;
  generatedBy: string[];
  confidence: number;
  summary: string;
  summaryBn?: string;
  findings: ReportFinding[];
  evidence: EvidenceSource[];
  recommendation: {
    text: string;
    textBn?: string;
    risk: RiskLevel;
    actionRequired: boolean;
    actionId?: string;
  };
  contextUsed: string[];
  contextUsedBn?: string[];
  status: "draft" | "ready" | "actioned";
}

// Insight Types
export type InsightSeverity = "low" | "medium" | "high";
export type InsightCategory = "sales" | "inventory" | "customer" | "finance" | "marketing";

export interface Insight {
  id: string;
  title: string;
  titleBn?: string;
  summary: string;
  summaryBn?: string;
  severity: InsightSeverity;
  category: InsightCategory;
  detectedAt: string;
  detectedAtBn?: string;
  affectedEntities: string[];
  affectedEntitiesBn?: string[];
  evidence: EvidenceSource[];
  relatedAgents: string[];
  confidence: number;
  recommendation?: string;
  recommendationBn?: string;
  actionId?: string;
  status: "new" | "acknowledged" | "resolved";
}

// Approval Types
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Approval {
  id: string;
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  agentId: string;
  agentName: string;
  agentNameBn?: string;
  risk: RiskLevel;
  reason: string;
  reasonBn?: string;
  details: Record<string, string | number>;
  evidence: EvidenceSource[];
  status: ApprovalStatus;
  createdAt: string;
  createdAtBn?: string;
  decidedAt?: string;
  decidedBy?: string;
}

// Activity Types
export type ActivityType = "analysis" | "report" | "approval" | "insight" | "system" | "user";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  actor: string;
  actorType: "agent" | "user" | "system";
  timestamp: string;
  relatedAgents?: string[];
  relatedReportId?: string;
  relatedApprovalId?: string;
  metadata?: Record<string, unknown>;
}

// Integration Types
export type IntegrationStatus = "connected" | "available" | "coming_soon";

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: IntegrationStatus;
  connectedAt?: string;
  entityCounts?: {
    label: string;
    count: number;
  }[];
}

// Entity Types (for Business Brain interactions)
export interface BusinessEntity {
  id: string;
  type: "product" | "customer" | "supplier" | "region" | "policy";
  name: string;
  metrics: Record<string, string | number>;
  relatedEntities: string[];
  relatedInsights?: string[];
}
