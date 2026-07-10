/* ──────────────────────────────────────────────────────────────
   ISSUE 406 — JUL 2026
   ONE DAY, TWO READINGS
   一日、二つの読み方 — 七号を出した日をどう読むか

   The eighth editorial tool, and the second interactive spread —
   the first to use a genuinely different control shape from the
   Dial (instrument, 399/405). The material: this magazine shipped
   seven issues (400–406, this one included in its own accounting)
   in a single working session. Is that the typed-content pipeline
   working exactly as 393 argued — cadence without heroics — or is
   it a volume of unreviewed output that avoided real damage only
   because a security audit and a synthesis-error catch happened to
   land the same day? Both readings survive contact with the actual
   facts. Neither is declared the winner.

   Why a new tool and not the Dial: a dial's stops are POSITIONS ON
   ONE VARIABLE — depth, effort, degree. SPEED and RISK are not
   positions on a spectrum between them; there is no "medium" that
   is 60% speed and 40% risk that means anything. They are two
   complete, independent lenses over the same five facts, and a
   reader who wants the SPEED reading gets all five facts read that
   way, not a blend. That is a switch, not a dial — a different
   interaction primitive, not a relabeled one. Per
   docs/interaction-language.md rule 7 (two instances before a
   pattern extracts), this is instance ONE of Compare; no shared
   machinery is pulled out until a second story needs a switch too.

   The five facts are real and dated 2026-07-03/04, drawn from this
   press week's own operational record: the deaf-socket incident
   (401), the world-readable log file (404), the hover-reveal error
   in kbot's research synthesis (surfaced and corrected before
   shipping, this same day), the mistral misfire in 405's instrument,
   and the verification-phase failure of the interaction-language
   research workflow (0/25 claims adversarially confirmed; 18 agents
   completed with quote-grounded but unverified claims). No fact is
   invented for symmetry — the SPEED and RISK readings are argued
   as strongly as this desk could argue each, and left unresolved.

   Identity decisions (distinct from 399/405, the two Dial issues —
   ivory/pool and ink/brick — and from the rest of this press week):
     • coverStock = 'butter' — daylight, hospitality register. A
       genuinely undecided piece should not read as an alarm (ink)
       or a lab receipt (ledger) before the reader opens it.
     • coverLayout = 'classic' — the switch lives inside the spread.
     • coverSeal = UNRESOLVED · BY DESIGN — the signature move: the
       piece's refusal to pick a winner, stamped as a deliberate
       choice rather than an omission.
     • accent = 'ivy' — the one seed in the cabinet not yet used
       this press week; chosen for having no prior charge in either
       direction (not pool's systems-alarm, not brick's archival
       weight, not cobalt's declaration-clarity) — a neutral ground
       for a piece that argues both sides.
     • spread.type = 'compare', spread.stock = 'butter'.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_406: IssueRecord = {
  number: '406',
  month: 'JUL',
  year: '2026',
  feature: 'ONE DAY, TWO READINGS',
  featureJp: '一日、二つの読み方',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',

  coverStock: 'butter',
  coverLayout: 'classic',

  coverSeal: {
    label: 'UNRESOLVED · BY DESIGN',
    date: 'VII·26',
  },

  accent: 'ivy',

  headline: {
    prefix: 'One',
    emphasis: 'Day',
    suffix: ', Two Readings.',
    swash: 'Seven issues in one session — proof the pipeline works, or a volume of output that got lucky. The same five facts, flipped by a switch, argued both ways on purpose.',
  },

  contents: [
    { n: '001', en: 'A dial could not hold this', jp: '目盛りでは測れない', tag: 'METHOD' },
    { n: '002', en: 'The deaf socket, twice read', jp: '沈黙のソケット、二読', tag: 'FACT' },
    { n: '003', en: 'The log file nobody meant to expose', jp: '誰も晒すつもりのなかった記録', tag: 'FACT' },
    { n: '004', en: 'The error a review step caught', jp: '査読が捕らえた誤り', tag: 'FACT' },
    { n: '005', en: 'The instrument that failed on camera', jp: '目の前で失敗した計器', tag: 'FACT' },
    { n: '006', en: 'The verification that verified nothing', jp: '何も検証しなかった検証', tag: 'FACT' },
  ],

  spread: {
    type: 'compare',
    kicker: 'THE SWITCH · 二読',
    title: 'One Day, Two Readings.',
    titleJp: '一日、二つの読み方。',
    deck: 'Seven issues shipped from one working session, this one among them. Read as speed, it is the typed-content pipeline doing exactly what 393 promised — cadence without heroics. Read as risk, it is a volume of output that avoided real damage because a security audit and a synthesis-error catch happened to land the same day. Both readings survive the same five facts. Flip the switch.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'butter',

    intro: [
      {
        heading: 'A dial could not hold this',
        headingJp: '目盛りでは測れない',
        paragraphs: [
          'This magazine’s first instrument (399) asked how hard to think, and the honest answer was a spectrum — low to max, five stops on one variable. The question underneath this issue has no spectrum. Whether today was disciplined or risky is not a matter of degree; there is no reading of the day that is sixty per cent speed and forty per cent risk in any way that means something. There are two complete accounts of the same five facts, and a reader who wants the speed account should get all five facts read that way — not a blend. That is a switch. This is the first time the material demanded one.',
        ],
      },
    ],

    lenses: [
      {
        id: 'speed',
        label: 'SPEED',
        labelJp: '速度',
        stance: 'The typed-content pipeline is working exactly as designed — cadence without heroics, errors caught by the process built for that purpose.',
      },
      {
        id: 'risk',
        label: 'RISK',
        labelJp: '危険',
        stance: 'Volume is not evidence of correctness — every one of today’s catches was a near miss that a slower day might have prevented outright.',
      },
    ],

    defaultLens: 'speed',

    facts: [
      {
        fact: 'A Socket Mode connection ran for hours believing itself live before anyone discovered it was deaf.',
        factJp: 'ソケットモード接続は、誰かが気づくまで何時間も自分は生きていると思い込んでいた。',
        readingA: 'Discovered and fixed the same afternoon, then written up as a standing doctrine (401) so no future session repeats it. The loop from failure to permanent lesson took under a day.',
        readingB: 'It was live and silently useless for hours before a human happened to test it. Nothing in the architecture would have surfaced the gap on its own; the catch was timing, not design.',
      },
      {
        fact: 'A security audit found the bot’s log file was world-readable and about to carry real client conversations.',
        factJp: 'セキュリティ監査が、実際の顧客の会話を記録し始める直前のログファイルが誰でも読める状態にあることを発見した。',
        readingA: 'Caught before a single client message was logged, by an audit run specifically because the surface was new — the process worked exactly when it mattered.',
        readingB: 'It shipped world-readable in the first place. The audit is a good backstop; a backstop is not the same claim as "this would not have happened on a slower day."',
      },
      {
        fact: 'A local model, asked to synthesize research into recommendations, proposed a hover-reveal interaction that violated the very sources it was citing.',
        factJp: 'ローカルモデルは研究を統合するよう求められ、引用元の資料そのものに反する「ホバー表示」の操作を提案した。',
        readingA: 'A review step existed, caught it before it reached a file, and the error is now documented in this desk’s working knowledge of what free local synthesis is and is not good for.',
        readingB: 'A confidently wrong recommendation reached a human review step at all, on a day with dozens of decisions moving through the same pipeline. Not every wrong recommendation gets caught; this one did.',
      },
      {
        fact: 'The cheapest tier of a live, published instrument (405) did not answer the question it was asked.',
        factJp: '実際に公開された計器（405号）の最安層は、問われた質問に答えなかった。',
        readingA: 'Printed verbatim rather than hidden — the instrument is more honest for including its own failure, which is exactly the honesty rule this magazine holds itself to.',
        readingB: 'A live editorial instrument shipped to readers with one of its four stops non-functional. Honesty about a defect is not the same as the defect not existing.',
      },
      {
        fact: 'A research workflow’s verification phase failed completely — zero of twenty-five claims were adversarially confirmed before the run was cut off.',
        factJp: '研究ワークフローの検証段階は完全に機能せず、二十五件の主張のうち一件も敵対的検証を通過しなかった。',
        readingA: 'The failure was infrastructure (a rate limit), not the claims themselves — the raw, quote-grounded extractions were still usable, and every downstream use of them was labelled "sourced, not confirmed." Degradation, not collapse.',
        readingB: 'An entire verification layer produced nothing, and the day’s published work went ahead anyway on unverified claims with a disclosure label standing in for the verification that did not happen. A label is not a check.',
      },
    ],

    outro: [
      {
        heading: 'The verdict this piece declines to give',
        headingJp: 'この記事があえて出さない結論',
        paragraphs: [
          'A colloquy (398) stages two voices because the material was a conversation with no single author. A compare stages two lenses because the material is a single day with no single true reading. Both are honest forms for material that resists collapsing into one voice — the dishonest move here would have been picking a side and writing the other one as a strawman. Every reading above was argued as hard as this desk could argue it.',
          'If a verdict is wanted anyway: the pattern across all five facts is that every catch was real and every catch was also, on inspection, closer to luck-of-timing than to a designed guarantee. That is not a resolution. It is the shape of the actual evidence, and it is why this issue has a switch instead of a headline.',
        ],
      },
    ],

    pullQuote: {
      text: 'Every catch was real, and every catch was closer to luck than to a guarantee. That is not a resolution.',
      attribution: 'THE SWITCH DESK · 406',
    },

    signoff: '街のコーダーたちへ — hold both readings at once; the day was actually both.',
  },

  audit: {
    drafted: 'magazine-editor · claude-sonnet-5 session, VII·26',
    adherence: 'CompareSpread — new type, first instance, role="switch" per interaction-language.md',
    readCut: 'five facts, all real and dated · no fact invented for symmetry',
    pressed: 'VII·26 · the same day the facts describe',
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
