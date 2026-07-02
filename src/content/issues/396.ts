/* ──────────────────────────────────────────────────────────────
   ISSUE 396 — JUL 2026
   THE PRICE OF THINKING
   思考の値段 — 台帳で読む新型モデル

   Anthropic shipped Claude Fable 5 — its most capable widely
   released model — at twice the flagship rate, with thinking
   that cannot be switched off, reasoning that is never shown,
   a thirty-day retention requirement stamped on every request,
   and safety classifiers that can decline security work outright.
   Every other publication filed it as a capability story. This
   magazine files it as a ledger story: what the machine costs,
   what the invoice hides, and when the premium is earned.

   Why essay and not dispatch: 395 was a wire filing — seven
   dated stakes against a deadline. 396 is a single argument
   about one model, read through one instrument (the ledger),
   with a pricing table where a dispatch would put a bulletin.
   The material is an argument, not a week.

   Identity decisions:

     • coverStock = 'ledger' — the audit register (introduced
       372: THE AUDIT). The cover IS the invoice. First use
       since the audit era; nothing else on the shelf says
       "read the numbers first" the way graph-ruled stock does.
     • coverLayout = 'classic' — the numbers carry it; the
       composition should not compete.
     • coverSeal = RETAINED · 30 DAYS — the signature move. The
       rubber stamp literalises the model's retention clause:
       this issue, like every prompt sent to the model it
       covers, is stamped with how long it will be kept.
     • accent = 'pool' — systems, terminal, code. The reader
       who pays for their own tokens is the reader this issue
       is for.
     • spread.type = 'essay', with dossier (the spec sheet as
       methods front-matter), dataBlock (THE LEDGER), and pull
       quote. spread.stock = 'ledger' carries the audit paper
       through the body.

   Facts are per Anthropic's published model documentation
   (platform.claude.com, June 2026): $10/$50 per MTok, 1M
   context, 128K max output, always-on thinking with summaries
   only, stop_reason "refusal" with opt-in fallback, 30-day
   retention floor. The sibling nameplate claude-mythos-5
   (Project Glasswing) is the same machine behind a second door.

   Revised same-day (2026-07-01, evening): §4 gained its origin
   paragraph and the dossier a STATUS row after the fuller story
   surfaced — the model spent June 12–30 under a US export-control
   directive and redeployed July 1 with a new cyber classifier.
   The suspension itself is ISSUE 397's wire filing (THE EIGHTEEN
   DAYS); 396 keeps the ledger frame and notes the clause.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_396: IssueRecord = {
  number: '396',
  month: 'JUL',
  year: '2026',
  feature: 'THE PRICE OF THINKING',
  featureJp: '思考の値段',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE OF AGENTIC ENGINEERING · エージェント工学の雑誌',

  coverStock: 'ledger',
  coverLayout: 'classic',

  coverSeal: {
    label: 'RETAINED · 30 DAYS',
    date: 'VII·26',
  },

  accent: 'pool',

  headline: {
    prefix: 'The',
    emphasis: 'Price',
    suffix: 'of Thinking.',
    swash: 'Anthropic ships its most capable model at twice the flagship rate — deliberation always on, reasoning never shown, retention stamped on the invoice. A ledger reading.',
  },

  contents: [
    { n: '001', en: 'The spec sheet reads like a dare', jp: '仕様書は挑戦状', tag: 'MODELS' },
    { n: '002', en: 'Reasoning you pay for but never read', jp: '読めない思考への支払い', tag: 'LEDGER' },
    { n: '003', en: 'Thirty days, stamped', jp: '三十日保存の印', tag: 'GOVERNANCE' },
    { n: '004', en: 'The chaperone clause', jp: '付き添い条項', tag: 'SAFETY' },
    { n: '005', en: 'When the premium is earned', jp: '割増に値する仕事', tag: 'DISCIPLINE' },
  ],

  spread: {
    type: 'essay',
    kicker: 'THE LEDGER · 台帳',
    title: 'The Price of Thinking.',
    titleJp: '思考の値段。',
    deck: 'Claude Fable 5 is the most capable model you can rent, and the first one whose spec sheet reads like a set of terms rather than a set of features. Thinking you cannot switch off. Reasoning you will never read. A retention clause with no opt-out. Read it the way you would read any contract — ledger first.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'ledger',

    dossier: {
      kicker: 'SPEC SHEET · 仕様',
      note: 'Per the published model documentation, June 2026. The sibling nameplate claude-mythos-5 carries identical terms.',
      items: [
        { label: 'MODEL', value: 'claude-fable-5' },
        { label: 'RATE', value: '$10 IN · $50 OUT / MTOK' },
        { label: 'CONTEXT', value: '1,000,000 TOKENS · DEFAULT' },
        { label: 'THINKING', value: 'ALWAYS ON · SUMMARIES ONLY' },
        { label: 'RETENTION', value: '30 DAYS · NO ZERO-RETENTION PATH' },
        { label: 'REFUSAL', value: 'HTTP 200 · FALLBACK IS OPT-IN' },
        { label: 'STATUS', value: 'SUSPENDED VI·12 · RESTORED VII·1' },
      ],
    },

    sections: [
      {
        heading: 'The spec sheet reads like a dare',
        headingJp: '仕様書は挑戦状',
        paragraphs: [
          'Every model release gets filed the same way: the benchmark chart, the demo reel, the adjective. Claude Fable 5 earned its adjectives — it is, by its maker’s account and by early hands-on reports, the most capable model Anthropic has widely released, built for the long-horizon work where a single request can run many minutes and come back with something finished. The capability story has been written a hundred times this week. It is not the interesting story.',
          'The interesting story is on the rate card. Ten dollars per million tokens in, fifty out — double Opus 4.8, the model that was the ceiling until now, and it sits above that model in the catalog the way a specialist sits above a house doctor: available, priced to make you think, and wrong for most days. The context window is a million tokens by default. The output ceiling is 128,000. Nothing about those numbers says everyday driver. Everything about them says: bring a problem worthy of the invoice.',
          'There is a second door to the same room — claude-mythos-5, the identical machine under a program nameplate, reachable only through Project Glasswing. Same rates, same terms, same clauses. The magazine notes it for the provenance file and moves on.',
        ],
      },
      {
        heading: 'Reasoning you pay for but never read',
        headingJp: '読めない思考への支払い',
        paragraphs: [
          'Fable 5 thinks on every request. This is not a mode; it is the machine. Ask the interface to switch deliberation off and the request itself is rejected — an error, not a preference. The dial you are given instead is called effort, and it goes from low to max, which is to say: you may choose how hard it thinks, but not whether.',
          'Here is the clause under the clause: the thinking is never shown. The raw chain of reasoning — the thing you are paying deliberation rates for — does not come back. You may request a summary, readable and tidy. You may take silence. Those are the options. The tokens spent deliberating land on your invoice either way, at fifty dollars the million, itemised as output you will never see.',
          'Sit with what that does to trust. The previous era’s answer to "why should I believe the machine" was: read its working. This era’s answer is: read its result, and audit that. The working has become a trade secret you rent by the token. For an engineering culture that spent two years learning to read reasoning traces the way editors read galley proofs, this is a real loss — and, the magazine suspects, a durable one. The audit moves downstream, from the reasoning to the artifact. Verification is no longer a courtesy the model extends. It is a discipline the reader supplies.',
        ],
      },
      {
        heading: 'Thirty days, stamped',
        headingJp: '三十日保存の印',
        paragraphs: [
          'The retention clause is the part the launch coverage skipped. Fable 5 requires that your organisation retain data for thirty days. There is no zero-retention path — an organisation configured for zero retention does not get a degraded service, it gets a refusal to serve at all: an error on every request, however valid the payload. Privacy posture, in other words, is now a compatibility requirement. The most capable model on the market will not speak to the most careful customers on it.',
          'For the reader who pays with their own key — this magazine’s reader — the stamp lands differently than it does for an enterprise. Bring-your-own-key was always a contract about custody: your key, your bill, your data’s disposition. Fable 5 amends the contract unilaterally. Use this model and your prompts are retained for thirty days, full stop; the only choice left is whether to use the model. The honest move for any tool that routes work to it is to say so before the first token is sent — out loud, in the terminal, where the decision is being made. Quiet compliance is the failure mode.',
        ],
      },
      {
        heading: 'The chaperone clause',
        headingJp: '付き添い条項',
        paragraphs: [
          'The chaperone has a date of birth. On June 12 the United States government placed export controls on this model after a demonstrated jailbreak was used to surface known, minor vulnerabilities — and Anthropic, unable to verify nationality in real time, suspended it for everyone. It came back on the first of July wearing a new cybersecurity classifier, trained against the technique, blocking it — by the company’s account — in better than ninety-nine cases of a hundred. The full wire filing is the next issue’s work. The clause it left in the terms is this issue’s.',
          'Fable 5 ships with classifiers that can decline a request outright — most cybersecurity work and research biology, by the published documentation. The decline is polite and structurally strange: the request succeeds, as far as the wire is concerned. Status 200. What comes back is a stop reason that says refusal, and either nothing (declined before output, unbilled) or a partial answer you are told to discard (declined mid-sentence, billed for the sentence). The ledger records even the refusals precisely.',
          'The documentation is candid that benign adjacent work can trip the wire — the defender auditing a dependency, the researcher fuzzing their own service. Recovery exists, but it is opt-in: you may pre-arrange a fallback, so that a declined request is quietly re-served by Opus 4.8 inside the same call, repriced to the older model’s rates. Arrange nothing and the request simply ends there.',
          'So the most capable model available comes with a chaperone, and the chaperone’s judgement is part of the terms. For the working security engineer this is a real operational fact: the frontier machine may decline your Tuesday. The craft response is not outrage; it is plumbing. Pre-arrange the fallback. Surface which model actually answered. Never let a refusal masquerade as an empty result. The tools that do this well will be the ones security people keep.',
        ],
      },
      {
        heading: 'When the premium is earned',
        headingJp: '割増に値する仕事',
        paragraphs: [
          'None of this is an argument against the machine. It is an argument for a drawer. A scalpel is not a worse knife because you would not butter toast with it; it is a better knife that lives in a specific drawer and comes out for specific work. Fable 5 at twice the flagship rate is earned exactly when better first-pass reasoning collapses a week of iteration into an afternoon — the forty-file audit for the concurrency bug nobody can reproduce, the migration that has to be right the first time, the overnight run you will not be awake to correct. On that work, the premium is cheap.',
          'The discipline is the routing, and the routing is a ladder this publication has been climbing all year: local when free — the models on your own machine cost nothing and handle the daily paragraph-and-patch work honestly; the house flagship when the cloud earns it; and the specialist above that, opted into deliberately, for the tasks whose failure costs more than the invoice. Our own agent wired the new model in this week under precisely those terms — in the catalog, never the default, retention notice printed before the first call, fallback pre-arranged for the security tools. The commit cites the numbers. That is the whole method.',
          'Count what gets read; cut what doesn’t. The same discipline that runs this magazine’s catalog runs a token budget. The most capable model you can rent is real, and it is very good, and most mornings you should not use it — not because the capability is hype, but because capability was never the question. The question is the one the ledger asks: what did this line buy, and would the cheaper line have bought it. Ask that every time and the drawer opens exactly as often as it should.',
        ],
      },
    ],

    pullQuote: {
      text: 'You pay for the thinking. You read the summary. The audit moves from the reasoning to the invoice.',
      attribution: 'THE LEDGER DESK · 396',
    },

    dataBlock: {
      kicker: 'THE LEDGER · 台帳',
      heading: 'One model, four numbers',
      headingJp: '一台のモデル、四つの数字',
      afterSection: 1,
      stats: [
        { n: '×2', label: 'the premium over Opus 4.8 — $10/$50 against $5/$25 per million tokens', labelJp: '旗艦モデル比二倍', source: 'platform.claude.com' },
        { n: '$50', label: 'per million output tokens — deliberation included, and invisible', labelJp: '出力百万トークンあたり' },
        { n: '30', label: 'days of required retention — there is no zero-retention path', labelJp: '保存義務・三十日' },
        { n: '200', label: 'the HTTP status of a refusal — the decline arrives as a success', labelJp: '拒否も二〇〇で届く' },
      ],
    },

    signoff: '街のコーダーたちへ — route local first, spend where it earns, and read the invoice like a spec.',
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
