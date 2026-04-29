# kbot futures — v5 architectural skeleton

The v5 plan in [`V5_FUTURES_PLAN.md`](../../V5_FUTURES_PLAN.md), shipped as code.

Six modules under `src/futures/`, each mapped to a paper or signal published in late April 2026. All opt-in, additive, reversible. None changes default agent behavior unless explicitly invoked. All tests are stub-driven; nothing in here calls a real LLM.

| Module | Source | Status (4.1.0) |
|---|---|---|
| [`harness/`](./harness/) | Sylph.AI ["The Last Harness You'll Ever Build"](https://arxiv.org/abs/2604.21003) | ✅ Phase 1 — types + inner/outer loop + critic adapter + JSONL persistence + no-op evolution agent |
| [`skill-graph/`](./skill-graph/) | Tencent Hunyuan ["Toward Scalable Terminal Task Synthesis"](https://arxiv.org/abs/2604.25727) | ✅ types + buildGraph + samplePath + findPaths + pathToTask synthesis |
| [`latent-state/`](./latent-state/) | Stanford / UIUC / NVIDIA / MIT ["Recursive Multi-Agent Systems"](https://arxiv.org/abs/2604.25917) | ✅ envelope + serialize/deserialize/merge/withProvenance + sha256-hash verification |
| [`forecast/`](./forecast/) | Custom — projects growth signals forward | ✅ Signal/Trend/Forecast/Horizon types + linear/exp/flat projection + synthesize + narrative |
| [`persona/`](./persona/) | Cequence Agent Personas | ✅ types + canInvoke + enforce + mergePersonas + 3 reference personas (researcher/coder/computer-use) |
| [`debate/`](./debate/) | Plurai BARRED ([2604.25203](https://arxiv.org/abs/2604.25203)) | ✅ asymmetric runner + injectable LLMClient + JSONL synthesis pipeline |

## How they compose

The unifying frame from the plan: **kbot becomes a self-improving harness, not a collection of tools.**

```
                    ┌────────────────┐
                    │  Persona       │ ← gates tool invocation
                    └───────┬────────┘
                            │
┌────────┐  invokes  ┌──────▼──────────────┐  evaluates  ┌────────────┐
│  User  │──────────▶│  Worker (kbot agent)│────────────▶│  Evaluator │
└────────┘           │  + Harness          │             │ (critic-   │
                     └──────┬──────────────┘             │  gate)     │
                            │ trace                       └─────┬──────┘
                            ▼                                    │
                     ┌─────────────┐  records                    │
                     │ persistence │◀───────────────────────────┘
                     │  JSONL      │
                     └─────────────┘
                            │
                            ▼ history
                     ┌─────────────────┐
                     │ EvolutionAgent  │ → new Harness
                     │ (no-op today)   │
                     └─────────────────┘

      ┌────────────┐               ┌──────────────────┐
      │ skill-graph│ samples paths │  forecast        │ projects growth
      └─────┬──────┘                │  signals forward │
            │ → Task                └──────────────────┘
            ▼
      ┌────────────┐
      │  harness   │ runs the Task in the loop
      └────────────┘

      ┌──────────┐
      │  debate  │ generates training data → fine-tunes the Evaluator
      └──────────┘

      ┌─────────────────┐
      │  latent-state   │ wraps inter-agent handoffs (a2a / agent-protocol)
      └─────────────────┘
```

## Public API

`packages/kbot/src/futures/index.ts` re-exports each module under a namespace:

```ts
import { harness, skillGraph, latentState, forecast, persona, debate } from '@kernel.chat/kbot/futures'

// Run the Sylph evolution loop on a task
const result = await harness.runEvolutionLoop(protocol, task)

// Sample a synthetic task from the skill graph
const path = skillGraph.samplePath(g, { start: 'investigate', seed: 42 })
const synthTask = skillGraph.pathToTask(path)

// Project growth signals forward
const forecasts = forecast.synthesizeForecasts(signals, '30d')
console.log(forecast.narrative(forecasts))

// Gate tool invocation by persona
const verdict = persona.canInvoke(persona.RESEARCHER, 'web_search', { q: 'X' })

// Run a BARRED-style debate (with an injected LLM client)
const v = await debate.runDebate({ candidate: '...' }, { client, maxRounds: 4 })

// Wrap an agent-to-agent handoff in a typed envelope
const env = latentState.createEnvelope({ from: 'a', to: 'b', text: '...' })
```

## Testing

Every module is fully testable without a network connection. Stubs everywhere:
- `harness/`: in-memory Worker + Evaluator
- `skill-graph/`: pure data structure
- `latent-state/`: pure functions
- `forecast/`: synthetic Signal[]
- `persona/`: pure check; rate limit Map is process-scoped
- `debate/`: injected LLMClient stub

```bash
cd packages/kbot
npx vitest run src/futures/
```

95 tests, all deterministic, ~150ms total.

## What's NOT in here (deliberately)

- Real EvolutionAgent codegen — interface shipped, implementation deferred
- Recursive MAS latent-thought training — needs model-side support
- TCOD on-policy distillation — needs custom local model + GPU
- Terminal-Bench evaluation — separate effort

## Roadmap

- **4.1.0** (this release) — Phase 1 + Phase 2 + Phase 3 modules all shipped as substrate
- **4.2.0** — wire `forecast/` into the `growth_summary` tool surface; persona enforcement in `permissions.ts`; meta-evolution outer loop
- **4.3.0** — first real EvolutionAgent (rule-based harness mutations, not codegen)
- **5.0.0** — when the modules graduate from `futures/` to first-class subsystems

The `futures/` namespace exists exactly because some of these will graduate and some will not.
