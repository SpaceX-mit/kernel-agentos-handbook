# @kernel.chat/prompt-evolver

> GEPA-style prompt self-optimization for AI agents. Prompts evolve from
> execution traces — auto-mutate, measure, rollback bad changes. **Zero LLM
> calls.**

Part of the [kernel.chat](https://kernel.chat) open-source stack. Used by
`@kernel.chat/kbot` to let specialist prompts improve in place without a
human in the loop.

## Why this exists

Prompt iteration is usually a human-in-the-loop process: read failures,
hypothesize a fix, edit the prompt, retest. That loop is slow and doesn't
scale across dozens of specialists.

This package codifies an alternative: feed execution traces in, let the
evolver propose small mutations, measure them in production, and roll back
any mutation whose success rate regresses past a threshold. The whole loop
is deterministic — no model call ever — so it costs nothing per evolution
step.

The pattern is loosely modeled on GEPA (Genetic-Evolutionary Prompt
Augmentation) but simplified for production use.

## Install

```bash
npm install @kernel.chat/prompt-evolver
```

## Usage

```ts
import { PromptEvolver } from '@kernel.chat/prompt-evolver'

const evolver = new PromptEvolver({
  // Optional: see EvolverConfig type for thresholds, rollback windows, etc.
})

// Feed in execution traces — successes and failures both.
evolver.recordTrace({
  agent: 'researcher',
  promptHash: 'sha256:...',
  outcome: 'success',
  // ...additional fields per Trace interface
})

// Ask the evolver to propose a mutation for an agent's prompt.
const mutation = evolver.evolve('researcher')
if (mutation) {
  // Apply mutation.amendment to the live prompt and start measuring.
}

// Periodically check whether any mutation should be rolled back.
const rollback = evolver.checkRollback('researcher')
if (rollback) {
  // Revert and record the failure.
}

// Get the current prompt amendment for an agent (the active set of mutations).
const amendment = evolver.getAmendment('researcher')

// Persist state across runs.
evolver.save('./evolver-state.json')
evolver.load('./evolver-state.json')

// Inspect what's happening.
console.log(evolver.summary())
```

## Public API

| Export | Shape |
|---|---|
| `PromptEvolver` | Main class — `recordTrace`, `evolve`, `checkRollback`, `getActiveMutations`, `getAmendment`, `getGeneration`, `toJSON`/`fromJSON`, `save`/`load`, `summary` |
| `Trace` | Interface — what you feed into `recordTrace` |
| `Mutation` | Interface — what `evolve()` and `checkRollback()` return |
| `EvolverConfig` | Interface — constructor config |
| `EvolverState` | Interface — serialized state shape |

## Status

**v1.0.x — production use inside `@kernel.chat/kbot`; light external test
coverage.** The core algorithm has been running in production behind kbot
since early 2026. The public API is stable. External test suite is being
expanded in v1.1.

If you're using this outside kernel.chat and hit edge cases, file an issue
at [github.com/isaacsight/kernel](https://github.com/isaacsight/kernel/issues).

## Related packages

| Package | Discipline |
|---|---|
| [@kernel.chat/kbot](https://www.npmjs.com/package/@kernel.chat/kbot) | The agent itself |
| [@kernel.chat/memory-tiers](https://www.npmjs.com/package/@kernel.chat/memory-tiers) | Three-tier memory (observations → reflections → identity) |
| [@kernel.chat/skill-router](https://www.npmjs.com/package/@kernel.chat/skill-router) | Bayesian routing across specialists |
| [@kernel.chat/tool-forge](https://www.npmjs.com/package/@kernel.chat/tool-forge) | Runtime tool creation |

See [`docs/agentic-engineering.md`](https://github.com/isaacsight/kernel/blob/main/docs/agentic-engineering.md)
for the field map this package sits inside.

## License

MIT.
