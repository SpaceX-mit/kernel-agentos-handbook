---
name: kernel-magazine-publish
description: Publish a new issue of kernel.chat — the editorial magazine (POPEYE-inspired, EB Garamond + Courier Prime, ISSUE N · MONTH YEAR format). Use when user says "ship the next issue", "make an issue about X", "publish a drop", "kernel.chat new issue", or mentions issue, magazine, drop, spread, cover, monument, masthead, colophon.
---

# kernel-magazine-publish

## What this is

kernel.chat is an editorial magazine, not an app. Every drop is `ISSUE N · MONTH YEAR`.
The full publishing playbook is `src/content/issues/PUBLISHING.md` — that file is the
single source of truth. This skill points the agent at it and walks the most common path.

**Always read `src/content/issues/PUBLISHING.md` first.** Identity decisions, deploy steps,
and collision handling all live there. This skill is the orientation, not the manual.

## Deciding the issue's identity (§III of PUBLISHING.md)

Before touching code, answer five questions. No two recent issues should share all five.

1. **Number** — one more than `LATEST_ISSUE` in `src/content/issues/index.ts`. Check
   `git log --all --oneline --grep="ISSUE $((N+1))"` for collisions on other branches.
2. **Format (`spread.type`)** — pick from `essay` / `interview` / `forecast` / `dispatch`.
   Profile of a real person whose voice isn't on tape → `essay`, not `interview`. Add a
   new spread type only when none fit (§V).
3. **Paper stock (`coverStock`)** — `cream` / `butter` / `kraft` / `ivory` / `ink`. Cream
   is default. Ink is manifesto / archival / nocturnal.
4. **Cover layout (`coverLayout`)** — `classic` / `monument-hero` / `asymmetric-left`.
5. **Accent (Ink Cabinet, §III.4.5)** — `tomato` (default) / `brick` / `cobalt` / `pool` /
   `ivy` / `olive` / `amethyst` / `oxblood` / `coffee`. The catalog with hex values + fit
   notes is in `src/content/issues/accents.ts`. Deeper visual reference: `docs/design-language.md`.

Optional but preferred: a **signature move** — `coverOrnament` (`ink-spread`,
`warty-spots`, `flash-burn`) or `coverSeal`. One distinctive element so this cover is
recognizable at a glance.

## The mechanical steps

```bash
# 1. Create the issue file
cp src/content/issues/371.ts src/content/issues/<N>.ts   # use closest same-format issue

# 2. Edit identity, headline, contents, spread, credits per §IV

# 3. Register in src/content/issues/index.ts
#    - import { ISSUE_<N> } from './<N>'
#    - push onto ALL_ISSUES (oldest first)

# 4. Verify
npx tsc --noEmit
npm run build
npm run dev                 # preview at localhost:5173

# 5. Ship
npm run deploy              # builds + force-pushes dist/ to gh-pages
```

`npm run deploy` propagates to https://kernel.chat in ~30 seconds via Cloudflare.

## Voice rules

- EB Garamond for prose, Courier Prime for metadata
- Japanese subtitles for structural elements — real Japanese, not machine glosses; ask if
  unsure
- Em-dashes for asides, not hyphens or parentheses
- **Never name POPEYE on the site.** No "POPEYE" in user-visible copy. The grammar carries
  the homage.
- Magazine vocabulary — `issue`, `feature`, `spread`, `folio`, `kicker`, `monument`,
  `colophon`, `masthead`. Not `dashboard`, `panel`, `card`, `widget`.

## After shipping

Three small edits to keep the playbook honest (PUBLISHING.md §IX):

1. Update the `_Last updated:_` line at the bottom of `PUBLISHING.md` to match.
2. Refresh §III.2 spread-type examples if the cited example is three issues stale.
3. Update §IV "most recent same-format issue" reference.

Then update `SCRATCHPAD.md` with what shipped. If the user asked for socials, post via
`mcp__kbot__social_post` — otherwise don't.

## Commit format (§VIII)

Title: `ISSUE <N> — <TITLE>`. Body: 2–3 paragraphs explaining identity decisions and any
new types/components. Always end with `Co-Authored-By: Claude Opus 4.7 (1M context)
<noreply@anthropic.com>`.

## When in doubt

Re-read `src/content/issues/PUBLISHING.md`. It is kept current with each ship.
