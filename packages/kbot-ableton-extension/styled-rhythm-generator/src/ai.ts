/**
 * Pattern Drop — local-AI rhythm generation.
 *
 * Calls a local Ollama model to produce a 16-step drum grid, then converts it
 * to notes. Everything here is pure/host-agnostic except the caller's `fetch`;
 * the model request itself is issued from extension.ts so this stays testable.
 */
import type { NoteDescription } from "@ableton-extensions/sdk";
import { ELEMENTS, type ElementKey } from "./grooves.js";

export const OLLAMA_URL = "http://localhost:11434/api/chat";
// Default chosen by eval/run.ts: hermes3:8b topped musicality (100% JSON / 16-step
// / hat, best backbeat placement) and was the fastest in the top tier (~5s).
// Re-run `npm run eval` to re-rank against your installed models.
export const DEFAULT_MODEL = "hermes3:8b";

export interface AiConfig {
  prompt: string;
  bars: number;
  swing: number;
  humanize: number;
  model?: string;
}

/** 16-step grid per element; 0 = rest, 1..127 = hit velocity. */
export type Pattern = Partial<Record<ElementKey, number[]>>;

/** Chat messages instructing the model to emit a strict JSON grid. */
export function buildMessages(cfg: AiConfig): {
  role: "system" | "user";
  content: string;
}[] {
  const keys = ELEMENTS.map((e) => e.key).join(", ");
  const system = [
    "You generate drum patterns on a 1-bar, 16-step sixteenth-note grid in 4/4.",
    "",
    "GRID INDEX SEMANTICS (critical):",
    "- step 0 = beat 1, step 4 = beat 2, step 8 = beat 3, step 12 = beat 4.",
    "- the off-beat eighths are steps 2, 6, 10, 14.",
    "- sixteenths fall on the odd steps (1,3,5,...).",
    "",
    "RULES OF THUMB (adapt to the requested style, don't copy blindly):",
    "- Backbeat snare/clap almost always lands on steps 4 and 12.",
    "- Four-on-the-floor kick = steps 0,4,8,12 (NOT every other step).",
    "- Closed hats often run eighths (0,2,4,..,14) or straight sixteenths.",
    "- Open hats often sit on the off-beats (2,6,10,14).",
    "- Use 3-6 elements for a full groove and almost always include a hat.",
    "",
    "VELOCITY: accents ~110-120, normal ~90, ghost notes ~45-65, rest = 0.",
    "",
    `OUTPUT: ONLY a JSON object — no prose, no markdown. Keys from: ${keys}. ` +
      "Each value is an array of EXACTLY 16 integers (0-127). Omit unused elements.",
    "",
    'Example (generic boom-bap): {"kick":[118,0,0,0,0,0,90,0,0,0,110,0,0,0,0,0],' +
      '"snare":[0,0,0,0,118,0,0,55,0,0,0,0,118,0,0,55],' +
      '"chh":[92,0,60,0,92,0,60,0,92,0,60,0,92,0,60,0]}',
  ].join("\n");
  const user = `Style / feel: ${cfg.prompt || "a tasteful groove"}. Generate the pattern.`;
  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

/** Parse a model response into a validated 16-step grid per element. */
export function parsePattern(text: string): Pattern {
  let json = text.trim();
  // Defensive: peel any stray prose around the object.
  const first = json.indexOf("{");
  const last = json.lastIndexOf("}");
  if (first >= 0 && last > first) json = json.slice(first, last + 1);

  const raw = JSON.parse(json) as Record<string, unknown>;
  const valid = new Set<string>(ELEMENTS.map((e) => e.key));
  const out: Pattern = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!valid.has(key) || !Array.isArray(value)) continue;
    const row: number[] = [];
    for (let i = 0; i < 16; i++) {
      const n = Number(value[i]);
      row.push(Number.isFinite(n) ? Math.max(0, Math.min(127, Math.round(n))) : 0);
    }
    out[key as ElementKey] = row;
  }
  return out;
}

const STEP = 0.25;
const DURATION: Record<ElementKey, number> = {
  kick: 0.12, snare: 0.12, clap: 0.12, chh: 0.1,
  ohh: 0.22, perc: 0.12, shaker: 0.08, cymbal: 0.5,
};

/** Convert a model grid into notes, applying swing + humanize from the config. */
export function patternToNotes(
  pattern: Pattern,
  noteMap: Record<ElementKey, number>,
  cfg: AiConfig,
): NoteDescription[] {
  const bars = Math.max(1, Math.min(4, Math.round(cfg.bars)));
  const swingDelay = cfg.swing * 0.5 * STEP;
  const hum = Math.max(0, Math.min(1, cfg.humanize));
  const notes: NoteDescription[] = [];

  // Small LCG for humanize jitter (no shared RNG dependency).
  let s = 0x2545f491;
  const rnd = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };

  for (let bar = 0; bar < bars; bar++) {
    const barStart = bar * 16 * STEP;
    for (const el of ELEMENTS) {
      const row = pattern[el.key];
      if (!row) continue;
      const pitch = noteMap[el.key];
      for (let step = 0; step < 16; step++) {
        const v = row[step] || 0;
        if (v <= 0) continue;
        const swing = step % 2 === 1 ? swingDelay : 0;
        const jitter = (rnd() * 2 - 1) * hum * 0.02;
        const startTime = Math.max(0, barStart + step * STEP + swing + jitter);
        const vJit = (rnd() * 2 - 1) * hum * 18;
        const vel = Math.round(Math.max(1, Math.min(127, v + vJit)));
        notes.push({
          pitch,
          startTime,
          duration: DURATION[el.key],
          velocity: vel,
          velocityDeviation: Math.round(hum * 18),
          probability: 1,
          muted: false,
        });
      }
    }
  }
  notes.sort((a, b) => a.startTime - b.startTime);
  return notes;
}
