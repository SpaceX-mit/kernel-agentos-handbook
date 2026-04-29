# `futures/harness` — Self-Improving Harness Substrate

Phase 1 of the V5 futures plan. Implements Algorithm 1 (inner loop) and
Algorithm 2 (outer loop) from "The Last Harness You'll Ever Build"
(Sylph.AI, arXiv:2604.21003), adapted onto kbot's existing pieces.

> **Frame**: `Agent = Model + Harness`. The harness is everything around the
> model — prompts, tools, hooks, model routing, hyperparameters. This module
> makes the harness explicit data so it can be diffed, persisted, scored,
> and (eventually) rewritten.

## What's here

| File | Role |
| --- | --- |
| `types.ts` | Contract — `Worker`, `Evaluator`, `EvolutionAgent`, `Harness`, `Task`, etc. **Do not edit.** |
| `evolution-loop.ts` | `runEvolutionLoop(protocol, task)` — Worker → Evaluator → EvolutionAgent loop with early stop + revert. |
| `meta-evolution.ts` | `runMetaEvolution(protocol, tasks)` — outer loop across a portfolio of tasks. |
| `critic-evaluator.ts` | Adapter that wraps `critic-gate.ts` to satisfy `Evaluator`. Gives critic-gate a real job. |
| `noop-evolution.ts` | `NoopEvolutionAgent` — records but never rewrites. The substrate ships even without real codegen. |
| `persistence.ts` | JSONL trace persistence at `~/.kbot/futures/harness/<task-id>.jsonl`. |
| `index.ts` | Public surface. |
| `evolution-loop.test.ts` | vitest, fully deterministic with stub Worker/Evaluator/EvolutionAgent. |

## Inner loop (one task)

```ts
import { runEvolutionLoop, NoopEvolutionAgent, createCriticEvaluator } from './index.js'

const result = await runEvolutionLoop(
  {
    worker: myWorker,                       // adapter around agent.ts
    evaluator: createCriticEvaluator(),     // wraps critic-gate
    evolution: new NoopEvolutionAgent(),    // ship the substrate; real evolver later
    initialHarness: { id: 'h0', /* … */ },
    hyperparams: { maxIterations: 5, earlyStopScore: 1 },
  },
  { id: 'task-1', instructions: 'fix the bug', acceptance: ['tests pass'] },
  { persistDir: undefined /* default ~/.kbot/futures/harness */ },
)
console.log(result.bestScore, result.history.length)
```

## Outer loop (portfolio)

```ts
import { runMetaEvolution } from './index.js'
const meta = await runMetaEvolution(protocol, [task1, task2, task3])
console.log(meta.bestMetaScore, meta.perTask.length)
```

## What ships even with a no-op EvolutionAgent

- Structured trace history, persisted as JSONL
- Harness versioning by `harness.id`
- Per-iteration verdict labels (`improved` / `regressed` / `no-op`)
- Best-harness tracking + revert-on-regression
- Critic-gate now grades whole traces, not just isolated tool calls

The interface is shipped; real harness rewriting can land incrementally
without changing this contract.

## See also

- `../../V5_FUTURES_PLAN.md` for the full multi-module plan
- `../../critic-gate.ts` for the gate this evaluator wraps
- `src/planner/hierarchical/persistence.ts` — sibling persistence pattern
