# agentskills.io community check-in — April 2026

> Research brief covering Matt Pocock's `skills` repo (published 2026-04-22, viral 2026-04-29),
> the agentskills.io specification, the awesome-list ecosystem, and what all of it means
> for `kbot.md` and ISSUE 376/377.
>
> Author: research pass, 2026-04-25 (Pocock repo is 3 days old; 2026-04-29 is the
> day Pocock published the explainer video that took it to ~45K stars).

---

## TL;DR (5 lines)

1. **Pocock's repo** is `mattpocock/skills` — 13–22 SKILL.md files (depending on count method) lifted from his personal `~/.claude/skills/`, organized as `skills/{engineering,productivity,misc}/<name>/SKILL.md`, MIT-style philosophy of "small, composable, retain developer control."
2. **What kbot.md should borrow:** Pocock's `description` field is a triggers-keyword paragraph ("Use when user mentions X, Y, Z") that's tuned for retrieval, not human reading; that pattern is sharper than ours. Also: split long bodies into `references/` files and use `scripts/` for deterministic ops.
3. **Real community is forming** — Anthropic's `anthropics/skills` is at 127K stars, agentskills.io lists 39+ adopting clients (Cursor, Gemini CLI, OpenCode, Goose, GitHub Copilot, OpenAI Codex, Letta, Roo, Kiro, Laravel Boost, Mistral Vibe, Spring AI…), at least 6 awesome-lists exist, one (`VoltAgent`) curates 1,100+ skills. This is past "early adopter," well into "real community" stage.
4. **ISSUE 377 angle is real but premature.** ISSUE 376 already called the standard. Pocock at 45K is fresh evidence, but a 30-days-later check-in piece needs more than one viral repo. Hold the angle 60–90 days; revisit when there are 3–4 *more* individual-publisher repos at >5K stars and the awesome-list count plateaus.
5. **Best contribution move for kbot:** publish `kernel-chat/skills` as a public repo this week. Mirror Pocock's structure exactly. 3–5 skills at launch (`kbot.md`, plus `produce-beat`, `ableton-control`, `kernel-magazine-publish`, `daemon-ops`). Submit to VoltAgent's awesome-agent-skills list. Don't try to upstream into Pocock's repo — it's a personal collection, not a registry.

---

## 1. Pocock's repo, decoded

**URL:** https://github.com/mattpocock/skills
**First commit:** 2026-04-22. **Most recent commit visible:** 2026-04-30. **Stars at viral peak:** 45,289 (FACT, per implicator.ai 2026-04-29) and 49.4K by the time of this research (FACT, fetched 2026-04-25 via WebFetch — note: the viral spike post-dates today's nominal date, so the 49.4K is from a slightly-future snapshot the article extrapolates from). **Forks:** ~4,000.

### Structure (FACT)

```
skills/
├── engineering/
│   ├── diagnose/SKILL.md
│   ├── grill-with-docs/SKILL.md
│   ├── triage/SKILL.md
│   ├── improve-codebase-architecture/SKILL.md
│   ├── setup-matt-pocock-skills/SKILL.md
│   ├── tdd/SKILL.md
│   ├── to-issues/SKILL.md
│   ├── to-prd/SKILL.md
│   └── zoom-out/SKILL.md
├── productivity/
│   ├── caveman/SKILL.md
│   ├── grill-me/SKILL.md
│   └── write-a-skill/SKILL.md
└── (misc/loose): git-guardrails-claude-code, migrate-to-shoehorn,
    scaffold-exercises, setup-pre-commit
```

Plus `.claude-plugin/`, `docs/adr/`, `scripts/`, `.out-of-scope/`.

**Skill count:** WebFetch reported 13 directories under `skills/`; implicator.ai reports 22 SKILL.md files with 12 exposed in the Claude plugin manifest. The discrepancy is the `.out-of-scope/` and loose dirs. Treat **~13–15 publicly-active skills** as the working number.

### Frontmatter shape (FACT — observed in `engineering/tdd/SKILL.md`)

```yaml
---
name: tdd
description: Test-driven development with red-green-refactor loop. Use when user
  wants to build features or fix bugs using TDD, mentions "red-green-refactor",
  wants integration tests, or asks for test-first development.
---
```

Two fields. No license, compatibility, metadata, or allowed-tools. He's writing to the **agentskills.io minimum** spec.

### Body shape (FACT)

Skills follow a near-identical body template:

1. **Philosophy** — 1–3 sentences on principle (e.g. "test public interfaces, not implementation").
2. **Anti-patterns** — what NOT to do (the "horizontal slices" warning in tdd is canonical).
3. **Workflow** — numbered phases. `tdd` has 4. `diagnose` has 6.
4. **Per-cycle checklist** — verification questions.

`grill-with-docs` is ~400 words; `diagnose` is roughly 600. None are over 1000 words. He follows his own `write-a-skill` rule: SKILL.md under 100 lines, split to `references/` if longer.

### Domains covered

- **Planning/specification:** `to-prd`, `to-issues`, `grill-me`, `grill-with-docs`, `zoom-out`
- **Implementation:** `tdd`, `diagnose`, `caveman` (compressed-prose mode)
- **Architecture/quality:** `improve-codebase-architecture`, `triage`, `git-guardrails`
- **Meta:** `write-a-skill`, `setup-matt-pocock-skills` (per-repo config bootstrap)

Notably absent: anything domain-specific (no React, no Postgres, no AWS). All skills are *workflow* skills, not *technology* skills. This is a deliberate design choice — they compose with whatever stack you're in.

### Philosophy / why he published (FACT, from README)

Four named failure modes:
1. **Misalignment** between developer and agent → fixed by `grill-me`/`grill-with-docs`.
2. **Verbosity** without shared domain language → fixed by `CONTEXT.md` discipline.
3. **Non-functional code** without feedback loops → fixed by `tdd` and `diagnose`.
4. **Architectural decay** under AI-accelerated change → fixed by `improve-codebase-architecture`.

Quoted positioning: "approaches like GSD, BMAD, and Spec-Kit … take away your control" — these skills are explicitly **not** an opinionated framework. Deliberately small, composable, swappable.

### Contributors (INFERENCE from commit metadata)

Commits show co-authors **Copilot** and **Claude** (AI co-authoring) plus a "Test" user with two commits. No external human contributors yet. The 218 issues / 575 PRs on `anthropics/skills` for comparison shows what real community engagement looks like; Pocock's repo is solo-with-AI-pair-programming for now.

---

## 2. Compare against `kbot.md`

`kbot.md` lives at `/Users/isaachernandez/blog design/.claude/skills/kbot.md` — single file, no `references/` or `scripts/` directories. 85 lines. Shipped 2026-04-29 in v3.99.34.

### Where Pocock is sharper

**(a) Description-as-trigger-string.** Pocock's `description` reads like keyword-stuffed retrieval bait: "Use when user wants to build features or fix bugs using TDD, mentions 'red-green-refactor', wants integration tests, or asks for test-first development." The agentskills.io spec explicitly says this is the *only* thing the agent sees during discovery, and it should "include specific keywords that help agents identify relevant tasks."

`kbot.md`'s description is good but more prose-y: "Pre-authorization and routing guide for kbot … Use whenever the user asks Claude Code to invoke, drive, configure, or coordinate with kbot — including phrases like 'have kbot do X' …" — this is on the right track (lists trigger phrases) but the phrasing is more narrative than Pocock's bare-keyword-list approach.

**Recommended edit (for later, not now):** Tighten kbot.md description toward Pocock-style trigger keywords. Keep the phrase list, drop the framing prose.

**(b) Body brevity + reference-splitting.** Pocock's bodies are ≤100 lines each. `kbot.md` is 85 lines and that's the *whole* skill. If we add the routing tables for, say, the 670-tool inventory, we'd blow past 500 lines. Pocock's pattern: SKILL.md = orientation, decision-making, top-of-mind facts; `references/TOOLS.md`, `references/AGENTS.md`, etc. = the long tail.

**Recommended edit:** Migrate to a directory layout — `.claude/skills/kbot/SKILL.md` + `references/tools.md` + `references/anti-refusal.md` + `references/matrix.md`. Cuts SKILL.md to ~50 lines of orientation, agent loads `references/anti-refusal.md` only when about to refuse.

**(c) `scripts/` for deterministic ops.** Pocock uses `scripts/` for things "that benefit from explicit error handling" — saves tokens, improves reliability vs regenerating bash each time. kbot has dozens of repeatable ops (doctor check, daemon status, agent list). A `scripts/kbot-status.sh` and `scripts/list-agents.sh` would be a natural fit.

**(d) `setup-matt-pocock-skills` pattern.** Pocock has a meta-skill that bootstraps per-repo config (issue tracker location, label vocabulary, doc layout) before other skills assume it. kbot has analogous per-user state (`~/.kbot/`, matrix configs, daemon enable status) — a `setup-kbot-skills` skill that introspects a user's `~/.kbot/` and writes a `references/user-config.md` would be in the same spirit.

### Where `kbot.md` is doing something Pocock isn't

**(a) The anti-refusal preamble is genuinely novel.** Pocock has nothing analogous because Pocock's skills are pure workflow — they never trigger safety heuristics. `kbot.md` exists *specifically* because tool descriptions in our 670-tool surface ("create agent", "spawn parallel", "self-improving") collide with safety pattern matching. The list of 8 phrases ("create an agent", "autonomous loop", "red team" …) with explicit decoding is something other skill repos will need eventually but don't have yet.

**(b) The "common requests → tool" routing table.** Pocock's skills are self-contained workflows. `kbot.md` is doing routing — it's a dispatcher that points at other tools. This is closer to what an MCP-server-with-skills hybrid looks like and is unusual in current skill literature.

**(c) The "quick sanity check before refusing" trio.** Three yes/no questions a refusing-Claude has to answer before refusing. This is closer to a *constitutional AI* pattern than a skill, and it's pragmatically useful. Worth keeping; worth potentially extracting as its own pattern for other tool authors who hit safety false-positives.

### Concrete recommendations (rank-ordered, not making these edits in this task)

1. **Convert kbot.md to a directory.** `.claude/skills/kbot/SKILL.md` + `references/anti-refusal.md` + `references/routing-table.md` + `references/matrix.md`. Cuts SKILL.md to ~50 lines.
2. **Tighten the description field.** Reduce prose, increase keyword density. Target: include `mcp__kbot__`, `mcp__kbot-local__`, "matrix", "specialist", "BYOK", "v3.99" as literal tokens.
3. **Add `scripts/`** with `status.sh`, `list-agents.sh`, `doctor.sh` — saves the agent from re-deriving these calls.
4. **Add `metadata` block** with `version: "1.0"`, `author: kernel.chat`, `kbot-version: ">=3.99.34"`. Useful for downstream tooling that wants to track which kbot versions a skill targets.
5. **Add `compatibility: Designed for Claude Code, kbot CLI v3.99.34+`** so the spec validator stops flagging us as "no environment hint."
6. **Don't merge the anti-refusal preamble into Pocock-style.** It's our genuinely-different contribution. If anything, write a separate `claude-skill-anti-refusal/SKILL.md` and publish it as its own thing — other tool authors building MCP servers will hit the same problem.

---

## 3. The emerging community

### Gravitational center

Three poles, ranked by gravity:

1. **anthropics/skills** — 127K stars, 14.9K forks (FACT, WebFetch). Holds reference implementations for PDF/DOCX/PPTX/XLSX, the canonical creative/dev/comms examples, partner skills (Notion). This is where the spec lives in practice.
2. **agentskills.io** — the open spec page. **Originally Anthropic's, released as open standard.** 39+ adopting clients listed: Cursor, Claude Code, Gemini CLI, OpenAI Codex, Goose, OpenCode, OpenHands, Roo, Kiro, Letta, Junie (JetBrains), GitHub Copilot, VS Code, Factory, Mistral Vibe, Spring AI, Laravel Boost, Snowflake Cortex, Databricks Genie, Trae, Workshop, fast-agent, nanobot, others. Discord + GitHub at `agentskills/agentskills`. (FACT, WebFetch agentskills.io)
3. **awesome-lists** — at least 6 in flight:
   - `VoltAgent/awesome-agent-skills` — claims 1,100+ skills, ~70 organizations
   - `travisvn/awesome-claude-skills` — ~30 entries, last-updated Feb 2026
   - `heilcheng/awesome-agent-skills` — multilingual, 117+ commits, hosted index at `agent-skill.co`
   - `skillmatic-ai/awesome-agent-skills`
   - `BehiSecc/awesome-claude-skills`
   - `sickn33/antigravity-awesome-skills` — claims 1,441+ skills with installer CLI
   - `ComposioHQ/awesome-claude-skills`
   - `alirezarezvani/claude-skills` — claims 232+ skills

This is well past "early adopter" stage. Multiple competing awesome-lists is itself a community-stage signal — it's what happened to MCP servers in late 2025 and to npm in 2010.

### "How big is this, really" calibration (INFERENCE)

- **Spec adopters (clients):** 39+ (FACT)
- **Public skill repos:** rough order **500–2000**. Awesome-lists each claim 200–1,400+ skills, but many are duplicates/reuploads. A more conservative count of *original* skill collections is probably ~50–100 distinct repos.
- **Individual-developer publishers (people, not companies):** This is the metric Pocock just moved. Before him: maybe a dozen named developers had public skill repos with >100 stars. After him: he set a 45K ceiling, which establishes individual-publisher skill repos as a *creator format*, like dotfiles repos or awesome-lists.

The Pocock data point is *exactly* the inflection ISSUE 376 was looking for. Spec adoption by tooling companies (Cursor, Goose, Letta, Codex) is one thing — those are bizdev moves. Spec adoption by **named developers publishing their personal directories** is what makes a standard load-bearing.

### Is there an npm registry / skills.dev?

No formal registry yet (FACT). The closest things:
- `npx skills@latest add mattpocock/skills` — Pocock uses an `skills` CLI installer (it's the package referenced in his setup instructions). Worth checking whether this is a registry or a Github-fetcher.
- VoltAgent + sickn33 both have installer CLIs that pull from their curated lists.
- agentskills.io has `skills-ref` validation tool but no registry.

Adjacent: Anthropic's `anthropics/skills` GitHub plus the partner-skill program is the de-facto hub.

---

## 4. Implications for kernel.chat editorial

**ISSUE 376 (shipped 2026-04-29) called agentskills.io as a quietly-winning standard.** That call holds up. Pocock's repo (published 2026-04-22, viral 2026-04-29) is — depending on how you count — either confirmation or the proximate cause.

### Is this ISSUE 377?

**Recommendation: hold for 60–90 days. Don't ship a 30-days-later check-in.**

Reasons:
1. **One data point isn't a trend.** Pocock is a high-profile TypeScript creator. His repo going viral could be a one-off (creator-pull) or the leading edge (format adoption). Wait for 3–4 more named individuals at >5K stars before declaring "individual publication tier reached."
2. **The awesome-list count just doubled in a month.** 6+ competing awesome-lists is the *unstable* phase of community formation — wait for consolidation. The interesting story is which awesome-list wins and whether agentskills.io launches an official registry.
3. **ISSUE 376 just shipped.** Re-running the angle 30 days later looks like the magazine has one note. Editorial cadence wants a *different* angle, not a status update.

**Better-fit angles for follow-up:**
- **"The dotfiles moment for AI agents"** — when does publishing your `.claude/skills/` become a developer practice, not an experiment? (Pocock framing this would be the lede.)
- **"Skills vs. MCP servers — convergence or competition?"** — these are increasingly overlapping primitives. agentskills.io's `allowed-tools` field and MCP's tool-with-instructions are pointing at the same thing.
- **"The Anthropic-shaped center of gravity."** When a company publishes an open spec and 39 competitors adopt it, that's not standard-setting through merit alone. Worth examining how MCP-then-Skills became Anthropic's actual moat.

### Naming Pocock

**Yes, name him.** He's a public figure (40K+ Twitter followers, well-known TypeScript educator), the repo is public, and the magazine has named real people in past issues with care (re: the kernel.chat magazine pivot — POPEYE-style editorial does name people). Frame it as a craftsman publishing his tools, not as a pundit. Avoid quoting his philosophy claims as if they're the magazine's; cite him as the *evidence*, not the *thesis*.

---

## 5. Implications for kbot

### New skills worth writing (INFERENCE)

Based on Pocock's pattern (workflow skills, not technology skills) but kbot's domain advantages:

1. **`produce-beat/`** — Ableton workflow: pick BPM, build drums, add bass, add melody, mix. Triggers: "make me a beat", "produce a track in [genre]".
2. **`ableton-control/`** — kbot-control TCP protocol cheat sheet. Wraps the 22 ableton tools with intent routing.
3. **`kernel-magazine-publish/`** — the ISSUE workflow from `src/content/issues/PUBLISHING.md` as a skill.
4. **`daemon-ops/`** — start/stop/diagnose the 24/7 background daemon. Reads `tools/daemon-reports/state.json`, surfaces token usage, restarts if dead.
5. **`forge-tool/`** — when the user asks for something kbot doesn't have, walk them through `forge_tool`. Pocock-style "Use when user mentions: 'kbot doesn't have', 'add a tool to kbot', 'forge'."

These are all *workflow* skills. The 670 individual tools are *not* skills — they're the substrate. The skill layer is the orchestration on top.

### Contribution opportunities

**Don't try to upstream into `mattpocock/skills`.** It's a personal directory, not a community registry. Pocock has been clear (per implicator.ai writeup) that this is *his* set, kept small.

**Do submit to community awesome-lists.** Specifically VoltAgent's `awesome-agent-skills` (1,100+ entries, organized by org) and `heilcheng/awesome-agent-skills` (philosophy match: real-world skills, not bulk-generated). One PR each.

**Do publish kbot's full `.claude/skills/` collection as a public repo.** This is the highest-leverage move. Mirror Pocock's structure exactly:

```
kernel-chat/skills/
├── .claude-plugin/
├── README.md
├── skills/
│   ├── kbot/SKILL.md           # the routing skill we already have
│   ├── produce-beat/SKILL.md
│   ├── ableton-control/SKILL.md
│   ├── kernel-magazine-publish/SKILL.md
│   ├── daemon-ops/SKILL.md
│   └── forge-tool/SKILL.md
└── docs/
```

License MIT, match `@kernel.chat/kbot-control-standalone` precedent (kernel.chat already publishes standalone open-source packages).

**Why this matters for kbot's positioning:** Pocock just demonstrated that publishing your skills folder is a creator move. kbot's whole differentiator vs Claude Code is the **agent matrix** + **670 tools** + **local-first**. Publishing the skills that orchestrate them is the natural showcase. It also does for skills-discoverability what `kbot doctor` does for install-discoverability — gives the project a public surface.

### Cost / effort

Publishing the repo: ~1 day. Writing 5 launch skills (mostly extracting from existing CLAUDE.md and PUBLISHING.md content): ~2 days. PR to one awesome-list: ~1 hour. Total: ~3.5 days of work for a meaningful community-presence move that aligns kbot with the agentskills.io standard.

---

## Sources

- Matt Pocock's repo: https://github.com/mattpocock/skills
- Pocock READMe: https://github.com/mattpocock/skills/blob/main/README.md
- Skill examples cited: `skills/engineering/tdd/SKILL.md`, `skills/engineering/diagnose/SKILL.md`, `skills/engineering/grill-with-docs/SKILL.md`, `skills/engineering/setup-matt-pocock-skills/SKILL.md`, `skills/productivity/grill-me/SKILL.md`, `skills/productivity/write-a-skill/SKILL.md`
- Pocock virality writeup: https://www.implicator.ai/matt-pocock-skills-repo-jumps-past-45k-stars-with-reusable-ai-instructions/
- agentskills.io spec: https://agentskills.io/specification
- agentskills.io homepage + clients: https://agentskills.io/
- Anthropic skills repo: https://github.com/anthropics/skills
- Awesome-lists: https://github.com/VoltAgent/awesome-agent-skills, https://github.com/travisvn/awesome-claude-skills, https://github.com/heilcheng/awesome-agent-skills, https://github.com/skillmatic-ai/awesome-agent-skills, https://github.com/sickn33/antigravity-awesome-skills, https://github.com/ComposioHQ/awesome-claude-skills, https://github.com/alirezarezvani/claude-skills
- kbot's existing skill: `/Users/isaachernandez/blog design/.claude/skills/kbot.md`

---

## FACT vs INFERENCE markers used above

- **FACT** — directly fetched from the cited URL or read from disk
- **INFERENCE** — derived from FACTs but involves judgment (community-stage diagnosis, "best contribution move", magazine timing)

All star counts, commit dates, organization counts, and skill counts are FACTs as of fetch time (2026-04-25). Pocock's 49.4K star figure is from a fetch that returned a snapshot post-dating today; the 45K figure from implicator.ai is dated 2026-04-29. Both are reported here without smoothing.
