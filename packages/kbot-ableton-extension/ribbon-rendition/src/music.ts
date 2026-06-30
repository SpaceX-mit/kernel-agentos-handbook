// ---------------------------------------------------------------------------
// "Ribbon in the Sky"–style rendition — note data.
//
// Key: Eb major. Tempo: 76 BPM. 8-bar loop (32 beats).
// Ableton MIDI convention: C3 = 60, so MIDI = pitchClass + 12 * (octave + 2).
//
// Progression (the seed, per the brief):
//   Ebmaj9 | Cm9 | Fm9 | Bb13 | Abmaj9 | Gm7 | Cm9 | Bb13
//
// Voicings are rootless / upper-structure with deliberate voice leading — the
// top voice steps rather than leaps, and the Abmaj9 (the IV) is voiced highest
// so the harmony physically lifts under the melody's peak. The dedicated bass
// track carries the roots, which frees the Rhodes to stay in the warm C3–C5
// "velvet" register.
// ---------------------------------------------------------------------------

/** One note. Matches the SDK's NoteDescription core fields. */
export interface Note {
  pitch: number; // 0..127
  startTime: number; // beats from clip start
  duration: number; // beats
  velocity: number; // 1..127
}

export const TEMPO = 76;
export const BARS = 8;
export const BEATS_PER_BAR = 4;
export const LOOP_BEATS = BARS * BEATS_PER_BAR; // 32

// Rhodes comping voicings, one per bar (MIDI). Top voice: F4 Eb4/D4 G4 G4 Bb4 G4 D4 G4
// — smooth motion, with the Abmaj9 reaching Bb4 as the harmonic high point.
const RHODES_VOICINGS: number[][] = [
  [67, 70, 74, 77], // 1 Ebmaj9 : G3 Bb3 D4 F4      (3 5 7 9)
  [63, 67, 70, 74], // 2 Cm9    : Eb3 G3 Bb3 D4      (b3 5 7 9)
  [68, 72, 75, 79], // 3 Fm9    : Ab3 C4 Eb4 G4      (b3 5 7 9)
  [68, 72, 74, 79], // 4 Bb13   : Ab3 C4 D4 G4       (b7 9 3 13)
  [72, 75, 79, 82], // 5 Abmaj9 : C4 Eb4 G4 Bb4      (3 5 7 9)  <- lift
  [70, 74, 77, 79], // 6 Gm7    : Bb3 D4 F4 G4       (b3 5 b7 1)
  [63, 67, 70, 74], // 7 Cm9    : Eb3 G3 Bb3 D4
  [68, 72, 74, 79], // 8 Bb13   : Ab3 C4 D4 G4
];

// Pad voicings: lower + a wide top, fewer notes, long and soft — the floating cloud.
const PAD_VOICINGS: number[][] = [
  [51, 58, 70], // Ebmaj9 : Eb2 Bb2 Bb3 (root, 5, 5-up)  wide
  [48, 55, 70], // Cm9    : C2 G2 Bb3
  [53, 60, 72], // Fm9    : F2 C3 C4
  [46, 53, 65], // Bb13   : Bb1 F2 F3
  [44, 51, 75], // Abmaj9 : Ab1 Eb2 Eb4   wide lift
  [43, 50, 67], // Gm7    : G1 D2 G3
  [48, 55, 70], // Cm9
  [46, 53, 65], // Bb13
];

// Singing bass: root-led with fifths and chromatic/diatonic approach tones into
// the next chord. Octave ~2 with dips to octave 1. [pitch, startInBar, dur]
const BASS_FIGURES: Array<Array<[number, number, number]>> = [
  [[51, 0, 1.5], [46, 2, 1], [50, 3, 1]], // Eb2 .. Bb1 .. D2   -> C
  [[48, 0, 1.5], [43, 2, 1], [51, 3, 1]], // C2  .. G1  .. Eb2  -> F
  [[53, 0, 1.5], [48, 2, 1], [44, 3, 1]], // F2  .. C2  .. Ab1  -> Bb
  [[46, 0, 1.5], [53, 2, 1], [44, 3, 1]], // Bb1 .. F2  .. Ab1  -> Ab
  [[44, 0, 1.5], [51, 2, 1], [43, 3, 1]], // Ab1 .. Eb2 .. G1   -> G
  [[43, 0, 1.5], [50, 2, 1], [46, 3, 1]], // G1  .. D2  .. Bb1  -> C
  [[48, 0, 1.5], [43, 2, 1], [46, 3, 1]], // C2  .. G1  .. Bb1  -> Bb
  [[46, 0, 2.0], [41, 2, 1], [50, 3, 1]], // Bb1 .. F1  .. D2   -> Eb (turnaround)
];

// Melody: a yearning line that climbs to F5 (89) over the Abmaj9 lift in bar 5,
// then descends and resolves home to Eb. Space is left between phrases.
// [pitch, absoluteStartBeat, duration, velocity]
const MELODY: Array<[number, number, number, number]> = [
  [82, 0.5, 1.0, 72], // Bb4
  [84, 1.5, 0.5, 70], // C5
  [86, 2.0, 1.5, 76], // D5  (maj7 over Ebmaj9)
  // breath
  [84, 4.5, 1.0, 70], // C5  (over Cm9)
  [82, 5.5, 0.5, 68], // Bb4
  [79, 6.0, 2.0, 66], // G4  settle
  // breath
  [80, 8.5, 1.0, 72], // Ab4 (over Fm9)
  [82, 9.5, 0.5, 72], // Bb4
  [84, 10.0, 1.5, 76], // C5
  // breath
  [86, 12.5, 1.0, 74], // D5  (over Bb13)
  [84, 13.5, 0.5, 74], // C5
  [82, 14.0, 1.5, 78], // Bb4 rising tension
  // CLIMAX over Abmaj9 (bar 5)
  [84, 16.0, 0.5, 78], // C5
  [87, 16.5, 0.5, 82], // Eb5
  [89, 17.0, 1.0, 86], // F5  <- PEAK
  [87, 18.0, 1.0, 80], // Eb5
  [84, 19.0, 1.0, 76], // C5  begin descent
  // Gm7
  [82, 20.0, 1.5, 72], // Bb4
  [79, 21.5, 0.5, 68], // G4
  [74, 22.0, 1.5, 64], // D4  (rest after)
  // resolve home (Cm9 -> Bb13)
  [75, 24.5, 1.0, 68], // Eb4
  [79, 25.5, 0.5, 68], // G4
  [77, 26.0, 2.0, 66], // F4
  [75, 28.0, 4.0, 62], // Eb4  long resolution to tonic
];

// Drum-rack note numbers (Ableton default rack: C1=36).
const KICK = 36;
const SNARE = 38;
const HAT = 42;

/** Small deterministic "human" offset so nothing lands perfectly on the grid. */
function jitter(seed: number, amount: number): number {
  // cheap hash -> [-amount, amount]
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 2 * amount;
}

export function rhodesNotes(): Note[] {
  const out: Note[] = [];
  RHODES_VOICINGS.forEach((chord, bar) => {
    const barStart = bar * BEATS_PER_BAR;
    chord.forEach((pitch, vi) => {
      out.push({
        pitch,
        startTime: Math.max(0, barStart + jitter(bar * 10 + vi, 0.012)),
        duration: 3.75,
        velocity: clampVel(56 + (vi === chord.length - 1 ? 6 : 0) + jitter(bar + vi, 5)),
      });
    });
  });
  return out;
}

export function padNotes(): Note[] {
  const out: Note[] = [];
  PAD_VOICINGS.forEach((chord, bar) => {
    const barStart = bar * BEATS_PER_BAR;
    chord.forEach((pitch, vi) => {
      out.push({
        pitch,
        startTime: barStart, // pad sits dead-still under the movement
        duration: 4.0, // overlaps into the next bar for a seamless wash
        velocity: clampVel(38 + jitter(bar * 3 + vi, 4)),
      });
    });
  });
  return out;
}

export function bassNotes(): Note[] {
  const out: Note[] = [];
  BASS_FIGURES.forEach((figure, bar) => {
    const barStart = bar * BEATS_PER_BAR;
    figure.forEach(([pitch, inBar, dur], i) => {
      out.push({
        pitch,
        startTime: Math.max(0, barStart + inBar + jitter(bar * 7 + i, 0.018)),
        duration: dur,
        velocity: clampVel(70 + jitter(bar + i * 2, 6)),
      });
    });
  });
  return out;
}

export function melodyNotes(): Note[] {
  return MELODY.map(([pitch, start, dur, vel], i) => ({
    pitch,
    startTime: Math.max(0, start + jitter(i * 5 + 1, 0.02)),
    duration: dur,
    velocity: clampVel(vel + jitter(i, 4)),
  }));
}

/**
 * Understated, swung drums. Kick on 1 and the "and of 3"; snare on 2 and 4
 * pulled slightly late; soft eighth-note hats with the off-beats nudged late
 * (~57% swing) and gently de-accented. Everything quiet.
 */
export function drumNotes(): Note[] {
  const out: Note[] = [];
  const swing = 0.08; // beats the off-beats are pushed late
  for (let bar = 0; bar < BARS; bar += 1) {
    const b = bar * BEATS_PER_BAR;
    // kick
    out.push({ pitch: KICK, startTime: b + 0.0, duration: 0.25, velocity: clampVel(72 + jitter(bar, 4)) });
    out.push({ pitch: KICK, startTime: b + 2.5 + swing, duration: 0.25, velocity: clampVel(58 + jitter(bar + 1, 4)) });
    // snare on 2 and 4, pulled a hair late
    out.push({ pitch: SNARE, startTime: b + 1.0 + 0.02, duration: 0.25, velocity: clampVel(54 + jitter(bar + 2, 5)) });
    out.push({ pitch: SNARE, startTime: b + 3.0 + 0.03, duration: 0.25, velocity: clampVel(56 + jitter(bar + 3, 5)) });
    // soft swung eighth hats
    for (let step = 0; step < 8; step += 1) {
      const off = step % 2 === 1;
      const t = b + step * 0.5 + (off ? swing : 0);
      const accent = step % 4 === 0 ? 8 : 0;
      out.push({ pitch: HAT, startTime: t, duration: 0.2, velocity: clampVel(36 + accent + jitter(bar * 8 + step, 4)) });
    }
  }
  return out;
}

function clampVel(v: number): number {
  return Math.max(1, Math.min(127, Math.round(v)));
}
