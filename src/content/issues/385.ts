/* ──────────────────────────────────────────────────────────────
   ISSUE 385 — MAY 2026
   ON THE LAYER BENEATH
   下の層について — 重みが商品化される週

   The fourth fieldwork issue. Where 382 read the consumer surface,
   383 the frontier-lab surface, and 384 the regulatory surface,
   ISSUE 385 reads the supply surface: the week three open-weight
   model releases (Gemma 4, Phi-4-reasoning-vision-15B, Nemotron 3
   Nano Omni) signaled that the model layer is commoditizing.

   What this means for the discipline: local-first stops being a
   moat. Anyone can run lab-quality models locally now. What stays
   valuable is what sits underneath: the substrate, the verifier,
   the audit log, the gate. The discipline named in 381 was always
   pointed below the model layer. The events of this week confirm
   that the layer above is the layer that gets cheap.

   Identity decisions:

     • coverStock = 'cream' — fifth in the working-register run.
       The repetition is deliberate; the discipline at work in
       sustained voice.

     • coverLayout = 'asymmetric-left' — regular working shape.

     • coverOrnament = 'asterisk-stamp' — sixth issue running.
       The mark is now the magazine's editorial-footnote glyph.

     • coverSeal = NOTED · COMMODITIZATION · V·26 — new verb.
       The discipline NOTES what changed in the supply layer.

     • accent = 'cobalt' — systems-essay register, fifth in run.

     • spread.type = 'essay' — sections, headings, paragraphs.

   The issue is shorter than 381-384 by design. Tim O'Reilly's
   coaching this week (private correspondence, not named here) made
   one point land: the magazine's prose has been carrying too many
   tells of AI-assisted composition. 385 is the first issue written
   under that constraint. Shorter sentences. Fewer rhetorical
   moves. More particularity. Less drumbeat.

   The back cover names a physical artefact carrying the layer-
   beneath shape: the foundation slab of a small building, exposed
   before the framing goes up. The slab is not the building. The
   slab is what the building stands on. Cream stock to match the
   front. ────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_385: IssueRecord = {
  number: '385',
  month: 'MAY',
  year: '2026',
  feature: 'ON THE LAYER BENEATH',
  featureJp: '「下の層について」',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',

  coverStock: 'cream',
  coverLayout: 'asymmetric-left',
  coverOrnament: 'asterisk-stamp',

  coverSeal: {
    label: 'NOTED · COMMODITIZATION · V·26',
    date: 'V·26',
  },

  accent: 'cobalt',

  backCover: {
    subject: 'FOUNDATION SLAB, EXPOSED BEFORE FRAMING',
    subjectJp: '基礎の土台',
    stock: 'cream',
    image: '/back-covers/385-slab.jpg',
    photographer: 'Flux via Pollinations.ai · AI-generated placeholder · commission pending',
  },

  headline: {
    prefix: 'On',
    emphasis: 'the Layer Beneath.',
    suffix: '',
    swash: 'Three open-weight model releases in one week. The model layer commoditized. The discipline was always underneath it.',
  },

  contents: [
    { n: '001', en: 'The supply week', jp: '供給の週', tag: 'OPENING' },
    { n: '002', en: 'Local-first is no longer the moat', jp: 'もはや堀ではない', tag: 'SHIFT' },
    { n: '003', en: 'What stays valuable when the model layer is cheap', jp: '残るもの', tag: 'RESIDUE' },
    { n: '004', en: 'The discipline was always below the model', jp: '元から下にあった', tag: 'CLOSING' },
  ],

  spread: {
    type: 'essay',
    kicker: 'FIELDWORK SPREAD · 下の層',
    title: 'On the Layer Beneath.',
    titleJp: '下の層について。',
    deck: 'In one week of May 2026, three open-weight model releases — Google\'s Gemma 4 family, Microsoft\'s Phi-4-reasoning-vision-15B, and NVIDIA\'s Nemotron 3 Nano Omni — pushed lab-quality inference into the territory anyone can run locally. The model layer is commoditizing. The discipline this magazine named in ISSUE 381 was always pointed at the layer beneath it. Four short sections.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'cream',

    sections: [
      {
        heading: 'THE SUPPLY WEEK',
        headingJp: '供給の週',
        paragraphs: [
          'May 4 brought Gemma 4 from Google DeepMind. The 31B model entered the Arena AI leaderboard at #3 globally among open models. The release was tuned for agentic workflows, not just chat. Then Microsoft shipped Phi-4-reasoning-vision-15B, a smaller multimodal model engineered for high reasoning per parameter. NVIDIA followed with Nemotron 3 Nano Omni — a 30B mixture-of-experts model unifying vision, audio, and language with up to nine times the throughput of comparable open multimodals.',
          'Three open-weight releases in one week. All competitive with closed-lab models on the tasks most kbot users care about. All free to run on consumer-grade hardware with the right tooling. The supply of capable, locally-runnable model weights crossed a threshold.',
        ],
      },
      {
        heading: 'LOCAL-FIRST IS NO LONGER THE MOAT',
        headingJp: 'もはや堀ではない',
        paragraphs: [
          'Until this week, "local-first AI" carried meaningful product weight. The kbot positioning leaned on it. The BYOK philosophy leaned on it. The whole magazine pitch carried a piece of the argument that says: you should not be a tenant of a frontier lab; you should own your stack.',
          'The argument still holds. The differentiation does not. Everyone can be local-first by year end. Open-weight models capable enough for production agentic work will be a stock item at every developer\'s disposal. Local-first is becoming what offline-first became for web apps a decade ago: a default, not a posture.',
          'The magazine should stop leaning on it as a moat. It is now a feature of the ecosystem, not a feature of the substrate.',
        ],
      },
      {
        heading: 'WHAT STAYS VALUABLE WHEN THE MODEL LAYER IS CHEAP',
        headingJp: '残るもの',
        paragraphs: [
          'When the model layer commoditizes, value flows to the layers that do not. Three layers stay scarce:',
          'The substrate underneath the agent. Audit log, regulatory verifier, content-addressed envelopes, material-gate approval. Not features of any model; features of what surrounds the model in production. Open-weight Gemma 4 needs the same audit substrate as closed Claude does, when it is the agent in a regulated workflow.',
          'The curation discipline. Which 100 skills do you keep? Which 570 do you cut? What did the cut cost, and was the bet right? The evidence-driven posture kbot took at 4.0 was not a feature of any model. It was a posture about which behaviors a tool should ship with.',
          'The editorial frame. The work of reading what landed in the field, naming what it means, and putting language into circulation. Tim O\'Reilly\'s practice for forty years. Not displaced by cheaper models. If anything, made more important by them; the more models that exist, the more the field needs language to organize itself around.',
        ],
      },
      {
        heading: 'THE DISCIPLINE WAS ALWAYS BELOW THE MODEL',
        headingJp: '元から下にあった',
        paragraphs: [
          'Provenance engineering, as named in ISSUE 381, was never about the model. It was about the substrate the model calls into and the substrate the model is called from. Read the role definition again: the engineering question a provenance engineer answers is what the agent saw, asked, computed, decided, and got approved for. The model produces the answers. The substrate produces the proof.',
          'This week made it obvious. When three open-weight model releases land in one week and all of them are capable enough for production use, the question of which model an agent is built on stops being load-bearing. The question that stays load-bearing is the one underneath: can the action be replayed under audit. The model layer commoditized; the substrate layer did not.',
          'The bet placed in 381 was the right level of the stack. The events of this week make that case better than any argument could.',
          '街のコーダーたちへ — 下の層は商品にならない。',
        ],
      },
    ],

    signoff: '街のコーダーたちへ — 下の層は商品にならない。',
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
