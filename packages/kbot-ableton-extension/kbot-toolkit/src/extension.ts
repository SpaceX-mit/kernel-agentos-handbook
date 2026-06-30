import {
  initialize,
  Clip,
  MidiClip,
  AudioClip,
  AudioTrack,
  ClipSlot,
  Scene,
  Device,
  DataModelObject,
  WarpMode,
  type ActivationContext,
  type Handle,
  type ArrangementSelection,
} from "@ableton-extensions/sdk";

import * as fs from "node:fs/promises";
import * as path from "node:path";
import decodeAudio from "audio-decode";

import generateHtml from "./generate.html";
import {
  quantizeToScale,
  humanize,
  rotateStartTimes,
  generatePattern,
  analyzeChannels,
  pitchClassName,
} from "./lib.js";

// ---------------------------------------------------------------------------
// Persistent settings (exercises environment.storageDirectory + filesystem)
// ---------------------------------------------------------------------------
interface ToolkitConfig {
  humanizeTiming: number; // beats
  humanizeVelocity: number; // MIDI units
  lastGenerate?: { bars: number; density: number; octave: number; seed: number };
}
const DEFAULT_CONFIG: ToolkitConfig = { humanizeTiming: 0.02, humanizeVelocity: 18 };

function fmtDb(db: number): string {
  return Number.isFinite(db) ? `${db.toFixed(1)} dB` : "-∞ dB";
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}

/** A minimal, self-closing info dialog (host -> webview data inlined; closes via close_and_send). */
function infoDialogHtml(title: string, lines: string[]): string {
  const body = lines.map((l) => `<div class="line">${escapeHtml(l)}</div>`).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><script>
function send(m){if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.live)window.webkit.messageHandlers.live.postMessage(m);else if(window.chrome&&window.chrome.webview)window.chrome.webview.postMessage(m);}
function done(){send({method:"close_and_send",params:[JSON.stringify({ok:true})]});}
document.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key==="Escape")done();});
</script><style>
html{background:hsl(0,0%,21%);color:hsl(0,0%,78%);font-family:sans-serif;font-size:12px;height:100%}
body{height:100%;display:flex;flex-direction:column;gap:.5em;padding:1.2em 1.4em;margin:0}
h1{font-size:1.1rem;font-weight:600;margin:0}.line{font-variant-numeric:tabular-nums}
.b{display:flex;justify-content:flex-end;margin-top:auto}
button{background:hsl(31,100%,67%);color:#111;border:none;height:24px;padding:0 1.2em;border-radius:12px;font-weight:600;cursor:pointer}
</style></head><body><h1>${escapeHtml(title)}</h1>${body}<div class="b"><button onclick="done()">OK</button></div></body></html>`;
}

export function activate(activation: ActivationContext) {
  const api = initialize(activation, "1.0.0");
  const storageDir = api.environment.storageDirectory;

  console.log(
    `[kbot Toolkit] activated. lang=${api.environment.language ?? "?"} ` +
      `storage=${storageDir ?? "(none)"}`,
  );

  const configPath = storageDir ? path.join(storageDir, "kbot-toolkit.json") : undefined;
  async function loadConfig(): Promise<ToolkitConfig> {
    if (!configPath) return { ...DEFAULT_CONFIG };
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(await fs.readFile(configPath, "utf8")) };
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }
  async function saveConfig(cfg: ToolkitConfig): Promise<void> {
    if (!configPath) return;
    try {
      await fs.writeFile(configPath, JSON.stringify(cfg, null, 2));
    } catch (e) {
      console.warn("[kbot] could not persist config:", e);
    }
  }
  async function showInfo(title: string, lines: string[]): Promise<void> {
    const html = infoDialogHtml(title, lines);
    const height = Math.min(420, 96 + lines.length * 20 + 56);
    await api.ui.showModalDialog(`data:text/html,${encodeURIComponent(html)}`, 420, height);
  }

  // --- 1. MidiClip: Quantize to Scale (notes get/set + transaction) --------
  api.commands.registerCommand("kbot.quantize", (arg: unknown) => {
    const clip = api.getObjectFromHandle(arg as Handle, Clip);
    if (!(clip instanceof MidiClip)) {
      console.error("[kbot] quantize: not a MIDI clip");
      return;
    }
    const song = api.application.song;
    const { notes, moved } = quantizeToScale(clip.notes, song.rootNote, song.scaleIntervals);
    api.withinTransaction(() => {
      clip.notes = notes;
    });
    console.log(`[kbot] quantize: snapped ${moved}/${notes.length} to ${song.scaleName}`);
  });

  // --- 2. MidiClip: Humanize (reads persisted settings) --------------------
  api.commands.registerCommand("kbot.humanize", (arg: unknown) =>
    void (async () => {
      const clip = api.getObjectFromHandle(arg as Handle, Clip);
      if (!(clip instanceof MidiClip)) return;
      const cfg = await loadConfig();
      const out = humanize(clip.notes, { timing: cfg.humanizeTiming, velocity: cfg.humanizeVelocity });
      api.withinTransaction(() => {
        clip.notes = out;
      });
      console.log(`[kbot] humanized ${out.length} notes (t=${cfg.humanizeTiming}, v=${cfg.humanizeVelocity})`);
    })().catch((e) => console.error(e)),
  );

  // --- 3. MidiClip: Generate Pattern (webview modal in+out + storage) ------
  api.commands.registerCommand("kbot.generate", (arg: unknown) =>
    void (async () => {
      const clip = api.getObjectFromHandle(arg as Handle, Clip);
      if (!(clip instanceof MidiClip)) return;
      const song = api.application.song;
      const cfg = await loadConfig();
      const ctx = {
        scaleRoot: pitchClassName(song.rootNote),
        scaleName: song.scaleName,
        last: cfg.lastGenerate ?? null,
      };
      const html = generateHtml.replace("__KBOT_CTX__", () => JSON.stringify(ctx));
      const raw = await api.ui.showModalDialog(`data:text/html,${encodeURIComponent(html)}`, 360, 300);
      const r = JSON.parse(raw) as { ok: boolean; bars: number; density: number; octave: number; seed: number };
      if (!r.ok) return;
      const notes = generatePattern({
        root: song.rootNote,
        intervals: song.scaleIntervals,
        bars: r.bars,
        beatsPerBar: 4,
        stepsPerBeat: 4,
        density: r.density,
        octave: r.octave,
        seed: r.seed,
      });
      api.withinTransaction(() => {
        clip.notes = notes;
      });
      await saveConfig({
        ...cfg,
        lastGenerate: { bars: r.bars, density: r.density, octave: r.octave, seed: r.seed },
      });
      console.log(`[kbot] generated ${notes.length} notes (${r.bars} bars, density ${r.density.toFixed(2)})`);
    })().catch((e) => console.error(e)),
  );

  // --- 3b. MidiClip: Shift Notes (the tutorial transform — rotate starts) --
  api.commands.registerCommand("kbot.shiftNotes", (arg: unknown) => {
    const clip = api.getObjectFromHandle(arg as Handle, Clip);
    if (!(clip instanceof MidiClip)) {
      console.error("[kbot] shiftNotes: not a MIDI clip");
      return;
    }
    if (clip.notes.length < 2) {
      console.log("[kbot] shiftNotes: not enough notes to shift");
      return;
    }
    const notes = rotateStartTimes(clip.notes);
    api.withinTransaction(() => {
      clip.notes = notes;
    });
    console.log(`[kbot] shifted ${notes.length} notes by one slot`);
  });

  // --- 4. AudioClip: Cycle Warp Mode (property mutation) -------------------
  api.commands.registerCommand("kbot.cycleWarp", (arg: unknown) => {
    const clip = api.getObjectFromHandle(arg as Handle, Clip);
    if (!(clip instanceof AudioClip)) {
      console.error("[kbot] cycleWarp: not an audio clip");
      return;
    }
    const order = [
      WarpMode.Beats,
      WarpMode.Tones,
      WarpMode.Texture,
      WarpMode.Repitch,
      WarpMode.Complex,
      WarpMode.ComplexPro,
    ];
    const next = order[(order.indexOf(clip.warpMode) + 1) % order.length] ?? WarpMode.Beats;
    clip.warpMode = next;
    console.log(`[kbot] warpMode -> ${WarpMode[next]}`);
  });

  // --- 5. ClipSlot: Seed MIDI Clip (session clip creation) -----------------
  api.commands.registerCommand("kbot.seedClip", (arg: unknown) =>
    void (async () => {
      const slot = api.getObjectFromHandle(arg as Handle, ClipSlot);
      if (slot.clip) {
        console.warn("[kbot] seedClip: slot already has a clip");
        return;
      }
      const song = api.application.song;
      const clip = await slot.createMidiClip(4);
      const notes = generatePattern({
        root: song.rootNote,
        intervals: song.scaleIntervals,
        bars: 1,
        beatsPerBar: 4,
        stepsPerBeat: 4,
        density: 0.5,
        octave: 4,
        seed: 7,
      });
      api.withinTransaction(() => {
        clip.notes = notes;
        clip.name = "kbot seed";
      });
      console.log(`[kbot] seeded new clip with ${notes.length} notes`);
    })().catch((e) => console.error(e)),
  );

  // --- 6. Scene: Duplicate x3 (song mutation, grouped undo) ----------------
  api.commands.registerCommand("kbot.dupScene", (arg: unknown) =>
    void (async () => {
      const scene = api.getObjectFromHandle(arg as Handle, Scene);
      const song = api.application.song;
      await api.withinTransaction(() =>
        Promise.all([song.duplicateScene(scene), song.duplicateScene(scene), song.duplicateScene(scene)]),
      );
      console.log("[kbot] duplicated scene x3 (one undo step)");
    })().catch((e) => console.error(e)),
  );

  // --- 7. AudioTrack selection: Analyze Loudness ---------------------------
  //     progress dialog + renderPreFxAudio + npm audio-decode + result dialog
  api.commands.registerCommand("kbot.analyze", (arg: unknown) =>
    void (async () => {
      const sel = arg as ArrangementSelection;
      const tracks = sel.selected_lanes
        .map((h) => api.getObjectFromHandle(h, DataModelObject))
        .filter((o): o is AudioTrack<"1.0.0"> => o instanceof AudioTrack);
      if (tracks.length === 0) {
        console.log("[kbot] analyze: no audio tracks in selection");
        return;
      }
      const lines = (await api.ui.withinProgressDialog(
        "kbot: Analyze Loudness",
        { progress: 0 },
        async (update, signal) => {
          const out: string[] = [];
          for (let i = 0; i < tracks.length; i += 1) {
            signal.throwIfAborted();
            const track = tracks[i]!;
            await update(`Rendering ${track.name}…`, (i / tracks.length) * 80);
            const wav = await api.resources.renderPreFxAudio(
              track,
              sel.time_selection_start,
              sel.time_selection_end,
            );
            const decoded = await decodeAudio(await fs.readFile(wav));
            const channels = Array.from({ length: decoded.numberOfChannels }, (_, c) =>
              decoded.getChannelData(c),
            );
            const { peakDb, rmsDb } = analyzeChannels(channels);
            out.push(`${track.name}:  peak ${fmtDb(peakDb)},  RMS ${fmtDb(rmsDb)}`);
            console.log(`[kbot] ${out[out.length - 1]}`);
          }
          await update("Done", 100);
          return out;
        },
      )) as string[];
      await showInfo("Loudness", lines);
    })().catch((e) => console.error(e)),
  );

  // --- 8. DrumRack / Simpler: Randomize continuous params ------------------
  api.commands.registerCommand("kbot.randomize", (arg: unknown) =>
    void (async () => {
      const device = api.getObjectFromHandle(arg as Handle, Device);
      const targets = device.parameters.filter((p) => !p.isQuantized && p.max > p.min).slice(0, 8);
      if (targets.length === 0) {
        console.log("[kbot] randomize: no continuous params");
        return;
      }
      await api.withinTransaction(() =>
        Promise.all(targets.map((p) => p.setValue(p.min + Math.random() * (p.max - p.min)))),
      );
      console.log(`[kbot] randomized ${targets.length} params on ${device.name}`);
    })().catch((e) => console.error(e)),
  );

  // --- Context-menu wiring (scopes: MidiClip, AudioClip, ClipSlot, Scene, AudioTrack selection, DrumRack, Simpler) ---
  api.ui.registerContextMenuAction("MidiClip", "kbot: Quantize to Scale", "kbot.quantize");
  api.ui.registerContextMenuAction("MidiClip", "kbot: Humanize", "kbot.humanize");
  api.ui.registerContextMenuAction("MidiClip", "kbot: Generate Pattern…", "kbot.generate");
  api.ui.registerContextMenuAction("MidiClip", "kbot: Shift Notes", "kbot.shiftNotes");
  api.ui.registerContextMenuAction("AudioClip", "kbot: Cycle Warp Mode", "kbot.cycleWarp");
  api.ui.registerContextMenuAction("ClipSlot", "kbot: Seed MIDI Clip", "kbot.seedClip");
  api.ui.registerContextMenuAction("Scene", "kbot: Duplicate Scene ×3", "kbot.dupScene");
  api.ui.registerContextMenuAction("AudioTrack.ArrangementSelection", "kbot: Analyze Loudness", "kbot.analyze");
  api.ui.registerContextMenuAction("DrumRack", "kbot: Randomize Params", "kbot.randomize");
  api.ui.registerContextMenuAction("Simpler", "kbot: Randomize Params", "kbot.randomize");
}
