# kbot ↔ Hermes Agent Integration

*Notes on how `@kernel.chat/kbot` uses `hermes-agent` (NousResearch) as a delegate.*

Dated 2026-05-16. Filed alongside [`packages/kbot`](../packages/kbot/).

---

## The stance

Hermes Agent is an established open-source CLI agent with 95K+ GitHub stars, a mature skill system, FTS5 cross-session memory, and dream-style consolidation. When an open-source neighbour ships at that scale, parity-chasing is the wrong reflex. The other available move is to delegate to it where it is better, orchestrate above it, and share the substrate.

kbot's working position is that an agentic workflow is delegation rather than automation. This integration is the first concrete instance of that position applied to another agent.

---

## What integration means here

Three phases, all shipping in 4.5.x.

### Phase 1 — Hermes as a kbot provider

Hermes exposes an OpenAI-compatible HTTP API server (the gateway). kbot already supports 20 BYOK providers through a clean abstraction. Hermes becomes provider #21.

Code: `packages/kbot/src/auth.ts`

- Added `'hermes'` to the `ByokProvider` type union
- Added a `hermes` entry to the `PROVIDERS` registry. `apiUrl` defaults to `http://localhost:8000`; override with `HERMES_HOST`
- Added to `isLocalProvider()` and `isKeylessProvider()` lists
- `HERMES_API_KEY` env var honoured if set (Hermes' API server accepts any bearer)

Usage:

```bash
# Install Hermes Agent (one-liner from their docs)
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# Run the gateway (defaults to port 8000)
hermes gateway

# In a separate terminal, point kbot at it
export KBOT_BYOK_PROVIDER=hermes
kbot

# Or override the host
export HERMES_HOST=http://localhost:8123
```

kbot calls Hermes through the same dispatch loop as any other OpenAI-compatible provider. Hermes runs its own loop internally with its own skills, dream consolidation, and FTS5 search. kbot routes the work; Hermes does it; kbot picks up the result.

### Phase 2 — Specialist routing preference

Code: `packages/kbot/src/agents/specialists.ts`

- Added `preferredProvider?: ByokProvider` to `SpecialistDef`
- Added `getPreferredProvider(specialistName)` helper
- Tagged three specialists as Hermes-preferred: **researcher** (long-form, skill-heavy), **chronist** (cross-session memory and institutional history), and **sage** (depth synthesis across past sessions)

The metadata is in place; the dispatch layer does not yet read it. That is a deliberate scope cut. The data tag lands first; the routing integration is a follow-up commit that touches kbot's specialist dispatch more invasively. When wired, the behaviour is: if `preferredProvider` is set on the specialist and that provider is configured and reachable, route to it; otherwise fall back to the user's default.

### Phase 3 — Shared skill-doc path

Code: `packages/kbot/src/skills-loader.ts`

- Added `~/.hermes/skills/` to the skill discovery path list
- Added `KBOT_EXTRA_SKILLS_DIRS` env var (colon-separated) for advanced setups

Both kbot and Hermes use the **agentskills.io** open standard for skill documents. After this change kbot automatically discovers and loads any skills Hermes has stored, with no translation step. Skills written for one are callable by the other.

Discovery order:

1. `./.kbot/skills/` — project-local (most specific)
2. Bundled — kbot-curated skills shipping with the package
3. `~/.kbot/skills/` — user global (includes user-imported skills)
4. `~/.hermes/skills/` — Hermes' native skill store (silently skipped if absent)
5. `$KBOT_EXTRA_SKILLS_DIRS` — colon-separated additional roots

First-wins on name collisions. Project-local beats bundled, bundled beats user-global, user-global beats Hermes-shared.

---

## What this preserves

kbot's voice and editorial frame, the agent-os primitives, kbot-finance, and the BYOK contract are unchanged. The integration is additive.

## What this changes

kbot users gain Hermes capabilities (mature skills, FTS5 cross-session memory, dream consolidation) without kbot re-implementing them. kbot can delegate specialist work to Hermes when appropriate (Phase 2 metadata; full wiring pending). Skills written for either project work in both (Phase 3, immediate). The dependency is loose: Hermes runs as a separate process; if it is not present, kbot falls through to its native provider stack.

## What this does not do

It does not make kbot depend on Hermes for normal operation. If Hermes isn't installed, kbot works exactly as before. It does not surrender kbot's identity to Hermes' working assumptions. It does not yet wire specialist preference into the dispatch loop. The metadata is there; the runtime integration is the next commit.

---

## Why this matters

In mid-2026 the open-source agent-CLI category has two visible facts. Hermes has community traction (95K stars; gateway integrations to Telegram, Discord, Slack, WhatsApp, Signal). kbot has discipline differentiation (editorial frame, audit-grade substrate, kbot-finance, the magazine, provenance engineering as a named discipline).

These aren't the same axis. Competing on traction is a losing fight when the timing window is closed. Composition is the available move. kbot becomes the orchestrator with discipline that calls Hermes as one of several substrates underneath, with audit trails neither project has on its own.

Phase 2's routing-preference metadata is the seed. Phase 3 makes the boundary porous. Phase 1 makes the call cheap.

---

## See also

- [`docs/agents-and-money.md`](agents-and-money.md) — practitioner's note on agent revenue and capital
- [`packages/kbot-finance/ROLE.md`](../packages/kbot-finance/ROLE.md) — provenance engineering as a discipline
- [Hermes Agent docs](https://hermes-agent.nousresearch.com/docs/) — upstream
- [ISSUE 381 — On Provenance](../src/content/issues/381.ts) — editorial throughline
