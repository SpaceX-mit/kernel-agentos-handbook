export interface RunOptions {
    /** Optional stdin payload. */
    input?: string;
    /** Working directory for the child. */
    cwd?: string;
    /** Hard timeout in milliseconds. */
    timeoutMs?: number;
}
export interface RunResult {
    stdout: string;
    stderr: string;
    code: number;
}
/**
 * Run the peekaboo CLI with the given args. Resolves with stdout/stderr/code
 * regardless of exit status; never rejects on non-zero exit. Rejects only
 * when the binary cannot be spawned at all (ENOENT, permissions, etc.).
 */
export declare function runPeekaboo(args: string[], opts?: RunOptions): Promise<RunResult>;
/**
 * Returns true when the peekaboo binary responds to `--version`. Used by
 * higher-level tools to gate Peekaboo features without crashing the host.
 */
export declare function peekabooAvailable(): Promise<boolean>;
//# sourceMappingURL=runner.d.ts.map