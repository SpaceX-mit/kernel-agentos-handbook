# Windows worker case study — kbot v4.2 sprint

*A four-day bring-up of a second worker (Acer Swift, Windows 11 Home) for the kbot codebase. What broke. What it tells you about every JavaScript/TypeScript codebase that grew up on Mac/Linux.*

Dated 2026-05-17. Filed alongside [`packages/kbot`](../packages/kbot/).

---

## The setup

One Acer Swift Go laptop, Windows 11 Home, joined to the Tailscale network as `100.125.59.54` (host name `claude`). Configured for SSH key-auth from the Mac. Node 24, Git, Claude Code 2.1.141, RustDesk for fallback remote desktop.

The point of the second worker isn't redundancy. It's a different operating system staring at the same codebase. Bugs that live invisibly on a Unix-only fleet surface on first contact.

## First-run baseline

Cloned `kbot` to the Windows box. Ran `npm install`, then `npx vitest run`.

| | Result |
|---|---|
| Passing | 1324 |
| Failing | 46 |
| Skipped | 0 |

46 failures across 1370 tests. The codebase had never been run on Windows. We knew the number would be non-zero; 46 was at the upper end of the bet.

Two files had to be deleted from the repo before the clone could complete: one with a leading/trailing space in its name, one with `**` characters. Windows filesystem rejected them at checkout. Commits `3d8d7f59` and `78c63408`.

## The bug taxonomy

The 46 failures fell into five categories. All of them are common in long-lived JS/TS codebases.

### 1. POSIX mode-check guards (most embarrassing)

Three locations in `packages/kbot/src/tools/plugins.ts` did:

```typescript
const stat = statSync(pluginPath)
if (!(stat.mode & 0o400)) {
  throw new Error('plugin not readable')
}
```

That bitmask is meaningful on POSIX. On NTFS there are no POSIX bits. Node returns a synthetic always-writable value, and the test against `0o400` rejected every plugin. **No plugin had ever loaded on Windows kbot.** Not a test bug; a user-facing bug for any Windows user trying to use the plugin system.

Fix: wrap the mode check with `if (process.platform !== 'win32')`. Commits `c2f8b764`, `7f9aeb01`.

### 2. Single-quote shell escaping (cmd.exe doesn't speak it)

`packages/kbot/src/tools/git.ts` had a helper:

```typescript
function esc(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`
}
execSync(`git commit -m ${esc(message)}`, { ... })
```

On bash, single quotes group; the escape pattern is a 30-year-old idiom. On cmd.exe, single quotes are literal characters. The commit message was being stored with literal apostrophes wrapping it.

Fix: refactor from string-based `execSync` to args-array `spawnSync`. No shell, no quoting, no escape function. All six `git_*` tools rewritten. Commit `7b6dd0e3`.

```typescript
function git(args: string[], timeout = 30_000): string {
  const res = spawnSync('git', args, {
    encoding: 'utf-8', timeout,
    maxBuffer: 5 * 1024 * 1024,
    cwd: getRepoRoot(),
  })
  if (res.error) throw new Error(res.error.message)
  if (res.status !== 0) {
    const stderr = (res.stderr ?? '').toString().trim()
    throw new Error(stderr || 'Git command failed')
  }
  return (res.stdout ?? '').toString().trim()
}
```

This is the bigger lesson of the sprint. Whenever you have a function called `esc()` in shell-out code, you have a Windows bug waiting to fire. Use `spawnSync(args[])` from the start.

### 3. Hardcoded `'/'` path splits

`forecast-summary.ts` and `train-curate.ts` did things like:

```typescript
const filename = path.split('/').pop()
mkdirSync(path.split('/').slice(0, -1).join('/'))
```

On NTFS the separator is `\`. The split returned the whole path; the slice returned `''`; the mkdir crashed with `ENOENT: mkdir ''`.

Fix: use `path.basename()` and `path.dirname()` from `node:path`. They handle both separators. Commit `c2f8b764`.

### 4. Shell-outs to Unix utilities (`rm`, `ls`, `wc`, `pwd`)

`packages/kbot/src/tools/files.ts` had:

```typescript
const result = execSync(`ls -la "${path}"`)
const result = execSync(`grep -r "${pattern}" .`)
```

cmd.exe has none of those. The right answer is Node-native equivalents.

Fix: rewrote `glob`, `grep`, and `list_directory` Node-native. `glob` uses `picomatch` against `readdirSync`. `grep` uses `readFileSync` plus regex. `list_directory` uses `readdirSync`. Commit `bb6fdf07`. Also removed a redundant `pwd` shell-out from `bash.ts` (the cwd was already a parameter on the spawn call). Commit `fbc1e73f`.

### 5. Test plumbing assuming Unix shell

`bash.test.ts` invoked `echo`, `wc`, `cat`, `rm`, `sleep`, and `$VAR` expansion. The bash *tool* itself is platform-correct (it forwards to whatever system shell is configured), but the tests verified Unix-shell-specific behaviour.

Fix: marked the Unix-coupled tests with `it.skipIf(process.platform === 'win32')`. The platform-agnostic tests (safety blocking, exit code handling) still run on Windows. A separate set of cmd.exe-native tests would be the next move; not in v4.2 scope.

Also `git.test.ts` was using `rm`, `2>/dev/null`, and `||` for setup. Replaced with Node-native fs operations and a `tryRun()` helper.

## Result

After four days of focused work:

| | May 13 baseline | After sprint |
|---|---|---|
| Passing | 1324 | 1354 |
| Failing | 46 | 8 |
| Skipped | 0 | 8 (intentional) |

**83% reduction in failures.** 38 tests went red-to-green. The remaining eight are in test files this sprint didn't cover (vitest dynamic-import behaviour on Windows, one workspace-agents planner test, one agent-os/acap test, the security-audit-local integration tests). They are a different problem class and deserve their own scope.

Five commits, in order:

| Commit | Scope |
|---|---|
| `c2f8b764` | First pass: `forecast-summary.ts`, `train-curate.ts`, `security-audit-local.test.ts`, `plugins.ts`, `plugin-sdk.ts` — POSIX mode-check guards and hardcoded `'/'` splits |
| `7f9aeb01` | Third POSIX mode-check guard at `plugins.ts:165` |
| `bb6fdf07` | `files.ts` rewritten Node-native: `glob`, `grep`, `list_directory` |
| `fbc1e73f` | `bash.ts` redundant `pwd` shell-out removed. `git.test.ts` Unix-isms replaced with cross-platform helpers |
| `7b6dd0e3` | `git.ts` refactored from `execSync(string)` to `spawnSync(args[])`. `bash.test.ts` Unix tests guarded with `it.skipIf(win32)` |

## What the pattern says about your codebase

If your JavaScript/TypeScript codebase has any of the following, you have a Windows bug, whether or not you have a Windows user:

- A function named `esc()`, `quote()`, `shellEscape()`, or similar in code that calls `execSync` or `exec`
- Calls to `execSync` with a string argument containing user data
- Any `mode & 0o4xx` check on file stats not guarded by `process.platform !== 'win32'`
- Hardcoded `'/'` in `path.split` or `path.join` substitutes
- Shell-outs to `rm`, `ls`, `cat`, `grep`, `find`, `wc`, `pwd`, or `sed`
- Test setup using `||`, `2>/dev/null`, `2>&1`, `&`, or backticks
- Filenames in the repo with leading/trailing whitespace, `:`, `*`, `?`, `<`, `>`, `|`, or `"` (Windows-reserved)

Pattern five is the most surprising. Every Unix shell handles cleanup in tests with `rm -f thing 2>/dev/null || true`. Windows tests have to be rewritten.

## The work-time accounting

Setup of the Windows machine: about half a day spread across a working day (RustDesk install, Tailscale, SSH keys, Node, Git, Claude Code).

Bug fixing: four sessions of roughly two hours each. The fixes are mechanical once you see the pattern; the time goes into recognizing the pattern across files and writing tests that prove the new path.

Total elapsed: four calendar days, May 13 to May 17. Total focused time: maybe twelve hours.

The value isn't the twelve hours of work. It's the codebase moving from "untested on Windows" to "verified on Windows" as a step-function. The same step lives in front of most JS/TS repos that grew up on Mac/Linux. If you ship a CLI, the cost of doing this once is small. The cost of not doing it is paid quietly every time a Windows user files an issue and gets nothing.

## See also

- [`docs/agents-and-money.md`](agents-and-money.md) — cross-platform code audits as a paid-work category
- [`packages/kbot/CHANGELOG.md`](../packages/kbot/CHANGELOG.md) — v4.2.x release notes
- [Issue #42](https://github.com/isaacsight/kernel/issues/42) — original sprint tracking issue (closed)
