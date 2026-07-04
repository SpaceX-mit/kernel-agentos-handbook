# The System Architecture

> How the kernel.chat identity is *enforced by construction* — the
> machinery that makes the magazine's discipline structural rather
> than aspirational. Companion to `docs/design-language.md` (the
> visual grammar), `docs/interaction-language.md` (the reader's
> hand), and `src/content/issues/PUBLISHING.md` (the workflow).
> ISSUE 393 (OWN THE STACK) is the argument; this file is the map.

---

## The one-sentence architecture

**An issue is a typed object in version control; everything else —
color, layout, validation, deployment, provenance — derives from it
or refuses it.**

```
src/content/issues/<N>.ts        one frozen snapshot per issue
        │  (typed by)
src/content/issues/index.ts      the discriminated union + archive
        │  (rendered by)
src/components/IssueFeature.tsx  router → one *Feature.tsx per tool
        │  (styled by)
src/content/issues/accents.ts    one seed → five derived tones
src/styles/editorial.css         tokens, stocks, pop-* utilities
        │  (published by)
.github/workflows/deploy.yml     main is the only publisher
```

## The five enforcement layers

### 1. The schema is the copy editor

Every issue is an `IssueRecord`; every spread is a member of the
`IssueSpread` **discriminated union** (7 editorial tools: essay,
interview, forecast, dispatch, review, colloquy, instrument). The
compiler refuses a malformed issue — a missing stock, an unnumbered
catalog item, a spread that forgot its signoff. House style holds
at 3 a.m. because `tsc` does not go home.

Adding a tool is a *union extension* (PUBLISHING.md §V), and the
router's exhaustiveness check flags every unhandled case. Form
follows material: a new tool ships only when a story refuses all
seven existing forms — and the union is where that decision
becomes permanent.

### 2. The design derives; it is not maintained

One `accent` seed per issue (the Ink Cabinet, 9 named inks) becomes
five tones via `oklch(from ...)` derivation; each of six paper
stocks sets a lift so the same ink reads correctly on ivory, kraft,
ledger, ink, butter, and cream — in light, dark, and high-contrast
modes. `isPopeyeSafe()` **refuses** neon, zero-chroma, and pure
digital primaries before a human has to argue taste.

One decision touches every surface; the validator has the taste so
the editor doesn't re-supply it each issue. (The withdrawn second
spot color of ISSUE 371 is the cautionary tale: the second register
is expressed by *switching* the accent, never adding one.)

### 3. The archive is the substrate

`ALL_ISSUES` is append-only; `LATEST_ISSUE` is derived, never set.
Every issue is frozen at its permanent URL (`/issues/:number`),
reproducible from source at any commit. The catalog *is* git:
review, diff, rollback, and attribution come free, and no hosted
CMS owns the spine. Collisions between parallel drafts are resolved
by renumbering, not by fighting (PUBLISHING.md §VII) — numbers are
cheap; the cadence is the product.

### 4. Main is the only publisher

Pushing `main` triggers CI: type-check → build with production
secrets → publish `dist/` to `gh-pages`, **stamped with the source
commit**. Verification is by provenance (the deploy names its SHA),
never by asset hash — different environments legitimately produce
different fingerprints from the same source. The manual deploy
script was retired (ISSUE 399's prescription): two uncoordinated
writers on one target means last-write-wins, so there is exactly
one writer.

### 5. The audit is bolted to the build

Provenance is a *field* (`IssueAudit` — drafted / verified /
adherence / read-cut / pressed), rendered as the colophon monument.
Only true rows render; fabricating one violates the type's contract
in comment and in culture. Evidence-cited commits (ISSUE format,
identity decisions in the header comment of every issue file) make
the git log the magazine's methods section.

## The editorial staff is version-controlled

The agents, skills, and rules that produce issues live in the
repository and the skill tree (`.claude/`, `~/.claude/skills/
kernel-chat-design/`): the design-language skill, the publishing
playbook, the per-agent memory files. Last month's ruling is this
month's starting condition — the staff that can be diffed does not
re-litigate itself.

## What is deliberately NOT in the architecture

- **No CMS, no database** for editorial content — rows you rent
  depreciate; typed files compound.
- **No client-side analytics on readers** — the discipline is
  "count what gets read" editorially, not surveil who reads it.
- **No JS animation frameworks on editorial surfaces** — motion is
  weather (interaction-language.md, rule 3).
- **No second live spot color, no emoji, no sans-serif** — refused
  by the grammar, and where possible by validators.
- **No paywall machinery** — removed 2026-04-16; the reader's own
  key is the only toll.

---

*Filed VII·26, the same press day as ISSUES 400–404 and the
interaction language. Amend the way everything here is amended:
argue it in an issue, encode it in a type or a validator, cite the
issue in the commit.*
