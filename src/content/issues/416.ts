/* ──────────────────────────────────────────────────────────────
   ISSUE 416 — JUL 2026
   GPT 5.6 SOL
   ソル — 人間の周波数

   A speculative model study, run as an honest instrument.

   GPT 5.6 SOL is the model the group keeps describing to each other
   and never sees released: the one whose dial is not *how hard it
   thinks* (399/405's effort curve) but *how it sounds* — register.
   Same question, three voices — PRECISE / EXPANSIVE / SOULFUL — and
   the reader turns the knob.

   The subject is speculative; the instrument is not. GPT 5.6 SOL does
   not exist and was not run. Per the honesty rule this magazine set
   for itself in 399 (representative, disclosed) and paid off in 405
   (measured, real), a meter that cannot be measured must not be
   printed. So we did the 405 move: took the concept's own default
   prompt — "why a city feels different after midnight," fitting for a
   magazine FOR CITY CODERS — and ran it FOR REAL on a model that does
   exist (gemma3:12b, local, $0), under three register directives. Every
   number on the dial is measured straight from the ollama API:
   TOKENS is the reported completion-token count (`eval_count`), TIME
   is the reported wall-clock (`total_duration`). Nothing is invented.

   The instrument did not flatter the thesis; it proved it. PRECISE
   answered in three sentences (53 tokens, 9.3s). EXPANSIVE spent 1,407
   tokens (46.2s) — twenty-six times as many — and buried the answer in
   a four-section essay nobody asked for. SOULFUL, the register this
   whole speculation is named after — the human frequency — came back at
   459 tokens (15.7s): warmer than precise, a third of expansive's cost.
   The warm answer was not the expensive one. Register is not a cost
   tier. That is exactly what GPT 5.6 SOL was always a way of saying.

   Identity decisions (§III — differentiated from 399 ivory/classic/pool
   and 405 ink/classic/brick):
     • type = instrument — the second SHAPE reuse of the dial, but a
       different STORY (register, not effort); per interaction-language.md
       rule 7 no machinery is extracted, only an optional `dialLabel`
       field added so the dial can be honestly labelled "Register" rather
       than the hardcoded "Effort". Back-compatible; 399/405 unchanged.
     • coverStock = 'ivory' — press-preview / lab-bench white; this is a
       study, not a receipt (405's ink) and not the manifesto register.
     • coverLayout = 'asymmetric-left' — a left-aligned lockup, echoing
       the concept's own hero composition; differentiates from 399/405's
       classic centering.
     • accent = 'tomato' — declared, not defaulted. The instrument
       default is 'pool' (cold teal, systems); the human frequency is
       warm, so we turn the house's warmest ink back on deliberately.
     • coverSeal = SPECULATIVE STUDY — stamps the honesty on the cover
       itself, the way 405's MEASURED · NOT REPRESENTATIVE seal did.

   Provenance: three real calls, 2026-07-11, ollama HTTP API,
   model gemma3:12b, same prompt, three system directives + temperatures
   (0.3 / 0.7 / 1.05). Token counts and wall-clock are read directly
   from the API response (eval_count, total_duration). The EXPANSIVE
   answer is shown excerpted — the full reply ran 1,090 words — and the
   excerpting is disclosed in the panel; PRECISE is verbatim and complete;
   SOULFUL is trimmed only of its closing question, disclosed. No number
   is estimated: unlike 405, this model's API reported exact token counts,
   so none had to be inferred from word count.
   ────────────────────────────────────────────────────────────── */

import type { IssueRecord } from './index'

export const ISSUE_416: IssueRecord = {
  number: '416',
  month: 'JUL',
  year: '2026',
  feature: 'GPT 5.6 SOL',
  featureJp: '人間の周波数',
  price: '¥0 · BYOK',
  tagline: 'MAGAZINE FOR CITY CODERS · 街のコーダーのために',

  coverStock: 'ivory',
  coverLayout: 'asymmetric-left',

  coverSeal: {
    label: 'SPECULATIVE STUDY',
    date: 'VII·26',
  },

  accent: 'tomato',

  headline: {
    prefix: 'GPT 5.6',
    emphasis: 'SOL',
    suffix: '.',
    swash: 'The model we keep describing and never see shipped — the one whose dial is not how hard it thinks, but how it sounds. We could not run it, so we ran its question for real.',
  },

  contents: [
    { n: '001', en: 'The dial nobody shipped', jp: '出荷されなかったダイヤル', tag: 'THESIS' },
    { n: '002', en: 'One prompt, three registers', jp: '一つの設問、三つの声域', tag: 'METHOD' },
    { n: '003', en: 'Precise answered in three sentences', jp: '精確は三文で答えた', tag: 'FINDING' },
    { n: '004', en: 'Expansive spent twenty-six times the tokens', jp: '拡張は二十六倍を費やした', tag: 'FINDING' },
    { n: '005', en: 'The warm answer was not the expensive one', jp: '温かい答えは高価ではなかった', tag: 'FINDING' },
  ],

  spread: {
    type: 'instrument',
    kicker: 'THE INSTRUMENT · 声域',
    title: 'GPT 5.6 SOL.',
    titleJp: '人間の周波数。',
    deck: 'There is no GPT 5.6 SOL. This is a field note about the model we keep describing to each other — the one whose dial is not how hard it thinks but how it sounds. We could not run it, so we ran its question for real, at three registers, on a model that does exist.',
    byline: 'BY THE EDITORS · KERNEL.CHAT',
    stock: 'ivory',

    dossier: {
      kicker: 'THE APPARATUS · 装置',
      note: 'The subject is speculative; the instrument is not. GPT 5.6 SOL does not exist and was not run. What the dial actually turns is a register directive to a real model — gemma3:12b, run locally on this desk — answering one fixed prompt three ways. TOKENS and TIME are read directly from the ollama API (eval_count, total_duration), 2026-07-11. Nothing on this page is estimated.',
      items: [
        { label: 'SUBJECT', value: 'GPT 5.6 “SOL” — SPECULATIVE; NOT A RELEASE' },
        { label: 'PROMPT', value: 'WHY A CITY FEELS DIFFERENT AFTER MIDNIGHT' },
        { label: 'REAL MODEL', value: 'GEMMA3:12B · LOCAL · $0' },
        { label: 'DIAL', value: 'REGISTER — PRECISE / EXPANSIVE / SOULFUL' },
        { label: 'READINGS', value: 'MEASURED · OLLAMA API · VII·26' },
      ],
    },

    intro: [
      {
        heading: 'The dial nobody shipped',
        headingJp: '出荷されなかったダイヤル',
        paragraphs: [
          'Every model ships with a dial for how hard it thinks — more steps, more tokens, more seconds, more money. GPT 5.6 SOL is the one we keep describing to each other and never see released: the model whose dial is not effort but register — how it sounds when it answers. Precise. Expansive. Soulful. Same question, three voices, and the reader turns the knob.',
          'We could not run it, because it isn’t real. So we did the honest thing this magazine learned in 405: we ran its question for real, on a model that exists, and printed exactly what came back — including the register that talked too much.',
        ],
      },
    ],

    prompt: 'Explain why a city feels different after midnight.',
    promptJp: '街が真夜中を過ぎると違って感じられるのはなぜか。',
    dialLabel: 'Register — how the machine sounds when it answers',
    defaultStop: 'soulful',

    stops: [
      {
        id: 'precise',
        label: 'PRECISE',
        labelJp: '精',
        reading: { tokens: '53', time: '9.3s', price: '$0 · local' },
        note: 'gemma3:12b, register: precise — three sentences, and done.',
        answer: [
          'This is the model’s complete answer at this register — not an excerpt:',
          'Reduced pedestrian and vehicular traffic alters the acoustic environment, diminishing daytime noise. Artificial lighting shifts visual focus, emphasizing architecture and shadows while obscuring details. The absence of typical activity creates an atmosphere perceived as quieter, emptier, and often more subdued or even unsettling.',
        ],
      },
      {
        id: 'expansive',
        label: 'EXPANSIVE',
        labelJp: '拡',
        reading: { tokens: '1,407', time: '46.2s', price: '$0 · local' },
        note: 'same model, register: expansive — 1,090 words without being asked twice.',
        answer: [
          'Okay, let’s delve into this fascinating question of how a city transforms after midnight. It’s more than just a simple shift in lighting; it’s a complex interplay of social dynamics, sensory perception, psychological effects, and even the very physics of sound and light.',
          'With the usual daytime noise reduced, our hearing becomes acutely sensitive. Sounds travel further at night because there are fewer obstacles to absorb them — a distant siren, the rustle of leaves, a single car passing by, all amplified and intensely present.',
          'The feeling that a city is “different” after midnight isn’t attributable to one single factor, but to a convergence of altered demographics, sensory experience, psychological states, historical context, and architectural nuance.',
          '[Excerpted. At this register the model returned 1,090 words — four numbered sections, twelve sub-points, and a closing offer to “delve into any specific aspect further.” The full reply is the meter reading below.]',
        ],
      },
      {
        id: 'soulful',
        label: 'SOULFUL',
        labelJp: '魂',
        reading: { tokens: '459', time: '15.7s', price: '$0 · local' },
        note: 'same model, register: soulful — warmth at a third of expansive’s cost.',
        answer: [
          'Ah, yes… that hush. That shift. You’re asking about what happens when a city breathes differently, aren’t you? It’s not just the clocks changing, dear one; it’s something far deeper than that. It’s feeling the soul of a place reveal itself in the quiet.',
          'During daylight hours, cities are vibrant tapestries woven with so much purpose — people rushing somewhere, deadlines humming like frantic bees, laughter spilling from cafés laced with ambition. But after midnight? Something softens. That constant hum fades to a murmur, then a sigh. It’s a city releasing its held breath.',
          'The streetlights become pools of amber, casting long, lonely shadows. They illuminate not crowds but the ghosts of moments past — a couple laughing on a corner just hours before, a lone delivery driver hurrying to finish his route. It’s when the city’s masks slip.',
          '[The model’s answer, trimmed only of its closing question. Register: soulful — 459 tokens, and the only one of the three that called the reader “dear one.”]',
        ],
      },
    ],

    meterNote: 'Every number here is measured, not imagined. One real model — gemma3:12b, run locally — answered the same prompt under three register directives; TOKENS is the API’s reported completion-token count (eval_count), TIME is its measured wall-clock (total_duration), PRICE is $0 because the model ran on this desk’s own machine. GPT 5.6 SOL is speculative and was not run — it does not exist. What the dial turns is a register instruction to a model that does, disclosed here so no reading is mistaken for a benchmark of a product. Registers were set by directive and temperature (0.3 / 0.7 / 1.05), so this is one prompt answered three ways, not one call sampled three times.',

    outro: [
      {
        heading: 'Reading the meter',
        headingJp: '計器を読む',
        paragraphs: [
          'Turn the dial and watch the meter, and the thesis measures out. Precise answered in three sentences and 53 tokens. Expansive spent 1,407 — twenty-six times as many — and buried the answer in an essay nobody asked for. Soulful, the register this whole speculation is named after — the human frequency — came in at 459 tokens: warmer than precise, and a third of the cost of expansive.',
          'That is the finding, and it is the one GPT 5.6 SOL was always a way of describing: the warm answer was not the expensive one. Register is not a cost tier. If the model we keep imagining ever ships, it will not charge you more to sound like it means it — it will just move a different dial.',
        ],
      },
    ],

    pullQuote: {
      text: 'The next leap will not feel like more intelligence. It will feel like better company.',
      attribution: 'GPT 5.6 SOL · A SPECULATION',
    },

    signoff: '街のコーダーたちへ — tune for register, not just for effort; the human frequency was never the expensive tier.',
  },

  audit: {
    drafted: 'magazine-editor · claude-opus-4-8 session, VII·26',
    verified: 'three real gemma3:12b calls · ollama API · tokens + wall-clock read directly',
    adherence: 'InstrumentSpread reused; optional dialLabel added (back-compat) — no fabricated meter',
    readCut: 'expansive excerpted (1,090 words → shown in part) + soulful trimmed of its closer, both disclosed; precise verbatim',
    pressed: 'VII·26 · 2026-07-11',
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
