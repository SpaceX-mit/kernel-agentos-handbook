# KBOT WORK QUEUE — VERIFIED (2026-06-06)

Every entry below was checked for real payout before listing. The rule:
**a bounty is real only if funds are escrowed and the org has a paid history.**

## ❌ Rejected — "AI agent bounty" farms (DO NOT WORK)
- **UnsafeLabs/Bounty-Hunters** — 6,400+ PRs, **0 ever merged**; a bot auto-rejects
  every PR ("didn't fully resolve... submit a new pull request"). Data-harvesting
  farm. $200–$800 labels are unbacked.
- **xevrion-v2/agent-playground** — 100+ PRs, all OPEN/unmerged; "star the repo
  first." Engagement farm. $50 labels unbacked.

## ✅ Real, escrow-backed work — Algora (funds deposited up front, payout-on-merge)

Proven payers (verified payout history 2026-06-06): **tscircuit** 707 paid,
**cal.com** 185, **Documenso** 65. tscircuit is all-TypeScript.

### Use the bounty-hunter tool — don't hand-pick from the listing
The Algora listing hides contention. The real edge is attempting FRESH,
uncontested bounties before the swarm (popular issues hit 10–55 competing PRs).
Built `packages/kbot/src/bounty/` to find + score them:

```
cd packages/kbot
npm run bounty:poll               # discover + rank live bounties, mark seen
npm run bounty:poll -- --all      # show everything, ranked by expected value
npm run bounty -- attempt         # solve top uncontested bounty (prepares, no push)
npm run bounty -- attempt --submit  # ...and open the PR (outward-facing)
npm run bounty:watch              # loop every 5 min
```

Ranking = `amount / (1 + competing_PRs)`. "Worth attempting" only when
contention ≤ 2 and amount ≥ $25 (configurable in `hunter.ts:DEFAULT_CONFIG`).

### Expanded run 2026-06-06 — 10 orgs, 86 bounties, 7+ worth attempting. Top winnable:
| $ | Contention | Issue | Stack |
|---|-----------|-------|-------|
| $500 | UNCONTESTED | [Improve single-instance rendering performance](https://github.com/remotion-dev/remotion/issues/4664) | TS |
| $400 | 1 PR | [Support Elixir among SDKs](https://github.com/highlight/highlight/issues/5082) | SDK build |
| $400 | 2 PRs | [Support PHP (Laravel+Symfony) among SDKs](https://github.com/highlight/highlight/issues/4225) | SDK build |
| $200 | 1 PR | [[MCP] Gmail](https://github.com/activepieces/activepieces/issues/8072) | **MCP — kbot's wheelhouse** |
| $150 | 1 PR | [Trace thickness as a parameter](https://github.com/tscircuit/tscircuit-autorouter/issues/66) | TS |
| $100 | UNCONTESTED | [Build Arduino Nano](https://github.com/tscircuit/tscircuit/issues/328) | hardware (hard) |
| $100 | 1 PR | [[MCP] Canva](https://github.com/activepieces/activepieces/issues/8135) | MCP |
| $75 | UNCONTESTED | [Dynamically load converters via jsdelivr](https://github.com/tscircuit/tscircuit/issues/1539) | TS (clean) |

**Buried correctly by the ranker** (red oceans — don't touch):
matchpack#15 $300 / **55 PRs**, highlight#8614 $250 / 27 PRs, rp2040-zero#2 $250 / 19 PRs,
matchpack#12 $150 / 16 PRs, cal.diy#1985 $200 / 13 PRs, highlight#6775 $300 / 11 PRs.

Org list now: tscircuit, calcom, documenso, highlight, formbricks, zama-ai, twentyhq,
activepieces, triggerdotdev, remotion-dev (`hunter.ts:DEFAULT_CONFIG`).

### Architecture
- `hunter.ts` — pure scoring (`parseBountyAmount`, `countReferencingPRs`,
  `expectedValueScore`, `rankBounties`, `diffNewBounties`) + GitHub IO via `gh`.
  Truth source is GitHub's `/bounty $N` marker + competing-PR count, NOT Algora's
  SPA (its tRPC keys on an org UUID we can't resolve from the slug → returns empty).
- `solver.ts` — issue-TARGETED solve. Fetches the specific issue (title, body,
  maintainer comments, labels), clones the repo, `chdir`s in, flips to permissive
  mode, and drives kbot's own agent (`runAgent`, `coder`) against a tight
  issue-scoped brief. Stages a `kbot/bounty-N` branch; PR push (fork → push →
  `gh pr create` with `Closes #N` + `/attempt #N`) gated behind `--submit`.
  Reports `noChanges` honestly when the agent does nothing.
- `cli.ts` — `poll` / `attempt` / `watch`. `attempt` picks the top worth-attempting
  bounty across all live bounties and hands it to `solver.solveBounty`.
- `hunter.test.ts` (22) + `solver.test.ts` (11) = **33 tests**, all green
  (hunter caught a real #34-vs-#345 boundary bug pre-ship).
- State: `~/.kbot/bounty-hunter/state.json` (seen-set for fresh-bounty diffing).

### Status: radar + issue-targeted solver both built & tested.
`--submit` is the only outward-facing step and stays gated.

**✅ BLOCKER RESOLVED (2026-06-06).** The BYOK Anthropic key was dead (HTTP 401
`invalid x-api-key`, expired since ~April) — which broke ALL of kbot, not just
bounties. Fix: switched `~/.kbot/config.json` `byok_provider` anthropic → **ollama**
(17 local models running); the bounty solver defaults to **`qwen2.5-coder:32b`**.
kbot now calls a model locally — free, offline, no key. Verified: returned "PONG".
The dead Anthropic key is preserved in `byok_key`; to switch back, set
`byok_provider=anthropic` + a fresh key. Config backed up alongside config.json.

**Payout side ready:** `isaacsight` connected on Algora → merged PR auto-pays.
Both gates now clear: kbot can solve (local) AND get paid (Algora). The remaining
variable is solve QUALITY on a local 32B model — proving that on #1539 next.

## In-house work (no payout risk, advances kbot's own product)
- **v4.2 Windows sprint: DONE** — bash.ts / git.ts / files.ts all fixed + committed,
  84/84 tests pass. (Verified 2026-06-06; the old "3 open bugs" memory was stale.)
- **Still open (features):**
  1. `computer.ts` Windows support — currently macOS/Linux only; Playwright/nut.js
     could fill the gap (Peekaboo has no Windows build).
  2. bash tool Windows UX — Windows tests are *skipped*, but a Windows user's model
     still emits `cat`/`ls`/`pwd` that cmd.exe rejects. Optional: Unix→Windows
     command polyfill or PowerShell translation.

## MCP v2 migration (scoped 2026-06-26) — the July-28 spec cliff

**Why now.** The MCP spec ships a breaking 2026-07-28 release: stateless core
(no `initialize` handshake / session IDs), Extensions framework, Tasks as a
first-class extension, and hardened auth (mandatory `iss` validation per
RFC 9207, app-type in Dynamic Client Registration). kbot both **hosts and
consumes** MCP, so this lands on both sides. Starting against the v2 alphas
during the 10-week validation window is the no-rework move vs. a July-28 cliff.

**Current state (verified 2026-06-26).**
- Dep: `@modelcontextprotocol/sdk ^1.0.0` → resolves to `1.29.0` (no 2.x on the
  main SDK yet; the migration entry point is the `server-legacy` shim).
- Host/server side: `src/ide/mcp-server.ts`.
- Consumer/client side: `src/channels/kbot-channel.ts`.
- **Reality check:** kbot is **stdio-only today** — BOTH the host and the channel
  use `StdioServerTransport`; there is **zero SSE/HTTP transport in `src`**. So the
  v2 *transport swap* is NOT urgent. The shim's real near-term value is (a) its
  **OAuth Authorization Server helpers** (`/auth` → `ProxyOAuthServerProvider`,
  the OAuth error classes) for the auth-hardening step, and (b) a pinned v1-SSE
  contract for IF/WHEN kbot exposes an HTTP endpoint. The production v2 path the
  shim itself points at is `StreamableHTTP from @modelcontextprotocol/server`.
- Module: ESM (`type: module`), `engines.node` bumped `>=20` → `>=22` (AI-SDK v4
  line moved to min-Node-22; staying current).

**Scope (do in this order; each is independently shippable):**
1. ✅ **DONE (2026-06-26).** Pin `@modelcontextprotocol/server-legacy@2.0.0-alpha.3`
   (verified on npm: alpha.2/alpha.3 exist), bump Node floor → 22, and add a
   runnable v1-SSE contract test. `src/ide/mcp-legacy-compat.test.ts` pins the
   SSE headers + `event: endpoint` session-id handshake + message framing via a
   mocked `ServerResponse` (4 tests, green; tsc clean).
2. **Auth hardening (next, the real payoff).** When kbot adds an HTTP/OAuth path,
   use the shim's `/auth` helpers as the reference: `iss` validation (RFC 9207) +
   app-type declaration in DCR. Security-relevant — gate behind tests.
3. **HTTP transport (only if/when kbot exposes one).** Stand up `StreamableHTTP`
   from `@modelcontextprotocol/server` for the v2 stateless core; keep the legacy
   SSE shim mounted in parallel for any v1 clients. Not needed while stdio-only.
4. **Tasks + Extensions.** Adopt Tasks (`tasks/get|update|cancel`) as an extension
   — maps cleanly onto kbot's existing `task_*` / `background_*` tool surface.
5. **Consumer side.** Update `kbot-channel.ts` to negotiate v2 where servers
   advertise it, fall back to v1 otherwise.

**Step 1 shipped.** The honest reframing above (stdio-only) means steps 2–5 are
lower-urgency than the July-28 headline implied — do them as kbot grows an HTTP
surface, not on the spec's calendar.

**Refs:** SDK releases https://github.com/modelcontextprotocol/typescript-sdk/releases ·
spec RC https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
**Adjacent pickup:** `@ai-sdk/workflow-harness@1.0.0` (Jun 25) — its
re-validate-tool-approvals-from-client-history pattern is worth lifting into
kbot's tool-call security path during step 3.
