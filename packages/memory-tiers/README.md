# @kernel.chat/memory-tiers

> Three-tier generative memory for AI agents: observations → reflections →
> identity. Based on Stanford's *Generative Agents* paper. **Zero LLM calls.**

Part of the [kernel.chat](https://kernel.chat) open-source stack. Used by
`@kernel.chat/kbot` to give specialist agents a persistent sense of what
they've seen, what it means, and who they're becoming over time.

## Why three tiers

Single-tier memory (a flat log of everything) doesn't scale: every query
re-scans the whole history. Two-tier memory (raw + summary) loses the why
behind the what.

This package implements three tiers, each derived from the one below:

1. **Observations** — raw events the agent encountered (user asked X,
   tool returned Y, error Z occurred). Append-only.
2. **Reflections** — synthesized patterns across observations
   ("the user often asks about Polymarket on Fridays"). Generated
   periodically by deterministic summarization rules.
3. **Identity** — durable traits that emerge from reflections over time
   ("treats every regulated-industry question as audit-grade by default").
   The slowest-changing layer; the agent's working self-model.

The synthesis between tiers is rule-based and deterministic — no LLM call.
This makes it cheap to run continuously and replayable for audit.

## Install

```bash
npm install @kernel.chat/memory-tiers
```

## Usage

```ts
import { MemorySystem } from '@kernel.chat/memory-tiers'

const memory = new MemorySystem({
  // Optional config — thresholds for synthesis cadence, retention, etc.
})

// Tier 1 — feed observations as they happen.
memory.observe('User asked about Polymarket Trump 2028 odds', 'query', {
  threadId: 'abc',
})
memory.observe('Tool call: polymarket_query succeeded in 312ms', 'tool')

// Tier 2 — periodically synthesize reflections.
const reflections = memory.synthesize()

// Tier 3 — let reflections accumulate into identity.
const identity = memory.evolve()

// Read each tier back.
const observations = memory.getObservations('query')
const allReflections = memory.getReflections()
const traits = memory.getIdentity()

// Persist across runs.
memory.save('./memory.json')
memory.load('./memory.json')

// Inspect.
console.log(memory.summary())
console.log(memory.getStats())
```

## Public API

| Export | Shape |
|---|---|
| `MemorySystem` | Main class — `observe`, `getObservations`, `synthesize`, `getReflections`, `evolve`, `getIdentity`, `toJSON`/`fromJSON`, `save`/`load`, `getStats`, `summary` |
| `Observation` | Tier 1 entry |
| `ObservationCategory` | Union of categories (query, tool, error, etc.) |
| `Reflection` | Tier 2 entry |
| `IdentityTrait` | Tier 3 entry |
| `MemoryState` | Serialized state shape |
| `MemoryConfig` | Constructor config |

## Status

**v1.0.x — production use inside `@kernel.chat/kbot`; light external test
coverage.** The three-tier model has been running in kbot since early 2026.
The public API is stable. External test suite expanded in v1.1.

File issues at [github.com/isaacsight/kernel](https://github.com/isaacsight/kernel/issues)
if you hit edge cases outside the kernel.chat usage path.

## Related packages

| Package | Discipline |
|---|---|
| [@kernel.chat/kbot](https://www.npmjs.com/package/@kernel.chat/kbot) | The agent itself |
| [@kernel.chat/prompt-evolver](https://www.npmjs.com/package/@kernel.chat/prompt-evolver) | Prompt self-optimization from traces |
| [@kernel.chat/skill-router](https://www.npmjs.com/package/@kernel.chat/skill-router) | Bayesian routing across specialists |
| [@kernel.chat/tool-forge](https://www.npmjs.com/package/@kernel.chat/tool-forge) | Runtime tool creation |

See [`docs/agentic-engineering.md`](https://github.com/isaacsight/kernel/blob/main/docs/agentic-engineering.md)
for the field map this package sits inside.

## License

MIT.
