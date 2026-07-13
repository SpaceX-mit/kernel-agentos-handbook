# Agent OS 架构设计文档

> 本文档定义 Agent OS 的系统架构、核心概念模型和模块划分，可作为独立实现本产品的架构依据。

**版本**: v0.2.0-alpha  
**日期**: 2026-07-13

---

## 1. 设计原则

### 1.1 核心原则

| 原则 | 说明 | 体现 |
|------|------|------|
| **OS 类比** | 用 OS 概念映射智能体概念 | spawn=fork, chexec=execve |
| **零信任** | 默认拒绝，显式授权 | acap + verify |
| **最小权限** | 只授予完成任务所需的最小能力 | downscope |
| **纵深防御** | 多层独立安全机制 | taint + vault + budget |
| **可审计** | 所有操作可追溯 | audit + injection logs |

### 1.2 技术原则

| 原则 | 说明 |
|------|------|
| **零外部依赖** | 纯 Node.js 内置 API |
| **类型即文档** | TypeScript 判别联合类型 |
| **显式优于隐式** | 拒绝魔法操作 |
| **可组合原语** | 每个原语可独立使用 |

---

## 2. 系统架构

### 2.1 层级视图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           智能体应用层                                    │
│            (Claude Code, kbot, LangChain Agent, etc.)                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                    Agent OS 核心层                                 │ │
│  │                                                                   │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │ │
│  │  │   能力系统   │  │   配额系统   │  │  命名空间    │               │ │
│  │  │   ACap      │  │  BudgetTracker│ │  Namespace   │               │ │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────┘               │ │
│  │         │                 │                                      │ │
│  │  ┌──────▼─────────────────▼────────────────────────────────────┐   │ │
│  │  │                    chexec 执行层                              │   │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │   │ │
│  │  │  │  污染追踪    │  │  Vault 注入  │  │   审计日志   │        │   │ │
│  │  │  │  TaintTrack │  │  Credential │  │    Audit    │        │   │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘        │   │ │
│  │  └──────────────────────────────────────────────────────────────┘   │ │
│  │                              │                                   │ │
│  │  ┌───────────────────────────▼───────────────────────────────┐    │ │
│  │  │                 AgentRegistry (注册表)                    │    │ │
│  │  │     register / get / children / ancestors                │    │ │
│  │  └───────────────────────────────────────────────────────────┘    │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                           沙箱层                                         │
│            (Modal, Daytona, RunPod, E2B, Docker, bare process)          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 数据流视图

```
                        用户请求
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Agent OS 入口                                 │
│  spawn() / acap.grant() / chexec() / vault.inject()             │
└──────────────────────────────────┬────────────────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│  能力验证     │        │  配额检查     │        │  污染检查     │
│  verify()     │        │  canCharge()  │        │  checkTaint() │
└───────┬───────┘        └───────┬───────┘        └───────┬───────┘
        │                        │                        │
        └────────────┬───────────┘                        │
                     │                                    │
                     ▼                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        审计日志                                 │
│                  audit() → hash-chain                          │
└──────────────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼
                        ┌───────────────────┐
                        │    执行/拒绝      │
                        └───────────────────┘
```

### 2.3 模块依赖图

```
┌─────────────────────────────────────────────────────────────────┐
│                            index.ts                              │
│                      (主入口，统一导出)                           │
└─────────────────────────────────────────────────────────────────┘
           │              │              │              │
           ▼              ▼              ▼              ▼
┌─────────────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│     acap.ts     │ │ budget.ts │ │ spawn.ts  │ │ taint.ts  │
│   (能力系统)     │ │  (配额)   │ │  (派生)   │ │ (污染)    │
└────────┬────────┘ └─────┬─────┘ └─────┬─────┘ └───────────┘
         │                 │             │
         │                 │             └──────┐
         │                 │                    │
         ▼                 ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                          types.ts                            │
│                    (核心类型定义)                              │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │      vault.ts       │
              │    (凭证保险库)      │
              └─────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │     outcomes.ts     │
              │    (评分迭代)       │
              └─────────────────────┘
```

---

## 3. 核心概念模型

### 3.1 Agent (智能体)

```
┌─────────────────────────────────────────────────────────────┐
│                         Agent                                │
├─────────────────────────────────────────────────────────────┤
│  id: AgentId              // 唯一标识 (品牌类型)            │
│  parent: AgentId | null    // 父智能体                       │
│  purpose: string           // 用途描述                       │
│  budget: AgentBudget       // 资源配额                        │
│  namespace: NamespaceSpec  // 命名空间                        │
│  acaps: ACap[]            // 持有的能力令牌                  │
│  tracker: BudgetTracker    // 配额追踪器                      │
└─────────────────────────────────────────────────────────────┘
```

**生命周期**:
```
spawn() → 运行中 → [可派生子智能体] → [可移交任务]
              │
              └→ [资源耗尽/超时/完成] → 终止
```

### 3.2 ACap (能力令牌)

```
┌─────────────────────────────────────────────────────────────┐
│                         ACap                                │
├─────────────────────────────────────────────────────────────┤
│  id: string               // 令牌唯一标识                    │
│  subject: ACapSubject     // 能力主体                        │
│  scope: string[]          // 能力范围                        │
│  max_invocations: number  // 最大调用次数                    │
│  invocations: number      // 已使用次数                      │
│  granted_to: AgentId      // 授予对象                        │
│  granted_by: AgentId      // 授予者                          │
│  expires_at: string       // 过期时间 (ISO 8601)             │
│  signature: ManifestSignature  // 签名                        │
└─────────────────────────────────────────────────────────────┘
```

**验证流程**:
```
verify(acap, trust)
    │
    ├─ [1] 检查签名: HMAC-SHA256(Ed25519)
    │
    ├─ [2] 检查过期: now < expires_at
    │
    ├─ [3] 检查调用次数: invocations < max_invocations
    │
    ├─ [4] 检查撤销: !RevocationList.contains(id)
    │
    └─ [5] 检查信任: signer ∈ trust
```

### 3.3 Taint (污染标记)

```
┌─────────────────────────────────────────────────────────────┐
│                         Taint                               │
├─────────────────────────────────────────────────────────────┤
│  source: TaintSource    // 污染来源类型                      │
│  origin: string         // 具体来源 (URL/邮箱等)             │
│  introduced_at: string  // 引入时间                          │
└─────────────────────────────────────────────────────────────┘

TaintSource = 'fetched_url' | 'email' | 'user_input' 
            | 'untrusted_file' | 'agent_message'
```

**传播规则**:
```
输入 (taints: Taint[]) 
    +
工具引入 (introduces?: TaintSource)
    =
输出 (result.taints = union(inputs, [new Taint]))
```

### 3.4 Namespace (命名空间)

```
┌─────────────────────────────────────────────────────────────┐
│                    NamespaceSpec                             │
├─────────────────────────────────────────────────────────────┤
│  name: string           // 命名空间名称                      │
│  memory: string[]      // 可访问的记忆块                    │
│  tools: string[]       // 可调用的工具                      │
│  audit_namespace: string // 审计日志归属                     │
│  mounts: Mount[]       // 挂载的父命名空间                   │
└─────────────────────────────────────────────────────────────┘

Mount = { namespace: string, mode: 'read' | 'read-write' }
```

### 3.5 Budget (预算)

```
┌─────────────────────────────────────────────────────────────┐
│                      AgentBudget                            │
├─────────────────────────────────────────────────────────────┤
│  max_input_tokens: number    // 最大输入 token               │
│  max_output_tokens: number   // 最大输出 token               │
│  max_wall_clock_seconds: number // 最大运行时间             │
│  max_cost_usd: number       // 最大成本 (USD)               │
│  max_children: number       // 最大子智能体数                │
│  warn_at?: BudgetThresholds // 软警告阈值                  │
└─────────────────────────────────────────────────────────────┘

BudgetUsage = {
  input_tokens: number
  output_tokens: number
  wall_clock_seconds: number
  cost_usd: number
  children_spawned: number
}
```

---

## 4. 接口设计

### 4.1 核心 API

#### 4.1.1 spawn

```typescript
interface SpawnRequest {
  parent: AgentId | null
  purpose: string
  requested_capabilities: ACapRequest[]
  budget: AgentBudget
  namespace: NamespaceSpec
}

interface SpawnContext {
  registry: AgentRegistry
}

function spawn(request: SpawnRequest, ctx: SpawnContext): OSResult<RegisteredAgent>

// RegisteredAgent
interface RegisteredAgent {
  manifest: AgentManifest
  tracker: BudgetTracker
}
```

**前置条件**:
- parent ∈ registry OR parent === null
- budget ≤ parent.budget.remaining
- parent.children.count < parent.budget.max_children

**后置条件**:
- agent ∈ registry
- agent.parent = request.parent
- agent.tracker.budget = request.budget

#### 4.1.2 grant

```typescript
interface GrantOptions {
  granted_by: AgentId
  granted_to: AgentId
  expires_at: string
  signing_key: Buffer
}

function grant(request: ACapRequest, opts: GrantOptions): ACap
```

**前置条件**:
- request.subject ∈ known subjects
- opts.signing_key 属于 granted_by

**后置条件**:
- 返回的 ACap 可被 verify() 验证通过

#### 4.1.3 verify

```typescript
interface VerifyOptions {
  trust: ReadonlyMap<AgentId, Buffer>
  revocations?: RevocationList
  now?: Date
}

function verify(acap: ACap, opts: VerifyOptions): OSResult<true>
```

**验证逻辑** (伪代码):
```
if (now >= acap.expires_at) return error('capability_expired')
if (acap.invocations >= acap.max_invocations) return error('capability_exhausted')
if (revocations?.contains(acap.id)) return error('capability_denied')
if (!trust.has(acap.signature.signer)) return error('capability_denied')
if (!validSignature(acap, trust.get(signer))) return error('capability_denied')
return ok(true)
```

#### 4.1.4 downscope

```typescript
function downscope(
  source: ACap,
  request: Partial<ACapRequest> & { granted_to: AgentId; signing_key: Buffer }
): OSResult<ACap>
```

**约束验证**:
```
1. subject.kind == source.subject.kind
2. scope ⊆ source.scope
3. max_invocations ≤ min(source.max_invocations, source.max_invocations - source.invocations)
4. expires_at ≤ source.expires_at
```

#### 4.1.5 checkTaint

```typescript
interface TaintPolicy {
  blocks: ReadonlyMap<string, ReadonlySet<TaintSource>>
  untaint_allowlist: ReadonlySet<string>
}

function checkTaint(call: ToolCall, policy?: TaintPolicy): OSResult<true>
```

**检查逻辑**:
```
blocked = policy.blocks.get(call.tool)
if (blocked && call.taints.any(t => blocked.has(t.source))) {
  return error('taint_violation')
}
return ok(true)
```

#### 4.1.6 propagate

```typescript
function propagate(
  call: ToolCall,
  raw_value: unknown,
  introduces?: TaintSource
): ToolCallResult
```

**传播逻辑**:
```
result.taints = call.taints ∪ (introduces ? [new Taint(introduces)] : [])
```

#### 4.1.7 vault.inject

```typescript
class Vault {
  async inject(ref: CredentialRef, caller_acap: ACap): OSResult<Injection>
}
```

**注入逻辑**:
```
1. entry = vault.entries.get(ref)
2. if !entry return error('namespace_violation')
3. if !subjectsMatch(caller_acap.subject, entry.bound_to) 
     return error('capability_denied')
4. value = resolver(ref)
5. if !value return error('namespace_violation')
6. log(injection_attempt)
7. return materialize(entry.injection, value)
```

#### 4.1.8 withOutcome

```typescript
interface RubricEvaluator {
  evaluate(work: string, rubric: Rubric, iteration: number): Promise<RubricEvaluation>
}

async function withOutcome<T>(
  rubric: Rubric,
  attempt: (feedback: string | null, iteration: number) => Promise<T>,
  evaluator: RubricEvaluator,
  options: WithOutcomeOptions<T>
): Promise<OutcomeResult<T>>
```

**迭代逻辑**:
```
for i in 1..max_iterations:
  work = await attempt(feedback, i)
  evaluation = await evaluator.evaluate(work, rubric, i)
  
  if evaluation.verdict == 'satisfied' return result(satisfied)
  if evaluation.verdict == 'failed' return result(failed)
  
  feedback = evaluation.revision_guidance ?? synthesizeFeedback(evaluation)
  
return result(max_iterations_reached)
```

---

## 5. 类型系统

### 5.1 Result 类型

```typescript
// 判别联合类型替代异常
type OSResult<T> = 
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: OSError }

function ok<T>(value: T): OSResult<T>
function err(code: OSError['code'], message: string, details?: object): OSResult<never>
```

### 5.2 品牌类型

```typescript
// 防止 ID 混淆
type AgentId = string & { readonly __agent_id: unique symbol }
type CredentialRef = string & { readonly __cred_ref: unique symbol }
type CredentialValue = string & { readonly __cred_value: unique symbol }
```

### 5.3 判别联合

```typescript
// ACapSubject
type ACapSubject =
  | { readonly kind: 'tool'; readonly name: string }
  | { readonly kind: 'mcp_server'; readonly server: string }
  | { readonly kind: 'resource'; readonly uri: string }
  | { readonly kind: 'memory_block'; readonly block_id: string }
  | { readonly kind: 'audit_log'; readonly namespace: string }
  | { readonly kind: 'agent_handoff'; readonly target_pattern: string }

// InjectionShape
type InjectionShape =
  | { readonly kind: 'header'; readonly name: string; readonly prefix?: string }
  | { readonly kind: 'query_param'; readonly name: string }
  | { readonly kind: 'bearer_token' }
```

---

## 6. 安全性设计

### 6.1 威胁模型

| 威胁 | 场景 | 防御机制 |
|------|------|----------|
| Prompt 注入 | 恶意邮件/网页内容操控智能体 | chexec + taint |
| 越权操作 | 智能体尝试超出授权的操作 | acap + verify |
| 凭证窃取 | Prompt 注入读取凭证 | vault 隔离 |
| 权限提升 | 子智能体获取比父智能体更多权限 | downscope 约束 |
| 资源耗尽 | 智能体无限消耗资源 | BudgetTracker |
| 命名空间逃逸 | 智能体访问命名空间外资源 | ns 隔离 |

### 6.2 防御层次

```
Layer 1: 能力验证 (Capability Layer)
  grant() → acap → verify()
  防御: 越权操作、签名伪造

Layer 2: 污染追踪 (Taint Layer)  
  checkTaint() → propagate() → untaint()
  防御: Prompt 注入、数据泄露

Layer 3: 凭证保护 (Vault Layer)
  register() → inject() → archive()
  防御: 凭证窃取、上下文泄露

Layer 4: 资源配额 (Budget Layer)
  canCharge() → charge() → canSpawn()
  防御: 资源耗尽、成本超支

Layer 5: 命名空间隔离 (Namespace Layer)
  mounts, memory[], tools[]
  防御: 命名空间逃逸 (v0.3)
```

### 6.3 签名演进

```
v0.1: HMAC-SHA256
  - 对称密钥
  - 同进程内验证
  - 与 kbot-finance 一致性

v0.2: Ed25519 (计划)
  - 非对称密钥
  - 离线签名
  - 公钥可公开
```

---

## 7. 性能设计

### 7.1 关键路径

| 操作 | 目标延迟 | 实现要点 |
|------|----------|----------|
| verify() | < 1ms | 内存查找 + 常数时间签名验证 |
| canCharge() | < 0.1ms | 纯数值比较 |
| checkTaint() | < 0.5ms | Map 查找 + Set 交集 |
| spawn() | < 5ms | ID 生成 + Map 插入 |
| grant() | < 1ms | HMAC 计算 + 对象构造 |

### 7.2 内存模型

```
AgentRegistry
  └── Map<AgentId, RegisteredAgent>
        ├── manifest: AgentManifest (immutable)
        └── tracker: BudgetTracker (mutable)

每个 Agent:
  - ID: 20 bytes (10 bytes hex)
  - Manifest: ~500 bytes
  - Tracker: ~100 bytes
  - 预计内存: ~1KB per agent

支持规模: 单进程 10,000+ agents
```

---

## 8. 演进计划

### 8.1 版本路线图

```
v0.1 (2026-05)          v0.2 (2026-06)          v0.3 (2026-09)
    │                       │                       │
    ▼                       ▼                       ▼
┌───────────┐         ┌───────────┐         ┌───────────┐
│ 5 primitives │       │ 7 primitives │       │ 10 primitives│
├───────────┤         ├───────────┤         ├───────────┤
│ • spawn   │         │ + vault   │         │ + ns 强制 │  ← NEW
│ • acap    │         │ + outcomes│         │ + snapshot│  ← NEW
│ • budget  │         │           │         │ + audit ns│  ← NEW
│ • taint   │         │ HMAC→Ed25519│        │ Daemon 模式│
│ • handoff │         │           │         │           │
└───────────┘         └───────────┘         └───────────┘
```

### 8.2 架构演进

```
v0.1/v0.2: 单进程
┌─────────────────────────────────────┐
│          Agent Process              │
│  ┌─────────────────────────────┐   │
│  │      AgentRegistry (内存)     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

v0.3: 守护进程
┌─────────────────────────────────────┐
│         Kernel Daemon               │
│  ┌─────────────────────────────┐   │
│  │   AgentRegistry (持久化)     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
          ▲ IPC
          │
┌─────────┴─────────┐
│  Agent Process(es)  │
└───────────────────┘

v1.0: 分布式
┌─────────────────────────────────────┐
│      Distributed Registry            │
│  ┌─────────┐ ┌─────────┐          │
│  │ Node A  │ │ Node B  │ ...       │
│  └─────────┘ └─────────┘          │
└─────────────────────────────────────┘
```

---

## 附录: 实现检查清单

### 必须实现 (v0.1)

- [ ] types.ts: 所有核心类型定义
- [ ] acap.ts: grant/verify/downscope/RevocationList
- [ ] budget.ts: BudgetTracker
- [ ] spawn.ts: spawn/AgentRegistry
- [ ] taint.ts: checkTaint/propagate/untaint/DEFAULT_TAINT_POLICY
- [ ] 单元测试: > 80% 覆盖率

### 建议实现 (v0.2)

- [ ] vault.ts: Vault/inject
- [ ] outcomes.ts: withOutcome/RubricEvaluator
- [ ] Ed25519 签名支持
- [ ] daemon 模式架构设计

### 计划实现 (v0.3)

- [ ] 命名空间运行时强制
- [ ] 审计日志命名空间隔离
- [ ] 状态快照/恢复
- [ ] 分布式注册表
