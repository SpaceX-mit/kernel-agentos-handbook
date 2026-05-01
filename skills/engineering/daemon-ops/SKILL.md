---
name: daemon-ops
description: Operate the kbot daemon — the 24/7 background worker that runs code review, embeddings, i18n sync, and digest tasks via local Ollama. Use when user mentions daemon, background, 24/7, watchdog, ollama, kernel-coder, kbot-daemon, daemon:start, daemon:stop, daemon:log, or asks why the daemon is dead, slow, or chewing tokens.
---

# daemon-ops

## What the daemon is

`tools/kbot-daemon.ts` is a 24/7 background worker that runs scheduled tasks against the
user's local Ollama models. Zero API cost — everything runs on `localhost:11434`. Triggered
by macOS launchd every 15 minutes via `~/Library/LaunchAgents/com.kernel.kbot-daemon.plist`.

State at `tools/daemon-reports/state.json`. Log at `tools/daemon-reports/daemon.log`.

## Tasks and intervals

1. **Git diff review** — every run if new commits (uses `kernel-coder:latest`)
2. **Code quality scan** — every 4h
3. **i18n sync** — every 6h, translates 23 languages via `kernel:latest`
4. **Embedding index** — every 8h via `nomic-embed-text`
5. **Test coverage gaps** — every 12h, scaffolds new tests
6. **Documentation gaps** — every 12h, generates JSDoc
7. **Daily digest** — once per 24h

## Commands

```bash
npm run daemon              # Run all due tasks once, manually
npm run daemon:stats        # Token usage dashboard (vs Sonnet pricing)
npm run daemon:log          # Tail tools/daemon-reports/daemon.log
npm run daemon:start        # Enable launchd service (24/7)
npm run daemon:stop         # Disable launchd service
```

## Diagnosing a dead or slow daemon

Run these in order — each step rules out a layer:

1. **Is it scheduled?** `launchctl list | grep kbot` — should show
   `com.kernel.kbot-daemon` with a non-zero PID or `0` (last exit OK).
2. **Is Ollama up?** `curl -s localhost:11434/api/tags | head` — must return JSON. If it
   errors, start Ollama (`ollama serve` or the menu-bar app).
3. **Are the models present?** `ollama list` — must include `kernel-coder:latest`,
   `kernel:latest`, `deepseek-r1:14b`, `nomic-embed-text`. If any are missing,
   `tools/setup-kernel-models.sh` rebuilds them.
4. **What's the last run say?** `npm run daemon:log` — recent entries show which task
   ran, exit code, duration.
5. **Force a manual run.** `npm run daemon` — bypasses launchd timing, exposes errors.

## What's safe to disable

- **Daily digest** — pure reporting, no side effects. Safe to skip.
- **i18n sync** — only matters before a web deploy. Safe to skip on a quiet day.
- **Embedding index** — semantic search degrades but doesn't break. Safe to skip.

## What other systems depend on the daemon

- `tools/kbot-discovery-daemon.ts` (self-advocacy) reads daemon state but runs its own
  cycle. Independent.
- `tools/kbot-social-daemon.ts` (social posting) is independent — separate cron.
- The web companion's i18n cache busts at build time independent of the daemon. The daemon
  only refreshes the source translations.

## When to stop the daemon

If the user reports unexpected token usage, `npm run daemon:stats` shows the breakdown.
The daemon is local-only by design — if stats show non-zero API spend, something is
misconfigured and the daemon should be stopped (`npm run daemon:stop`) until investigated.
