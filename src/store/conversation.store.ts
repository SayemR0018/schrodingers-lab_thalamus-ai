/**
 * Dedicated conversation-history store with localStorage persistence.
 *
 * The chat UI primarily reads/writes via the `useAppStore` for backwards
 * compatibility. This secondary store exists so that:
 *   1. Conversations survive reloads independent of UI state.
 *   2. Multiple conversations can be managed under one workspace.
 *   3. Server remains stateless — the frontend persists, the server
 *      only receives history inline.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ConversationMessage } from "./app.store";

export interface ConversationRecord {
  id: string;
  title: string;
  startedAt: string;
  updatedAt: string;
  messages: ConversationMessage[];
}

interface ConversationStoreState {
  activeConversationId: string | null;
  conversations: Record<string, ConversationRecord>;

  createConversation: () => string;
  setActive: (id: string | null) => void;
  appendMessage: (
    conversationId: string,
    message: ConversationMessage
  ) => void;
  patchLastMessage: (
    conversationId: string,
    patch: Partial<ConversationMessage>
  ) => void;
  clearConversation: (conversationId: string) => void;
  listConversations: () => ConversationRecord[];
}

export const useConversationStore = create<ConversationStoreState>()(
  persist(
    (set, get) => ({
      activeConversationId: null,
      conversations: {},

      createConversation: () => {
        const id = `conv-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const now = new Date().toISOString();
        set((state) => ({
          conversations: {
            ...state.conversations,
            [id]: {
              id,
              title: "New conversation",
              startedAt: now,
              updatedAt: now,
              messages: [],
            },
          },
          activeConversationId: id,
        }));
        return id;
      },

      setActive: (id) => set({ activeConversationId: id }),

      appendMessage: (conversationId, message) => {
        const rec = get().conversations[conversationId];
        if (!rec) return;
        set((state) => ({
          conversations: {
            ...state.conversations,
            [conversationId]: {
              ...rec,
              messages: [...rec.messages, message],
              updatedAt: new Date().toISOString(),
              // Auto-title from first user message
              title:
                rec.messages.length === 0 && message.role === "user"
                  ? message.content.slice(0, 40)
                  : rec.title,
            },
          },
        }));
      },

      patchLastMessage: (conversationId, patch) => {
        const rec = get().conversations[conversationId];
        if (!rec || rec.messages.length === 0) return;
        const last = rec.messages[rec.messages.length - 1];
        const updated = { ...last, ...patch };
        set((state) => ({
          conversations: {
            ...state.conversations,
            [conversationId]: {
              ...rec,
              messages: [...rec.messages.slice(0, -1), updated],
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      clearConversation: (conversationId) => {
        set((state) => ({
          conversations: {
            ...state.conversations,
            [conversationId]: {
              ...state.conversations[conversationId],
              messages: [],
            },
          },
        }));
      },

      listConversations: () => {
        return Object.values(get().conversations).sort((a, b) =>
          b.updatedAt.localeCompare(a.updatedAt)
        );
      },
    }),
    {
      name: "thalamus-conversations",
      partialize: (state) => ({
        activeConversationId: state.activeConversationId,
        conversations: state.conversations,
      }),
      skipHydration: true,
    }
  )
);
