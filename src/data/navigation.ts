import {
  LayoutDashboard,
  MessageSquare,
  FileBarChart,
  Brain,
  Users,
  Lightbulb,
  CheckSquare,
  Activity,
  Plug,
  Database,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  /** i18n key under `nav.*` (e.g. `nav.overview`). Consumers resolve via `t()`. */
  labelKey: string;
  /** English fallback label kept for SSR / non-translated contexts. */
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: number;
}

export interface NavGroup {
  id: string;
  /** i18n key under `nav.group.*` (e.g. `nav.group.workspace`). */
  labelKey: string;
  /** English fallback label. */
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    id: "workspace",
    labelKey: "nav.group.workspace",
    label: "Workspace",
    items: [
      { id: "overview", labelKey: "nav.overview", label: "Overview", href: "/workspace", icon: LayoutDashboard },
      { id: "ask", labelKey: "nav.askThalamus", label: "Ask Thalamus", href: "/workspace/ask", icon: MessageSquare },
      { id: "reports", labelKey: "nav.reports", label: "Reports", href: "/workspace/reports", icon: FileBarChart },
    ],
  },
  {
    id: "intelligence",
    labelKey: "nav.group.intelligence",
    label: "Intelligence",
    items: [
      { id: "business-brain", labelKey: "nav.businessBrain", label: "Business Brain", href: "/workspace/brain", icon: Brain },
      { id: "workforce", labelKey: "nav.workforce", label: "AI Workforce", href: "/workspace/workforce", icon: Users },
      { id: "insights", labelKey: "nav.insights", label: "Insights", href: "/workspace/insights", icon: Lightbulb },
    ],
  },
  {
    id: "control",
    labelKey: "nav.group.control",
    label: "Control",
    items: [
      { id: "approvals", labelKey: "nav.approvals", label: "Approvals", href: "/workspace/approvals", icon: CheckSquare },
      { id: "activity", labelKey: "nav.activity", label: "Activity", href: "/workspace/activity", icon: Activity },
    ],
  },
  {
    id: "system",
    labelKey: "nav.group.system",
    label: "System",
    items: [
      { id: "integrations", labelKey: "nav.integrations", label: "Integrations", href: "/workspace/integrations", icon: Plug },
      { id: "data-sources", labelKey: "nav.dataSources", label: "Data Sources", href: "/workspace/data-sources", icon: Database },
      { id: "settings", labelKey: "nav.settings", label: "Settings", href: "/workspace/settings", icon: Settings },
    ],
  },
];
