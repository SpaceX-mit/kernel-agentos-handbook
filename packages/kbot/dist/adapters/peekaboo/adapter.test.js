// Peekaboo adapter — deterministic stub-driven tests.
//
// Mocks node:child_process so the suite never spawns the real binary. Each
// test installs an execFile stub that asserts argv and returns canned
// stdout/stderr/exit-code, mirroring the contract of the real CLI.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
const calls = [];
let nextResponse = {
    stdout: '',
    stderr: '',
    code: 0,
};
vi.mock('node:child_process', () => {
    return {
        execFile: (file, args, _opts, cb) => {
            calls.push({ file, args });
            // Defer to next tick to mirror real async behaviour.
            queueMicrotask(() => {
                if ('throw' in nextResponse) {
                    cb(nextResponse.throw, '', '');
                    return;
                }
                const { stdout, stderr, code } = nextResponse;
                if (code !== 0) {
                    const err = Object.assign(new Error(`exit ${code}`), { code });
                    cb(err, stdout, stderr);
                }
                else {
                    cb(null, stdout, stderr);
                }
            });
            return { stdin: null };
        },
    };
});
// Imported after the mock so the runner picks up the stub.
import { see, click, type_, setValue, performAction, agent, peekabooAvailable, } from './index.js';
beforeEach(() => {
    calls.length = 0;
    nextResponse = { stdout: '', stderr: '', code: 0 };
    delete process.env.PEEKABOO_BIN;
});
afterEach(() => {
    vi.clearAllMocks();
});
function setStdout(stdout, code = 0, stderr = '') {
    nextResponse = { stdout, stderr, code };
}
describe('see', () => {
    it('parses a successful see snapshot', async () => {
        setStdout(JSON.stringify({
            snapshot: 'snap-123',
            app: 'Safari',
            window: 'Apple',
            elements: [
                {
                    id: 'B1',
                    role: 'AXButton',
                    label: 'Reload',
                    frame: { x: 10, y: 20, width: 100, height: 40 },
                    settable: false,
                    named_actions: ['AXPress'],
                },
                {
                    id: 'T1',
                    role: 'AXTextField',
                    frame: { x: 50, y: 60, width: 200, height: 30 },
                    settable: true,
                },
            ],
            screenshot_path: '/tmp/snap.png',
        }));
        const r = await see();
        expect(r.ok).toBe(true);
        if (!r.ok)
            return;
        expect(r.snapshot).toBe('snap-123');
        expect(r.app).toBe('Safari');
        expect(r.elements).toHaveLength(2);
        expect(r.elements[0].id).toBe('B1');
        expect(r.elements[0].frame.width).toBe(100);
        expect(r.elements[0].named_actions).toEqual(['AXPress']);
        expect(r.elements[1].settable).toBe(true);
        expect(r.screenshot_path).toBe('/tmp/snap.png');
    });
    it('passes --app argument when supplied', async () => {
        setStdout(JSON.stringify({ snapshot: 's', elements: [] }));
        await see({ app: 'Finder', mode: 'window', retina: true });
        expect(calls).toHaveLength(1);
        expect(calls[0].args).toEqual([
            'see',
            '--json',
            '--app',
            'Finder',
            '--mode',
            'window',
            '--retina',
        ]);
    });
});
describe('click', () => {
    it('clicks by element id with --on', async () => {
        setStdout(JSON.stringify({ ok: true, target: 'B1' }));
        const r = await click({ snapshot: 'snap-123', on: 'B1' });
        expect(r.ok).toBe(true);
        if (!r.ok)
            return;
        expect(r.target).toBe('B1');
        expect(calls[0].args).toEqual([
            'click',
            '--json',
            '--snapshot',
            'snap-123',
            '--on',
            'B1',
        ]);
    });
    it('clicks by coordinates with --coords', async () => {
        setStdout(JSON.stringify({ ok: true, coords: [120, 240] }));
        const r = await click({ snapshot: 'snap', coords: [120, 240], wait: 500 });
        expect(r.ok).toBe(true);
        if (!r.ok)
            return;
        expect(r.coords).toEqual([120, 240]);
        expect(calls[0].args).toEqual([
            'click',
            '--json',
            '--snapshot',
            'snap',
            '--coords',
            '120,240',
            '--wait',
            '500',
        ]);
    });
});
describe('type_', () => {
    it('types with --clear', async () => {
        setStdout(JSON.stringify({ ok: true, typed: 'hello world', cleared: true }));
        const r = await type_({ text: 'hello world', clear: true, delayMs: 25 });
        expect(r.ok).toBe(true);
        if (!r.ok)
            return;
        expect(r.typed).toBe('hello world');
        expect(r.cleared).toBe(true);
        expect(calls[0].args).toEqual([
            'type',
            '--json',
            '--text',
            'hello world',
            '--clear',
            '--delay',
            '25',
        ]);
    });
});
describe('setValue', () => {
    it('sets a value on an element', async () => {
        setStdout(JSON.stringify({ ok: true, target: 'T1', value: 'isaac' }));
        const r = await setValue({ snapshot: 'snap', on: 'T1', value: 'isaac' });
        expect(r.ok).toBe(true);
        if (!r.ok)
            return;
        expect(r.target).toBe('T1');
        expect(r.value).toBe('isaac');
        expect(calls[0].args).toEqual([
            'set-value',
            '--json',
            '--snapshot',
            'snap',
            '--on',
            'T1',
            '--value',
            'isaac',
        ]);
    });
});
describe('performAction', () => {
    it('invokes a named action', async () => {
        setStdout(JSON.stringify({ ok: true, target: 'B1', action: 'AXPress' }));
        const r = await performAction({ snapshot: 'snap', on: 'B1', action: 'AXPress' });
        expect(r.ok).toBe(true);
        if (!r.ok)
            return;
        expect(r.action).toBe('AXPress');
        expect(calls[0].args).toEqual([
            'perform-action',
            '--json',
            '--snapshot',
            'snap',
            '--on',
            'B1',
            '--action',
            'AXPress',
        ]);
    });
});
describe('agent', () => {
    it('passes the prompt verbatim and returns stdout', async () => {
        setStdout('Done. Reloaded the window.\n');
        const r = await agent({ prompt: 'Reload Safari' });
        expect(r.ok).toBe(true);
        if (!r.ok)
            return;
        expect(r.output).toBe('Done. Reloaded the window.\n');
        expect(calls[0].args).toEqual(['agent', 'Reload Safari']);
    });
});
describe('errors', () => {
    it('returns a non-zero-exit error when the binary fails', async () => {
        setStdout('', 2, 'permission denied');
        const r = await see();
        expect(r.ok).toBe(false);
        if (r.ok)
            return;
        expect(r.error.code).toBe('non-zero-exit');
        expect(r.error.exitCode).toBe(2);
        expect(r.error.stderr).toBe('permission denied');
    });
    it('returns a malformed-json error when stdout is not JSON', async () => {
        setStdout('this is not json');
        const r = await see();
        expect(r.ok).toBe(false);
        if (r.ok)
            return;
        expect(r.error.code).toBe('malformed-json');
        expect(r.error.stdout).toBe('this is not json');
    });
});
describe('peekabooAvailable', () => {
    it('returns true when the binary responds to --version', async () => {
        setStdout('peekaboo 1.2.3\n', 0);
        expect(await peekabooAvailable()).toBe(true);
        expect(calls[0].args).toEqual(['--version']);
    });
    it('returns false when the binary cannot be spawned', async () => {
        nextResponse = {
            throw: Object.assign(new Error('not found'), { code: 'ENOENT' }),
        };
        expect(await peekabooAvailable()).toBe(false);
    });
});
describe('binary resolution', () => {
    it('honors PEEKABOO_BIN when set', async () => {
        process.env.PEEKABOO_BIN = '/custom/path/peekaboo';
        setStdout(JSON.stringify({ snapshot: 's', elements: [] }));
        await see();
        expect(calls[0].file).toBe('/custom/path/peekaboo');
    });
});
//# sourceMappingURL=adapter.test.js.map