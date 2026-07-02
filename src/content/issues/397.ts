/* ──────────────────────────────────────────────────────────────
   ISSUE 397 — JUL 2026
   THE EIGHTEEN DAYS
   十八日間 — 輸出規制がモデルに触れた夏

   The wire story behind 396's chaperone clause. On June 12 the
   US government placed export controls on Claude Fable 5 and
   Claude Mythos 5 — the first such action against a model —
   after a demonstrated jailbreak was used to surface known,
   minor vulnerabilities. Anthropic, unable to verify user
   nationality in real time, suspended both models for everyone.
   Eighteen days later the controls lifted; on July 1 Fable 5
   redeployed globally wearing a new cybersecurity classifier
   (blocking the technique in >99% of cases, refusals rerouted
   to Opus 4.8 with notice), while Mythos 5 — the same machine
   without classifiers — returned only to a vetted set of US
   organisations. Filed the day it came back, ink still wet.

   Why dispatch: dated, plural, reactive — a governance story
   told in datelines. 396 (same month) read the model as a
   contract; 397 files the eighteen days that wrote its
   strangest clause. The pair ships together deliberately: the
   essay is the terms, the dispatch is the news.

   Identity decisions (differentiated from 395's dispatch and
   396's essay):

     • coverStock = 'ink' — the lights went out on the frontier
       model for eighteen days; the suspension register is
       nocturnal/archival. (393 used ink for a forecast; first
       dispatch on ink.)
     • coverLayout = 'asymmetric-left' — the dispatch column
       rhythm, per 368/395.
     • coverSeal = SUSPENDED · RESTORED · VII·26 — the signature
       move: one stamp carrying both verbs, the whole story in a
       rubber circle.
     • accent = 'oxblood' — record-of-record, endings-and-
       returns. Brick is the dispatch default and 395 just used
       it; oxblood is the archival shade of the same family.
     • spread.type = 'dispatch', spread.stock = 'ivory' — the
       filing itself still arrives on wire paper.

   Sources named in prose per the dispatch contract: Anthropic's
   own statements (the suspension statement and "Redeploying
   Claude Fable 5"), CNBC (June 30, controls lifted), trade
   coverage of the July 1 redeploy. Filed fast; the block-rate
   claim is the company's own number, marked as such.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_397: IssueRecord = {
  number: '397',
  month: 'JUL',
  year: '2026',
  feature: 'THE EIGHTEEN DAYS',
  featureJp: '十八日間',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE OF AGENTIC ENGINEERING · エージェント工学の雑誌',

  coverStock: 'ink',
  coverLayout: 'asymmetric-left',

  coverSeal: {
    label: 'SUSPENDED · RESTORED',
    date: 'VII·26',
  },

  accent: 'oxblood',

  headline: {
    prefix: 'The',
    emphasis: 'Eighteen',
    suffix: 'Days.',
    swash: 'A government directive, a frontier model gone dark, and the classifier that brought it back — the first export control ever applied to a model, filed as a wire story.',
  },

  contents: [
    { n: '001', en: 'The directive arrived on a Friday', jp: '金曜日に届いた指令', tag: 'GOVERNANCE' },
    { n: '002', en: 'Capability as contraband', jp: '禁制品としての能力', tag: 'POLICY' },
    { n: '003', en: 'The fix was a classifier', jp: '解決策は分類器だった', tag: 'SAFETY' },
    { n: '004', en: 'Two doors, two experiments', jp: '二つの扉、二つの実験', tag: 'FIELD' },
    { n: '005', en: 'What the wire cannot verify', jp: '電信で確かめられないこと', tag: 'CAUTION' },
    { n: '006', en: 'The reader’s position', jp: '読者の立ち位置', tag: 'DISCIPLINE' },
  ],

  spread: {
    type: 'dispatch',
    kicker: 'DISPATCH · 速報',
    title: 'The Eighteen Days.',
    titleJp: '十八日間。',
    deck: 'On June 12 the United States government export-controlled a language model — the first action of its kind — and the most capable model on the market went dark for everyone. On July 1 it came back wearing a chaperone. What happened in between is the most consequential governance story of the year, and it resolved not with a statute but with a classifier.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'ivory',

    slug: 'KERNEL.CHAT WIRE · 397 · VII·26 · EXPORT CONTROL · SUSPENSION · REDEPLOY · INK STILL WET',

    dateline: 'THE WIRE DESK — JULY 1 — FILED THE DAY THE MODEL CAME BACK.',

    filedAt: '1 JUL 2026 · COVERING 12–30 JUN',
    status: 'FILED',

    partners: [
      { name: 'ANTHROPIC', role: 'suspended both models within the day; trained the classifier; redeployed July 1.' },
      { name: 'US GOVERNMENT', role: 'applied the export controls June 12; lifted them June 30 after review.' },
      { name: 'PROJECT GLASSWING', role: 'the vetted-access door — Mythos 5 returned to a set of US organisations only.' },
    ],

    bridge: {
      issue: '396',
      text: '396 read Fable 5 as a contract and found a chaperone clause in the terms. 397 files the eighteen days that wrote it.',
    },

    intro: 'Every issue of this magazine assumes a quiet premise: the models are there, and the question is what you do with them. For eighteen days in June the premise failed. A demonstration reached the United States government showing a jailbreak of Claude Fable 5 being used to surface security vulnerabilities — previously known ones, minor ones, by the accounts that followed — and on Friday June 12 the government did something it had never done to a model: it applied export controls. What followed was a suspension, a sprint, a classifier, and a two-door redeployment that will be cited in policy papers for a decade. We filed this the day the model came back, from the published statements and the trade wires, before the takes hardened. The ink is still wet.',

    propositions: [
      {
        n: '01',
        overline: 'GOVERNANCE',
        filedAt: 'JUN 12',
        title: 'The directive arrived on a Friday.',
        titleJp: '金曜日に届いた指令',
        body: [
          'The order restricted access by foreign nationals, effective immediately. Anthropic’s statement is plain about the operational bind: there was no reliable way to verify a user’s nationality in real time, and an immediate directive left no runway to build one. So the company turned the model off — for everyone, everywhere, both nameplates. The most capable model on the market became, for eighteen days, a model nobody could rent.',
          'Sit with the precedent before the details. Export controls are the machinery built for centrifuge parts and GPU shipments — physical things that cross borders in crates. On June 12 that machinery reached, for the first time, a thing that crosses borders as an API response. Whatever else the eighteen days settle, they settle this: the state now considers a sufficiently capable model to be the kind of object it controls at the border, and the border is the endpoint.',
        ],
      },
      {
        n: '02',
        overline: 'POLICY',
        filedAt: 'JUN 13',
        title: 'Capability as contraband.',
        titleJp: '禁制品としての能力',
        body: [
          'The stated trigger was narrow: a jailbreak technique, demonstrated against Fable 5, used to identify a small number of previously known, minor vulnerabilities. Read that sentence twice, because both halves matter. The technique was real — real enough to move a government. The harvest was modest — known flaws, minor ones, nothing a competent scanner would have missed. The directive was aimed at what the technique implied, not what it had yet produced.',
          'This is the shape of frontier governance now: the intervention lands on the capability, not the incident. There was no breach to point at, no CVE with this model’s name on it — there was a demonstration and an inference. Agree or not with the call, the mechanism deserves naming, because it inverts the usual burden. The model was suspended not for what it did but for what it could evidently be made to do. Every lab now knows the demonstration alone can be enough.',
        ],
      },
      {
        n: '03',
        overline: 'SAFETY',
        filedAt: 'JUN 30',
        title: 'The fix was a classifier.',
        titleJp: '解決策は分類器だった',
        body: [
          'What lifted the controls was not a court, a treaty, or a statute. It was an artifact: Anthropic trained a new cybersecurity classifier targeting the demonstrated technique, blocking it — by the company’s own account — in more than ninety-nine per cent of cases. A refused request does not simply die; the user is notified and the request is served instead by Opus 4.8, the older flagship. On June 30 the government lifted the controls. On July 1 the model redeployed globally.',
          'Eighteen days from directive to redeployment, resolved by shipping a safety model. The precedent inside the precedent: a national-security directive was satisfied by a classifier — a piece of the safety stack, auditable in principle, adjustable in a training run. That is a far faster loop than law, and both parties now know it works. Expect it to be the template: not "take the model down" as the end state, but "take it down until the wrapper catches up."',
        ],
      },
      {
        n: '04',
        overline: 'FIELD',
        filedAt: 'JUL 01',
        title: 'Two doors, two experiments.',
        titleJp: '二つの扉、二つの実験',
        body: [
          'The redeployment split the offering in two. Fable 5, classifiers on, is generally available to anyone with a key. Mythos 5 — the same machine without the classifiers — returned only to a vetted set of US organisations under Project Glasswing, with expansion to broader domestic and international partners still being negotiated. Same weights, same price. The difference is the wrapper and the guest list.',
          'Look at what is actually being run here: the two competing theories of frontier containment, side by side, on the same model. Door one is technical control — let everyone in, screen every request. Door two is access control — screen the people, trust the requests. Anthropic is now operating both arms of the experiment simultaneously, and the telemetry from each will shape how every future frontier model ships. No policy paper could have designed a cleaner trial.',
        ],
      },
      {
        n: '05',
        overline: 'CAUTION',
        filedAt: 'JUL 01',
        title: 'What the wire cannot verify.',
        titleJp: '電信で確かめられないこと',
        body: [
          'The ninety-nine per cent figure is the company’s own, measured against the demonstrated technique. The number that matters is a different one: the block rate against the technique’s descendants, which began evolving the moment the classifier shipped. A published defence is an invitation, and the world’s most motivated red team is now probing a wrapper whose existence is a headline. Nobody — including, we suspect, the classifier team — knows that curve yet.',
          'The other unknown runs the opposite direction: the false-positive rate on legitimate defensive work. The classifier that blocks the jailbreak also patrols the neighbourhood where ordinary security engineering lives — the dependency audit, the CVE triage, the fuzzing run against your own service. Every wrongly refused Tuesday is a working engineer bounced to the older model, and enough of them is how a frontier tool quietly loses the field it was pointed at. Both curves are empirical. Neither is in the press release. File this stake as: watch.',
        ],
      },
      {
        n: '06',
        overline: 'DISCIPLINE',
        filedAt: 'JUL 01',
        title: 'The reader’s position.',
        titleJp: '読者の立ち位置',
        body: [
          'For the reader who pays with their own key, the eighteen days translate to plumbing, and the plumbing is now doctrine. Anthropic’s own redeployment routes refusals to Opus 4.8 with notice — which is to say the first-party surfaces now do exactly what a well-built terminal agent should have done all along: pre-arrange the fallback, name the model that actually answered, never let a refusal masquerade as an empty result. Our own agent shipped that wiring the morning the model came back. The commit predates this filing by a few hours, which is the only kind of luck this desk respects: the kind you built before you knew you needed it.',
          'And the ledger from 396 gains a line nobody priced in: availability itself is now a variable. The most capable model on the market went dark for eighteen days by government directive, and the customers who felt it least were the ones whose daily work never depended on it — the local-first, the multi-tier, the ones for whom the frontier model was a drawer and not a foundation. Route local first. Spend where it earns. And build for the day the drawer is empty, because now we know it can be.',
        ],
      },
    ],

    bulletin: {
      text: 'A national-security directive was satisfied by a classifier. Both parties now know that loop works.',
      attribution: 'KERNEL.CHAT · DISPATCH · 397',
    },

    outro: 'File this beside 396 — the terms and the news, one month, one model. The parts of this dispatch that will hold are the structural ones: the border reached the endpoint, the capability was treated as contraband, the wrapper satisfied the state, and the field is now a two-door experiment running live. The block-rate and false-positive curves are being drawn as we go to press, by adversaries and defenders respectively, and neither party publishes. We will read what we can from the fallback telemetry and file again when the curves show their shape.',

    signoff: '街のコーダーたちへ — build for the day the drawer is empty; it has already happened once.',

    terminator: 'END OF DISPATCH · KERNEL.CHAT/397 · FILED 1 JUL · COVERING 12–30 JUN · INK STILL WET',
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
