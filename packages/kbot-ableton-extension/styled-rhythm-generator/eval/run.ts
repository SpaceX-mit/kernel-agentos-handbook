/**
 * Pattern Drop model eval.
 *
 * Runs the extension's real `buildMessages` prompt across a set of local Ollama
 * models, parses each response exactly as the extension would (`parsePattern`),
 * and scores it on musical correctness + latency. Picks the best default model.
 *
 *   npx tsx eval/run.ts                 # default shortlist
 *   npx tsx eval/run.ts qwen3:8b phi4:14b   # explicit models
 *
 * Writes eval/results.json and prints a ranked table.
 */
import { writeFileSync } from "node:fs";
import { buildMessages, parsePattern, OLLAMA_URL, type Pattern } from "../src/ai.js";
import { ELEMENTS, type ElementKey } from "../src/grooves.js";

// Instruction-following models only. Reasoning models (qwen3, deepseek-r1) emit
// thinking tokens that stall under format:json, so they're excluded by default.
const DEFAULT_MODELS = [
  "qwen2.5-coder:7b",
  "qwen2.5-coder:14b",
  "llama3.1:8b",
  "mistral:7b",
  "hermes3:8b",
  "gemma4:latest",
  "phi4:14b",
  "gemma3:12b",
];

/** Each prompt carries the musical invariants we expect a good groove to honour. */
interface Probe {
  prompt: string;
  /** Steps (0..15) that the named element SHOULD hit for this style. */
  expect: Partial<Record<ElementKey, number[]>>;
  /** At least one of these elements must be present (a hat, almost always). */
  needsHat?: boolean;
}

const PROBES: Probe[] = [
  {
    prompt: "classic boom-bap hip hop with a dusty swung groove",
    expect: { snare: [4, 12] }, // backbeat
    needsHat: true,
  },
  {
    prompt: "four-on-the-floor house, driving and clubby",
    expect: { kick: [0, 4, 8, 12] }, // four on the floor
    needsHat: true,
  },
  {
    prompt: "modern trap with rolling hi-hats and an 808",
    expect: { snare: [8] }, // trap snare/clap on the 3
    needsHat: true,
  },
  {
    prompt: "afrobeats groove with shaker and percussion",
    needsHat: true,
    expect: {},
  },
  {
    prompt: "techno, relentless straight kick",
    expect: { kick: [0, 4, 8, 12] },
    needsHat: true,
  },
];

const HAT_KEYS: ElementKey[] = ["chh", "ohh"];
const VALID = new Set<string>(ELEMENTS.map((e) => e.key));

interface ProbeScore {
  prompt: string;
  jsonOk: boolean;
  rows16: boolean; // every returned row was exactly 16 ints in the RAW response
  hasHat: boolean;
  placement: number; // 0..1 fraction of expected hits actually present
  latencyMs: number;
}

/** Did the raw model JSON use exactly-16-length arrays (before we coerce)? */
function rawRowsAllSixteen(raw: string): boolean {
  try {
    let j = raw.trim();
    const a = j.indexOf("{");
    const b = j.lastIndexOf("}");
    if (a >= 0 && b > a) j = j.slice(a, b + 1);
    const obj = JSON.parse(j) as Record<string, unknown>;
    const rows = Object.entries(obj).filter(
      ([k, v]) => VALID.has(k) && Array.isArray(v),
    );
    return rows.length > 0 && rows.every(([, v]) => (v as unknown[]).length === 16);
  } catch {
    return false;
  }
}

function placementScore(pat: Pattern, expect: Probe["expect"]): number {
  const reqs = Object.entries(expect) as [ElementKey, number[]][];
  if (reqs.length === 0) return 1;
  let hit = 0;
  let total = 0;
  for (const [key, steps] of reqs) {
    const row = pat[key];
    for (const s of steps) {
      total++;
      if (row && (row[s] ?? 0) > 0) hit++;
    }
  }
  return total === 0 ? 1 : hit / total;
}

// Bound any single request: a cold model load is slow, but a reasoning model
// hanging under format:json should fail fast rather than stall the whole sweep.
const TIMEOUT_MS = 60_000;

async function callModel(
  model: string,
  prompt: string,
): Promise<{ raw: string; ms: number }> {
  const started = process.hrtime.bigint();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: buildMessages({ prompt, bars: 1, swing: 0, humanize: 0 }),
        stream: false,
        format: "json",
        options: { temperature: 0.85 },
      }),
      signal: ctrl.signal,
    });
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { message?: { content?: string } };
    return { raw: data.message?.content ?? "", ms };
  } finally {
    clearTimeout(timer);
  }
}

async function scoreModel(model: string): Promise<{
  model: string;
  jsonRate: number;
  rows16Rate: number;
  hatRate: number;
  placement: number;
  avgMs: number;
  score: number;
  probes: ProbeScore[];
}> {
  const probes: ProbeScore[] = [];
  for (const probe of PROBES) {
    let s: ProbeScore = {
      prompt: probe.prompt,
      jsonOk: false,
      rows16: false,
      hasHat: false,
      placement: 0,
      latencyMs: 0,
    };
    try {
      const { raw, ms } = await callModel(model, probe.prompt);
      s.latencyMs = ms;
      const pat = parsePattern(raw); // throws if unparseable
      s.jsonOk = true;
      s.rows16 = rawRowsAllSixteen(raw);
      s.hasHat = HAT_KEYS.some((k) => (pat[k]?.some((v) => v > 0)) ?? false);
      s.placement = placementScore(pat, probe.expect);
    } catch {
      // leave defaults (jsonOk false)
    }
    process.stdout.write(
      `  ${model} · ${s.jsonOk ? "ok" : "FAIL"} · place ${(s.placement * 100) | 0}% · ${s.latencyMs | 0}ms\n`,
    );
    probes.push(s);
  }
  const n = probes.length;
  const jsonRate = probes.filter((p) => p.jsonOk).length / n;
  const rows16Rate = probes.filter((p) => p.rows16).length / n;
  const hatRate = probes.filter((p) => p.hasHat).length / n;
  const placement = probes.reduce((a, p) => a + p.placement, 0) / n;
  const okMs = probes.filter((p) => p.jsonOk).map((p) => p.latencyMs);
  const avgMs = okMs.length ? okMs.reduce((a, b) => a + b, 0) / okMs.length : Infinity;

  // Weighted musicality score (0..100). JSON validity gates everything;
  // placement (does it land the backbeat?) is the heaviest musical signal.
  const score =
    jsonRate * 30 + rows16Rate * 15 + hatRate * 15 + placement * 40;

  return { model, jsonRate, rows16Rate, hatRate, placement, avgMs, score, probes };
}

async function main() {
  const models = process.argv.slice(2).length
    ? process.argv.slice(2)
    : DEFAULT_MODELS;
  console.log(`Evaluating ${models.length} models on ${PROBES.length} probes…\n`);

  const results = [];
  for (const model of models) {
    console.log(`\n=== ${model} ===`);
    try {
      results.push(await scoreModel(model));
    } catch (err) {
      console.log(`  ${model} unavailable: ${(err as Error).message}`);
    }
  }

  results.sort((a, b) => b.score - a.score);

  console.log("\n\n RANK  MODEL                 SCORE  JSON  ROWS16  HAT   PLACE   AVGms");
  console.log(" ".padEnd(72, "─"));
  results.forEach((r, i) => {
    console.log(
      ` ${String(i + 1).padStart(2)}.   ${r.model.padEnd(20)} ${r.score.toFixed(1).padStart(5)}  ` +
        `${(r.jsonRate * 100).toFixed(0).padStart(3)}%  ${(r.rows16Rate * 100).toFixed(0).padStart(4)}%  ` +
        `${(r.hatRate * 100).toFixed(0).padStart(3)}%  ${(r.placement * 100).toFixed(0).padStart(4)}%  ` +
        `${r.avgMs === Infinity ? "  n/a" : (r.avgMs | 0).toString().padStart(6)}`,
    );
  });

  if (results.length) {
    console.log(`\n WINNER: ${results[0]!.model} (score ${results[0]!.score.toFixed(1)})`);
  }
  writeFileSync(
    new URL("./results.json", import.meta.url),
    JSON.stringify(results, null, 2),
  );
  console.log(" wrote eval/results.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
