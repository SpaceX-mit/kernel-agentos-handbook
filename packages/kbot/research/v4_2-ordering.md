# kbot 4.2 — Substrate-to-Product Hop Ordering

**Status**: research brief (planning, no code edits)
**Date**: 2026-04-25
**Audience**: project-internal
**Predecessor**: 4.1.1 — `forecast_summary` tool, the first hop from `src/futures/` substrate to product surface

---

## TL;DR

- **Recommended option**: **D — synthesis** (persona → debate → harness → skill-graph → latent-state).
- **First 4.2.0 hop**: `persona/` into `permissions.ts` (one CLI flag, immediate user-felt security improvement).
- **Highest-strategic hop**: `debate/` — generates the JSONL training data that finally lets us flip on `critic-gate` (longest-running flag in the codebase).
- **Release cadence**: **patch sequence** (4.2.0 … 4.2.4), one hop per release, paced ~daily. Batched minor risks compounding regression surface.
- **Module that needs more substrate before it can hop**: `debate/` — the runner is complete, but production use needs an injectable `LLMClient` adapter that routes through the existing critic provider (`critic-gate.ts:resolveCriticProvider`). ~80 LOC of glue.

---

## 1. The five remaining substrate modules — current state

### `harness/` — Sylph evolution loop

**What ships today** (~970 LOC across 9 files):
- `evolution-loop.ts` (203 LOC): `runEvolutionLoop(protocol, task)` — Worker → Evaluator → EvolutionAgent inner loop with early-stop and revert-on-regression.
- `meta-evolution.ts` (82 LOC): outer loop across a portfolio of tasks.
- `critic-evaluator.ts` (156 LOC): adapter that wraps `critic-gate.gateToolResult` to satisfy the `Evaluator` interface — meaning critic-gate already has a "real job" inside the harness even before it's flipped on for live agents.
- `noop-evolution.ts` (36 LOC): records but never rewrites the harness — ships substrate without real codegen.
- `persistence.ts` (109 LOC): JSONL trace at `~/.kbot/futures/harness/<task-id>.jsonl`.
- `evolution-loop.test.ts` (185 LOC): vitest, fully deterministic, stub Worker/Evaluator.

**What's needed to become user-visible**: a `Worker` adapter around `runAgent` in `agent.ts` (2333 LOC), plus a `kbot evolve task <task>` subcommand in `cli.ts`. There's already an unrelated older `case 'evolve':` block at `cli.ts:5804` (uses `evolution.ts`) — the new flow needs a different verb (`kbot evolve task` or `kbot --evolve <task>`) to avoid colliding.

**Cost**: ~250 LOC + 4–6 hours. Mostly the Worker adapter (extracting agent traces into the `Trace` shape from `harness/types.ts`) and the CLI plumbing.

**Blockers**: none for the no-op evolver path. A *real* `EvolutionAgent` is out of scope for 4.2 (4.3 roadmap item per `futures/README.md:115`).

### `skill-graph/` — synthetic task generator

**What ships** (~543 LOC across 5 files):
- `graph.ts` (209 LOC): `buildGraph`, `addSkill`, `addScenario`, `addEdge`, `samplePath`, `findPaths`, Monte Carlo `pathLengthDistribution`.
- `synthesis.ts` (106 LOC): `pathToTask` — converts a `GraphPath` into a `harness/Task` with derived acceptance criteria.
- `graph.test.ts` (137 LOC).

**What's needed**: a `kbot skills graph` CLI subcommand that prints sampled paths, plus optional pretty rendering. Real value lands when this feeds `harness/` — i.e. depends on harness hopping first to be more than a curiosity.

**Cost**: ~150 LOC + 3–4 hours for a basic CLI surface. Add another ~100 LOC + 2 hours if we wire it to seed an actual eval suite.

**Blockers**: the bundled graph is empty by default — `buildGraph()` returns `{ nodes: new Map(), edges: [] }`. Productizing means seeding it with kbot's actual skill set (~30–50 nodes, hand-curated). That's content work, not engineering.

### `latent-state/` — typed agent-to-agent envelopes

**What ships** (~398 LOC across 4 files):
- `envelope.ts` (195 LOC): `createEnvelope`, `serialize`, `deserialize`, `merge`, `withProvenance`, `verifyHash` (sha-256 over `stableStringify`).
- `types.ts` (50 LOC): `LatentEnvelope`, `AgentTransfer`, `ProvenanceEntry`.

**What's needed**: integrate into `a2a.ts` (987 LOC) and `agent-protocol.ts` (802 LOC). Currently `agent-protocol.ts:50 createHandoff()` produces an untyped `Handoff` object; wrapping it in `LatentEnvelope` gives provenance + hash verification. `a2a.ts` JSON-RPC envelope (line 625) is a separate, established protocol — the futures envelope nests *inside* its `params` field rather than replacing it.

**Cost**: ~200 LOC + 4–6 hours. Touches a wide surface (every handoff site) but the changes are mechanical.

**Blockers**: none, but the value is invisible to end users — see §2.

### `persona/` — permission-gating personas

**What ships** (~683 LOC across 5 files):
- `check.ts` (243 LOC): `canInvoke(persona, toolName, args)` returns a `Verdict` with rate-limit enforcement (process-scoped `Map`), arg-rule validation (string/number/boolean/enum, allow- and deny-patterns), and blast-radius capping.
- `registry.ts` (129 LOC): three reference personas — `RESEARCHER` (read-only), `CODER` (read-write, denies `rm -rf`/force-push, 60 bash/min), `COMPUTER_USE` (destructive, 30/min on mouse/keyboard).
- `check.test.ts` (219 LOC).

**What's needed**: integrate as a *pre-tool hook* in `permissions.ts` (152 LOC). The current `permissions.ts` is regex-pattern-based, mode-based (`permissive | normal | strict`), and only knows about `bash` + `git_push`. Persona is a strictly more general formalism. The integration shape:

1. Add `--persona <id>` CLI flag in `cli.ts` (next to `--safe` at line 6082).
2. In `permissions.ts:checkPermission`, before the existing pattern check, run `canInvoke(activePersona, toolName, args)` and reject on `denied` verdict.
3. Plumb the active persona through `tool-pipeline.ts:permissionMiddleware` (already takes `(name, args) => Promise<boolean>` so this is closure-captured — no signature change).

**Cost**: ~120 LOC + 3 hours. The smallest hop with the most user-facing surface.

**Blockers**: none. This is the cleanest, most ready-to-ship module.

### `debate/` — adversarial-debate training-data generator

**What ships** (~614 LOC across 5 files):
- `runner.ts` (180 LOC): asymmetric 4-round debate (allow → block → allow → block → judge), with **injected** `LLMClient` (`opts.client.respond(prompt, role)`).
- `synthesis.ts` (93 LOC): `synthesizeTrainingData(inputs, opts)` + atomic JSONL write at `~/.kbot/futures/debate/<YYYY-MM-DD>.jsonl`.
- `runner.test.ts` (241 LOC) — uses a deterministic stub client.

**What's needed**:
1. An `LLMClient` adapter that wraps `critic-gate.ts:resolveCriticProvider` (lines 76–89). The provider already knows how to call Anthropic (`callAnthropic`) and OpenAI-compatible endpoints (`callOpenAICompat`). The debate just needs a thin shim that satisfies the `LLMClient` interface and handles the `role` parameter (passed for telemetry, not behavior).
2. A `kbot debate <input>` subcommand or `kbot_debate` tool registration (the pattern is in `tools/swarm-2026-04.ts:107` — a single `registerTool(...)` line plus the tool definition file).
3. A daily `cron`-style synthesis driver that walks recent agent traces, picks borderline tool outputs, and queues them as `DebateInput[]`.

**Cost**:
- LLM adapter: ~80 LOC + 2 hours.
- CLI/tool surface: ~100 LOC + 2 hours.
- Synthesis driver: ~150 LOC + 4 hours.
- **Total**: ~330 LOC + ~8 hours.

**Blockers**: this is the only module that needs *new substrate* before it can hop. The `LLMClient` adapter doesn't exist yet — `runner.ts` deliberately accepts an injected client and never imports a provider SDK. Until that adapter lands, `debate/` is fully testable but not deployable. Estimate: 2 hours of glue code.

---

## 2. User-visible value per hop

| Module | What the user feels | Value |
|---|---|---|
| `harness/` | Run `kbot evolve task <task>` → graded run with iteration history at `~/.kbot/futures/harness/`. Visible improvement loop, but most users won't care. | **Medium** |
| `skill-graph/` | `kbot skills graph` shows synthetic eval tasks. Useful for power users / agent authors only. | **Low** |
| `latent-state/` | Mostly invisible. Multi-agent handoffs become typed and verifiable. Hash-verified provenance is a back-end win. | **Low** |
| `persona/` | `kbot --persona researcher "research X"` → tools pre-gated, `rm -rf` denied at the planning layer not after the fact. Clear, immediate, frequent. | **High** |
| `debate/` | `kbot debate <input>` → JSONL training data for a fine-tune. Specialized; users won't run it directly, but its output unblocks `critic-gate` for everyone. | **Medium** (downstream-high) |

---

## 3. Strategic value per hop

| Module | What it unlocks | Strategic value |
|---|---|---|
| `harness/` | Every kbot session becomes a graded `Task`. Foundation for self-improvement loops. Pairs with `critic-evaluator.ts` to give critic-gate its first real job. | **High** |
| `skill-graph/` | Eval-suite generator. Foundation for regression testing kbot's tool selection (the original 4.1 motivation behind `learned-router.ts`). | **Medium** |
| `latent-state/` | Multi-agent v2 prep. Future-proofing for 5.0 agent mesh. Currently there's no acute pressure. | **Low (today)** |
| `persona/` | Kills a long-standing security backlog (privilege scoping). Enables enterprise pitch: "we ship per-task least-privilege out of the box." | **High** |
| `debate/` | Generates the data that lets us ship `critic-gate` (the longest-running flag — see `critic-gate.ts:8` "Hard disable: env KBOT_NO_CRITIC=1"). High strategic unlock. | **Highest** |

---

## 4. Recommended ordering — three options

### OPTION A — User-felt first
`persona → harness → skill-graph → debate → latent-state`

- **Timeline**: 5 days (3h, 6h, 5h, 8h, 6h).
- **Cumulative user-visible value**: High immediately (persona day 1), then a long tail of internal work.
- **Cumulative strategic value**: Persona front-loads the security pitch, but `debate` (the highest-strategic hop) lands fourth — last-quartile.
- **Biggest risk**: `latent-state` and `skill-graph` ship while users are demanding the critic flip; we look unfocused.

### OPTION B — Strategic first
`debate → persona → harness → skill-graph → latent-state`

- **Timeline**: 6 days (8h, 3h, 6h, 5h, 6h).
- **Cumulative user-visible value**: Medium for two days, then high (persona) on day 3.
- **Cumulative strategic value**: Maximal — the critic-gate unlock is in flight from day one.
- **Biggest risk**: `debate` requires net-new substrate (the LLM adapter), so the *first* hop is also the riskiest. If it slips, everything else slips. Velocity day-1 is bad.

### OPTION C — Cheapest first
`persona → debate → skill-graph → harness → latent-state`

- **Timeline**: 5 days (3h, 8h, 5h, 6h, 6h).
- **Cumulative user-visible value**: High day 1, then plateau.
- **Cumulative strategic value**: Persona + debate land in the first 2 hops — both high-strategic. Then dwindles.
- **Biggest risk**: `harness` lands fourth, but `harness` is what gives `skill-graph`'s synthetic tasks somewhere to *run*. We ship `skill-graph` to a vacuum on day 3.

---

## 5. Final recommendation — Option D (synthesis)

**Order**: `persona → debate → harness → skill-graph → latent-state`

This is Option C with one swap: `harness` before `skill-graph`. Justification:

1. **`persona` ships first.** It's the cheapest hop (~120 LOC, 3 hours per `persona/check.ts:152` `canInvoke()` and `permissions.ts:145` `checkPermission()` integration point), it's the highest user-visible value, and it has zero substrate dependencies. Velocity win + immediate user value + slots cleanly into `tool-pipeline.ts:498` `permissionMiddleware`. It also gives us a free regression check: if persona breaks anything, we catch it before higher-cost hops compound the blast radius.

2. **`debate` second.** The LLM-adapter blocker is real (~80 LOC of glue around `critic-gate.ts:resolveCriticProvider`), but it's the highest-strategic hop. Doing it second — after persona builds confidence — means we're not betting day 1 on the riskiest module, but we're also not deferring critic-gate by a week.

3. **`harness` third.** Once debate's adapter is paying for itself, `harness` lands and inherits `critic-evaluator.ts` (already 156 LOC of working code). Day 3.

4. **`skill-graph` fourth.** Now `harness` exists, so synthetic tasks have a runtime. Synthesis isn't shouting into a void.

5. **`latent-state` last.** Lowest urgency, widest surface area (touches every site in `a2a.ts:50` `createHandoff` and downstream). Best to land when other things are stable.

Total: ~5 days, ~26 hours of focused work, ~900 LOC across the five hops.

---

## 6. Release cadence — patch sequence, not batched minor

**Argument for batched 4.2.0 minor**:
- Single coherent narrative ("v5 substrate becomes product").
- One round of release notes, one social post, one announcement email.
- Users update once.

**Argument for 4.2.0 → 4.2.4 patch sequence**:
- Each hop is independently testable and revertable.
- Regression surface stays small per release (the 698 tests catch one hop's breakage at a time, not five).
- The `forecast_summary` 4.1.1 hop already established the cadence pattern — we look consistent.
- Daily "small-but-real" releases keep the npm download graph (`growth_summary` tracks it) climbing.
- If `debate` slips on day 2, `persona` is already shipped; we don't hold three other completed hops hostage.

**Recommendation**: **patch sequence**. 4.2.0 (persona), 4.2.1 (debate), 4.2.2 (harness), 4.2.3 (skill-graph), 4.2.4 (latent-state). Tag a `4.2.x` umbrella release note at the end of the week summarizing the whole sweep — best of both.

---

## Appendix — file reference

- Substrate: `src/futures/{harness,skill-graph,latent-state,persona,debate}/`
- First-hop precedent: `src/tools/forecast-summary.ts` + registration line at `src/tools/swarm-2026-04.ts:107`
- Persona target: `src/permissions.ts:145` (`checkPermission`), `src/tool-pipeline.ts:498` (`permissionMiddleware`)
- Harness target: `src/agent.ts:1495` (existing `checkPermission` wiring), `src/cli.ts:5804` (existing `evolve` block — pick a different verb)
- Debate target: `src/critic-gate.ts:76` (`resolveCriticProvider`, the adapter source), `src/critic-gate.ts:122–163` (Anthropic + OpenAI fetch helpers to mirror)
- Latent-state target: `src/a2a.ts:625` (JSON-RPC envelope), `src/agent-protocol.ts:50` (`createHandoff`)
- Roadmap: `src/futures/README.md:115` ("4.2.0 — wire forecast/ … persona enforcement in permissions.ts; meta-evolution outer loop")
