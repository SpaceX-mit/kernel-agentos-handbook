// Tests for the bounty-solver pure helpers. The agent loop + git/gh IO are not
// exercised here (they need a live repo + provider); these lock down the prompt
// construction, change detection, and PR-body conventions that decide whether a
// submitted PR is well-formed and Algora-claimable.

import { describe, it, expect } from 'vitest'
import { parseChangedFiles, branchName, buildSolvePrompt, buildPrBody, type IssueBrief } from './solver.js'

const brief: IssueBrief = {
  repo: 'tscircuit/tscircuit',
  number: 328,
  title: 'Build the Arduino Nano with tscircuit',
  body: 'Create a board definition for the Arduino Nano.',
  labels: ['💎 Bounty', 'good first issue'],
  comments: ['Acceptance: it must render in the schematic viewer.', 'Use the existing footprint helpers.'],
}

describe('parseChangedFiles', () => {
  it('parses porcelain status into paths', () => {
    const out = ' M src/a.ts\n?? src/b.ts\nA  src/c.ts'
    expect(parseChangedFiles(out)).toEqual(['src/a.ts', 'src/b.ts', 'src/c.ts'])
  })
  it('handles renames (keeps the destination path)', () => {
    expect(parseChangedFiles('R  old/x.ts -> new/x.ts')).toEqual(['new/x.ts'])
  })
  it('returns empty for a clean tree', () => {
    expect(parseChangedFiles('')).toEqual([])
    expect(parseChangedFiles('\n  \n')).toEqual([])
  })
})

describe('branchName', () => {
  it('is deterministic per issue', () => {
    expect(branchName(328)).toBe('kbot/bounty-328')
    expect(branchName(328)).toBe(branchName(328))
  })
})

describe('buildSolvePrompt', () => {
  const p = buildSolvePrompt(brief)
  it('includes repo, issue number, title, body, labels', () => {
    expect(p).toContain('tscircuit/tscircuit')
    expect(p).toContain('#328')
    expect(p).toContain('Build the Arduino Nano')
    expect(p).toContain('board definition')
    expect(p).toContain('💎 Bounty')
  })
  it('surfaces maintainer comments (where acceptance criteria hide)', () => {
    expect(p).toContain('render in the schematic viewer')
    expect(p).toContain('footprint helpers')
  })
  it('instructs minimal, verified, in-scope changes and a Closes line', () => {
    expect(p.toLowerCase()).toContain('smallest change')
    expect(p.toLowerCase()).toMatch(/test|build/)
    expect(p).toContain('Closes #328')
  })
  it('handles an issue with no comments gracefully', () => {
    const p2 = buildSolvePrompt({ ...brief, comments: [] })
    expect(p2).toContain('(no comments)')
  })
})

describe('buildPrBody', () => {
  it('appends Closes + /attempt when the summary lacks them', () => {
    const body = buildPrBody(brief, 'Added the Arduino Nano board definition.')
    expect(body).toContain('Added the Arduino Nano')
    expect(body).toContain('Closes #328')
    expect(body).toContain('/attempt #328')
    expect(body).toContain('kbot')
  })
  it('does not double the Closes line when the agent already wrote one', () => {
    const body = buildPrBody(brief, 'Did the thing.\nCloses #328')
    expect(body.match(/closes\s+#328/gi)?.length).toBe(1)
  })
  it('falls back to a default summary when the agent returned nothing', () => {
    const body = buildPrBody(brief, '')
    expect(body).toContain('#328')
    expect(body).toContain('/attempt #328')
  })
})
