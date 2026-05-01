---
name: produce-beat
description: Produce a beat in Ableton Live via kbot. Use when user says "make me a beat", "produce a [genre] beat", "build a track at [bpm]", or mentions trap, hip-hop, soul, drill, lo-fi, house, drum, 808, bpm, produce, kick pattern, hi-hat roll. Pipeline goes idea → progression → drum rack → MIDI → fire.
---

# produce-beat

## What this is

The end-to-end "produce me a [genre] beat at [bpm]" workflow. Composes kbot's music tools
with the `ableton_*` bridge into a single pipeline. The user gets a playable session, not a
plan.

## Pre-flight

Same as the `ableton-control` skill — Ableton Live 12 open, `kbot-control.amxd` loaded on a
track, TCP bridge running. If any of those are missing, surface that first.

## The pipeline

For a typical request like "make me a 90s soul beat at 88 BPM in C minor":

1. **`mcp__kbot__music_idea`** — generate the conceptual brief (drum feel, instrumentation,
   key/tempo confirm, reference tracks). Pass `genre`, `bpm`, `key`. Output is a dict the
   next steps consume.
2. **`mcp__kbot__ableton_transport`** with `bpm=88` — set the session tempo before any
   clips are written.
3. **`mcp__kbot__ableton_create_progression`** on a new MIDI track — write the harmonic
   bed (`key=Cm`, `quality=min7`, `bars=8`).
4. **`mcp__kbot__ableton_build_drum_rack`** on a second MIDI track — load samples that
   match the genre. The tool picks from the user's library
   (`reference_ableton_library_inventory.md` documents 9000+ presets, 7300+ samples).
5. **`mcp__kbot__generate_drum_pattern`** — produce a MIDI pattern the genre expects (trap
   hi-hat rolls, soul break, drill skips).
6. **`mcp__kbot__ableton_midi`** — write that pattern into clip slot 0 of the drum track.
7. **`mcp__kbot__ableton_clip`** action=`fire` on both tracks — start playback.

The user hears the beat at this point. Subsequent edits (swap snares, raise the hat density,
add a bass) are individual `ableton_*` calls.

## Concrete invocation

```
music_idea genre=soul bpm=88 key=Cm
ableton_transport action=set_tempo bpm=88
ableton_create_track type=midi name=keys
ableton_create_progression track=keys key=Cm quality=min7 bars=8
ableton_create_track type=midi name=drums
ableton_build_drum_rack track=drums style=soul-vintage
generate_drum_pattern style=soul bars=4
ableton_midi track=drums clip=0 pattern=<from above>
ableton_clip track=keys clip=0 action=fire
ableton_clip track=drums clip=0 action=fire
```

## Genre presets that work

The following styles have tested templates in `packages/kbot/src/knowledge/`:

- **trap** (140–170 BPM) — 808 bass + sparse kick + dense hi-hat rolls
- **hip-hop boom-bap** (85–95 BPM) — sampled drums, swung hat, deep kick
- **soul-vintage** (75–95 BPM) — Mark1 Stage piano, breakbeat drums, FX chain on drums
- **drill** (140–150 BPM, half-time feel) — sliding 808s, skip hat patterns
- **lo-fi** (75–90 BPM) — vinyl noise, jazz chords, soft kit
- **house** (118–128 BPM) — four-on-the-floor, off-beat hat, plucky bass

## Output expectation

A playing Ableton session, not a description. If a tool fails (preset not found, sample
missing), surface the failure with the exact tool error. The user fixes it (add the
preset / install Splice pack) and re-runs the failing step.
