# kbot Styled Rhythm Generator

An Ableton Live Extension that generates styled drum patterns into a MIDI clip —
a native-TS re-build of Side Brain's [Styled Rhythm Generator](https://sidebrain.net/live-extensions/styled-rhythm-generator/)
([overview video](https://www.youtube.com/watch?v=ivNbQIILE2o)).

Two context-menu commands on any MIDI clip:

- **kbot: Generate Rhythm** — the styled mixer panel (algorithmic).
- **kbot: Pattern Drop (AI)** — describe a groove in words; a local Ollama model
  writes the grid. Falls back to the built-in generator if no model answers.

The pattern is written to the clip as one undo step.

## Features

- **13 styles** — Hip Hop, Trap, Afrobeats, House, Techno, Drum & Bass,
  Reggaeton, Funk, Disco, Pop, Rock, UK Garage, Breakbeat.
- **Mixer-style density** — a slider per drum element (8 elements). Center =
  the groove as written; 0 = muted; right = busier.
- **Per-element controls** (`L` `S` `P` on each element row):
  - **Lock** — hold a voice through Re-shuffle while every other voice re-rolls.
  - **No-swing** — exclude that voice from swing (keep it dead-straight).
  - **No-pocket** — exclude that voice from the pocket push/lay-back.
- **Live preview grid** — every element row shows a 16-step firing grid that
  mirrors the host generator step-for-step. **Re-shuffle** re-rolls in place and
  redraws live (locked rows visibly hold); **Generate** writes to the clip.
- **Feel controls** — Swing (delays off-beat 16ths), Pocket (push/lay-back),
  Humanize (velocity + micro-timing spread, plus Live's own `velocityDeviation`).
- **Fills** — 1 Beat, ½ Bar, or Full Bar snare/tom roll on the last bar.
- **Deterministic** — the same seed + config reproduces a pattern exactly
  (per-element mulberry32 RNG; locking freezes one voice's seed).
- **Real kit mapping** — reads the track's Drum Rack and targets each pad by
  name (then by GM note); falls back to General MIDI when no rack is present.
  Elements with no matching pad are flagged with `*` in the panel.

## Pattern Drop (AI) — local models

`src/ai.ts` builds a strict-JSON prompt and posts it to a local Ollama
(`http://localhost:11434`), forcing `format: "json"`. The default model is
chosen by an eval, not a guess.

```bash
npm run eval                 # score the installed models on the real prompt
npm run eval qwen3:8b phi4:14b   # only these models
```

The harness (`eval/run.ts`) runs the extension's actual `buildMessages` prompt
across local models, parses each response with the extension's own
`parsePattern`, and scores **JSON validity · exactly-16-step rows · hat presence
· backbeat/four-on-the-floor placement · latency**. Results land in
`eval/results.json`; the winner becomes `DEFAULT_MODEL` in `src/ai.ts` and tops
the panel's model dropdown.

## Develop / run / test

```bash
npm install
npm run build     # tsc type-check + esbuild bundle (inlines interface.html)
npm test          # vitest — pins the groove math (36 tests)
npm run start     # load into Ableton Live 12 (uses EXTENSION_HOST_PATH in .env)
npm run package   # produce a distributable .ablx
```

`.env` must point `EXTENSION_HOST_PATH` at your Live install's
`ExtensionHost/ExtensionHostNodeModule.node`.

## Architecture

| File | Role |
|---|---|
| `src/grooves.ts` | Genre model: 13 styles × 8 elements × 16-step prob/velocity + feel defaults. **Tune patterns here.** |
| `src/generate.ts` | Pure `generate(config, noteMap) → NoteDescription[]` — density, swing, pocket, humanize, fills, per-element lock seeds, deterministic RNG. |
| `src/ai.ts` | Pattern Drop: prompt builder, model-output sanitizer (`parsePattern`), grid→notes. Host-agnostic so it stays testable. |
| `src/interface.html` | Mixer panel with per-element lock/exclude toggles + live firing-grid preview. Posts a config JSON back to the extension. |
| `src/interface-ai.html` | Pattern Drop panel — prompt + model picker. |
| `src/extension.ts` | Both context-menu commands; resolves the Drum Rack mapping, shows the panel, writes notes in a transaction. |
| `eval/run.ts` | Local-model eval harness for Pattern Drop. |
| `*.test.ts` | Vitest suites for the pure generators. |

## Parity with the original (and SDK limits)

Closed: all 13 styles, mixer density, fills, custom bar length, swing, pocket,
**per-element swing/pocket exclude**, **re-shuffle with per-element lock**.

Blocked by the Extensions SDK beta (no API exists yet):

- **Built-in Drum-Rack kit loader** — the SDK exposes no preset/browser-load
  call (`insertDevice` only inserts an empty chain). We read & map an existing
  rack instead.
- **Persistent (modeless) panel** — the SDK offers only `showModalDialog`, so
  Re-shuffle previews *visually* in the panel rather than auditioning into the
  clip live. Generate commits the result.
- **Auto-BPM** — intentionally omitted: a step generator is beat-relative, so
  tempo doesn't affect the grid.

## Notes / follow-ups

- Generation **replaces** the clip's notes (not merge).
- Playback length is governed by the clip's own loop length; `Bars` only sets
  how many bars of pattern are written.
- The preview grid shows the **base groove** (one bar, no fill); the fill is
  applied at Generate.
