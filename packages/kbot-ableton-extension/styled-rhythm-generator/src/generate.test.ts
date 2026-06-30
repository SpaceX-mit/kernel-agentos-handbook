import { describe, it, expect } from "vitest";
import {
  generate,
  defaultDensities,
  effectiveSeed,
  type GenConfig,
} from "./generate.js";
import { ELEMENTS, STYLES, STYLE_NAMES, type ElementKey } from "./grooves.js";

/** General-MIDI note per element — the panel's fallback map. */
const GM = Object.fromEntries(
  ELEMENTS.map((e) => [e.key, e.gmNote]),
) as Record<ElementKey, number>;

/** A config with all feel switched OFF, so step→time math is exact. */
function flatConfig(over: Partial<GenConfig> = {}): GenConfig {
  return {
    styleName: "House",
    bars: 1,
    swing: 0,
    pocket: 0,
    humanize: 0,
    fill: "none",
    densities: defaultDensities("House"),
    seed: 1,
    ...over,
  };
}

/** Only `key` audible; every other element muted to 0 density. */
function soloDensities(key: ElementKey): Record<ElementKey, number> {
  const d = {} as Record<ElementKey, number>;
  for (const el of ELEMENTS) d[el.key] = el.key === key ? 0.6 : 0;
  return d;
}

/** Beat positions (startTime) of notes written at a given pitch. */
const timesAtPitch = (
  notes: { pitch: number; startTime: number }[],
  pitch: number,
) =>
  notes
    .filter((n) => n.pitch === pitch)
    .map((n) => n.startTime)
    .sort((a, b) => a - b);

describe("generate — determinism", () => {
  it("same seed + config produces byte-identical notes", () => {
    const cfg = flatConfig({ styleName: "Funk", humanize: 0.5, seed: 12345 });
    expect(generate(cfg, GM)).toEqual(generate(cfg, GM));
  });

  it("a different seed changes a humanized pattern", () => {
    const a = generate(flatConfig({ humanize: 0.5, seed: 1 }), GM);
    const b = generate(flatConfig({ humanize: 0.5, seed: 2 }), GM);
    expect(a).not.toEqual(b);
  });

  it("every built-in style generates without throwing", () => {
    for (const name of STYLE_NAMES) {
      const notes = generate(flatConfig({ styleName: name, seed: 7 }), GM);
      expect(notes.length).toBeGreaterThan(0);
    }
  });

  it("an unknown style falls back to the first style rather than crashing", () => {
    const notes = generate(flatConfig({ styleName: "Polka (nope)" }), GM);
    const ref = generate(flatConfig({ styleName: STYLES[0]!.name }), GM);
    expect(notes).toEqual(ref);
  });
});

describe("generate — musical contracts", () => {
  it("House kick lands four-on-the-floor (beats 0,1,2,3)", () => {
    // House kick base=1 on steps 0,4,8,12; density 0.6 ⇒ effProb≥1 ⇒ always fires.
    const notes = generate(
      flatConfig({ densities: soloDensities("kick") }),
      GM,
    );
    expect(timesAtPitch(notes, GM.kick)).toEqual([0, 1, 2, 3]);
  });

  it("Pop snare lands on the backbeat (beats 1 and 3)", () => {
    const notes = generate(
      flatConfig({ styleName: "Pop", densities: soloDensities("snare") }),
      GM,
    );
    expect(timesAtPitch(notes, GM.snare)).toEqual([1, 3]);
  });

  it("density 0 fully mutes an element", () => {
    const notes = generate(
      flatConfig({ densities: soloDensities("kick") }),
      GM,
    );
    // soloDensities mutes the snare — no snare-pitch notes at all.
    expect(timesAtPitch(notes, GM.snare)).toEqual([]);
  });

  it("velocities always land in the legal MIDI range 1..127", () => {
    for (const name of STYLE_NAMES) {
      const notes = generate(
        flatConfig({ styleName: name, humanize: 1, seed: 99 }),
        GM,
      );
      for (const n of notes as { velocity: number }[]) {
        expect(n.velocity).toBeGreaterThanOrEqual(1);
        expect(n.velocity).toBeLessThanOrEqual(127);
      }
    }
  });
});

describe("generate — feel", () => {
  it("swing delays off-beat (odd-step) hits, leaves on-beats put", () => {
    // Reggaeton snare base=1 on steps 3,6,11,14 ⇒ guaranteed fires.
    const base = generate(
      flatConfig({ styleName: "Reggaeton", densities: soloDensities("snare") }),
      GM,
    );
    const swung = generate(
      flatConfig({
        styleName: "Reggaeton",
        densities: soloDensities("snare"),
        swing: 1,
      }),
      GM,
    );
    const t0 = timesAtPitch(base, GM.snare); // [0.75, 1.5, 2.75, 3.5]
    const t1 = timesAtPitch(swung, GM.snare);
    const SWING = 1 * 0.5 * 0.25; // == 0.125 beats at swing=1

    expect(t0).toEqual([0.75, 1.5, 2.75, 3.5]);
    // Odd steps 3 & 11 (beats 0.75, 2.75) get pushed; even steps 6 & 14 hold.
    expect(t1).toEqual([0.75 + SWING, 1.5, 2.75 + SWING, 3.5]);
  });

  it("pocket shifts the whole pattern later (lay-back)", () => {
    const base = generate(
      flatConfig({ styleName: "Reggaeton", densities: soloDensities("snare") }),
      GM,
    );
    const laid = generate(
      flatConfig({
        styleName: "Reggaeton",
        densities: soloDensities("snare"),
        pocket: 1,
      }),
      GM,
    );
    const OFFSET = 1 * 0.04;
    const shifted = timesAtPitch(base, GM.snare).map((t) => t + OFFSET);
    expect(timesAtPitch(laid, GM.snare)).toEqual(shifted);
  });
});

describe("generate — fills & bars", () => {
  it("a 1-beat fill forces a snare roll over steps 12..15 of the last bar", () => {
    const notes = generate(
      flatConfig({
        styleName: "Reggaeton",
        densities: soloDensities("snare"),
        fill: "beat",
      }),
      GM,
    );
    const t = timesAtPitch(notes, GM.snare);
    // Fill region (beats 3..3.75) is fully populated regardless of base prob.
    expect(t).toEqual(expect.arrayContaining([3, 3.25, 3.5, 3.75]));
  });

  it("fill velocity crescendos across the roll", () => {
    const notes = generate(
      flatConfig({
        styleName: "Reggaeton",
        densities: soloDensities("snare"),
        fill: "beat",
      }),
      GM,
    ) as { pitch: number; startTime: number; velocity: number }[];
    const roll = notes
      .filter((n) => n.pitch === GM.snare && n.startTime >= 3)
      .sort((a, b) => a.startTime - b.startTime);
    for (let i = 1; i < roll.length; i++) {
      expect(roll[i]!.velocity).toBeGreaterThan(roll[i - 1]!.velocity);
    }
  });

  it("more bars writes proportionally more notes, all inside the loop window", () => {
    const one = generate(flatConfig({ bars: 1, seed: 5 }), GM);
    const two = generate(flatConfig({ bars: 2, seed: 5 }), GM);
    expect(two.length).toBeGreaterThan(one.length);
    // Nothing may be written at or past the end of the written window.
    const endBeats = 2 * 16 * 0.25; // 8 beats
    for (const n of two as { startTime: number }[]) {
      expect(n.startTime).toBeLessThan(endBeats);
    }
  });
});

describe("generate — per-element feel exclusion", () => {
  it("swingExclude keeps a voice dead-straight while others swing", () => {
    const base = flatConfig({
      styleName: "Reggaeton",
      densities: soloDensities("snare"),
      swing: 1,
    });
    const swung = generate(base, GM);
    const excluded = generate({ ...base, swingExclude: ["snare"] }, GM);
    // Reggaeton snare hits steps 3,6,11,14 ⇒ 0.75,1.5,2.75,3.5 with NO swing.
    expect(timesAtPitch(excluded, GM.snare)).toEqual([0.75, 1.5, 2.75, 3.5]);
    // With swing on, the odd-step hits (3,11) are pushed — so it differs.
    expect(timesAtPitch(swung, GM.snare)).not.toEqual(
      timesAtPitch(excluded, GM.snare),
    );
  });

  it("pocketExclude leaves a voice un-shifted while pocket is on", () => {
    const base = flatConfig({
      styleName: "Reggaeton",
      densities: soloDensities("snare"),
      pocket: 1,
    });
    const shifted = generate(base, GM);
    const excluded = generate({ ...base, pocketExclude: ["snare"] }, GM);
    expect(timesAtPitch(excluded, GM.snare)).toEqual([0.75, 1.5, 2.75, 3.5]);
    expect(timesAtPitch(shifted, GM.snare)[0]).toBeCloseTo(0.75 + 0.04, 10);
  });
});

describe("generate — lock on re-shuffle", () => {
  // Hip Hop kick + snare both have probabilistic steps, so re-shuffle moves them.
  const cfg = (seed: number, locks?: GenConfig["locks"]) =>
    flatConfig({ styleName: "Hip Hop", seed, locks });

  it("a fresh global seed re-rolls the probabilistic voices", () => {
    const a = generate(cfg(100), GM);
    const b = generate(cfg(200), GM);
    expect(a).not.toEqual(b);
  });

  it("locking a voice holds it through a re-shuffle while others change", () => {
    const a = generate(cfg(100), GM);
    const locks = { kick: effectiveSeed(100, "kick") };
    const reshuffled = generate(cfg(200, locks), GM);

    // The locked kick reproduces its seed-100 pattern exactly…
    expect(timesAtPitch(reshuffled, GM.kick)).toEqual(timesAtPitch(a, GM.kick));
    // …while an unlocked voice matches the NEW seed, not the old one.
    const fresh = generate(cfg(200), GM);
    expect(timesAtPitch(reshuffled, GM.snare)).toEqual(
      timesAtPitch(fresh, GM.snare),
    );
  });

  it("effectiveSeed is stable for a key and varies across keys", () => {
    expect(effectiveSeed(42, "kick")).toBe(effectiveSeed(42, "kick"));
    expect(effectiveSeed(42, "kick")).not.toBe(effectiveSeed(42, "snare"));
    // A lock seed overrides the global-derived seed.
    expect(effectiveSeed(42, "kick", { kick: 7 })).toBe(7);
  });
});

describe("generate — per-instrument microtiming (differential pocket)", () => {
  const STEP = 0.25;

  it("lays a voice back by its microtiming fraction of a 16th", () => {
    // Same seed ⇒ same steps fire; only the timing shifts.
    const base = flatConfig({
      styleName: "Hip Hop",
      densities: soloDensities("snare"),
      microtiming: { snare: 0 },
    });
    const grid = timesAtPitch(generate(base, GM), GM.snare);
    const laid = timesAtPitch(
      generate({ ...base, microtiming: { snare: 0.14 } }, GM),
      GM.snare,
    );
    expect(laid.length).toBe(grid.length);
    laid.forEach((t, i) => expect(t).toBeCloseTo(grid[i]! + 0.14 * STEP, 9));
  });

  it("pushes a voice ahead with a negative offset", () => {
    const base = flatConfig({
      styleName: "Funk",
      densities: soloDensities("kick"),
      microtiming: { kick: 0 },
    });
    const grid = timesAtPitch(generate(base, GM), GM.kick);
    const pushed = timesAtPitch(
      generate({ ...base, microtiming: { kick: -0.08 } }, GM),
      GM.kick,
    );
    pushed.forEach((t, i) =>
      // start is clamped at 0, so a pushed downbeat can't go negative.
      expect(t).toBeCloseTo(Math.max(0, grid[i]! - 0.08 * STEP), 9),
    );
  });

  it("applies the style's microtiming default when config omits it", () => {
    // Hip Hop ships snare: 0.14; omitting config.microtiming should use it.
    const def = timesAtPitch(
      generate(flatConfig({ styleName: "Hip Hop", densities: soloDensities("snare") }), GM),
      GM.snare,
    );
    const zero = timesAtPitch(
      generate(
        flatConfig({ styleName: "Hip Hop", densities: soloDensities("snare"), microtiming: { snare: 0 } }),
        GM,
      ),
      GM.snare,
    );
    def.forEach((t, i) => expect(t).toBeCloseTo(zero[i]! + 0.14 * STEP, 9));
  });

  it("a config override beats the style default", () => {
    const over = timesAtPitch(
      generate(
        flatConfig({ styleName: "Hip Hop", densities: soloDensities("snare"), microtiming: { snare: 0 } }),
        GM,
      ),
      GM.snare,
    );
    // With snare forced to 0, the guaranteed backbeat hits land dead on grid.
    expect(over).toEqual(expect.arrayContaining([1, 3]));
  });

  it("a straight style (no microtiming) is unaffected", () => {
    const a = generate(flatConfig({ styleName: "House", densities: soloDensities("kick") }), GM);
    // House kick four-on-the-floor stays exactly on beats 0,1,2,3.
    expect(timesAtPitch(a, GM.kick)).toEqual([0, 1, 2, 3]);
  });
});

describe("defaultDensities", () => {
  it("returns a value for all eight elements", () => {
    const d = defaultDensities("Afrobeats");
    for (const el of ELEMENTS) expect(d[el.key]).toBeTypeOf("number");
  });

  it("elements absent from a style default to 0 density", () => {
    // House defines no perc/shaker/cymbal — those should be 0.
    const d = defaultDensities("House");
    expect(d.perc).toBe(0);
    expect(d.cymbal).toBe(0);
  });
});
