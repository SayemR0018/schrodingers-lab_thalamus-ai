#!/usr/bin/env node
/**
 * scripts/verify-openai.mjs
 *
 * Standalone smoke test for the THALAMUS OpenAI integration.
 * Run via:  node scripts/verify-openai.mjs
 *
 * The script:
 *   1. Parses `.env.local` from the project root manually (no dotenv
 *      dependency required).
 *   2. Validates that OPENAI_API_KEY is present, starts with `sk-`, and
 *      is not a placeholder ending in `_KEY` or `your-key-here`.
 *   3. Issues a minimal `max_completion_tokens: 5` completion to OpenAI to test:
 *        a) Key validity (200 OK).
 *        b) Availability of `gpt-5.6-luna` / `gpt-5.6-terra`. If those
 *           are unavailable on the account, the script detects the
 *           fallback path and confirms `gpt-4o-mini` / `gpt-4o` are
 *           usable instead.
 *   4. Prints clean colored terminal output (green for success, red
 *      for failures with instructions).
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import OpenAI from "openai";

// --------------------------------------------------------------------------
// Minimal ANSI color helpers — no chalk dep needed.
// --------------------------------------------------------------------------
const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

// --------------------------------------------------------------------------
// Resolve paths.
// --------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(PROJECT_ROOT, ".env.local");

// --------------------------------------------------------------------------
// Step 1: parse .env.local manually (no dotenv needed).
// --------------------------------------------------------------------------
function parseEnvFile(filePath) {
  const env = {};
  let raw = "";
  try {
    raw = readFileSync(filePath, "utf8");
  } catch {
    return { env, raw: "" };
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    // Strip optional surrounding quotes.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      // Unquoted inline comments must not become part of the model name.
      const commentIdx = value.search(/\s+#/);
      if (commentIdx >= 0) value = value.slice(0, commentIdx).trim();
    }
    env[key] = value;
  }
  return { env, raw };
}

// --------------------------------------------------------------------------
// Validators.
// --------------------------------------------------------------------------
const PLACEHOLDER_PATTERNS = [
  /_KEY$/i, // ends with literal "_KEY"
  /your-key-here/i,
  /your_openai_key/i,
  /replace[-_ ]?me/i,
  /changeme/i,
];

function looksLikePlaceholder(value) {
  if (!value) return false;
  return PLACEHOLDER_PATTERNS.some((re) => re.test(value));
}

// --------------------------------------------------------------------------
// Tiny reporter.
// --------------------------------------------------------------------------
function heading(title) {
  const line = "─".repeat(Math.max(0, 60 - title.length - 2));
  console.log(`\n${c("cyan", "┌─")} ${c("bold", title)} ${c("cyan", line)}`);
}
function ok(msg) {
  console.log(`  ${c("green", "✓")} ${msg}`);
}
function info(msg) {
  console.log(`  ${c("blue", "•")} ${msg}`);
}
function warn(msg) {
  console.log(`  ${c("yellow", "!")} ${msg}`);
}
function fail(msg) {
  console.log(`  ${c("red", "✗")} ${msg}`);
}

// --------------------------------------------------------------------------
// Main verification flow.
// --------------------------------------------------------------------------
async function main() {
  console.log(c("bold", "\nThalamus OpenAI integration verifier\n"));
  info(`Project root: ${PROJECT_ROOT}`);
  info(`Reading env from: ${ENV_PATH}`);

  // ---- 1. Read .env.local --------------------------------------------------
  heading("Step 1 — parse .env.local");
  const { env: parsed, raw } = parseEnvFile(ENV_PATH);
  if (!raw) {
    fail(`Could not read .env.local at ${ENV_PATH}.`);
    info(
      "Create one by copying .env.example and filling in a real OPENAI_API_KEY."
    );
    process.exit(1);
  }
  ok(`Read ${Object.keys(parsed).length} entries from .env.local`);

  // Merge into process.env so any tooling that consults env still works.
  for (const [k, v] of Object.entries(parsed)) {
    if (process.env[k] === undefined) process.env[k] = v;
  }

  // ---- 2. Validate OPENAI_API_KEY -----------------------------------------
  heading("Step 2 — validate OPENAI_API_KEY");
  const key = parsed.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!key) {
    fail("OPENAI_API_KEY is missing from .env.local.");
    info("Add a line like:  OPENAI_API_KEY=sk-...");
    process.exit(1);
  }
  if (!key.startsWith("sk-")) {
    fail(`OPENAI_API_KEY does not start with "sk-" (got: "${key.slice(0, 6)}...").`);
    info(
      "Your key must come from https://platform.openai.com/api-keys and start with sk- or sk-proj-."
    );
    process.exit(1);
  }
  if (looksLikePlaceholder(key)) {
    fail("OPENAI_API_KEY appears to be a placeholder.");
    info(
      `Detected a placeholder pattern. Paste your real key from https://platform.openai.com/api-keys.`
    );
    info(
      "Tip: in PowerShell you can use\n" +
        c(
          "dim",
          '  (Get-Clipboard) | %% { (Get-Content .env.local) -replace "OPENAI_API_KEY=.*","OPENAI_API_KEY=$_" } | Set-Content .env.local'
        )
    );
    process.exit(1);
  }
  ok(`OPENAI_API_KEY is present (${key.slice(0, 7)}...${key.slice(-4)})`);

  // Model configuration.
  const lunaModel = parsed.OPENAI_MODEL_DEFAULT || "gpt-5.6-luna";
  const terraModel = parsed.OPENAI_MODEL_DEEP || "gpt-5.6-terra";
  const structModel = parsed.OPENAI_MODEL_STRUCT || lunaModel;
  info(`Configured models:`);
  info(`  default (luna)  = ${lunaModel}`);
  info(`  deep    (terra) = ${terraModel}`);
  info(`  struct          = ${structModel}`);

  // ---- 3. Live API check ---------------------------------------------------
  heading("Step 3 — OpenAI live connectivity");
  const client = new OpenAI({
    apiKey: key,
    timeout: 30_000,
    maxRetries: 0,
    fetch: (input, init) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      if (
        url.includes("/chat/completions") &&
        init &&
        typeof init.body === "string"
      ) {
        try {
          const payload = JSON.parse(init.body);
          let changed = false;
          if (Object.prototype.hasOwnProperty.call(payload, "max_tokens")) {
            if (
              payload.max_completion_tokens == null &&
              typeof payload.max_tokens === "number"
            ) {
              payload.max_completion_tokens = payload.max_tokens;
            }
            delete payload.max_tokens;
            changed = true;
          }
          if (Object.prototype.hasOwnProperty.call(payload, "temperature")) {
            delete payload.temperature;
            changed = true;
          }
          if (changed) {
            return fetch(input, { ...init, body: JSON.stringify(payload) });
          }
        } catch {
          // Fall through to the original body if it is not JSON.
        }
      }
      return fetch(input, init);
    },
  });

  // Helper that runs a tiny completion against a target model and
  // returns { ok, status, code, message, text }.
  async function probe(model) {
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: "ping" }],
        max_completion_tokens: 5,
      });
      const text = res.choices?.[0]?.message?.content ?? "";
      return { ok: true, status: 200, code: null, message: null, text };
    } catch (err) {
      const status = err?.status ?? null;
      const code = err?.code ?? err?.error?.code ?? null;
      const message =
        err?.message ||
        (err?.error && JSON.stringify(err.error)) ||
        String(err);
      return { ok: false, status, code, message, text: "" };
    }
  }

  function classifyProbe(probe, modelName, fallbackName) {
    if (probe.ok) {
      ok(`${modelName} responded: "${probe.text.trim()}"`);
      return { status: "available", fallback: false };
    }
    const unavailable =
      probe.status === 404 ||
      probe.status === 403 ||
      probe.code === "model_not_found" ||
      probe.code === "unsupported_model" ||
      probe.code === "model_invalid" ||
      /does not exist|not have access|model_not_found/i.test(
        probe.message || ""
      );
    if (unavailable) {
      warn(
        `${modelName} unavailable on this account (status=${probe.status}, code=${probe.code}).`
      );
      return { status: "unavailable", fallback: fallbackName };
    }
    if (probe.status === 401) {
      fail(`Authentication failed for ${modelName}: ${probe.message}`);
      info(
        "Your OPENAI_API_KEY is rejected by OpenAI. Re-issue it from https://platform.openai.com/api-keys."
      );
      return { status: "auth_failed", fallback: null };
    }
    if (probe.status === 429) {
      fail(`Rate limited while probing ${modelName}: ${probe.message}`);
      info("Wait a minute and re-run. Consider lowering OPENAI_RATE_LIMIT_PER_MIN.");
      return { status: "rate_limited", fallback: null };
    }
    fail(`${modelName} failed (status=${probe.status}): ${probe.message}`);
    return { status: "error", fallback: null };
  }

  // Probe luna first.
  const lunaProbe = await probe(lunaModel);
  const lunaResult = classifyProbe(lunaProbe, lunaModel, "gpt-4o-mini");

  let lunaEffective = lunaModel;
  if (lunaResult.status === "unavailable" && lunaResult.fallback) {
    const fallbackProbe = await probe(lunaResult.fallback);
    const fallbackResult = classifyProbe(fallbackProbe, lunaResult.fallback, null);
    if (fallbackResult.status === "available") {
      lunaEffective = lunaResult.fallback;
      info(
        `Engine will silently use ${c("bold", lunaEffective)} when ${lunaModel} is unavailable.`
      );
    } else {
      fail(
        `Neither ${lunaModel} nor ${lunaResult.fallback} is usable. Chat will fail until this is fixed.`
      );
    }
  }

  // Probe terra.
  const terraProbe = await probe(terraModel);
  const terraResult = classifyProbe(terraProbe, terraModel, "gpt-4o");
  let terraEffective = terraModel;
  if (terraResult.status === "unavailable" && terraResult.fallback) {
    const fallbackProbe = await probe(terraResult.fallback);
    const fallbackResult = classifyProbe(fallbackProbe, terraResult.fallback, null);
    if (fallbackResult.status === "available") {
      terraEffective = terraResult.fallback;
      info(
        `Engine will silently use ${c("bold", terraEffective)} when ${terraModel} is unavailable.`
      );
    } else {
      fail(
        `Neither ${terraModel} nor ${terraResult.fallback} is usable. Reports will fail until this is fixed.`
      );
    }
  }

  // ---- 4. Summary ----------------------------------------------------------
  heading("Summary");
  const allGreen =
    lunaResult.status === "available" || lunaResult.status === "unavailable";
  const report = [];
  report.push(
    lunaResult.status === "available"
      ? c("green", `  ✓ ${lunaModel} is available`)
      : c("yellow", `  ! ${lunaModel} unavailable — falling back to ${lunaEffective}`)
  );
  report.push(
    terraResult.status === "available"
      ? c("green", `  ✓ ${terraModel} is available`)
      : c("yellow", `  ! ${terraModel} unavailable — falling back to ${terraEffective}`)
  );
  report.push(
    lunaResult.status === "auth_failed" || terraResult.status === "auth_failed"
      ? c("red", "  ✗ Authentication failed — fix OPENAI_API_KEY")
      : c("green", "  ✓ API key authenticated successfully")
  );
  console.log(report.join("\n"));

  if (
    lunaResult.status === "auth_failed" ||
    terraResult.status === "auth_failed"
  ) {
    process.exit(1);
  }
  if (!allGreen) {
    process.exit(2);
  }
  console.log(c("green", "\nAll checks passed.\n"));
}

main().catch((err) => {
  console.error(`\n${c("red", "Unexpected error:")}`, err);
  process.exit(99);
});
