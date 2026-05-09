---
name: peekaboo-snapshot-act
description: Use when an agent needs to drive a macOS native app reliably — snapshot-then-act via Peekaboo's accessibility-aware element IDs beats screenshot-per-click for any app with proper AX support.
version: 1.0.0
author: kbot
license: MIT
metadata:
  kbot:
    tags: [computer-use, macos, accessibility, native-apps, automation]
    related_skills: [computer-use-coordination, ableton-osc-control]
---

# Peekaboo Snapshot-Act

Every input surface has a right shape. Web is DOM — address elements by ref through Chrome MCP or Playwright. Audio is OSC — address tracks and clips through AbletonOSC's Live Object Model. Native macOS is AX — address controls through the Accessibility tree. Snapshot-and-act replaces screenshot-and-guess: capture the AX tree once, reference labeled element IDs many times, and let the OS resolve coordinates.

## When to Use

- Native macOS app automation where the target exposes Accessibility (Notes, Mail, System Settings, Music, Finder, Xcode, Numbers, Keynote, Pages).
- Forms with multiple fields where one snapshot fills them all.
- Repeated interactions inside the same app state where stable element IDs survive across calls.
- Any task where pixel coordinates would drift between window resizes, theme changes, or display scales.

Do **not** use this skill for:

- Browser tabs — use Chrome MCP (`mcp__claude-in-chrome__*`); the DOM is the right surface.
- Ableton Live or other audio software with OSC bridges — use `ableton_*` tools; OSC is the right surface.
- Apps with no Accessibility support — fall through to synthetic input via `mcp__computer-use__*` and accept the cost.

## Iron Laws

```
ONE SNAPSHOT, MANY ACTIONS.
ELEMENT ID OVER COORDINATES.
PERFORM-ACTION OVER CLICK.
```

A snapshot is a contract: while the UI does not change, the IDs are stable. Capture once, act many times, re-snapshot only on visible state change. An element ID survives where coordinates do not — themes shift, windows resize, scroll positions move; `B7` does not. And when an AX action is named (`AXPress`, `AXShowMenu`, `AXIncrement`), perform it directly; clicking the rendered pixel is a worse approximation of the user's intent.

## Five Phases

### Phase 1 — Approve & focus

Bring the target app forward and clear the per-app session lock before any Peekaboo call.

- `app_approve` — gate the sensitive-app warning; respect the user's per-app trust state.
- `app_launch` — bring the app to the front so AX queries hit the right process.
- One-time at the OS level: grant Peekaboo **Screen Recording** and **Accessibility** in System Settings → Privacy & Security. Without both, `see` returns an empty tree.

### Phase 2 — Capture surface

Pull the AX snapshot once.

```
peekaboo see --app <Name> --json
```

The response contains a snapshot ID and labeled element IDs by role: `B1` for the first button, `T1` for the first text field, `L1` for a link, `M1` for a menu. Read the labels, not the pixels. The snapshot ID is the handle every subsequent call references.

### Phase 3 — Choose the right verb

Three verbs cover almost every native interaction. Pick the most specific one that fits.

- `set-value` — for any settable field (text inputs, sliders, steppers). Faster and more reliable than `click + type`. Sets the AX value directly.
- `perform-action` — for any named AX action (`AXPress`, `AXShowMenu`, `AXConfirm`, `AXIncrement`, `AXDecrement`). Names the intent the OS already understands.
- `click` — only when neither of the above applies (custom non-AX views, web content embedded in a native shell).

### Phase 4 — Reuse the snapshot

Successive actions reference the same `--snapshot $ID` until the UI changes. Filling a five-field form is one snapshot and five `set-value` calls, not five snapshots and five clicks. Re-snapshot only when the visible state actually changes — a panel opens, a sheet appears, a navigation transitions. Re-snapshotting before every action defeats the entire pattern and is slower than synthetic input.

### Phase 5 — Fall back gracefully

If the AX path fails — element ID stale, app exposes no AX tree, action returns an error — fall through to synthetic input via `kbot_click` or `mcp__computer-use__*` and log the fallback. Record which app and which action degraded so the next session knows. Graceful degradation beats a hard failure; opaque retry loops do not.

## Anti-Patterns

- Re-snapshotting before every click. The whole point is reuse — one snapshot, many actions.
- Using coordinates when an element ID exists. IDs survive resize, theme, and scale changes; coordinates do not.
- Ignoring `set-value` and falling through to `click + type` for text fields. Slower, less reliable, and breaks on focus drift.
- Driving Chrome with Peekaboo. Chrome MCP exists for a reason; the DOM is the right surface for the web.
- Skipping `app_approve`. The per-app session lock and sensitive-app warnings still apply — Peekaboo does not bypass kbot's trust model.

## How kbot Helps

- `peekaboo_see` — wraps `peekaboo see --json` with kbot's lock + approval flow; returns snapshot ID and element IDs.
- `peekaboo_click` / `peekaboo_type` / `peekaboo_set_value` / `peekaboo_perform_action` — the four verbs, each lock-aware and approval-gated.
- `peekaboo_agent` — composite tool for multi-step flows that snapshot once and act many times under one approval.
- `kbot_click` — falls through to the AX-first path automatically when the `peekaboo` binary is on `PATH`; no caller change required.
- `app_approve` — gates per-app sensitive-app warnings before any Peekaboo call lands.
- Coordinator — the same per-app sub-locks apply across Peekaboo and the existing `computer.ts` synthetic-input path; both share one lock file, so AX and pixel routes never race against each other.
