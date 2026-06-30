/**
 * groove — emit a styled drum pattern as JSON ready for the Ableton OSC bridge
 * (`mcp__kbot__ableton_midi`). The agent-native path: generate here, write to
 * Live over OSC, no GUI. Each note is { pitch, start, duration, velocity }.
 *
 *   npx tsx tools/groove.ts <style> [bars] [seed]
 *   npx tsx tools/groove.ts "Funk" 2 4242
 *
 * Pulls each style's own swing/pocket/humanize/microtiming defaults, so the
 * pocket (e.g. Hip Hop's laid-back snare, Funk's pushed kick) comes through.
 */
import { generate, defaultDensities } from "../src/generate.js";
import { ELEMENTS, STYLES } from "../src/grooves.js";

const GM = Object.fromEntries(ELEMENTS.map((e) => [e.key, e.gmNote])) as Record<
  string,
  number
>;

const styleName = process.argv[2] || "Hip Hop";
const bars = Number(process.argv[3] || 2);
const seed = Number(process.argv[4] || 4242);
const style = STYLES.find((s) => s.name === styleName) ?? STYLES[0]!;

const notes = generate(
  {
    styleName: style.name,
    bars,
    swing: style.swing,
    pocket: style.pocket,
    humanize: style.humanize,
    fill: "beat",
    densities: defaultDensities(style.name),
    seed,
  },
  GM as never,
);

const out = notes.map((n) => ({
  pitch: n.pitch,
  start: +n.startTime.toFixed(4),
  duration: +n.duration.toFixed(3),
  velocity: n.velocity,
}));
console.log(JSON.stringify(out));
