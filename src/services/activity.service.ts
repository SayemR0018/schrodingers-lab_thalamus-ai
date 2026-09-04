import type { ActivityEvent } from "./types";
import { activityService as live } from "./live-activity.service";
import type { ActivityItem } from "@/data/demo/activity";

// Adapter so existing consumers expecting `ActivityEvent` continue to work.
function toEvent(item: ActivityItem, idx: number): ActivityEvent {
  const isoToAgo = (iso: string): string => {
    const diffMin = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const hours = Math.floor(diffMin / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Map activity verbs/types into the legacy ActivityEvent shape.
  let type: ActivityEvent["type"] = "system";
  if (item.actor === "user") type = "approval";
  else if (item.actor === "agent") {
    if (item.id.toLowerCase().includes("report")) type = "report";
    else if (item.id.toLowerCase().includes("insight")) type = "insight";
    else type = "analysis";
  }
  return {
    id: item.id,
    type,
    title: item.verb[0].toUpperCase() + item.verb.slice(1),
    description: item.target ?? item.verb,
    actor: item.actorName,
    actorType: item.actor === "user" ? "user" : item.actor === "agent" ? "agent" : "system",
    timestamp: toAgoString(item.isoDate),
  };
}

function toAgoString(iso: string): string {
  const diffMin = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const hours = Math.floor(diffMin / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

void toEvent;

export interface ActivityService {
  getActivity(): Promise<ActivityEvent[]>;
  getRecentActivity(limit?: number): Promise<ActivityEvent[]>;
  addEvent(event: Omit<ActivityEvent, "id">): Promise<void>;
}

export const activityService: ActivityService = {
  async getActivity() {
    return live.all().map((item, idx) => toEvent(item, idx));
  },

  async getRecentActivity(limit?: number) {
    return live.recent({ limit }).map((item, idx) => toEvent(item, idx));
  },

  async addEvent(event: Omit<ActivityEvent, "id">) {
    const actor: ActivityItem["actor"] =
      event.actorType === "user" ? "user" : event.actorType === "agent" ? "agent" : "system";
    live.push({
      actor,
      actorId: event.actor,
      actorName: event.actor,
      verb: (event.title || "updated").toLowerCase(),
      verbBn: (event.description || "আপডেট").toLowerCase(),
      target: event.description,
      targetBn: event.description,
    });
  },
};
