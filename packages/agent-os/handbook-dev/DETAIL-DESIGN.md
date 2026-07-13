# Agent OS 详细设计文档

> 本文档定义 Agent OS 各模块的详细设计，包括数据结构、算法、接口签名和实现要点，可作为独立实现本产品的工程依据。

**版本**: v0.2.0-alpha  
**日期**: 2026-07-13

---

## 1. 项目结构

### 1.1 目录结构

```
packages/agent-os/
├── src/
│   ├── types.ts       # 核心类型定义
│   ├── acap.ts        # 能力令牌: grant, verify, downscope
│   ├── budget.ts      # 配额追踪: BudgetTracker
│   ├── spawn.ts       # 智能体派生: spawn, AgentRegistry
│   ├── taint.ts       # 污染追踪: checkTaint, propagate
│   ├── vault.ts       # 凭证保险库: Vault
│   ├── outcomes.ts    # 评分迭代: withOutcome
│   └── index.ts       # 主入口
├── test/
│   ├── acap.test.ts
│   ├── budget.test.ts
│   ├── spawn.test.ts
│   ├── taint.test.ts
│   ├── vault.test.ts
│   └── outcomes.test.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

### 1.2 package.json

```json
{
  "name": "@your-org/agent-os",
  "version": "0.1.0",
  "type": "module",
  "license": "Apache-2.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
    "./acap": { "import": "./dist/acap.js", "types": "./dist/acap.d.ts" },
    "./spawn": { "import": "./dist/spawn.js", "types": "./dist/spawn.d.ts" },
    "./vault": { "import": "./dist/vault.js", "types": "./dist/vault.d.ts" },
    "./outcomes": { "import": "./dist/outcomes.js", "types": "./dist/outcomes.d.ts" }
  },
  "engines": { "node": ">=22.0.0" },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

### 1.3 tsconfig.json

```json
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
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

---

## 2. types.ts — 核心类型

### 2.1 品牌类型

```typescript
// AgentId: 防止与普通 string 混淆
export type AgentId = string & { readonly __agent_id: unique symbol }

// CredentialRef: 凭证引用
export type CredentialRef = string & { readonly __cred_ref: unique symbol }

// CredentialValue: 凭证值
export type CredentialValue = string & { readonly __cred_value: unique symbol }
```

### 2.2 签名

```typescript
export interface ManifestSignature {
  readonly algorithm: 'hmac-sha256' | 'ed25519'
  readonly signer: string           // AgentId
  readonly signature: string        // hex encoded
  readonly signed_at: string        // ISO 8601
}
```

### 2.3 智能体

```typescript
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
```

### 2.4 ACap

```typescript
// 能力主体
export type ACapSubject =
  | { readonly kind: 'tool'; readonly name: string }
  | { readonly kind: 'mcp_server'; readonly server: string }
  | { readonly kind: 'resource'; readonly uri: string }
  | { readonly kind: 'memory_block'; readonly block_id: string }
  | { readonly kind: 'audit_log'; readonly namespace: string }
  | { readonly kind: 'agent_handoff'; readonly target_pattern: string }

// 能力请求
export interface ACapRequest {
  readonly subject: ACapSubject
  readonly scope: ReadonlyArray<string>
  readonly max_invocations?: number
  readonly justification: string
}

// 能力令牌
export interface ACap extends ACapRequest {
  readonly id: string
  readonly granted_to: AgentId
  readonly granted_by: AgentId
  readonly granted_at: string
  readonly expires_at: string
  readonly signature: ManifestSignature
  readonly invocations: number
}
```

### 2.5 命名空间

```typescript
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
```

### 2.6 预算

```typescript
export interface AgentBudget {
  readonly max_input_tokens: number
  readonly max_output_tokens: number
  readonly max_wall_clock_seconds: number
  readonly max_cost_usd: number
  readonly max_children: number
  readonly warn_at?: {
    readonly tokens?: number      // 0.0-1.0
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
```

### 2.7 污染

```typescript
export type TaintSource = 
  | 'fetched_url' 
  | 'email' 
  | 'user_input' 
  | 'untrusted_file' 
  | 'agent_message'

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
```

### 2.8 凭证

```typescript
export interface VaultEntry {
  readonly ref: CredentialRef
  readonly bound_to: ACapSubject
  readonly injection: InjectionShape
  readonly description?: string
}

export type InjectionShape =
  | { readonly kind: 'header'; readonly name: string; readonly prefix?: string }
  | { readonly kind: 'query_param'; readonly name: string }
  | { readonly kind: 'bearer_token' }

export type Injection =
  | { readonly kind: 'header'; readonly name: string; readonly header_value: string }
  | { readonly kind: 'query_param'; readonly name: string; readonly param_value: string }
  | { readonly kind: 'bearer_token'; readonly header_value: string }

export interface InjectionLog {
  readonly cred_ref: CredentialRef
  readonly caller_acap: string
  readonly bound_subject: ACapSubject
  readonly injection_kind: InjectionShape['kind']
  readonly outcome: 'injected' | 'denied' | 'missing'
  readonly at: string
}
```

### 2.9 评分

```typescript
export interface RubricCriterion {
  readonly name: string
  readonly description: string
  readonly weight?: number
}

export interface Rubric {
  readonly criteria: ReadonlyArray<RubricCriterion>
  readonly satisfied_at?: number
}

export interface CriterionScore {
  readonly name: string
  readonly score: number        // 0.0-1.0
  readonly feedback: string
}

export interface RubricEvaluation {
  readonly per_criterion: ReadonlyArray<CriterionScore>
  readonly overall_score: number
  readonly verdict: 'satisfied' | 'needs_revision' | 'failed'
  readonly revision_guidance?: string
}

export type OutcomeResultCode = 
  | 'satisfied' 
  | 'needs_revision' 
  | 'max_iterations_reached' 
  | 'failed' 
  | 'interrupted'

export interface OutcomeResult<T> {
  readonly code: OutcomeResultCode
  readonly iterations_used: number
  readonly final_work: T | null
  readonly final_evaluation: RubricEvaluation | null
  readonly history: ReadonlyArray<{
    readonly iteration: number
    readonly work: T
    readonly work_serialized: string
    readonly evaluation: RubricEvaluation
    readonly at: string
  }>
}
```

### 2.10 Result 类型

```typescript
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

export function err(
  code: OSErrorCode, 
  message: string, 
  details?: Record<string, unknown>
): OSResult<never> {
  return { ok: false, error: { code, message, ...(details && { details }) } }
}
```

---

## 3. acap.ts — 能力令牌

### 3.1 核心实现

```typescript
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type { ACap, ACapRequest, AgentId, ManifestSignature, OSResult } from './types.js'
import { err, ok } from './types.js'

/**
 * 签名规范化
 */
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

/**
 * 签名生成 (HMAC-SHA256)
 */
function signAcap(
  acap: Omit<ACap, 'signature' | 'invocations'>,
  signer: AgentId,
  key: Buffer,
): ManifestSignature {
  const signed_at = new Date().toISOString()
  const payload = canonicalize({
    id: acap.id,
    subject: acap.subject,
    scope: [...acap.scope],
    justification: acap.justification,
    max_invocations: acap.max_invocations ?? null,
    granted_to: acap.granted_to,
    granted_by: acap.granted_by,
    granted_at: acap.granted_at,
    expires_at: acap.expires_at,
    signer,
    signed_at,
  })
  const signature = createHmac('sha256', key).update(payload, 'utf8').digest('hex')
  return { algorithm: 'hmac-sha256', signer, signature, signed_at }
}
```

### 3.2 grant 函数

```typescript
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
    id,
    subject: request.subject,
    scope: request.scope,
    justification: request.justification,
    ...(request.max_invocations !== undefined && { max_invocations: request.max_invocations }),
    granted_to: opts.granted_to,
    granted_by: opts.granted_by,
    granted_at,
    expires_at: opts.expires_at,
  }

  const signature = signAcap(acap, opts.granted_by, opts.signing_key)
  return { ...acap, signature, invocations: 0 }
}
```

### 3.3 verify 函数

```typescript
export interface VerifyOptions {
  readonly trust: ReadonlyMap<AgentId, Buffer>
  readonly revocations?: RevocationList
  readonly now?: Date
}

export function verify(acap: ACap, opts: VerifyOptions): OSResult<true> {
  const now = (opts.now ?? new Date()).getTime()
  const expires = Date.parse(acap.expires_at)

  // 1. 检查过期
  if (Number.isFinite(expires) && now >= expires) {
    return err('capability_expired', `acap ${acap.id} expired at ${acap.expires_at}`)
  }

  // 2. 检查调用次数
  if (acap.max_invocations !== undefined && acap.invocations >= acap.max_invocations) {
    return err('capability_exhausted', 
      `acap ${acap.id} exhausted: ${acap.invocations}/${acap.max_invocations}`)
  }

  // 3. 检查撤销
  if (opts.revocations?.isRevoked(acap.id) === true) {
    return err('capability_denied', `acap ${acap.id} has been revoked`)
  }

  // 4. 检查信任
  const key = opts.trust.get(acap.signature.signer as AgentId)
  if (!key) {
    return err('capability_denied', `signer ${acap.signature.signer} not in trust set`)
  }

  // 5. 验证签名
  const { signature, invocations, ...skeleton } = acap
  const expected = signAcap(skeleton, acap.signature.signer as AgentId, key)
  const a = Buffer.from(signature.signature, 'hex')
  const b = Buffer.from(expected.signature, 'hex')
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return err('capability_denied', `acap ${acap.id} has an invalid signature`)
  }

  return ok(true)
}
```

### 3.4 downscope 函数

```typescript
export function downscope(
  source: ACap,
  request: Partial<ACapRequest> & { granted_to: AgentId; signing_key: Buffer },
): OSResult<ACap> {
  const subject = request.subject ?? source.subject

  // 1. Subject kind 必须匹配
  if (subject.kind !== source.subject.kind) {
    return err('handoff_escalation_denied', 
      `downscope cannot change subject kind: ${source.subject.kind} -> ${subject.kind}`)
  }

  // 2. Scope 只能缩小
  const requestedScope = new Set(request.scope ?? source.scope)
  const sourceScope = new Set(source.scope)
  for (const s of requestedScope) {
    if (!sourceScope.has(s)) {
      return err('handoff_escalation_denied', `downscope cannot add scope "${s}"`)
    }
  }

  // 3. max_invocations 不能增加
  const sourceMax = source.max_invocations
  const requestedMax = request.max_invocations
  if (sourceMax !== undefined && (requestedMax === undefined || requestedMax > sourceMax)) {
    return err('handoff_escalation_denied', 
      `downscope cannot grant max_invocations=${requestedMax ?? 'unlimited'} when source=${sourceMax}`)
  }

  // 4. 考虑已使用次数
  const sourceRemaining = sourceMax !== undefined 
    ? sourceMax - source.invocations 
    : Number.POSITIVE_INFINITY
  if (requestedMax !== undefined && requestedMax > sourceRemaining) {
    return err('handoff_escalation_denied', 
      `downscope cannot grant more invocations (${requestedMax}) than source has remaining (${sourceRemaining})`)
  }

  // 5. 授予新令牌
  return ok(grant(
    {
      subject,
      scope: [...requestedScope],
      justification: request.justification ?? `downscoped from ${source.id}`,
      ...(requestedMax !== undefined && { max_invocations: requestedMax }),
    },
    {
      granted_to: request.granted_to,
      granted_by: source.granted_to,
      expires_at: source.expires_at,
      signing_key: request.signing_key,
    },
  ))
}
```

### 3.5 RevocationList 类

```typescript
export class RevocationList {
  private readonly revoked = new Set<string>()

  revoke(acap_id: string): void {
    this.revoked.add(acap_id)
  }

  isRevoked(acap_id: string): boolean {
    return this.revoked.has(acap_id)
  }

  size(): number {
    return this.revoked.size
  }
}
```

---

## 4. budget.ts — 配额追踪

### 4.1 BudgetTracker 类

```typescript
import type { AgentBudget, BudgetUsage, OSResult } from './types.js'
import { err, ok } from './types.js'

export interface BudgetWarning {
  readonly flags: Array<'tokens' | 'cost' | 'wall_clock'>
  readonly usage: BudgetUsage
}

export class BudgetTracker {
  private usage: BudgetUsage = {
    input_tokens: 0,
    output_tokens: 0,
    wall_clock_seconds: 0,
    cost_usd: 0,
    children_spawned: 0,
  }
  private readonly start: number

  constructor(private readonly budget: AgentBudget) {
    this.start = Date.now()
  }

  current(): BudgetUsage {
    return { ...this.usage, wall_clock_seconds: (Date.now() - this.start) / 1000 }
  }

  canCharge(input: number, output: number, cost: number): OSResult<true> {
    const projected_in = this.usage.input_tokens + input
    if (projected_in > this.budget.max_input_tokens) {
      return err('budget_exceeded', `input tokens would exceed budget: ${projected_in}/${this.budget.max_input_tokens}`)
    }

    const projected_out = this.usage.output_tokens + output
    if (projected_out > this.budget.max_output_tokens) {
      return err('budget_exceeded', `output tokens would exceed budget: ${projected_out}/${this.budget.max_output_tokens}`)
    }

    const projected_cost = this.usage.cost_usd + cost
    if (projected_cost > this.budget.max_cost_usd) {
      return err('budget_exceeded', `cost would exceed budget: $${projected_cost.toFixed(4)}/$${this.budget.max_cost_usd}`)
    }

    const elapsed = (Date.now() - this.start) / 1000
    if (elapsed > this.budget.max_wall_clock_seconds) {
      return err('budget_exceeded', `wall clock exceeded budget: ${elapsed.toFixed(1)}s/${this.budget.max_wall_clock_seconds}s`)
    }

    return ok(true)
  }

  charge(input: number, output: number, cost: number): OSResult<BudgetWarning | null> {
    const check = this.canCharge(input, output, cost)
    if (!check.ok) return check

    this.usage = {
      ...this.usage,
      input_tokens: this.usage.input_tokens + input,
      output_tokens: this.usage.output_tokens + output,
      cost_usd: this.usage.cost_usd + cost,
    }

    return ok(this.computeWarning())
  }

  canSpawn(): OSResult<true> {
    if (this.usage.children_spawned >= this.budget.max_children) {
      return err('budget_exceeded', `child spawn would exceed budget: ${this.usage.children_spawned}/${this.budget.max_children}`)
    }
    return ok(true)
  }

  recordSpawn(): void {
    this.usage = { ...this.usage, children_spawned: this.usage.children_spawned + 1 }
  }

  private computeWarning(): BudgetWarning | null {
    const warn = this.budget.warn_at
    if (!warn) return null

    const flags: BudgetWarning['flags'] = []

    if (warn.tokens !== undefined) {
      const ratio_in = this.usage.input_tokens / this.budget.max_input_tokens
      const ratio_out = this.usage.output_tokens / this.budget.max_output_tokens
      if (Math.max(ratio_in, ratio_out) >= warn.tokens) flags.push('tokens')
    }

    if (warn.cost !== undefined) {
      const ratio = this.usage.cost_usd / this.budget.max_cost_usd
      if (ratio >= warn.cost) flags.push('cost')
    }

    if (warn.wall_clock !== undefined) {
      const elapsed = (Date.now() - this.start) / 1000
      const ratio = elapsed / this.budget.max_wall_clock_seconds
      if (ratio >= warn.wall_clock) flags.push('wall_clock')
    }

    return flags.length > 0 ? { flags, usage: this.current() } : null
  }
}
```

---

## 5. spawn.ts — 智能体派生

### 5.1 AgentRegistry 类

```typescript
import { randomBytes } from 'node:crypto'
import type { AgentId, AgentManifest, AgentBudget, NamespaceSpec, OSResult, ACapRequest } from './types.js'
import { err, ok } from './types.js'
import { BudgetTracker } from './budget.js'

export class AgentRegistry {
  private readonly agents = new Map<AgentId, RegisteredAgent>()

  register(agent: RegisteredAgent): OSResult<true> {
    if (this.agents.has(agent.manifest.id)) {
      return err('manifest_invalid', `agent ${agent.manifest.id} already registered`)
    }
    this.agents.set(agent.manifest.id, agent)
    return ok(true)
  }

  get(id: AgentId): RegisteredAgent | undefined {
    return this.agents.get(id)
  }

  has(id: AgentId): boolean {
    return this.agents.has(id)
  }

  children(id: AgentId | null): AgentId[] {
    const out: AgentId[] = []
    for (const [child_id, agent] of this.agents) {
      if (agent.manifest.parent === id) out.push(child_id)
    }
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

export interface RegisteredAgent {
  readonly manifest: AgentManifest
  readonly tracker: BudgetTracker
}
```

### 5.2 spawn 函数

```typescript
export interface SpawnRequest {
  readonly parent: AgentId | null
  readonly purpose: string
  readonly requested_capabilities: ACapRequest[]
  readonly budget: AgentBudget
  readonly namespace: NamespaceSpec
}

export interface SpawnContext {
  readonly registry: AgentRegistry
}

export function spawn(request: SpawnRequest, ctx: SpawnContext): OSResult<RegisteredAgent> {
  // 1. 检查 parent
  if (request.parent !== null) {
    const parent = ctx.registry.get(request.parent)
    if (!parent) {
      return err('parent_not_found', `parent agent ${request.parent} is not registered`)
    }

    // 2. 检查 child quota
    const spawnCheck = parent.tracker.canSpawn()
    if (!spawnCheck.ok) return spawnCheck

    // 3. 记录 spawn
    parent.tracker.recordSpawn()
  }

  // 4. 生成 ID
  const id = makeAgentId()

  // 5. 创建 manifest
  const manifest: AgentManifest = {
    id,
    parent: request.parent,
    purpose: request.purpose,
    requested_capabilities: request.requested_capabilities,
    budget: request.budget,
    namespace: request.namespace,
    created_at: new Date().toISOString(),
  }

  // 6. 创建 tracker
  const tracker = new BudgetTracker(request.budget)
  const agent: RegisteredAgent = { manifest, tracker }

  // 7. 注册
  const reg = ctx.registry.register(agent)
  if (!reg.ok) return reg

  return ok(agent)
}

function makeAgentId(): AgentId {
  return ('agent_' + randomBytes(10).toString('hex')) as AgentId
}
```

---

## 6. taint.ts — 污染追踪

### 6.1 TaintPolicy

```typescript
import type { Taint, ToolCall, TaintSource, ToolCallResult, OSResult } from './types.js'
import { err, ok } from './types.js'

export interface TaintPolicy {
  readonly blocks: ReadonlyMap<string, ReadonlySet<TaintSource>>
  readonly untaint_allowlist: ReadonlySet<string>
}

export const DEFAULT_TAINT_POLICY: TaintPolicy = {
  blocks: new Map<string, ReadonlySet<TaintSource>>([
    ['email_send', new Set(['fetched_url', 'email', 'agent_message', 'untrusted_file'])],
    ['http_post', new Set(['fetched_url', 'email', 'agent_message', 'untrusted_file'])],
    ['file_write', new Set(['fetched_url', 'email', 'agent_message'])],
    ['shell_exec', new Set(['fetched_url', 'email', 'user_input', 'agent_message', 'untrusted_file'])],
    ['mcp_send', new Set(['fetched_url', 'email', 'agent_message', 'untrusted_file'])],
  ]),
  untaint_allowlist: new Set<string>(['compliance.untaint']),
}
```

### 6.2 checkTaint 函数

```typescript
export function checkTaint(call: ToolCall, policy: TaintPolicy = DEFAULT_TAINT_POLICY): OSResult<true> {
  const blocked = policy.blocks.get(call.tool)
  if (!blocked) return ok(true)

  for (const taint of call.taints) {
    if (blocked.has(taint.source)) {
      return err('taint_violation', `tool ${call.tool} refuses input tainted by ${taint.source}`, {
        tool: call.tool,
        taint_source: taint.source,
        taint_origin: taint.origin,
      })
    }
  }

  return ok(true)
}
```

### 6.3 propagate 函数

```typescript
export function propagate(
  call: ToolCall,
  raw_value: unknown,
  introduces?: TaintSource,
): ToolCallResult {
  const inherited = [...call.taints]

  if (introduces) {
    const origin = typeof call.args === 'object' && call.args !== null && 'url' in call.args
      ? String((call.args as { url: unknown }).url)
      : call.tool

    inherited.push({
      source: introduces,
      origin,
      introduced_at: new Date().toISOString(),
    })
  }

  return {
    tool: call.tool,
    value: raw_value,
    produced_at: new Date().toISOString(),
    taints: inherited,
  }
}
```

### 6.4 untaint 函数

```typescript
export function untaint(
  result: ToolCallResult,
  performed_by_tool: string,
  policy: TaintPolicy = DEFAULT_TAINT_POLICY,
): OSResult<ToolCallResult> {
  if (!policy.untaint_allowlist.has(performed_by_tool)) {
    return err('taint_violation', `tool ${performed_by_tool} is not on the untaint allowlist`, {
      allowlist: [...policy.untaint_allowlist],
    })
  }

  return ok({ ...result, taints: [] })
}
```

---

## 7. vault.ts — 凭证保险库

### 7.1 Vault 类

```typescript
import type { ACap, ACapSubject, OSResult, CredentialRef, CredentialValue, VaultEntry, Injection, InjectionShape, InjectionLog } from './types.js'
import { err, ok } from './types.js'

export type CredentialResolver = (ref: CredentialRef) => Promise<CredentialValue | null>

export class Vault {
  private readonly entries = new Map<CredentialRef, VaultEntry>()
  private resolver: CredentialResolver
  private readonly logs: InjectionLog[] = []

  constructor(resolver?: CredentialResolver) {
    this.resolver = resolver ?? makeInMemoryResolver()
  }

  register(entry: VaultEntry): OSResult<true> {
    if (this.entries.has(entry.ref)) {
      return err('capability_denied', `vault entry ${entry.ref} already exists`)
    }
    this.entries.set(entry.ref, entry)
    return ok(true)
  }

  withResolver(resolver: CredentialResolver): void {
    this.resolver = resolver
  }

  async inject(ref: CredentialRef, caller_acap: ACap): Promise<OSResult<Injection>> {
    // 1. 检查凭证存在
    const entry = this.entries.get(ref)
    if (!entry) {
      this.log(ref, caller_acap, undefined, 'missing')
      return err('namespace_violation', `vault has no entry for ${ref}`)
    }

    // 2. 检查绑定
    if (!subjectsMatch(caller_acap.subject, entry.bound_to)) {
      this.log(ref, caller_acap, entry.bound_to, 'denied')
      return err('capability_denied', `acap subject does not match vault entry binding`, {
        cred_ref: ref,
        acap_subject: caller_acap.subject,
        bound_to: entry.bound_to,
      })
    }

    // 3. 解析凭证
    const value = await this.resolver(ref)
    if (value === null) {
      this.log(ref, caller_acap, entry.bound_to, 'missing')
      return err('namespace_violation', `resolver returned null for ${ref}`)
    }

    // 4. 记录并返回
    this.log(ref, caller_acap, entry.bound_to, 'injected')
    return ok(materialize(entry.injection, value))
  }

  recentLogs(limit = 100): ReadonlyArray<InjectionLog> {
    return this.logs.slice(-limit)
  }

  size(): number {
    return this.entries.size
  }

  archive(ref: CredentialRef): OSResult<true> {
    if (!this.entries.has(ref)) {
      return err('namespace_violation', `vault has no entry for ${ref}`)
    }
    this.entries.delete(ref)
    return ok(true)
  }

  private log(
    cred_ref: CredentialRef,
    caller: ACap,
    bound_subject: ACapSubject | undefined,
    outcome: InjectionLog['outcome'],
  ): void {
    this.logs.push({
      cred_ref,
      caller_acap: caller.id,
      bound_subject: bound_subject ?? caller.subject,
      injection_kind: 'header',
      outcome,
      at: new Date().toISOString(),
    })
  }
}

function materialize(shape: InjectionShape, value: CredentialValue): Injection {
  switch (shape.kind) {
    case 'header':
      return {
        kind: 'header',
        name: shape.name,
        header_value: shape.prefix !== undefined ? `${shape.prefix}${value}` : (value as string),
      }
    case 'query_param':
      return { kind: 'query_param', name: shape.name, param_value: value as string }
    case 'bearer_token':
      return { kind: 'bearer_token', header_value: `Bearer ${value}` }
  }
}

function subjectsMatch(a: ACapSubject, b: ACapSubject): boolean {
  if (a.kind !== b.kind) return false
  switch (a.kind) {
    case 'tool': return a.name === (b as { name: string }).name
    case 'mcp_server': return a.server === (b as { server: string }).server
    case 'resource': return a.uri === (b as { uri: string }).uri
    case 'memory_block': return a.block_id === (b as { block_id: string }).block_id
    case 'audit_log': return a.namespace === (b as { namespace: string }).namespace
    case 'agent_handoff': return a.target_pattern === (b as { target_pattern: string }).target_pattern
  }
}

function makeInMemoryResolver(): CredentialResolver {
  const store = new Map<CredentialRef, CredentialValue>()
  return async (ref) => store.get(ref) ?? null
}

export function inMemoryResolver(entries: Record<string, string>): CredentialResolver {
  const store = new Map<string, string>(Object.entries(entries))
  return async (ref) => {
    const v = store.get(ref as string)
    return v !== undefined ? (v as CredentialValue) : null
  }
}
```

---

## 8. outcomes.ts — 评分迭代

### 8.1 withOutcome 函数

```typescript
import type { OSResult } from './types.js'
import { err, ok } from './types.js'

export interface RubricEvaluator {
  evaluate(work: string, rubric: Rubric, iteration: number): Promise<RubricEvaluation>
}

export interface WithOutcomeOptions<T> {
  readonly max_iterations: number
  readonly serialize?: (work: T) => string
  readonly signal?: AbortSignal
}

export async function withOutcome<T>(
  rubric: Rubric,
  attempt: (feedback: string | null, iteration: number) => Promise<T>,
  evaluator: RubricEvaluator,
  options: WithOutcomeOptions<T>,
): Promise<OutcomeResult<T>> {
  const serialize = options.serialize ?? ((t: T) => JSON.stringify(t))
  const max = Math.max(1, Math.floor(options.max_iterations))
  const history: OutcomeResult<T>['history'] = []
  let feedback: string | null = null
  let lastWork: T | null = null
  let lastEval: RubricEvaluation | null = null

  for (let i = 1; i <= max; i++) {
    // 检查中断
    if (options.signal?.aborted) {
      return { code: 'interrupted', iterations_used: i - 1, final_work: lastWork, final_evaluation: lastEval, history }
    }

    // 执行 attempt
    let work: T
    try {
      work = await attempt(feedback, i)
    } catch {
      return { code: 'failed', iterations_used: i - 1, final_work: lastWork, final_evaluation: lastEval, history }
    }

    // 评估
    let evaluation: RubricEvaluation
    try {
      evaluation = await evaluator.evaluate(serialize(work), rubric, i)
    } catch {
      return { code: 'failed', iterations_used: i, final_work: work, final_evaluation: lastEval, history }
    }

    // 记录历史
    history.push({
      iteration: i,
      work,
      work_serialized: serialize(work),
      evaluation,
      at: new Date().toISOString(),
    })
    lastWork = work
    lastEval = evaluation

    // 检查结果
    if (evaluation.verdict === 'satisfied') {
      return { code: 'satisfied', iterations_used: i, final_work: work, final_evaluation: evaluation, history }
    }
    if (evaluation.verdict === 'failed') {
      return { code: 'failed', iterations_used: i, final_work: work, final_evaluation: evaluation, history }
    }

    // 生成反馈
    feedback = evaluation.revision_guidance ?? synthesizeFeedback(evaluation.per_criterion)
  }

  return { code: 'max_iterations_reached', iterations_used: max, final_work: lastWork, final_evaluation: lastEval, history }
}

function synthesizeFeedback(scores: ReadonlyArray<CriterionScore>): string {
  const weakest = [...scores].sort((a, b) => a.score - b.score).slice(0, 3)
  if (weakest.length === 0) return ''
  return weakest.map(s => `[${s.name} score=${s.score.toFixed(2)}] ${s.feedback}`).join('\n')
}

export function weightedAverage(scores: ReadonlyArray<CriterionScore>, rubric: Rubric): number {
  if (scores.length === 0) return 0
  const lookup = new Map(rubric.criteria.map(c => [c.name, c.weight ?? 1.0]))
  let weighted_sum = 0
  let total_weight = 0
  for (const s of scores) {
    const w = lookup.get(s.name) ?? 1.0
    weighted_sum += s.score * w
    total_weight += w
  }
  return total_weight > 0 ? weighted_sum / total_weight : 0
}

export function classify(score: number, rubric: Rubric): 'satisfied' | 'needs_revision' {
  const threshold = rubric.satisfied_at ?? 0.85
  return score >= threshold ? 'satisfied' : 'needs_revision'
}

export function predicateEvaluator(
  predicate: (work: string) => boolean,
  rubric: Rubric,
  feedback_when_failing: string,
): RubricEvaluator {
  return {
    async evaluate(work: string): Promise<RubricEvaluation> {
      const passing = predicate(work)
      const per_criterion = rubric.criteria.map(c => ({
        name: c.name,
        score: passing ? 1.0 : 0.0,
        feedback: passing ? 'meets criterion' : feedback_when_failing,
      }))
      const overall_score = weightedAverage(per_criterion, rubric)
      return {
        per_criterion,
        overall_score,
        verdict: passing ? 'satisfied' : 'needs_revision',
        revision_guidance: passing ? undefined : feedback_when_failing,
      }
    },
  }
}
```

---

## 9. 测试设计

### 9.1 acap.test.ts

```typescript
import { describe, expect, it } from 'vitest'
import { randomBytes } from 'node:crypto'
import { grant, verify, downscope, RevocationList } from '../src/acap.js'

const PARENT = 'agent_parent' as AgentId
const CHILD = 'agent_child' as AgentId
const KEY = randomBytes(32)
const TRUST = new Map([[PARENT, KEY]])

describe('acap.grant + verify', () => {
  it('produces a verifiable capability', () => {
    const cap = grant(
      { subject: { kind: 'tool', name: 'http_get' }, scope: ['invoke'], max_invocations: 10, justification: 'test' },
      { granted_by: PARENT, granted_to: CHILD, expires_at: new Date(Date.now() + 3600_000).toISOString(), signing_key: KEY }
    )
    expect(verify(cap, { trust: TRUST }).ok).toBe(true)
  })

  it('rejects an expired capability', () => {
    const cap = grant(
      { subject: { kind: 'tool', name: 'http_get' }, scope: ['invoke'], max_invocations: 10, justification: 'test' },
      { granted_by: PARENT, granted_to: CHILD, expires_at: new Date(Date.now() - 1000).toISOString(), signing_key: KEY }
    )
    const v = verify(cap, { trust: TRUST })
    expect(v.ok).toBe(false)
    if (!v.ok) expect(v.error.code).toBe('capability_expired')
  })

  it('rejects a revoked capability', () => {
    const cap = grant(
      { subject: { kind: 'tool', name: 'http_get' }, scope: ['invoke'], max_invocations: 10, justification: 'test' },
      { granted_by: PARENT, granted_to: CHILD, expires_at: new Date(Date.now() + 3600_000).toISOString(), signing_key: KEY }
    )
    const revs = new RevocationList()
    revs.revoke(cap.id)
    expect(verify(cap, { trust: TRUST, revocations: revs }).ok).toBe(false)
  })
})

describe('acap.downscope', () => {
  const source = grant(
    { subject: { kind: 'tool', name: 'http_get' }, scope: ['invoke'], max_invocations: 10, justification: 'test' },
    { granted_by: PARENT, granted_to: CHILD, expires_at: new Date(Date.now() + 3600_000).toISOString(), signing_key: KEY }
  )

  it('produces a strictly-narrower capability', () => {
    const sub = downscope(source, { granted_to: 'agent_grandchild' as AgentId, max_invocations: 5, signing_key: KEY })
    expect(sub.ok).toBe(true)
    if (sub.ok) {
      expect(sub.value.max_invocations).toBe(5)
    }
  })

  it('refuses to add scope', () => {
    const sub = downscope(source, { granted_to: 'agent_grandchild' as AgentId, scope: ['invoke', 'admin'], signing_key: KEY })
    expect(sub.ok).toBe(false)
    if (!sub.ok) expect(sub.error.code).toBe('handoff_escalation_denied')
  })

  it('refuses to grant more invocations than source has', () => {
    const sub = downscope(source, { granted_to: 'agent_grandchild' as AgentId, max_invocations: 100, signing_key: KEY })
    expect(sub.ok).toBe(false)
    if (!sub.ok) expect(sub.error.code).toBe('handoff_escalation_denied')
  })
})
```

### 9.2 taint.test.ts

```typescript
import { describe, expect, it } from 'vitest'
import { checkTaint, propagate, untaint, DEFAULT_TAINT_POLICY } from '../src/taint.js'

describe('chexec / checkTaint', () => {
  it('blocks email_send when input is tainted by email', () => {
    const call = {
      tool: 'email_send',
      args: { to: 'someone', body: 'leaked' },
      caller: 'agent_test' as AgentId,
      acap: 'cap_x',
      taints: [{ source: 'email' as const, origin: 'inbox/x', introduced_at: new Date().toISOString() }],
    }
    expect(checkTaint(call).ok).toBe(false)
  })

  it('allows email_send when no taints are present', () => {
    const call = { tool: 'email_send', args: {}, caller: 'agent_test' as AgentId, acap: 'cap_x', taints: [] }
    expect(checkTaint(call).ok).toBe(true)
  })

  it('does not block unknown tools', () => {
    const call = { tool: 'unknown_tool', args: {}, caller: 'agent_test' as AgentId, acap: 'cap_x', taints: [] }
    expect(checkTaint(call).ok).toBe(true)
  })
})

describe('chexec / propagate', () => {
  it('inherits input taints onto the result', () => {
    const call = { tool: 'transform', args: {}, caller: 'agent_test' as AgentId, acap: 'cap_x', taints: [{ source: 'email' as const, origin: 'x', introduced_at: new Date().toISOString() }] }
    const r = propagate(call, { result: true })
    expect(r.taints).toHaveLength(1)
    expect(r.taints[0]?.source).toBe('email')
  })

  it('introduces a new taint when the tool says so', () => {
    const call = { tool: 'http_get', args: { url: 'https://example.com' }, caller: 'agent_test' as AgentId, acap: 'cap_x', taints: [] }
    const r = propagate(call, '<html>...</html>', 'fetched_url')
    expect(r.taints).toHaveLength(1)
    expect(r.taints[0]?.source).toBe('fetched_url')
  })

  it('unions input and tool-introduced taints', () => {
    const call = { tool: 'http_get', args: { url: 'https://example.com' }, caller: 'agent_test' as AgentId, acap: 'cap_x', taints: [{ source: 'email' as const, origin: 'x', introduced_at: new Date().toISOString() }] }
    const r = propagate(call, '<html>...</html>', 'fetched_url')
    expect(r.taints).toHaveLength(2)
  })
})

describe('chexec / untaint', () => {
  it('refuses untaint by an unauthorized tool', () => {
    const result = { tool: 'x', value: 'data', produced_at: new Date().toISOString(), taints: [{ source: 'email' as const, origin: 'x', introduced_at: new Date().toISOString() }] }
    expect(untaint(result, 'random_tool').ok).toBe(false)
  })

  it('strips taints when called by an authorized tool', () => {
    const result = { tool: 'x', value: 'data', produced_at: new Date().toISOString(), taints: [{ source: 'email' as const, origin: 'x', introduced_at: new Date().toISOString() }] }
    expect(untaint(result, 'compliance.untaint').ok).toBe(true)
  })
})
```

---

## 10. 索引

| 模块 | 文件 | 关键函数/类 | 行数 |
|------|------|-------------|------|
| 类型 | types.ts | OSResult, ACapSubject, Taint | 234 |
| 能力 | acap.ts | grant, verify, downscope, RevocationList | 227 |
| 配额 | budget.ts | BudgetTracker | 125 |
| 派生 | spawn.ts | spawn, AgentRegistry | 128 |
| 污染 | taint.ts | checkTaint, propagate, untaint | 114 |
| 凭证 | vault.ts | Vault, inject | 225 |
| 评分 | outcomes.ts | withOutcome, RubricEvaluator | 264 |
| **合计** | | | **1,317** |
