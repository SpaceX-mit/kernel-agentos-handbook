/**
 * Harness Evolution Loop — JSONL trace persistence.
 *
 * Each task gets its own append-only JSONL file at
 * `~/.kbot/futures/harness/<task-id>.jsonl`. One line per `EvolutionRecord`
 * (or arbitrary JSON-serializable record). Append-only on the hot path so
 * concurrent loops don't trample each other; reads parse line-by-line and
 * skip malformed lines rather than throwing on a single bad row.
 *
 * Pattern mirrors `src/planner/hierarchical/persistence.ts`: state dir is
 * configurable (default `~/.kbot/futures/harness`), atomic writes where
 * possible, ENOENT swallowed on read paths.
 */

import { promises as fs } from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import type { EvolutionRecord } from './types.js'

/** Default on-disk root: `~/.kbot/futures/harness/`. */
export function defaultStateDir(): string {
  return path.join(os.homedir(), '.kbot', 'futures', 'harness')
}

function safeId(taskId: string): string {
  // Restrict to filesystem-safe chars; collapse anything else to '_'.
  return taskId.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function tracePath(stateDir: string, taskId: string): string {
  return path.join(stateDir, `${safeId(taskId)}.jsonl`)
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

/** Append a single record as one JSONL line. */
export async function appendTrace(
  taskId: string,
  record: EvolutionRecord,
  stateDir: string = defaultStateDir(),
): Promise<void> {
  await ensureDir(stateDir)
  const line = JSON.stringify(record) + '\n'
  await fs.appendFile(tracePath(stateDir, taskId), line, 'utf8')
}

/**
 * Read all records for a task in append order. Returns empty array if the
 * file doesn't exist. Malformed lines are skipped — one bad row never
 * invalidates the whole history.
 */
export async function readHistory(
  taskId: string,
  stateDir: string = defaultStateDir(),
): Promise<EvolutionRecord[]> {
  let raw: string
  try {
    raw = await fs.readFile(tracePath(stateDir, taskId), 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
  const out: EvolutionRecord[] = []
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    try {
      out.push(JSON.parse(trimmed) as EvolutionRecord)
    } catch {
      // skip malformed line
    }
  }
  return out
}

/**
 * Delete trace files older than `days` (by mtime). Returns the list of
 * removed task ids. Pure janitor — never throws on individual failures.
 */
export async function pruneOlderThan(
  days: number,
  stateDir: string = defaultStateDir(),
): Promise<string[]> {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  let entries: string[]
  try {
    entries = await fs.readdir(stateDir)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
  const removed: string[] = []
  for (const entry of entries) {
    if (!entry.endsWith('.jsonl')) continue
    const full = path.join(stateDir, entry)
    try {
      const stat = await fs.stat(full)
      if (stat.mtimeMs < cutoff) {
        await fs.unlink(full)
        removed.push(entry.replace(/\.jsonl$/, ''))
      }
    } catch {
      // skip — permission, race, etc.
    }
  }
  return removed
}
