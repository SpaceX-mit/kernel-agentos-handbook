# kbot ↔ Hermes Agent Integration

*Notes on how `@kernel.chat/kbot` uses `hermes-agent` (NousResearch) as a delegate, not a competitor.*

Dated 2026-05-16. Filed alongside [`packages/kbot`](../packages/kbot/).

---

## The stance

Hermes Agent is the established open-source self-improving CLI agent — 95K+ stars on GitHub, mature skill system, FTS5 cross-session memory, dream-style consolidation. The temptation when an open-source neighbour ships at that scale is to chase parity. The discipline is to do the opposite: **delegate to it where it is better, orchestrate above it, share the substrate that makes both stronger**.

kbot's stance is "agentic workflow is delegation, not automation." This integration is the first instance of that stance applied to another agent.

---

## What integration means here

Three phases, all shipping in 4.5.x:

### Phase 1 — Hermes as a kbot provider

Hermes exposes an OpenAI-compatible HTTP API server (the gateway). kbot already supports 20 BYOK providers via a clean abstraction; Hermes becomes provider #21.

Code: `packages/kbot/src/auth.ts`
- Added `'hermes'` to the `ByokProvider` type union
- Added a `hermes` entry to `PROVIDERS` registry (apiUrl defaults to `http://localhost:8000`, override via `HERMES_HOST`)
- Added to `isLocalProvider()` and `isKeylessProvider()` lists
- `HERMES_API_KEY` env var honoured if set (Hermes' API server accepts any bearer)

Usage:
```bash
# Install Hermes Agent (one-liner from their docs)
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# Run the gateway (defaults to port 8000)
hermes gateway

# In a separate terminal — point kbot at it
export KBOT_BYOK_PROVIDER=hermes
kbot

# Or override the host
export HERMES_HOST=http://localhost:8123
```

kbot calls Hermes through the same dispatch loop as any other OpenAI-compatible provider. Hermes runs its own loop internally — its own skills, its own dream consolidation, its own FTS5 search. kbot routes work to it; Hermes does the work; kbot synthesizes the result.

### Phase 2 — Specialist routing preference

Code: `packages/kbot/src/agents/specialists.ts`
- Added `preferredProvider?: ByokProvider` to `SpecialistDef`
- Added `getPreferredProvider(specialistName)` helper
- Tagged three specialists as Hermes-preferred:
  - **researcher** — long-form, skill-heavy
  - **chronist** — cross-session memory / institutional history
  - **sage** — depth synthesis across past sessions

The metadata is in place; the dispatch layer is *not yet* wired to read it. That's a deliberate scope cut — the data tag lands first; the routing integration is a follow-up commit that touches kbot's specialist dispatch loop more invasively. When wired, the behaviour will be: if `preferredProvider` is set on the specialist and that provider is configured + reachable, route to it; otherwise fall back to user's default provider.

### Phase 3 — Shared skill-doc path

Code: `packages/kbot/src/skills-loader.ts`
- Added `~/.hermes/skills/` to the skill discovery path list
- Added `KBOT_EXTRA_SKILLS_DIRS` env var (colon-separated) for advanced setups

Both kbot and Hermes use the **agentskills.io** open standard for skill documents. After this change, kbot automatically discovers and loads any skills Hermes has stored, without translation. Skills written for one are callable by the other.

The discovery order:
1. `./.kbot/skills/` — project-local (most specific)
2. Bundled — kbot-curated skills shipping with the package
3. `~/.kbot/skills/` — user global (includes user-imported skills)
4. `~/.hermes/skills/` — Hermes' native skill store (silently skipped if absent)
5. `$KBOT_EXTRA_SKILLS_DIRS` — colon-separated additional roots

First-wins precedence on name collisions: project-local skills beat bundled, bundled beats user-global, user-global beats Hermes-shared.

---

## What this preserves

- **kbot's identity** — voice, editorial frame, agent-os primitives, kbot-finance, all unchanged
- **kbot's discipline** — evidence-driven curation, audit-grade where it matters, BYOK contract
- **kernel.chat's positioning** — provenance engineering, the magazine, the five-year arc

## What this changes

- **kbot users gain Hermes capabilities** (mature skills system, FTS5 cross-session memory, dream consolidation) without kbot needing to re-implement them
- **kbot can delegate** specific specialist work to Hermes when appropriate (Phase 2 metadata; full wiring pending)
- **Skills written for either project work in both** (Phase 3, immediate)
- **The dependency is loose** — Hermes runs as a separate process; if it's not present, kbot falls through to its native provider stack with zero impact

## What this does NOT do

- It does not make kbot depend on Hermes for normal operation. If Hermes isn't installed, kbot works exactly as before.
- It does not surrender kbot's identity to Hermes' working assumptions. kbot orchestrates; Hermes is a tool.
- It does not wire the specialist preference into the dispatch loop (yet). The metadata is there; the runtime integration is the next commit.

---

## Why this matters strategically

The honest read on the open-source agent-CLI category in mid-2026:

- **Hermes has community traction** (95K stars, contributor community, gateway integrations to Telegram/Discord/Slack/WhatsApp/Signal)
- **kbot has discipline differentiation** (editorial frame, audit-grade substrate, kbot-finance, the magazine, provenance engineering as a named discipline)

These are not the same axis. Competing on traction is a losing fight when the timing window is closed. **Composing on stance** is the move available now: kbot becomes the *orchestrator with discipline* that calls Hermes as one of many substrates underneath, with audit trails that neither project has on its own.

The Phase 2 routing-preference metadata is the seed of that. The Phase 3 shared-skill path makes the boundary porous. The Phase 1 provider entry makes the call cheap. Three small commits; one strategic position.

---

## See also

- [`docs/agents-and-money.md`](agents-and-money.md) — the practitioner's note on agent revenue + capital
- [`packages/kbot-finance/ROLE.md`](../packages/kbot-finance/ROLE.md) — provenance engineering as a discipline
- [Hermes Agent docs](https://hermes-agent.nousresearch.com/docs/) — upstream
- [ISSUE 381 — On Provenance](../src/content/issues/381.ts) — the editorial throughline
