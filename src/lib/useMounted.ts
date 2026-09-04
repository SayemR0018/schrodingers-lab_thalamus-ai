"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` during SSR and the first client render, `true` afterwards.
 *
 * Uses `useSyncExternalStore` rather than a `setState` in an effect so
 * hydration flips the value without scheduling a cascading re-render.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
