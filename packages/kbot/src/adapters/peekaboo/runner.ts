// Peekaboo binary runner — thin child_process wrapper.
//
// All execution of the `peekaboo` CLI flows through `runPeekaboo`. The
// binary path is resolved from the PEEKABOO_BIN env var (default: 'peekaboo')
// so tests can stub it and hosts can pin a specific install. No shell is
// involved — args go through execFile to keep arg quoting predictable.

import { execFile } from 'node:child_process'

export interface RunOptions {
  /** Optional stdin payload. */
  input?: string
  /** Working directory for the child. */
  cwd?: string
  /** Hard timeout in milliseconds. */
  timeoutMs?: number
}

export interface RunResult {
  stdout: string
  stderr: string
  code: number
}

function resolveBinary(): string {
  return process.env.PEEKABOO_BIN && process.env.PEEKABOO_BIN.trim().length > 0
    ? process.env.PEEKABOO_BIN
    : 'peekaboo'
}

/**
 * Run the peekaboo CLI with the given args. Resolves with stdout/stderr/code
 * regardless of exit status; never rejects on non-zero exit. Rejects only
 * when the binary cannot be spawned at all (ENOENT, permissions, etc.).
 */
export function runPeekaboo(args: string[], opts: RunOptions = {}): Promise<RunResult> {
  const bin = resolveBinary()
  return new Promise((resolve, reject) => {
    const child = execFile(
      bin,
      args,
      {
        cwd: opts.cwd,
        timeout: opts.timeoutMs,
        maxBuffer: 64 * 1024 * 1024,
      },
      (err, stdout, stderr) => {
        // execFile populates err for non-zero exit too. We surface the result
        // either way and only reject when the spawn itself failed.
        const out: unknown = stdout
        const errOut: unknown = stderr
        const stdoutStr =
          typeof out === 'string'
            ? out
            : out instanceof Buffer
              ? out.toString('utf8')
              : ''
        const stderrStr =
          typeof errOut === 'string'
            ? errOut
            : errOut instanceof Buffer
              ? errOut.toString('utf8')
              : ''
        if (err) {
          const errno = (err as NodeJS.ErrnoException).code
          // Spawn-level failures (binary missing, EACCES, etc.) reject.
          if (errno === 'ENOENT' || errno === 'EACCES' || errno === 'EPERM') {
            reject(err)
            return
          }
          // Otherwise treat as "process ran, exited non-zero".
          const code = typeof (err as { code?: unknown }).code === 'number'
            ? ((err as { code: number }).code)
            : 1
          resolve({ stdout: stdoutStr, stderr: stderrStr, code })
          return
        }
        resolve({ stdout: stdoutStr, stderr: stderrStr, code: 0 })
      },
    )
    if (opts.input !== undefined && child.stdin) {
      child.stdin.write(opts.input)
      child.stdin.end()
    }
  })
}

/**
 * Returns true when the peekaboo binary responds to `--version`. Used by
 * higher-level tools to gate Peekaboo features without crashing the host.
 */
export async function peekabooAvailable(): Promise<boolean> {
  try {
    const r = await runPeekaboo(['--version'], { timeoutMs: 5000 })
    return r.code === 0
  } catch {
    return false
  }
}
