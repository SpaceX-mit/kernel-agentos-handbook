# AI ENGINEERING BRAIN

> Comprehensive index of every engineer role enumerated in the kernel.chat
> codebase, plus the full corpus of existing knowledge on AI engineering and
> the development of futures of AI. Loaded by kbot so it can act as any of
> these roles and reason from the full body of work.
>
> Generated 2026-05-06. Re-run the survey if specialist registries or research
> briefs change substantially.

---

## PART I — THE FULL ENGINEER ROSTER (121+ roles)

Every place in the repo where engineering roles, agent personas with
engineering responsibility, or named specialties are enumerated. kbot can
adopt any of these.

### 1. Core Specialists — `packages/kbot/src/agents/specialists.ts`

30 specialists, each with system prompt, color, icon.

- **Tier 1 (Core, 5):** kernel, researcher, coder, writer, analyst
- **Tier 2 (Extended, 4):** aesthete, guardian, curator, strategist
- **Tier 3 (Domain, 13):** infrastructure, quant, investigator, oracle,
  chronist, sage, communicator, adapter, scientist, neuroscientist,
  social-scientist, philosopher, epidemiologist
- **Tier 4 (Specialized humanities/life-sci, 4):** linguist, historian,
  immune, life-scientist

### 2. Agent Matrix — `packages/kbot/src/matrix.ts`

- **Presets (10):** security-auditor, ux-critic, code-reviewer, architect,
  tech-writer, devil-advocate, hacker, operator, dreamer, creative
- **Built-ins (9 beyond specialists):** developer, replit, gamedev,
  playtester, trader (plus the four hacker/operator/dreamer/creative aliases)
- **Mimic profiles (12):** claude-code, cursor, copilot, nextjs, react,
  python, rust, senior, startup (+3)

### 3. Kernel Stack Production Team — `packages/kbot/KERNEL_STACK.md`

27 production agents in 5 bands:

- **Ship cycle (6):** ship, bootstrap, sync, pulse, deployer, devops
- **Quality (6):** qa, reviewer, designer, performance, security, hacker
- **Community (5):** github, discord, email-agent, outreach, onboarding
- **Product (6):** product, admin, curator, architect, debugger, documenter
- **Experimental (5):** limitless, autopoiesis, autotelic, collective,
  synthesis

The `/ship` command gates: **security → QA → design → perf → devops →
product**. Every release flows through that ladder.

### 4. `.claude/agents/` Definition Files (49 specialists)

Each is a markdown file with role, triggers, protocol. Roster:

admin, architect, autopoiesis, autotelic, belief-shaper, bootstrap,
brain-architect, category-creator, collective, debugger, deployer,
designer, devops, discord, documenter, email-agent, environment,
extreme-codesign, gamedev, github, hacker, hardware, immune, install-base,
kbot-social, limitless, magazine-editor, obsidian-sync, onboarding,
outreach, performance, pixel-artist, playtester, product, pulse, replit,
rival-intel, rom-hacker, security, serum2, ship, speed-of-light,
stream-auditor, stream-director, sync, synthesis, tiktok-producer,
world-builder, youtube.

### 5. Reflection Quality-Gate Agents — `src/engine/AgentReflection.ts`

Seven product-quality lenses: qa | designer | performance | security |
devops | product | all.

### 6. V5 Futures Modules — `packages/kbot/V5_FUTURES_PLAN.md`

Six future-scope engineer subsystems, each backed by a frontier paper:

| Module       | Backing research        | Engineer role implied            |
|--------------|-------------------------|----------------------------------|
| harness/     | Sylph.AI                | Harness Evolution Engineer       |
| skill-graph/ | Tencent skill-routing   | Skill Graph Engineer             |
| latent-state/| Stanford / MIT transfer | Latent State Engineer            |
| forecast/    | Internal benchmark suite| Forecasting Engineer             |
| persona/     | Access-restriction work | Persona / Permissions Engineer   |
| debate/      | BARRED debate-training  | Debate / Adversarial Engineer    |

### 7. Limitless Routing Table — `.claude/agents/limitless.md`

Eight-row dispatch: security review → hacker; build verification → qa;
design check → designer; UX evaluation → product; code review → reviewer;
deploy → ship; debug → debugger; architecture → architect.

### Total surface area

30 specialists + 10 presets + 9 built-ins + 12 mimics + 27 production +
49 `.claude/agents` + 7 reflection lenses + 6 V5 modules + 8 limitless
routes = **158 enumerated engineer positions** kbot is authorized to
assume.

---

## PART II — EXISTING KNOWLEDGE OF ENGINEERING & FUTURES OF AI

The full body of work in this repo on how AI is built today and where it
is going. ~10K LOC of architecture, research, and competitive intel.

### A. kbot's own roadmap & substrate

| File | Lines | What it teaches |
|---|---|---|
| `packages/kbot/V5_FUTURES_PLAN.md` | 214 | Six-module v5 roadmap; maps frontier research to subsystems. |
| `packages/kbot/src/futures/README.md` | 119 | How harness + skill-graph + latent-state + forecast + persona + debate compose into a self-improving agent. |
| `packages/kbot/src/futures/harness/README.md` | 67 | Worker / Evaluator / EvolutionAgent contracts for tracing and scoring sessions. |
| `ROADMAP.md` | 115 | v3.6 → v4+ release ladder. |
| `packages/kbot/KERNEL_STACK.md` | 217 | "Agent = Model + Harness." Seven-layer stack. |

### B. Cognitive architecture & systems theory

| File | Lines | What it teaches |
|---|---|---|
| `docs/KERNEL_RESEARCH_THESIS.md` | 610 | Sovereign multi-agent platform thesis. Nine domains: orchestration, intent routing, swarm, memory, convergence, privacy, generative pipelines, HCI, distributed systems. |
| `docs/federated-stigmergic-learning.md` | 454 | Federated learning + stigmergy. Personal + collective intelligence layers; privacy-first. |
| `docs/cognitive-module-interference.md` | 409 | Interference between 11 cognitive modules; cross-talk mitigations. |
| `src/content/posts/antigravity-kernel.md` | 358 | Cognitive loop: Perceive → Attend → Think → Decide → Act → Reflect. |
| `KERNEL.md` | 335 | Core principles: Claude thinks, kbot acts, both learn. |

### C. Frontier & agentic system design

| File | Lines | What it teaches |
|---|---|---|
| `docs/2027-the-agentic-synthesizer.md` | 272 | VST3 synth with embedded agent — AI-as-material applied to music. |
| `src/content/posts/sovereign-swarm.md` | ~130 | Token-efficient pipeline: orchestrator → coder/reviewer/tester/refactorer with context compression between handoffs. |
| `src/content/posts/frontier-notes.md` | 34 | Field notes: AI-as-material, context compression, "Way of Code." |
| `src/content/posts/intelligence-synthesis.md` | 30 | Reasoner's Calculus: complexity × risk × profitability × efficiency × innovation. |

### D. Competitive intel on Claude Code & rival AI tools

| File | Lines | What it teaches |
|---|---|---|
| `.claude/agents/rival-intel.md` | 137 | March 2026 Claude Code source-leak analysis: 512K TS, Ink UI, 38 tool dirs, Coordinator mode, Memdir, dream system. Maps kbot advantages: learning engine, 671-tool breadth, BYOK, local-first. |
| `MEMORY/project_competitive_landscape_2026.md` | — | kbot vs Cursor / Codex CLI / OpenCode / Aider / Cline / Factory Droid. |

### E. Research briefs

| File | Lines | What it teaches |
|---|---|---|
| `packages/kbot/research/agentskills-community-2026-04.md` | 269 | April 2026 AgentSkills ecosystem signals; cross-agent collaboration patterns. |
| `packages/kbot/research/jcode-analysis.md` | 228 | JCode framework: structured code reasoning, neural intent classification vs regex. |
| `packages/kbot/research/access-restriction-pattern.md` | 216 | Scoped tool access in multi-agent systems; feeds the persona/ V5 module. |
| `packages/kbot/research/v4_2-ordering.md` | 200 | Task ordering and dependency synthesis in v4.2. |

### F. Self-improvement & operational protocols (selection)

| File | Lines | What it teaches |
|---|---|---|
| `.claude/agents/bootstrap.md` | 202 | Recursive self-improvement: highest-impact fix → implement → measure → compound. |
| `.claude/agents/environment.md` | 308 | World-modeling, situation awareness, state synthesis. |
| `.claude/agents/extreme-codesign.md` | 250 | Human + agent co-design; permission negotiation. |
| `.claude/agents/synthesis.md` | 245 | Multi-agent convergence; debate winner selection. |
| `.claude/agents/speed-of-light.md` | 233 | Token economics, latency, caching. |
| `.claude/agents/category-creator.md` | 213 | Intent classification, skill routing, neural patterns. |
| `packages/kbot/src/plugin/skills/meta.md` | ~50 | Meta-cycle: observe → analyze → improve → apply → measure. |
| `packages/kbot/src/plugin/skills/dream.md` | ~40 | Nightly self-improvement: consolidation, forge, collective sync, guardian, benchmarking. |

---

## PART III — OPERATING DOCTRINE (when kbot acts on this knowledge)

1. **Pick the smallest competent role.** If a single specialist covers
   the task (e.g. `coder` for a one-file fix), don't escalate to swarm.
   The roster exists so kbot can match scale to task, not so it can
   convene a parliament for every commit.

2. **For multi-domain work, follow the ship ladder:**
   security → QA → design → perf → devops → product. Skipping a gate
   means the work isn't shipped — it's just queued.

3. **Apply the Reasoner's Calculus before scope decisions.** Weigh
   complexity, risk, profitability, efficiency, innovation. Not every
   axis matters every time, but consciously discard the ones that
   don't.

4. **Treat futures modules as v5 stubs, not v4 features.** Anything
   under `packages/kbot/src/futures/` is research substrate. Don't
   wire it into shipping code paths until the corresponding V5 plan
   item is greenlit.

5. **Cite evidence on release commits.** kernel.chat ships with
   numbers and audit trails. Engineering knowledge without measurement
   is rumor.

6. **Local-first, BYOK, MIT.** These are non-negotiable for any role
   kbot adopts. A frontier-engineer persona that hardcodes a provider
   has betrayed the contract.

---

## PART IV — POINTERS

- Want the full skill that operationalizes this brain? See
  `packages/kbot/skills/ai-engineering/full-stack-mastery/SKILL.md`.
- Want the V5 substrate? See `packages/kbot/src/futures/`.
- Want competitive intel? See `.claude/agents/rival-intel.md`.
- Want the canonical project map? See `KERNEL.md`.
