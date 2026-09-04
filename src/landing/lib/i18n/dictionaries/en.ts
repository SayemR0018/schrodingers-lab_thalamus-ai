import type { Translations } from "../types";

export const en: Translations = {
  common: {
    getStarted: "Get Started",
    logIn: "Log in",
    seeHowItWorks: "See how it works",
    seeRealQuestions: "See real business questions answered",
    hideEvidence: "Hide evidence",
    viewEvidence: "View evidence",
    selectToReveal: "Select to reveal how this stage changes the work.",
    activeStage: "Active stage",
    traditional: "Traditional AI",
    thalamus: "THALAMUS",
    recommendation: "Recommendation",
    context: "Context",
    evidence: "Evidence",
    selectedRoute: "Selected route",
    controlBeforeAction: "Control before action",
    intelligenceWithControl: "Intelligence without losing control.",
    demo: "Demo",
    demoValues: "Demo values",
    prototypeView: "Prototype view",
    businessGoal: "Business goal",
    recommendationLabel: "Recommendation",
    contextLabel: "Context",
    evidenceLabel: "Evidence",
    recommendationTitle: "Recommendation",
    contextTitle: "Context",
    evidenceTitle: "Evidence",
    selectedContext: "Selected context",
    selectedChallenge: "Selected challenge",
    unifiedContextTitle: "Unified business context",
    businessKnowledgeGraph: "Business Knowledge Graph",
    business: "Business",
    knowledgeGraph: "Knowledge Graph",
    selectNodeToTrace: "Select a node to trace context",
    activeAvailable: "Available",
    active: "Active",
    available: "Available",
    locked: "Locked",
    emailAddress: "Email address",
    emailPlaceholder: "Enter your email",
    subscribe: "Subscribe",
    newsletterSuccess:
      "Noted. We'll write when there is something worth sending.",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
    homeAria: "Thalamus AI home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primaryNav: "Primary",
    mobileNav: "Mobile",
  },
  nav: {
    problem: "The Problem",
    businessBrain: "AI Business Brain",
    knowledgeGraph: "Knowledge Graph",
    aiWorkforce: "AI Workforce",
    questions: "Questions",
    governance: "Governance",
    integrations: "Integrations",
    resources: "Resources",
    about: "About",
    pricing: "Private Access",
    logIn: "Log in",
    getStarted: "Get Started",
  },
  hero: {
    eyebrow: "AI Business Brain",
    heading:
      "An AI Business Brain that understands how your business works.",
    body:
      "Your sales, customers, inventory, conversations, documents, and workflows already contain the answers. THALAMUS connects that context so you can understand what is happening, why it is happening, and what to do next.",
    primaryCta: "Try Thalamus",
    secondaryCta: "See how it works",
    questionLabel: "Business question answered",
  },
  problems: {
    eyebrow: "The Problem",
    heading: "Your business has data. It does not have unified intelligence.",
    body:
      "Sales, inventory, customer conversations, marketing, and documents can each tell part of the truth. The hard part is connecting them before a decision has to be made.",
    sources: {
      sales: "Sales",
      inventory: "Inventory",
      customers: "Customers",
      marketing: "Marketing",
      documents: "Documents",
      conversations: "Conversations",
      suppliers: "Suppliers",
    },
    coreProblems: {
      fragmented: {
        title: "Fragmented Business Knowledge",
        summary:
          "Business knowledge lives across spreadsheets, tools, conversations, documents, and other systems.",
        detail:
          "Each system can hold part of the truth, but the owner still has to connect the pieces before making a decision.",
      },
      "task-centric": {
        title: "Task-Centric AI",
        summary:
          "Most AI starts with a predefined task instead of the business context behind the task.",
        detail:
          "THALAMUS starts by understanding goals, workflows, products, policies, constraints, and available data.",
      },
      "automation-risk": {
        title: "Risk of Automation",
        summary:
          "AI connected to business systems needs permissions, evidence, approvals, and observable actions.",
        detail:
          "Important work should not happen just because a model suggested it. Risk and human approval matter.",
      },
    },
    selectedChallenge: "Selected challenge",
    unifiedContextTitle: "Unified business context",
    unifiedContextBody:
      "{{source}} becomes part of the same working context as goals, workflows, policies, and the other business signals.",
  },
  howItWorks: {
    eyebrow: "How it works",
    heading: "From AI tools to an AI Business Brain.",
    subtitle:
      "Traditional AI starts by asking which agent to deploy. THALAMUS starts with the business itself, then identifies the capabilities needed to support it.",
    traditionalHeading: "Traditional AI",
    traditionalQuestion: "Which AI agent should I use?",
    traditionalBody:
      "The work begins with a tool or task, so the business context has to be rebuilt around that tool.",
    thalamusHeading: "THALAMUS",
    thalamusQuestion: "What does this business actually need?",
    thalamusBody:
      "The business comes first. Agents are selected around shared context, evidence, permissions, and the intended outcome.",
    flow: {
      information: {
        label: "Business information",
        body: "Sales, inventory, customer conversations, documents, workflows, goals, and constraints.",
      },
      understanding: {
        label: "Business understanding",
        body: "THALAMUS interprets what the business does and how decisions are made.",
      },
      knowledge: {
        label: "Structured business knowledge",
        body: "The context becomes a persistent model instead of a prompt rebuilt each time.",
      },
      needs: {
        label: "Required capabilities",
        body: "The system identifies what capability is needed before choosing an agent.",
      },
      workforce: {
        label: "Specialized AI workforce",
        body: "Relevant agents act with shared context, evidence, and control boundaries.",
      },
    },
    activeStage: "Active stage",
    selectToReveal: "Select to reveal how this stage changes the work.",
  },
  product: {
    eyebrow: "Product",
    heading: "One business. One persistent context.",
    subtitle:
      "THALAMUS turns scattered business information into a structured model of products, customers, orders, suppliers, policies, workflows, and goals.",
    dt1Title: "Persistent business model",
    dt1Body:
      "The business does not have to be explained again every time a new question is asked.",
    dt2Title: "Connected relationships",
    dt2Body:
      "A product can connect to customers, orders, supplier limits, workflows, and business goals.",
    dt3Title: "Shared context for agents",
    dt3Body:
      "Specialized agents reason from the same business picture instead of separate prompt fragments.",
    knowledgeGraphTitle: "Business Knowledge Graph",
    selectNodeToTrace: "Select a node to trace context",
    businessLabel: "Business",
    knowledgeGraphLabel: "Knowledge Graph",
    selectedContext: "Selected context",
    nodes: {
      products: {
        label: "Products",
        detail:
          "Products connect demand, inventory, supplier constraints, orders, and promotion decisions.",
      },
      customers: {
        label: "Customers",
        detail:
          "Customer context connects purchase history, conversations, churn signals, and product interest.",
      },
      orders: {
        label: "Orders",
        detail:
          "Orders show what is happening now and how demand changes across products and customers.",
      },
      suppliers: {
        label: "Suppliers",
        detail:
          "Supplier knowledge helps explain restock timing, availability, and operational constraints.",
      },
      policies: {
        label: "Policies",
        detail:
          "Policies define approval rules, access limits, and boundaries for actions.",
      },
      workflows: {
        label: "Workflows",
        detail:
          "Workflows describe how daily work moves from insight to action and where approval is needed.",
      },
      goals: {
        label: "Goals",
        detail:
          "Goals keep recommendations tied to what the business is trying to improve.",
      },
    },
  },
  platform: {
    eyebrow: "AI Workforce",
    heading: "The workforce adapts to the business.",
    subtitle:
      "THALAMUS does not begin with the same fixed collection of agents for every company. It starts with the objective, then selects the relevant capabilities around shared business context.",
    prototypeNote:
      "This is a visual prototype of workforce selection, not a claim that live orchestration has been implemented in this frontend.",
    goals: {
      "increase-sales": {
        label: "Increase sales",
        summary:
          "THALAMUS brings together demand, campaigns, customers, and product context before choosing the work.",
      },
      "reduce-stockouts": {
        label: "Reduce stockouts",
        summary:
          "Restock decisions need inventory, sales patterns, suppliers, and constraints in one context.",
      },
      "control-operations": {
        label: "Control operations",
        summary:
          "Actions are routed through policy, risk, and approval context before work moves forward.",
      },
    },
    agents: {
      sales: {
        name: "Sales Analyst",
        description:
          "Explains changes in sales, demand, and customer behavior.",
      },
      marketing: {
        name: "Marketing Agent",
        description:
          "Connects campaigns, products, and customer segments.",
      },
      inventory: {
        name: "Inventory Agent",
        description:
          "Tracks restock needs against demand and supplier context.",
      },
      success: {
        name: "Customer Success",
        description:
          "Looks for churn patterns and customer operation risks.",
      },
      finance: {
        name: "Finance Agent",
        description:
          "Connects operational decisions to cash and constraints.",
      },
      policy: {
        name: "Policy & Docs Agent",
        description:
          "Reads policies, documents, and approval requirements.",
      },
      automation: {
        name: "Automation Agent",
        description:
          "Handles approved repeatable tasks inside control boundaries.",
      },
    },
    stateActive: "Active",
    stateAvailable: "Available",
    stateLocked: "Locked",
  },
  questions: {
    eyebrow: "Questions",
    heading: "Ask the questions that actually matter.",
    body:
      "THALAMUS is meant to connect business context before producing an answer. The result should feel like an intelligence brief, not a generic chat response.",
    sampleTitle: "Sample intelligence result",
    questions: {
      "sales-change": {
        category: "Business intelligence",
        question: "Why did sales change this month?",
        finding:
          "Sales changed after demand softened for one product line.",
        context:
          "THALAMUS would connect sales, customers, products, and historical context before explaining the change.",
        evidence: [
          "Sales data",
          "Product history",
          "Customer behavior",
          "Previous periods",
        ],
        recommendation:
          "Review the affected product line and compare it with active customer segments.",
      },
      restock: {
        category: "Inventory",
        question: "What should we restock and when?",
        finding:
          "A restock decision depends on demand, current stock, supplier timing, and business constraints.",
        context:
          "The point is not only what is low in stock, but why it matters and whether timing supports action.",
        evidence: [
          "Inventory levels",
          "Order trends",
          "Supplier context",
          "Product demand",
        ],
        recommendation:
          "Prioritize items where demand is rising and supplier lead time is manageable.",
      },
      "customer-churn": {
        category: "Customer operations",
        question: "Why are customers leaving?",
        finding:
          "Customer loss is treated as a pattern across interactions, orders, and product experience.",
        context:
          "THALAMUS relates customer communication and purchase history instead of treating churn as an isolated metric.",
        evidence: [
          "Customer history",
          "Conversation patterns",
          "Order frequency",
          "Product issues",
        ],
        recommendation:
          "Separate one-time drop-off from repeated signals before taking action.",
      },
      automation: {
        category: "Workflow",
        question: "Can this operational task be handled automatically?",
        finding:
          "Automation depends on task risk, access, evidence, and approval requirements.",
        context:
          "THALAMUS first determines what capability is required, then routes the task through controls.",
        evidence: [
          "Workflow steps",
          "Policy limits",
          "Required access",
          "Approval rules",
        ],
        recommendation:
          "Automate low-risk repeatable steps and keep consequential actions behind approval.",
      },
    },
  },
  governance: {
    eyebrow: "Evidence and Control",
    heading: "Do not just get an answer. Understand why, then decide what acts.",
    subtitle:
      "THALAMUS should make reasoning, evidence, confidence, and approval status visible instead of hiding consequential work behind a black box.",
    evidence: {
      label: "Sample intelligence report",
      conclusionLabel: "Conclusion",
      confidenceLabel: "Confidence",
      note:
        "Demo values are used to explain the product concept. They are not live customer metrics.",
      basedOn: [
        "Sales data",
        "Customer history",
        "Product data",
        "Historical context",
      ],
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
    },
    control: {
      eyebrow: "Control before action",
      title: "Intelligence without losing control.",
      recommendationLabel: "Recommendation",
      riskEvaluationLabel: "Risk evaluation",
      selectedRouteLabel: "Selected route",
      paths: {
        low: {
          label: "Low risk",
          outcome: "Execute approved routine step",
          body: "A repeatable, low-impact task can proceed when the policy context allows it.",
        },
        high: {
          label: "High risk",
          outcome: "Request human approval",
          body: "A consequential action pauses for the business owner or manager before execution.",
        },
      },
    },
  },
  integrations: {
    eyebrow: "Connect your business",
    heading: "Built to work with the systems your business already uses.",
    subtitle:
      "THALAMUS is designed around the reality that business information already lives in spreadsheets, messages, documents, payment tools, social channels, and inventory systems.",
    note:
      "These examples describe intended business-system categories, not a claim that every connector is live in this frontend.",
    items: [
      "Google Sheets",
      "WhatsApp",
      "Facebook",
      "Instagram",
      "Payment systems",
      "Inventory systems",
      "Documents",
    ],
  },
  audience: {
    eyebrow: "Who it is for",
    heading: "Built for businesses that have outgrown disconnected tools.",
    groups: [
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
    ],
    diffEyebrow: "Why THALAMUS",
    diffHeading:
      "Not more disconnected AI. A business-first intelligence layer.",
    diffItems: [
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
    ],
  },
  about: {
    eyebrow: "About",
    title: "A relay for business intelligence.",
    body:
      "The thalamus is not where thinking happens. It is where signals are coordinated, routed, filtered, and handed to the systems that can act. THALAMUS AI is built on that idea: a business-first intelligence layer that keeps context connected before any agent or automation is asked to act.",
  },
  metrics: {
    heading: "Built around business understanding",
    subtitle:
      "THALAMUS is positioned around persistent context, grounded insight, controlled action, and continuous learning from outcomes.",
    metrics: [
      { value: "Context", label: "Business-first understanding" },
      { value: "Evidence", label: "Grounded recommendations" },
      { value: "Control", label: "Human approval for risk" },
      { value: "Loop", label: "Outcomes update context" },
    ],
  },
  resources: {
    eyebrow: "Resources",
    heading: "Explore the product concepts.",
    subtitle:
      "The landing page now points to internal explanations rather than claiming unavailable docs, webinars, or API material.",
    items: [
      {
        label: "Business Brain",
        detail: "How persistent context works",
      },
      {
        label: "AI Workforce",
        detail: "How objectives map to agents",
      },
      {
        label: "Questions",
        detail: "Examples of grounded business answers",
      },
      {
        label: "Governance",
        detail: "Evidence, confidence, and approval",
      },
    ],
  },
  pricing: {
    eyebrow: "Private access",
    heading: "Let your business become understandable.",
    body: "Connect fragmented business knowledge, reduce repetitive work, and support better decisions while keeping people in control.",
    primaryCta: "Try Thalamus",
    secondaryCta: "See how it works",
  },
  newsletter: {
    heading: "Follow the private-access build.",
    subtitle:
      "Get concise updates as THALAMUS turns the Business Brain concept into a working product experience.",
  },
  footer: {
    tagline:
      "Technology that adapts to the business, not the business to technology.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "The Problem" },
          { label: "Business Brain" },
          { label: "Knowledge Graph" },
          { label: "AI Workforce" },
          { label: "Private Access" },
        ],
      },
      {
        title: "Concepts",
        links: [
          { label: "Business Questions" },
          { label: "Evidence" },
          { label: "Human Approval" },
          { label: "Integrations" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Product Concepts" },
          { label: "Use Cases" },
          { label: "FAQ" },
          { label: "What is next" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About Us" },
          { label: "Careers" },
          { label: "Contact Us" },
        ],
      },
    ],
    utility: [
      { label: "Contact Us", detail: "hello@thalamus.ai" },
      { label: "Careers", detail: "Open roles when available" },
      { label: "FAQ", detail: "Find answers" },
      { label: "Powered by", detail: "Schrödinger's Cats" },
      { label: "What's Next", detail: "Private access updates" },
    ],
    copyright: "© 2026 Thalamus AI. All rights reserved.",
    ariaPrefix: "Follow us on",
  },
  language: {
    en: "EN",
    bn: "বাং",
    switcherAria: "Language",
    englishLabel: "Switch to English",
    banglaLabel: "Switch to বাংলা",
  },
  workspace: {
    homeAria: "Thalamus AI home",
    eyebrow: "Business Brain workspace",
    contextStatus: "Business context available locally",
    welcomeHeading: "Welcome, {{name}}.",
    welcomeBody:
      "THALAMUS has the first layer of context about your business. This handoff confirms that onboarding data reaches the workspace without building real AI, ingestion, or integration infrastructure.",
    items: {
      industry: "Industry",
      products: "Products",
      customers: "Customers",
      goals: "Goals",
      connections: "Connections",
      description: "Business description",
    },
    emptyPriorities: "No priorities selected",
    noSources: "No sources connected",
    sourceSingular: "{{count}} prototype source",
    sourcePlural: "{{count}} prototype sources",
    refineCta: "Refine business context",
    viewConceptCta: "View Business Brain",
  },
  onboarding: {
    homeAria: "Back to Thalamus AI landing page",
    progressAria: "Onboarding progress",
    steps: {
      business: "Business",
      goals: "Goals",
      connect: "Connect",
      understanding: "Understanding",
    },
    businessProfile: {
      eyebrow: "01 · Business profile",
      title: "Tell us about your business",
      body: "Give THALAMUS a little context about how your business works. You can refine this information later.",
      examplesNote:
        "Examples are placeholders only. Empty and partial answers are welcome in this prototype.",
      fields: {
        companyName: {
          label: "Business / Company Name",
          placeholder: "Demo Commerce",
        },
        industry: { label: "Industry", placeholder: "E-commerce" },
        products: {
          label: "What do you sell?",
          placeholder: "Clothing and accessories",
        },
        customers: {
          label: "Who are your customers?",
          placeholder: "Young adults in Bangladesh",
        },
        description: {
          label: "Short description of the business",
          placeholder:
            "An online fashion business selling clothing and accessories through digital channels.",
        },
      },
    },
    goals: {
      eyebrow: "02 · Business goals",
      title: "What are you trying to improve?",
      body: "Choose up to three priorities, or continue without selecting any.",
      selectedCount: "{{count}} of 3 selected",
      items: {
        "grow-repeat-purchases": "Grow repeat purchases",
        "reduce-stockouts": "Reduce stockouts",
        "cut-slow-moving-inventory": "Cut slow-moving inventory",
        "improve-customer-response-time": "Improve customer response time",
        "cut-marketing-waste": "Cut marketing waste",
        "expand-to-new-channels": "Expand to new channels",
        "improve-cashflow-visibility": "Improve cashflow visibility",
      },
    },
    connect: {
      eyebrow: "03 · Connect",
      title: "Connect the systems your business already uses",
      body: "Connect data now, use a safe demo, or continue with your business profile and add sources later.",
      prototypeNote:
        "Prototype only. No external service, OAuth flow, or real account is contacted.",
      connectCta: "Connect",
      demoCta: "Use demo data",
      options: {
        "google-sheets": {
          name: "Google Sheets",
          sheetUrl: {
            label: "Sheet URL",
            placeholder: "https://docs.google.com/...",
          },
        },
        shopify: {
          name: "Shopify",
          storeDomain: {
            label: "Store domain",
            placeholder: "your-store.myshopify.com",
          },
          accessToken: {
            label: "Access token",
            placeholder: "Prototype only",
          },
        },
        whatsapp: {
          name: "WhatsApp",
          countryCode: {
            label: "Country code",
            placeholder: "+880",
          },
          businessNumber: {
            label: "Business number",
            placeholder: "Business phone",
          },
        },
        facebook: {
          name: "Facebook",
          pageUrl: {
            label: "Page URL",
            placeholder: "https://facebook.com/...",
          },
        },
        instagram: {
          name: "Instagram",
          profileUrl: {
            label: "Profile URL",
            placeholder: "https://instagram.com/...",
          },
        },
        "csv-excel": {
          name: "CSV / Excel",
          uploadFile: {
            label: "Upload file",
            placeholder: "",
          },
        },
        documents: {
          name: "Documents",
          uploadFile: {
            label: "Upload file",
            placeholder: "",
          },
        },
      },
      status: {
        connecting: "Connecting...",
        reading: "Reading source...",
        preparing: "Preparing business context...",
        connected: "Connected",
        idle: "Not connected",
      },
    },
    understanding: {
      eyebrow: "04 · Understanding",
      titleReady: "Your business context is ready.",
      titleWorking: "Understanding your business",
      bodyReady: "{{name}} is ready for the THALAMUS workspace.",
      bodyWorking:
        "THALAMUS is organizing the context you shared. This is a short simulated prototype sequence.",
      fallbackBusiness: "Your business",
      stages: {
        "reading-profile": "Reading business profile",
        "identifying-products": "Identifying products",
        "understanding-customers": "Understanding customers",
        "mapping-goals": "Mapping business goals",
        "organizing-data": "Organizing available data",
        "building-context": "Building business context",
        "preparing-workspace": "Preparing your workspace",
      },
    },
    navigation: {
      back: "Back",
      continue: "Continue",
      finish: "Finish",
      preparingWorkspace: "Preparing workspace",
      skipForNow: "Skip for now",
    },
    connectionForm: {
      eyebrow: "Prototype connection",
      title: "Connect {{name}}",
      closeAria: "Close connection form",
      prototypeNote:
        "Values stay in this prototype session and are not sent to an external provider. Do not enter real credentials.",
      submit: "Simulate connection",
    },
    fallbackBusinessName: "Your business",
  },
};
