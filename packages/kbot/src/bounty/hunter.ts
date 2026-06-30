// kbot Bounty Hunter — contention-aware Algora bounty radar.
//
// The bounty-hunting game on popular Algora repos is a red ocean: high-value
// issues attract 8-150 competing PRs within hours, but only ONE is merged and
// paid. Entering a bounty that already has 10 open PRs is negative expected
// value no matter how good the fix is.
//
// This module is the RADAR, not the gun. It discovers live bounties straight
// from GitHub (the `/bounty $N` marker that Algora keys off), measures how
// contested each one already is (open PRs referencing the issue), and ranks by
// expected value so kbot only spends compute where it can plausibly win:
// FRESH bounties, before the swarm arrives. Execution (clone -> fix -> PR) is
// delegated to the existing autonomous-contributor engine.
//
// Truth source is GitHub, not Algora's SPA: the `gh` CLI is stable, already
// authed, and lets us read the bounty marker AND the competing PRs in one pass.
// Algora's public tRPC (console.algora.io/api/trpc bounty.list) keys on an org
// UUID we can't resolve from the slug, so it returns empty — avoided here.

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { homedir } from 'node:os'

// ── Types ──

export interface Bounty {
  /** GitHub org / owner, e.g. "tscircuit" */
  org: string
  /** "owner/repo" */
  repo: string
  issueNumber: number
  title: string
  url: string
  /** USD amount parsed from the /bounty marker; null if unparseable */
  amountUsd: number | null
  /** Count of OPEN PRs that already reference this issue — the contention. */
  contention: number
  /** ISO timestamp the issue was opened (for freshness). */
  createdAt: string
}

export interface RankedBounty extends Bounty {
  /** Expected-value score: amount / (1 + contention). Higher = better. */
  score: number
  /** True when contention is at or below the attempt threshold. */
  worthAttempting: boolean
}

export interface BountyHunterConfig {
  /** GitHub orgs to scan (Algora-paying orgs with a payout history). */
  orgs: string[]
  /** Max competing PRs before a bounty is "too contested to attempt". */
  maxContention: number
  /** Ignore bounties below this USD amount. */
  minAmountUsd: number
  /** Path to the seen-state file. */
  statePath: string
}

export const DEFAULT_CONFIG: BountyHunterConfig = {
  // Algora-paying orgs with open /bounty issues (verified live 2026-06-06).
  // tscircuit (707 paid, all-TS) + cal (185) + Documenso (65) are the proven
  // anchors; the rest are active bounty posters confirmed to have open issues.
  orgs: [
    'tscircuit', 'calcom', 'documenso',
    'highlight', 'formbricks', 'zama-ai', 'twentyhq',
    'activepieces', 'triggerdotdev', 'remotion-dev',
  ],
  maxContention: 2,
  minAmountUsd: 25,
  statePath: join(homedir(), '.kbot', 'bounty-hunter', 'state.json'),
}

interface SeenState {
  /** Map of bounty key -> first-seen ISO timestamp. */
  seen: Record<string, string>
}

// ── Pure logic (unit-tested) ──

/**
 * Extract the USD bounty amount from issue text. Algora is triggered by a
 * `/bounty $N` comment; maintainers sometimes top up, so we take the MAX of
 * all markers. Handles `$1,000`, `$1.5k`, and the `💎 $N` bot rendering.
 * Returns null when no marker is present.
 */
export function parseBountyAmount(text: string): number | null {
  if (!text) return null
  const amounts: number[] = []
  // /bounty $75 | /bounty $1,000 | /bounty $1.5k | 💎 $75 | 💎 $1k
  const re = /(?:\/bounty|💎)\s*\$?\s*([\d,]+(?:\.\d+)?)\s*(k)?/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const n = parseFloat(m[1].replace(/,/g, ''))
    if (Number.isFinite(n)) amounts.push(m[2] ? n * 1000 : n)
  }
  return amounts.length ? Math.max(...amounts) : null
}

/**
 * Count how many of the given open PRs reference an issue number. An attempt
 * shows up as "#34", "(#34)", "Fixes #34", or ".../issues/34" in the PR title
 * or body. This is the contention signal — the number of competitors.
 */
export function countReferencingPRs(
  prs: Array<{ title?: string; body?: string }>,
  issueNumber: number,
): number {
  // Match "#34", "(#34)", "Closes #34", or ".../issues/34", but a trailing
  // digit guard (?!\d) stops #34 from matching #345 / issues/345.
  const refRe = new RegExp(`(?:#|issues/)${issueNumber}(?!\\d)`)
  let count = 0
  for (const pr of prs) {
    const hay = `${pr.title || ''}\n${pr.body || ''}`
    if (refRe.test(hay)) count++
  }
  return count
}

/** Expected-value score: reward weighted down by how crowded the race is. */
export function expectedValueScore(amountUsd: number | null, contention: number): number {
  const amount = amountUsd ?? 0
  return amount / (1 + contention)
}

/** Stable key for dedupe / seen-tracking. */
export function bountyKey(b: Pick<Bounty, 'repo' | 'issueNumber'>): string {
  return `${b.repo}#${b.issueNumber}`
}

/**
 * Rank bounties by expected value and flag which are worth attempting given the
 * contention ceiling and minimum amount. Pure — takes already-fetched bounties.
 */
export function rankBounties(bounties: Bounty[], config: BountyHunterConfig): RankedBounty[] {
  return bounties
    .map((b) => ({
      ...b,
      score: expectedValueScore(b.amountUsd, b.contention),
      worthAttempting:
        b.contention <= config.maxContention && (b.amountUsd ?? 0) >= config.minAmountUsd,
    }))
    .sort((a, b) => b.score - a.score)
}

/** Given current bounties and the seen-set, return the ones not seen before. */
export function diffNewBounties(current: Bounty[], seen: Record<string, string>): Bounty[] {
  return current.filter((b) => !(bountyKey(b) in seen))
}

// ── State persistence ──

export function loadState(statePath: string): SeenState {
  try {
    if (existsSync(statePath)) return JSON.parse(readFileSync(statePath, 'utf-8')) as SeenState
  } catch {
    /* corrupt state -> start fresh */
  }
  return { seen: {} }
}

export function saveState(statePath: string, state: SeenState): void {
  mkdirSync(dirname(statePath), { recursive: true })
  writeFileSync(statePath, JSON.stringify(state, null, 2))
}

// ── GitHub IO (via the gh CLI — stable + already authed) ──

function ghJson<T>(args: string[]): T {
  const out = execFileSync('gh', args, {
    encoding: 'utf-8',
    timeout: 30_000,
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 16 * 1024 * 1024,
  })
  return JSON.parse(out) as T
}

/** Find open issues in an org that carry a /bounty marker. */
export function searchBountyIssues(
  org: string,
): Array<{ number: number; title: string; url: string; repository: { nameWithOwner: string }; createdAt: string }> {
  try {
    return ghJson([
      'search', 'issues',
      '--owner', org,
      '--state', 'open',
      '/bounty',
      '--json', 'number,title,url,repository,createdAt',
      '--limit', '100',
    ])
  } catch {
    return []
  }
}

/** Fetch issue body + comment bodies so we can parse the bounty amount. */
function fetchIssueText(repo: string, issueNumber: number): string {
  try {
    const data = ghJson<{ body: string; comments: Array<{ body: string }> }>([
      'issue', 'view', String(issueNumber),
      '--repo', repo,
      '--json', 'body,comments',
    ])
    return [data.body || '', ...(data.comments || []).map((c) => c.body || '')].join('\n')
  } catch {
    return ''
  }
}

/** Open PRs for a repo (title + body) — used to measure contention. */
function fetchOpenPRs(repo: string): Array<{ title: string; body: string }> {
  try {
    return ghJson<Array<{ title: string; body: string }>>([
      'pr', 'list',
      '--repo', repo,
      '--state', 'open',
      '--json', 'title,body',
      '--limit', '200',
    ])
  } catch {
    return []
  }
}

/** Discover and score every live bounty across the configured orgs. */
export function discoverBounties(config: BountyHunterConfig): Bounty[] {
  const bounties: Bounty[] = []
  // Cache open-PR lists per repo so we fetch each repo at most once.
  const prCache = new Map<string, Array<{ title: string; body: string }>>()

  for (const org of config.orgs) {
    const issues = searchBountyIssues(org)
    for (const issue of issues) {
      const repo = issue.repository.nameWithOwner
      const text = fetchIssueText(repo, issue.number)
      const amountUsd = parseBountyAmount(text)
      if (!prCache.has(repo)) prCache.set(repo, fetchOpenPRs(repo))
      const contention = countReferencingPRs(prCache.get(repo)!, issue.number)
      bounties.push({
        org,
        repo,
        issueNumber: issue.number,
        title: issue.title,
        url: issue.url,
        amountUsd,
        contention,
        createdAt: issue.createdAt,
      })
    }
  }
  return bounties
}

export interface PollResult {
  all: RankedBounty[]
  fresh: RankedBounty[]
  attemptable: RankedBounty[]
}

/**
 * One polling cycle: discover -> rank -> diff against seen -> persist.
 * `fresh` = bounties never seen before this run. `attemptable` = fresh bounties
 * under the contention ceiling — the only ones kbot should spend compute on.
 */
export function pollOnce(config: BountyHunterConfig = DEFAULT_CONFIG): PollResult {
  const state = loadState(config.statePath)
  const discovered = discoverBounties(config)
  const fresh = diffNewBounties(discovered, state.seen)

  const now = new Date().toISOString()
  for (const b of discovered) {
    const k = bountyKey(b)
    if (!(k in state.seen)) state.seen[k] = now
  }
  saveState(config.statePath, state)

  const all = rankBounties(discovered, config)
  const freshKeys = new Set(fresh.map(bountyKey))
  const freshRanked = all.filter((b) => freshKeys.has(bountyKey(b)))
  return {
    all,
    fresh: freshRanked,
    attemptable: freshRanked.filter((b) => b.worthAttempting),
  }
}
