export type Language = "en" | "bn";

export type InterpolationValues = Record<string, string | number>;

/**
 * The full translation interface composes one entry per namespace.
 *
 * Adding a new namespace is a three-step change:
 *   1. Define the interface below
 *   2. Add the field to `Translations`
 *   3. Add the same shape to `dictionaries/en.ts` and `dictionaries/bn.ts`
 */
export interface CommonTranslations {
  getStarted: string;
  logIn: string;
  seeHowItWorks: string;
  seeRealQuestions: string;
  hideEvidence: string;
  viewEvidence: string;
  selectToReveal: string;
  activeStage: string;
  traditional: string;
  thalamus: string;
  recommendation: string;
  context: string;
  evidence: string;
  selectedRoute: string;
  controlBeforeAction: string;
  intelligenceWithControl: string;
  demo: string;
  demoValues: string;
  prototypeView: string;
  businessGoal: string;
  recommendationLabel: string;
  contextLabel: string;
  evidenceLabel: string;
  recommendationTitle: string;
  contextTitle: string;
  evidenceTitle: string;
  selectedContext: string;
  selectedChallenge: string;
  unifiedContextTitle: string;
  businessKnowledgeGraph: string;
  business: string;
  knowledgeGraph: string;
  selectNodeToTrace: string;
  activeAvailable: string;
  active: string;
  available: string;
  locked: string;
  emailAddress: string;
  emailPlaceholder: string;
  subscribe: string;
  newsletterSuccess: string;
  privacy: string;
  terms: string;
  cookies: string;
  homeAria: string;
  openMenu: string;
  closeMenu: string;
  primaryNav: string;
  mobileNav: string;
}

export interface NavTranslations {
  problem: string;
  businessBrain: string;
  knowledgeGraph: string;
  aiWorkforce: string;
  questions: string;
  governance: string;
  integrations: string;
  resources: string;
  about: string;
  pricing: string;
  logIn: string;
  getStarted: string;
}

export interface HeroTranslations {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  questionLabel: string;
}

export interface ProblemsTranslations {
  eyebrow: string;
  heading: string;
  body: string;
  sources: {
    sales: string;
    inventory: string;
    customers: string;
    marketing: string;
    documents: string;
    conversations: string;
    suppliers: string;
  };
  coreProblems: {
    fragmented: { title: string; summary: string; detail: string };
    "task-centric": { title: string; summary: string; detail: string };
    "automation-risk": { title: string; summary: string; detail: string };
  };
  selectedChallenge: string;
  unifiedContextTitle: string;
  unifiedContextBody: string; // {{source}}
}

export interface HowItWorksTranslations {
  eyebrow: string;
  heading: string;
  subtitle: string;
  traditionalHeading: string;
  traditionalQuestion: string;
  traditionalBody: string;
  thalamusHeading: string;
  thalamusQuestion: string;
  thalamusBody: string;
  flow: {
    information: { label: string; body: string };
    understanding: { label: string; body: string };
    knowledge: { label: string; body: string };
    needs: { label: string; body: string };
    workforce: { label: string; body: string };
  };
  activeStage: string;
  selectToReveal: string;
}

export interface ProductTranslations {
  eyebrow: string;
  heading: string;
  subtitle: string;
  dt1Title: string;
  dt1Body: string;
  dt2Title: string;
  dt2Body: string;
  dt3Title: string;
  dt3Body: string;
  knowledgeGraphTitle: string;
  selectNodeToTrace: string;
  businessLabel: string;
  knowledgeGraphLabel: string;
  selectedContext: string;
  nodes: {
    products: { label: string; detail: string };
    customers: { label: string; detail: string };
    orders: { label: string; detail: string };
    suppliers: { label: string; detail: string };
    policies: { label: string; detail: string };
    workflows: { label: string; detail: string };
    goals: { label: string; detail: string };
  };
}

export interface PlatformTranslations {
  eyebrow: string;
  heading: string;
  subtitle: string;
  prototypeNote: string;
  goals: {
    "increase-sales": { label: string; summary: string };
    "reduce-stockouts": { label: string; summary: string };
    "control-operations": { label: string; summary: string };
  };
  agents: {
    sales: { name: string; description: string };
    marketing: { name: string; description: string };
    inventory: { name: string; description: string };
    success: { name: string; description: string };
    finance: { name: string; description: string };
    policy: { name: string; description: string };
    automation: { name: string; description: string };
  };
  stateActive: string;
  stateAvailable: string;
  stateLocked: string;
}

export interface QuestionsTranslations {
  eyebrow: string;
  heading: string;
  body: string;
  sampleTitle: string;
  questions: {
    "sales-change": {
      category: string;
      question: string;
      finding: string;
      context: string;
      evidence: readonly string[];
      recommendation: string;
    };
    restock: {
      category: string;
      question: string;
      finding: string;
      context: string;
      evidence: readonly string[];
      recommendation: string;
    };
    "customer-churn": {
      category: string;
      question: string;
      finding: string;
      context: string;
      evidence: readonly string[];
      recommendation: string;
    };
    automation: {
      category: string;
      question: string;
      finding: string;
      context: string;
      evidence: readonly string[];
      recommendation: string;
    };
  };
}

export interface GovernanceTranslations {
  eyebrow: string;
  heading: string;
  subtitle: string;
  evidence: {
    label: string;
    conclusionLabel: string;
    confidenceLabel: string;
    note: string;
    basedOn: readonly string[];
    sources: ReadonlyArray<{
      label: string;
      detail: string;
      timestamp: string;
    }>;
  };
  control: {
    eyebrow: string;
    title: string;
    recommendationLabel: string;
    riskEvaluationLabel: string;
    selectedRouteLabel: string;
    paths: {
      low: { label: string; outcome: string; body: string };
      high: { label: string; outcome: string; body: string };
    };
  };
}

export interface IntegrationsTranslations {
  eyebrow: string;
  heading: string;
  subtitle: string;
  note: string;
  items: readonly string[];
}

export interface AudienceTranslations {
  eyebrow: string;
  heading: string;
  groups: ReadonlyArray<{ title: string; body: string }>;
  diffEyebrow: string;
  diffHeading: string;
  diffItems: ReadonlyArray<{
    label: string;
    traditional: string;
    thalamus: string;
  }>;
}

export interface AboutTranslations {
  eyebrow: string;
  title: string;
  body: string;
}

export interface MetricsTranslations {
  heading: string;
  subtitle: string;
  metrics: ReadonlyArray<{ value: string; label: string }>;
}

export interface ResourcesTranslations {
  eyebrow: string;
  heading: string;
  subtitle: string;
  items: ReadonlyArray<{ label: string; detail: string }>;
}

export interface PricingTranslations {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface NewsletterTranslations {
  heading: string;
  subtitle: string;
}

export interface FooterTranslations {
  tagline: string;
  columns: ReadonlyArray<{
    title: string;
    links: ReadonlyArray<{ label: string }>;
  }>;
  utility: ReadonlyArray<{ label: string; detail: string }>;
  copyright: string;
  ariaPrefix: string; // for the social link aria-label; e.g. "Follow us on"
}

export interface LanguageSettingsTranslations {
  en: string;
  bn: string;
  switcherAria: string;
  englishLabel: string;
  banglaLabel: string;
}

export interface WorkspaceTranslations {
  homeAria: string;
  eyebrow: string;
  contextStatus: string;
  welcomeHeading: string; // {{name}}
  welcomeBody: string;
  items: {
    industry: string;
    products: string;
    customers: string;
    goals: string;
    connections: string;
    description: string;
  };
  emptyPriorities: string;
  noSources: string;
  sourceSingular: string; // {{count}}
  sourcePlural: string; // {{count}}
  refineCta: string;
  viewConceptCta: string;
}

export interface OnboardingTranslations {
  homeAria: string;
  progressAria: string;
  steps: {
    business: string;
    goals: string;
    connect: string;
    understanding: string;
  };
  businessProfile: {
    eyebrow: string;
    title: string;
    body: string;
    examplesNote: string;
    fields: {
      companyName: { label: string; placeholder: string };
      industry: { label: string; placeholder: string };
      products: { label: string; placeholder: string };
      customers: { label: string; placeholder: string };
      description: { label: string; placeholder: string };
    };
  };
  goals: {
    eyebrow: string;
    title: string;
    body: string;
    selectedCount: string; // {{count}}
    items: {
      "grow-repeat-purchases": string;
      "reduce-stockouts": string;
      "cut-slow-moving-inventory": string;
      "improve-customer-response-time": string;
      "cut-marketing-waste": string;
      "expand-to-new-channels": string;
      "improve-cashflow-visibility": string;
    };
  };
  connect: {
    eyebrow: string;
    title: string;
    body: string;
    prototypeNote: string;
    connectCta: string;
    demoCta: string;
    options: {
      "google-sheets": { name: string; sheetUrl: { label: string; placeholder: string } };
      shopify: {
        name: string;
        storeDomain: { label: string; placeholder: string };
        accessToken: { label: string; placeholder: string };
      };
      whatsapp: {
        name: string;
        countryCode: { label: string; placeholder: string };
        businessNumber: { label: string; placeholder: string };
      };
      facebook: { name: string; pageUrl: { label: string; placeholder: string } };
      instagram: { name: string; profileUrl: { label: string; placeholder: string } };
      "csv-excel": { name: string; uploadFile: { label: string; placeholder: string } };
      documents: { name: string; uploadFile: { label: string; placeholder: string } };
    };
    status: {
      connecting: string;
      reading: string;
      preparing: string;
      connected: string;
      idle: string;
    };
  };
  understanding: {
    eyebrow: string;
    titleReady: string;
    titleWorking: string;
    bodyReady: string; // {{name}}
    bodyWorking: string;
    fallbackBusiness: string;
    stages: {
      "reading-profile": string;
      "identifying-products": string;
      "understanding-customers": string;
      "mapping-goals": string;
      "organizing-data": string;
      "building-context": string;
      "preparing-workspace": string;
    };
  };
  navigation: {
    back: string;
    continue: string;
    finish: string;
    preparingWorkspace: string;
    skipForNow: string;
  };
  connectionForm: {
    eyebrow: string;
    title: string; // {{name}}
    closeAria: string;
    prototypeNote: string;
    submit: string;
  };
  fallbackBusinessName: string;
}

export interface Translations {
  common: CommonTranslations;
  nav: NavTranslations;
  hero: HeroTranslations;
  problems: ProblemsTranslations;
  howItWorks: HowItWorksTranslations;
  product: ProductTranslations;
  platform: PlatformTranslations;
  questions: QuestionsTranslations;
  governance: GovernanceTranslations;
  integrations: IntegrationsTranslations;
  audience: AudienceTranslations;
  about: AboutTranslations;
  metrics: MetricsTranslations;
  resources: ResourcesTranslations;
  pricing: PricingTranslations;
  newsletter: NewsletterTranslations;
  footer: FooterTranslations;
  language: LanguageSettingsTranslations;
  workspace: WorkspaceTranslations;
  onboarding: OnboardingTranslations;
}
