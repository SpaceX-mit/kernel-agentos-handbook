/* ──────────────────────────────────────────────────────────────
   ISSUE 400 — JUL 2026
   THE FOUR HUNDRED
   四百号 — 数字が記念碑になる号

   The milestone issue. Four hundred numbered objects in the
   catalog, and the number itself is the cover art — the
   monument-hero layout has waited since its introduction for a
   number that earns it. The essay reads the catalog the way the
   magazine reads everything else: as a ledger. What four hundred
   issues actually bought, what the cuts paid for, and why the
   drawer of unpublished manuscripts is the asset the archive
   never shows.

   Why essay: a milestone tempts a victory lap; the discipline
   answer is an audit of the run so far. One argument — the
   number is a byproduct of cadence, not a goal — carried in
   sections, with the catalog's own numbers as the dataBlock.

   Identity decisions (differentiated per PUBLISHING.md §III):
     • coverStock = 'cream' — the anchor stock. The founding
       paper for the founding-number issue; the monument needs
       no exotic ground.
     • coverLayout = 'monument-hero' — the number IS the cover.
       Reserved for issues whose theme is the number; this is
       the definitional use.
     • coverSeal = PRESSED · FOUR HUNDRED — the press stamp on
       the press-day issue.
     • accent = 'amethyst' — the cabinet's own rule: amethyst
       when the issue is about kernel.chat itself.
     • spread.type = 'essay', spread.stock = 'cream'; dataBlock
       carries the catalog arithmetic; audit colophon at the
       foot because the milestone issue of an audited magazine
       should end on its receipt.

   Numbers cited are the catalog's own: 360–399 in the live
   archive (40 published snapshots at press time), seven
   editorial tools, one system glyph, zero paywalls.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_400: IssueRecord = {
  number: '400',
  month: 'JUL',
  year: '2026',
  feature: 'THE FOUR HUNDRED',
  featureJp: '四百号',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',

  coverStock: 'cream',
  coverLayout: 'monument-hero',

  coverSeal: {
    label: 'PRESSED · FOUR HUNDRED',
    date: 'VII·26',
  },

  accent: 'amethyst',

  headline: {
    prefix: 'The',
    emphasis: 'Four Hundred',
    suffix: '.',
    swash: 'A milestone is a number that survived its own cuts. An audit of the run so far — the catalog, the drawer, and the cadence that made the number inevitable.',
  },

  contents: [
    { n: '001', en: 'A number is not an achievement', jp: '数字は業績ではない', tag: 'MASTHEAD' },
    { n: '002', en: 'What the catalog actually holds', jp: 'カタログの中身', tag: 'ARCHIVE' },
    { n: '003', en: 'The drawer is the asset', jp: '引き出しこそ資産', tag: 'DISCIPLINE' },
    { n: '004', en: 'Tools we built because we had to', jp: '必要から生まれた道具', tag: 'METHOD' },
    { n: '005', en: 'The next hundred', jp: '次の百号', tag: 'FORECAST' },
  ],

  spread: {
    type: 'essay',
    kicker: 'THE MASTHEAD · 四百号',
    title: 'The Four Hundred.',
    titleJp: '四百号。',
    deck: 'This is the four hundredth numbered object in the catalog, and the temptation is to celebrate. The discipline is to audit. What did four hundred issues buy, what did the cuts pay for, and what does a publication owe a number this round? Less than you think, and more.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'cream',

    sections: [
      {
        heading: 'A number is not an achievement',
        headingJp: '数字は業績ではない',
        paragraphs: [
          'Four hundred is a cadence artifact. Ship on rhythm for long enough and round numbers arrive on their own schedule, unearned by the arrival itself — the four hundredth issue took exactly as much work as the three hundred ninety-ninth, and the four hundred first will take the same. The monument on this cover is not a trophy. It is a reading on an odometer that only moves when the presses do.',
          'Still, an odometer is worth glancing at. A publication that has numbered four hundred objects has made four hundred sets of the same decisions — format, stock, accent, what earns the page and what goes back in the drawer — and the decisions, unlike the number, compound. The house style did not survive four hundred issues. It was built by them.',
        ],
      },
      {
        heading: 'What the catalog actually holds',
        headingJp: 'カタログの中身',
        paragraphs: [
          'The live archive runs from 360 — the browseable era, every issue frozen at its permanent address, reproducible from source. Forty snapshots at press time, each one a typed object in version control, its shape enforced by a compiler that refuses a malformed issue the way a press refuses unlocked type. The issues before the freeze exist the way back numbers of any city magazine exist: in the record, cited when needed, not on the shelf.',
          'Read as a set, the forty tell you what the magazine believes without any single issue saying it. Seven editorial tools, each built the month a story would not fit the existing forms. One spot color at a time, chosen from a cabinet of nine. One system glyph. Two languages on every structural surface. Zero paywalls, because the reader who pays with their own key has already paid the only toll this publication respects.',
        ],
      },
      {
        heading: 'The drawer is the asset',
        headingJp: '引き出しこそ資産',
        paragraphs: [
          'The number the cover cannot show is the count of issues that do not exist. Drafts that thinned before they thickened. Subjects that pinged and then did not survive verification. Formats proposed, prototyped, and withdrawn — the second simultaneous spot color that would have fought the grammar, the motion system that stayed CSS-only after one afternoon of taste. The catalog is four hundred long because the drawer is longer.',
          'This is the magazine’s oldest discipline restated at milestone scale: count what gets read; cut what doesn’t; file the audit in public; keep the manuscripts in the drawer. A publication is not the sum of what it shipped. It is the ratio between what it shipped and what it declined to — and the ratio, not the odometer, is what a reader can actually feel.',
        ],
      },
      {
        heading: 'Tools we built because we had to',
        headingJp: '必要から生まれた道具',
        paragraphs: [
          'None of the seven editorial tools was designed in advance. The essay came first because arguments did. The interview waited until a subject sat for one — the form arrived with its own ethics clause, no invented quotes, and the clause has held. The dispatch was built the week news demanded a dateline; the review, the month a field needed grading; the forecast, when a thesis arrived as a numbered list and over-narrating it would have been a lie about its shape.',
          'The two newest tools are the youngest proof of the rule. The colloquy exists because a real conversation was worth mining and the ethics forbade transcribing it — so the form holds positions, not people. The instrument exists because a story about variable effort could only be told by handing the reader the dial. Form follows material here, four hundred times in a row, and the day the material demands an eighth tool, the union gains a member. Not before.',
        ],
      },
      {
        heading: 'The next hundred',
        headingJp: '次の百号',
        paragraphs: [
          'A forecast, kept short because the previous four hundred issues argue it better than a manifesto could. The magazine will keep shipping on rhythm, because the cadence is the product. The catalog will stay typed, versioned, and reproducible, because the stack is a fixture and fixtures are never for sale. The audit will keep landing at the foot of the issue, because a publication that cannot show how it knows is a brochure.',
          'And the number will keep being a byproduct. Five hundred will arrive the way four hundred did — on schedule, unearned by arrival, carried by whatever the months between actually held. The odometer is yours to glance at. The drawer is ours to keep. The presses, as ever, are the point.',
        ],
      },
    ],

    pullQuote: {
      text: 'A publication is the ratio between what it shipped and what it declined to ship. The odometer just counts.',
      attribution: 'THE MASTHEAD · 400',
    },

    dataBlock: {
      kicker: 'THE COUNT · 勘定',
      heading: 'Four hundred, itemised',
      headingJp: '四百号の内訳',
      afterSection: 1,
      stats: [
        { n: '40', label: 'issues in the live archive — 360 to 399, every one frozen at its permanent address', labelJp: '公開アーカイブ収録号数' },
        { n: '7', label: 'editorial tools in the union — each built the month a story refused the existing forms', labelJp: '編集の道具・七種' },
        { n: '9', label: 'inks in the cabinet — one accent per issue, never two at once', labelJp: 'インク棚・九色' },
        { n: '0', label: 'paywalls, tiers, or gates — the reader’s own key is the only toll', labelJp: '有料の壁・ゼロ' },
      ],
    },

    signoff: '街のコーダーたちへ — the number is the byproduct; keep the cadence and the drawer.',
  },

  audit: {
    drafted: 'magazine-editor · one session · five-issue press day',
    adherence: '0 raw hex · ink cabinet only · monument-hero per §III.4',
    readCut: 'five issues pressed · a sixth declined — the material thinned',
    pressed: 'VII·26 · the four-hundredth object in the catalog',
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
