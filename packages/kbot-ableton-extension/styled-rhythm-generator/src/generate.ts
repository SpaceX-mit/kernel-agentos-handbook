import type { NoteDescription } from "@ableton-extensions/sdk";
import { ELEMENTS, STYLES, type ElementKey, type Style } from "./grooves.js";

export type FillKind = "none" | "beat" | "half" | "bar";

export interface GenConfig {
  styleName: string;
  bars: number; // 1..4
  swing: number; // 0..1
  pocket: number; // -1..1  (negative = ahead, positive = laid back)
  humanize: number; // 0..1
  fill: FillKind;
  /** Density per element, 0..1 (0 mutes the element). */
  densities: Record<ElementKey, number>;
  /** Re-shuffle seed; same seed + config => identical pattern. */
  seed: number;
  /** Elements that should NOT receive swing (kept dead-straight). */
  swingExclude?: ElementKey[];
  /** Elements that should NOT receive the pocket push/lay-back. */
  pocketExclude?: ElementKey[];
  /**
   * Per-element lock seeds. A locked element draws from its own fixed seed, so
   * a Re-Shuffle (new global `seed`) leaves it untouched while every unlocked
   * element re-rolls. Capture an element's current effective seed via
   * {@link effectiveSeed} when the user locks it.
   */
  locks?: Partial<Record<ElementKey, number>>;
  /**
   * Per-element micro-timing in fractions of a 16th step (negative = pushed,
   * positive = laid-back). Overrides the style's own `microtiming` when given.
   * This is the *differential* pocket — voices sit at different places against
   * the grid — distinct from the single global `pocket` offset.
   */
  microtiming?: Partial<Record<ElementKey, number>>;
}

const STEP = 0.25; // one sixteenth note, in beats
const STEPS_PER_BAR = 16;

/** Default note length per element, in beats. */
const DURATION: Record<ElementKey, number> = {
  kick: 0.12,
  snare: 0.12,
  clap: 0.12,
  chh: 0.1,
  ohh: 0.22,
  perc: 0.12,
  shaker: 0.08,
  cymbal: 0.5,
};

/** Deterministic PRNG (mulberry32) so a seed reproduces a pattern. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (n: number, lo: number, hi: number) =>
  n < lo ? lo : n > hi ? hi : n;

/**
 * Approx N(0,1) in ~[-1,1] from three uniforms — a cheap bell curve. Human
 * timing/velocity clusters near the target with rare outliers; a flat uniform
 * spreads error evenly, which is what makes machine humanization sound random.
 */
function gaussian(next: () => number): number {
  return ((next() + next() + next()) / 3) * 2 - 1;
}

/** Stable 0-based index per element, for deriving independent per-voice seeds. */
const ELEMENT_INDEX = Object.fromEntries(
  ELEMENTS.map((e, i) => [e.key, i]),
) as Record<ElementKey, number>;

/**
 * The seed an element actually draws from: its lock seed if locked, otherwise a
 * deterministic mix of the global seed and the element's index. Re-shuffling
 * (new global seed) changes every UNLOCKED voice while locked voices hold.
 */
export function effectiveSeed(
  globalSeed: number,
  key: ElementKey,
  locks?: Partial<Record<ElementKey, number>>,
): number {
  const locked = locks?.[key];
  if (locked != null) return locked >>> 0 || 1;
  const idx = ELEMENT_INDEX[key] ?? 0;
  let h = (globalSeed ^ Math.imul(idx + 1, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  h = (h ^ (h >>> 15)) >>> 0;
  return h || 1;
}

function findStyle(name: string): Style {
  return STYLES.find((s) => s.name === name) ?? STYLES[0]!;
}

/** Steps of the final bar covered by the chosen fill. */
function fillRegion(fill: FillKind): { start: number; end: number } | null {
  switch (fill) {
    case "beat":
      return { start: 12, end: 16 };
    case "half":
      return { start: 8, end: 16 };
    case "bar":
      return { start: 0, end: 16 };
    default:
      return null;
  }
}

/**
 * Generate a styled drum pattern.
 *
 * @param config   UI state from the panel.
 * @param noteMap  Resolved MIDI note per element (from the Drum Rack, or GM).
 */
export function generate(
  config: GenConfig,
  noteMap: Record<ElementKey, number>,
): NoteDescription[] {
  const style = findStyle(config.styleName);
  const globalSeed = config.seed || 1;
  const bars = clamp(Math.round(config.bars), 1, 4);
  const region = fillRegion(config.fill);
  const notes: NoteDescription[] = [];

  const swingDelay = config.swing * 0.5 * STEP; // up to half a 16th
  const pocketOffset = config.pocket * 0.04; // ±~40 ticks of feel
  const humAmt = clamp(config.humanize, 0, 1);
  const swingOff = new Set(config.swingExclude ?? []);
  const pocketOff = new Set(config.pocketExclude ?? []);

  // One independent RNG per element, seeded from its effective seed, so a
  // locked element's pattern is invariant under Re-Shuffle of the others.
  const rngFor = new Map<ElementKey, () => number>();
  const draw = (key: ElementKey): number => {
    let r = rngFor.get(key);
    if (!r) {
      r = rng(effectiveSeed(globalSeed, key, config.locks));
      rngFor.set(key, r);
    }
    return r();
  };

  for (let bar = 0; bar < bars; bar++) {
    const isLastBar = bar === bars - 1;
    const barStart = bar * STEPS_PER_BAR * STEP;

    for (const el of ELEMENTS) {
      const groove = style.elements[el.key];
      if (!groove) continue;
      const density = config.densities[el.key] ?? groove.density;
      if (density <= 0) continue;
      const pitch = noteMap[el.key];
      const inFill = isLastBar && region;
      const elSwing = swingOff.has(el.key) ? 0 : swingDelay;
      const elPocket = pocketOff.has(el.key) ? 0 : pocketOffset;
      // Differential pocket: each voice's own micro-timing (override > style).
      const elMicro =
        (config.microtiming?.[el.key] ?? style.microtiming?.[el.key] ?? 0) * STEP;

      for (let step = 0; step < STEPS_PER_BAR; step++) {
        const stepInRegion =
          inFill && step >= region!.start && step < region!.end;

        let fire = false;
        let velocity = groove.vel[step] || 90;

        if (stepInRegion) {
          // Fill: snare/tom roll with a crescendo; everything else rests so
          // the fill reads clearly. Kick keeps only the region downbeat.
          const span = region!.end - region!.start;
          const pos = (step - region!.start) / Math.max(1, span - 1);
          if (el.key === "snare" || el.key === "perc") {
            fire = true;
            velocity = Math.round(60 + pos * 58); // G..A crescendo
          } else if (el.key === "kick" && step === region!.start) {
            fire = true;
          } else if (el.key === "cymbal" && step === region!.start) {
            fire = true;
          }
        } else {
          const base = groove.prob[step] || 0;
          const effProb = clamp(base * (density * 2), 0, 1);
          fire = effProb >= 1 ? true : draw(el.key) < effProb;
        }

        if (!fire || velocity <= 0) continue;

        // Swing delays the off-beat sixteenths (odd steps) — unless excluded.
        const swing = step % 2 === 1 ? elSwing : 0;
        // Coupled humanize: ONE "feel" per note drives both timing and velocity.
        // A relaxed note drags late AND softens; an urgent note rushes early AND
        // hits harder (negatively correlated — how drummers actually play) —
        // rather than two independent random jitters.
        const next = () => draw(el.key);
        const feel = gaussian(next);
        const jitter = feel * humAmt * 0.025;
        const startTime = clamp(
          barStart + step * STEP + swing + elPocket + elMicro + jitter,
          0,
          bars * STEPS_PER_BAR * STEP - 0.01,
        );

        // Velocity: the shared feel (−correlated) plus a smaller independent spread.
        const vJit = -feel * humAmt * 14 + gaussian(next) * humAmt * 7;
        const vel = Math.round(clamp(velocity + vJit, 1, 127));

        notes.push({
          pitch,
          startTime,
          duration: DURATION[el.key],
          velocity: vel,
          velocityDeviation: Math.round(humAmt * 18),
          probability: 1,
          muted: false,
        });
      }
    }
  }

  notes.sort((a, b) => a.startTime - b.startTime);
  return notes;
}

/** Build the default density map for a style (used when the panel opens). */
export function defaultDensities(styleName: string): Record<ElementKey, number> {
  const style = findStyle(styleName);
  const out = {} as Record<ElementKey, number>;
  for (const el of ELEMENTS) {
    out[el.key] = style.elements[el.key]?.density ?? 0;
  }
  return out;
}
