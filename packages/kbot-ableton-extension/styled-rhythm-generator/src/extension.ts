import {
  initialize,
  Clip,
  MidiClip,
  DrumRack,
  Track,
  type ActivationContext,
  type ApiVersion,
  type DataModelObject,
  type Handle,
} from "@ableton-extensions/sdk";
import { ELEMENTS, STYLES, STYLE_NAMES, type ElementKey } from "./grooves.js";
import { generate, defaultDensities, type GenConfig } from "./generate.js";
import {
  buildMessages,
  parsePattern,
  patternToNotes,
  DEFAULT_MODEL,
  OLLAMA_URL,
  type AiConfig,
  type Pattern,
} from "./ai.js";
import interfaceHtml from "./interface.html";
import aiHtml from "./interface-ai.html";

const COMMAND_ID = "kbot.styledRhythm.run";
const AI_COMMAND_ID = "kbot.styledRhythm.ai";

export function activate(activation: ActivationContext) {
  const api = initialize(activation, "1.0.0");

  api.commands.registerCommand(COMMAND_ID, (arg: unknown) =>
    (async (handle: Handle) => {
      const clip = api.getObjectFromHandle(handle, Clip);
      if (!(clip instanceof MidiClip)) {
        console.error("[kbot styled-rhythm] Not a MIDI clip — nothing to do.");
        return;
      }

      // Resolve which MIDI note each drum element should target by reading the
      // track's Drum Rack (falling back to General MIDI when absent).
      const track = findTrack(clip);
      const { map, mapped } = resolveNoteMap(track);

      // Build the panel's init payload (styles + the detected kit) and hand it
      // to the modal through the URL fragment.
      const init = {
        styles: STYLES.map((s) => ({
          name: s.name,
          swing: s.swing,
          pocket: s.pocket,
          humanize: s.humanize,
          densities: densitiesOf(s.name),
          // Per-element prob/vel grids let the panel render a live firing
          // preview that mirrors the host generator step-for-step.
          grooves: Object.fromEntries(
            ELEMENTS.map((el) => {
              const gr = s.elements[el.key];
              return [el.key, gr ? { prob: gr.prob, vel: gr.vel } : null];
            }),
          ),
        })),
        elements: ELEMENTS.map((el) => ({
          key: el.key,
          label: el.label,
          mapped: mapped[el.key],
          note: map[el.key],
        })),
      };
      // Inject the init payload via placeholder replacement (the in-Live-proven
      // pattern from kbot-toolkit). Function replacer avoids `$` being treated
      // as a special replacement token.
      const html = interfaceHtml.replace("__SRG_INIT__", () =>
        JSON.stringify(init),
      );
      const url = `data:text/html,${encodeURIComponent(html)}`;

      // Wide landscape: control bar + hero piano-roll preview + horizontal
      // fader mixer + footer. Sticky header/footer survive Live's height clamp.
      const raw = await api.ui.showModalDialog(url, 940, 600);
      if (!raw) return; // window closed without a choice
      let config: GenConfig | null = null;
      try {
        config = JSON.parse(raw) as GenConfig | null;
      } catch {
        console.error("[kbot styled-rhythm] Bad config from panel.");
        return;
      }
      if (!config) return; // user cancelled

      const notes = generate(config, map);

      // One user-facing undo step.
      api.withinTransaction(() => {
        clip.notes = notes;
      });

      console.log(
        `[kbot styled-rhythm] ${config.styleName}: wrote ${notes.length} ` +
          `note(s) over ${config.bars} bar(s)` +
          (config.fill !== "none" ? ` with ${config.fill} fill.` : "."),
      );
    })(arg as Handle),
  );

  // --- Pattern Drop: generate the grid with a local Ollama model -----------
  api.commands.registerCommand(AI_COMMAND_ID, (arg: unknown) =>
    (async (handle: Handle) => {
      const clip = api.getObjectFromHandle(handle, Clip);
      if (!(clip instanceof MidiClip)) {
        console.error("[kbot pattern-drop] Not a MIDI clip — nothing to do.");
        return;
      }
      const { map } = resolveNoteMap(findTrack(clip));

      const url = `data:text/html,${encodeURIComponent(aiHtml)}`;
      const raw = await api.ui.showModalDialog(url, 380, 340);
      if (!raw) return;
      let cfg: AiConfig | null = null;
      try {
        cfg = JSON.parse(raw) as AiConfig | null;
      } catch {
        return;
      }
      if (!cfg) return;
      const config = cfg;

      await api.ui.withinProgressDialog(
        `Pattern Drop — ${config.model || DEFAULT_MODEL}`,
        {},
        async (update, signal) => {
          await update("Asking the model for a groove…", undefined);

          let pattern: Pattern | null = null;
          try {
            pattern = await callOllama(config, signal);
          } catch (err) {
            if (signal.aborted) return;
            console.error("[kbot pattern-drop] Ollama call failed:", err);
          }

          let notes;
          let source: string;
          if (pattern && Object.keys(pattern).length > 0) {
            notes = patternToNotes(pattern, map, config);
            source = config.model || DEFAULT_MODEL;
          } else {
            // Local model unreachable / empty — fall back to the algorithm.
            await update("Model unavailable — using built-in generator", undefined);
            const style = guessStyle(config.prompt);
            notes = generate(
              {
                styleName: style,
                bars: config.bars,
                swing: config.swing,
                pocket: 0,
                humanize: config.humanize,
                fill: "none",
                densities: defaultDensities(style),
                seed: (Date.now() & 0x7fffffff) || 1,
              },
              map,
            );
            source = `built-in (${style})`;
          }

          if (signal.aborted) return;
          api.withinTransaction(() => {
            clip.notes = notes;
          });
          await update(`Wrote ${notes.length} notes`, 100);
          console.log(
            `[kbot pattern-drop] ${source}: wrote ${notes.length} note(s).`,
          );
        },
      );
    })(arg as Handle),
  );

  api.ui.registerContextMenuAction(
    "MidiClip",
    "kbot: Generate Rhythm",
    COMMAND_ID,
  );
  api.ui.registerContextMenuAction(
    "MidiClip",
    "kbot: Pattern Drop (AI)",
    AI_COMMAND_ID,
  );
}

/** POST the chat request to a local Ollama, forcing JSON output. */
async function callOllama(cfg: AiConfig, signal: AbortSignal): Promise<Pattern> {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: cfg.model || DEFAULT_MODEL,
      messages: buildMessages(cfg),
      stream: false,
      format: "json",
      options: { temperature: 0.85 },
    }),
    signal,
  });
  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
  const data = (await res.json()) as { message?: { content?: string } };
  return parsePattern(data.message?.content ?? "");
}

/** Best-effort: pick a built-in style whose name appears in the prompt. */
function guessStyle(prompt: string): string {
  const p = prompt.toLowerCase();
  const hit = STYLE_NAMES.find((n) => p.includes(n.toLowerCase()));
  if (hit) return hit;
  if (/\bboom.?bap\b|\blo.?fi\b|\bdusty\b/.test(p)) return "Hip Hop";
  if (/\b808\b|\brattle\b/.test(p)) return "Trap";
  if (/\bfour.on.the.floor\b|\bclub\b/.test(p)) return "House";
  return "House";
}

/** Walk the object hierarchy from a clip up to its owning Track. */
function findTrack<V extends ApiVersion>(clip: Clip<V>): Track<V> | null {
  let node: DataModelObject<V> | null = clip.parent;
  for (let i = 0; node && i < 8; i++) {
    if (node instanceof Track) return node as Track<V>;
    node = node.parent;
  }
  return null;
}

/**
 * Map each drum element to a MIDI note. Prefers a Drum Rack pad whose inner
 * device name matches the element's keywords, then a pad sitting on the
 * element's GM note, and finally the GM note itself. No pad is claimed twice.
 */
function resolveNoteMap<V extends ApiVersion>(track: Track<V> | null): {
  map: Record<ElementKey, number>;
  mapped: Record<ElementKey, boolean>;
} {
  const map = {} as Record<ElementKey, number>;
  const mapped = {} as Record<ElementKey, boolean>;

  const rack = track?.devices.find((d) => d instanceof DrumRack) as
    | DrumRack<V>
    | undefined;
  const pads = rack
    ? rack.chains.map((c) => ({
        note: c.receivingNote,
        name: (c.devices[0]?.name ?? "").toLowerCase(),
      }))
    : [];
  const used = new Set<number>();

  // Specific elements first so e.g. an "Open Hat" pad is claimed by `ohh`
  // before the broader `chh` "hat" keyword can take it.
  const priority: ElementKey[] = [
    "kick", "snare", "clap", "ohh", "chh", "perc", "shaker", "cymbal",
  ];
  const byKey = Object.fromEntries(ELEMENTS.map((e) => [e.key, e]));

  for (const key of priority) {
    const el = byKey[key]!;
    let pad =
      pads.find((p) => !used.has(p.note) && el.match.some((k) => p.name.includes(k))) ??
      pads.find((p) => !used.has(p.note) && p.note === el.gmNote);
    if (pad) {
      map[key] = pad.note;
      mapped[key] = true;
      used.add(pad.note);
    } else {
      map[key] = el.gmNote;
      mapped[key] = false;
    }
  }
  return { map, mapped };
}

/** Default density per element for a style, keyed for the panel. */
function densitiesOf(styleName: string): Record<string, number> {
  const style = STYLES.find((s) => s.name === styleName);
  const out: Record<string, number> = {};
  for (const el of ELEMENTS) {
    out[el.key] = style?.elements[el.key]?.density ?? 0;
  }
  return out;
}
