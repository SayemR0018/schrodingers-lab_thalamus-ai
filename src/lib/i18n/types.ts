import type { Language } from "@/store/app.store";

export type { Language };

export type InterpolationValues = Record<string, string | number>;

/**
 * Compose the full Translations interface from namespace interfaces.
 * Each namespace interface maps the dot-path key segment to its string value.
 * Adding a new namespace requires:
 *   1. Adding the namespace field to `Translations` below
 *   2. Adding the namespace interface here
 *   3. Adding the same shape to `en.ts` and `bn.ts`
 */
export interface CommonTranslations {
  active: string;
  locked: string;
  cancel: string;
  save: string;
  loading: string;
  search: string;
  close: string;
  back: string;
  more: string;
  viewAll: string;
  approve: string;
  reject: string;
  refresh: string;
  retry: string;
  open: string;
  details: string;
  remove: string;
  edit: string;
  delete: string;
  add: string;
  import: string;
  export: string;
  connect: string;
  disconnect: string;
  connected: string;
  available: string;
  pending: string;
  completed: string;
  failed: string;
  high: string;
  medium: string;
  low: string;
  all: string;
  today: string;
  yesterday: string;
  justNow: string;
}

export interface NavGroupTranslations {
  workspace: string;
  intelligence: string;
  control: string;
  system: string;
}

export interface NavTranslations {
  overview: string;
  askThalamus: string;
  reports: string;
  businessBrain: string;
  workforce: string;
  insights: string;
  approvals: string;
  activity: string;
  integrations: string;
  dataSources: string;
  settings: string;
  group: NavGroupTranslations;
}

export interface TopBarTranslations {
  searchPlaceholder: string;
  notifications: string;
  hideAssistant: string;
  showAssistant: string;
  profile: string;
}

export interface AssistantHeaderTranslations {
  title: string;
  subtitle: string;
}

export interface AssistantInputTranslations {
  placeholder: string;
  send: string;
  attachFile: string;
  disclaimer: string;
}

export interface AssistantConversationTranslations {
  you: string;
  thalamus: string;
  addedToData: string;
  justNow: string;
}

export interface AssistantProcessingTranslations {
  understanding: string;
  context: string;
  analysis: string;
  synthesis: string;
  complete: string;
  agentsInvolved: string;
}

export interface AssistantContextTranslations {
  title: string;
  entities: string;
  relations: string;
  description: string;
  lockedMessage: string;
  lockedDescription: string;
  askAbout: string; // supports {{name}}
}

export interface AssistantIntroTranslations {
  title: string;
  body: string;
}

export interface AssistantChatTranslations {
  analyzing: string;
  reviewing: string;
  syncing: string;
  analysisComplete: string;
  reportReady: string; // {{count}}
  reportReadyBody: string; // {{count}}
  businessInfoDetected: string;
  addedToContext: string; // {{key}}, {{value}}
  contextVersion: string; // {{version}}
  customQuestionBody: string; // {{snippet}}, {{version}}
  customQuestionHeader: string; // {{snippet}}
  genericResponse: string; // {{snippet}}
  genericQuestionBody: string; // {{snippet}}
}

export interface AssistantSuggestedTranslations {
  heading: string;
}

export interface AssistantActionsTranslations {
  openReport: string;
  addToBusinessData: string;
}

export interface AssistantTranslations {
  header: AssistantHeaderTranslations;
  input: AssistantInputTranslations;
  conversation: AssistantConversationTranslations;
  processing: AssistantProcessingTranslations;
  context: AssistantContextTranslations;
  suggested: AssistantSuggestedTranslations;
  actions: AssistantActionsTranslations;
  intro: AssistantIntroTranslations;
  chat: AssistantChatTranslations;
}

export interface SettingsThemeTranslations {
  light: string;
  lightDesc: string;
  dark: string;
  darkDesc: string;
  system: string;
  systemDesc: string;
}

export interface SettingsAppearanceTranslations {
  title: string;
  subtitle: string;
  noteLabel: string;
  note: string;
}

export interface SettingsLanguageTranslations {
  title: string;
  description: string;
  enLabel: string;
  bnLabel: string;
}

export interface SettingsTranslations {
  appearance: SettingsAppearanceTranslations;
  theme: SettingsThemeTranslations;
  language: SettingsLanguageTranslations;
  tabSettings: string;
  subtitle: string;
  tabAccount: string;
  tabWorkspace: string;
  tabAppearance: string;
  tabNotifications: string;
  tabPrivacy: string;
  tabSubscription: string;
  tabAbout: string;
}

export interface AuthTranslations {
  welcomeBack: string;
  login: string;
  signingIn: string;
  prototypeNotice: string;
  emailLabel: string;
  passwordLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  errorEmpty: string;
  errorInvalid: string;
}

export interface ActivityPageTranslations {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyBody: string;
  sectionToday: string;
  sectionYesterday: string;
  noActor: string;
}

export interface ApprovalsPageTranslations {
  title: string;
  subtitlePending: string;
  subtitleEmpty: string;
  emptyTitle: string;
  emptyBody: string;
}

export interface DataSourcesPageTranslations {
  title: string;
  subtitle: string;
  search: string;
  tabRecords: string;
  tabRecent: string;
  tabHistory: string;
  tabUpload: string;
  noRecords: string;
  noRecordsBody: string;
  noChanges: string;
  noHistory: string;
  recentChanges: string;
  versionHistory: string;
  uploadTitle: string;
  uploadBody: string;
  chooseFile: string;
  uploadCta: string;
  fields: string;
  lastUpdated: string;
  records: string;
  addRecord: string;
}

export interface InsightsPageTranslations {
  title: string;
  subtitleAttn: string;
  subtitle: string;
  noInsights: string;
  noInsightsBody: string;
  catAll: string;
  catSales: string;
  catInventory: string;
  catCustomer: string;
  catFinance: string;
  catMarketing: string;
}

export interface IntegrationsPageTranslations {
  title: string;
  subtitle: string;
  tabAll: string;
  tabConnected: string;
  tabAvailable: string;
  connectCta: string;
  stageConnecting: string;
  stagePermissions: string;
  stageSyncing: string;
  stageMapping: string;
  stageComplete: string;
  dialogTitle: string;
  dialogDescription: string;
  recordsToSync: string;
  startSync: string;
  permsRead: string;
  permsWrite: string;
}

export interface OnboardingPageTranslations {
  step1Title: string;
  step1Body: string;
  step2Title: string;
  step2Body: string;
  step3Title: string;
  step3Body: string;
  businessNameLabel: string;
  businessNamePlaceholder: string;
  industryLabel: string;
  continue: string;
  finish: string;
  greeting: string;
  greetingBn: string;
  helpHint: string;
  welcomeSubtitle: string;
  bulletAsk: string;
  bulletInsights: string;
  bulletApprovals: string;
  completeBadge: string;
  completeBody: string;
  skip: string;
}

export interface ReportsPageTranslations {
  title: string;
  subtitle: string;
  filterAll: string;
  noReports: string;
  noReportsBody: string;
  open: string;
}

export interface ReportsDetailTranslations {
  back: string;
  executiveSummary: string;
  contextUsed: string;
  keyFindings: string;
  recommendation: string;
  evidence: string;
  evidenceSources: string; // {{count}}
  evidenceShowMore: string; // {{count}}
  evidenceViewAll: string;
  evidenceTimeRange: string;
  evidenceRelevantFinding: string;
  evidenceRecords: string; // {{count}}
  generatedAt: string; // {{time}}
  agentsCount: string; // {{count}}
  analyzedBy: string;
  confidence: string;
  riskLow: string;
  riskMedium: string;
  riskHigh: string;
  riskCritical: string;
  reviewAction: string;
}

export interface WorkforcePageTranslations {
  title: string;
  subtitle: string;
  active: string;
  locked: string;
  noAgents: string;
  capabilityTitle: string;
  metricsTitle: string;
  recentActivity: string;
}

export interface WorkforceDetailTranslations {
  back: string;
  metrics: string;
  capabilities: string;
  recentInsights: string;
  noInsights: string;
  riskLow: string;
  riskMedium: string;
  riskHigh: string;
}

export interface InsightsDetailTranslations {
  back: string;
  evidence: string;
  affectedEntities: string;
  relatedAgents: string;
  confidence: string;
  recommendation: string;
  status: string;
}

export interface AskPageTranslations {
  subtitle: string;
  agentsWillAnalyze: string; // {{count}}
  redirecting: string;
}

export interface ApprovalsCardTranslations {
  riskLow: string;
  riskMedium: string;
  riskHigh: string;
  riskCritical: string;
  reason: string;
  approved: string;
  rejected: string;
}

export interface BrainTranslations {
  legendActive: string;
  legendLocked: string;
  legendDataFlow: string;
  legendInfoSync: string;
  knowledgeGraphTitle: string;
  knowledgeGraphDescription: string;
  knowledgeGraphEntities: string;
  knowledgeGraphRelations: string;
  knowledgeGraphPolicies: string;
  knowledgeGraphLastUpdated: string;
  agentToday: string;
  agentStatusActive: string;
  agentStatusLocked: string;
  agentActivityIdle: string;
  agentActivityAnalyzing: string;
  agentActivityReviewing: string;
  agentActivitySyncing: string;
}

export interface OverviewTranslations {
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  subtitle: string;
  subtitleBn: string;
  revenue: string;
  customers: string;
  inventory: string;
  importantToday: string;
  recommendedActions: string;
  recentActivity: string;
  nothingImportant: string;
  noActivity: string;
  noApprovals: string;
  nudgeConnect: string;
  nudgeConnectBody: string;
  nudgeDhaka: string;
  nudgeDhakaBody: string;
  view: string;
  connectCta: string;
  approve: string;
  details: string;
  viewAll: string;
  riskLow: string;
  riskMedium: string;
  riskHigh: string;
  stageSuggested: string;
  stagePending: string;
  stageExecuting: string;
  stageDone: string;
  stageLogged: string;
  stageRejected: string;
  greetingIntro: string;
  // Risk levels on insight pills
  pillLow: string;
  pillMedium: string;
  pillHigh: string;
}

export interface Translations {
  common: CommonTranslations;
  nav: NavTranslations;
  topbar: TopBarTranslations;
  assistant: AssistantTranslations;
  settings: SettingsTranslations;
  auth: AuthTranslations;
  overview: OverviewTranslations;
  activity: ActivityPageTranslations;
  approvals: ApprovalsPageTranslations;
  dataSources: DataSourcesPageTranslations;
  insights: InsightsPageTranslations;
  integrations: IntegrationsPageTranslations;
  onboarding: OnboardingPageTranslations;
  reports: ReportsPageTranslations;
  reportsDetail: ReportsDetailTranslations;
  workforce: WorkforcePageTranslations;
  workforceDetail: WorkforceDetailTranslations;
  insightsDetail: InsightsDetailTranslations;
  askPage: AskPageTranslations;
  approvalsCard: ApprovalsCardTranslations;
  brain: BrainTranslations;
}
