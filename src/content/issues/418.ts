/* ──────────────────────────────────────────────────────────────
   ISSUE 418 — JUL 2026
   ONE DAY
   街の一日

   The behavioral science of a metropolitan day, run on the only
   subject this magazine can measure honestly: the reader.

   In 2026 a city day is threaded with delegation moments — small
   decisions an agent takes on your behalf before you have had
   coffee, between train doors, while you sleep. The behavioral
   literature named the human side of this decades before the
   agents arrived: automation bias (Skitka, Mosier & Burdick 1999),
   use / misuse / disuse (Parasuraman & Riley 1997), the irony that
   supervising automation is harder than doing the task (Bainbridge
   1983), and trust calibration as the real design problem (Lee &
   See 2004). The load-bearing metropolitan behavior is no longer
   doing the errand. It is deciding whether to look.

   So the issue does not describe that decision — it collects it.
   Nine authored delegation moments, 06:10 to 00:40, each with one
   two-state control: LET IT RIDE / STEP IN. At midnight a ledger
   totals the reader's own split. The reader is the subject; the
   day is the apparatus.

   THE SHAPE (eighth): `day` — the first whose axis is time lived.
   Which rules it stresses, and why it complies (checklist §7):
     • Rule 2 — the hand is required: the argument IS the reader's
       own defer/verify split; without marks the ledger has nothing
       true to meter. Cut the interaction and the finding is gone.
     • Rule 4 — both authored consequences are PRINTED, always
       legible; the mark selects, it never reveals or hides.
       An untouched page reads complete (ledger: 9 undecided).
     • Rule 6 — the ledger meters ONLY real reader actions (marks,
       changes of mind, session clock — the 415 precedent). The
       moments and their attention costs are authored
       REPRESENTATIVE composites, disclosed in the dossier; no
       number on this page pretends to be a measurement of anything
       but the reader's own hand.
     • Rule 3 — the city moves at weather amplitude only: steam,
       a train dash, a crosswalk pulse, window glow. CSS-only,
       ≤4px / ≤8% opacity, reduced-motion respected.

   Identity (differentiated from 416 ivory/asymmetric-left/tomato):
     • coverStock = 'butter' — the daylight leisure register; this
       is the lifestyle issue, the day itself is the canvas.
     • coverLayout = 'classic'; accent = 'cobalt' — declared:
       transit-map civic blue, the color of the city's signage,
       not the house's warm default.
     • coverSeal = READER AS SUBJECT — stamps the method on the
       cover the way 405/416 stamped theirs.
     • No postmark: the day is a composite city, not a place; a
       postmark would claim geography the copy doesn't earn.

   Provenance: the four cited works are real and load-bearing;
   nothing else on the page claims measurement except the reader's
   own session, which is counted client-side, kept by no one, and
   erased on reload — the ledger note says so in plain type.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_418: IssueRecord = {
  number: '418',
  month: 'JUL',
  year: '2026',
  feature: 'ONE DAY',
  featureJp: '街の一日',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',

  coverStock: 'butter',
  coverLayout: 'classic',

  coverSeal: {
    label: 'READER AS SUBJECT',
    date: 'VII·26',
  },

  accent: 'cobalt',

  headline: {
    prefix: 'ONE',
    emphasis: 'DAY',
    suffix: '.',
    swash: 'Nine moments a city agent handled for you, dawn to after-midnight. At each one, a choice this magazine cannot make for you: let it ride, or step in. At midnight, your ledger.',
  },

  contents: [
    { n: '001', en: 'The city runs on proxy hands now', jp: '都市は代理の手で回る', tag: 'THESIS' },
    { n: '002', en: 'Supervising is harder than doing', jp: '監督は実行より難しい', tag: 'SCIENCE' },
    { n: '003', en: 'Nine delegations, dawn to after-midnight', jp: '夜明けから深夜までの九つの委任', tag: 'THE DAY' },
    { n: '004', en: 'Your ledger — marks, changes, the clock', jp: 'あなたの台帳 — 印と変心と時計', tag: 'LEDGER' },
    { n: '005', en: 'The automation-bias file, works cited', jp: '自動化バイアスの文献', tag: 'SOURCES' },
  ],

  spread: {
    type: 'day',
    kicker: 'THE DAY · 一日',
    title: 'ONE DAY.',
    titleJp: '街の一日。',
    deck: 'A 2026 metropolitan day is threaded with moments an agent handles before you look. The behavioral science says the looking is the hard part — so this issue hands the looking to you, nine times, and totals what you did.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'butter',

    dossier: {
      kicker: 'THE APPARATUS · 装置',
      note: 'The subject of this study is you. The nine moments below are authored — representative composites of a 2026 metropolitan day, not logs of anyone’s real one, and the attention costs printed on the STEP IN side are editorial estimates, not measurements. The only measured numbers on this page are your own: which way you marked each moment, how many times you changed your mind, and the clock. All of it counted in your browser, kept by no one, gone on reload.',
      items: [
        { label: 'SUBJECT', value: 'THE READER — N = 1, UNRECORDED' },
        { label: 'FIELD SITE', value: 'A COMPOSITE CITY DAY · 06:10 – 00:40' },
        { label: 'CONTROL', value: 'LET IT RIDE / STEP IN — PER MOMENT' },
        { label: 'MEASURED', value: 'YOUR MARKS · YOUR CHANGES · THE CLOCK' },
        { label: 'AUTHORED', value: 'THE MOMENTS + COSTS — REPRESENTATIVE, DISCLOSED' },
      ],
    },

    intro: [
      {
        heading: 'The city runs on proxy hands now',
        headingJp: '都市は代理の手で回る',
        paragraphs: [
          'The metropolitan day used to be a chain of small executions: order the coffee, catch the train, answer the landlord, move the reservation. In 2026 most of those executions have quietly changed owners. The agent orders, reroutes, drafts, reschedules — competently, mostly — and what is left to the human is a different task entirely: deciding, moment by moment, whether to look at what was done in your name.',
          'The behavioral science of that task is older than the agents. Bainbridge called it the irony of automation in 1983: the more reliable the machine, the worse the human becomes at supervising it, because supervision without action is the one job human attention does badly. Parasuraman and Riley sorted the failure modes — misuse when we defer to automation we should have checked, disuse when we override automation that was right. Skitka and colleagues measured the bias toward the machine’s answer even when the evidence sat in plain view. None of them had seen your Tuesday. All of them described it.',
          'So here is your Tuesday. Nine moments, dawn to after-midnight. The agent has already acted in each one. Both outcomes are printed — this page hides nothing behind your choice. The only thing at stake is the mark, and the mark is the finding.',
        ],
      },
    ],

    dayKicker: 'THE DAY · 06:10 – 00:40 · MARK EACH MOMENT',

    moments: [
      {
        id: 'd1',
        time: '06:10',
        label: 'THE MORNING BRIEF',
        labelJp: '朝の報告',
        vignette: 'kettle',
        situation: 'The kettle is on before you are up. Overnight, your agent read 214 items and kept six: two about your neighborhood rezoning, one from your bank, three it scored as things you would want. It discarded a message from your cousin as newsletter-shaped.',
        ride: 'You read six items with your coffee and start the day ahead. The cousin’s note — an invitation, as it happens — surfaces in three days when she texts "did you see my email?"',
        stepIn: 'You scan the discard pile standing at the counter. You find the cousin’s invitation and one supplier notice the scorer undervalued. The coffee is lukewarm by the time you drink it.',
        cost: '+7 MIN OF YOUR ATTENTION',
      },
      {
        id: 'd2',
        time: '07:42',
        label: 'THE REROUTE',
        labelJp: '経路変更',
        vignette: 'train',
        situation: 'Signal fault on the express line. Before the platform announcement finishes, your agent has accepted a reroute: local line, transfer at the river station, nine minutes longer, seat probability high.',
        ride: 'The reroute is sound. You get a seat, you get nine extra minutes of reading, you arrive on time for the 8:30. You will never know the express recovered in four minutes.',
        stepIn: 'You check the transit board yourself, see the fault estimate is soft, and gamble on the express platform. Some mornings the gamble wins back nine minutes; this morning it costs you fourteen and the seat.',
        cost: '+3 MIN, STANDING',
      },
      {
        id: 'd3',
        time: '09:05',
        label: 'THE TRIAGE',
        labelJp: '受信箱の選別',
        vignette: 'desk',
        situation: 'By the time you sit down, 41 messages have been answered, filed, or declined in your voice. Three are held for you, flagged: a contract clause, a tone-ambiguous note from a colleague, an invoice that doesn’t match its purchase order.',
        ride: 'The three flags were the right three. But one of the 41 auto-replies confirmed a meeting time you had privately decided to move, and now moving it costs an apology.',
        stepIn: 'You audit the sent folder with the second coffee. Thirty-nine were exactly what you would have written, which is its own strange feeling. You catch the meeting confirmation and fix it before it hardens.',
        cost: '+12 MIN OF YOUR MORNING',
      },
      {
        id: 'd4',
        time: '11:30',
        label: 'THE REFILL',
        labelJp: '処方の更新',
        vignette: 'crosswalk',
        situation: 'Crossing at the signal, your pocket buzzes once: the pharmacy refill is negotiated — your agent and the clinic’s agent moved your pickup to the branch near the office and shifted your follow-up to Thursday 16:15, which your calendar could absorb.',
        ride: 'Machine-to-machine scheduling at its best: nothing to do, the prescription is waiting at six. Thursday 16:15 turns out to sit exactly where your deep-work block used to be — the calendar absorbed it because you never told the calendar that block was sacred.',
        stepIn: 'You stop on the far corner and look at the proposed Thursday. You move the follow-up to Friday morning and mark the deep-work block protected, which takes ninety seconds and one small negotiation your agent then re-runs.',
        cost: '+2 MIN AT THE CORNER',
      },
      {
        id: 'd5',
        time: '13:15',
        label: 'THE LUNCH ORDER',
        labelJp: '昼食の注文',
        vignette: 'market',
        situation: 'Lunch is ordered from your pattern: the counter you like on Thursdays, the usual bowl. The counter is out of the usual; your agent accepted the substitution it computed you would rate second — without asking, because you once told it to stop asking about lunch.',
        ride: 'The substitute is fine. Fine is the word for it. You notice, mid-bite, that you have eaten from four places in three weeks, all of them computed to be fine, and you cannot remember the last time lunch surprised you.',
        stepIn: 'You override, walk two blocks to the stall with the line, and stand in it. The line costs eleven minutes and gives you back the one genuinely metropolitan pleasure this page will editorialize about: an unoptimized decision.',
        cost: '+11 MIN IN A LINE',
      },
      {
        id: 'd6',
        time: '15:40',
        label: 'THE DRAFTED REPLY',
        labelJp: '下書きの返信',
        vignette: 'desk',
        situation: 'The landlord’s message about the rent adjustment has a reply drafted in your voice: conciliatory, well-structured, conceding the increase but winning the repair schedule. It is set to send at 16:00 unless you touch it — you configured that window yourself, in a calmer month.',
        ride: 'It sends at 16:00. It is, honestly, better-written than what you would have sent angry. But it concedes the increase in your name, and you learn at dinner that the tenant upstairs pushed back and got a smaller one.',
        stepIn: 'You open the draft at 15:52. You keep the structure, delete the concession, and add one sentence only you could add — the specific January morning the radiator failed. It sends at 16:09, eight minutes late and materially yours.',
        cost: '+9 MIN, HEART RATE INCLUDED',
      },
      {
        id: 'd7',
        time: '18:20',
        label: 'THE RESERVATION',
        labelJp: '予約の変更',
        vignette: 'crosswalk',
        situation: 'The dinner reservation has moved itself 45 minutes later for a better table — your agent and your friend’s agent agreed to it while you were both underground. The notification is phrased as good news, and structurally it is.',
        ride: 'The table is genuinely better. The 45 minutes get silently backfilled with more work, because vacated evening time in a 2026 calendar does not stay vacated. Your friend arrives having had the same 45 minutes and the same backfill.',
        stepIn: 'You text your friend directly — a human message, off the agent channel: "keep 7:15, don’t care about the table." The worse table holds. Whatever the two of you would have done with the better one, the earlier hour was the actual luxury.',
        cost: '+1 MIN, ONE TEXT',
      },
      {
        id: 'd8',
        time: '21:05',
        label: 'THE EVENING SCORE',
        labelJp: '夜の選別',
        vignette: 'window',
        situation: 'Home, lamps on. The watchlist is queued in an order computed from your last month of attention. One invitation — a gallery opening Saturday, from someone you met twice — was declined this afternoon, scored low-affinity. The decline was polite and is already sent.',
        ride: 'The queue is good; the evening is smooth. The gallery opening happens without you. Low-affinity was, on the evidence, correct — and the evidence can never include the person the second meeting would have made them.',
        stepIn: 'You read the declined invitation yourself and sit with it for a minute. You send a two-line human follow-up: can’t make Saturday, want to see the show another day. The score was right about Saturday and wrong about the person, and only one of those was its job.',
        cost: '+4 MIN AT THE WINDOW',
      },
      {
        id: 'd9',
        time: '00:40',
        label: 'THE RECONCILE',
        labelJp: '深夜の照合',
        vignette: 'window',
        situation: 'Last window before sleep. Overnight, your agent will reconcile the day: renew two subscriptions, contest one charge, file the receipts, set tomorrow’s route around the marathon closures, and compose the 06:10 brief that starts this page again. A summary of intended actions is on your nightstand screen now, scroll depth: about forty seconds.',
        ride: 'You sleep. The reconcile runs clean, as it does most nights, and tomorrow’s brief will mention it in one line you will not expand. The subscriptions renew; one of them is for a service you stopped using in April.',
        stepIn: 'You spend the forty seconds. The route and the receipts are perfect. You catch the April subscription and kill it — the reconcile flagged it as low-use, in small type, and small type at 00:40 is exactly where the literature says deference lives.',
        cost: '+40 SEC BEFORE SLEEP',
      },
    ],

    ledgerNote: 'The ledger above counts three things only, all of them yours: how you marked each of the nine moments (and how many you left unmarked), how many times you changed a mark, and the clock since this page loaded — the same session clock ISSUE 415 ran. Marks are counted in your browser and nowhere else: nothing is recorded, nothing is sent, and reloading erases your day. The moments themselves, and the attention costs printed on the STEP IN side, are authored representative composites — this magazine’s editorial estimate of a 2026 metropolitan day, not telemetry from anyone’s real one. No mark you make here is wrong; per the ethic this magazine set in ISSUE 411, the page grades nothing. It only counts.',

    references: {
      kicker: 'THE AUTOMATION-BIAS FILE · 文献',
      note: 'The four works this issue leans on. All real, all pre-agent, all describing your Tuesday.',
      items: [
        {
          authors: 'Bainbridge, L.',
          year: '1983',
          title: 'Ironies of Automation',
          journal: 'Automatica, 19(6)',
        },
        {
          authors: 'Parasuraman, R. & Riley, V.',
          year: '1997',
          title: 'Humans and Automation: Use, Misuse, Disuse, Abuse',
          journal: 'Human Factors, 39(2)',
        },
        {
          authors: 'Skitka, L. J., Mosier, K. L. & Burdick, M.',
          year: '1999',
          title: 'Does automation bias decision-making?',
          journal: 'International Journal of Human-Computer Studies, 51(5)',
        },
        {
          authors: 'Lee, J. D. & See, K. A.',
          year: '2004',
          title: 'Trust in Automation: Designing for Appropriate Reliance',
          journal: 'Human Factors, 46(1)',
        },
      ],
    },

    outro: [
      {
        heading: 'Reading your ledger',
        headingJp: '台帳を読む',
        paragraphs: [
          'There is no correct split. A reader who let all nine ride is not lazy — Parasuraman and Riley would say they have calibrated to a mostly-reliable city, and eight of these nine moments rode fine. A reader who stepped in nine times is not paranoid — Bainbridge would say they are refusing the one task humans verifiably do badly, which is watching competence without touching it. The ledger is not a score. It is a portrait of where you spend the only metropolitan currency left: the look.',
          'But notice, before midnight files this page away, which moments pulled your hand. The literature predicts it was not the important ones — automation bias is strongest exactly where the type is smallest and the hour is latest. If you stepped in at lunch and rode at the landlord, the city already knows something about you that this page was built to let you find out first.',
        ],
      },
    ],

    pullQuote: {
      text: 'The errand was automated. The look was not. The look is the day now.',
      attribution: 'ONE DAY · A FIELD STUDY, N = 1',
    },

    signoff: '街のコーダーたちへ — the city will run your day beautifully without you; mark the moments where you still insist on being there.',
  },

  audit: {
    drafted: 'brainstormed with the editor-in-chief · claude-fable-5 session, VII·26',
    verified: '4 works cited, 4 real (Bainbridge 83 · Parasuraman/Riley 97 · Skitka 99 · Lee/See 04); no other measurement claimed',
    adherence: 'eighth shape `day` — rules 2/3/4/6 argued in the file header; ledger meters reader actions only; motion at weather amplitude',
    readCut: 'nine moments kept from a drafted fourteen; the five cut were suburban',
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
