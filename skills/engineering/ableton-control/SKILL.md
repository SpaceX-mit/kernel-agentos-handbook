---
name: ableton-control
description: Drive Ableton Live 12 from an agent via kbot's `ableton_*` tools and the kbot-control TCP bridge. Use when the user mentions ableton, daw, midi, beat, song, drum pattern, drum rack, plugin, serum, vst, m4l, max for live, kbot-control, or asks to build/edit/load/play anything in a music session.
---

# ableton-control

## What this is

kbot drives Ableton Live 12 through a single Max for Live device
(`packages/kbot-control-standalone/kbot-control.amxd`) that speaks JSON-over-TCP. 22
`ableton_*` MCP tools route through one typed client. The legacy AbletonOSC stack is
deprecated — use the new tools.

## Pre-flight (every session)

Before the first `ableton_*` call, the user must have:

1. Ableton Live 12 open with a session loaded (or empty Live set).
2. The `kbot-control.amxd` device dropped onto any track. The device shows a "listening on
   :9999" indicator when ready.
3. The TCP bridge running: `node packages/kbot-control-standalone/kbot-control-server.js`
   (or `npm run ableton:bridge` from repo root).

If a tool errors with `ECONNREFUSED` or `bridge not running`, surface that to the user.
Don't silently retry — the M4L device or bridge is down.

## Most-used tools

| Tool | Purpose |
|---|---|
| `mcp__kbot__ableton_session_info` | Read tempo, scenes, track count. Always run first to confirm connection. |
| `mcp__kbot__ableton_create_track` | Add a MIDI or audio track |
| `mcp__kbot__ableton_load_plugin` | Load a VST/AU on a track (Serum, Diva, Roland Cloud) |
| `mcp__kbot__ableton_load_preset` | Load a preset by name on the most recent device |
| `mcp__kbot__ableton_build_drum_rack` | Assemble a drum rack from samples |
| `mcp__kbot__ableton_create_progression` | Write a chord progression as MIDI clip |
| `mcp__kbot__ableton_midi` | Write arbitrary MIDI notes into a clip |
| `mcp__kbot__ableton_clip` | Fire / stop / loop a specific clip |
| `mcp__kbot__ableton_transport` | Play / stop / record at the song level |
| `mcp__kbot__ableton_mixer` | Volume, pan, sends |

## Concrete commands

Build a 4-bar trap drum loop at 140 BPM:

```
ableton_session_info                    # confirm connection
ableton_create_track type=midi name=drums
ableton_build_drum_rack track=drums style=trap
ableton_midi track=drums clip=0 pattern=trap-1 bars=4
ableton_clip track=drums clip=0 action=fire
```

Load Serum on a new lead track and play a Cmaj7 progression:

```
ableton_create_track type=midi name=lead
ableton_load_plugin track=lead plugin="Serum 2"
ableton_load_preset track=lead preset="LD - Soft Stack"
ableton_create_progression track=lead key=C quality=maj7 bars=8
ableton_clip track=lead clip=0 action=fire
```

## Plugin loading caveat (Live 12.4)

Live 12.4's LOM browser API refuses some preset loads with `api_removed`. The
producer-engine in kbot falls back to computer-use (screenshot → type plugin name → Return)
when this happens. If a preset load fails, surface the failure — don't silently fall
through unless the user has opted in to computer-use.

## Standalone client

The TCP client is also published as `@kernel.chat/kbot-control` (MIT) for non-kbot use.
Spec at `packages/kbot-control-standalone/PROTOCOL.md`. 37 LOM methods covered.
