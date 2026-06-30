/**
 * Genre model for the Styled Rhythm Generator.
 *
 * Each style is a 1-bar, 16-step (sixteenth-note) grid. For every drum
 * element we store two parallel arrays of length 16:
 *   - `prob` : base trigger weight per step (0 = never, 1 = always)
 *   - `vel`  : MIDI velocity to use when that step fires (0 where unused)
 *
 * The mixer-style density sliders scale `prob` at generate time, so a slider
 * at center reproduces the groove as written here. Tuning a genre = editing
 * these arrays. They are intentionally literal and human-readable.
 */

export type ElementKey =
  | "kick"
  | "snare"
  | "clap"
  | "chh"
  | "ohh"
  | "perc"
  | "shaker"
  | "cymbal";

/** Canonical element order (drives slider order in the UI). */
export const ELEMENTS: {
  key: ElementKey;
  label: string;
  /** General-MIDI fallback note when no Drum Rack pad matches. */
  gmNote: number;
  /** Lower-case keywords matched against Drum Rack pad/chain names. */
  match: string[];
}[] = [
  { key: "kick", label: "Kick", gmNote: 36, match: ["kick", "bd", "808", "bass drum"] },
  { key: "snare", label: "Snare", gmNote: 38, match: ["snare", "sd", "snr"] },
  { key: "clap", label: "Clap", gmNote: 39, match: ["clap", "clp", "hand"] },
  { key: "chh", label: "Closed Hat", gmNote: 42, match: ["closed", "chh", "ch", "hat", "hh"] },
  { key: "ohh", label: "Open Hat", gmNote: 46, match: ["open", "ohh", "oh"] },
  { key: "perc", label: "Perc / Tom", gmNote: 47, match: ["perc", "tom", "conga", "bongo", "rim"] },
  { key: "shaker", label: "Shaker", gmNote: 70, match: ["shaker", "shake", "tamb", "maraca"] },
  { key: "cymbal", label: "Cymbal", gmNote: 49, match: ["crash", "ride", "cymbal", "cym"] },
];

export interface ElementGroove {
  prob: number[]; // length 16
  vel: number[]; // length 16
  /** Default density-slider position for this element (0..1). 0 = muted. */
  density: number;
}

export interface Style {
  name: string;
  /** Default swing amount 0..1 (0 = straight, delays off-beat 16ths). */
  swing: number;
  /** Default pocket / timing push (-1 pull ahead .. +1 lay back). */
  pocket: number;
  /** Default humanize amount 0..1 (velocity + micro-timing spread). */
  humanize: number;
  /**
   * Per-instrument micro-timing, in fractions of a 16th-note step.
   * Negative = ahead of the beat (pushed), positive = behind (laid-back).
   * This is what gives a groove its *differential* pocket — e.g. a snare that
   * lays back while the kick stays on top. Tempo-relative, so it holds at any BPM.
   * Omit an element for dead-on-grid (0).
   */
  microtiming?: Partial<Record<ElementKey, number>>;
  elements: Partial<Record<ElementKey, ElementGroove>>;
}

// Velocity tiers.
const A = 118; // accent
const S = 104; // strong
const M = 92; // medium
const G = 60; // ghost

const g = (density: number, prob: number[], vel: number[]): ElementGroove => ({
  prob,
  vel,
  density,
});

export const STYLES: Style[] = [
  {
    name: "Hip Hop",
    swing: 0.55,
    pocket: 0.18,
    humanize: 0.35,
    // Dilla feel: snare drags well behind, hats loosen, kick stays on top.
    microtiming: { snare: 0.14, clap: 0.14, chh: 0.05, ohh: 0.05 },
    elements: {
      kick: g(0.55,
        [1, 0, 0, 0.5, 0, 0, 0.6, 0, 0, 0, 1, 0, 0, 0, 0.4, 0],
        [A, 0, 0, G,   0, 0, M,   0, 0, 0, S, 0, 0, 0, G,   0]),
      snare: g(0.6,
        [0, 0, 0, 0, 1, 0, 0, 0.3, 0, 0, 0, 0, 1, 0, 0, 0.3],
        [0, 0, 0, 0, A, 0, 0, G,   0, 0, 0, 0, A, 0, 0, G]),
      clap: g(0,
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, S, 0, 0, 0, 0, 0, 0, 0, S, 0, 0, 0]),
      chh: g(0.55,
        [1, 0, 0.8, 0, 1, 0, 0.8, 0, 1, 0, 0.8, 0, 1, 0, 0.8, 0],
        [M, 0, G,   0, M, 0, G,   0, M, 0, G,   0, M, 0, G,   0]),
      ohh: g(0.4,
        [0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0.5],
        [0, 0, 0, 0, 0, 0, 0, M,   0, 0, 0, 0, 0, 0, 0, M]),
    },
  },
  {
    name: "Trap",
    swing: 0.1,
    pocket: 0,
    humanize: 0.2,
    elements: {
      kick: g(0.55,
        [1, 0, 0, 0.4, 0, 0, 0.8, 0, 0, 1, 0, 0, 0, 0.5, 0, 0],
        [A, 0, 0, M,   0, 0, S,   0, 0, A, 0, 0, 0, M,   0, 0]),
      snare: g(0.6,
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, A, 0, 0, 0, 0, 0, 0, 0]),
      clap: g(0.45,
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, S, 0, 0, 0, 0, 0, 0, 0]),
      chh: g(0.6,
        [1, 0.8, 1, 0.8, 1, 0.8, 1, 1, 1, 0.8, 1, 0.8, 1, 1, 1, 1],
        [S, G,   M, G,   S, G,   M, G, S, G,   M, G,   S, M, G, A]),
      ohh: g(0.35,
        [0, 0, 0, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, 0, 0, 0.4, 0],
        [0, 0, 0, 0, 0, 0, 0, M,   0, 0, 0, 0, 0, 0, M,   0]),
    },
  },
  {
    name: "Afrobeats",
    swing: 0.22,
    pocket: 0.1,
    humanize: 0.4,
    // Rolling, hand-played feel: percussion and shaker breathe behind the grid.
    microtiming: { perc: 0.07, shaker: 0.04, ohh: 0.05 },
    elements: {
      kick: g(0.55,
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [A, 0, 0, M, 0, 0, S, 0, 0, M, 0, 0, A, 0, 0, 0]),
      clap: g(0.4,
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, S, 0, 0, 0, 0, 0, 0, 0, S, 0, 0, 0]),
      chh: g(0.45,
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [M, 0, G, 0, M, 0, G, 0, M, 0, G, 0, M, 0, G, 0]),
      ohh: g(0.35,
        [0, 0, 0, 0.5, 0, 0, 0, 0.5, 0, 0, 0, 0.5, 0, 0, 0, 0.5],
        [0, 0, 0, M,   0, 0, 0, M,   0, 0, 0, M,   0, 0, 0, M]),
      perc: g(0.55,
        [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, S, 0, 0, M, 0, 0, S, 0, 0, M, 0, 0, S, 0]),
      shaker: g(0.65,
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [M, G, M, G, M, G, M, G, M, G, M, G, M, G, M, G]),
    },
  },
  {
    name: "House",
    swing: 0,
    pocket: 0,
    humanize: 0.15,
    elements: {
      kick: g(0.6,
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [A, 0, 0, 0, A, 0, 0, 0, A, 0, 0, 0, A, 0, 0, 0]),
      clap: g(0.5,
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, S, 0, 0, 0, 0, 0, 0, 0, S, 0, 0, 0]),
      chh: g(0.4,
        [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, M, 0, 0, 0, M, 0, 0, 0, M, 0, 0, 0, M, 0]),
      ohh: g(0.55,
        [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, S, 0, 0, 0, S, 0, 0, 0, S, 0, 0, 0, S, 0]),
    },
  },
  {
    name: "Techno",
    swing: 0,
    pocket: 0,
    humanize: 0.1,
    elements: {
      kick: g(0.65,
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [A, 0, 0, 0, A, 0, 0, 0, A, 0, 0, 0, A, 0, 0, 0]),
      clap: g(0.35,
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, M, 0, 0, 0, 0, 0, 0, 0, M, 0, 0, 0]),
      chh: g(0.5,
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [G, G, M, G, G, G, M, G, G, G, M, G, G, G, M, G]),
      ohh: g(0.5,
        [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, M, 0, 0, 0, M, 0, 0, 0, M, 0, 0, 0, M, 0]),
      perc: g(0.4,
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, G, 0, 0, G, 0, 0, 0, 0, G, 0, G, 0, 0]),
    },
  },
  {
    name: "Drum & Bass",
    swing: 0.15,
    pocket: 0,
    humanize: 0.3,
    elements: {
      kick: g(0.55,
        [1, 0, 0, 0, 0, 0, 0.8, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [A, 0, 0, 0, 0, 0, M,   0, 0, 0, S, 0, 0, 0, 0, 0]),
      snare: g(0.6,
        [0, 0, 0, 0.4, 1, 0, 0, 0.5, 0, 0, 0.4, 0, 1, 0, 0, 0.5],
        [0, 0, 0, G,   A, 0, 0, G,   0, 0, G,   0, A, 0, 0, G]),
      chh: g(0.5,
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [M, G, G, G, M, G, G, G, M, G, G, G, M, G, G, M]),
      ohh: g(0.3,
        [0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0.5, 0],
        [0, 0, 0, 0, 0, 0, M,   0, 0, 0, 0, 0, 0, 0, M,   0]),
      cymbal: g(0,
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [M, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    },
  },
  {
    name: "Reggaeton",
    swing: 0.05,
    pocket: 0,
    humanize: 0.2,
    elements: {
      kick: g(0.6,
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [A, 0, 0, 0, 0, 0, 0, 0, A, 0, 0, 0, 0, 0, 0, 0]),
      snare: g(0.6,
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, 0, A, 0, 0, S, 0, 0, 0, 0, A, 0, 0, S, 0]),
      clap: g(0.35,
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, 0, M, 0, 0, M, 0, 0, 0, 0, M, 0, 0, M, 0]),
      chh: g(0.45,
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [M, 0, G, 0, M, 0, G, 0, M, 0, G, 0, M, 0, G, 0]),
      ohh: g(0.3,
        [0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0.5],
        [0, 0, 0, 0, 0, 0, 0, M,   0, 0, 0, 0, 0, 0, 0, M]),
    },
  },
  {
    name: "Funk",
    swing: 0.28,
    pocket: 0.12,
    humanize: 0.45,
    // On-the-one funk: kick pushes slightly ahead, snare sits right on top.
    microtiming: { kick: -0.05, snare: -0.02, chh: 0.03 },
    elements: {
      kick: g(0.55,
        [1, 0, 0, 0.4, 0, 0.5, 0, 0, 0.6, 0, 0, 0.4, 0, 0, 0.5, 0],
        [A, 0, 0, G,   0, M,   0, 0, M,   0, 0, G,   0, 0, M,   0]),
      snare: g(0.6,
        [0, 0, 0.3, 0, 1, 0, 0.3, 0.2, 0, 0.3, 0, 0, 1, 0, 0.3, 0.2],
        [0, 0, G,   0, A, 0, G,   G,   0, G,   0, 0, A, 0, G,   G]),
      chh: g(0.55,
        [1, 0.7, 1, 0.7, 1, 0.7, 1, 0.7, 1, 0.7, 1, 0.7, 1, 0.7, 1, 0.7],
        [S, G,   M, G,   S, G,   M, G,   S, G,   M, G,   S, G,   M, G]),
      ohh: g(0.3,
        [0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0.5],
        [0, 0, 0, 0, 0, 0, 0, M,   0, 0, 0, 0, 0, 0, 0, M]),
    },
  },
  {
    name: "Disco",
    swing: 0.1,
    pocket: 0,
    humanize: 0.2,
    elements: {
      kick: g(0.6,
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [A, 0, 0, 0, A, 0, 0, 0, A, 0, 0, 0, A, 0, 0, 0]),
      snare: g(0.5,
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, S, 0, 0, 0, 0, 0, 0, 0, S, 0, 0, 0]),
      ohh: g(0.6,
        [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, S, 0, 0, 0, S, 0, 0, 0, S, 0, 0, 0, S, 0]),
      chh: g(0.45,
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [M, 0, 0, 0, M, 0, 0, 0, M, 0, 0, 0, M, 0, 0, 0]),
      shaker: g(0.4,
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G]),
    },
  },
  {
    name: "Pop",
    swing: 0.05,
    pocket: 0,
    humanize: 0.2,
    elements: {
      kick: g(0.6,
        [1, 0, 0, 0, 0, 0, 0.5, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [A, 0, 0, 0, 0, 0, M,   0, A, 0, 0, 0, 0, 0, 0, 0]),
      snare: g(0.6,
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, A, 0, 0, 0, 0, 0, 0, 0, A, 0, 0, 0]),
      clap: g(0.3,
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, M, 0, 0, 0, 0, 0, 0, 0, M, 0, 0, 0]),
      chh: g(0.5,
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [M, 0, G, 0, M, 0, G, 0, M, 0, G, 0, M, 0, G, 0]),
    },
  },
  {
    name: "Rock",
    swing: 0,
    pocket: 0,
    humanize: 0.25,
    elements: {
      kick: g(0.6,
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0.5, 0],
        [A, 0, 0, 0, 0, 0, M, 0, A, 0, 0, 0, 0, 0, G,   0]),
      snare: g(0.6,
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, A, 0, 0, 0, 0, 0, 0, 0, A, 0, 0, 0]),
      chh: g(0.55,
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [S, 0, M, 0, S, 0, M, 0, S, 0, M, 0, S, 0, M, 0]),
      cymbal: g(0,
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [S, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    },
  },
  {
    name: "UK Garage",
    swing: 0.6,
    pocket: 0.1,
    humanize: 0.35,
    elements: {
      kick: g(0.55,
        [1, 0, 0, 0, 0, 0, 0.6, 0, 0, 0, 1, 0, 0, 0.5, 0, 0],
        [A, 0, 0, 0, 0, 0, M,   0, 0, 0, S, 0, 0, G,   0, 0]),
      snare: g(0.55,
        [0, 0, 0, 0, 1, 0, 0, 0.3, 0, 0, 0, 0, 1, 0, 0, 0.3],
        [0, 0, 0, 0, A, 0, 0, G,   0, 0, 0, 0, A, 0, 0, G]),
      clap: g(0.3,
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, M, 0, 0, 0, 0, 0, 0, 0, M, 0, 0, 0]),
      chh: g(0.55,
        [1, 0, 0.8, 0.6, 1, 0, 0.8, 0, 1, 0.6, 0.8, 0, 1, 0, 0.8, 0.6],
        [M, 0, G,   G,   M, 0, G,   0, M, G,   G,   0, M, 0, G,   G]),
      ohh: g(0.4,
        [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, M, 0, 0, 0, M, 0, 0, 0, M, 0, 0, 0, M, 0]),
      shaker: g(0.3,
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G]),
    },
  },
  {
    name: "Breakbeat",
    swing: 0.2,
    pocket: 0.08,
    humanize: 0.35,
    elements: {
      kick: g(0.55,
        [1, 0, 0, 0, 0, 0, 0.7, 0, 0, 1, 0, 0, 0, 0, 0.4, 0],
        [A, 0, 0, 0, 0, 0, M,   0, 0, S, 0, 0, 0, 0, G,   0]),
      snare: g(0.6,
        [0, 0, 0.3, 0, 1, 0, 0, 0.3, 0, 0, 0.3, 0, 1, 0, 0.4, 0],
        [0, 0, G,   0, A, 0, 0, G,   0, 0, G,   0, A, 0, G,   0]),
      chh: g(0.5,
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [M, G, G, G, M, G, G, G, M, G, G, G, M, G, G, G]),
      ohh: g(0.3,
        [0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0],
        [0, 0, 0, M,   0, 0, 0, 0, 0, 0, 0, M,   0, 0, 0, 0]),
    },
  },
];

export const STYLE_NAMES = STYLES.map((s) => s.name);
