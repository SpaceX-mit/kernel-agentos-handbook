/* ──────────────────────────────────────────────────────────────
   ISSUE 403 — JUL 2026
   THE READER'S HAND
   読者の手 — 編集面に触れてよい条件

   The interaction design language, ratified as an issue. 399
   put the magazine's first interactive control on an editorial
   surface — a five-stop effort dial — and made a set of
   boundary decisions in the margins: interaction permitted,
   motion CSS-only, every state in the DOM, print gets
   everything stacked, meters labelled honestly. Those rulings
   have governed one issue and lived in code comments. A design
   language that lives in comments is folklore. This issue
   promotes it to law: seven declarations on when and how an
   editorial page may accept the reader's hand.

   Why forecast: the argument IS a numbered list of rules. An
   essay would over-narrate what wants to be citable — future
   spreads should be able to point at 403-04 the way contracts
   point at clauses.

   Identity decisions (differentiated from 393, the previous
   forecast — ink / asymmetric-left / cobalt — and from the
   rest of this press day):
     • coverStock = 'butter' — the warm, daylight register.
       Interaction rules are hospitality rules; the paper
       should feel like an open room, not a server hall.
     • coverLayout = 'numbered-catalog' — the cover carries
       the 1–7 route as secondary art, because the numbered
       route is the argument (precedent: 375).
     • coverSeal = RATIFIED · MOTION STILL — the two-word
       summary of the whole language.
     • accent = 'cobalt' — the declaration register; kept from
       the forecast default deliberately, because these are
       print-blue rules, not warm suggestions. Butter + cobalt
       is a new pairing on the shelf.
     • spread.type = 'forecast', spread.stock = 'butter'.

   Precedents cited in prose: 399 (the instrument, the
   ratifications), 371 (the motion ruling), 398 (form enacts
   thesis). The rules here are the same ones being codified
   into docs/interaction-language.md this press day — the
   issue is the declaration, the doc is the law book.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_403: IssueRecord = {
  number: '403',
  month: 'JUL',
  year: '2026',
  feature: 'THE READER’S HAND',
  featureJp: '読者の手',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE OF AGENTIC ENGINEERING · エージェント工学の雑誌',

  coverStock: 'butter',
  coverLayout: 'numbered-catalog',

  coverSeal: {
    label: 'RATIFIED · MOTION STILL',
    date: 'VII·26',
  },

  accent: 'cobalt',

  headline: {
    prefix: 'The',
    emphasis: 'Reader’s',
    suffix: 'Hand.',
    swash: 'Seven declarations on interaction in an editorial surface — when a magazine page may accept the reader’s touch, and everything it owes the reader after it does.',
  },

  contents: [
    { n: '001', en: 'The page is calm by default', jp: '頁は初期状態で静か', tag: 'GROUND' },
    { n: '002', en: 'Interaction is an instrument, not decoration', jp: '操作は計器、装飾にあらず', tag: 'PURPOSE' },
    { n: '003', en: 'Motion is weather, not action', jp: '動きは天気、行為にあらず', tag: 'MOTION' },
    { n: '004', en: 'Everything stays on the page', jp: 'すべて頁上に残す', tag: 'PRINT' },
    { n: '005', en: 'The hand arrives by every door', jp: '手はどの扉からも届く', tag: 'ACCESS' },
    { n: '006', en: 'The meter tells the truth', jp: '計器は正直に', tag: 'HONESTY' },
    { n: '007', en: 'Two instances before a pattern', jp: '二例をもって型とす', tag: 'RESTRAINT' },
  ],

  spread: {
    type: 'forecast',
    kicker: 'THE LANGUAGE · ★ · 読者の手',
    title: 'The Reader’s Hand.',
    titleJp: '読者の手。',
    deck: 'Issue 399 put a dial on an editorial page and the sky did not fall — because a set of unwritten rules held it in place. Rules that live in code comments are folklore, and folklore erodes. Seven declarations follow: the conditions under which this magazine’s pages accept the reader’s hand, promoted from margin notes to law.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'butter',

    intro: 'A magazine page has one interaction it has honoured for a century: the reader turns it. Everything else — the dial, the toggle, the control that answers to touch — arrived with the screen, and most publications absorbed it the way they absorb every novelty: everywhere, at once, without a grammar. The result is the modern article that squirms under the cursor. This publication went the other way: no interaction at all for three hundred ninety-eight issues, then one instrument, built for one story that could not be told otherwise, wrapped in rulings. The rulings held. Here they are as declarations, so the next instrument inherits law instead of folklore.',

    propositions: [
      {
        n: '01',
        title: 'The page is calm by default.',
        titleJp: '頁は初期状態で静か',
        body: [
          'An editorial surface at rest is finished — fully readable, fully formed, demanding nothing. Interaction never gates the first reading: a page must give everything a patient reader needs before their hand moves, and a reader who never touches anything must miss nothing essential. The touch deepens; it never unlocks.',
          'This is the ground rule the other six stand on. A page that requires interaction to be complete is not an editorial surface with a control on it. It is an application wearing the magazine’s clothes, and the wardrobe is not lent out.',
        ],
      },
      {
        n: '02',
        title: 'Interaction is an instrument, not decoration.',
        titleJp: '操作は計器、装飾にあらず',
        body: [
          'The magazine admits exactly one species of interactivity: the calibrated control — a fixed question, a bounded set of positions, and an honest reading at each stop. 399’s dial asked one prompt at five depths of thought. That is the shape: the reader’s hand adjusts a variable the story is actually about, and the page answers.',
          'Everything else is refused by type. No hover garnish, no scroll-triggered reveals, no parallax, no element that reacts merely to prove it can. If the interaction is not itself the argument — if the story would survive its removal — it does not ship. The test is the same one the drawer applies to prose: cut it and see if anything true is lost.',
        ],
      },
      {
        n: '03',
        title: 'Motion is weather, not action.',
        titleJp: '動きは天気、行為にあらず',
        body: [
          'Interaction and motion are separate budgets, and the motion budget did not grow when the hand arrived. Motion on these pages stays CSS-only and ambient — the amplitude of paper in a room, a transition no longer than a page-turn. Script may change state; it does not choreograph. The ruling predates the instrument (371 tried an after-hours motion system and withdrew it) and survived it unchanged.',
          'The distinction is felt, not technical. Weather is what a place does on its own; action is what demands your attention. An editorial page may have a climate. It may not perform. When a stop changes on the dial, the new answer arrives with the modesty of a turned page — because that is what it is.',
        ],
      },
      {
        n: '04',
        title: 'Everything stays on the page.',
        titleJp: 'すべて頁上に残す',
        body: [
          'Every state the control can reach exists in the document at all times — every stop’s answer in the DOM, none conjured on demand, none destroyed on departure. The selected state is a matter of visibility, not existence. And print, the magazine’s oldest render target, receives everything stacked: on paper the instrument becomes a table of its positions, complete without a hand to work it.',
          'This is the archival clause. An issue is a frozen, reproducible object; a page whose content lives behind interaction is a page the archive cannot hold and the printer cannot prove. If a state matters enough to build, it matters enough to print. The interactive surface is a courtesy of the medium — never the sole custodian of the content.',
        ],
      },
      {
        n: '05',
        title: 'The hand arrives by every door.',
        titleJp: '手はどの扉からも届く',
        body: [
          'A control that answers only to a mouse is a control with a doorman. The instrument speaks the platform’s native grammar in full: one tab stop for the whole control, arrows to move between positions, the standard roles and states announced to assistive technology exactly as a native control would announce them. 399 shipped as a roving radiogroup for precisely this reason — the pattern is boring, proven, and owed.',
          'The declaration generalises: the magazine does not invent interaction grammars. Every control maps to an established pattern with established keyboard behaviour, or it does not ship. Novelty spends its budget on the editorial idea; the mechanics stay standard, because a reader’s hands — all kinds of hands — already know the standard.',
        ],
      },
      {
        n: '06',
        title: 'The meter tells the truth.',
        titleJp: '計器は正直に',
        body: [
          'A calibrated control makes claims — this stop costs this much, takes this long, thinks this hard. Every reading shown is either measured or labelled representative, in words, on the surface, next to the number. 399 printed its honesty note under the meter and the note is now mandatory equipment: the difference between an instrument and a prop is whether the gauge is connected to anything.',
          'This is the audit discipline extended to the reader’s hand. The magazine files provenance for its prose; an interactive claim gets the same treatment or it gets cut. A dial that dramatises fake numbers would be the squirming article again, wearing a lab coat.',
        ],
      },
      {
        n: '07',
        title: 'Two instances before a pattern.',
        titleJp: '二例をもって型とす',
        body: [
          'One instrument exists. This language was written after one issue proved the species viable — and the language is deliberately a fence, not a roadmap. No second control ships because the first one worked; the second ships when a second story arrives that cannot be told without a hand on it. Then, and only then, does the shared machinery get extracted, the way every tool in this catalog was extracted: from the second real need, never the first enthusiasm.',
          'The declaration is the magazine’s general law of novelty applied to its newest power. Restraint is what keeps the instrument meaning something: a catalog where every page has a dial is a catalog where the dial is decoration again. The reader’s hand is welcome here — rarely, deliberately, and always for the story’s sake. That rarity is the design.',
        ],
      },
    ],

    outro: 'Filed the same press day as the codification: these seven declarations now live twice, once here as the argument and once in the repository as the law the build can hold future spreads to. The division of labour is the usual one — the issue persuades, the document enforces. 399 built the first instrument; 403 fences the field it stands in. The next instrument, whenever its story arrives, will be born already knowing the rules.',

    signoff: '街のコーダーたちへ ★ let the page be calm; earn every touch.',
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
