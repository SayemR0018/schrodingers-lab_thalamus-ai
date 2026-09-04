import { dataset } from "./dataset";
import type { Insight, Stage } from "@/data/demo/insights";

export interface FeedOpts {
  stage?: Stage;
  limit?: number;
}

export interface InsightService {
  feed(opts?: FeedOpts): Insight[];
  groupedByStage(): Record<Stage, Insight[]>;
  pinned(): Insight[];
  get(id: string): Insight | undefined;
}

export const insightService: InsightService = {
  feed(opts) {
    let list = [...dataset.insights];
    if (opts?.stage) {
      list = list.filter((i) => i.stage === opts.stage);
    }
    // Sort pinned-first, then most-recently updated.
    list.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    if (opts?.limit != null) list = list.slice(0, opts.limit);
    return list;
  },
  groupedByStage() {
    const groups: Record<Stage, Insight[]> = {
      suggested: [],
      pending_approval: [],
      executing: [],
      done: [],
      logged: [],
      rejected: [],
    };
    for (const insight of dataset.insights) {
      groups[insight.stage].push(insight);
    }
    return groups;
  },
  pinned() {
    return dataset.insights.filter((i) => i.pinned);
  },
  get(id) {
    return dataset.insights.find((i) => i.id === id);
  },
};
