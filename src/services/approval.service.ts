import { dataset } from "./dataset";
import { activityService } from "./live-activity.service";
import type { Insight, Stage } from "@/data/demo/insights";

export interface ApproveResult {
  ok: boolean;
  insightId: string;
}

export interface ApprovalService {
  pending(): Insight[];
  approve(id: string): ApproveResult;
  reject(id: string, reason?: string): ApproveResult;
}

function findInsight(id: string): Insight | undefined {
  return dataset.insights.find((i) => i.id === id);
}

function agentLabel(agentId: string): string {
  switch (agentId) {
    case "sales-analyst":
      return "Sales Analyst";
    case "inventory-agent":
      return "Inventory Agent";
    case "customer-success":
      return "Customer Success";
    case "marketing-agent":
      return "Marketing Agent";
    case "finance-agent":
      return "Finance Agent";
    case "automation-agent":
      return "Automation Agent";
    default:
      return agentId;
  }
}

export const approvalService: ApprovalService = {
  pending() {
    return dataset.insights.filter((i) => i.stage === "pending_approval");
  },

  approve(id) {
    const insight = findInsight(id);
    if (!insight) return { ok: false, insightId: id };

    // Move to executing
    insight.stage = "executing" as Stage;
    insight.updatedAt = new Date().toISOString();

    activityService.push({
      actor: "user",
      actorId: "user",
      actorName: "You",
      verb: "approved",
      verbBn: "অনুমোদন করেছেন",
      target: insight.title,
      targetBn: insight.titleBn,
    });

    // 1500ms: stage → done
    setTimeout(() => {
      const live = findInsight(id);
      if (!live) return;
      live.stage = "done" as Stage;
      live.updatedAt = new Date().toISOString();
      activityService.push({
        actor: "agent",
        actorId: live.agentId,
        actorName: agentLabel(live.agentId),
        verb: "completed execution",
        verbBn: "সম্পাদন সম্পন্ন করেছে",
        target: live.title,
        targetBn: live.titleBn,
      });
    }, 1500);

    // 2700ms total: stage → logged
    setTimeout(() => {
      const live = findInsight(id);
      if (!live) return;
      live.stage = "logged" as Stage;
      live.updatedAt = new Date().toISOString();
    }, 2700);

    return { ok: true, insightId: id };
  },

  reject(id, reason) {
    const insight = findInsight(id);
    if (!insight) return { ok: false, insightId: id };
    insight.stage = "rejected" as Stage;
    insight.updatedAt = new Date().toISOString();

    activityService.push({
      actor: "user",
      actorId: "user",
      actorName: "You",
      verb: "rejected",
      verbBn: "প্রত্যাখ্যান করেছেন",
      target: insight.title,
      targetBn: insight.titleBn,
    });
    if (reason) {
      activityService.push({
        actor: "user",
        actorId: "user",
        actorName: "You",
        verb: "added note",
        verbBn: "নোট যোগ করেছেন",
        target: reason,
      });
    }
    return { ok: true, insightId: id };
  },
};
