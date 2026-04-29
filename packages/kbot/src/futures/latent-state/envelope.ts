/**
 * Latent-state envelope — runtime helpers.
 * Pure functions over `LatentEnvelope`. Node `crypto` (sha256) for hashing.
 */

import { createHash } from 'node:crypto'
import type { EnvelopeKind, LatentEnvelope, ProvenanceEntry } from './types.js'

/** JSON.stringify with deterministic key order (Object.keys().sort()). */
export function stableStringify(value: unknown): string {
  return JSON.stringify(canonicalize(value))
}

function canonicalize(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(canonicalize)
  const obj = value as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(obj).sort()) out[key] = canonicalize(obj[key])
  return out
}

function hashableBody(env: Omit<LatentEnvelope, 'contentHash'>): unknown {
  return {
    version: env.version, from: env.from, to: env.to, kind: env.kind,
    text: env.text, structured: env.structured,
    provenance: env.provenance, createdAt: env.createdAt,
  }
}

function computeHash(env: Omit<LatentEnvelope, 'contentHash'>): string {
  return createHash('sha256').update(stableStringify(hashableBody(env))).digest('hex')
}

export interface CreateEnvelopeOpts {
  from: string
  to: string
  text?: string
  structured?: Record<string, unknown>
  createdAt?: string
  note?: string
}

function classify(
  text: string | undefined,
  structured: Record<string, unknown> | undefined,
): EnvelopeKind {
  if (text !== undefined && structured !== undefined) return 'mixed'
  if (structured !== undefined) return 'structured'
  return 'text'
}

/**
 * Build a fresh envelope. Auto-derives `kind`, stamps `createdAt`, seeds
 * provenance with a single step from `opts.from`, and computes `contentHash`.
 */
export function createEnvelope(opts: CreateEnvelopeOpts): LatentEnvelope {
  const kind = classify(opts.text, opts.structured)
  const createdAt = opts.createdAt ?? new Date().toISOString()
  const provenance: ProvenanceEntry[] = [
    {
      step: 1,
      agent: opts.from,
      ts: createdAt,
      ...(opts.note !== undefined ? { note: opts.note } : {}),
    },
  ]
  const body: Omit<LatentEnvelope, 'contentHash'> = {
    version: 1,
    from: opts.from,
    to: opts.to,
    kind,
    ...(opts.text !== undefined ? { text: opts.text } : {}),
    ...(opts.structured !== undefined ? { structured: opts.structured } : {}),
    provenance,
    createdAt,
  }
  return { ...body, contentHash: computeHash(body) }
}

/** JSON-serialize an envelope with stable key order. */
export function serialize(env: LatentEnvelope): string {
  return stableStringify(env)
}

/** Parse, validate shape, recompute hash, throw if mismatch. */
export function deserialize(s: string): LatentEnvelope {
  let raw: unknown
  try { raw = JSON.parse(s) } catch (err) {
    throw new Error(`latent-state: invalid JSON: ${(err as Error).message}`)
  }
  const env = assertShape(raw)
  if (!verifyHash(env)) {
    throw new Error('latent-state: contentHash mismatch — envelope tampered')
  }
  return env
}

function assertShape(raw: unknown): LatentEnvelope {
  if (!raw || typeof raw !== 'object') throw new Error('latent-state: envelope must be an object')
  const o = raw as Record<string, unknown>
  if (o.version !== 1) throw new Error(`latent-state: unsupported version ${String(o.version)}`)
  if (typeof o.from !== 'string' || typeof o.to !== 'string') throw new Error('latent-state: from/to must be strings')
  if (o.kind !== 'text' && o.kind !== 'structured' && o.kind !== 'mixed') throw new Error(`latent-state: invalid kind ${String(o.kind)}`)
  if (typeof o.createdAt !== 'string' || typeof o.contentHash !== 'string') throw new Error('latent-state: createdAt/contentHash must be strings')
  if (!Array.isArray(o.provenance) || o.provenance.length === 0) throw new Error('latent-state: provenance must be a non-empty array')
  return o as unknown as LatentEnvelope
}

/** True iff stored `contentHash` matches a fresh hash of the body. */
export function verifyHash(env: LatentEnvelope): boolean {
  const { contentHash, ...body } = env
  return computeHash(body) === contentHash
}

/** Append a provenance step and rehash. Returns a new envelope. */
export function withProvenance(
  env: LatentEnvelope,
  entry: Omit<ProvenanceEntry, 'step'> & { step?: number },
): LatentEnvelope {
  const nextStep =
    entry.step ?? Math.max(0, ...env.provenance.map((p) => p.step)) + 1
  const provenance: ProvenanceEntry[] = [
    ...env.provenance,
    {
      step: nextStep,
      agent: entry.agent,
      ts: entry.ts,
      ...(entry.note !== undefined ? { note: entry.note } : {}),
    },
  ]
  const { contentHash: _drop, ...rest } = { ...env, provenance }
  void _drop
  return { ...rest, contentHash: computeHash(rest) }
}

/**
 * Combine two envelopes from the same from/to pair.
 * - text: a + '\n' + b
 * - structured: shallow merge with one-level deep-merge for plain objects
 * - provenance: a then b, renumbered sequentially
 * - createdAt: fresh ISO timestamp; contentHash: recomputed
 */
export function merge(a: LatentEnvelope, b: LatentEnvelope): LatentEnvelope {
  if (a.from !== b.from || a.to !== b.to) {
    throw new Error('latent-state: cannot merge envelopes with different from/to')
  }
  const text = mergeText(a.text, b.text)
  const structured = mergeStructured(a.structured, b.structured)
  const kind = classify(text, structured)
  const provenance: ProvenanceEntry[] = [...a.provenance, ...b.provenance].map(
    (p, i) => ({ ...p, step: i + 1 }),
  )
  const body: Omit<LatentEnvelope, 'contentHash'> = {
    version: 1,
    from: a.from,
    to: a.to,
    kind,
    ...(text !== undefined ? { text } : {}),
    ...(structured !== undefined ? { structured } : {}),
    provenance,
    createdAt: new Date().toISOString(),
  }
  return { ...body, contentHash: computeHash(body) }
}

function mergeText(a?: string, b?: string): string | undefined {
  if (a === undefined && b === undefined) return undefined
  if (a === undefined) return b
  if (b === undefined) return a
  return `${a}\n${b}`
}

function mergeStructured(
  a?: Record<string, unknown>,
  b?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!a && !b) return undefined
  if (!a) return { ...b }
  if (!b) return { ...a }
  const out: Record<string, unknown> = { ...a }
  for (const k of Object.keys(b)) {
    const av = a[k], bv = b[k]
    if (
      av && bv &&
      typeof av === 'object' && typeof bv === 'object' &&
      !Array.isArray(av) && !Array.isArray(bv)
    ) {
      out[k] = { ...(av as Record<string, unknown>), ...(bv as Record<string, unknown>) }
    } else {
      out[k] = bv
    }
  }
  return out
}
