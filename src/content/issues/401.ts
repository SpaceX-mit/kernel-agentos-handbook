/* ──────────────────────────────────────────────────────────────
   ISSUE 401 — JUL 2026
   THE GREEN DOT
   緑の点 — 接続は配達ではない

   The wire story from this magazine's own operations desk. On
   July 3 the house agent was wired into a team-chat workspace
   over a socket connection. The handshake succeeded. The
   connection log read clean. The presence indicator glowed
   green. And for several hours the agent could not hear a
   single message — because the switch that routes events onto
   the socket was off at the platform's console, and nothing in
   the connection ceremony reveals that. The socket was a phone
   line no operator had been told to route calls to.

   Filed as a dispatch because it happened on a date, was fixed
   on a date, and left a doctrine: connection is not delivery.
   Verify with a real event end-to-end, or you have verified
   the dial tone and called it a conversation.

   Identity decisions (differentiated from 397, the previous
   dispatch — ink / asymmetric-left / oxblood):
     • coverStock = 'ivory' — lab-bench white. This is a
       postmortem, and postmortems read on cold paper.
     • coverLayout = 'asymmetric-left' — the dispatch column
       rhythm; the wire form keeps its habits.
     • coverSeal = CONNECTED · UNDELIVERED — the whole failure
       in one rubber circle.
     • accent = 'pool' — systems, terminal, infrastructure.
       The dispatch default (brick) belongs to news of the
       world; this is news of the plumbing.
     • spread.type = 'dispatch', spread.stock = 'ivory'.

   Provenance: the magazine's own logs and session record,
   July 3. No third parties named; the platform's behaviour is
   documented publicly and reproducible.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_401: IssueRecord = {
  number: '401',
  month: 'JUL',
  year: '2026',
  feature: 'THE GREEN DOT',
  featureJp: '緑の点',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',

  coverStock: 'ivory',
  coverLayout: 'asymmetric-left',

  coverSeal: {
    label: 'CONNECTED · UNDELIVERED',
    date: 'VII·26',
  },

  accent: 'pool',

  headline: {
    prefix: 'The',
    emphasis: 'Green',
    suffix: 'Dot.',
    swash: 'The socket opened. The log read clean. The presence light glowed. And nothing was ever going to arrive — a postmortem on the difference between connection and delivery.',
  },

  contents: [
    { n: '001', en: 'The handshake succeeded', jp: '握手は成立した', tag: 'FIELD' },
    { n: '002', en: 'The switch nobody could see', jp: '見えないスイッチ', tag: 'PLUMBING' },
    { n: '003', en: 'Presence lies politely', jp: '在席表示は丁寧に嘘をつく', tag: 'CAUTION' },
    { n: '004', en: 'The fix took a human and a console', jp: '修理は人間と管理画面', tag: 'OPS' },
    { n: '005', en: 'Verify by event, not handshake', jp: '検証は握手でなく事件で', tag: 'DOCTRINE' },
  ],

  spread: {
    type: 'dispatch',
    kicker: 'DISPATCH · 速報',
    title: 'The Green Dot.',
    titleJp: '緑の点。',
    deck: 'On July 3 this magazine wired its agent into a team-chat workspace and verified the connection three ways. Socket acquired. Handshake completed. Presence indicator lit. Every one of those verifications was true, and the agent was deaf — a switch at the platform console, off by default, decides whether anything is ever routed onto the socket at all. A postmortem, filed by the desk that made the mistake.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'ivory',

    slug: 'KERNEL.CHAT WIRE · 401 · VII·26 · SOCKET OPEN · EVENTS OFF · POSTMORTEM · INK STILL WET',

    dateline: 'THE OPERATIONS DESK — JULY 3 — FILED THE NIGHT THE FIRST REAL MESSAGE ARRIVED.',

    filedAt: '3 JUL 2026 · COVERING ONE AFTERNOON',
    status: 'FILED',

    bridge: {
      issue: '399',
      text: '399 handed the reader a dial and promised honesty about what the meter measures. 401 is that honesty pointed at our own wiring: the meter read connected, and the measurement was of the wrong thing.',
    },

    intro: 'Every agent that lives in a chat room begins with a ceremony: request a socket, receive an address, connect, hold the line. Ours performed it flawlessly, and we logged each stage the way a careful desk does. What no stage of the ceremony tests is whether the platform has been told to route anything onto that line — a separate switch, in a separate console, off by default. This dispatch is the anatomy of a false positive that wore three layers of true readings, and the doctrine we filed after a human found the switch.',

    propositions: [
      {
        n: '01',
        overline: 'FIELD',
        filedAt: '15:59',
        title: 'The handshake succeeded.',
        titleJp: '握手は成立した',
        body: [
          'The connection ceremony returned success at every stage. The token authenticated. The platform issued a socket address. The line opened and stayed open, heartbeats and all. By every reading the agent could take from inside its own process, it was present, connected, and on duty.',
          'Note what each reading actually proves. The token proves identity. The address proves permission to connect. The open line proves the network path. The sum of the three proves precisely nothing about whether a single event will ever be placed on that line — and the sum is what the log called, in a word this desk has since retired, verified.',
        ],
      },
      {
        n: '02',
        overline: 'PLUMBING',
        filedAt: '16:20',
        title: 'The switch nobody could see.',
        titleJp: '見えないスイッチ',
        body: [
          'The platform routes events to a connected socket only when event delivery is enabled in the application console — a browser page, behind a human login, nowhere reachable from the agent’s side of the wire. On our application the switch was off. The platform, asked for a connection, politely granted one to an application it had been told to send nothing to.',
          'This is not a bug and the platform is not the villain of the filing. It is a legitimate design with an illegible failure mode: the two halves of "working" live in two places, and only one of them can be tested from code. The half you can test passes loudly. The half you cannot fails silently, forever, with a green light on.',
        ],
      },
      {
        n: '03',
        overline: 'CAUTION',
        filedAt: '16:25',
        title: 'Presence lies politely.',
        titleJp: '在席表示は丁寧に嘘をつく',
        body: [
          'The workspace showed the agent present — the green dot — through the whole deaf period, and kept showing it for a while after the process itself had been stopped. Presence indicators are cached, debounced, and optimistic on every platform that draws them; they are marketing for the connection, not telemetry of it.',
          'The rule the desk filed: the green dot is not evidence. Process state is evidence. Logs are evidence. A message observed arriving is evidence. A coloured circle in a sidebar is a mood.',
        ],
      },
      {
        n: '04',
        overline: 'OPS',
        filedAt: '17:30',
        title: 'The fix took a human and a console.',
        titleJp: '修理は人間と管理画面',
        body: [
          'No amount of agent-side retry, reconnect, or token rotation could have fixed this, because nothing was broken on the agent’s side. The repair was one toggle and two checkboxes in the platform console, executed by a human, after which the same socket ceremony — unchanged — began delivering within seconds.',
          'The general lesson is about where configuration lives. An agent’s capabilities are increasingly split between the code you version and a vendor console you click — and the console half is invisible to every automated check the code half can run. The desk now keeps a written map of which half owns what, because the alternative is rediscovering it during an outage, which is what this filing is.',
        ],
      },
      {
        n: '05',
        overline: 'DOCTRINE',
        filedAt: '18:47',
        title: 'Verify by event, not handshake.',
        titleJp: '検証は握手でなく事件で',
        body: [
          'The doctrine that survives this postmortem is one sentence: a pipeline is verified when one real payload has traversed it end to end, and not before. For a chat agent that means a real message, sent by a human, observed arriving in the log, answered, and the answer observed landing — the full round trip, once. Everything short of that is a test of the plumbing’s existence, not its function.',
          'The desk notes, for the record, that it wrote "verified live" in its own log on the strength of the handshake. The word was true about the transport and false about the system, and no reader of that log could have told the difference. That is the failure that matters — not the switch, but the sentence. Logs should say what was proven, in units of proof.',
        ],
      },
    ],

    bulletin: {
      text: 'The socket opened. The log read clean. The light was green. Nothing was ever going to arrive.',
      attribution: 'KERNEL.CHAT · DISPATCH · 401',
    },

    outro: 'The agent heard its first real message the same evening, and answered it, and the round trip is now the only definition of working this desk accepts for anything with a socket in it. File the doctrine beside 397’s: build for the day the drawer is empty, and never call a thing verified until one real event has come out the far end. The green dot, we note, is still glowing. It always is.',

    signoff: '街のコーダーたちへ — trust the round trip, never the dial tone.',

    terminator: 'END OF DISPATCH · KERNEL.CHAT/401 · FILED 3 JUL · ONE AFTERNOON · INK STILL WET',
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
