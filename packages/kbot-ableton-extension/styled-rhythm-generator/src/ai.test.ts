import { describe, it, expect } from "vitest";
import {
  buildMessages,
  parsePattern,
  patternToNotes,
  type AiConfig,
  type Pattern,
} from "./ai.js";
import { ELEMENTS, type ElementKey } from "./grooves.js";

const GM = Object.fromEntries(
  ELEMENTS.map((e) => [e.key, e.gmNote]),
) as Record<ElementKey, number>;

const aiCfg = (over: Partial<AiConfig> = {}): AiConfig => ({
  prompt: "boom bap",
  bars: 1,
  swing: 0,
  humanize: 0,
  ...over,
});

describe("parsePattern — model output sanitization", () => {
  it("parses a clean JSON grid", () => {
    const p = parsePattern('{"kick":[100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}');
    expect(p.kick).toHaveLength(16);
    expect(p.kick![0]).toBe(100);
  });

  it("peels prose and markdown fences around the object", () => {
    const text =
      "Sure! Here is your groove:\n```json\n" +
      '{"snare":[0,0,0,0,120,0,0,0,0,0,0,0,120,0,0,0]}' +
      "\n```\nEnjoy.";
    const p = parsePattern(text);
    expect(p.snare![4]).toBe(120);
    expect(p.snare![12]).toBe(120);
  });

  it("pads short rows and truncates long rows to exactly 16 steps", () => {
    const p = parsePattern('{"kick":[100,100,100],"snare":[' + "1,".repeat(40).slice(0, -1) + "]}");
    expect(p.kick).toHaveLength(16);
    expect(p.snare).toHaveLength(16);
    expect(p.kick![3]).toBe(0); // padded
  });

  it("clamps velocities to 0..127 and rounds floats", () => {
    const p = parsePattern('{"kick":[200,-5,63.7,0,0,0,0,0,0,0,0,0,0,0,0,0]}');
    expect(p.kick![0]).toBe(127);
    expect(p.kick![1]).toBe(0);
    expect(p.kick![2]).toBe(64);
  });

  it("coerces non-finite / non-numeric cells to 0", () => {
    const p = parsePattern('{"kick":["x",null,90,0,0,0,0,0,0,0,0,0,0,0,0,0]}');
    expect(p.kick![0]).toBe(0);
    expect(p.kick![1]).toBe(0);
    expect(p.kick![2]).toBe(90);
  });

  it("drops unknown keys and non-array values", () => {
    const p = parsePattern(
      '{"kick":[90,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"tuba":[1,2,3],"snare":42}',
    );
    expect(p.kick).toBeDefined();
    expect((p as Record<string, unknown>).tuba).toBeUndefined();
    expect(p.snare).toBeUndefined();
  });

  it("throws on genuinely unparseable text (caller catches and falls back)", () => {
    expect(() => parsePattern("not json at all")).toThrow();
  });
});

describe("patternToNotes — grid to notes", () => {
  const grid: Pattern = {
    kick: [110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 118, 0, 0, 0, 0, 0, 0, 0, 118, 0, 0, 0],
  };

  it("emits one note per non-zero cell at the mapped pitch and time", () => {
    const notes = patternToNotes(grid, GM, aiCfg());
    expect(notes).toHaveLength(3);
    const kick = notes.find((n) => n.pitch === GM.kick)!;
    expect(kick.startTime).toBe(0);
    const snares = notes
      .filter((n) => n.pitch === GM.snare)
      .map((n) => n.startTime)
      .sort((a, b) => a - b);
    expect(snares).toEqual([1, 3]); // steps 4 and 12 ⇒ beats 1 and 3
  });

  it("skips rest (0-velocity) cells", () => {
    const sparse: Pattern = { kick: new Array(16).fill(0) };
    sparse.kick![8] = 100;
    const notes = patternToNotes(sparse, GM, aiCfg());
    expect(notes).toHaveLength(1);
    expect(notes[0]!.startTime).toBe(2); // step 8 ⇒ beat 2
  });

  it("returns nothing for an empty pattern", () => {
    expect(patternToNotes({}, GM, aiCfg())).toEqual([]);
  });

  it("clamps the bar count to 1..4 and tiles the grid", () => {
    const notes = patternToNotes(grid, GM, aiCfg({ bars: 99 }));
    // 3 hits/bar × 4 bars (clamped) = 12.
    expect(notes).toHaveLength(12);
    for (const n of notes) {
      expect(n.startTime).toBeLessThan(4 * 4); // < 16 beats
    }
  });

  it("keeps velocities within 1..127 even at full humanize", () => {
    const hot: Pattern = { snare: new Array(16).fill(127) };
    const notes = patternToNotes(hot, GM, aiCfg({ humanize: 1 }));
    for (const n of notes) {
      expect(n.velocity).toBeGreaterThanOrEqual(1);
      expect(n.velocity).toBeLessThanOrEqual(127);
    }
  });

  it("applies swing to odd-step hits only", () => {
    const offbeats: Pattern = { chh: new Array(16).fill(0) };
    offbeats.chh![0] = 90; // on-beat
    offbeats.chh![1] = 90; // off-beat (odd)
    const straight = patternToNotes(offbeats, GM, aiCfg());
    const swung = patternToNotes(offbeats, GM, aiCfg({ swing: 1 }));
    const SWING = 1 * 0.5 * 0.25;
    expect(straight.map((n) => n.startTime).sort((a, b) => a - b)).toEqual([
      0, 0.25,
    ]);
    expect(swung.map((n) => n.startTime).sort((a, b) => a - b)).toEqual([
      0,
      0.25 + SWING,
    ]);
  });
});

describe("buildMessages — prompt assembly", () => {
  it("produces a system + user pair", () => {
    const msgs = buildMessages(aiCfg({ prompt: "dusty lo-fi swing" }));
    expect(msgs).toHaveLength(2);
    expect(msgs[0]!.role).toBe("system");
    expect(msgs[1]!.role).toBe("user");
  });

  it("the user message carries the caller's prompt verbatim", () => {
    const msgs = buildMessages(aiCfg({ prompt: "dusty lo-fi swing" }));
    expect(msgs[1]!.content).toContain("dusty lo-fi swing");
  });

  it("the system message advertises every legal element key", () => {
    const sys = buildMessages(aiCfg()).find((m) => m.role === "system")!.content;
    for (const el of ELEMENTS) expect(sys).toContain(el.key);
  });
});
