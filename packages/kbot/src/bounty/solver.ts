// kbot Bounty Solver — issue-TARGETED solving.
//
// The radar (hunter.ts) finds a fresh, winnable bounty. This module actually
// solves it: it reads the specific GitHub issue (title, body, maintainer
// comments, labels), clones the repo, and drives kbot's own agent loop —
// constrained to THAT issue's acceptance criteria — to implement, verify, and
// stage a focused change. The PR push is gated (outward-facing).
//
// Why drive runAgent instead of a bespoke solver: kbot already IS a coding agent
// (file/bash/git tools, planner, verification). Rebuilding that inside the bounty
// module would be wasteful and worse. We give it a tight brief and a clean repo.

import { execFileSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { setPermissionMode, getPermissionMode } from '../permissions.js'
import type { Bounty } from './hunter.js'

export interface IssueBrief {
  repo: string
  number: number
  title: string
  body: string
  labels: string[]
  /** Maintainer/triage comments — often hold the real acceptance criteria. */
  comments: string[]
}

export interface SolveOptions {
  /** Actually fork, push, and open the PR. Default false = prepare only. */
  submit?: boolean
  /** Override the model kbot uses for the solve. Defaults to a strong local
   *  coder so solves run free + offline (kbot's BYOK Anthropic key may be dead). */
  model?: string
  /** Directory to clone into (default: a temp dir). */
  workDir?: string
}

/** Strong local coding model for unattended solves — no API key, no cost. */
export const DEFAULT_SOLVE_MODEL = 'qwen2.5-coder:32b'

export interface SolveResult {
  bounty: Bounty
  repoDir: string
  branch: string
  changedFiles: string[]
  diffStat: string
  agentSummary: string
  prBody: string
  prUrl?: string
  submitted: boolean
  /** Set when the agent produced no changes — an honest no-op, not a success. */
  noChanges: boolean
}

// ── Pure helpers (unit-tested) ──

/** Parse `git status --porcelain` into a list of changed paths. */
export function parseChangedFiles(porcelain: string): string[] {
  return porcelain
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^\S+\s+/, '').replace(/^.*\s->\s/, '')) // handle renames
}

/** Branch name for an attempt — deterministic per issue. */
export function branchName(issueNumber: number): string {
  return `kbot/bounty-${issueNumber}`
}

/**
 * Build the agent brief. This is the whole game: a tight, issue-scoped
 * instruction that keeps the change minimal and verified, with the Algora
 * `/attempt` + `Closes #N` conventions baked into the PR body the agent writes.
 */
export function buildSolvePrompt(brief: IssueBrief): string {
  const comments = brief.comments.length
    ? brief.comments.map((c, i) => `--- comment ${i + 1} ---\n${c}`).join('\n')
    : '(no comments)'
  return [
    `You are solving a single GitHub issue to claim an open-source bounty.`,
    `Repository: ${brief.repo}`,
    `Issue #${brief.number}: ${brief.title}`,
    brief.labels.length ? `Labels: ${brief.labels.join(', ')}` : '',
    ``,
    `ISSUE BODY:`,
    brief.body || '(empty)',
    ``,
    `DISCUSSION (acceptance criteria often live here):`,
    comments,
    ``,
    `YOUR TASK:`,
    `1. Explore the repo to locate the code this issue concerns. Read before editing.`,
    `2. Implement the smallest change that satisfies the issue. Match the codebase's`,
    `   existing style. Do NOT touch unrelated files or reformat the repo.`,
    `3. If the repo has tests, add/adjust a test for your change and run the test/build`,
    `   command (check package.json / README) to verify it passes.`,
    `4. When done, output a concise summary of WHAT you changed and WHY, suitable as a`,
    `   pull-request description. End that summary with the line: Closes #${brief.number}`,
    ``,
    `Constraints: stay strictly within this issue's scope. A minimal, correct,`,
    `verified change wins the bounty; a sprawling one gets rejected.`,
  ]
    .filter((l) => l !== '')
    .join('\n')
}

/** Assemble the PR body from the agent's summary, with Algora conventions. */
export function buildPrBody(brief: IssueBrief, agentSummary: string): string {
  const summary = agentSummary.trim() || `Implements the change requested in #${brief.number}.`
  const hasCloses = /closes\s+#\d+/i.test(summary)
  return [
    summary,
    hasCloses ? '' : `\nCloses #${brief.number}`,
    `\n/attempt #${brief.number}`,
    `\n---`,
    `Submitted by kbot (https://kernel.chat) — autonomous bounty solver.`,
  ]
    .filter(Boolean)
    .join('\n')
}

// ── Git / GitHub IO ──

function git(args: string[], cwd: string): string {
  return execFileSync('git', args, { cwd, encoding: 'utf-8', timeout: 60_000, stdio: ['pipe', 'pipe', 'pipe'] }).trim()
}

function gh<T = unknown>(args: string[], json = true): T {
  const out = execFileSync('gh', args, { encoding: 'utf-8', timeout: 60_000, stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 16 * 1024 * 1024 })
  return (json ? JSON.parse(out) : out.trim()) as T
}

export function fetchIssueBrief(repo: string, issueNumber: number): IssueBrief {
  const data = gh<{ title: string; body: string; labels: Array<{ name: string }>; comments: Array<{ body: string }> }>([
    'issue', 'view', String(issueNumber),
    '--repo', repo,
    '--json', 'title,body,labels,comments',
  ])
  return {
    repo,
    number: issueNumber,
    title: data.title,
    body: data.body || '',
    labels: (data.labels || []).map((l) => l.name),
    comments: (data.comments || []).map((c) => c.body || '').filter(Boolean),
  }
}

function cloneRepo(repo: string, dest: string): void {
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true })
  execFileSync('git', ['clone', '--depth', '1', `https://github.com/${repo}.git`, dest], {
    encoding: 'utf-8', timeout: 180_000, stdio: ['pipe', 'pipe', 'pipe'],
  })
}

// ── Orchestration ──

/**
 * Solve a bounty end-to-end. Clones the repo, drives kbot's agent against the
 * issue brief, stages a branch, and (only with submit) forks + pushes + opens
 * the PR. Returns a structured result; never throws on "agent made no change" —
 * that's reported honestly via `noChanges`.
 */
export async function solveBounty(bounty: Bounty, options: SolveOptions = {}): Promise<SolveResult> {
  const { submit = false, model, workDir } = options
  const brief = fetchIssueBrief(bounty.repo, bounty.issueNumber)
  const repoDir = workDir || join(tmpdir(), `kbot-bounty-${bounty.issueNumber}-${process.pid}`)
  const branch = branchName(bounty.issueNumber)

  cloneRepo(bounty.repo, repoDir)

  // Drive the agent inside the clone. runAgent resolves file tools against
  // process.cwd(), so we chdir in and always restore — and flip to permissive
  // so the unattended solve doesn't block on per-write confirmations.
  const prevCwd = process.cwd()
  const prevMode = getPermissionMode()
  let agentSummary = ''
  try {
    process.chdir(repoDir)
    setPermissionMode('permissive')
    const { runAgent } = await import('../agent.js')
    const response = await runAgent(buildSolvePrompt(brief), {
      agent: 'coder',
      model: model || DEFAULT_SOLVE_MODEL,
      skipPlanner: false,
    })
    agentSummary = response.content
  } finally {
    setPermissionMode(prevMode)
    process.chdir(prevCwd)
  }

  const porcelain = git(['status', '--porcelain'], repoDir)
  const changedFiles = parseChangedFiles(porcelain)
  const noChanges = changedFiles.length === 0
  const diffStat = noChanges ? '' : git(['diff', '--stat'], repoDir)
  const prBody = buildPrBody(brief, agentSummary)

  const result: SolveResult = {
    bounty, repoDir, branch, changedFiles, diffStat, agentSummary, prBody, submitted: false, noChanges,
  }
  if (noChanges) return result

  // Stage the change on a branch regardless of submit, so it's inspectable.
  git(['checkout', '-b', branch], repoDir)
  git(['add', '-A'], repoDir)
  git(['commit', '-m', `fix: ${brief.title}\n\nCloses #${brief.number}`], repoDir)

  if (submit) {
    // Fork (no-op if it exists), push the branch to the fork, open the PR upstream.
    try {
      gh(['repo', 'fork', bounty.repo, '--remote=false', '--clone=false'], false)
    } catch { /* fork may already exist */ }
    const me = gh<{ login: string }>(['api', 'user']).login
    const forkUrl = `https://github.com/${me}/${bounty.repo.split('/')[1]}.git`
    git(['remote', 'add', 'fork', forkUrl], repoDir)
    git(['push', 'fork', branch, '--force'], repoDir)
    const prUrl = gh<string>([
      'pr', 'create',
      '--repo', bounty.repo,
      '--head', `${me}:${branch}`,
      '--title', `fix: ${brief.title}`,
      '--body', prBody,
    ], false)
    result.prUrl = prUrl
    result.submitted = true
  }
  return result
}
