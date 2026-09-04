export interface ActivityItem {
  id: string;
  actor: "user" | "agent" | "system";
  actorId: string;
  actorName: string;
  verb: string;
  verbBn: string;
  target?: string;
  targetBn?: string;
  isoDate: string;
}

function isoAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

export function buildActivity(): ActivityItem[] {
  return [
    {
      id: "act-1",
      actor: "agent",
      actorId: "sales-analyst",
      actorName: "Sales Analyst",
      verb: "completed report",
      verbBn: "রিপোর্ট সম্পন্ন করেছে",
      target: "Daily revenue pulse",
      targetBn: "দৈনিক রাজস্ব পালস",
      isoDate: isoAgo(8),
    },
    {
      id: "act-2",
      actor: "system",
      actorId: "thalamus",
      actorName: "Thalamus",
      verb: "synced integrations",
      verbBn: "ইন্টিগ্রেশন সিঙ্ক করেছে",
      target: "Shopify + POS",
      targetBn: "Shopify + POS",
      isoDate: isoAgo(28),
    },
    {
      id: "act-3",
      actor: "agent",
      actorId: "inventory-agent",
      actorName: "Inventory Agent",
      verb: "detected stockout risk",
      verbBn: "স্টকআউট ঝুঁকি শনাক্ত করেছে",
      target: "APP-0042",
      targetBn: "APP-0042",
      isoDate: isoAgo(45),
    },
    {
      id: "act-4",
      actor: "agent",
      actorId: "customer-success",
      actorName: "Customer Success",
      verb: "analyzed repeat cohort",
      verbBn: "পুনরায় ক্রেতা কোহোর্ট বিশ্লেষণ করেছে",
      isoDate: isoAgo(75),
    },
    {
      id: "act-5",
      actor: "system",
      actorId: "thalamus",
      actorName: "Thalamus",
      verb: "ran daily sync",
      verbBn: "দৈনিক সিঙ্ক চালিয়েছে",
      isoDate: isoAgo(180),
    },
    {
      id: "act-6",
      actor: "agent",
      actorId: "marketing-agent",
      actorName: "Marketing Agent",
      verb: "flagged campaign ROI",
      verbBn: "ক্যাম্পেইন ROI চিহ্নিত করেছে",
      target: "Weekend basket",
      targetBn: "উইকেন্ড বাস্কেট",
      isoDate: isoAgo(360),
    },
  ];
}
