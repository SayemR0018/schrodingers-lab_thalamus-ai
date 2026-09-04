export const heroContent = {
  eyebrow: "AI Business Brain",
  heading: "An AI Business Brain that understands how your business works.",
  body:
    "Your sales, customers, inventory, conversations, documents, and workflows already contain the answers. THALAMUS connects that context so you can understand what is happening, why it is happening, and what to do next.",
  primaryCta: "Try Thalamus",
  secondaryCta: "See how it works",
  questionLabel: "Business question answered",
  questions: [
    "Why did my sales drop this month?",
    "Which product should I promote?",
    "What should I restock?",
    "Why are customers leaving?",
  ],
};

export const problemSources = [
  "Sales",
  "Inventory",
  "Customers",
  "Marketing",
  "Documents",
  "Conversations",
  "Suppliers",
] as const;

export const coreProblems = [
  {
    id: "fragmented",
    number: "01",
    title: "Fragmented Business Knowledge",
    summary:
      "Business knowledge lives across spreadsheets, tools, conversations, documents, and other systems.",
    detail:
      "Each system can hold part of the truth, but the owner still has to connect the pieces before making a decision.",
  },
  {
    id: "task-centric",
    number: "02",
    title: "Task-Centric AI",
    summary:
      "Most AI starts with a predefined task instead of the business context behind the task.",
    detail:
      "THALAMUS starts by understanding goals, workflows, products, policies, constraints, and available data.",
  },
  {
    id: "automation-risk",
    number: "03",
    title: "Risk of Automation",
    summary:
      "AI connected to business systems needs permissions, evidence, approvals, and observable actions.",
    detail:
      "Important work should not happen just because a model suggested it. Risk and human approval matter.",
  },
] as const;

export const businessFirstFlow = [
  {
    id: "information",
    label: "Business information",
    body: "Sales, inventory, customer conversations, documents, workflows, goals, and constraints.",
  },
  {
    id: "understanding",
    label: "Business understanding",
    body: "THALAMUS interprets what the business does and how decisions are made.",
  },
  {
    id: "knowledge",
    label: "Structured business knowledge",
    body: "The context becomes a persistent model instead of a prompt rebuilt each time.",
  },
  {
    id: "needs",
    label: "Required capabilities",
    body: "The system identifies what capability is needed before choosing an agent.",
  },
  {
    id: "workforce",
    label: "Specialized AI workforce",
    body: "Relevant agents act with shared context, evidence, and control boundaries.",
  },
] as const;

export type KnowledgeNodeId =
  | "products"
  | "customers"
  | "orders"
  | "suppliers"
  | "policies"
  | "workflows"
  | "goals";

export const knowledgeNodes: Array<{
  id: KnowledgeNodeId;
  label: string;
  x: number;
  y: number;
  detail: string;
  related: KnowledgeNodeId[];
}> = [
  {
    id: "products",
    label: "Products",
    x: 50,
    y: 36,
    detail:
      "Products connect demand, inventory, supplier constraints, orders, and promotion decisions.",
    related: ["customers", "orders", "suppliers", "goals"],
  },
  {
    id: "customers",
    label: "Customers",
    x: 24,
    y: 22,
    detail:
      "Customer context connects purchase history, conversations, churn signals, and product interest.",
    related: ["products", "orders", "workflows"],
  },
  {
    id: "orders",
    label: "Orders",
    x: 76,
    y: 28,
    detail:
      "Orders show what is happening now and how demand changes across products and customers.",
    related: ["products", "customers", "workflows"],
  },
  {
    id: "suppliers",
    label: "Suppliers",
    x: 22,
    y: 68,
    detail:
      "Supplier knowledge helps explain restock timing, availability, and operational constraints.",
    related: ["products", "policies", "workflows"],
  },
  {
    id: "policies",
    label: "Policies",
    x: 50,
    y: 78,
    detail:
      "Policies define approval rules, access limits, and boundaries for actions.",
    related: ["suppliers", "workflows", "goals"],
  },
  {
    id: "workflows",
    label: "Workflows",
    x: 76,
    y: 68,
    detail:
      "Workflows describe how daily work moves from insight to action and where approval is needed.",
    related: ["customers", "orders", "suppliers", "policies", "goals"],
  },
  {
    id: "goals",
    label: "Goals",
    x: 50,
    y: 56,
    detail:
      "Goals keep recommendations tied to what the business is trying to improve.",
    related: ["products", "policies", "workflows"],
  },
];

export const knowledgeLinks: Array<[KnowledgeNodeId, KnowledgeNodeId]> = [
  ["products", "customers"],
  ["products", "orders"],
  ["products", "suppliers"],
  ["products", "goals"],
  ["customers", "orders"],
  ["customers", "workflows"],
  ["orders", "workflows"],
  ["suppliers", "policies"],
  ["suppliers", "workflows"],
  ["policies", "workflows"],
  ["policies", "goals"],
  ["workflows", "goals"],
];

export type WorkforceAgentId =
  | "sales"
  | "marketing"
  | "inventory"
  | "success"
  | "finance"
  | "policy"
  | "automation";

export const workforceAgents: Array<{
  id: WorkforceAgentId;
  name: string;
  description: string;
  state: "Active" | "Available" | "Locked";
}> = [
  {
    id: "sales",
    name: "Sales Analyst",
    description: "Explains changes in sales, demand, and customer behavior.",
    state: "Available",
  },
  {
    id: "marketing",
    name: "Marketing Agent",
    description: "Connects campaigns, products, and customer segments.",
    state: "Available",
  },
  {
    id: "inventory",
    name: "Inventory Agent",
    description: "Tracks restock needs against demand and supplier context.",
    state: "Available",
  },
  {
    id: "success",
    name: "Customer Success",
    description: "Looks for churn patterns and customer operation risks.",
    state: "Available",
  },
  {
    id: "finance",
    name: "Finance Agent",
    description: "Connects operational decisions to cash and constraints.",
    state: "Available",
  },
  {
    id: "policy",
    name: "Policy & Docs Agent",
    description: "Reads policies, documents, and approval requirements.",
    state: "Available",
  },
  {
    id: "automation",
    name: "Automation Agent",
    description: "Handles approved repeatable tasks inside control boundaries.",
    state: "Locked",
  },
];

export const workforceGoals: Array<{
  id: string;
  label: string;
  summary: string;
  activeAgents: WorkforceAgentId[];
}> = [
  {
    id: "increase-sales",
    label: "Increase sales",
    summary:
      "THALAMUS brings together demand, campaigns, customers, and product context before choosing the work.",
    activeAgents: ["sales", "marketing", "success"],
  },
  {
    id: "reduce-stockouts",
    label: "Reduce stockouts",
    summary:
      "Restock decisions need inventory, sales patterns, suppliers, and constraints in one context.",
    activeAgents: ["inventory", "sales", "policy"],
  },
  {
    id: "control-operations",
    label: "Control operations",
    summary:
      "Actions are routed through policy, risk, and approval context before work moves forward.",
    activeAgents: ["policy", "finance", "automation"],
  },
];

export const businessQuestions = [
  {
    id: "sales-change",
    category: "Business intelligence",
    question: "Why did sales change this month?",
    finding: "Sales changed after demand softened for one product line.",
    context:
      "THALAMUS would connect sales, customers, products, and historical context before explaining the change.",
    evidence: ["Sales data", "Product history", "Customer behavior", "Previous periods"],
    recommendation: "Review the affected product line and compare it with active customer segments.",
  },
  {
    id: "restock",
    category: "Inventory",
    question: "What should we restock and when?",
    finding: "A restock decision depends on demand, current stock, supplier timing, and business constraints.",
    context:
      "The point is not only what is low in stock, but why it matters and whether timing supports action.",
    evidence: ["Inventory levels", "Order trends", "Supplier context", "Product demand"],
    recommendation: "Prioritize items where demand is rising and supplier lead time is manageable.",
  },
  {
    id: "customer-churn",
    category: "Customer operations",
    question: "Why are customers leaving?",
    finding: "Customer loss is treated as a pattern across interactions, orders, and product experience.",
    context:
      "THALAMUS relates customer communication and purchase history instead of treating churn as an isolated metric.",
    evidence: ["Customer history", "Conversation patterns", "Order frequency", "Product issues"],
    recommendation: "Separate one-time drop-off from repeated signals before taking action.",
  },
  {
    id: "automation",
    category: "Workflow",
    question: "Can this operational task be handled automatically?",
    finding: "Automation depends on task risk, access, evidence, and approval requirements.",
    context:
      "THALAMUS first determines what capability is required, then routes the task through controls.",
    evidence: ["Workflow steps", "Policy limits", "Required access", "Approval rules"],
    recommendation: "Automate low-risk repeatable steps and keep consequential actions behind approval.",
  },
] as const;

export const evidenceExample = {
  label: "Sample intelligence report",
  conclusion: "Sales decreased 8.4%",
  confidence: "91%",
  note:
    "Demo values are used to explain the product concept. They are not live customer metrics.",
  basedOn: ["Sales data", "Customer history", "Product data", "Historical context"],
  sources: [
    {
      label: "Sales data",
      detail: "Monthly orders and revenue movement compared with recent history.",
      timestamp: "Sample period",
    },
    {
      label: "Customer history",
      detail: "Repeat purchase patterns and customer segment changes.",
      timestamp: "Sample period",
    },
    {
      label: "Product data",
      detail: "Product-level demand and inventory signals.",
      timestamp: "Sample period",
    },
    {
      label: "Validation checks",
      detail: "Confidence and source coverage reviewed before recommendation.",
      timestamp: "Prototype view",
    },
  ],
};

export const governancePaths = [
  {
    id: "low",
    label: "Low risk",
    outcome: "Execute approved routine step",
    body:
      "A repeatable, low-impact task can proceed when the policy context allows it.",
  },
  {
    id: "high",
    label: "High risk",
    outcome: "Request human approval",
    body:
      "A consequential action pauses for the business owner or manager before execution.",
  },
] as const;

export const integrationExamples = [
  "Google Sheets",
  "WhatsApp",
  "Facebook",
  "Instagram",
  "Payment systems",
  "Inventory systems",
  "Documents",
] as const;

export const audienceGroups = [
  {
    title: "Small & Medium Businesses",
    body: "Retail, e-commerce, service companies, distributors, and digitally enabled local businesses.",
  },
  {
    title: "Business Owners & Managers",
    body: "Decision-makers who need answers across sales, customers, inventory, suppliers, and operations.",
  },
  {
    title: "Growing Digital Businesses",
    body: "Teams using multiple SaaS and AI tools that need one layer of business context.",
  },
] as const;

export const differentiationItems = [
  {
    label: "Business-specific context",
    traditional: "Limited or task-bound",
    thalamus: "Deep business context",
  },
  {
    label: "Persistent business model",
    traditional: "Usually rebuilt per tool",
    thalamus: "Persistent representation",
  },
  {
    label: "Cross-system knowledge",
    traditional: "Scattered across systems",
    thalamus: "Unified business knowledge",
  },
  {
    label: "Dynamic AI workforce",
    traditional: "Fixed task interfaces",
    thalamus: "Selected around business need",
  },
  {
    label: "Human approval",
    traditional: "Workflow-dependent",
    thalamus: "Risk-based control",
  },
] as const;

export const finalCta = {
  heading: "Let your business become understandable.",
  body:
    "Connect fragmented business knowledge, reduce repetitive work, and support better decisions while keeping people in control.",
  primaryCta: "Try Thalamus",
  secondaryCta: "See how it works",
};
