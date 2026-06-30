// Tests for the bounty-hunter pure logic. IO (gh calls) is not exercised here —
// these cover the parsing, contention scoring, ranking, and state diff that
// decide whether kbot wastes compute on a contested bounty.

import { describe, it, expect, afterEach } from 'vitest'
import { rmSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import {
  parseBountyAmount,
  countReferencingPRs,
  expectedValueScore,
  bountyKey,
  rankBounties,
  diffNewBounties,
  loadState,
  saveState,
  DEFAULT_CONFIG,
  type Bounty,
  type BountyHunterConfig,
} from './hunter.js'

describe('parseBountyAmount', () => {
  it('parses a simple /bounty marker', () => {
    expect(parseBountyAmount('/bounty $75')).toBe(75)
  })
  it('parses thousands separators', () => {
    expect(parseBountyAmount('reward: /bounty $1,000 here')).toBe(1000)
  })
  it('parses the k suffix', () => {
    expect(parseBountyAmount('/bounty $1.5k')).toBe(1500)
  })
  it('parses the 💎 bot rendering', () => {
    expect(parseBountyAmount('💎 $200 bounty • tscircuit')).toBe(200)
  })
  it('takes the MAX when a maintainer tops up', () => {
    expect(parseBountyAmount('/bounty $50\n... later ...\n/bounty $150')).toBe(150)
  })
  it('returns null when there is no marker', () => {
    expect(parseBountyAmount('just a normal issue about a bug')).toBeNull()
    expect(parseBountyAmount('')).toBeNull()
  })
  it('does not treat a bare price as a bounty', () => {
    expect(parseBountyAmount('the part costs $9.99 at the store')).toBeNull()
  })
})

describe('countReferencingPRs', () => {
  const prs = [
    { title: 'Fix same-net merge (#34)', body: '' },
    { title: 'feat: merge segments', body: 'Closes #34' },
    { title: 'unrelated', body: 'fixes https://github.com/o/r/issues/34 yep' },
    { title: 'other work', body: 'addresses #345' }, // must NOT match #34
    { title: 'no ref', body: 'random' },
  ]
  it('counts PRs referencing the issue by #N, "Closes #N", and issues/N', () => {
    expect(countReferencingPRs(prs, 34)).toBe(3)
  })
  it('does not let #34 match #345 (boundary)', () => {
    expect(countReferencingPRs([{ title: 'x', body: 'see #345' }], 34)).toBe(0)
  })
  it('returns 0 for an uncontested issue', () => {
    expect(countReferencingPRs(prs, 99)).toBe(0)
  })
})

describe('expectedValueScore', () => {
  it('is the full amount when uncontested', () => {
    expect(expectedValueScore(200, 0)).toBe(200)
  })
  it('shrinks as contention rises', () => {
    expect(expectedValueScore(200, 1)).toBe(100)
    expect(expectedValueScore(200, 9)).toBe(20)
  })
  it('treats a $170 uncontested bounty as better than a $200 ten-way race', () => {
    expect(expectedValueScore(170, 0)).toBeGreaterThan(expectedValueScore(200, 9))
  })
  it('handles a null amount as zero', () => {
    expect(expectedValueScore(null, 3)).toBe(0)
  })
})

describe('rankBounties', () => {
  const mk = (n: number, amt: number | null, contention: number): Bounty => ({
    org: 'tscircuit',
    repo: 'tscircuit/x',
    issueNumber: n,
    title: `issue ${n}`,
    url: `https://github.com/tscircuit/x/issues/${n}`,
    amountUsd: amt,
    contention,
    createdAt: '2026-06-06T00:00:00Z',
  })

  it('orders by expected value, not raw amount', () => {
    const ranked = rankBounties([mk(1, 200, 9), mk(2, 170, 0), mk(3, 100, 1)], DEFAULT_CONFIG)
    expect(ranked.map((b) => b.issueNumber)).toEqual([2, 3, 1])
  })

  it('flags contested or sub-minimum bounties as not worth attempting', () => {
    const ranked = rankBounties(
      [mk(1, 170, 0), mk(2, 100, 10), mk(3, 5, 0)],
      DEFAULT_CONFIG, // maxContention 2, minAmount 25
    )
    const byNum = Object.fromEntries(ranked.map((b) => [b.issueNumber, b.worthAttempting]))
    expect(byNum[1]).toBe(true) // fresh + above min
    expect(byNum[2]).toBe(false) // too contested
    expect(byNum[3]).toBe(false) // below min amount
  })
})

describe('diffNewBounties', () => {
  const a: Bounty = {
    org: 'tscircuit', repo: 'tscircuit/x', issueNumber: 1, title: 't', url: 'u',
    amountUsd: 100, contention: 0, createdAt: '2026-06-06T00:00:00Z',
  }
  const b: Bounty = { ...a, issueNumber: 2 }
  it('returns only bounties not in the seen set', () => {
    const seen = { [bountyKey(a)]: '2026-06-05T00:00:00Z' }
    expect(diffNewBounties([a, b], seen).map(bountyKey)).toEqual([bountyKey(b)])
  })
  it('returns all when nothing seen', () => {
    expect(diffNewBounties([a, b], {})).toHaveLength(2)
  })
})

describe('state round-trip', () => {
  const statePath = join(tmpdir(), `kbot-bounty-state-${Date.now()}.json`)
  afterEach(() => {
    try { rmSync(statePath, { force: true }) } catch { /* noop */ }
  })
  it('returns empty state when file is absent', () => {
    expect(loadState(join(tmpdir(), 'definitely-missing-bounty.json'))).toEqual({ seen: {} })
  })
  it('persists and reloads the seen set', () => {
    saveState(statePath, { seen: { 'tscircuit/x#1': '2026-06-06T00:00:00Z' } })
    expect(existsSync(statePath)).toBe(true)
    expect(loadState(statePath).seen['tscircuit/x#1']).toBe('2026-06-06T00:00:00Z')
  })
  it('recovers from a corrupt state file', () => {
    saveState(statePath, { seen: {} })
    writeFileSync(statePath, '{ not json')
    expect(loadState(statePath)).toEqual({ seen: {} })
  })
})

describe('DEFAULT_CONFIG', () => {
  it('targets verified-paying orgs and a tight contention ceiling', () => {
    const c: BountyHunterConfig = DEFAULT_CONFIG
    expect(c.orgs).toContain('tscircuit')
    expect(c.maxContention).toBeLessThanOrEqual(3)
    expect(c.minAmountUsd).toBeGreaterThan(0)
  })
})
