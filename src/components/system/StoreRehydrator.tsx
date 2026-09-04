"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app.store";
import { useConversationStore } from "@/store/conversation.store";
import { useDataStore } from "@/store/data.store";
import { useUserStore } from "@/store/user.store";

/**
 * Load persisted Zustand state after hydration.
 *
 * Calling `persist.rehydrate()` at module evaluation (via `typeof window`)
 * updates the store before React hydrates, so the first client render can
 * disagree with the SSR HTML (sidebar width, language, messages).
 */
export function rehydrateClientStores(): void {
  void useAppStore.persist.rehydrate();
  void useDataStore.persist.rehydrate();
  void useUserStore.persist.rehydrate();
  void useConversationStore.persist.rehydrate();
}

export function StoreRehydrator(): null {
  useEffect(() => {
    rehydrateClientStores();
  }, []);
  return null;
}
