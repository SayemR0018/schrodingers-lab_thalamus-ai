import type { ActivityEvent } from "./types";

const initialActivity: ActivityEvent[] = [
  {
    id: "act-1",
    type: "report",
    title: "Generated sales report",
    description: "Analysis completed for 'Why did sales drop this month?'",
    actor: "Sales Analyst",
    actorType: "agent",
    timestamp: "10:42 AM",
    relatedAgents: ["sales-analyst", "customer-success", "inventory-agent"],
    relatedReportId: "report-sales-drop",
  },
  {
    id: "act-2",
    type: "system",
    title: "Updated business context",
    description: "Synced latest data from connected sources",
    actor: "Thalamus",
    actorType: "system",
    timestamp: "10:39 AM",
  },
  {
    id: "act-3",
    type: "insight",
    title: "Detected stockout risk",
    description: "Classic Shirt inventory critically low",
    actor: "Inventory Agent",
    actorType: "agent",
    timestamp: "10:31 AM",
    relatedAgents: ["inventory-agent"],
  },
  {
    id: "act-4",
    type: "analysis",
    title: "Completed customer analysis",
    description: "Reviewed repeat customer behavior patterns",
    actor: "Customer Success",
    actorType: "agent",
    timestamp: "10:15 AM",
    relatedAgents: ["customer-success"],
  },
  {
    id: "act-5",
    type: "system",
    title: "Daily sync completed",
    description: "All integrations synchronized successfully",
    actor: "Thalamus",
    actorType: "system",
    timestamp: "8:00 AM",
  },
  {
    id: "act-6",
    type: "insight",
    title: "Marketing campaign performing well",
    description: "Email campaign ROI exceeds target",
    actor: "Marketing Agent",
    actorType: "agent",
    timestamp: "Yesterday",
    relatedAgents: ["marketing-agent"],
  },
];

let activityState = [...initialActivity];

export function getActivity(): ActivityEvent[] {
  return activityState;
}

export function getRecentActivity(limit: number = 10): ActivityEvent[] {
  return activityState.slice(0, limit);
}

export function addActivityEvent(event: Omit<ActivityEvent, "id">): void {
  const newEvent: ActivityEvent = {
    ...event,
    id: `act-${Date.now()}`,
  };
  activityState = [newEvent, ...activityState];
}

export function resetActivity(): void {
  activityState = [...initialActivity];
}
