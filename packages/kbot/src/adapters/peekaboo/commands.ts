// Peekaboo high-level helpers — typed wrappers around the JSON CLI.
//
// Each helper assembles argv for `peekaboo <subcommand> --json`, runs it
// through `runPeekaboo`, and parses stdout into the appropriate result
// type. Non-zero exits and malformed JSON are returned as `PeekabooError`
// rather than thrown — callers fan out via discriminated unions.

import { runPeekaboo } from './runner.js'
import type {
  PeekabooAgentResult,
  PeekabooClickResult,
  PeekabooError,
  PeekabooOutcome,
  PeekabooPerformActionResult,
  PeekabooSeeResult,
  PeekabooSetValueResult,
  PeekabooTypeResult,
} from './types.js'

function failNonZero(code: number, stdout: string, stderr: string): PeekabooError {
  return {
    ok: false,
    error: {
      code: 'non-zero-exit',
      message: `peekaboo exited ${code}`,
      stdout,
      stderr,
      exitCode: code,
    },
  }
}

function failParse(message: string, stdout: string): PeekabooError {
  return {
    ok: false,
    error: {
      code: 'malformed-json',
      message,
      stdout,
    },
  }
}

function parseJson(stdout: string): { ok: true; value: unknown } | { ok: false; err: PeekabooError } {
  try {
    return { ok: true, value: JSON.parse(stdout) as unknown }
  } catch (e) {
    return { ok: false, err: failParse((e as Error).message, stdout) }
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

function asBool(v: unknown, fallback = false): boolean {
  return typeof v === 'boolean' ? v : fallback
}

function asNumber(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

// --- see ---------------------------------------------------------------

export interface SeeOptions {
  app?: string
  mode?: 'screen' | 'window'
  retina?: boolean
}

export async function see(opts: SeeOptions = {}): Promise<PeekabooOutcome<PeekabooSeeResult>> {
  const args = ['see', '--json']
  if (opts.app) args.push('--app', opts.app)
  if (opts.mode) args.push('--mode', opts.mode)
  if (opts.retina) args.push('--retina')

  const { stdout, stderr, code } = await runPeekaboo(args)
  if (code !== 0) return failNonZero(code, stdout, stderr)
  const parsed = parseJson(stdout)
  if (!parsed.ok) return parsed.err

  const v = parsed.value
  if (!isRecord(v)) return failParse('see: expected object at root', stdout)

  const rawElements = Array.isArray(v.elements) ? v.elements : []
  const elements = rawElements.flatMap((el): PeekabooSeeResult['elements'] => {
    if (!isRecord(el)) return []
    const frameRaw = isRecord(el.frame) ? el.frame : {}
    return [
      {
        id: asString(el.id),
        role: asString(el.role),
        label: typeof el.label === 'string' ? el.label : undefined,
        frame: {
          x: asNumber(frameRaw.x),
          y: asNumber(frameRaw.y),
          width: asNumber(frameRaw.width),
          height: asNumber(frameRaw.height),
        },
        settable: typeof el.settable === 'boolean' ? el.settable : undefined,
        named_actions: Array.isArray(el.named_actions)
          ? el.named_actions.filter((a): a is string => typeof a === 'string')
          : undefined,
      },
    ]
  })

  return {
    ok: true,
    snapshot: asString(v.snapshot),
    app: typeof v.app === 'string' ? v.app : undefined,
    window: typeof v.window === 'string' ? v.window : undefined,
    elements,
    screenshot_path: typeof v.screenshot_path === 'string' ? v.screenshot_path : undefined,
  }
}

// --- click -------------------------------------------------------------

export interface ClickOptions {
  snapshot: string
  on?: string
  coords?: [number, number]
  wait?: number
}

export async function click(opts: ClickOptions): Promise<PeekabooOutcome<PeekabooClickResult>> {
  const args = ['click', '--json', '--snapshot', opts.snapshot]
  if (opts.on) args.push('--on', opts.on)
  if (opts.coords) args.push('--coords', `${opts.coords[0]},${opts.coords[1]}`)
  if (typeof opts.wait === 'number') args.push('--wait', String(opts.wait))

  const { stdout, stderr, code } = await runPeekaboo(args)
  if (code !== 0) return failNonZero(code, stdout, stderr)
  const parsed = parseJson(stdout)
  if (!parsed.ok) return parsed.err
  if (!isRecord(parsed.value)) return failParse('click: expected object at root', stdout)
  const v = parsed.value
  return {
    ok: true,
    target: typeof v.target === 'string' ? v.target : undefined,
    coords:
      Array.isArray(v.coords) && v.coords.length === 2
        ? [asNumber(v.coords[0]), asNumber(v.coords[1])]
        : undefined,
  }
}

// --- type --------------------------------------------------------------

export interface TypeOptions {
  text: string
  clear?: boolean
  delayMs?: number
}

// `type` is reserved in TS; export the helper as `type_`.
export async function type_(opts: TypeOptions): Promise<PeekabooOutcome<PeekabooTypeResult>> {
  const args = ['type', '--json', '--text', opts.text]
  if (opts.clear) args.push('--clear')
  if (typeof opts.delayMs === 'number') args.push('--delay', String(opts.delayMs))

  const { stdout, stderr, code } = await runPeekaboo(args)
  if (code !== 0) return failNonZero(code, stdout, stderr)
  const parsed = parseJson(stdout)
  if (!parsed.ok) return parsed.err
  if (!isRecord(parsed.value)) return failParse('type: expected object at root', stdout)
  const v = parsed.value
  return {
    ok: true,
    typed: asString(v.typed, opts.text),
    cleared: typeof v.cleared === 'boolean' ? v.cleared : undefined,
  }
}

// --- set-value ---------------------------------------------------------

export interface SetValueOptions {
  snapshot: string
  on: string
  value: string
}

export async function setValue(
  opts: SetValueOptions,
): Promise<PeekabooOutcome<PeekabooSetValueResult>> {
  const args = [
    'set-value',
    '--json',
    '--snapshot',
    opts.snapshot,
    '--on',
    opts.on,
    '--value',
    opts.value,
  ]
  const { stdout, stderr, code } = await runPeekaboo(args)
  if (code !== 0) return failNonZero(code, stdout, stderr)
  const parsed = parseJson(stdout)
  if (!parsed.ok) return parsed.err
  if (!isRecord(parsed.value)) return failParse('set-value: expected object at root', stdout)
  const v = parsed.value
  return {
    ok: true,
    target: asString(v.target, opts.on),
    value: asString(v.value, opts.value),
  }
}

// --- perform-action ----------------------------------------------------

export interface PerformActionOptions {
  snapshot: string
  on: string
  action: string
}

export async function performAction(
  opts: PerformActionOptions,
): Promise<PeekabooOutcome<PeekabooPerformActionResult>> {
  const args = [
    'perform-action',
    '--json',
    '--snapshot',
    opts.snapshot,
    '--on',
    opts.on,
    '--action',
    opts.action,
  ]
  const { stdout, stderr, code } = await runPeekaboo(args)
  if (code !== 0) return failNonZero(code, stdout, stderr)
  const parsed = parseJson(stdout)
  if (!parsed.ok) return parsed.err
  if (!isRecord(parsed.value)) return failParse('perform-action: expected object at root', stdout)
  const v = parsed.value
  return {
    ok: true,
    target: asString(v.target, opts.on),
    action: asString(v.action, opts.action),
  }
}

// --- agent -------------------------------------------------------------

export interface AgentOptions {
  prompt: string
}

/**
 * Runs `peekaboo agent "$prompt"` and returns the final stdout. Unlike the
 * structured commands the agent subcommand may emit free-form text, so we
 * surface stdout verbatim under `output`.
 */
export async function agent(opts: AgentOptions): Promise<PeekabooOutcome<PeekabooAgentResult>> {
  const { stdout, stderr, code } = await runPeekaboo(['agent', opts.prompt])
  if (code !== 0) return failNonZero(code, stdout, stderr)
  return { ok: true, output: stdout }
}
