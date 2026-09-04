import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";
export type Language = "en" | "bn";

export type AnalysisStage =
  | "idle"
  | "understanding"
  | "context"
  | "analysis"
  | "synthesis"
  | "complete";

export type AgentActivityState = "idle" | "analyzing" | "reviewing" | "syncing";

export interface AnalysisState {
  stage: AnalysisStage;
  activeAgents: string[];
  currentQuestion: string | null;
  reportId: string | null;
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
  processingStages?: {
    stage: AnalysisStage;
    label: string;
    completed: boolean;
  }[];
  dataContribution?: {
    key: string;
    value: string;
  };
}

interface AppState {
  // UI State
  theme: Theme;
  language: Language;
  sidebarCollapsed: boolean;
  assistantCollapsed: boolean;
  contextPanelMode: "assistant" | "context";
  
  // Selection State
  selectedAgentId: string | null;
  selectedEntityId: string | null;
  selectedReportId: string | null;
  
  // Analysis State
  analysis: AnalysisState;
  agentActivities: Record<string, AgentActivityState>;
  
  // Conversation State
  messages: ConversationMessage[];
  
  // Actions - UI
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  toggleAssistant: () => void;
  setContextPanelMode: (mode: "assistant" | "context") => void;
  
  // Actions - Selection
  setSelectedAgent: (id: string | null) => void;
  setSelectedEntity: (id: string | null) => void;
  setSelectedReport: (id: string | null) => void;
  
  // Actions - Analysis
  startAnalysis: (question: string, agents: string[]) => void;
  setAnalysisStage: (stage: AnalysisStage) => void;
  completeAnalysis: (reportId: string) => void;
  resetAnalysis: () => void;
  setAgentActivity: (agentId: string, state: AgentActivityState) => void;
  
  // Actions - Conversation
  addMessage: (message: ConversationMessage) => void;
  clearMessages: () => void;
}

const initialAnalysis: AnalysisState = {
  stage: "idle",
  activeAgents: [],
  currentQuestion: null,
  reportId: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial UI State
      theme: "system",
      language: "en",
      sidebarCollapsed: false,
      assistantCollapsed: false,
      contextPanelMode: "assistant",
      
      // Initial Selection State
      selectedAgentId: null,
      selectedEntityId: null,
      selectedReportId: null,
      
      // Initial Analysis State
      analysis: initialAnalysis,
      agentActivities: {},
      
      // Initial Conversation
      messages: [],
      
      // UI Actions
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleAssistant: () => set((state) => ({ assistantCollapsed: !state.assistantCollapsed })),
      setContextPanelMode: (mode) => set({ contextPanelMode: mode }),
      
      // Selection Actions
      setSelectedAgent: (id) => set({ selectedAgentId: id }),
      setSelectedEntity: (id) => set({ selectedEntityId: id }),
      setSelectedReport: (id) => set({ selectedReportId: id }),
      
      // Analysis Actions
      startAnalysis: (question, agents) => {
        const activities: Record<string, AgentActivityState> = {};
        agents.forEach((agentId) => {
          activities[agentId] = "analyzing";
        });
        set({
          analysis: {
            stage: "understanding",
            activeAgents: agents,
            currentQuestion: question,
            reportId: null,
          },
          agentActivities: activities,
        });
      },
      
      setAnalysisStage: (stage) => {
        const state = get();
        const activities = { ...state.agentActivities };
        
        if (stage === "context") {
          state.analysis.activeAgents.forEach((agentId) => {
            activities[agentId] = "syncing";
          });
        } else if (stage === "analysis") {
          state.analysis.activeAgents.forEach((agentId) => {
            activities[agentId] = "analyzing";
          });
        } else if (stage === "synthesis") {
          state.analysis.activeAgents.forEach((agentId) => {
            activities[agentId] = "reviewing";
          });
        } else if (stage === "complete" || stage === "idle") {
          state.analysis.activeAgents.forEach((agentId) => {
            activities[agentId] = "idle";
          });
        }
        
        set({
          analysis: { ...state.analysis, stage },
          agentActivities: activities,
        });
      },
      
      completeAnalysis: (reportId) => {
        const state = get();
        const activities = { ...state.agentActivities };
        state.analysis.activeAgents.forEach((agentId) => {
          activities[agentId] = "idle";
        });
        set({
          analysis: { ...state.analysis, stage: "complete", reportId },
          agentActivities: activities,
        });
      },
      
      resetAnalysis: () => set({
        analysis: initialAnalysis,
        agentActivities: {},
      }),
      
      setAgentActivity: (agentId, state) => set((prev) => ({
        agentActivities: { ...prev.agentActivities, [agentId]: state },
      })),
      
      // Conversation Actions
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
      })),
      
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "thalamus-app-storage",
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
        // Persist conversations across reloads (last 50 messages only).
        messages: state.messages.slice(-50),
      }),
      skipHydration: true,
    }
  )
);
