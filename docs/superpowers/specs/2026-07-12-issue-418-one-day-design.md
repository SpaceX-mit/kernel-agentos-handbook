# ISSUE 418 — ONE DAY · 街の一日 — design spec

Date: 2026-07-12 · Status: approved in session (brainstormed with Isaac)
Slot: ships AFTER 417 (PROOF OF HAND). Built now; 417 will be inserted
before it in ALL_ISSUES when it lands.

## Thesis

The behavioral science of metropolitan life in 2026: a city day is now
threaded with delegation moments — small decisions an agent takes on
your behalf — and the load-bearing human behavior is no longer doing
the errand but deciding *whether to look*. The literature named this
long before the agents arrived: automation bias, misuse/disuse, trust
calibration (Bainbridge 1983; Parasuraman & Riley 1997; Skitka, Mosier
& Burdick 1999; Lee & See 2004). The issue's finding is the reader's
own: their defer/verify split across one authored metropolitan day.

## The shape — `day` (eighth interaction shape)

A time-stamped sequence of **nine delegation moments**, 06:10 → 00:40,
each an ambient city vignette (CSS-only weather motion) carrying one
calibrated two-state control: **LET IT RIDE / STEP IN**. Per rule 4,
BOTH authored consequences are printed and stay legible at all times;
the reader's mark selects which one is *theirs*, it never hides the
other. A ledger at midnight meters only real reader actions: deferred
count, stepped-in count, undecided count, changes of mind, and the
session clock (the 415 precedent). Marks are session-state only —
nothing recorded, nothing sent; `ledgerNote` (mandatory equipment,
rule 6) says so on the surface.

Checklist compliance (interaction-language.md):
1. Hand required? Yes — the argument IS the reader's own split; without
   marks the ledger has nothing true to meter. Untouched page still
   reads complete (all consequences printed; ledger reads 0/0/9).
2. ARIA pattern: one radiogroup per moment, two radio buttons. Named in
   the component header.
3. All states in DOM; `@media print` stacks; ledger prints a snapshot.
4. Motion: CSS-only ambient (≤4px translate / ≤8% opacity) — steam,
   train dash, crosswalk pulse, window glow. `prefers-reduced-motion`
   respected via the site-wide override.
5. Honesty: moment copy and attention costs are AUTHORED REPRESENTATIVE
   composites, disclosed in the dossier; the only measured numbers on
   the page are the reader's marks and the clock.
6. Rule 7: `day` is instance one — no machinery extracted; reuses only
   data types (SpreadDossier, SpreadReferences, SpreadSection).

## Data model

`DayMoment { id, time, label, labelJp?, vignette, situation, ride,
stepIn, cost }` — `vignette ∈ kettle|train|crosswalk|desk|market|window`.
`DaySpread extends SpreadCommon { type:'day', dossier?, intro?,
dayKicker?, moments, ledgerNote, references?, outro?, pullQuote? }`.

## Identity

- coverStock `butter` (daylight/leisure register — the lifestyle canvas)
- coverLayout `classic`; accent `cobalt` (transit-map civic blue,
  declared; differentiates from 416's tomato/ivory/asymmetric-left)
- coverSeal `READER AS SUBJECT · VII·26`; no postmark (composite city,
  not a specific place)
- feature ONE DAY · 街の一日

## Files

- `src/content/issues/index.ts` — DayMoment/DaySpread + union member
- `src/content/issues/418.ts` — content (registered in ALL_ISSUES;
  417 inserts before it when built)
- `src/components/DayFeature.tsx/.css` — component + weather CSS
- `src/components/DayFeature.test.tsx` — law test: both consequences
  stay legible after marking; ledger counts only marks; changes counted
- `src/components/IssueFeature.tsx` — router case
- `docs/interaction-language.md` — eighth-shape entry, same commit
  (the amendment rule)
