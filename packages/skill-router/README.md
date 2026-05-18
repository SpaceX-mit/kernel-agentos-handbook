# @kernel.chat/skill-router

> Bayesian skill-rating router for AI agents. Routes tasks to the best
> specialist using TrueSkill-style ratings that improve with every
> interaction. **Zero LLM calls.**

Part of the [kernel.chat](https://kernel.chat) open-source stack. Used by
`@kernel.chat/kbot` to pick the right specialist for an incoming message
without burning a model call on the routing decision itself.

## Why this exists

Most multi-agent systems route by hardcoded rules (`if intent === 'code'
then coder`) or by an LLM call on every message (slow and expensive). This
package gives you a third option: a Bayesian rating maintained per agent
per category. Routing is a constant-time lookup; ratings update from
outcomes.

After a few hundred interactions the router's confidence in its
assignments is high enough that routing decisions are effectively free.

## Install

```bash
npm install @kernel.chat/skill-router
```

## Usage

```ts
import { SkillRouter, createDefaultRouter } from '@kernel.chat/skill-router'

// Quick start with sensible defaults.
const router = createDefaultRouter()

// Or build your own with explicit config.
const customRouter = new SkillRouter({
  agents: ['coder', 'researcher', 'writer', 'analyst'],
  categories: ['code', 'research', 'writing', 'analysis'],
  // ...config per SkillRouterConfig interface
})

// Categorize an incoming message.
const category = router.categorize('Refactor this function for readability')
// → 'code'

// Route the message to the best agent.
const { agent, confidence, score } = router.route(
  'Refactor this function for readability',
)

// Or route only if confidence is high enough.
const decision = router.routeWithThreshold(message, 0.7)
if (decision) {
  // Dispatch to decision.agent
} else {
  // Fall back to broader routing
}

// After the agent handles the message, record the outcome.
router.recordOutcome(agent, category, 'win')   // 'win' | 'loss' | 'draw'

// Inspect ratings.
const rating = router.getRating('coder', 'code')
const allRatings = router.getAgentRatings('coder')
const topCoders = router.getTopAgents('code', 3)
const systemConfidence = router.getSystemConfidence()

// Persist.
router.save('./router-state.json')
router.load('./router-state.json')
```

## Public API

| Export | Shape |
|---|---|
| `SkillRouter` | Main class — `categorize`, `route`, `routeWithThreshold`, `recordOutcome`, `getRating`, `getAgentRatings`, `getTopAgents`, `getSystemConfidence`, `toJSON`/`fromJSON`, `save`/`load`, `isDirty` |
| `createDefaultRouter()` | Factory returning a SkillRouter pre-seeded with kbot's specialist set |
| `Rating` | Per-agent-per-category rating |
| `Outcome` | `'win' \| 'loss' \| 'draw'` |
| `RouteResult` | What `route()` returns |
| `SkillRouterConfig` | Constructor config |

## Status

**v1.0.x — production use inside `@kernel.chat/kbot`; light external test
coverage.** The router has been driving kbot's specialist selection since
early 2026. The public API is stable. External test suite expanded in
v1.1.

File issues at [github.com/isaacsight/kernel](https://github.com/isaacsight/kernel/issues).

## Related packages

| Package | Discipline |
|---|---|
| [@kernel.chat/kbot](https://www.npmjs.com/package/@kernel.chat/kbot) | The agent itself |
| [@kernel.chat/kbot-orchestrator](https://www.npmjs.com/package/@kernel.chat/kbot-orchestrator) | Pipeline orchestration |
| [@kernel.chat/prompt-evolver](https://www.npmjs.com/package/@kernel.chat/prompt-evolver) | Prompt self-optimization from traces |
| [@kernel.chat/memory-tiers](https://www.npmjs.com/package/@kernel.chat/memory-tiers) | Three-tier memory |
| [@kernel.chat/tool-forge](https://www.npmjs.com/package/@kernel.chat/tool-forge) | Runtime tool creation |

See [`docs/agentic-engineering.md`](https://github.com/isaacsight/kernel/blob/main/docs/agentic-engineering.md)
for the field map this package sits inside.

## License

MIT.
