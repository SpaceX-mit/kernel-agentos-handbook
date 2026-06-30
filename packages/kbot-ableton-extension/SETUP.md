# kbot · Ableton Extensions SDK — Setup

Environment prep for building kbot Extensions that run *inside* Live 12.4.5+ Suite.
Source: <https://www.ableton.com/en/live/extensions> · docs: <https://ableton.github.io/extensions-sdk/>

Run the verifier any time to see what's left:

```bash
bash packages/kbot-ableton-extension/verify-env.sh
```

## Status (last checked 2026-06-06)

| # | Requirement | Status | Owner |
|---|---|---|---|
| 1 | Node.js v24.16.0 (LTS) | DONE — installed via nvm | me |
| 2 | Live 12 Suite **Beta ≥ 12.4.5** | BLOCKED — on `12.4b16` (Apr 20), predates Extensions | **Isaac** |
| 3 | Extensions **SDK tarball** | BLOCKED — not on disk; not on public npm | **Isaac** |
| 4 | Live session bridge (OSC) | LIVE — kept for transport/real-time (separate path) | — |

## The two steps that need your Ableton account

Extensions are **Suite-only** and **beta-only**; the SDK is distributed through the beta
portal (Centercode), not public npm (`npm view @ableton-extensions/sdk` → 404).

1. **Update the beta** → <https://www.ableton.com/en/beta/> → download Live **12.4.5+**.
   Installs as `Ableton Live 12 Beta.app`. Confirm Suite in Help > About.
2. **Download the Extensions SDK** from the same beta portal (a `.tgz`). Drop it in
   `~/Downloads/` (or set `SDK_DIR=/path/to/dir` before running the verifier).

Then:

```bash
nvm use 24.16.0
bash packages/kbot-ableton-extension/verify-env.sh   # expect RESULT: ready to build
```

## After "ready to build"

Scaffold against the real SDK (gives us the actual `.d.ts` types):

```bash
cd packages/kbot-ableton-extension
npx "<path-to>/ableton-create-extension-<version>.tgz" .   # scaffolds manifest.json + src/
npm start          # esbuild → loads into Live via extensions-cli run
npm run package    # produces the distributable .ablx
```

Install the built `.ablx` in Live: **Settings → Extensions**. Invoke via **right-click**
on the target (MIDI clip, track, scene, …).

## Notes

- nvm default is left at the system version; run `nvm use 24.16.0` before working here so
  we don't change Node globally for other projects.
- Extensions are **run-once** (right-click → do work → exit). They cannot subscribe to
  events or hold live state — transport/clip-firing/real-time stays on the OSC bridge.
  See the technical brief for the full API surface and the native-vs-OSC split.
