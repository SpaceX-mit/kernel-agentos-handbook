# @kernel.chat/tool-forge

> Runtime tool creation for AI agents. Define new tools from natural
> language descriptions at runtime — no restart needed. The agent builds
> its own tools.

Part of the [kernel.chat](https://kernel.chat) open-source stack. Used by
`@kernel.chat/kbot` to let agents extend their own capability set during a
session.

## Why this exists

Most agent toolkits ship a fixed tool registry compiled into the binary.
Extending the registry means a new release. That's the wrong granularity
for an agent that should be able to say "I need a tool that does X" and
make it exist three seconds later.

This package lets you create, replace, and remove tool definitions at
runtime. Every tool tracks its own metrics (success rate, latency, error
counts) so the agent can decide which of its self-built tools are worth
keeping and which to retire.

## Install

```bash
npm install @kernel.chat/tool-forge
```

## Usage

```ts
import { ToolForge, TEMPLATES } from '@kernel.chat/tool-forge'

const forge = new ToolForge()

// Create a new tool at runtime.
forge.create({
  name: 'count_words',
  description: 'Count the words in a string',
  tags: ['text', 'utility'],
  parameters: [
    { name: 'text', type: 'string', required: true, description: 'Text to count' },
  ],
  handler: async (args) => {
    const text = args['text'] as string
    return { result: text.trim().split(/\s+/).filter(Boolean).length }
  },
})

// Execute it.
const result = await forge.execute('count_words', { text: 'hello world' })
console.log(result) // { ok: true, result: 2, durationMs: ... }

// Inspect what's available.
const all = forge.list()
const utilities = forge.listByTag('utility')

// Replace, remove, query.
forge.replace({ ...newDef })
forge.remove('count_words')
forge.has('count_words')
forge.get('count_words')

// Read metrics to decide which tools are paying their keep.
const metrics = forge.getMetrics('count_words')
// → { calls: N, errors: N, avgDurationMs: ..., lastUsed: ... }

// Persist the tool registry.
forge.save('./forge-state.json')
```

## Templates

The exported `TEMPLATES` object includes a small set of starter tool
shapes (HTTP fetch, JSON parse, regex extract, math eval). Use them as
starting points when scaffolding new tools.

## Public API

| Export | Shape |
|---|---|
| `ToolForge` | Main class — `create`, `replace`, `remove`, `has`, `get`, `list`, `listByTag`, `execute`, `getMetrics`, `toJSON`, `save` |
| `TEMPLATES` | Pre-built starter tool definitions |
| `ToolDefinition` | What `create()` accepts |
| `ToolParameter` | Parameter spec inside a definition |
| `ToolResult` | What `execute()` returns |
| `ToolMetrics` | Per-tool usage telemetry |
| `ToolManifest` | List-view shape (no handler) |

## Status

**v1.0.x — production use inside `@kernel.chat/kbot`; light external test
coverage.** The runtime-tool pattern has been driving kbot's self-extension
loop since early 2026. The public API is stable. External test suite
expanded in v1.1.

File issues at [github.com/isaacsight/kernel](https://github.com/isaacsight/kernel/issues).

## Related packages

| Package | Discipline |
|---|---|
| [@kernel.chat/kbot](https://www.npmjs.com/package/@kernel.chat/kbot) | The agent itself |
| [@kernel.chat/agent-os](https://www.npmjs.com/package/@kernel.chat/agent-os) | System primitives (permissions, namespaces, quotas) |
| [@kernel.chat/prompt-evolver](https://www.npmjs.com/package/@kernel.chat/prompt-evolver) | Prompt self-optimization from traces |
| [@kernel.chat/skill-router](https://www.npmjs.com/package/@kernel.chat/skill-router) | Bayesian routing across specialists |

See [`docs/agentic-engineering.md`](https://github.com/isaacsight/kernel/blob/main/docs/agentic-engineering.md)
for the field map this package sits inside.

## License

MIT.
