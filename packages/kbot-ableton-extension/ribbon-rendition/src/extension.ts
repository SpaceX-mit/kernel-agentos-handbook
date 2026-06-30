import {
  initialize,
  MidiTrack,
  Device,
  DeviceParameter,
  type ActivationContext,
} from "@ableton-extensions/sdk";

import {
  TEMPO,
  LOOP_BEATS,
  rhodesNotes,
  padNotes,
  bassNotes,
  melodyNotes,
  drumNotes,
  type Note,
} from "./music.js";

const COMMAND_ID = "kbot.ribbon.build";

// Built-in Live device names. insertDevice loads each with its DEFAULT preset —
// which is exactly the real Electric Rhodes / Drift pad / etc. (not a sampled
// toy). Any name Live doesn't recognise is logged and skipped, so the rest of
// the build still completes.
const RHODES_CHAIN = ["Electric", "EQ Eight", "Chorus-Ensemble", "Saturator", "Hybrid Reverb"];
const PAD_CHAIN = ["Drift", "Reverb"];
const BASS_CHAIN = ["Operator"];
const DRUM_CHAIN = ["Drum Rack"];

export function activate(activation: ActivationContext) {
  const api = initialize(activation, "1.0.0");

  /** Create a MIDI track, name it, and load a device chain (default presets). */
  async function makeTrack(
    song: typeof api.application.song,
    name: string,
    deviceNames: string[],
  ): Promise<{ track: MidiTrack<"1.0.0">; devices: Device<"1.0.0">[] }> {
    const track = await song.createMidiTrack();
    try {
      track.name = name;
    } catch {
      /* name is best-effort */
    }
    const devices: Device<"1.0.0">[] = [];
    for (let i = 0; i < deviceNames.length; i += 1) {
      const dn = deviceNames[i]!;
      try {
        const d = await track.insertDevice(dn, i);
        devices.push(d);
      } catch (e) {
        console.warn(`[ribbon] could not load device "${dn}" on ${name}:`, e);
      }
    }
    return { track, devices };
  }

  api.commands.registerCommand(COMMAND_ID, async () => {
    const song = api.application.song;
    console.log(`[ribbon] building "Ribbon in the Sky"-style rendition @ ${TEMPO} BPM…`);

    // Tempo (groove/swing is baked into the note timings, since the Groove Pool
    // isn't part of the SDK surface).
    try {
      song.tempo = TEMPO;
    } catch (e) {
      console.warn("[ribbon] could not set tempo:", e);
    }

    const built: string[] = [];

    // 1. Rhodes — the centre. Real Electric + the velvet chain.
    {
      const { track, devices } = await makeTrack(song, "Rhodes (Electric)", RHODES_CHAIN);
      await tweak(devices, "Saturator", "Drive", 0.12); // very light
      await tweak(devices, "Hybrid Reverb", "Dry/Wet", 0.24); // intimate, not washed
      await tweak(devices, "Hybrid Reverb", "Mix", 0.24); // name varies by version
      await writeClip(track, rhodesNotes(), "Ribbon Chords");
      built.push(`Rhodes  → ${devices.map((d) => d.name).join(" › ")}`);
    }

    // 2. Pad — the floating cloud, low in the mix (soft velocities).
    {
      const { track, devices } = await makeTrack(song, "Pad (Drift)", PAD_CHAIN);
      await tweak(devices, "Drift", "Attack", 0.55); // slow swell
      await tweak(devices, "Drift", "Filter Freq", 0.42); // roll the top off
      await tweak(devices, "Drift", "Frequency", 0.42);
      await writeClip(track, padNotes(), "Ribbon Pad");
      built.push(`Pad     → ${devices.map((d) => d.name).join(" › ")}`);
    }

    // 3. Bass — singing, round, moving with the harmony.
    {
      const { track, devices } = await makeTrack(song, "Bass", BASS_CHAIN);
      await writeClip(track, bassNotes(), "Ribbon Bass");
      built.push(`Bass    → ${devices.map((d) => d.name).join(" › ")}`);
    }

    // 4. Lead — the yearning vocal line (also Electric so it sings warmly).
    {
      const { track, devices } = await makeTrack(song, "Lead (vocal line)", ["Electric", "Reverb"]);
      await writeClip(track, melodyNotes(), "Ribbon Melody");
      built.push(`Lead    → ${devices.map((d) => d.name).join(" › ")}`);
    }

    // 5. Drums — understated, swung, quiet. NOTE: a fresh Drum Rack is EMPTY;
    // the SDK can't load a kit preset, so the MIDI is written and ready but you
    // must drag a soft/brushed kit onto this track to hear it.
    {
      const { track, devices } = await makeTrack(song, "Drums (drop a soft kit)", DRUM_CHAIN);
      await writeClip(track, drumNotes(), "Ribbon Drums");
      built.push(`Drums   → ${devices.map((d) => d.name).join(" › ")} (empty — drag a kit on)`);
    }

    console.log("[ribbon] done:\n  " + built.join("\n  "));
    console.log(
      "[ribbon] Press the clip-row launch (or a scene) to play. Drums need a kit dragged onto the last track.",
    );
  });

  // Reachable from a right-click on a Scene or an empty clip slot.
  api.ui.registerContextMenuAction("Scene", "kbot: Build Ribbon Rendition", COMMAND_ID);
  api.ui.registerContextMenuAction("ClipSlot", "kbot: Build Ribbon Rendition", COMMAND_ID);
}

/** Create a looping session clip in slot 0 and write notes into it. */
async function writeClip(track: MidiTrack<"1.0.0">, notes: Note[], _label: string): Promise<void> {
  const slot = track.clipSlots[0];
  if (!slot) {
    console.warn(`[ribbon] ${track.name}: no clip slot to write into`);
    return;
  }
  const clip = await slot.createMidiClip(LOOP_BEATS);
  try {
    clip.looping = true;
  } catch {
    /* looping default is fine */
  }
  clip.notes = notes;
}

/** Best-effort parameter set: find a param whose name contains `match`, set it
 *  to `frac` (0..1) of its range. Silent if the param doesn't exist. */
async function tweak(devices: Device<"1.0.0">[], deviceName: string, match: string, frac: number): Promise<void> {
  const device = devices.find((d) => d.name.toLowerCase().includes(deviceName.toLowerCase()));
  if (!device) return;
  try {
    const p = device.parameters.find((pp: DeviceParameter<"1.0.0">) => pp.name.toLowerCase().includes(match.toLowerCase()));
    if (!p) return;
    await p.setValue(p.min + frac * (p.max - p.min));
  } catch {
    /* parameter tuning is non-essential — the default preset already sounds right */
  }
}
