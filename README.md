<div align="center">

# THALAMUS AI

**An autonomous AI operating system for retail and e-commerce SMEs in Bangladesh.**

Marketing site, onboarding wizard, and a seven-agent intelligence workspace — one Next.js app, one Vercel deployment.

`Next.js 16` · `React 19` · `TypeScript` · `Tailwind CSS v4` · `Zustand` · `OpenAI` · `BDT (৳)` · `Asia/Dhaka`

</div>

---

## 1. System overview & value proposition

Most Bangladeshi retail and e-commerce SMEs run on disconnected spreadsheets. Revenue lives in one file, stock counts in another, supplier terms in a chat thread, and customer complaints nowhere at all. Answering "why did sales drop in Dhaka last month?" means an afternoon of manual reconciliation — so nobody asks.

THALAMUS AI replaces that with an **active intelligence workforce**. Seven specialised agents continuously watch the business, surface what changed, explain why, and propose what to do next. The owner asks questions in English or Bangla and gets a grounded answer with the numbers attached.

### The deterministic fact-computation layer

The single most important architectural decision in this codebase: **the language model never performs raw arithmetic.**

Every metric an agent can talk about — 30-day revenue, prior-period revenue, active customer counts, regional deltas, at-risk SKU counts, reorder points, supplier on-time rates — is **pre-aggregated in TypeScript** by `src/lib/openai/context/buildBusinessContext.ts` before a single token is generated. The model receives a compact JSON payload of already-computed facts and is instructed to ground its answer strictly in that payload:

> Ground all answers ONLY on the provided JSON context. Cite product and supplier IDs exactly as they appear in that context — never invent, reformat, or guess an ID that is not present.

This matters because LLMs are unreliable calculators but excellent explainers. By moving all computation into deterministic code and reserving the model for interpretation, narrative, and recommendation, the numbers a business owner sees are reproducible and auditable — the model cannot quietly get a sum wrong.

Two further guarantees are enforced in the same layer:

- **Currency discipline** — all monetary values are Bangladeshi Taka (`৳` / `BDT`). The system prompt explicitly forbids `$` and `R$`.
- **Language mirroring** — a query in Bangla or Banglish is answered in professional Bangla; the entire UI ships bilingual (`en` / `bn`) with a dedicated Hind Siliguri font stack.

### Risk gating

Agents do not act unilaterally. Every recommendation carries a `riskTier` and a `requiresApproval` flag. Anything touching restock spend or financial change is forced to `medium`/`high` with approval required, and lands in the **Approvals** queue for a human decision. The Automation Agent — the only agent that can execute rather than advise — ships `locked` by default.

---

## 2. Unified architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          PUBLIC MARKETING SURFACE                           │
│                            (route group: (landing))                         │
│                                                                              │
│   /                     Marketing hero, platform graph, pricing              │
│   /login                Prototype authentication                             │
│   /onboarding           4-step business-context wizard                       │
│   /onboarding/profile   Wizard deep-link                                     │
│   /handoff              Confirms captured context, primary CTA → /workspace  │
│                                                                              │
│   Styling isolated under `.landing-scope` so the marketing design tokens     │
│   never leak into the product shell (and vice versa).                        │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    │  writes as the user types
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                  CLIENT-SIDE REAL-TIME STORAGE BRIDGE                        │
│                      src/lib/thalamus-bridge.ts                              │
│                                                                              │
│   localStorage keys observed:                                                │
│     thalamus-onboarding          companyName, industry, description,          │
│                                  products, customers, goals, connections      │
│     thalamus-prototype-session   auth session                                 │
│     thalamus-language            en | bn                                      │
│     thalamus-theme               light | dark                                 │
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐     │
│   │ window "storage" event  +  same-tab synthetic StorageEvent         │     │
│   │ dispatched by OnboardingFlow.persistDraft() on every keystroke     │     │
│   └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│   Projects into the product's Zustand stores:                                │
│     useUserStore.completeOnboarding(companyName, industry)  → greeting        │
│     useDataStore.addBusinessInfo(key, value)   → Business Brain (debounced)   │
│     useAppStore.setLanguage() / setTheme()     → bidirectional preference sync│
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        CORE WORKSPACE DASHBOARD                              │
│                              /workspace/*                                    │
│                                                                              │
│   overview (/)      Business health, nudges, recommended actions             │
│   ask               Streaming assistant (SSE) + processing indicator         │
│   brain             Business Brain knowledge canvas (@xyflow/react)          │
│   workforce         Agent roster → /workspace/workforce/[id]                 │
│   insights          Detected anomalies → /workspace/insights/[id]            │
│   reports           Generated reports → /workspace/reports/[id]              │
│   approvals         Human-in-the-loop gate for medium/high risk actions      │
│   activity          Chronological agent audit trail                          │
│   integrations      Connectors (Shopify, POS, …)                             │
│   data-sources      Dataset versions & record counts                         │
│   settings          Language, theme, notifications, privacy                  │
│                                                                              │
│   <ThalamusBridge /> is mounted in `src/app/workspace/layout.tsx`,           │
│   so every product route stays live-synced without visual side effects.      │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │  fetch / EventSource
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│              SERVER-SIDE MULTI-MODEL INFERENCE LAYER                         │
│         Next.js App Router route handlers — runtime "nodejs", dynamic         │
│                                                                              │
│   POST /api/chat/stream           SSE: stage → token → done | error          │
│   POST /api/chat/message          Non-streaming fallback (blocked SSE)        │
│   GET  /api/agents                Agent roster                               │
│   POST /api/agents/[id]/invoke    Direct single-agent invocation             │
│   POST /api/context               Business context payload                    │
│   POST /api/detect                Structured business-fact extraction         │
│   POST /api/suggestions           Contextual follow-up questions              │
│                                                                              │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐ │
│   │ 1. PLAN      │──▶│ 2. GROUND    │──▶│ 3. RUN       │──▶│ 4. SYNTHESISE│ │
│   │ route to     │   │ deterministic│   │ agent(s) w/  │   │ single answer│ │
│   │ ≤3 agents    │   │ fact payload │   │ JSON schema  │   │ + risk tier  │ │
│   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘ │
│                                                                              │
│   Safety: per-IP rate limiting, conversation capping, 30s timeout,           │
│   structured error envelopes (never an unhandled 500 body).                  │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        MODEL TIERING & ROUTING                               │
│                     src/lib/openai/client.ts · engine.ts                     │
│                                                                              │
│   gpt-5.6-luna   fast routine streaming, extraction, suggestions             │
│                  └─ GA fallback: gpt-4o-mini                                 │
│   gpt-5.6-terra  deep multi-domain reasoning, finance, policy, reports       │
│                  └─ GA fallback: gpt-4o                                      │
│                                                                              │
│   selectModel(agentId, isReport) routes to `terra` when the request is a     │
│   report, or the agent is `finance-agent` or `policy-docs-agent`.            │
│   Fallback is automatic when the 5.6 tier is unavailable on the account.     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Why one app instead of two

The landing site and the product were originally separate Next.js apps with colliding `@/*` aliases, colliding `/login` and `/workspace` routes, and two incompatible sets of CSS custom properties under identical names. They are now a single deployment:

| Collision | Resolution |
|---|---|
| `@/*` → `./*` vs `./src/*` | Landing code namespaced under `src/landing/`, imported as `@/landing/*` |
| Duplicate `/login` | Landing's `LoginForm` wins and now calls `useUserStore.login()` |
| Duplicate `/workspace` | Landing's prototype handoff moved to `/handoff`; `/workspace/*` is the real product |
| Same CSS variable names, different value formats (hex/rgba vs HSL triplets) | Landing tokens scoped under `.landing-scope`; the product's global `border-color` rule excludes that subtree |
| Two theme systems | `ThalamusBridge` syncs `thalamus-theme` ↔ `useAppStore.theme` bidirectionally |

`NEXT_PUBLIC_PRODUCT_APP_URL` is left empty for this unified deployment, so all product links stay relative. Set it to a product origin only if you split the surfaces back onto two domains — the code paths support both.

---

## 3. Ground truth: the Bangladesh-localised dataset

The repository carries a synthetic enterprise dataset, **`THALAMUS_Demo_Dataset_BD_v1`**, that defines the schema and business shape the product reasons about. It is fully localised: Bangladeshi Taka, `Asia/Dhaka`, Bangla-primary language metadata, and real district names.

```
THALAMUS_Demo_Dataset_BD_v1/
├── manifest.json                 dataset_version 1.0.0, table counts, localisation
├── data/
│   ├── products.csv              100 rows   P0001–P0100
│   ├── inventory.csv             100 rows   stock position per SKU
│   ├── suppliers.csv              12 rows   SUP001–SUP012
│   ├── sellers.csv                40 rows   S0001–S0040
│   ├── customers.csv           1,000 rows   C00001–C01000
│   ├── orders.csv              5,000 rows
│   ├── order_items.csv         6,774 rows
│   ├── payments.csv            5,000 rows
│   └── reviews.csv             3,450 rows
├── business/                     profile, goals, policies (YAML)
├── agents/                       per-agent briefs (YAML)
└── knowledge/                    entities.json, relationships.json
```

**Catalog** — 100 SKUs across 10 categories: electronics accessories (20), home & kitchen (15), health & beauty (15), home decor (10), fashion apparel (10), fashion accessories (10), garden & outdoor (5), toys & games (5), footwear (5), home furniture (5). Each carries `unit_price_bdt` plus weight and dimensions.

**Suppliers** — 12 local vendors with monitored `lead_time_days` (15–18 days typical) and `reliability_score` (0.90–0.98), which is what makes lead-time-aware reorder sizing and SLA breach detection possible.

**Fulfilment & logistics** — 40 regional hubs spread across 38 distinct district codes, covering Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur and Mymensingh regions.

**Customer base** — 1,000 accounts segmented as `returning` (451), `new` (290), `high_value` (149) and `inactive` (110), distributed across 37 district codes with realistic Dhaka (103) and Chittagong (76) concentration.

**Transaction history** — 5,000 orders, 6,774 order items, 5,000 payments and 3,450 reviews, giving the agents enough volume for month-over-month comparison, cohort churn analysis and sentiment attribution.

> **How the dataset relates to runtime.** The CSV corpus is the *design reference* — it defines the schema, ID conventions, category taxonomy and regional distribution. At request time the app reads **no files**. The facts served to the model come from seeded, deterministic TypeScript generators in `src/data/demo/*`, exposed through the `src/services/dataset.ts` facade at a larger demo scale (342 products, 4,218 customers, 14,200 orders, 12 suppliers — dataset version `v1.4`). Because generation is seeded, every run produces identical numbers, which keeps demos and screenshots reproducible. The CSV directory is therefore excluded from deployment via `.vercelignore` to keep uploads small.

---

## 4. The seven-agent workforce

| Agent | Identifier | Primary domain | Risk tier | Model tier |
|---|---|---|---|---|
| Sales Analyst | `sales-analyst` | MoM revenue, regional dips, volume vs. basket size | Low | `gpt-5.6-luna` |
| Marketing Agent | `marketing-agent` | Churn recovery, lapsed cohorts (DHA/CTG/SYL), promotions | Medium | `gpt-5.6-luna` |
| Inventory Agent | `inventory-agent` | Stockout forecasting, lead-time reorder sizing | Medium | `gpt-5.6-luna` |
| Customer Success | `customer-success` | Review sentiment, detractor attribution, shipping delays | Low | `gpt-5.6-luna` |
| Finance Agent | `finance-agent` | Gross margin, COGS, cash flow, supplier payment terms | **High** | `gpt-5.6-terra` |
| Policy & Docs Agent | `policy-docs-agent` | Supplier SLAs, return terms, compliance audits | **High** | `gpt-5.6-terra` |
| Automation Agent | `automation-agent` | Workflow triggering, catalog syncing — **locked** | Per-policy | `gpt-5.6-luna` |

Notes on the roster as implemented:

- The **canonical list** lives in `src/lib/openai/schema.ts` (`VALID_AGENTS`); `normalizeAgentId()` coerces unknown or `snake_case` ids to a valid agent so the inference path can never receive a bad identifier.
- **Model tier is derived, not configured per agent.** `selectModel()` promotes a request to `gpt-5.6-terra` when it is a report, or when the agent is `finance-agent` or `policy-docs-agent`. Any agent producing a full report is therefore served by the deep tier.
- The **planner** may route a query to at most three agents (`AGENT_IDS` in `orchestrator.ts`). `automation-agent` is deliberately excluded from automatic routing because it executes workflows rather than answering questions.
- `finance-agent` and `policy-docs-agent` require human approval before any recommendation is actioned.

---

## 5. Environment configuration

Copy `.env.example` to `.env.local` for local development. Only `NEXT_PUBLIC_*` values reach the browser; everything else is server-only and read inside `nodejs` route handlers.

```bash
# ---- OpenAI authentication (REQUIRED for the assistant and agents) ---------
# Without this the API routes return a structured "not configured" error and
# the UI falls back to its demo dataset rather than crashing.
OPENAI_API_KEY=sk-proj-...

# ---- Model tiering ---------------------------------------------------------
# Each tier automatically falls back to a GA model if the configured one is
# unavailable: gpt-5.6-luna -> gpt-4o-mini, gpt-5.6-terra -> gpt-4o.
OPENAI_MODEL_DEFAULT=gpt-5.6-luna       # Chat completions & fast extraction
OPENAI_MODEL_DEEP=gpt-5.6-terra         # Deep cross-domain reports & audits
OPENAI_MODEL_STRUCT=gpt-5.6-luna        # Structured JSON extraction

# ---- Runtime parameters ----------------------------------------------------
OPENAI_MAX_TOKENS_CHAT=800
OPENAI_MAX_TOKENS_REPORT=2000
OPENAI_TEMPERATURE=1
OPENAI_TIMEOUT_MS=30000
OPENAI_RATE_LIMIT_PER_MIN=30

# ---- Deployment topology ---------------------------------------------------
# Leave EMPTY for a unified single-domain deployment: landing, onboarding and
# workspace share one origin, so product links stay relative. Set to the
# product origin (e.g. http://localhost:3001) only when serving the landing
# and workspace as two separate apps.
NEXT_PUBLIC_PRODUCT_APP_URL=
```

| Variable | Required | Default / fallback | Purpose |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes | — | Authenticates every inference call. Absent → structured `server_error`, UI degrades to demo data |
| `OPENAI_MODEL_DEFAULT` | No | `gpt-5.6-luna` → `gpt-4o-mini` | Fast tier: streaming chat, extraction, suggestions |
| `OPENAI_MODEL_DEEP` | No | `gpt-5.6-terra` → `gpt-4o` | Deep tier: reports, finance, policy audits |
| `OPENAI_MODEL_STRUCT` | No | `gpt-5.6-luna` | Structured JSON extraction (schema-constrained) |
| `OPENAI_MAX_TOKENS_CHAT` | No | `800` | Output cap for conversational replies |
| `OPENAI_MAX_TOKENS_REPORT` | No | `2000` | Output cap for generated reports |
| `OPENAI_TEMPERATURE` | No | `1` (default only) | GPT-5.6 rejects custom values — omit from API payloads; env kept for documentation |
| `OPENAI_TIMEOUT_MS` | No | `30000` | Upstream request timeout |
| `OPENAI_RATE_LIMIT_PER_MIN` | No | `30` | Per-IP request ceiling |
| `NEXT_PUBLIC_PRODUCT_APP_URL` | No | `""` (relative) | Product origin for split-domain deployments |

> **Never commit a real key.** `.env.local` is gitignored and `.vercelignore` excludes `.env*.local` from deployment uploads. On Vercel, set values under **Project Settings → Environment Variables**.

---

## 6. Quickstart & deployment

### Local development

```bash
git clone <repo_url>
cd Thalamus_DeployReady
npm install
cp .env.example .env.local     # then fill in OPENAI_API_KEY
npm run dev                    # http://localhost:3000
```

Requires **Node.js ≥ 20.9.0** (enforced via `engines` in `package.json`).

Walk the full integration in about a minute:

1. Open `http://localhost:3000` — the marketing landing page.
2. Go to `/onboarding` and start typing a business name.
3. Open `/workspace` in a second tab. The greeting updates **as you type**, via the storage bridge.
4. Finish the wizard → you land on `/handoff`, which echoes the captured context.
5. Click the primary CTA → `/workspace`, fully personalised.
6. Toggle language or theme on either surface; the other follows.

### Verification

```bash
npx tsc --noEmit    # type safety — must exit 0
npm run lint        # ESLint — must report 0 errors
npm run build       # production build — must succeed
```

Current status of this tree: `tsc` exits **0**, `lint` reports **0 errors** (9 pre-existing unused-variable warnings), and `next build` compiles **30 routes — 20 static and 10 server-rendered on demand**, the latter covering all 7 API handlers plus the three `[id]` detail pages.

Optional: `npm run verify:openai` performs a live credential and model-availability check once `OPENAI_API_KEY` is set.

### Deploying to Vercel

**Option A — GitHub import (recommended)**

1. Push this directory to a GitHub repository.
2. In the Vercel dashboard choose **Add New → Project** and import the repo.
3. Framework preset is detected automatically as **Next.js**; leave build and output settings at their defaults.
4. Add `OPENAI_API_KEY` under **Environment Variables** (Production, Preview and Development as needed). Leave `NEXT_PUBLIC_PRODUCT_APP_URL` unset.
5. **Deploy.**

**Option B — Vercel CLI**

```bash
npm i -g vercel
vercel login
vercel link
vercel env add OPENAI_API_KEY production
vercel --prod
```

### Post-deploy smoke test

Confirm the roster endpoint and SSE streaming survived the move to serverless:

```bash
# 1. Agent roster — expect 7 agents
curl -s https://<your-deployment>/api/agents | jq '.agents | length'

# 2. SSE streaming — expect a stream of `stage:` then `token:` events
curl -N -X POST https://<your-deployment>/api/chat/stream \
  -H 'Content-Type: application/json' \
  -d '{"message":"Why did revenue drop in Dhaka last month?","language":"en"}'

# 3. Deterministic context payload — no key required
curl -s -X POST https://<your-deployment>/api/context \
  -H 'Content-Type: application/json' -d '{}' | jq '.business.totals'
```

Streaming works on Vercel without extra configuration: every route handler declares `runtime = "nodejs"` and `dynamic = "force-dynamic"`, and the stream response sets `Cache-Control: no-cache, no-transform` plus `X-Accel-Buffering: no` to prevent proxy buffering.

If `OPENAI_API_KEY` is missing in production, the stream endpoint returns a structured SSE error rather than crashing:

```
event: error
data: {"code":"server_error","message":"Missing OPENAI_API_KEY in environment variables."}
```

---

## Project structure

```
Thalamus_DeployReady/
├── src/
│   ├── app/
│   │   ├── (landing)/              Marketing + onboarding route group
│   │   │   ├── page.tsx            /
│   │   │   ├── login/              /login
│   │   │   ├── onboarding/         /onboarding, /onboarding/profile
│   │   │   ├── handoff/            /handoff
│   │   │   └── layout.tsx          .landing-scope + ThemeProvider + i18n
│   │   ├── workspace/              Product shell (11 routes + detail pages)
│   │   │   └── layout.tsx          Mounts <ThalamusBridge />
│   │   ├── api/                    7 nodejs route handlers
│   │   ├── globals.css             Product tokens + scoped landing tokens
│   │   └── layout.tsx              Fonts + global CSS only
│   ├── landing/                    Ported marketing app (@/landing/*)
│   │   ├── components/             Hero, pricing, onboarding wizard, handoff
│   │   ├── lib/i18n/               en.ts / bn.ts dictionaries
│   │   └── lib/product-app-url.ts  Unified vs split-domain link resolution
│   ├── components/                 Product UI (workspace shell, canvas, chat)
│   ├── lib/
│   │   ├── thalamus-bridge.ts      Cross-surface localStorage → store bridge
│   │   └── openai/                 client, engine, orchestrator, prompts,
│   │                               schema, safety, stream, context builder
│   ├── store/                      Zustand: user, app, data
│   ├── services/                   dataset facade + domain services
│   └── data/demo/                  Seeded deterministic fact generators
├── THALAMUS_Demo_Dataset_BD_v1/    Reference dataset (excluded from deploy)
├── scripts/verify-openai.mjs       Credential / model availability check
├── .env.example                    Environment template
├── .vercelignore                   Deployment upload exclusions
└── next.config.ts                  serverExternalPackages, images, TS strictness
```

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | Route groups isolate marketing from product |
| UI | React 19 | Server Components by default, client islands where stateful |
| Language | TypeScript 5 | `ignoreBuildErrors: false` — builds fail on type errors |
| Styling | Tailwind CSS v4 | CSS-first tokens; landing tokens scoped to avoid collision |
| State | Zustand 5 | Persisted stores with `skipHydration` for SSR safety |
| Graph canvas | `@xyflow/react` 12 | Business Brain knowledge graph |
| Icons | `lucide-react` | |
| Inference | `openai` 7 | Declared in `serverExternalPackages` |

---

<div align="center">

Built for Bangladeshi SMEs. All figures in Bangladeshi Taka (৳), all timestamps in `Asia/Dhaka`.

</div>
