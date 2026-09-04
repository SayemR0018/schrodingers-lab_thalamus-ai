import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  initials: string;
  language: string;
  timezone: string;
  dateFormat: string;
}

export interface Workspace {
  id: string;
  name: string;
  industry: string;
  currency: string;
  timezone: string;
  createdAt: string;
}

export interface NotificationSettings {
  insights: boolean;
  approvals: boolean;
  agentActivity: boolean;
  dataUpdates: boolean;
  systemNotifications: boolean;
}

export interface PrivacySettings {
  requireApprovalForHighRisk: boolean;
  showActivityHistory: boolean;
  notifyOnDataChanges: boolean;
}

export interface Subscription {
  plan: "Starter" | "Growth" | "Enterprise";
  status: "Active" | "Trial" | "Expired";
  renewal: string;
  usage: {
    aiActivity: number;
    dataSources: { used: number; limit: number };
    teamMembers: { used: number; limit: number };
  };
}

interface UserState {
  // Auth state
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  
  // Current user
  currentUser: UserProfile | null;
  
  // Workspaces
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  
  // Settings
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  subscription: Subscription;
  
  // Notification read state
  readNotificationIds: string[];
  
  // Actions - Auth
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Actions - Onboarding
  completeOnboarding: (businessName: string, industry: string) => void;
  resetOnboarding: () => void;
  
  // Actions - Profile
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Actions - Workspace
  getActiveWorkspace: () => Workspace | undefined;
  switchWorkspace: (workspaceId: string) => void;
  addWorkspace: (name: string, industry: string) => void;
  updateWorkspace: (updates: Partial<Workspace>) => void;
  
  // Actions - Settings
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => void;
  updatePrivacySettings: (updates: Partial<PrivacySettings>) => void;
  
  // Actions - Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (ids: string[]) => void;
}

const defaultUser: UserProfile = {
  id: "user-1",
  displayName: "Fardin Hasan Siam",
  email: "fardin@example.com",
  initials: "FH",
  language: "English",
  timezone: "Asia/Dhaka",
  dateFormat: "DD/MM/YYYY",
};

const defaultWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Demo Commerce",
    industry: "E-commerce",
    currency: "BDT",
    timezone: "Asia/Dhaka",
    createdAt: "2026-01-01",
  },
];

const defaultNotificationSettings: NotificationSettings = {
  insights: true,
  approvals: true,
  agentActivity: true,
  dataUpdates: true,
  systemNotifications: true,
};

const defaultPrivacySettings: PrivacySettings = {
  requireApprovalForHighRisk: true,
  showActivityHistory: true,
  notifyOnDataChanges: true,
};

const defaultSubscription: Subscription = {
  plan: "Growth",
  status: "Active",
  renewal: "Sep 30, 2026",
  usage: {
    aiActivity: 68,
    dataSources: { used: 4, limit: 10 },
    teamMembers: { used: 2, limit: 5 },
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isAuthenticated: true,
      onboardingCompleted: true,
      currentUser: defaultUser,
      workspaces: defaultWorkspaces,
      activeWorkspaceId: "ws-1",
      notificationSettings: defaultNotificationSettings,
      privacySettings: defaultPrivacySettings,
      subscription: defaultSubscription,
      readNotificationIds: [],

      login: (email, _password) => {
        // Mock login - always succeeds for demo
        set({
          isAuthenticated: true,
          currentUser: { ...defaultUser, email },
        });
        return true;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          onboardingCompleted: false,
        });
      },

      completeOnboarding: (businessName, industry) => {
        const state = get();
        const workspaceId = state.activeWorkspaceId || "ws-1";
        
        set({
          onboardingCompleted: true,
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId ? { ...w, name: businessName, industry } : w
          ),
        });
      },

      resetOnboarding: () => {
        set({ onboardingCompleted: false });
      },

      updateProfile: (updates) => {
        const state = get();
        if (!state.currentUser) return;
        
        const updatedUser = { ...state.currentUser, ...updates };
        
        // Update initials if display name changed
        if (updates.displayName) {
          const nameParts = updates.displayName.split(" ");
          updatedUser.initials = nameParts
            .slice(0, 2)
            .map((n) => n[0]?.toUpperCase() || "")
            .join("");
        }
        
        set({ currentUser: updatedUser });
      },

      getActiveWorkspace: () => {
        const state = get();
        return state.workspaces.find((w) => w.id === state.activeWorkspaceId);
      },

      switchWorkspace: (workspaceId) => {
        set({ activeWorkspaceId: workspaceId });
      },

      addWorkspace: (name, industry) => {
        const state = get();
        const newWorkspace: Workspace = {
          id: `ws-${Date.now()}`,
          name,
          industry,
          currency: "BDT",
          timezone: "Asia/Dhaka",
          createdAt: new Date().toISOString().split("T")[0],
        };
        
        set({
          workspaces: [...state.workspaces, newWorkspace],
          activeWorkspaceId: newWorkspace.id,
        });
      },

      updateWorkspace: (updates) => {
        const state = get();
        set({
          workspaces: state.workspaces.map((w) =>
            w.id === state.activeWorkspaceId ? { ...w, ...updates } : w
          ),
        });
      },

      updateNotificationSettings: (updates) => {
        const state = get();
        set({
          notificationSettings: { ...state.notificationSettings, ...updates },
        });
      },

      updatePrivacySettings: (updates) => {
        const state = get();
        set({
          privacySettings: { ...state.privacySettings, ...updates },
        });
      },

      markNotificationRead: (id) => {
        const state = get();
        if (!state.readNotificationIds.includes(id)) {
          set({ readNotificationIds: [...state.readNotificationIds, id] });
        }
      },

      markAllNotificationsRead: (ids) => {
        const state = get();
        const newIds = ids.filter((id) => !state.readNotificationIds.includes(id));
        if (newIds.length > 0) {
          set({ readNotificationIds: [...state.readNotificationIds, ...newIds] });
        }
      },
    }),
    {
      name: "thalamus-user-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        onboardingCompleted: state.onboardingCompleted,
        currentUser: state.currentUser,
        readNotificationIds: state.readNotificationIds,
        workspaces: state.workspaces,
        activeWorkspaceId: state.activeWorkspaceId,
        notificationSettings: state.notificationSettings,
        privacySettings: state.privacySettings,
      }),
      skipHydration: true,
    }
  )
);

// Rehydrate on client side
if (typeof window !== "undefined") {
  useUserStore.persist.rehydrate();
}
