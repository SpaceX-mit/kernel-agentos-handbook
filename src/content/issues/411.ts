/* ──────────────────────────────────────────────────────────────
   ISSUE 411 — JUL 2026
   OPERATING INSTRUCTIONS
   取扱説明書 — 四つの形を、手で覚える

   The first Tutor — the eleventh editorial tool, and the magazine's
   first spread whose purpose is CAPABILITY rather than claim. The
   run built four ways to take the reader's hand (dial 399, switch
   406, sequence 408, galley 410) and never once taught anyone to
   use them. This is the missing manual: the reader operates a
   stakes-free version of all four shapes and, in doing so, becomes
   literate in the grammar every future interactive spread will use.

   The design argument (the review this header is):

   • Why a new shape (rule 7): a tutorial's purpose is capability
     transfer — the reader arrives unable and leaves able. That is
     a genuinely new relationship, distinct from transferring a
     claim (essay/colloquy) or an experience (dial/knife). The
     material is four small operable demos in a teaching flow; no
     existing shape holds that. New shape: Tutor.

   • The rule-1 tension, and its resolution: teaching seems to want
     to GATE (you must do step 1 before step 2). It doesn't here.
     Every lesson reads complete untouched — the `teaches` line,
     the `intro`, and the `consequence` are all static prose that
     explain the shape whether or not the reader operates it. The
     control DEEPENS the lesson; it never unlocks it. Rule 1 holds.

   • The rule-6 extension, and the refusal beyond it: teaching
     seems to want CORRECTNESS. A keystroke's correctness is
     honestly auditable — unlike 410's feeling — so the magazine
     COULD grade the reader and stay inside rule 6. It refuses
     anyway. No control here is ever "wrong"; each shows only what
     the reader's choice produced. Teach by consequence, never by
     grade. That refusal — declining a measurement the rules would
     permit — is the issue's whole ethic, and the seal states it.

   • Composition without extraction (rule 7 again): the four
     mini-controls are reimplemented inline in TutorFeature.tsx,
     NOT imported from InstrumentFeature/CompareFeature/etc. The
     tutor is instance one of a new story; shared machinery waits
     for a second tutor. Each control uses the SAME ARIA pattern as
     its full shape (radiogroup, switch, tablist, aria-pressed
     toggles) so the reader learns the real grammar.

   • Self-reference: the subject is the magazine's own language, so
     each lesson's practice content is written to be self-
     demonstrating — the dial teaches "the dial" at graduated
     depth, the switch flips two readings of one sentence, the
     sequence is a plainly-ordered process, the galley hands over
     two passages to cut. The medium teaches its own literacy, the
     same self-referential move as 407 (auditing its arc) and 409
     (arguing its law).

   Identity decisions:
     • coverStock = 'butter' — the warm, lamplit, slow-reading
       stock. A manual should feel like an invitation to sit down,
       not a lab bench (399's ivory) or an archive (405's ink).
       Differentiates from every other interactive issue in the run.
     • coverLayout = 'classic' — the operable parts live inside.
     • coverSeal = NO GRADE · ONLY CONSEQUENCE — the pedagogy as
       the signature stamp; the direct statement of the ethic.
     • accent = 'amethyst' — the cabinet's "about kernel.chat
       itself" seed. This issue is literally about the magazine's
       own grammar and how to read it; amethyst is exactly right,
       and it is the `tutor` shape's own default (used at default
       the way 399/406/408/410 used theirs at each first instance).
     • spread.type = 'tutor', spread.stock = 'butter'.

   The arc so far: 399 built the first instrument; 403 wrote the
   law; 405 measured; 406/408/410 added shapes two, three, four;
   407 audited; 409 argued the open question; 410 answered it. 411
   turns around and teaches the whole grammar to the reader who has
   to hold it — the loop the run had left open since 399.

   Drafted on claude-opus-4-8 (session model switched via /model);
   the audit colophon stamps it, per the honesty habit.

   Identity-catalog row to add to docs/design-language.md:

     | 411 | butter | classic | — | seal: NO GRADE · ONLY CONSEQUENCE · VII·26 | amethyst | tutor (new) | First Tutor — the eleventh tool and first teaching spread; the reader operates a stakes-free version of all four shapes (dial/switch/sequence/galley) in one spread and becomes literate in the grammar; teach by consequence, never by grade — no control is ever "wrong"; composes the four primitives with minimal inline controls, no machinery extracted (rule 7) | `tutor` spread type; first spread whose purpose is capability not claim; rule-6 refusal: declines a correctness meter the rules would permit |
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_411: IssueRecord = {
  number: '411',
  month: 'JUL',
  year: '2026',
  feature: 'OPERATING INSTRUCTIONS',
  featureJp: '取扱説明書',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',

  coverStock: 'butter',
  coverLayout: 'classic',

  coverSeal: {
    label: 'NO GRADE · ONLY CONSEQUENCE',
    date: 'VII·26',
  },

  accent: 'amethyst',

  headline: {
    prefix: 'Operating',
    emphasis: 'Instructions',
    suffix: '.',
    swash: 'Four shapes, one manual. Operate each once — there is no wrong move, only what your hand reveals — and you can read every interactive spread this magazine will ever run.',
  },

  contents: [
    { n: '001', en: 'Why a manual, and why now', jp: 'なぜ説明書か', tag: 'METHOD' },
    { n: '002', en: 'The dial — one variable, many depths', jp: '目盛り — 一つの変数', tag: 'LESSON' },
    { n: '003', en: 'The switch — two readings, no blend', jp: '切替 — 混ざらない二読', tag: 'LESSON' },
    { n: '004', en: 'The sequence — order that means', jp: '手順 — 意味を持つ順序', tag: 'LESSON' },
    { n: '005', en: 'The galley — your hand on the text', jp: '校正 — 文章に置く手', tag: 'LESSON' },
    { n: '006', en: 'No grade, only consequence', jp: '評価はない、結果だけ', tag: 'CLOSING' },
  ],

  spread: {
    type: 'tutor',
    kicker: 'THE MANUAL · 取扱説明書',
    title: 'Operating Instructions.',
    titleJp: '取扱説明書。',
    deck: 'This magazine has built four ways to take your hand and never taught anyone to use them. Here is the manual. Operate a stakes-free version of each shape below — there is no wrong move, only what your choice reveals — and you will be able to read every interactive spread we ever run.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'butter',

    dossier: {
      kicker: 'HOW TO USE THIS ISSUE · 使い方',
      note: 'You learn each shape by operating it, not by reading about it. Nothing here can be gotten wrong — a keystroke could be graded honestly, and we decline to. Every control shows what your choice produced and forgets your marks on reload.',
      items: [
        { label: 'SHAPES TAUGHT', value: 'FOUR — DIAL · SWITCH · SEQUENCE · GALLEY' },
        { label: 'HOW YOU LEARN', value: 'BY OPERATING · NOT BY READING ABOUT' },
        { label: 'GRADE', value: 'NONE · YOU CANNOT GET THIS WRONG' },
        { label: 'EACH CONTROL SHOWS', value: 'THE CONSEQUENCE OF YOUR CHOICE' },
        { label: 'STAKES', value: 'NONE · PRACTICE ONLY · NOTHING RECORDED' },
      ],
    },

    intro: [
      {
        heading: 'Why a manual, and why now',
        headingJp: 'なぜ説明書か',
        paragraphs: [
          'Across a dozen issues this magazine built four different ways to hand the reader a control — a dial to turn, a switch to flip, a sequence to walk, a galley to cut — and it never once stopped to teach anyone how to hold them. It assumed the grammar. This issue makes the assumption explicit, because a language nobody was taught to read is a language that only its authors can hear.',
          'What follows is a manual you operate. Four lessons, one shape each, every one a working stakes-free version of the real thing. There is nothing to get right. A tutorial usually keeps score — did you press the correct key? — and this one refuses to, on purpose: a keystroke could be graded honestly, but the moment a page starts grading you it stops being a magazine and becomes a test. So every control below shows you only what your own choice produced. The lesson is the consequence, and the consequence is yours.',
        ],
      },
    ],

    lessons: [
      {
        id: 'l-dial',
        shape: 'dial',
        label: 'THE DIAL',
        labelJp: '目盛り',
        teaches: 'One variable. Ordered depths. You choose how far.',
        intro: 'A dial is for one thing that varies by degree — effort, detail, zoom, depth. Its stops are ordered: a low end, a high end, and positions between. You slide along it and the page answers at each stop. Turn the practice dial below; it answers the question about itself at three depths.',
        prompt: 'What is a dial for?',
        stops: [
          { id: 'low', label: 'LOW', labelJp: '低', reading: 'Picking a point on one scale.' },
          { id: 'mid', label: 'MID', labelJp: '中', reading: 'Picking a point on one scale — effort, detail, depth — and seeing what that setting returns.' },
          { id: 'high', label: 'HIGH', labelJp: '高', reading: 'Picking a point on one ordered scale. There is a low end and a high end; you move between them and the page answers at each. Reach for a dial when your subject is a single thing that varies by degree — and note that no stop was the correct one. You simply chose how far.' },
        ],
        defaultStop: 'low',
        consequence: 'Turning the dial changed how much you got, not whether you were right. That is the whole shape: one variable, ordered depths, and a reader who decides where to stand on it. No stop is ever wrong — a dial has no wrong end.',
      },
      {
        id: 'l-switch',
        shape: 'switch',
        label: 'THE SWITCH',
        labelJp: '切替',
        teaches: 'Two whole readings of one thing. Nothing between them.',
        intro: 'A switch is for two complete, opposed readings of the same fact — not two depths on one scale, but two lenses with no honest middle. Flip the practice switch below: the same sentence, read two ways, with no halfway reading that would mean anything.',
        fact: 'The sentence being read: “It depends.”',
        lenses: [
          { id: 'evasion', label: 'EVASION', labelJp: '逃避' },
          { id: 'honesty', label: 'HONESTY', labelJp: '誠実' },
        ],
        readingA: 'Read as evasion, “it depends” is the answer of someone who will not commit — a hedge, a door left open so no one can be held to anything.',
        readingB: 'Read as honesty, “it depends” is the only truthful answer to a question whose answer genuinely turns on conditions — a refusal to fake a certainty that isn’t there.',
        defaultLens: 'evasion',
        consequence: 'You flipped between two full readings of three words, and there was no position at 60% evasion and 40% honesty that meant anything. That absence of a middle is what makes it a switch and not a dial — reach for it when your subject has two irreducible readings, not a spectrum.',
      },
      {
        id: 'l-sequence',
        shape: 'sequence',
        label: 'THE SEQUENCE',
        labelJp: '手順',
        teaches: 'Discrete steps in a real order. Each depends on the last.',
        intro: 'A sequence is for a process that runs in an order, where each step depends on the one before it. Walk the three stages below. You may jump straight to the last — the manual lets you, because you are reviewing a finished process, not running a live one — but notice that the order is the meaning.',
        stages: [
          { id: 'boil', label: 'BOIL', labelJp: '沸', detail: 'Heat the water. Nothing downstream is possible until this is done — there is no steeping cold water and no pouring an empty pot. The first stage is first because the rest depend on it.' },
          { id: 'steep', label: 'STEEP', labelJp: '蒸', detail: 'Add the leaf to the hot water and wait. This stage consumes what BOIL produced; skip BOIL and there is nothing to steep in. Each stage is complete in itself and useless out of order.' },
          { id: 'pour', label: 'POUR', labelJp: '注', detail: 'Fill the cup. POUR depends on STEEP the way STEEP depended on BOIL — pour before you steep and you are pouring hot water, not tea. You could click here first; the manual allows it. But the sequence is the meaning, and the meaning runs in order.' },
        ],
        defaultStage: 'boil',
        consequence: 'You could reach any stage in any order — this is a finished record, not a live run, so nothing was forced on you. But the account each stage gives depends on the one before it: that dependency, not the clicking, is what makes it a sequence rather than four unrelated panels.',
      },
      {
        id: 'l-galley',
        shape: 'galley',
        label: 'THE GALLEY',
        labelJp: '校正',
        teaches: 'You perform the edit. The page keeps the count and forgets your marks.',
        intro: 'A galley hands you the editor’s own act: strike what you would cut, keep what you would keep. Below are two passages — one plain, one a darling written to be cut. Mark them however you like. The tally counts your marks and claims nothing else.',
        passages: [
          { id: 'gp1', text: 'A galley is the one shape where the reader does the editorial work instead of watching it get done. You are, for these two passages, the editor.' },
          { id: 'gp2', text: 'And this passage, luxuriant and unhurried, exists chiefly to be beautiful at you — a small velvet cushion of a sentence, plumped and placed, delivering no fact and advancing no argument, present only so that the knife in your hand should have something worth refusing, or worth cutting, and either way something to feel.' },
        ],
        tallyNote: 'The tally counts words kept and passages struck, live, from your marks — a measurement of the marks and nothing else. It says nothing about whether you cut well; there is no cutting well here, only your cut. Your marks live in this page’s memory for this visit only: nothing is recorded, nothing is sent, and reloading restores both passages whole.',
        consequence: 'Whatever you did — cut the darling, kept it, struck both, struck neither — the tally counted your marks and passed no judgment on them, because a galley has no right answer. That is the shape at its purest: the reader performs the act, the page keeps an honest count, and the page looks away.',
      },
    ],

    outro: [
      {
        heading: 'No grade, only consequence',
        headingJp: '評価はない、結果だけ',
        paragraphs: [
          'You have now operated all four. Nothing above told you that you had it right, because none of it could without becoming the thing this magazine refuses to be. A control that grades you is a control that watches you to find out whether to reward you — and that is the whole extraction grammar in one gesture. The manual’s entire method was the opposite: each shape showed you what your own hand produced and then let the seeing be the lesson. Consequence, not correctness. A workbench, not a test.',
          'The reason this is worth an issue is that the shapes will come back and the content never will. The next dial will not be about dials; the next galley will not be about galleys. But the grammar is now yours — you know what a dial asks, why a switch has no middle, how a sequence carries its meaning in its order, and what a galley hands you and refuses to keep. You can read every interactive spread this magazine will ever run, because you just read the ones that were only about themselves. That was the last thing the run had left undone since the first instrument: it built a language and, at last, taught someone to hold it.',
          '街のコーダーたちへ — operate everything once; you can read us now.',
        ],
      },
    ],

    pullQuote: {
      text: 'There is no wrong stop, no wrong lens, no wrong cut. Only what your hand reveals.',
      attribution: 'THE MANUAL DESK · 411',
    },

    signoff: '街のコーダーたちへ — operate everything once; you can read us now.',
  },

  audit: {
    drafted: 'magazine-editor · claude-opus-4-8 session, VII·26',
    verified: 'all four practice controls operate; teach-by-consequence — no correctness or grade state exists anywhere in TutorFeature.tsx',
    adherence: 'TutorSpread — new type, eleventh tool, instance one; composes the four primitives with minimal inline controls, no shared machinery extracted (rule 7); every control uses its full shape’s ARIA pattern',
    readCut: 'kept the rule-6 refusal explicit — a keystroke could be graded honestly and the magazine declines to, which is the issue’s ethic, not a limitation to smooth over',
    pressed: 'VII·26 · 2026-07-05',
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
