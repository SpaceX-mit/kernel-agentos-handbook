import {
  initialize,
  Clip,
  MidiClip,
  type ActivationContext,
  type Handle,
  type NoteDescription,
} from "@ableton-extensions/sdk";

const COMMAND_ID = "kbot.scaleQuantize.run";

export function activate(activation: ActivationContext) {
  const api = initialize(activation, "1.0.0");

  api.commands.registerCommand(COMMAND_ID, (arg: unknown) => {
    const clip = api.getObjectFromHandle(arg as Handle, Clip);
    if (!(clip instanceof MidiClip)) {
      console.error("[kbot scale-quantize] Not a MIDI clip — nothing to do.");
      return;
    }

    const song = api.application.song;
    const root = song.rootNote; // 0..11 (C..B)
    const intervals = song.scaleIntervals; // semitone offsets from the root
    if (intervals.length === 0) {
      console.error("[kbot scale-quantize] No scale intervals reported by Live.");
      return;
    }

    // Pitch classes (0..11) that belong to the current scale.
    const allowed = new Set(intervals.map((i) => mod12(root + i)));

    const notes = clip.notes;
    let moved = 0;
    const quantized: NoteDescription[] = notes.map((n) => {
      const pitch = snapToScale(n.pitch, allowed);
      if (pitch !== n.pitch) moved += 1;
      return { ...n, pitch };
    });

    // One user-facing undo step. The callback is synchronous (a plain assignment).
    api.withinTransaction(() => {
      clip.notes = quantized;
    });

    console.log(
      `[kbot scale-quantize] ${song.scaleName} (root ${root}): ` +
        `snapped ${moved}/${notes.length} note(s) to scale.`,
    );
  });

  api.ui.registerContextMenuAction(
    "MidiClip",
    "kbot: Quantize to Scale",
    COMMAND_ID,
  );
}

function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

/**
 * Snap a MIDI pitch (0..127) to the nearest pitch whose pitch-class is in the
 * scale. Searches outward from the original pitch; ties resolve downward.
 */
function snapToScale(pitch: number, allowed: Set<number>): number {
  if (allowed.has(mod12(pitch))) return pitch;
  for (let d = 1; d <= 6; d += 1) {
    if (pitch - d >= 0 && allowed.has(mod12(pitch - d))) return pitch - d;
    if (pitch + d <= 127 && allowed.has(mod12(pitch + d))) return pitch + d;
  }
  return pitch;
}
