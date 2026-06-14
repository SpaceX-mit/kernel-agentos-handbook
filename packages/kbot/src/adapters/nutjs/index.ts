// nut.js backend for Windows computer-use.
//
// nut.js (@nut-tree-fork/nut-js) is a cross-platform native automation library
// that gives kbot real mouse/keyboard/screen control on Windows — the parity
// counterpart to Peekaboo/AppleScript on macOS and xdotool on Linux.
//
// It is a NATIVE OPTIONAL dependency: it ships prebuilt binaries only for some
// platforms and is heavy to build. So it is loaded via dynamic import() and
// gated behind nutAvailable(). On any host where it isn't installed (macOS,
// Linux, CI), every primitive degrades to a clear {ok:false} install hint
// instead of crashing module load. This keeps tools/computer.ts importable
// everywhere while the Windows path lights up only where nut.js is present.
//
// The key/button mapping helpers are PURE (no nut.js needed) so they are unit
// testable on any host; the actual Key/Button enum resolution happens at call
// time against the loaded module.

const INSTALL_HINT =
  'nut.js not available. Install the Windows backend with: npm i @nut-tree-fork/nut-js'

/** Loose shape of the nut.js module surface we use. */
interface NutModule {
  mouse: any
  keyboard: any
  screen: any
  Point: new (x: number, y: number) => any
  Region: new (left: number, top: number, width: number, height: number) => any
  Button: Record<string, unknown>
  Key: Record<string, unknown>
  FileType: Record<string, unknown>
  straightTo: (target: unknown) => unknown
}

let _nut: Promise<NutModule | null> | null = null

/** Dynamically load nut.js, caching the result. Returns null if not installed. */
async function loadNut(): Promise<NutModule | null> {
  if (!_nut) {
    _nut = (async () => {
      try {
        // @ts-ignore — optional native dep, may be absent at build/runtime
        const mod = await import('@nut-tree-fork/nut-js')
        return mod as unknown as NutModule
      } catch {
        return null
      }
    })()
  }
  return _nut
}

/** True when the nut.js backend is importable on this host. */
export async function nutAvailable(): Promise<boolean> {
  return (await loadNut()) !== null
}

// Default generic is `unknown` (not `void`): `{ ok: true } & unknown` is just
// `{ ok: true }`, whereas `& void` collapses to `never` and rejects the success
// branch. Typed callers pass a payload shape, e.g. NutResult<{ base64: string }>.
export type NutResult<T = unknown> =
  | ({ ok: true } & T)
  | { ok: false; error: string }

// ── Pure mapping helpers (testable without nut.js) ──────────────────

/**
 * Map a key token (one segment of a combo like "ctrl" or "s" or "enter") to a
 * nut.js `Key` enum member NAME, or null if unknown. Resolution to the actual
 * enum value happens at call time via `Key[name]`.
 */
export function resolveKeyName(token: string): string | null {
  const t = token.toLowerCase()
  const named: Record<string, string> = {
    enter: 'Enter', return: 'Enter', tab: 'Tab', escape: 'Escape', esc: 'Escape',
    space: 'Space', backspace: 'Backspace', delete: 'Delete', del: 'Delete',
    up: 'Up', down: 'Down', left: 'Left', right: 'Right',
    home: 'Home', end: 'End', pageup: 'PageUp', pagedown: 'PageDown',
    // Modifiers. cmd/command/win/meta all map to the platform Super key, which
    // is the Windows key on win32.
    cmd: 'LeftSuper', command: 'LeftSuper', win: 'LeftSuper', super: 'LeftSuper',
    meta: 'LeftSuper', ctrl: 'LeftControl', control: 'LeftControl',
    alt: 'LeftAlt', option: 'LeftAlt', shift: 'LeftShift',
  }
  if (named[t]) return named[t]
  if (/^f([1-9]|1[0-2])$/.test(t)) return t.toUpperCase() // f1..f12 -> F1..F12
  if (/^[a-z]$/.test(t)) return t.toUpperCase() // letter -> A..Z
  if (/^[0-9]$/.test(t)) return `Num${t}` // digit -> Num0..Num9
  return null
}

/**
 * Parse a key combo string ("ctrl+shift+s", "enter") into an ordered list of
 * nut.js `Key` member names. Modifiers come first, the main key last — the
 * order nut.js's `keyboard.type(...)` expects for shortcuts. Returns null if
 * any segment is unrecognized.
 */
export function parseKeyCombo(combo: string): string[] | null {
  const segments = combo.split('+').map(s => s.trim()).filter(Boolean)
  if (segments.length === 0) return null
  const names: string[] = []
  for (const seg of segments) {
    const name = resolveKeyName(seg)
    if (!name) return null
    names.push(name)
  }
  return names
}

/** Map a button name to a nut.js `Button` enum member name. */
export function resolveButtonName(button: string): 'LEFT' | 'RIGHT' | 'MIDDLE' {
  const b = button.toLowerCase()
  if (b === 'right') return 'RIGHT'
  if (b === 'middle') return 'MIDDLE'
  return 'LEFT'
}

// ── nut.js-backed primitives ────────────────────────────────────────

import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readFileSync, existsSync, unlinkSync } from 'node:fs'

/** Capture the screen (or a region "x,y,w,h") to PNG base64. */
export async function nutScreenshot(region?: string): Promise<NutResult<{ base64: string; bytes: number }>> {
  const nut = await loadNut()
  if (!nut) return { ok: false, error: INSTALL_HINT }
  const { screen, Region, FileType } = nut
  const stamp = `${process.pid}-${Math.round(performance.now())}`
  const fileName = `kbot-shot-${stamp}`
  try {
    let writtenPath: string
    if (region) {
      const [x, y, w, h] = region.split(',').map(Number)
      if ([x, y, w, h].some(n => Number.isNaN(n))) {
        return { ok: false, error: 'region must be "x,y,w,h" (numbers)' }
      }
      writtenPath = await screen.captureRegion(fileName, new Region(x, y, w, h), FileType.PNG, tmpdir())
    } else {
      writtenPath = await screen.capture(fileName, FileType.PNG, tmpdir())
    }
    // nut.js returns the written path; fall back to the conventional path.
    const path = writtenPath || join(tmpdir(), `${fileName}.png`)
    if (!existsSync(path)) return { ok: false, error: 'screenshot produced no file' }
    const buffer = readFileSync(path)
    try { unlinkSync(path) } catch { /* best effort */ }
    if (buffer.length < 500) return { ok: false, error: 'screenshot appears blank' }
    return { ok: true, base64: buffer.toString('base64'), bytes: buffer.length }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/** Click at coordinates. button: left | right | middle | double. */
export async function nutClick(x: number, y: number, button: string): Promise<NutResult> {
  const nut = await loadNut()
  if (!nut) return { ok: false, error: INSTALL_HINT }
  const { mouse, Point, Button } = nut
  try {
    await mouse.setPosition(new Point(x, y))
    if (button.toLowerCase() === 'double') {
      await mouse.doubleClick(Button.LEFT)
    } else {
      await mouse.click(Button[resolveButtonName(button)])
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/** Scroll in a direction by `amount` clicks, optionally after moving to (x,y). */
export async function nutScroll(
  direction: string, amount: number, x?: number, y?: number,
): Promise<NutResult> {
  const nut = await loadNut()
  if (!nut) return { ok: false, error: INSTALL_HINT }
  const { mouse, Point } = nut
  const dir = direction.toLowerCase()
  if (!['up', 'down', 'left', 'right'].includes(dir)) {
    return { ok: false, error: 'direction must be up, down, left, or right' }
  }
  try {
    if (x !== undefined && y !== undefined) await mouse.setPosition(new Point(x, y))
    if (dir === 'up') await mouse.scrollUp(amount)
    else if (dir === 'down') await mouse.scrollDown(amount)
    else if (dir === 'left') await mouse.scrollLeft(amount)
    else await mouse.scrollRight(amount)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/** Press-hold-move-release drag from (fx,fy) to (tx,ty). */
export async function nutDrag(fx: number, fy: number, tx: number, ty: number): Promise<NutResult> {
  const nut = await loadNut()
  if (!nut) return { ok: false, error: INSTALL_HINT }
  const { mouse, Point, Button, straightTo } = nut
  try {
    await mouse.setPosition(new Point(fx, fy))
    await mouse.pressButton(Button.LEFT)
    await mouse.move(straightTo(new Point(tx, ty)))
    await mouse.releaseButton(Button.LEFT)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/** Type literal text. */
export async function nutType(text: string): Promise<NutResult> {
  const nut = await loadNut()
  if (!nut) return { ok: false, error: INSTALL_HINT }
  const { keyboard } = nut
  try {
    await keyboard.type(text)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/** Press a key or combo ("enter", "ctrl+c", "ctrl+shift+s"). */
export async function nutKey(combo: string): Promise<NutResult> {
  const nut = await loadNut()
  if (!nut) return { ok: false, error: INSTALL_HINT }
  const { keyboard, Key } = nut
  const names = parseKeyCombo(combo)
  if (!names) return { ok: false, error: `unrecognized key: ${combo}` }
  const keys = names.map(n => Key[n])
  if (keys.some(k => k === undefined)) {
    return { ok: false, error: `unsupported key in combo: ${combo}` }
  }
  try {
    await keyboard.type(...keys)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/** Screen size + current mouse position. */
export async function nutScreenInfo(): Promise<NutResult<{ width: number; height: number; mouse: string }>> {
  const nut = await loadNut()
  if (!nut) return { ok: false, error: INSTALL_HINT }
  const { screen, mouse } = nut
  try {
    const width = await screen.width()
    const height = await screen.height()
    const pos = await mouse.getPosition()
    return { ok: true, width, height, mouse: `${pos.x},${pos.y}` }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
