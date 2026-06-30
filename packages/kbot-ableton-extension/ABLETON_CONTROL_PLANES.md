# Controlling Ableton Live from kbot — the three control planes

> **Why this doc exists.** Figuring out *how* to drive Live programmatically is
> itself part of this project. We learned — partly the hard way, live — that
> "control Ableton" isn't one capability but **three different planes**, each
> good at something the others can't do. Picking the wrong plane for a job is
> what cost us a session of false "success" messages. This is the map.

_Last verified: 2026-06-23, Live 12.4.5 Beta, on Isaac's Mac._

---

## TL;DR — the three planes

| Plane | What it is | Best at | Cannot do | Agent-driveable? |
|---|---|---|---|---|
| **Extensions SDK** | TS/JS that runs *inside* Live, triggered from a right-click menu | **Authoring** — write `clip.notes` natively, build racks, create tracks/clips, one undo step | transport, audio audition, persistent UI, 3rd-party plugins, **headless invocation** | ❌ a human must right-click |
| **AbletonOSC / Control Surface** | A Remote Script speaking UDP (11000/11001) | **Live control** — transport, fire clips, params, *listening* to state, real-time, **agent-driveable** | needs the Remote Script installed & complete; not for heavy DSP | ✅ fully |
| **Max for Live** | Devices in the chain (Max/MSP) | **Real-time DSP** — synths, effects, sample-accurate timing, persistent, background analysis | structural/data editing is awkward | ✅ (within a device) |

**Rule of thumb:**
- Need to **write notes / transform the Set** → **Extensions SDK** (reliable, native, one undo).
- Need to **play it, fire clips, control transport, or have an agent do it autonomously** → **AbletonOSC**.
- Need **sound generation or real-time processing** → **Max for Live**.

The "seamless agent lays down a beat and presses play" dream needs **two** planes:
SDK (or OSC) to author + OSC to fire/play. Neither does it alone.

---

## Plane 1 — Extensions SDK (authoring)

Mined directly from the type defs
(`@ableton-extensions/sdk/dist/index.d.mts`) and the SDK docs.

**Can:**
- **Notes:** `MidiClip.notes` get/set (whole array — read-modify-write to add).
  `NoteDescription = { pitch, startTime, duration, velocity?, probability?,
  velocityDeviation?, releaseVelocity?, muted?, selected? }` — everything needed
  for humanized, probabilistic, micro-timed drums.
- **Create:** `ClipSlot.createMidiClip(length)`, `MidiTrack.createMidiClip(start,dur)`,
  `Song.createMidiTrack()/createAudioTrack()/createScene()`.
- **Drum racks:** `Track.insertDevice("Drum Rack", idx)` → `RackDevice.insertChain()`
  → `DrumChain.receivingNote`. **Native Live devices only** — no 3rd-party VST/AU.
- **Samples:** `Simpler.replaceSample(filePath)` (by filesystem path).
- **Tempo/scale:** `Song.tempo` get/set, `rootNote`/`scaleName`/`scaleIntervals`, `gridQuantization`.
- **One undo step:** `withinTransaction(cb)` (callback must be synchronous).
- **UI:** `Ui.showModalDialog(url,w,h)` (WebView), `withinProgressDialog(...)`.
- **Render:** `Resources.renderPreFxAudio(track,start,end)` → WAV (offline only).

**Cannot (from the docs' own "What Extensions Aren't Designed For"):**
- No transport — can't play/stop, **fire clips/scenes**, read `is_playing`, move
  playhead, record. (`Scene` has no `.fire()`.)
- **No audio audition/preview** — render-to-WAV then analyze the file is the only
  way to "hear" output; the agent can't listen through the SDK.
- No real-time audio/MIDI processing (that's M4L).
- **No persistent/docked panel** — modal + progress dialogs only.
- No browser/library/preset loading; no 3rd-party plugins.
- **No background/headless/persistent run, no timers, no events, no external
  invocation.** Strictly **user-triggered, run-once per command.**

**Net:** the SDK is the *reliable authoring tool* — but a human triggers it, and
you can't hear the result from inside it.

---

## Plane 2 — AbletonOSC (live control) + the bug we hit

`mcp__kbot__ableton_*` tools speak to the **AbletonOSC** Remote Script over UDP.

**Verified working (2026-06-23):** song/track layer — `session_info`,
`create_track` (made "kbot Drums" + loaded the 808 Core Kit), tempo, transport
play/stop, track queries. These returned **real** data.

**Verified BROKEN (same session):** the **clip layer** —
`/live/clip_slot/create_clip`, `/live/clip/add/notes`, `/live/clip/get/name` all
**timed out** (3000ms, no reply). `ableton_clip create` returned an *optimistic*
"success" string but **nothing persisted**; a later `ableton_clip list` showed
"No clips found" and `/live/clip/get/name` timed out.

**Diagnosis:** the OSC addresses in `kbot/src/tools/ableton.ts` are correct
(`/live/clip_slot/create_clip` (t,c,length), `/live/clip/add/notes`). Song-level
responds, clip-level doesn't → **AbletonOSC install/version mismatch** (the
installed Remote Script's clip handlers aren't responding), not a kbot bug.

**Lesson burned in:** the kbot Ableton tools report success *without verifying*.
Treat a write as done only after a read-back confirms it (`list`/`info`/`read`).
**Fix path:** update/reinstall AbletonOSC
(https://github.com/ideoforms/AbletonOSC) so clip commands respond; then the
autonomous OSC authoring path comes alive.

---

## Plane 3 — Max for Live (real-time)
Devices in the chain: synths, effects, sample-accurate timing, persistent,
background audio/MIDI analysis. The right plane for *making sound* and anything
real-time. Not for structural/data edits — that's the SDK's job. Extensions and
M4L are explicitly designed to **complement** each other ("M4L gives you devices,
Extensions gives you scripts").

---

## What this means for the styled-rhythm-generator + `lay_down_groove`

- The **engine** (`src/generate.ts`) is plane-agnostic pure TS — it emits
  `NoteDescription[]`. It already feeds the SDK extension; it can feed OSC too
  (`tools/groove.ts` emits `{pitch,start,duration,velocity}` for `ableton_midi`).
- **Reliable today:** lay a beat via the **SDK extension** (human right-clicks).
- **Autonomous `lay_down_groove(style,bars,feel,track)` kbot tool:** only possible
  on the **OSC plane** (SDK forbids agent invocation) → **blocked until
  AbletonOSC's clip layer is fixed.** Once fixed, the tool: `create_track` (kit) →
  `groove.ts` generates → `add/notes` → `fire` → `play`.
- **Auditioning:** neither plane lets the *agent* hear audio. SDK = render-to-WAV
  + analyze; OSC = fire + play (human hears). True closed-loop "agent hears its
  own beat" needs render-to-WAV → local audio analysis.

---

## How we figured this out (method, for the next person)
1. **Type-def mining** — grepped `index.d.mts` for every API surface; absence of a
   method (no `fire`, no `play`, no `on(`) is itself evidence of a hard limit.
2. **Live testing** — ran real OSC calls and **read them back**; the read-back is
   what exposed the optimistic-success lie (clip "created" → "No clips found").
3. **Docs** — the SDK's own "What Extensions Aren't Designed For" list is the
   authoritative limit statement.
4. **Web** — roadmap (community-shaped, no committed transport/persistence dates)
   and community proof that generative tools are a viable lane (Vivarium, Photo MIDI).

## Sources
- SDK type defs: `@ableton-extensions/sdk/dist/index.d.mts`; docs:
  `~/Developer/extensions-sdk-1.0.0-beta.0/docs/`
- https://www.ableton.com/en/live/extensions/ · https://ableton.github.io/extensions-sdk/
- https://help.ableton.com/hc/en-us/articles/27303428331420-Ableton-Extensions-FAQ
- https://cdm.link/ableton-extensions-beta/ · https://github.com/federico-pepe/ableton-live-extensions
- AbletonOSC: https://github.com/ideoforms/AbletonOSC
