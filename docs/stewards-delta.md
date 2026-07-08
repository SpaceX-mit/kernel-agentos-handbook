# The Steward's Delta

> Protocol and public ledger for the gap between what the instrument
> proposed and what the editor shipped. Companion to the curation
> audit trail (`packages/kbot/CURATION_DISCOVERY/CURATION_DECISION.csv`)
> and the refusals (`src/content/refusals.ts`) — same discipline,
> pointed at the editor's own tools.

---

## I. Why this exists

kernel.chat's economic thesis is provenance engineering: the durable
value is proof that a human steward owns the output. A stronger model
in the editor's chair makes the question "did a human actually judge
this?" *more* pointed, not less. The answer cannot be asserted; it has
to be receipted.

The receipt is the delta. Where the editor's call and the instrument's
call diverge, and the editor's call ships, that divergence — filed in
public, with a reason — is the proof a steward exists. An issue the
instrument wrote and the editor merely forwarded produces no delta and
earns no claim of stewardship. Receipts, not ratings (ISSUE 414).

## II. The two rooms

The masthead's division of labor, stated so the ledger has something
to measure against:

- **The editor's chair** — the frontier instrument (currently Claude
  Fable 5, Mythos-class). Its job is judgment: voice work, cuts,
  doctrine-keeping across the interaction language, and the quality of
  its refusals. This is the seat the human editor overrides, and the
  only seat whose overrides get filed.
- **The pressroom** — local models (Ollama, LLaDA, MLX), $0, BYOK.
  Mechanical presswork: builds, audits, conversions, summaries.
  Pressroom output is checked, not overridden; corrections there are
  QA, not stewardship, and do not get filed.

This is the same local-first contract kbot ships under. The expensive
instrument sits where judgment is; the free ones sit where labor is.

## III. The disclosure rule

The instrument is named in the colophon the way a typeface is. Two
constraints keep the disclosure honest:

1. **Datelined, never retroactive.** The colophon line reads "from
   JUL 2026" because issues before that dateline were composed under
   earlier instruments (Opus-class and prior). No per-issue instrument
   claim is made for back numbers; the roster in §VI is the record.
2. **Named, not marketed.** The line states the instrument and the
   division of rooms. No superlatives, no vendor copy.

## IV. What gets filed

A ledger entry is an **override of editorial judgment**: the
instrument proposed X with reasoning, the editor shipped not-X, and
the divergence is about judgment, not error.

Files:

- A cut the instrument argued to keep, or a keep it argued to cut.
- A shape or issue the instrument proposed and the editor refused
  (rule 7 territory), or the inverse.
- A voice rewrite — the instrument's prose replaced because it read
  as the instrument, not the publication.
- A doctrine call — the instrument read the interaction language one
  way, the editor ruled the other way.

Does not file:

- Mechanical corrections (typos, broken builds, wrong file paths).
- Permission denials and scope trims during a working session.
- Pressroom QA (see §II).
- Approvals. The ledger records divergence only; agreement is the
  default and proves nothing either way.

## V. The ledger

Lives at [`stewards-delta.ledger.csv`](./stewards-delta.ledger.csv).
One row per override:

| Column | Meaning |
|---|---|
| `date` | ISO date the override happened |
| `surface` | Issue number, doc, or component the call was about |
| `instrument` | Which model held the chair when it made its call |
| `instrument_call` | What the instrument proposed, one line |
| `editor_call` | What shipped instead, one line |
| `reason` | The editor's reasoning, one line |
| `receipt` | Commit hash, file path, or issue number that shows it |

**The ledger ships empty.** No entry is backfilled, reconstructed
from memory, or invented to make the ledger look lived-in — a fake
receipt is worse than no receipt (ISSUE 410's honesty rule runs both
directions). An empty ledger means no override has been filed since
the dateline; it fills only when the editor actually overrules the
chair.

## VI. Instrument roster

| Seated | Chair instrument | Notes |
|---|---|---|
| through JUN 2026 | Claude Opus-class (4.7 era) and prior | Pre-disclosure; no per-issue claims made |
| from JUL 2026 | Claude Fable 5 (Mythos-class) | Disclosure begins; ledger opens 2026-07-06 |

Pressroom roster (unchanged by chair changes): Ollama local models,
LLaDA, MLX — per the BYOK/local-first contract in `KERNEL.md`.

---

*Opened 2026-07-06. The first entry belongs to whoever overrules the
chair first — including on this document.*
