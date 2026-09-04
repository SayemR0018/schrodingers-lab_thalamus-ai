export type NavKey =
  | "problem"
  | "businessBrain"
  | "knowledgeGraph"
  | "aiWorkforce"
  | "questions"
  | "governance"
  | "integrations"
  | "resources"
  | "about"
  | "pricing";

export type NavItem = {
  key: NavKey;
  label: string;
  href: string;
};

/**
 * English labels remain here as a default; the Navbar component resolves
 * the active language's translation via `useTranslation()` using `key`.
 * Adding a new entry: pick a `NavKey`, set the English `label`, and add
 * the matching entry to both dictionaries under `nav.<key>`.
 */
export const navItems: NavItem[] = [
  { key: "problem", label: "The Problem", href: "#problem" },
  { key: "businessBrain", label: "AI Business Brain", href: "#how-it-works" },
  { key: "knowledgeGraph", label: "Knowledge Graph", href: "#product" },
  { key: "aiWorkforce", label: "AI Workforce", href: "#platform" },
  { key: "questions", label: "Questions", href: "#questions" },
  { key: "governance", label: "Governance", href: "#governance" },
  { key: "integrations", label: "Integrations", href: "#integrations" },
];

export const utilityNavItems: NavItem[] = [
  { key: "resources", label: "Resources", href: "#resources" },
  { key: "about", label: "About", href: "#about" },
  { key: "pricing", label: "Private Access", href: "#pricing" },
];
