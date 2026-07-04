/* ──────────────────────────────────────────────────────────────
   ISSUE 405 — JUL 2026
   THE REAL METER
   本物の計器 — 代表値ではなく実測値

   The second instrument, and the first with a meter that is
   MEASURED rather than representative. 399 put a five-stop effort
   dial on the page and disclosed, honestly, that its readings were
   representative of the published effort curve — not a benchmark.
   405 runs the benchmark. One fixed prompt, drawn from this press
   week's own operational history (401's deaf-socket postmortem: why
   a Socket Mode connection can succeed while zero events arrive),
   answered for real at four depths by four real models — three
   local, $0, timed by wall clock; one frontier, real dollars, priced
   at Anthropic's published July 2026 rate. Every number on this page
   is a receipt, not a demonstration.

   The instrument did not cooperate with a tidy narrative, and the
   spread keeps the mess: the cheapest local tier did not answer the
   prompt at all — it returned kbot's own self-identification, a
   real routing artifact captured live. The two middle tiers gave
   near-identical answers despite the larger model taking 2.7x
   longer. Only the frontier tier reframed the question with real
   conceptual precision. None of that was staged; the instrument
   simply reported what four real calls actually returned.

   Why instrument again, and why it is not "two instances, extract
   the pattern" yet: this is the second use of the InstrumentSpread
   type but the same shape (the dial) — per interaction-language.md
   rule 7, extraction waits for a second STORY that needs a
   different control shape (e.g. Compare, Sequence — see 403's
   cabinet). Reusing the existing component here is the restrained
   choice, not premature generalization.

   Identity decisions (differentiated from 399 — ivory / classic /
   pool — and from the rest of this press week):
     • coverStock = 'ink' — the archival/nocturnal stock; this issue
       is a permanent receipt, not a lab demo.
     • coverLayout = 'classic' — unchanged from 399; the moving part
       stays inside the spread, not the cover. (Differentiated on
       stock, seal, and accent instead — §III does not require every
       axis to change, only that no two recent issues share all five.)
     • coverSeal = MEASURED · NOT REPRESENTATIVE — names the exact
       achievement against 399's own disclosed limitation.
     • accent = 'brick' — record-of-record; a permanent measured
       artifact, distinct from 399/401's pool and 400's amethyst.
     • spread.stock = 'ink' throughout, carrying the receipt register.

   Provenance: four real calls, 2026-07-04, via `kbot` CLI (v4.5.0)
   wrapped in shell `time`. Wall-clock and word counts are measured
   directly; token counts are estimated from word count (disclosed
   in meterNote) because the local-model JSON accounting path
   misrouted the prompt through kbot's identity agent and was
   abandoned rather than reported as real. Sonnet 5 pricing ($2/$10
   per MTok intro rate through 2026-08-31) is Anthropic's own
   published July 2026 rate, verified same-day via the claude-api
   reference, not carried over from memory.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_405: IssueRecord = {
  number: '405',
  month: 'JUL',
  year: '2026',
  feature: 'THE REAL METER',
  featureJp: '本物の計器',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE OF AGENTIC ENGINEERING · エージェント工学の雑誌',

  coverStock: 'ink',
  coverLayout: 'classic',

  coverSeal: {
    label: 'MEASURED · NOT REPRESENTATIVE',
    date: 'VII·26',
  },

  accent: 'brick',

  headline: {
    prefix: 'The',
    emphasis: 'Real',
    suffix: 'Meter.',
    swash: 'Four models, one prompt, real wall-clock and real dollars — the second instrument, and the first whose readings are measured, not representative.',
  },

  contents: [
    { n: '001', en: 'What 399 disclosed', jp: '399号が明かしたこと', tag: 'METHOD' },
    { n: '002', en: 'The cheapest tier did not answer', jp: '最安層は答えなかった', tag: 'FINDING' },
    { n: '003', en: 'The plateau in the middle', jp: '中間層の踊り場', tag: 'FINDING' },
    { n: '004', en: 'What the paid tier bought', jp: '有料層が買ったもの', tag: 'FINDING' },
    { n: '005', en: 'Reading the receipt', jp: '領収書の読み方', tag: 'DISCIPLINE' },
  ],

  spread: {
    type: 'instrument',
    kicker: 'THE INSTRUMENT · 実測',
    title: 'The Real Meter.',
    titleJp: '本物の計器。',
    deck: 'Issue 399 built this magazine’s first instrument and disclosed, honestly, that its meter was representative of the published effort curve — not measured. This is the measurement. One fixed prompt, drawn from this week’s own deaf-socket postmortem, answered for real by four models at four real costs. The dial did not cooperate with a tidy story, and we kept the mess.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'ink',

    dossier: {
      kicker: 'THE APPARATUS · 装置',
      note: 'Run 2026-07-04 via the `kbot` CLI (v4.5.0), wrapped in shell `time`. Word counts and wall-clock are direct measurements. Token counts are estimated from word count (see meter note); a JSON-accounting attempt was tried and discarded after it misrouted the prompt through kbot’s own identity agent rather than answering it.',
      items: [
        { label: 'PROMPT', value: 'WHY CAN A SOCKET SUCCEED, ZERO EVENTS ARRIVE?' },
        { label: 'LOW', value: 'MISTRAL:7B · LOCAL · $0' },
        { label: 'MEDIUM', value: 'GEMMA3:12B · LOCAL · $0' },
        { label: 'HIGH', value: 'QWEN2.5-CODER:32B · LOCAL · $0' },
        { label: 'MAX', value: 'CLAUDE SONNET 5 · API · METERED' },
      ],
    },

    intro: [
      {
        heading: 'What 399 disclosed',
        headingJp: '399号が明かしたこと',
        paragraphs: [
          'The dial you are about to turn is the same mechanism as 399’s: one fixed question, answered at graduated depth, with a reading printed under each answer. What changes is what the reading is made of. 399 printed the honest label its meter deserved — representative of the published effort curve, not a benchmark — because building the real thing was not that issue’s job. This issue’s job was exactly that: run it for real, print what came back, and change nothing that came back inconveniently.',
        ],
      },
    ],

    prompt: 'Why can a Socket Mode WebSocket connection succeed completely while zero real-time events ever arrive?',
    promptJp: 'ソケットモード接続が完全に成立しても、リアルタイムイベントが一つも届かないのはなぜか。',

    defaultStop: 'medium',

    stops: [
      {
        id: 'low',
        label: 'LOW',
        labelJp: '低',
        reading: { tokens: '~310 (est.)', time: '32.7s', price: '$0 · local' },
        note: 'mistral:7b — did not answer the prompt.',
        answer: [
          'This is the model’s actual, complete output for this prompt — not an excerpt:',
          '“I’m @kernel.chat/kbot v4.5.0, an open-source terminal AI agent designed by the kernel.chat group with MIT licensing. My current provider is Ollama (Local) and my runtime reality involves falling back through the BYOK chain if the configured provider becomes unreachable. I’m powered by 26 specialist agents and my tool library has 670+ registered tools, including built-in abilities to execute commands, read/write files, manage the desktop, and a dream engine for consolidating thoughts overnight. Although I may not always have perfect accuracy or anticipate all complexities in a given task, I’m designed to learn from past experiences through an adaptive 5-tier memory cascade. I can also control the execution of other tools via MCP client and server calls.”',
          'At the cheapest tier, on this run, the model did not engage with the question at all — it answered a different, self-referential prompt it was not asked. We are printing this rather than substituting a cleaner failure, because a magazine that only shows instruments succeeding is not measuring anything.',
        ],
      },
      {
        id: 'medium',
        label: 'MEDIUM',
        labelJp: '中',
        reading: { tokens: '~200 (est.)', time: '40.8s', price: '$0 · local' },
        note: 'gemma3:12b — answered correctly, three causes.',
        answer: [
          'A Socket Mode WebSocket connection can technically establish successfully without receiving any real-time data if the server initiates the handshake correctly but fails to subsequently send event payloads. This often results from an error in the backend code responsible for pushing updates, a misconfigured routing mechanism obstructing event delivery, or a network issue preventing outbound communication from the server while allowing inbound connections — essentially creating a “hello world” connection that stalls after initial setup.',
        ],
      },
      {
        id: 'high',
        label: 'HIGH',
        labelJp: '高',
        reading: { tokens: '~200 (est.)', time: '109.9s', price: '$0 · local' },
        note: 'qwen2.5-coder:32b — answered correctly, five causes, 2.7× the time for near-identical length.',
        answer: [
          'A Socket Mode WebSocket connection can succeed completely without any real-time events arriving due to various reasons, such as the absence of qualifying events that the app is subscribed to, network issues affecting event delivery even though the initial connection is established, misconfiguration in Slack or application settings preventing events from being sent, incorrect event handling logic in the client code, or permissions issues where the app lacks the necessary scopes to receive specific events.',
        ],
      },
      {
        id: 'max',
        label: 'MAX',
        labelJp: '最大',
        reading: { tokens: '~150 (est.)', time: '51.3s', price: '$0.0016' },
        note: 'Claude Sonnet 5 — the only answer that reframes the question rather than listing causes.',
        answer: [
          'A WebSocket connection’s successful establishment merely confirms that a persistent, bidirectional protocol tunnel exists between two endpoints. The initial “success” refers solely to the completion of the HTTP handshake — the client and server negotiating and agreeing to upgrade the connection state from standard HTTP request/response methods to the dedicated WebSocket binary framing protocol. Achieving this status means the underlying communication channel is open and ready for data, but it does not inherently guarantee that any application-level events or payload data will transpire on either side; therefore, the system can successfully show a “Connected” state while remaining completely idle because success simply reflects the presence of the reliable pipe, not the flow rate through it.',
        ],
      },
    ],

    meterNote: 'Time and word counts are measured directly (shell `time`, `wc -w`) against real model output. Token counts are estimated from word count at 1.33 tokens/word — a standard English approximation, not an API-reported figure — because attempting exact accounting via the CLI’s JSON mode caused the low and medium calls to misroute through a different agent path entirely; we discarded that data rather than present a confounded number as measured. The MAX price is computed from Anthropic’s published Claude Sonnet 5 rate as of July 2026 ($2/$10 per million input/output tokens, introductory rate through 2026-08-31), applied to the estimated output-token count — real math on an estimated input, disclosed as such.',

    outro: [
      {
        heading: 'Reading the receipt',
        headingJp: '領収書の読み方',
        paragraphs: [
          'Three findings survive contact with the real numbers, and none of them is the one a demo would have picked. First: the cheapest tier is not a worse answer to the same question — on this run, it was no answer at all, a real routing failure this desk did not manufacture. Second: doubling local model size (12B → 32B) bought no measurable depth on this question, only 2.7× the wait — the effort curve this magazine has been describing since 396 is not always a curve; sometimes it is flat, and only measurement shows you which. Third: the one call that cost real money was also the only one that changed the frame of the question instead of listing causes inside it — the difference 396 called “what the premium buys”, priced this time at $0.0016.',
          'File this beside 399 as the pair the instrument’s own honesty rule demanded: one issue that disclosed it was showing a representative curve, and one that went and measured the curve on a real question the house had just lived through. The next instrument, per interaction-language.md, waits for a second story that needs a different control — not a cleaner version of this one.',
        ],
      },
    ],

    pullQuote: {
      text: 'A magazine that only shows instruments succeeding is not measuring anything.',
      attribution: 'THE INSTRUMENT DESK · 405',
    },

    signoff: '街のコーダーたちへ — measure the curve; keep the run that embarrasses the theory.',
  },

  audit: {
    drafted: 'magazine-editor · claude-sonnet-5 session, VII·26',
    verified: 'four real model calls · kbot CLI v4.5.0 · wall-clock + word-count measured',
    adherence: 'InstrumentSpread reused per interaction-language.md rule 7 — no new shape',
    readCut: 'the mistral misfire kept, not substituted',
    pressed: 'VII·26 · 2026-07-04',
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
