/* ──────────────────────────────────────────────────────────────
   ISSUE 382 — MAY 2026
   ON THE GATE
   門について — 承認の構造、消費者の側から逆照射される

   The first fieldwork issue after the manifesto. ISSUE 381 named
   the discipline (provenance engineering); ISSUE 382 reads the
   first receipts coming in from the world. The dateline event is
   Amazon shipping Alexa's "Buy for Me" — an agent that performs
   a purchase on the user's behalf and pauses at a material gate
   for approval before executing. The consumer surface of the same
   pattern the substrate names for regulated workflows. The
   discipline got named on the 12th; the pattern got 100 million
   external proof-points on the 14th. The discipline writes the
   essay on the 15th.

   Identity decisions:

     • coverStock = 'cream' — the anchor stock. After a manifesto
       on ink, the issue returns to the working register. The
       fieldwork issue is published on cream; the declaration was
       on ink. The temperature drops back to room.

     • coverLayout = 'asymmetric-left' — the regular shape used by
       380, by the issue that names a pattern without committing
       to a five-year arc. 382 sits in the same shape as 380 — the
       discipline's normal voice, doing analysis after the
       declaration is filed.

     • coverOrnament = 'asterisk-stamp' — third issue running. The
       mark is becoming the magazine's editorial-footnote glyph,
       used when the writing is annotating something that shipped
       elsewhere. The asterisk that should have been on the Alexa
       press release, in editorial.

     • coverSeal = WITNESSED · GATE · V·26 — new verb on the seal.
       380 NOTED a pattern; 381 DECLARED a bet; 382 WITNESSES
       external validation of the bet's structural claim. The
       verbs continue to track what the issue is actually doing.
       Witnessing is what the discipline does when the world ships
       the pattern in a different costume.

     • accent = 'cobalt' — the systems-essay register. 380 was
       cobalt for the three-idioms recognition; 382 is cobalt for
       the gate analysis. When the writing is examining a pattern
       coldly, the accent goes cobalt. Amethyst would have made it
       sound like an anniversary; pool would have made it sound
       like a toolkit drop; the issue is neither.

     • spread.type = 'essay' — sections with headings, paragraphs,
       no numbered propositions. The shape 380 used. The forecast
       form is reserved for manifestos; the essay form is what the
       discipline does between manifestos. Most issues are essays.

   The position of this issue in the run:

     • 381 declared the discipline.
     • 382 reads the first piece of external evidence the
       discipline's structural claim was correct.
     • 383+ will be whatever the work, the substrate, and the world
       produce next. The magazine commits to publishing the
       evidence as it lands, not to inventing it on a schedule.

   The back cover names a physical artefact that carries the
   gate-and-receipt shape — a ticket stub, punched and
   counter-stamped, the analog of "permission granted, record
   kept on both sides of the transaction." Cream stock again on
   the verso; the daylight register matches the front. AI-
   generated placeholder image (shape 5, per back-cover spec
   §XI addendum), commissioned photograph pending. ──────────── */

import type { IssueRecord } from './index'

export const ISSUE_382: IssueRecord = {
  number: '382',
  month: 'MAY',
  year: '2026',
  feature: 'ON THE GATE',
  featureJp: '「門について」',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',

  /** Cover identity — cream stock, asymmetric-left layout, the
      working register the magazine uses for analytical pieces.
      Asterisk-stamp continues as the editorial-footnote mark.
      Cobalt accent matches the systems-essay temperature. */
  coverStock: 'cream',
  coverLayout: 'asymmetric-left',
  coverOrnament: 'asterisk-stamp',

  /** Registry stamp — WITNESSED enters the seal catalogue. The
      verb names what the issue does: witnesses an external proof
      of the structural claim the prior issue declared. */
  coverSeal: {
    label: 'WITNESSED · GATE · V·26',
    date: 'V·26',
  },

  /** Cobalt — the systems-essay register. The cabinet entry used
      when the writing is examining a pattern coldly. */
  accent: 'cobalt',

  /** Second back cover under the spec at docs/back-cover-spec.md.
      The fieldwork issue's verso carries the physical analog of
      the material-gate pattern — a ticket stub, punched and
      counter-stamped. Cream stock to match the front. AI-
      generated placeholder, commission pending. */
  backCover: {
    subject: 'TICKET STUB, PUNCHED AND COUNTER-STAMPED',
    subjectJp: '半券・押印付',
    stock: 'cream',
    image: '/back-covers/382-ticket.jpg',
    photographer: 'Flux via Pollinations.ai · AI-generated placeholder · commission pending',
  },

  headline: {
    prefix: 'On',
    emphasis: 'the Gate.',
    suffix: '',
    swash: 'Amazon shipped the consumer surface of the material-gate pattern the day before this issue went to press. The provenance engineer reads the receipts.',
  },

  contents: [
    { n: '001', en: 'The dateline', jp: '日付', tag: 'OPENING' },
    { n: '002', en: 'The structural rule, restated', jp: '構造の規則・再掲', tag: 'PATTERN' },
    { n: '003', en: 'The consumer proof', jp: '消費者側の証拠', tag: 'PROOF' },
    { n: '004', en: 'The regulated version', jp: '規制下の版', tag: 'STAKES' },
    { n: '005', en: 'What the substrate ships', jp: '基盤が出すもの', tag: 'SUBSTRATE' },
    { n: '006', en: 'Receipts on both sides', jp: '双方の半券', tag: 'CLOSING' },
  ],

  spread: {
    type: 'essay',
    kicker: 'FIELDWORK SPREAD · 門の記録',
    title: 'On the Gate.',
    titleJp: '門について。',
    deck: 'On 14 May 2026, Amazon released Alexa\'s "Buy for Me" — an agent that performs purchases on the user\'s behalf and pauses at a material gate for approval before execution. Two days earlier, this magazine named the engineering discipline whose central architectural rule is exactly that pattern, scaled to regulated industries. The essay reads the two events together, and notes what the gate has to do once the stakes go up.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'cream',

    sections: [
      {
        heading: 'THE DATELINE',
        headingJp: '日付',
        paragraphs: [
          'The dateline is Wednesday, 14 May 2026. Amazon announces Alexa for Shopping, powered by Alexa+, replacing Rufus across mobile, desktop, and the Echo Show. The marketing copy notes that it compares products, tracks prices, schedules recurring orders, and — the line worth fixing on — it reaches outside of Amazon. A feature called Buy for Me lets the assistant purchase, on the user\'s behalf, at other retailers. The press release adds the line every press release about an agent in 2026 now adds: the user still approves before the assistant completes the purchase.',
          'Two days earlier, on the 12th, this magazine published ISSUE 381, naming a discipline called provenance engineering and committing the publication to five years of documenting it. The discipline\'s structural rule is that the AI never produces the source-of-truth number; deterministic engines do, and humans approve at material gates. The rule was filed against capital markets. The Amazon release ships, to a consumer audience of roughly one hundred million Alexa users, the consumer surface of exactly that pattern: an agent that does, and a gate that approves, and a record that both produce. The discipline got an external proof-point thirty-six hours after it was named. The witnessing is the work this issue does.',
          'The press release does not use the word provenance. It does not say material gate. It does not name the discipline the pattern belongs to. It does not need to — the pattern is now in the room with one hundred million people, regardless of what the room knows to call it. The work of the magazine, in this issue, is to name what the press release left unnamed, and to draw the line from the consumer version to the regulated version that the same shape demands once the stakes go up.',
        ],
      },
      {
        heading: 'THE STRUCTURAL RULE, RESTATED',
        headingJp: '構造の規則・再掲',
        paragraphs: [
          'ISSUE 381 named one architectural rule that organises every other decision in this discipline. The rule reads: the AI never produces the source-of-truth number. Deterministic engines produce numbers. The AI orchestrates the requests and interprets the results. Humans approve at the material gates. The rule was filed against AI agents operating in regulated industries — finance, healthcare, legal, defense, drug discovery — but the rule is older than any one industry, and the shape of the gate is the same wherever the rule applies.',
          'A material gate is a checkpoint in the agent\'s execution where the action it is about to take is large enough that it must be approved before it occurs, and the approval must be carried, in the audit log, as part of the record. The gate is not a feature added to the agent. The gate is a structural separation. On one side of the gate, the agent has not yet committed the action; the agent\'s recommendation, the regulatory verifier\'s pass, the engine\'s computed number, and the proposed payload all sit in a request envelope, hashed, awaiting approval. On the other side of the gate, the action has occurred; the approver\'s signed token is appended to the envelope; the executed result is sealed; the audit log records the full chain. The gate is the line where intent becomes act.',
          'The agent without a gate is not a less safe agent; it is a different category of object entirely. The agent without a gate cannot, by construction, be replayed under audit, because the action and the recommendation are the same operation. The gate produces the seam an auditor needs in order to ask the only question the auditor cares about: at the moment the action committed, who approved it, what did they see, what was the engine\'s number, and was the regulator\'s check satisfied. The gate makes that question answerable. The agent without a gate makes it rhetorical.',
        ],
      },
      {
        heading: 'THE CONSUMER PROOF',
        headingJp: '消費者側の証拠',
        paragraphs: [
          'The Amazon release is consumer software. The stakes are small. A wrong purchase is refundable; a wrong recurring order is cancellable; a wrong retailer is, at worst, a returned package. The press release does not name a regulator and does not claim a compliance framework, because at the consumer level the framework is the credit-card chargeback and the consumer-protection statute and the platform refund policy, in roughly that order. The framework is mature, has been litigated for thirty years, and absorbs the kind of errors a Buy for Me agent will produce at scale. The stakes are low because the recovery is cheap.',
          'What the release does, regardless of the stakes, is normalise a shape. The shape is: the agent does the work; the user approves the material moment; the system records both. Until the 14th, the shape was something the regtech corner of the field had been writing whitepapers about for a year and a half, and the consumer-facing AI surface had been pretending did not need to exist. The argument the consumer surface made — that approval is friction; that gates slow the user down; that the right agent is the one that just does — has now been retired by the surface\'s largest single platform. Amazon shipped the gate. The gate is now mainstream. The shape is in the room.',
          'The provenance engineer\'s read on this is not that Amazon validated the discipline. Amazon validated the shape. The shape is necessary at one hundred million Alexa users for the same reason the shape is necessary at the regulated end of the field: an agent that commits an action on a user\'s behalf, without a recorded approval at the material moment, is an agent that cannot answer the question "who decided." The consumer surface needed that answer for liability and trust. The regulated surface needs the same answer for examination, enforcement, and certification. The shape is the same. The receipts that follow are different.',
        ],
      },
      {
        heading: 'THE REGULATED VERSION',
        headingJp: '規制下の版',
        paragraphs: [
          'In the consumer version, the receipt is the order confirmation email. The system records the approval implicitly — the user clicked the button, the platform logged the click, the credit card statement carries the line item, and if there is a dispute the chargeback process reconstructs the transaction. The reconstruction works because retail transactions are simple objects: an item, a price, a buyer, a seller, a timestamp. The objects compose into receipts. The receipts compose into evidence. The evidence composes into a resolution. No one has to design the reconstruction; the rails have been designed by every credit-card processor and consumer-protection statute since 1974.',
          'In the regulated version, the rails do not exist yet. The transaction is an AI agent recommending a position in a portfolio, a treatment in a chart, a filing in a docket, a synthesis in a pipeline. The objects are not simple: the recommendation depends on a vector of inputs, a model version, a regulatory rule set, an approver\'s identity, an engine\'s deterministic output, and a verifier\'s pass — and the regulator examining the transaction six months later will want to replay every one of those, byte-for-byte, from the audit log. The consumer version absorbs the cost of a wrong receipt; the regulated version cannot. A wrong receipt in a regulated agent\'s log is the artefact a court will eventually decide on. The receipt has to be designed before the transaction occurs.',
          'The substrate this magazine sits beside — `@kernel.chat/kbot-finance`, Apache 2.0 — is one attempt at designing the receipt before the transaction. The package ships three layers: deterministic engine adapters that produce the number; a regulatory verifier that runs rules-as-code before the engine is called; and a hash-chained append-only audit log that records every check, request, response, approval, and incident. The material-gate approval substrate is one of the layers — a signed approver token, verified before execution, sealed into the envelope, anchored in the chain. Amazon ships the consumer version; this package ships the regulated version. The shape is the same; the receipts differ in what they have to survive.',
        ],
      },
      {
        heading: 'WHAT THE SUBSTRATE SHIPS',
        headingJp: '基盤が出すもの',
        paragraphs: [
          'The substrate ships a small object: a content-addressed envelope that carries, end to end, what the agent asked, what the verifier checked, what the engine returned, who approved, and what the action sealed into. The object is small because the discipline\'s rule is small. The object is hashable because the rule is structural. The object is replayable because the engine is deterministic. The object is auditable because the chain is append-only. None of the four properties are novel; the combination, in one envelope, designed for an AI agent to call, is what is novel — and what the MCP audit-extension RFC filed beside the package proposes the protocol should ratify.',
          'The package does not claim to be the only design. The package claims to be the first reference implementation of the design that takes the structural rule seriously. The reference implementation exists for the same reason every reference implementation exists: to give the field something concrete to argue with, to extend, to fork, to disprove, and (in the lucky case) to adopt. The argument the magazine and the substrate are jointly making is that the consumer version of the shape Amazon shipped on the 14th will, in regulated industries, require a substrate of this shape underneath the agent. The argument is two days old. The argument has, as of the 14th, one hundred million external proof-points it can quote — and it can now quote them by name.',
          'The substrate is v0.2. The substrate is not certified. The substrate is not affiliated with Polymarket, Bloomberg, FINOS, ISDA, or any regulator. The substrate is a reference implementation under Apache 2.0, written by an editorial-engineering shop that publishes a magazine alongside it, in the open. The version number will go up. The certifications will arrive in their own time. What is filed today, beside this issue, is the position that the shape Amazon shipped at the consumer end demands, at the regulated end, the work this substrate is doing — and that the work the substrate is doing is what the magazine will report on, issue by issue, until the field arrives at its first widely-deployed standard or quietly abandons the attempt.',
        ],
      },
      {
        heading: 'RECEIPTS ON BOTH SIDES',
        headingJp: '双方の半券',
        paragraphs: [
          'The back cover of this issue carries a punched ticket stub, counter-stamped. The image is older than the magazine — train tickets and ferry passes have used the shape for a century. The traveller keeps half; the gate-keeper keeps half; both halves carry a punch that proves the passage occurred. The pattern is not new. The pattern is, at the regulated end of agent-driven AI, the pattern that has to exist for the agent to act at all, and the consumer end of the field has, this week, conceded the pattern is also necessary in territories that thought they could avoid it. The ticket and the audit envelope are the same object in two stocks.',
          'A discipline is, in the end, the recognition that two things are the same object in different stocks. Provenance engineering is the discipline that recognises the punched ticket, the notary stamp, the content-addressed envelope, the hash-chained log, and the material-gate approval token are all the same object — a receipt that survives, on both sides of a transaction, what the transaction asked, what the transaction returned, and who approved the passage from intent to act. The discipline\'s job, for the next five years, is to ship the substrate that produces that receipt for AI agents at the speed the field is now demanding. The pattern is in the room. The receipts are coming in.',
          '街のコーダーたちへ — 半券は両側にある。仕事は続く。',
        ],
      },
    ],

    signoff: '街のコーダーたちへ — 半券は両側にある。仕事は続く。',
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
