/* ──────────────────────────────────────────────────────────────
   ISSUE 417 — JUL 2026
   PROOF OF HAND
   手による校正

   Figma in 2026, one angle: the blank canvas is never blank.
   Make / First Draft fills the screen before the designer touches
   it. The designer's remaining act is not drawing — it is judgment
   over a completed machine draft. This issue is about that act,
   and it makes the reader perform it.

   THE SHAPE (eighth): `proof` — adjudication. The machine has
   drafted the one screen that embodies the thesis (a design tool's
   own "blank canvas" welcome screen, six slots); per line, the
   reader assigns one of three fates — KEEP MACHINE / TAKE THE
   HAND / STRIKE — and the decisions compose live into a resolved
   screen plus a provenance ledger. Completes the print-shop line:
   galley (410, raw type) → proof (417, the correction pass) →
   press (413, the composing). Note: the design spec (2026-07-11)
   drafted `proof` as "the seventh primitive"; by publication count
   it is the eighth — close (415) took seventh, and day (418, built
   first, ships second) becomes ninth.

   Seven-rule audit (the header IS the review record):
     • Rule 1 — calm: every line defaults to KEEP MACHINE; the
       untouched page is the machine's finished screen plus the
       editorial around it. Nothing gated.
     • Rule 2 — instrument: remove the control and the argument
       ("the designer's last act is judgment") becomes an essay
       about the act instead of the act. The hand is required.
     • Rule 3 — motion is weather: CSS transitions only (version
       swap, ledger count), ambient amplitude, reduced-motion
       collapse.
     • Rule 4 — all three versions of every line live in the DOM
       at all times; selection is visibility; @media print stacks
       each line's three versions plus the ledger.
     • Rule 5 — N independent radiogroups (role=radiogroup /
       role=radio + aria-checked), one per line, three fates each.
     • Rule 6 — DOUBLED. The ledger counts only the reader's own
       marks (session-only, unrecorded; `ledgerNote` printed). And
       the machine lines are REAL: gemma3:12b, local ollama, $0,
       2026-07-12, 80 tokens in 7.9s, raw JSON filed in the
       scratchpad and summarized in `audit.verified`. The six
       machine strings are verbatim, trimmed of label prefixes
       only — never hand-edited. `machineNote` discloses all of it.
     • Rule 7 — `proof` is instance one; ProofFeature reimplements
       its own control, extracts nothing from Galley/Press.

   Identity (PUBLISHING.md §III — five answers):
     • coverStock = 'ivory' — a proof pull literally is ivory proof
       stock (416 also ivory; the other four answers all differ).
     • coverLayout = 'classic' — the moving part lives inside
       (410/412/413 precedent).
     • accent = 'pool' — systems/tool register; the machine that
       drew first is foregrounded. Unused recently.
     • coverSeal = PROOF · MARKED BY HAND — the proof stamp; states
       the honesty boundary the way galley's UNRECORDED seal did.
     • feature = PROOF OF HAND — printer's proof + proof of
       authorship.

   Japanese: featureJp 手による校正 per the spec's proposal —
   flagged there as needing editorial confirmation before ship;
   confirm at deploy gate with the rest of the JP in this file.

   Provenance: one real gemma3:12b call, 2026-07-12, ollama HTTP
   API, default temperature. The hand rewrites are the house
   counter-voice, written to be genuinely warmer and more specific,
   not strawmen — the galley darlings-honesty principle: don't rig
   the demonstration. No number on this page is invented.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_417: IssueRecord = {
  number: '417',
  month: 'JUL',
  year: '2026',
  feature: 'PROOF OF HAND',
  featureJp: '手による校正',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',

  coverStock: 'ivory',
  coverLayout: 'classic',

  coverSeal: {
    label: 'PROOF · MARKED BY HAND',
    date: 'VII·26',
  },

  accent: 'pool',

  headline: {
    prefix: 'Proof of',
    emphasis: 'Hand',
    suffix: '.',
    swash: 'In 2026 the canvas fills itself before you arrive. The tool drafted its own welcome screen; we ran that draft for real, and this page hands you the red pencil.',
  },

  contents: [
    { n: '001', en: 'The blank canvas is never blank', jp: '白紙のカンバスはもう白紙ではない', tag: 'THESIS' },
    { n: '002', en: 'The handover — you are the art director now', jp: '引き継ぎ — あなたがアートディレクター', tag: 'METHOD' },
    { n: '003', en: 'The proof — six lines, three fates each', jp: '校正刷り — 六行、三つの運命', tag: 'THE WORK' },
    { n: '004', en: 'What the ledger records', jp: '台帳が記録するもの', tag: 'HONESTY' },
    { n: '005', en: 'The resolved screen — whose hand', jp: '仕上がった画面 — 誰の手か', tag: 'OUTCOME' },
    { n: '006', en: 'What proof settles', jp: '校正が決着させるもの', tag: 'ARC' },
  ],

  spread: {
    type: 'proof',
    kicker: 'THE PROOF · 校正刷り',
    title: 'Proof of Hand.',
    titleJp: '手による校正。',
    deck: 'A machine drafted the welcome screen of a design tool — really drafted it, on this desk, this week. Six lines. Your job is the last one left in 2026: decide, line by line, whose words stand.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'ivory',

    dossier: {
      kicker: 'THE APPARATUS · 装置',
      note: 'The control: one radiogroup per line, three fates — KEEP MACHINE, TAKE THE HAND, STRIKE. Untouched, every line keeps the machine, which is exactly the 2026 default this issue is about. The machine lines are real output from gemma3:12b, run locally on this desk ($0), verbatim, never edited; the hand lines are this magazine writing against them, trying honestly to be better. The ledger below counts only your marks — session-only, recorded nowhere.',
      items: [
        { label: 'SUBJECT', value: 'THE BLANK-CANVAS SCREEN — DRAFTED BY MACHINE' },
        { label: 'MACHINE', value: 'GEMMA3:12B · LOCAL OLLAMA · $0 · VII·26' },
        { label: 'DRAFT', value: '6 LINES · 80 TOKENS · 7.9S · VERBATIM' },
        { label: 'CONTROL', value: 'PER LINE: KEEP MACHINE / TAKE THE HAND / STRIKE' },
        { label: 'LEDGER', value: 'YOUR MARKS ONLY · SESSION · UNRECORDED' },
      ],
    },

    intro: [
      {
        heading: 'The blank canvas is never blank',
        headingJp: '白紙のカンバスはもう白紙ではない',
        paragraphs: [
          'Open a design file in 2026 and something has already happened. The tool has drafted a first pass — a layout, a copy deck, a welcome — before your cursor lands. The blank canvas, the one sacred terror of every studio since studios existed, now arrives pre-filled, competent, and slightly nobody’s. Figma calls its version a first draft. Every tool has one now. The terror didn’t vanish; it moved. It used to live in the empty screen. It lives now in the full one.',
          'Because the question a full screen asks is harder than the question an empty one asked. The empty screen asked: what will you make? The full screen asks: what will you let stand? That second question is a judgment call performed line by line, and it is the last act that is unambiguously yours. The industry has a word for the person who performs it. Not designer. Art director.',
        ],
      },
      {
        heading: 'The handover',
        headingJp: '引き継ぎ',
        paragraphs: [
          'So instead of writing an essay about adjudication, this page stages one. We asked a real model on this desk — gemma3:12b, local, free — to draft the copy for the one screen that embodies the whole subject: a design tool’s own blank-canvas welcome. It gave us six lines in under eight seconds. They are printed below exactly as they came back, which is the only honest way to print them.',
          'Against each machine line, this magazine wrote a hand line — our counter-voice, trying to be warmer and more specific, not a strawman. And each line has a third fate: strike it, and the blank the machine filled comes back. Mark all six. The screen at the bottom resolves as you go, and the ledger keeps the only score that matters here: who authored the finished thing.',
        ],
      },
    ],

    proofKicker: 'THE PROOF · SIX LINES · MARK EACH ONE',

    lines: [
      {
        id: 'p1',
        slot: 'HEADLINE',
        slotJp: '見出し',
        machine: 'Start Something New',
        hand: 'Blank on purpose.',
      },
      {
        id: 'p2',
        slot: 'SUBHEAD',
        slotJp: '副題',
        machine: 'Unleash your creativity – a fresh design awaits.',
        hand: 'No template chose this for you. Take a minute before you take a tool.',
      },
      {
        id: 'p3',
        slot: 'PRIMARY ACTION',
        slotJp: '主ボタン',
        machine: 'Create Project',
        hand: 'Begin',
      },
      {
        id: 'p4',
        slot: 'EMPTY-STATE HINT',
        slotJp: '空白の指示',
        machine: 'Drag & drop elements here.',
        hand: 'It can stay empty while you think.',
      },
      {
        id: 'p5',
        slot: 'TOOLTIP',
        slotJp: 'ツールチップ',
        machine: 'Select the Rectangle Tool.',
        hand: 'Rectangle — most things start as one.',
      },
      {
        id: 'p6',
        slot: 'LIMIT / ERROR LINE',
        slotJp: '拒否の一文',
        machine: 'File size exceeds maximum allowed.',
        hand: 'That file is over our 200 MB line. Trim it, or link to it instead.',
      },
    ],

    ledgerNote: 'The ledger counts three numbers, and they are yours: how many lines you kept from the machine, how many you gave to the hand, and how many you struck back to blank. Marks are React state in your browser and nothing else — nothing recorded, nothing sent, gone on reload. Per the ethic set in ISSUE 411, no verdict here is wrong; an all-machine screen is a finding about 2026, not a failure of taste.',

    machineNote: 'The machine lines above are real: one call to gemma3:12b on this desk’s own ollama, 2026-07-12, default temperature, $0 — six labelled lines back in 7.9 seconds, 80 tokens, printed verbatim with only the label prefixes trimmed. We did not edit a machine line, and we did not rig the contest: the raw JSON is filed with this issue’s audit. The hand lines are ours, written after the machine’s, trying honestly to beat them.',

    outro: [
      {
        heading: 'What the ledger records',
        headingJp: '台帳が記録するもの',
        paragraphs: [
          'Look at your resolved screen. Whatever mix it holds — all machine, all hand, six blanks, any split — the ledger under it is a provenance record: a small, honest audit trail of who authored a finished surface. That is not a metaphor this magazine reaches for; it is the thing this magazine is. Every issue ships with its own audit block, its own account of what was drafted, what was verified, what was cut. The ledger you just composed is the same document at screen scale.',
          'And notice what the act felt like. Keeping the machine’s line was easiest — it was already there, already fine. The literature on defaults would have predicted your thumb’s bias to the letter. The strike took the most nerve; blankness always does. Somewhere between those two costs is the actual price of authorship in 2026, and you just paid it six times.',
        ],
      },
      {
        heading: 'What proof settles',
        headingJp: '校正が決着させるもの',
        paragraphs: [
          'The cabinet of this magazine’s interactive shapes now speaks a complete print-shop sentence: the galley (410) let you cut raw human type; the press (413) let you compose an artifact from the house’s live constants; the proof — this page — is the correction pass between them, the moment a draft meets the red pencil. Eighth shape, instance one, no machinery borrowed.',
          'What it settles is the polarity of the age. The galley’s question was what a human text could lose. The proof’s question is what a machine draft must earn. Same pencil, opposite burden — and the burden’s direction is the whole story of tools in 2026. The canvas fills itself now. The hand’s remaining work is to decide what deserved the fill.',
        ],
      },
    ],

    pullQuote: {
      text: 'The empty screen asked what you would make. The full screen asks what you will let stand.',
      attribution: 'PROOF OF HAND · ISSUE 417',
    },

    signoff: '街のコーダーたちへ — the canvas is never blank now; decide whose hand fills it, and sign the ledger.',
  },

  audit: {
    drafted: 'spec’d 2026-07-11 (brainstormed, opus session) · built claude-fable-5 session, VII·26',
    verified: 'machine draft real: 1 gemma3:12b call, ollama API, 2026-07-12 — 6 lines, 80 tokens (eval_count), 7.9s (total_duration), verbatim; raw JSON filed (scratchpad resp_417_proof.json)',
    adherence: 'eighth shape `proof` — seven-rule audit in file header; ledger meters reader marks only; machine lines never edited; ProofFeature extracts nothing (rule 7)',
    readCut: 'six slots kept from the spec’s six; hand lines drafted ×2, tighter set kept',
    pressed: 'VII·26 · 2026-07-12',
  },

  credits: {
    editorInChief: 'Isaac Hernandez',
    creativeDirection: 'kernel.chat group',
    artDirection: 'in-house',
    copy: 'kernel.chat editorial',
    japanese: 'kernel.chat editorial',
    production: 'kernel.chat group',
  },
}
