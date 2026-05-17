// kbot Git Tools — Git operations executed locally
// Zero API calls. All operations happen on the local repo.
//
// Uses spawnSync with an args array (no shell) so the same code works
// identically on POSIX and Windows. The previous string-based execSync
// path required Unix-style single-quote escaping which broke under
// cmd.exe (treats single quotes as literal characters).

import { spawnSync } from 'node:child_process'
import { registerTool } from './index.js'

/** Get the git repo root directory (cached per working directory) */
const _repoRootCache = new Map<string, string>()
function getRepoRoot(): string {
  const cwd = process.cwd()
  const cached = _repoRootCache.get(cwd)
  if (cached) return cached
  try {
    const res = spawnSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf-8', timeout: 5_000, cwd })
    if (res.status !== 0) return cwd
    const root = (res.stdout ?? '').trim()
    _repoRootCache.set(cwd, root)
    return root
  } catch {
    return cwd
  }
}

/** Run git with an args array — no shell, no quoting concerns. */
function git(args: string[], timeout = 30_000): string {
  const res = spawnSync('git', args, {
    encoding: 'utf-8',
    timeout,
    maxBuffer: 5 * 1024 * 1024,
    cwd: getRepoRoot(),
  })
  if (res.error) throw new Error(res.error.message)
  if (res.status !== 0) {
    const stderr = (res.stderr ?? '').toString().trim()
    throw new Error(stderr || 'Git command failed')
  }
  return (res.stdout ?? '').toString().trim()
}

export function registerGitTools(): void {
  registerTool({
    name: 'git_status',
    description: 'Show the working tree status — modified, staged, and untracked files.',
    parameters: {},
    tier: 'free',
    async execute() {
      return git(['status', '--short'])
    },
  })

  registerTool({
    name: 'git_diff',
    description: 'Show changes in the working directory (unstaged and staged).',
    parameters: {
      staged: { type: 'boolean', description: 'Show only staged changes' },
      path: { type: 'string', description: 'Limit diff to a specific file path' },
    },
    tier: 'free',
    async execute(args) {
      const cmd: string[] = ['diff']
      if (args.staged) cmd.push('--cached')
      if (args.path) cmd.push('--', String(args.path))
      return git(cmd) || 'No changes'
    },
  })

  registerTool({
    name: 'git_log',
    description: 'Show recent commit history.',
    parameters: {
      count: { type: 'number', description: 'Number of commits to show (default: 10)' },
      oneline: { type: 'boolean', description: 'One-line format (default: true)' },
    },
    tier: 'free',
    async execute(args) {
      const count = typeof args.count === 'number' ? args.count : 10
      const cmd: string[] = ['log', `-${count}`]
      if (args.oneline !== false) cmd.push('--oneline')
      return git(cmd)
    },
  })

  registerTool({
    name: 'git_commit',
    description: 'Create a git commit with the specified message. Stages specified files first.',
    parameters: {
      message: { type: 'string', description: 'Commit message', required: true },
      files: { type: 'array', description: 'Files to stage before committing. If empty, commits already-staged files.', items: { type: 'string' } },
    },
    tier: 'free',
    async execute(args) {
      const message = String(args.message)
      const files = Array.isArray(args.files) ? args.files.map(String) : []

      if (files.length > 0) {
        git(['add', '--', ...files])
      }

      return git(['commit', '-m', message])
    },
  })

  registerTool({
    name: 'git_branch',
    description: 'Create or switch branches.',
    parameters: {
      name: { type: 'string', description: 'Branch name', required: true },
      create: { type: 'boolean', description: 'Create a new branch (default: false)' },
    },
    tier: 'free',
    async execute(args) {
      const name = String(args.name)
      const cmd: string[] = ['checkout']
      if (args.create) cmd.push('-b')
      cmd.push(name)
      return git(cmd)
    },
  })

  registerTool({
    name: 'git_push',
    description: 'Push commits to the remote repository. Use with caution.',
    parameters: {
      remote: { type: 'string', description: 'Remote name (default: origin)' },
      branch: { type: 'string', description: 'Branch name (default: current branch)' },
    },
    tier: 'free',
    async execute(args) {
      const remote = args.remote ? String(args.remote) : 'origin'
      const cmd: string[] = ['push', remote]
      if (args.branch) cmd.push(String(args.branch))
      return git(cmd, 60_000)
    },
  })
}
