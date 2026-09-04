export type ProcessStep = {
  id: string;
  number: string;
  title: string;
  body: string;
};

export const processSteps: ProcessStep[] = [
  {
    id: "understand",
    number: "01",
    title: "Understand",
    body: "Thalamus reads the business as it actually operates — systems, language, constraints, and intent.",
  },
  {
    id: "reason",
    number: "02",
    title: "Reason",
    body: "The core evaluates objectives against available context before any work is assigned.",
  },
  {
    id: "delegate",
    number: "03",
    title: "Delegate",
    body: "Specialized agents receive the relevant slice of work, not a generic prompt dump.",
  },
  {
    id: "execute",
    number: "04",
    title: "Execute",
    body: "Agents act across connected tools — research, outreach, analysis — while remaining coordinated.",
  },
  {
    id: "learn",
    number: "05",
    title: "Learn",
    body: "Outcomes feed back into shared context, so the next cycle is more precise than the last.",
  },
];
