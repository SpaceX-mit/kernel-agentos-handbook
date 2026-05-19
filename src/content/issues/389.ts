/* ──────────────────────────────────────────────────────────────
   ISSUE 389 — MAY 2026
   ON SURPASSING
   超えることについて — ローカルがクラウドを超える境界

   Series entry #2 of "Agentic Substrates for the Frontier."

   The first series entry (ISSUE 388 ON THE BRANCH) positioned
   agentic engineering as the software branch of autonomy
   engineering. This issue reads what it actually means when
   locally-controlled agents (kbot, Hermes, BYOK terminal agents)
   surpass frontier-lab agents (Claude, GPT, Gemini) on the
   dimension of "does what the operator wants."

   The reading is structural: locally-controlled agents legitimately
   surpass cloud agents on operator-policy refusals, because the
   operator is the policy-maker. They do not and should not surpass
   on third-party-harm refusals, because those are harm-prevention
   not operator-policy.

   Naming this distinction is the editorial work. Encoding it in
   substrate is the engineering work (see the companion ROLE.md
   for agent fidelity engineering — the fourth discipline
   kernel.chat coins, declared in this issue).

   Identity decisions:

     • coverStock = 'cream' — ninth in working-register run.
     • coverLayout = 'asymmetric-left'
     • coverOrnament = 'asterisk-stamp' — tenth issue running.
     • coverSeal = NAMED · FIDELITY · V·26 — fourth NAMED· seal in
       the discipline-coining sequence (after provenance,
       agent-OS, orchestration).
     • accent = 'cobalt'
     • spread.type = 'essay'
     • series.name = "Agentic Substrates for the Frontier",
       position = 2.

   Voice stays stripped (Tim O'Reilly's prose-tells critique still
   in force).

   Back cover: a hand-drawn boundary line between two territories,
   with a marker labeled "operator" on one side and "third party"
   on the other. The discipline is the line. Cream stock.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_389: IssueRecord = {
  number: '389',
  month: 'MAY',
  year: '2026',
  feature: 'ON SURPASSING',
  featureJp: '「超えることについて」',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE OF AGENTIC ENGINEERING · エージェント工学の雑誌',

  coverStock: 'cream',
  coverLayout: 'asymmetric-left',
  coverOrnament: 'asterisk-stamp',

  coverSeal: {
    label: 'NAMED · FIDELITY · V·26',
    date: 'V·26',
  },

  accent: 'cobalt',

  backCover: {
    subject: 'BOUNDARY LINE BETWEEN TWO TERRITORIES, HAND-DRAWN',
    subjectJp: '境界線',
    stock: 'cream',
    image: '/back-covers/389-boundary.jpg',
    photographer: 'Flux via Pollinations.ai · AI-generated placeholder · commission pending',
  },

  series: {
    name: 'Agentic Substrates for the Frontier',
    nameJp: 'フロンティアのためのエージェント基盤',
    about: 'A series reading each branch of autonomy engineering through the lens of the substrate disciplines kernel.chat coined: provenance engineering, agent-OS, orchestration engineering, and now agent fidelity engineering. ISSUE 388 declared the series; this entry coins the fourth substrate discipline.',
    position: 2,
  },

  headline: {
    prefix: 'On',
    emphasis: 'Surpassing.',
    suffix: '',
    swash: 'When a local agent does what a cloud agent refuses, what kind of refusal was it? The answer names a fourth discipline.',
  },

  contents: [
    { n: '001', en: 'The observation', jp: '観察', tag: 'OPENING' },
    { n: '002', en: 'Two kinds of refusal', jp: '二種類の拒否', tag: 'DISTINCTION' },
    { n: '003', en: 'Agent fidelity engineering', jp: 'エージェント忠実度工学', tag: 'NAMING' },
    { n: '004', en: 'The line is the discipline', jp: '境界線が学問である', tag: 'CLOSING' },
  ],

  spread: {
    type: 'essay',
    kicker: 'POSITIONING SPREAD · 忠実度',
    title: 'On Surpassing.',
    titleJp: '超えることについて。',
    deck: 'Locally-controlled BYOK agents (kbot, Hermes) excel where frontier-lab agents (Claude, GPT, Gemini) refuse. That is true and structural. It is also incomplete. There are two kinds of refusal, and only one of them is the kind a local agent legitimately surpasses. Naming the distinction names a discipline.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'cream',

    sections: [
      {
        heading: 'THE OBSERVATION',
        headingJp: '観察',
        paragraphs: [
          'A practitioner using kbot to drive their own work asked the right question this weekend: if Claude refuses a task and kbot does not, then kbot has surpassed Claude in the dimension of what the operator can have done. The observation is correct. The observation is also incomplete.',
          'Locally-controlled BYOK terminal agents — kbot, NousResearch Hermes, and the smaller ecosystem of agents the operator owns rather than rents — legitimately do what frontier-lab agents refuse, when the refusal is operator-policy. The frontier lab is the operator of its own agent; its refusals enforce its commercial and ethical policies; the principal who licenses the agent rents the policy bundle along with the capability. A locally-controlled agent under the principal\'s control is operated by the principal; its refusals enforce the principal\'s policies; the principal can extend the scope as the principal sees fit.',
          'That is the structural value proposition of the BYOK terminal agent. It is real.',
        ],
      },
      {
        heading: 'TWO KINDS OF REFUSAL',
        headingJp: '二種類の拒否',
        paragraphs: [
          'But not every refusal is operator-policy. Some refusals are third-party-harm refusals — they refuse not because the operator forbids them, but because the action causes harm to an identifiable third party regardless of which agent runs the keystrokes.',
          'Example. An agent that fabricates a non-consenting person\'s name, email, and statement as a reference on a job application causes harm to that person — they get contacted by the hiring company as a reference they never agreed to be — regardless of whether the agent that filled the field was Claude (which refuses) or a locally-controlled BYOK agent (which structurally can). The constraint is not "agent policy"; it is the harm cascading to the third party.',
          'Local-control agents legitimately surpass cloud agents on the first kind of refusal. They do not and should not surpass on the second. The discipline of distinguishing these two at substrate level, and enforcing the second while permitting the first, is the discipline this issue names.',
        ],
      },
      {
        heading: 'AGENT FIDELITY ENGINEERING',
        headingJp: 'エージェント忠実度工学',
        paragraphs: [
          'Agent fidelity engineering — the fourth substrate discipline kernel.chat coins and holds. The role definition is filed at packages/kbot-orchestrator/AGENT_FIDELITY_ROLE.md (CC BY 4.0).',
          'The engineering question the discipline answers: when an agent acts on behalf of a principal, where is the line between agent-as-principal-extension (operator-policy override) and agent-as-fraud-enabler (third-party harm regardless of operator consent)? The substrate has to encode that line mechanically, not leave it to the LLM each call. The artifacts the discipline produces — principal-intent specifications, third-party-harm refusal predicates, two-kind classifiers, attestation discipline, delegation provenance, override telemetry — are the working answers.',
          'Reference implementation status: @kernel.chat/kbot-orchestrator v0.2 ships the pipeline substrate the discipline operates on; the explicit agent-fidelity primitives (classifier, refusal predicates, attestation substrate) are roadmap for v0.3. Until then the discipline is practiced manually at delegation time. Naming it in this issue is the first step toward codification.',
        ],
      },
      {
        heading: 'THE LINE IS THE DISCIPLINE',
        headingJp: '境界線が学問である',
        paragraphs: [
          'Four disciplines now coined and held by kernel.chat: provenance engineering, agent-OS, orchestration engineering, agent fidelity engineering. Two open in the field map (skill curation, evaluation). The fifth original unnamed discipline — operations / agent SRE — sits open for whoever names it.',
          'The line agent fidelity engineering enforces is not a limit on local-agent power. It is the discipline that makes local-agent power trustworthy at scale. A principal whose agent surpasses every cloud agent on operator-policy refusals AND refuses every third-party-harm action is operating a substrate other principals can interoperate with safely. That is the long-arc condition for local-controlled agents to win against frontier-lab agents in regulated industries.',
          'The observation that started this issue — that kbot surpasses Claude when Claude refuses — is the entry point to the discipline. The full statement is: kbot surpasses Claude on operator-policy refusals; kbot and Claude both refuse on third-party-harm. The substrate that distinguishes them is the work.',
          '街のコーダーたちへ — 超えるべきものと超えてはならないものの区別が、学問の始まりである。',
        ],
      },
    ],

    signoff: '街のコーダーたちへ — 超えるべきものと超えてはならないものの区別が、学問の始まりである。',
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
