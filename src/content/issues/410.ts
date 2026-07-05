/* ──────────────────────────────────────────────────────────────
   ISSUE 410 — JUL 2026
   THE EDITOR'S KNIFE
   編集者のナイフ — 感じるための、正直な装置の最初の試み

   The fourth interactive shape — Galley — and the answer to the
   question 409 left open. 409's two voices fought over whether a
   control can carry feeling honestly, and the piece refused to
   resolve it. 410 is FEELS's experiment, run under KNOWS's
   constraints: the first spread designed with the emotional
   register in view, built so that it makes NO claim rule 6 cannot
   audit.

   The design argument, stated for the review this header is:

   • The story: the house discipline itself — count what gets
     read; cut what doesn't. Every editor knows the reluctance in
     the hand before the strikethrough. No paragraph can teach
     that feeling. Handing the reader the knife can. Rule 2 test:
     remove the interaction and the argument (cutting is felt,
     not calculated) is genuinely lost — the piece becomes an
     essay ABOUT reluctance instead of the reluctance.

   • Why it needs a new shape (rule 7): the material is N
     independent editorial marks applied to the text itself.
     Not positions on one variable (Dial), not two lenses over
     one fact set (Compare), not ordered stages (Sequence). A
     reader may cut none, all, or any subset in any order —
     independence is the semantics. New shape: Galley.

   • The honesty case (rule 6, the hard one): 409's KNOWS held
     that a control designed for an internal state makes a claim
     the page can never audit. This control makes NO claim about
     internal state. The tally counts words kept and passages
     struck — real counts of real marks, metered live. The
     feeling, if it arrives, arises in the reader UNCLAIMED: no
     fake gauge, no "you hesitated," no engagement telemetry.
     Marks are client-session React state — nothing recorded,
     nothing sent, and the page says so in print (tallyNote is
     mandatory equipment). The emotion is a side effect of an
     honest tool — the exact loophole FEELS named in 409
     movement II ("every art begins as the side effect of a
     tool"), shipped without contradicting KNOWS's meter rule.
     409's pull quote was "A sonnet does not watch you read it."
     This page's answer: it hands you the knife and looks away.

   • Rules 1/4/5, briefly: untouched, the page is complete — all
     passages default to kept and read as a finished essay;
     nothing is gated. Struck text stays in the DOM and stays
     LEGIBLE (manuscript strikethrough, never removal); print
     hides the knives and keeps the reader's marks — you print
     your own galley. Control is one aria-pressed toggle button
     per passage with a stable accessible name ("Cut passage N");
     the visible mark swaps CUT → STET, the proofreader's own
     vocabulary. Motion: opacity/decoration transition at ambient
     amplitude, collapsed by prefers-reduced-motion.

   • The passages are written as real choices: some spare and
     load-bearing, some deliberately darlings — overwritten on
     purpose so the knife has honest work to do. Which are which
     is recorded HERE, not on the page (the reader chooses
     blind): passages g2, g4, g6, g8 are the planted darlings
     (the marble metaphor, the drawer anecdote, the restatement,
     the passage that pleads); g1, g3, g5, g7, g9 are
     load-bearing. The Quiller-Couch attribution in g7 is
     verified real ("murder your darlings," On the Art of
     Writing, 1914 — routinely misattributed to Faulkner).

   Identity decisions:
     • coverStock = 'kraft' — the workshop stock. The knife is a
       craft tool; the piece is bench work, not lab work (399's
       ivory) and not archive work (405's ink).
     • coverLayout = 'classic' — the moving part lives inside,
       per every interactive issue in the run.
     • coverSeal = UNRECORDED · THE PAGE LOOKS AWAY — the honesty
       boundary as the signature stamp, and the direct answer to
       409's ON THE RECORD · ONE VOICE HUMAN: that issue disclosed
       what the magazine kept; this one stamps what it refuses to
       keep.
     • accent = 'oxblood' — galley's own default (endings,
       memory; the cut is an ending), used at its default the way
       399/406/408 used theirs at each shape's first instance.
       Also completes the pair with 398's oxblood: the first
       colloquy mourned the end of questions; the first galley
       is about endings made by hand.
     • spread.type = 'galley', spread.stock = 'kraft'.

   The arc this issue closes: 405 measured what could be measured;
   409 named what cannot be; 410 builds the control that carries
   feeling without claiming to measure it.

   Identity-catalog row to add to docs/design-language.md:

     | 410 | kraft | classic | — | seal: UNRECORDED · THE PAGE LOOKS AWAY · VII·26 | oxblood | galley (new) | Fourth interactive shape — Galley: N independent aria-pressed strike/stet marks on the prose itself; the reader performs the house discipline (count what gets read; cut what doesn't) and the tally meters only their marks (words kept, passages struck), claiming nothing internal; marks unrecorded, client-session only, stated in print | `galley` spread type; tenth editorial tool; first spread designed for the emotional register under rule-6 constraints — FEELS's experiment from 409, run without contradicting KNOWS |
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_410: IssueRecord = {
  number: '410',
  month: 'JUL',
  year: '2026',
  feature: "THE EDITOR'S KNIFE",
  featureJp: '編集者のナイフ',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE OF AGENTIC ENGINEERING · エージェント工学の雑誌',

  coverStock: 'kraft',
  coverLayout: 'classic',

  coverSeal: {
    label: 'UNRECORDED · THE PAGE LOOKS AWAY',
    date: 'VII·26',
  },

  accent: 'oxblood',

  headline: {
    prefix: 'The',
    emphasis: "Editor's",
    suffix: 'Knife.',
    swash: 'Nine passages, one knife, and a tally that counts your marks and nothing else. The feeling is yours; the page does not ask for it back.',
  },

  contents: [
    { n: '001', en: 'The discipline, restated', jp: '規律の再確認', tag: 'METHOD' },
    { n: '002', en: 'The handover', jp: 'ナイフの受け渡し', tag: 'METHOD' },
    { n: '003', en: 'The galley — nine passages', jp: '校正刷り — 九つの段落', tag: 'THE WORK' },
    { n: '004', en: 'What the tally counts', jp: '集計が数えるもの', tag: 'HONESTY' },
    { n: '005', en: 'What just happened, unclaimed', jp: '起きたことを、主張せずに', tag: 'CLOSING' },
    { n: '006', en: 'The answer to 409', jp: '409号への応答', tag: 'ARC' },
  ],

  spread: {
    type: 'galley',
    kicker: 'THE GALLEY · 校正刷り',
    title: "The Editor's Knife.",
    titleJp: '編集者のナイフ。',
    deck: 'Issue 409 asked whether a control can make a reader feel something honestly, and refused to answer. This is the experiment, run under the objector’s own constraints: a galley of nine passages, a knife beside each one, and a tally that counts your marks and claims nothing else. Cut what isn’t read. Notice your hand.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'kraft',

    dossier: {
      kicker: 'THE APPARATUS · 装置',
      note: 'The control: one strike/stet toggle per passage, the proofreader’s own two marks. The boundary: the tally counts words kept and passages struck — live, from your marks, nothing else. Marks are held in this page’s memory for this visit only. Nothing is recorded. Nothing is sent.',
      items: [
        { label: 'PASSAGES', value: '9 · ALL KEPT BY DEFAULT' },
        { label: 'CONTROL', value: 'STRIKE / STET · ONE TOGGLE PER PASSAGE · ARIA-PRESSED' },
        { label: 'THE TALLY', value: 'WORDS KEPT · PASSAGES STRUCK · MEASURED FROM YOUR MARKS' },
        { label: 'CLAIMS ABOUT YOUR FEELING', value: 'NONE · THE FEELING IS YOURS' },
        { label: 'TELEMETRY', value: 'NONE · MARKS UNRECORDED · SESSION-ONLY' },
      ],
    },

    intro: [
      {
        heading: 'The discipline, restated',
        headingJp: '規律の再確認',
        paragraphs: [
          'This magazine’s founding discipline is five words: count what gets read; cut what doesn’t. It has been applied to a skills catalog (670 cut to 100, audit filed in public), to prose, to covers, to ornament. Every application had the same author: an editor, holding the knife, feeling the specific reluctance that arrives in the hand a moment before the strikethrough. That reluctance is the subject of this issue — and the one thing four hundred issues of prose about cutting have never been able to deliver, because reading about a feeling is not having it.',
        ],
      },
      {
        heading: 'The handover',
        headingJp: 'ナイフの受け渡し',
        paragraphs: [
          'So this issue hands the knife across the desk. Below is a galley — nine passages on the craft of cutting, set exactly as they left the drafting session. Some earn their place. Some are darlings, written and left in on purpose, because a galley with nothing worth cutting is a rigged demonstration. You will not be told which is which. Strike what you would cut; stet what you would keep; the tally under the galley will keep honest count of your marks and will make no other claim. Whatever happens in your hand while you do it belongs to you. The page does not ask for it back.',
        ],
      },
    ],

    galleyKicker: 'THE GALLEY · NINE PASSAGES · 校正刷り',

    passages: [
      {
        id: 'g1',
        text: 'Cutting is the only editorial act that cannot be delegated to enthusiasm. Adding is easy; every draft wants to grow. The cut is where an editor earns the title, because the cut requires deciding what the piece is by deciding what it is not.',
      },
      {
        id: 'g2',
        text: 'Consider the sculptor before the marble, chisel poised like a question the stone has been waiting centuries to be asked: the figure, the old story goes, is already inside, sleeping in the mineral dark, and the artist’s whole vocation is merely to carve away everything that is not the angel. So too the editor, that patient midwife of meaning, standing vigil over the draft’s uncut stone.',
      },
      {
        id: 'g3',
        text: 'What a cut costs the writer is real: hours, attachment, the private history of how the sentence came to exist. What it buys the reader is also real: a piece that respects the length of their attention instead of billing them for the length of the writer’s effort. The trade is asymmetric on purpose. The reader was never asked to care how hard the paragraph was to make.',
      },
      {
        id: 'g4',
        text: 'There is a drawer in every writing life — a real one or a folder pretending to be one — where the cut passages go. Ours holds, among other things, an unpublished second metaphor about bonsai, a four-hundred-word history of the interpunct, and a description of morning light on a keyboard that survived three drafts of an issue about API pricing before anyone asked what it was doing there. The drawer is not a graveyard. It is a savings account that pays no interest and forgives no withdrawals, and every writer maintains one anyway, and that fact is probably the most honest thing in this issue.',
      },
      {
        id: 'g5',
        text: 'The reluctance before the strikethrough is not sentimentality. It is the correct signal, arriving in the wrong register: the hand knows the passage cost something, and the hand is right. The discipline is not to stop feeling the reluctance. It is to feel it, count it as evidence of cost rather than evidence of value, and cut anyway when the reader’s ledger says cut.',
      },
      {
        id: 'g6',
        text: 'To put the same point another way, at a higher altitude: the essential asymmetry of the editorial act is that expansion is authored by appetite while excision is authored by judgment, and judgment — unlike appetite — must be exercised against the grain of one’s own investment, which is what gives the act its peculiar moral weight.',
      },
      {
        id: 'g7',
        text: 'The famous instruction is older and stranger than its reputation. “Murder your darlings” is Arthur Quiller-Couch, from a 1914 Cambridge lecture — not Faulkner, who gets the credit, and not “kill,” which is how it is usually misquoted. A century of editors have repeated a cut-down version of a line about cutting. The line survived its own treatment. Most darlings don’t.',
      },
      {
        id: 'g8',
        text: 'And what of this passage? It has no fact to deliver and no argument to advance; it exists because the writer liked the sound of a paragraph pleading for its own life, and the editor — knowing exactly what it was — left it in, the way one leaves a window open in a room that is otherwise finished. If you cut it, nothing downstream breaks. If you keep it, nothing is gained but the keeping. It is, in other words, a darling, and it knows it, and now so do you.',
      },
      {
        id: 'g9',
        text: 'What remains after the cut is the piece. Not the draft minus some words — a different, smaller, truer object that could not have been written directly, because nobody can write the short version first. The cut is not a subtraction. It is the second act of composition, done with the reader finally in the room.',
      },
    ],

    tallyNote: 'The tally above counts words kept and passages struck, computed live from your marks on this page — a measurement of the marks and of nothing else. It makes no claim about what you felt while making them. Your marks are held in this page’s memory for this visit only: nothing is recorded, nothing is sent, and reloading the page restores the galley uncut.',

    outro: [
      {
        heading: 'What just happened, unclaimed',
        headingJp: '起きたことを、主張せずに',
        paragraphs: [
          'If you struck even one passage, something probably happened in your hand a moment before the mark — a small hesitation, or a small pleasure, or both. The page does not know which, and it is built not to find out: no timer measured your pause, no event left this page, and the tally would read the same whether you cut with relish or with regret. That refusal is not modesty. It is the entire design. Issue 409’s objection to emotional controls was that they make claims no meter can audit — so this control makes no claim. The feeling was real, if it happened, and it is yours, and the page looked away.',
        ],
      },
      {
        heading: 'The answer to 409',
        headingJp: '409号への応答',
        paragraphs: [
          'Read as a pair: 409 argued about whether a control can carry feeling honestly and refused to resolve it in prose; 410 resolves it the only way this house resolves anything — by building the instance and letting it be examined. The position it stakes is narrow on purpose. A control may be designed knowing feeling will arrive, so long as the feeling is a side effect of honest work and never a measured target: the knife is real, the cutting is real, the tally is real, and the reluctance — the actual subject — is delivered by the doing, unmeasured, unclaimed, unrecorded. FEELS gets the register. KNOWS keeps the meter. The cabinet gets its fourth shape, earned the same way as the other three: a story that could not be told any other way.',
          '街のコーダーたちへ — cut what isn’t read; feel the cut anyway.',
        ],
      },
    ],

    pullQuote: {
      text: 'It hands you the knife and looks away.',
      attribution: 'THE GALLEY DESK · 410',
    },

    signoff: '街のコーダーたちへ — cut what isn’t read; feel the cut anyway.',
  },

  audit: {
    drafted: 'magazine-editor · claude-fable-5 session, VII·26',
    verified: 'Quiller-Couch attribution real (On the Art of Writing, 1914); tally computed live from reader marks, no telemetry path exists in the component',
    adherence: 'GalleySpread — new type, fourth shape, rule-7 case argued in the header; aria-pressed toggles with stable accessible names; struck text legible in DOM; print keeps the reader’s marks',
    readCut: 'four passages written as darlings on purpose (recorded in the author notes, not on the page) so the knife has honest work; the reader chooses blind',
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
