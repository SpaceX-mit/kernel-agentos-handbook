# agent-os 技术深度分析

> **文档版本**: v1.0  
> **分析日期**: 2026-07-13  
> **代码版本**: v0.2.0-alpha.0  

---

## 1. 代码结构分析

### 1.1 文件清单

```
packages/agent-os/src/
├── index.ts      (33 lines)   - 导出入口
├── types.ts      (234 lines)  - 核心类型定义
├── acap.ts       (227 lines)  - 能力令牌
├── budget.ts     (125 lines)   - 资源配额
├── spawn.ts      (128 lines)   - Agent 派生
├── taint.ts      (114 lines)   - 污染追踪
├── vault.ts      (225 lines)   - 凭证保险库
└── outcomes.ts   (264 lines)   - 评分自评

总计: 1,350 行 TypeScript
```

### 1.2 模块依赖图

```
                    ┌─────────────┐
                    │  index.ts   │
                    │  (导出入口) │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌─────────────┐  ┌─────────────┐
│   types.ts    │  │  spawn.ts   │  │   acap.ts   │
│  (核心类型)   │  │  (派生)      │  │  (令牌)     │
└───────┬───────┘  └──────┬──────┘  └──────┬──────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │ uses
                           ▼
                    ┌─────────────┐
                    │ budget.ts   │
                    │  (配额)      │
                    └─────────────┘
                           ▲
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌─────────────┐  ┌─────────────┐
│   taint.ts    │  │   vault.ts  │  │ outcomes.ts │
│  (污染追踪)   │  │  (保险库)    │  │  (评分)     │
└───────────────┘  └─────────────┘  └─────────────┘
```

### 1.3 核心类型系统

**OSResult<T> — 判别联合类型**

```typescript
// 成功分支
type Ok<T> = { readonly ok: true; readonly value: T }

// 失败分支
type Err = {
  readonly ok: false
  readonly error: {
    readonly code: ErrorCode
    readonly message: string
    readonly details?: Record<string, unknown>
  }
}

type OSResult<T> = Ok<T> | Err
```

**设计优势**:
1. **类型安全**: TypeScript 在编译时强制检查
2. **穷尽检查**: switch/if 必须处理所有情况
3. **错误传播**: `?.` 操作符简化错误链

---

## 2. 核心算法分析

### 2.1 acap — HMAC-SHA256 签名

**grant() 签名流程**:

```
输入: ACapRequest + GrantOptions
        │
        ▼
┌─────────────────────────┐
│ 1. 生成随机 ID           │
│    id = randomBytes(16) │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 2. 构建 ACap 对象        │
│    (不含 signature)      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ 3. HMAC-SHA256 签名     │
│    signature =          │
│    HMAC(id + fields,    │
│         signing_key)    │
└───────────┬─────────────┘
            │
            ▼
         ACap
```

**verify() 验证流程**:

```
输入: ACap + VerifyContext
        │
        ▼
┌─────────────────────────┐
│ 1. 检查过期              │
│    expires_at > now ?   │
└───────────┬─────────────┘
            │ yes
            ▼
┌─────────────────────────┐
│ 2. 检查调用次数           │
│    invocations < max ?  │
└───────────┬─────────────┘
            │ yes
            ▼
┌─────────────────────────┐
│ 3. 检查撤销              │
│    RevocationList ?     │
└───────────┬─────────────┘
            │ no
            ▼
┌─────────────────────────┐
│ 4. 校验 HMAC 签名       │
│    timingSafeEqual ?    │
└───────────┬─────────────┘
            │ yes
            ▼
┌─────────────────────────┐
│ 5. 检查签名者信任        │
│    trust.has(signer) ?  │
└───────────┬─────────────┘
            │ yes
            ▼
         OK
```

**安全性分析**:

| 方面 | 实现 | 评估 |
|------|------|------|
| 签名算法 | HMAC-SHA256 | 中等安全，够用 |
| 密钥长度 | 256-bit | 足够 |
| 时序攻击 | timingSafeEqual | ✅ 防止侧信道 |
| 重放攻击 | invocations 计数 | ✅ 防止 |
| 撤销 | RevocationList | ✅ 支持 |

### 2.2 downscope() — 权限缩小算法

**核心约束**:

```typescript
// 伪代码
function downscope(source: ACap, opts: DownscopeOptions): OSResult<ACap> {
  // 1. scope 必须是 source.scope 的子集
  if (!isSubset(opts.scope, source.scope)) {
    return err('handoff_escalation_denied')
  }
  
  // 2. max_invocations 不能超过 source 剩余次数
  const remaining = source.max_invocations - source.invocations
  if (opts.max_invocations > remaining) {
    return err('budget_exceeded')
  }
  
  // 3. expires_at 不能晚于 source
  if (opts.expires_at > source.expires_at) {
    return err('capability_expired')
  }
  
  // 4. 签名新令牌
  return grant({...opts}, { signing_key: opts.signing_key })
}
```

**权限边界验证**:

```
Agent A (父)
├── acap: { scope: [read, write], max_invocations: 10 }
│
├── downscope → Agent B
│   ├── scope: [read]           ✓ 子集
│   ├── max_invocations: 5     ✓ <= 10
│   └── expires_at: T+1h        ✓ <= T+2h
│
└── downscope → Agent C
    ├── scope: [read, write, delete]  ✗ 不在 source.scope
    └── → err('handoff_escalation_denied')
```

### 2.3 BudgetTracker — 配额追踪

**双阶段检查**:

```typescript
// 阶段 1: 预检 (canCharge)
// 不修改状态，仅检查
canCharge(input, output, cost): OSResult<true> {
  if (projected_in > budget.max_input_tokens) return err()
  if (projected_out > budget.max_output_tokens) return err()
  if (projected_cost > budget.max_cost_usd) return err()
  if (elapsed > budget.max_wall_clock_seconds) return err()
  return ok(true)
}

// 阶段 2: 扣费 (charge)
// 实际修改状态
charge(input, output, cost): OSResult<BudgetWarning | null> {
  const check = canCharge(input, output, cost)
  if (!check.ok) return check  // 提前返回，不扣费
  
  usage.input_tokens += input
  usage.output_tokens += output
  usage.cost_usd += cost
  
  return ok(computeWarning())  // 可能返回软警告
}
```

**优势**:
1. **原子操作**: 预检+扣费分离，避免竞态
2. **软硬分离**: warn_at 阈值触发警告，不中断
3. **轻量**: 仅追踪数字，无复杂状态

### 2.4 chexec — 污染追踪

**污染图传播**:

```
输入数据流:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ fetched_url │───▶│  http_get   │───▶│  HTML解析   │
│ (tainted)   │    │ (propagate) │    │ (inherited) │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
                   ┌─────────────┐    ┌─────────────┐
                   │ email_send  │◀───│ 污染合并    │
                   │ (BLOCKED)   │    │ taints[]    │
                   └─────────────┘    └─────────────┘
```

**DEFAULT_TAINT_POLICY 规则**:

```typescript
// 阻止矩阵: tool × taint_source
blocks: Map<tool, Set<taint_source>>

email_send    ← [fetched_url, email, agent_message, untrusted_file]
http_post     ← [fetched_url, email, agent_message, untrusted_file]
file_write    ← [fetched_url, email, agent_message]
shell_exec    ← [fetched_url, email, user_input, agent_message, untrusted_file]
mcp_send      ← [fetched_url, email, agent_message, untrusted_file]
```

**执行流程**:

```
ToolCall 请求
      │
      ▼
checkTaint(call, policy)
      │
      ├─── 污染命中 ──→ err('taint_violation')
      │
      └─── 无污染 ──→ 执行业务逻辑
                          │
                          ▼
                    propagate(result, introduces?)
                          │
                          ▼
                    ToolCallResult (含 taints)
```

---

## 3. Vault 凭证保险库

### 3.1 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                        Agent Process                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Agent 调用: vault.inject('factset_api', acap)      │   │
│  └──────────────────────┬────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────┘
                           │ 请求: ref + acap
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        Vault (服务端)                       │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │  Entries    │    │  Resolver   │    │  Injection  │   │
│  │  Map<ref,   │───▶│  接口       │───▶│  Materialize│   │
│  │   entry>    │    │             │    │             │   │
│  └─────────────┘    └──────┬──────┘    └──────┬──────┘   │
│                             │                  │           │
│                             ▼                  ▼           │
│                      ┌─────────────┐    ┌─────────────┐   │
│                      │  in-memory  │    │  header /   │   │
│                      │  (开发用)   │    │  query /    │   │
│                      └─────────────┘    │  bearer     │   │
│                                         └─────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │ 注入后的请求
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     External Service                        │
│                    (FactSet API, etc.)                     │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 注入形状

```typescript
// 三种注入方式
type InjectionShape =
  | { kind: 'header', name: string, prefix?: string }
  | { kind: 'query_param', name: string }
  | { kind: 'bearer_token' }

// 示例
{ kind: 'header', name: 'X-API-Key', prefix: 'sk-' }
// → header: { name: 'X-API-Key', value: 'sk-xxx' }

{ kind: 'bearer_token' }
// → header: { name: 'Authorization', value: 'Bearer xxx' }

{ kind: 'query_param', name: 'api_key' }
// → query: { name: 'api_key', value: 'xxx' }
```

### 3.3 安全特性

| 特性 | 实现 | 效果 |
|------|------|------|
| 密钥不出 Agent | 注入在 kernel 层 | Agent 无法读取 |
| acap 绑定 | bound_to 字段 | 凭证只能被授权 Agent 使用 |
| 审计日志 | InjectionLog | 记录所有注入操作 |
| 可插拔 resolver | 接口设计 | 支持硬件安全模块 |

---

## 4. Outcomes 评分自评

### 4.1 迭代循环

```typescript
async function withOutcome<T>(
  attempt: (feedback?: string) => Promise<T>,
  options: WithOutcomeOptions<T>,
  rubric: Rubric,
  evaluator: RubricEvaluator
): Promise<OutcomeResult<T>> {
  
  const history: OutcomeIteration<T>[] = []
  
  for (let i = 0; i < options.max_iterations; i++) {
    // 1. 尝试
    const work = await attempt(
      history.length > 0 
        ? history[history.length - 1].evaluation.revision_guidance 
        : undefined
    )
    
    // 2. 评估
    const serialized = options.serialize?.(work) ?? JSON.stringify(work)
    const evaluation = await evaluator.evaluate(serialized, rubric, i)
    
    // 3. 记录
    history.push({ iteration: i, work, work_serialized: serialized, evaluation })
    
    // 4. 判断
    if (evaluation.verdict === 'satisfied') {
      return { code: 'satisfied', iterations_used: i + 1, final_work: work, ... }
    }
  }
  
  return { code: 'max_iterations_reached', ... }
}
```

### 4.2 评估器接口

```typescript
interface RubricEvaluator {
  evaluate(
    work_product: string,  // 序列化的工作成果
    rubric: Rubric,        // 评分规则
    iteration: number     // 当前迭代
  ): Promise<RubricEvaluation>
}

// 内置简单评估器
function predicateEvaluator(
  predicate: (work: string) => boolean,
  rubric: Rubric,
  feedback_when_failing: string
): RubricEvaluator {
  return {
    async evaluate(work, rubric, iteration) {
      const passing = predicate(work)
      return {
        per_criterion: rubric.criteria.map(c => ({
          name: c.name,
          score: passing ? 1.0 : 0.0,
          feedback: passing ? 'pass' : feedback_when_failing
        })),
        overall_score: passing ? 1.0 : 0.0,
        verdict: passing ? 'satisfied' : 'needs_revision'
      }
    }
  }
}
```

---

## 5. 性能分析

### 5.1 时间复杂度

| 操作 | 复杂度 | 说明 |
|------|--------|------|
| spawn() | O(1) | 仅注册 |
| grant() | O(1) | HMAC 签名 |
| verify() | O(1) | 常数次哈希比较 |
| downscope() | O(1) | 子集检查 + 签名 |
| canCharge() | O(1) | 数值比较 |
| checkTaint() | O(n) | n = taints.length |
| Vault.inject() | O(1) | Map 查找 |

### 5.2 空间复杂度

| 组件 | 空间 | 限制 |
|------|------|------|
| AgentRegistry | O(n) | n = Agent 数量 |
| RevocationList | O(m) | m = 撤销令牌数 |
| BudgetTracker | O(1) | 固定字段数 |
| Vault.entries | O(k) | k = 凭证数 |
| Vault.logs | O(l) | l = 日志条数 (可配置) |

### 5.3 瓶颈分析

| 瓶颈 | 影响 | 优化方案 |
|------|------|----------|
| HMAC 签名 | 每操作一次 | Ed25519 (v0.3) 更快 |
| Map 查找 | 大量 Agent 时 | 守护进程 + 缓存 |
| JSON 序列化 | outcomes | 可选，用户提供 |

---

## 6. 安全性分析

### 6.1 威胁模型

```
┌─────────────────────────────────────────────────────────────┐
│                      威胁模型                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  攻击者                                                      │
│     │                                                       │
│     ├── 恶意 Agent                                          │
│     ├── Prompt 注入                                         │
│     ├── 凭证窃取                                            │
│     └── 权限提升                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    agent-os 防御                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  恶意 Agent                                                  │
│     │                                                       │
│     ├── ulimit-tok → 资源耗尽                              │
│     ├── ns → 内存隔离                                       │
│     └── audit → 操作追溯                                    │
│                                                             │
│  Prompt 注入                                                 │
│     ├── chexec → 污染追踪                                   │
│     └── taint policy → 结构性阻止                           │
│                                                             │
│  凭证窃取                                                   │
│     ├── vault → 服务端注入                                  │
│     └── acap binding → 仅授权使用                           │
│                                                             │
│  权限提升                                                   │
│     ├── downscope → 子集验证                                │
│     └── handoff_escalation_denied → 拒绝                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 安全矩阵

| 威胁 | 防御机制 | 强度 |
|------|----------|------|
| EchoLeak (CVE-2025-32711) | chexec + taint | ✅ 强 |
| Confused Deputy | downscope | ✅ 强 |
| 凭证泄露 | vault | ✅ 强 |
| 资源耗尽 | ulimit-tok | ✅ 强 |
| 命名空间逃逸 | ns (v0.3) | ◐ 中 |
| 签名伪造 | HMAC-SHA256 | ◐ 中 (Ed25519 更好) |
| 重放攻击 | invocations 计数 | ✅ 强 |

---

## 7. 与竞品对比

### 7.1 能力对比

| 能力 | agent-os | Claude MA | LangChain | AutoGen |
|------|----------|-----------|-----------|---------|
| spawn | ✅ | ✅ | ✅ | ✅ |
| 能力令牌 | ✅ acap | ✅ | ❌ | ❌ |
| 命名空间 | ◐ v0.3 | ❌ | ❌ | ❌ |
| 资源配额 | ✅ | ✅ | ◐ | ◐ |
| 污染追踪 | ✅ | ❌ | ❌ | ❌ |
| 凭证保险库 | ✅ | ✅ | ❌ | ❌ |
| 评分自评 | ✅ | ✅ | ❌ | ❌ |
| 审计日志 | ◐ v0.3 | ✅ | ❌ | ❌ |
| 快照 | ❌ v0.3 | ❌ | ❌ | ❌ |

### 7.2 差异化优势

```
agent-os 的独特价值:
─────────────────────
1. 污染追踪 — 唯一实现 prompt 注入结构性防御
2. acap 令牌 — 跨 Agent 可传递，权限链完整
3. vault — 服务端凭证注入，Agent 看不到密钥
4. downscope — 权限只能缩小，无法提升
5. 零依赖 — 供应链安全
```

---

## 8. 工程实践

### 8.1 代码风格

| 方面 | 实践 | 示例 |
|------|------|------|
| 错误处理 | 判别联合 | `OSResult<T>` |
| 不可变性 | readonly | `ReadonlyMap`, `ReadonlyArray` |
| 文档 | JSDoc | 每个导出函数 |
| 类型 | Branded types | `CredentialRef`, `AgentId` |
| 测试 | Happy + Sad path | 成功/失败路径覆盖 |

### 8.2 测试策略

| 模块 | 测试数 | 覆盖率 |
|------|--------|--------|
| acap | 11 | ~70% |
| spawn | 5 | ~60% |
| taint | 10 | ~75% |
| vault | 9 | ~65% |
| outcomes | 11 | ~60% |
| **总计** | **46** | **~70%** |

### 8.3 零依赖策略

```
优势:
├── 供应链安全 — 无第三方依赖
├── 安装快 — npm install 秒级
├── 维护简单 — 无依赖图
└── 兼容性好 — 纯 Node API

劣势:
├── 需要自己实现
├── 缺少高级功能
└── 可能与 Node 版本耦合
```

---

## 9. 局限性与改进建议

### 9.1 当前局限

| 局限 | 影响 | 改进方向 |
|------|------|----------|
| 进程内运行 | 无法跨进程共享 | 守护进程模式 |
| HMAC-SHA256 | 非对称场景受限 | Ed25519 |
| 无持久化 | 状态重启丢失 | 外置存储 |
| 无分布式 | 单机限制 | etcd/Raft |
| Node only | 其他语言无法用 | 移植或 wasm |

### 9.2 改进建议

```typescript
// 1. Ed25519 签名 (v0.3)
interface SignOptions {
  privateKey: Uint8Array  // 32-byte private key
  // Ed25519 签名更快，支持离线验证
}

// 2. 守护进程接口 (v0.3)
interface KernelDaemon {
  spawn(request: SpawnRequest): Promise<AgentHandle>
  verify(cap: ACap): Promise<OSResult<true>>
  // 跨进程共享状态
}

// 3. 持久化存储 (v1.0)
interface AgentStore {
  save(agent: AgentManifest): Promise<void>
  load(id: AgentId): Promise<AgentManifest | null>
  // 可选: SQLite, PostgreSQL, etcd
}
```

---

## 10. 总结

### 10.1 技术亮点

| 亮点 | 说明 |
|------|------|
| **判别联合错误** | 类型安全的错误处理，比异常更可靠 |
| **污染追踪** | 唯一实现 prompt 注入结构性防御 |
| **零依赖** | 供应链安全，安装极快 |
| **POSIX 类比** | 概念清晰，易于理解 |
| **模块化设计** | 可独立使用各组件 |

### 10.2 核心价值

```
agent-os = 权限系统 + 配额系统 + 安全系统 + 审计系统

它解决的不是"能不能"，而是"允许多少"。
```

### 10.3 适用场景

| 场景 | 推荐度 |
|------|--------|
| 多 Agent 协作系统 | ⭐⭐⭐⭐⭐ |
| 高安全要求自动化 | ⭐⭐⭐⭐⭐ |
| 企业级 Agent 部署 | ⭐⭐⭐⭐ |
| 研究实验环境 | ⭐⭐⭐⭐ |
| 简单单 Agent 工具 | ⭐ (过度设计) |

---

## 附录

### A. 文档索引

| 文档 | 说明 |
|------|------|
| [00-overview.md](./00-overview.md) | 总览 |
| [01-tech-stack.md](./01-tech-stack.md) | 技术栈 |
| [02-architecture.md](./02-architecture.md) | 架构设计 |
| [03-security.md](./03-security.md) | 安全模型 |
| [04-testing.md](./04-testing.md) | 测试策略 |
| [05-open-source.md](./05-open-source.md) | 开源策略 |
| [06-evolution.md](./06-evolution.md) | 演进路径 |
| [07-context.md](./07-context.md) | 上下文关系 |
| [08-summary.md](./08-summary.md) | 总结 |
| [PRD.md](./PRD.md) | 产品需求文档 |
| **TECH-ANALYSIS.md** | 本文档 |
