// kbot Secure Browser — kbot's own browser, with kbot's own security.
//
// Not a throwaway Chromium wrapper. A persistent, kbot-owned Chrome where every
// action is (1) checked against a capability policy BEFORE it runs, (2) recorded
// to a hash-chained audit log (provenance), and (3) refusable — irreversible
// outward actions (submit/pay/delete/send) are routed back to the human authority.
//
// This is the browser embodiment of the kbot-finance principle: the agent acts,
// but the human stays the authority and every action is provable after the fact.
//
// Requires: npx playwright install chromium  (uses installed Chrome via channel)

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, appendFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { registerTool } from './index.js'

// ---------------------------------------------------------------------------
// Paths — kbot's own browser lives in its own home, never touches the user's Chrome.
// ---------------------------------------------------------------------------
const ROOT = join(homedir(), '.kbot', 'secure-browser')
const PROFILE_DIR = join(ROOT, 'profile')
const POLICY_PATH = join(ROOT, 'policy.json')
const AUDIT_PATH = join(ROOT, 'audit.jsonl')
const ZERO_HASH = '0'.repeat(64)

function ensureRoot(): void {
  if (!existsSync(ROOT)) mkdirSync(ROOT, { recursive: true })
}

// ---------------------------------------------------------------------------
// Policy — the capability layer. Default-deny on irreversible actions.
// ---------------------------------------------------------------------------
interface Policy {
  /** If non-empty, ONLY these host suffixes may be visited. Empty = allow all but denyDomains. */
  allowDomains: string[]
  /** Host suffixes that are always blocked. */
  denyDomains: string[]
  /** Click target text/selectors matching these (case-insensitive) are REFUSED and routed to the human. */
  refusePatterns: string[]
  /** Block file downloads entirely. */
  blockDownloads: boolean
}

const DEFAULT_POLICY: Policy = {
  allowDomains: [],
  denyDomains: [],
  refusePatterns: ['submit', 'pay', 'buy', 'purchase', 'checkout', 'delete', 'send', 'confirm', 'transfer', 'withdraw'],
  blockDownloads: true,
}

function loadPolicy(): Policy {
  ensureRoot()
  if (!existsSync(POLICY_PATH)) {
    writeFileSync(POLICY_PATH, JSON.stringify(DEFAULT_POLICY, null, 2))
    return { ...DEFAULT_POLICY }
  }
  try {
    return { ...DEFAULT_POLICY, ...JSON.parse(readFileSync(POLICY_PATH, 'utf8')) }
  } catch {
    return { ...DEFAULT_POLICY }
  }
}

function savePolicy(p: Policy): void {
  ensureRoot()
  writeFileSync(POLICY_PATH, JSON.stringify(p, null, 2))
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ''
  }
}

function suffixMatch(host: string, patterns: string[]): boolean {
  return patterns.some((p) => {
    const pat = p.trim().toLowerCase().replace(/^\*\.?/, '')
    return pat !== '' && (host === pat || host.endsWith('.' + pat))
  })
}

/** Returns null if the navigation is allowed, or a reason string if denied. */
function navDecision(url: string, policy: Policy): string | null {
  const host = hostOf(url)
  if (!host) return `unparseable URL: ${url}`
  if (suffixMatch(host, policy.denyDomains)) return `domain ${host} is on the deny list`
  if (policy.allowDomains.length > 0 && !suffixMatch(host, policy.allowDomains)) {
    return `domain ${host} is not on the allow list`
  }
  return null
}

// ---------------------------------------------------------------------------
// Audit log — append-only, hash-chained. Provenance for every browser action.
// ---------------------------------------------------------------------------
interface AuditEntry {
  seq: number
  ts: string
  action: string
  target: string
  url: string
  decision: 'allowed' | 'refused'
  reason?: string
  prevHash: string
  hash: string
}

function readAudit(): AuditEntry[] {
  ensureRoot()
  if (!existsSync(AUDIT_PATH)) return []
  return readFileSync(AUDIT_PATH, 'utf8')
    .split('\n')
    .filter((l) => l.trim() !== '')
    .map((l) => JSON.parse(l) as AuditEntry)
}

function lastHash(): string {
  const log = readAudit()
  return log.length === 0 ? ZERO_HASH : log[log.length - 1].hash
}

function audit(action: string, target: string, url: string, decision: 'allowed' | 'refused', reason?: string): AuditEntry {
  ensureRoot()
  const prevHash = lastHash()
  const seq = readAudit().length
  const core = { seq, ts: new Date().toISOString(), action, target, url, decision, ...(reason ? { reason } : {}) }
  const hash = createHash('sha256').update(prevHash + JSON.stringify(core)).digest('hex')
  const entry: AuditEntry = { ...core, prevHash, hash } as AuditEntry
  appendFileSync(AUDIT_PATH, JSON.stringify(entry) + '\n')
  return entry
}

/**
 * Record an external action into the same hash-chained provenance ledger.
 * Used by crate-digging / sampling so every sourced asset is traceable.
 */
export function recordProvenance(action: string, target: string, url: string): AuditEntry {
  return audit(action, target, url, 'allowed')
}

/** Recompute the chain from genesis; returns the seq of the first broken link, or -1 if intact. */
function verifyAudit(): number {
  const log = readAudit()
  let prev = ZERO_HASH
  for (const e of log) {
    const { prevHash, hash, ...core } = e
    const expect = createHash('sha256').update(prev + JSON.stringify(core)).digest('hex')
    if (prevHash !== prev || hash !== expect) return e.seq
    prev = hash
  }
  return -1
}

// ---------------------------------------------------------------------------
// Browser singleton — kbot's own persistent Chrome.
// ---------------------------------------------------------------------------
let context: any = null
let page: any = null

async function getPage(): Promise<any> {
  if (page) return page
  ensureRoot()
  let chromium: any
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    throw new Error('Playwright not installed. Run: npx playwright install chromium')
  }
  const policy = loadPolicy()
  context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    viewport: null,
    acceptDownloads: !policy.blockDownloads,
    args: ['--no-first-run', '--no-default-browser-check', '--autoplay-policy=no-user-gesture-required'],
  })
  page = context.pages()[0] || (await context.newPage())
  return page
}

async function closeBrowser(): Promise<void> {
  if (context) {
    await context.close()
    context = null
    page = null
  }
}

function truncate(s: string, n = 5000): string {
  return s.length > n ? s.slice(0, n) + '\n...(truncated)' : s
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------
export function registerSecureBrowserTools(): void {
  registerTool({
    name: 'secure_browser_open',
    description: "Open kbot's own persistent browser (a real Chrome with a kbot-owned profile that stays logged in across runs). Every action is policy-checked and audit-logged. Optionally navigate to a URL.",
    parameters: {
      url: { type: 'string', description: 'Optional URL to open' },
    },
    tier: 'free',
    async execute(args) {
      const p = await getPage()
      const policy = loadPolicy()
      if (args.url) {
        const url = String(args.url)
        const deny = navDecision(url, policy)
        if (deny) {
          audit('open', url, p.url() || '', 'refused', deny)
          return `Refused: ${deny}. Adjust policy with secure_browser_policy.`
        }
        await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 })
        audit('open', url, p.url(), 'allowed')
        return `Opened kbot browser at ${p.url()} — "${await p.title()}". Profile: ${PROFILE_DIR}`
      }
      return `kbot browser open. Profile: ${PROFILE_DIR}. Policy: ${POLICY_PATH}. Audit: ${AUDIT_PATH}`
    },
  })

  registerTool({
    name: 'secure_browser_goto',
    description: 'Navigate the kbot browser to a URL (policy-checked + audited).',
    parameters: {
      url: { type: 'string', description: 'URL to navigate to', required: true },
    },
    tier: 'free',
    async execute(args) {
      const p = await getPage()
      const url = String(args.url)
      const deny = navDecision(url, loadPolicy())
      if (deny) {
        audit('goto', url, p.url() || '', 'refused', deny)
        return `Refused: ${deny}.`
      }
      await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 })
      audit('goto', url, p.url(), 'allowed')
      return `At ${p.url()} — "${await p.title()}"`
    },
  })

  registerTool({
    name: 'secure_browser_read',
    description: 'Read the current page: title + visible text (truncated). Read-only, audited.',
    parameters: {},
    tier: 'free',
    async execute() {
      const p = await getPage()
      const text = await p.innerText('body').catch(() => '')
      audit('read', 'body', p.url(), 'allowed')
      return `Title: ${await p.title()}\nURL: ${p.url()}\n\n${truncate(text)}`
    },
  })

  registerTool({
    name: 'secure_browser_click',
    description: 'Click an element by CSS selector. REFUSED if the selector matches an irreversible action (submit/pay/delete/send/...) — those stay with the human. Audited either way.',
    parameters: {
      selector: { type: 'string', description: 'CSS selector to click', required: true },
    },
    tier: 'free',
    async execute(args) {
      const p = await getPage()
      const selector = String(args.selector)
      const policy = loadPolicy()
      const lc = selector.toLowerCase()
      const matched = policy.refusePatterns.find((pat) => lc.includes(pat.toLowerCase()))
      if (matched) {
        audit('click', selector, p.url(), 'refused', `matches irreversible pattern "${matched}"`)
        return `Refused: "${selector}" looks like an irreversible action ("${matched}"). kbot does not perform submit/pay/delete/send — that is the human's authority. Do it yourself, or remove "${matched}" from refusePatterns via secure_browser_policy if this is a false positive.`
      }
      await p.click(selector, { timeout: 10_000 })
      audit('click', selector, p.url(), 'allowed')
      return `Clicked: ${selector}`
    },
  })

  registerTool({
    name: 'secure_browser_type',
    description: 'Type text into a field by CSS selector (audited). Will not type into password fields.',
    parameters: {
      selector: { type: 'string', description: 'CSS selector of the input', required: true },
      text: { type: 'string', description: 'Text to type', required: true },
    },
    tier: 'free',
    async execute(args) {
      const p = await getPage()
      const selector = String(args.selector)
      const typeAttr = await p.getAttribute(selector, 'type').catch(() => null)
      if (typeAttr === 'password') {
        audit('type', selector, p.url(), 'refused', 'password field')
        return `Refused: ${selector} is a password field. kbot does not enter credentials.`
      }
      await p.fill(selector, String(args.text))
      audit('type', selector, p.url(), 'allowed')
      return `Typed into ${selector}`
    },
  })

  registerTool({
    name: 'secure_browser_screenshot',
    description: 'Screenshot the current page (base64 PNG, audited).',
    parameters: {
      fullPage: { type: 'boolean', description: 'Capture the full scrollable page' },
    },
    tier: 'free',
    async execute(args) {
      const p = await getPage()
      const buffer = await p.screenshot({ fullPage: args.fullPage === true, type: 'png' })
      audit('screenshot', 'page', p.url(), 'allowed')
      return `Screenshot (${buffer.length} bytes, base64):\n${buffer.toString('base64').slice(0, 200)}...`
    },
  })

  registerTool({
    name: 'secure_browser_policy',
    description: "View or update kbot browser's security policy (domain allow/deny lists, refuse patterns, downloads). Call with no args to view.",
    parameters: {
      allowDomains: { type: 'array', description: 'Host suffixes to exclusively allow (empty = allow all but deny list)', items: { type: 'string' } },
      denyDomains: { type: 'array', description: 'Host suffixes to always block', items: { type: 'string' } },
      refusePatterns: { type: 'array', description: 'Click target patterns to refuse (irreversible actions)', items: { type: 'string' } },
      blockDownloads: { type: 'boolean', description: 'Block all file downloads' },
    },
    tier: 'free',
    async execute(args) {
      const policy = loadPolicy()
      let changed = false
      for (const k of ['allowDomains', 'denyDomains', 'refusePatterns'] as const) {
        if (Array.isArray(args[k])) {
          ;(policy as any)[k] = (args[k] as unknown[]).map(String)
          changed = true
        }
      }
      if (typeof args.blockDownloads === 'boolean') {
        policy.blockDownloads = args.blockDownloads
        changed = true
      }
      if (changed) {
        savePolicy(policy)
        audit('policy', 'update', '', 'allowed')
      }
      return `${changed ? 'Policy updated.\n' : ''}${JSON.stringify(policy, null, 2)}`
    },
  })

  registerTool({
    name: 'secure_browser_audit',
    description: "Read kbot browser's hash-chained audit log and verify its integrity. Every browser action is recorded and tamper-evident.",
    parameters: {
      limit: { type: 'number', description: 'How many recent entries to show (default 20)' },
    },
    tier: 'free',
    async execute(args) {
      const log = readAudit()
      const broken = verifyAudit()
      const integrity = broken === -1 ? 'INTACT (hash chain verified)' : `BROKEN at seq ${broken} — log was tampered`
      const n = typeof args.limit === 'number' ? args.limit : 20
      const recent = log.slice(-n).map((e) => `#${e.seq} ${e.ts} ${e.decision.toUpperCase()} ${e.action} ${e.target} @ ${e.url}${e.reason ? ` (${e.reason})` : ''}`)
      return `Audit chain: ${integrity}\nTotal entries: ${log.length}\n\n${recent.join('\n') || '(empty)'}`
    },
  })

  registerTool({
    name: 'secure_browser_close',
    description: 'Close kbot browser. The profile (logins) and audit log persist for next time.',
    parameters: {},
    tier: 'free',
    async execute() {
      await closeBrowser()
      return 'kbot browser closed. Profile + audit log preserved.'
    },
  })
}
