// futures/persona/types — type-checked privilege scoping for tool invocation.
//
// A Persona is a named bundle of Scopes. A Scope binds a tool pattern to a
// set of argument constraints, an optional rate limit, and is bounded by
// the Persona's max blast radius. canInvoke() resolves a (persona, tool, args)
// triple to a Verdict. enforce() turns a denied Verdict into a thrown error.
//
// Module is standalone — no integration into permissions.ts yet.

/**
 * Blast-radius hierarchy. Ordered from least to most dangerous.
 * A Persona's maxBlastRadius caps the radius any of its scopes may target;
 * mergePersonas() takes the maximum across inputs.
 */
export type BlastRadius = 'none' | 'read-only' | 'sandboxed' | 'destructive'

export const BLAST_RADIUS_ORDER: readonly BlastRadius[] = [
  'none',
  'read-only',
  'sandboxed',
  'destructive',
] as const

/**
 * Constraint applied to a single tool argument by name.
 * - `type` — required runtime type
 * - `allowedValues` — enum of permitted literal values (when type === 'enum')
 * - `pattern` — regex test for string args (rejected if it matches a
 *   forbidden form; we use it as a *deny* pattern by convention — see check.ts)
 * - `min` / `max` — numeric bounds (inclusive). For strings, applied to length.
 */
export interface ArgRule {
  type: 'string' | 'number' | 'boolean' | 'enum'
  allowedValues?: unknown[]
  pattern?: RegExp
  /** When true, the regex acts as a *deny* pattern (match → reject). Defaults to false (must match). */
  denyPattern?: boolean
  min?: number
  max?: number
}

/**
 * A single permission scope. Match against a tool name and a payload of args.
 * - `toolPattern` — exact string match or RegExp test
 * - `argConstraints` — keyed by argument name
 * - `rateLimit` — sliding-window counter shared per (persona.id, toolName)
 */
export interface Scope {
  toolPattern: string | RegExp
  argConstraints?: Record<string, ArgRule>
  rateLimit?: { max: number; windowMs: number }
  /** Optional radius for this scope; cannot exceed Persona's maxBlastRadius. */
  blastRadius?: BlastRadius
}

/**
 * Named, composable persona. `id` is the lookup key in the registry.
 */
export interface Persona {
  id: string
  description: string
  scopes: Scope[]
  maxBlastRadius?: BlastRadius
}

export interface PermissionGrant {
  persona: Persona
  toolName: string
  args: Record<string, unknown>
}

export interface Verdict {
  allowed: boolean
  reason?: string
  matchedScope?: Scope
}

/**
 * Thrown by enforce(). Carries the full verdict for upstream logging.
 */
export class PermissionDeniedError extends Error {
  readonly verdict: Verdict
  readonly grant: PermissionGrant
  constructor(grant: PermissionGrant, verdict: Verdict) {
    super(
      `permission denied: persona=${grant.persona.id} tool=${grant.toolName} reason=${verdict.reason ?? 'no scope matched'}`,
    )
    this.name = 'PermissionDeniedError'
    this.verdict = verdict
    this.grant = grant
  }
}
