// Peekaboo CLI surface — minimal type model.
//
// Mirrors the JSON shape emitted by the `peekaboo` macOS CLI
// (https://github.com/openclaw/Peekaboo) without taking a runtime
// dependency. kbot stays binary-agnostic; this adapter only ever
// speaks JSON across the process boundary.

export interface PeekabooFrame {
  x: number
  y: number
  width: number
  height: number
}

export interface PeekabooElement {
  /** Element handle, e.g. "B1" (button), "T1" (text field). */
  id: string
  role: string
  label?: string
  frame: PeekabooFrame
  /** Whether the element accepts a value (text fields, sliders, etc.). */
  settable?: boolean
  /** Action names the element advertises via the AX API. */
  named_actions?: string[]
}

export interface PeekabooSeeResult {
  /** Snapshot id used by subsequent `--snapshot $id` arguments. */
  snapshot: string
  app?: string
  window?: string
  elements: PeekabooElement[]
  /** Optional path on disk where the screenshot was written. */
  screenshot_path?: string
}

export interface PeekabooClickResult {
  ok: boolean
  target?: string
  coords?: [number, number]
}

export interface PeekabooTypeResult {
  ok: boolean
  typed: string
  cleared?: boolean
}

export interface PeekabooSetValueResult {
  ok: boolean
  target: string
  value: string
}

export interface PeekabooPerformActionResult {
  ok: boolean
  target: string
  action: string
}

export interface PeekabooAgentResult {
  ok: boolean
  output: string
}

/**
 * Structured error returned by all command helpers when the binary exits
 * non-zero or emits malformed JSON. Helpers return `{ ok: false, error }`
 * rather than throw so callers can route via discriminated unions.
 */
export interface PeekabooError {
  ok: false
  error: {
    code: 'non-zero-exit' | 'malformed-json' | 'binary-missing' | 'unknown'
    message: string
    stderr?: string
    stdout?: string
    exitCode?: number
  }
}

export type PeekabooOutcome<T> = ({ ok: true } & T) | PeekabooError
