// Pure, SDK-free helpers — easy to reason about and unit-test in isolation.
import type { NoteDescription } from "@ableton-extensions/sdk";

export function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

/** Pitch classes (0..11) that belong to the scale at the given root. */
export function allowedPitchClasses(root: number, intervals: number[]): Set<number> {
  return new Set(intervals.map((i) => mod12(root + i)));
}

/** Snap a MIDI pitch to the nearest in-scale pitch. Searches outward; ties go down. */
export function snapToScale(pitch: number, allowed: Set<number>): number {
  if (allowed.has(mod12(pitch))) return pitch;
  for (let d = 1; d <= 6; d += 1) {
    if (pitch - d >= 0 && allowed.has(mod12(pitch - d))) return pitch - d;
    if (pitch + d <= 127 && allowed.has(mod12(pitch + d))) return pitch + d;
  }
  return pitch;
}

export function quantizeToScale(
  notes: NoteDescription[],
  root: number,
  intervals: number[],
): { notes: NoteDescription[]; moved: number } {
  const allowed = allowedPitchClasses(root, intervals);
  let moved = 0;
  const out = notes.map((n) => {
    const pitch = snapToScale(n.pitch, allowed);
    if (pitch !== n.pitch) moved += 1;
    return { ...n, pitch };
  });
  return { notes: out, moved };
}

/** Add micro-timing and velocity jitter. `timing` is in beats, `velocity` in MIDI units. */
export function humanize(
  notes: NoteDescription[],
  opts: { timing: number; velocity: number; rng?: () => number },
): NoteDescription[] {
  const rng = opts.rng ?? Math.random;
  return notes.map((n) => {
    const start = Math.max(0, n.startTime + (rng() * 2 - 1) * opts.timing);
    const v0 = n.velocity ?? 100;
    const velocity = Math.max(1, Math.min(127, Math.round(v0 + (rng() * 2 - 1) * opts.velocity)));
    return { ...n, startTime: start, velocity };
  });
}

/**
 * The "shift notes" transform from the Ableton extensions tutorial: each note
 * adopts the next note's start time, the last wraps to the first. Pitch, duration
 * and velocity keep their array order, so the rhythm grid rotates by one slot.
 * Source start times are snapshotted first so the rotation isn't self-referential.
 * No-op (shallow copy) for fewer than two notes.
 */
export function rotateStartTimes(notes: NoteDescription[]): NoteDescription[] {
  if (notes.length < 2) return notes.map((n) => ({ ...n }));
  const starts = notes.map((n) => n.startTime);
  return notes.map((n, i) => ({ ...n, startTime: starts[(i + 1) % starts.length]! }));
}

export interface GenerateOpts {
  root: number; // 0..11
  intervals: number[]; // scale offsets from root
  bars: number;
  beatsPerBar: number;
  stepsPerBeat: number;
  density: number; // 0..1 probability a step gets a note
  octave: number; // base octave; 4 -> ~middle C (MIDI 60)
  seed: number;
}

/** Deterministic algorithmic pattern over the active scale. */
export function generatePattern(o: GenerateOpts): NoteDescription[] {
  const rng = mulberry32(o.seed);
  const base = (o.octave + 1) * 12; // octave 4 -> 60
  const scalePitches: number[] = [];
  for (let oct = 0; oct < 2; oct += 1) {
    for (const iv of o.intervals) scalePitches.push(base + oct * 12 + mod12(o.root + iv) + 0);
  }
  const totalSteps = Math.max(1, Math.round(o.bars * o.beatsPerBar * o.stepsPerBeat));
  const stepBeats = 1 / o.stepsPerBeat;
  const notes: NoteDescription[] = [];
  for (let s = 0; s < totalSteps; s += 1) {
    if (rng() < o.density) {
      const idx = Math.floor(rng() * scalePitches.length);
      const pitch = scalePitches[idx] ?? base;
      notes.push({
        pitch,
        startTime: s * stepBeats,
        duration: stepBeats,
        velocity: 80 + Math.floor(rng() * 40),
      });
    }
  }
  return notes;
}

/** Small, fast, seedable PRNG so generated patterns are reproducible. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function analyzeChannels(channels: Float32Array[]): {
  peakDb: number;
  rmsDb: number;
} {
  let peak = 0;
  let sumSq = 0;
  let count = 0;
  for (const ch of channels) {
    for (let i = 0; i < ch.length; i += 1) {
      const s = ch[i] ?? 0;
      const a = Math.abs(s);
      if (a > peak) peak = a;
      sumSq += s * s;
      count += 1;
    }
  }
  const rms = count ? Math.sqrt(sumSq / count) : 0;
  const toDb = (x: number) => (x > 0 ? 20 * Math.log10(x) : -Infinity);
  return { peakDb: toDb(peak), rmsDb: toDb(rms) };
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export function noteName(pitch: number): string {
  return `${NOTE_NAMES[mod12(pitch)]}${Math.floor(pitch / 12) - 1}`;
}

/** Name of a pitch class 0..11 (no octave), e.g. 0 -> "C". */
export function pitchClassName(pc: number): string {
  return NOTE_NAMES[mod12(pc)] ?? "C";
}
