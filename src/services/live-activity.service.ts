import { dataset } from "./dataset";
import type { ActivityItem } from "@/data/demo/activity";

// In-memory activity log. Initialized with the seeded activity from the dataset
// and grown by `push` calls from other services (e.g. approvalService).
const live: ActivityItem[] = [...dataset.activity];

export interface ActivityService {
  recent(opts?: { limit?: number }): ActivityItem[];
  push(item: Omit<ActivityItem, "id" | "isoDate"> & { isoDate?: string }): ActivityItem;
  all(): ActivityItem[];
}

function makeId(): string {
  return `act-live-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export const activityService: ActivityService = {
  all() {
    return [...live];
  },
  recent(opts) {
    const limit = opts?.limit ?? 5;
    return [...live]
      .sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime())
      .slice(0, limit);
  },
  push(item) {
    const entry: ActivityItem = {
      ...item,
      id: makeId(),
      isoDate: item.isoDate ?? new Date().toISOString(),
    };
    live.unshift(entry);
    return entry;
  },
};
