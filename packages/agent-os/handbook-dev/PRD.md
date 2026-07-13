# Agent OS 产品需求文档 (PRD)

> 本文档定义 Agent OS 的产品愿景、功能需求和非功能需求，可作为独立重建本产品的完整需求依据。

**版本**: v0.2.0-alpha  
**日期**: 2026-07-13  
**状态**: 逆向分析版本

---

## 1. 产品概述

### 1.1 产品定位

**一句话描述**: "AI 智能体的 POSIX" — 为 AI 智能体提供操作系统级别的抽象层。

**核心价值**: 解决多智能体系统中的信任边界、资源管理、安全隔离和审计追溯问题。

### 1.2 市场背景

**问题**:
- 每个 AI 框架 (AutoGen, CrewAI, LangGraph) 重复发明权限、配额、审计机制
- 多智能体系统缺乏 kernel/userspace 边界
- EchoLeak (CVE-2025-32711) 等漏洞证明需要 OS 级别的防护

**机会**:
- 定义智能体运行时的行业标准
- 为企业提供可移植的智能体基础设施
- 满足监管合规需求 (EU AI Act, FCA)

### 1.3 目标用户

| 用户类型 | 需求 | 优先级 |
|----------|------|--------|
| Agent Framework 开发者 | 标准化智能体运行时接口 | P0 |
| 企业安全团队 | 智能体权限控制和审计 | P0 |
| 平台提供商 | 多租户智能体隔离 | P1 |
| 研究人员 | 可复现的智能体安全研究 | P1 |

---

## 2. 功能需求

### 2.1 原语清单 (10 个)

| ID | 原语名称 | 功能描述 | 优先级 |
|----|----------|----------|--------|
| P01 | spawn | 派生带声明身份的子智能体 | P0 |
| P02 | acap | 签名可撤销能力令牌 | P0 |
| P03 | ns | 键控命名空间隔离 | P1 |
| P04 | ulimit-tok | token/成本/时间/子进程配额 | P0 |
| P05 | chexec | 污染追踪执行 | P0 |
| P06 | audit | 内容寻址审计日志 | P1 |
| P07 | handoff | 降级能力移交 | P0 |
| P08 | snapshot | 内容寻址状态快照 | P2 |
| P09 | vault | 服务端凭证注入 | P1 |
| P10 | outcomes | rubric 评分自评迭代 | P2 |

### 2.2 详细功能需求

#### P01: spawn (智能体派生)

**功能描述**:
派生带声明身份的子智能体。父智能体显式授予能力，不存在隐式继承。

**用户故事**:
```
作为 Orchestrator Agent
我希望在执行子任务时派生专门的子智能体
以便隔离权限和控制资源消耗
```

**验收标准**:
- [ ] 可派生根智能体 (parent = null)
- [ ] 可派生子智能体并建立父子关系
- [ ] 子智能体预算必须 ≤ 父智能体剩余预算
- [ ] 父智能体 child count 超限则拒绝派生
- [ ] 返回智能体 manifest 包含唯一 ID

**边界条件**:
- parent 不存在 → 拒绝
- 子预算 > 父预算 → 拒绝
- 子数量达到上限 → 拒绝
- 并发派生 → 需事务保护

---

#### P02: acap (能力令牌)

**功能描述**:
签名可撤销的能力令牌。父智能体授予子智能体特定操作的有限权限。

**用户故事**:
```
作为 Parent Agent
我希望授予子智能体有限的能力
以便控制子智能体的操作范围
```

**验收标准**:
- [ ] 可授予指定 subject + scope 的能力令牌
- [ ] 令牌包含 HMAC/Ed25519 签名
- [ ] 可验证令牌签名有效性
- [ ] 可检查令牌是否过期
- [ ] 可检查令牌调用次数是否耗尽
- [ ] 可撤销令牌 (RevocationList)
- [ ] 可降级移交令牌 (downscope)

**ACapSubject 类型**:
```typescript
type ACapSubject =
  | { kind: 'tool', name: string }
  | { kind: 'mcp_server', server: string }
  | { kind: 'resource', uri: string }
  | { kind: 'memory_block', block_id: string }
  | { kind: 'audit_log', namespace: string }
  | { kind: 'agent_handoff', target_pattern: string }
```

---

#### P03: ns (命名空间)

**功能描述**:
键控命名空间隔离。智能体只能访问其命名空间内的内存、工具和审计日志。

**用户故事**:
```
作为平台管理员
我希望智能体之间相互隔离
以便防止数据泄露和越权访问
```

**验收标准**:
- [ ] 每个智能体关联唯一命名空间
- [ ] 可定义命名空间内的内存块白名单
- [ ] 可定义命名空间内的工具白名单
- [ ] 可定义命名空间内的审计日志归属
- [ ] 可挂载父命名空间 (只读/读写)

**NamespaceSpec 结构**:
```typescript
interface NamespaceSpec {
  name: string              // 命名空间唯一标识
  memory: string[]         // 可访问的记忆块
  tools: string[]          // 可调用的工具白名单
  audit_namespace: string  // 审计日志归属
  mounts: {                // 挂载的父命名空间
    namespace: string
    mode: 'read' | 'read-write'
  }[]
}
```

---

#### P04: ulimit-tok (资源配额)

**功能描述**:
per-agent token/成本/时间/子进程配额。硬限制触发终止，软警告提前通知。

**用户故事**:
```
作为平台管理员
我希望为每个智能体设置资源上限
以便防止资源耗尽和成本超支
```

**验收标准**:
- [ ] 可设置 max_input_tokens
- [ ] 可设置 max_output_tokens
- [ ] 可设置 max_wall_clock_seconds
- [ ] 可设置 max_cost_usd
- [ ] 可设置 max_children
- [ ] 可设置软警告阈值 (warn_at)
- [ ] 操作前预检查 (canCharge)
- [ ] 操作后扣费 (charge)
- [ ] 超限返回 budget_exceeded 错误

**AgentBudget 结构**:
```typescript
interface AgentBudget {
  max_input_tokens: number
  max_output_tokens: number
  max_wall_clock_seconds: number
  max_cost_usd: number
  max_children: number
  warn_at?: {
    tokens?: number      // 0.0-1.0
    wall_clock?: number
    cost?: number
  }
}
```

---

#### P05: chexec (污染追踪执行)

**功能描述**:
信任通道执行 + 污染追踪。未信任数据 (邮件/网页/文件) 不能流向高权限操作。

**用户故事**:
```
作为安全系统
我希望在智能体执行操作前检查数据来源
以便阻止 prompt 注入攻击
```

**验收标准**:
- [ ] 每次工具调用携带调用者 ID 和能力令牌 ID
- [ ] 每次工具调用携带输入数据的污染标记
- [ ] 高权限工具拒绝污染输入 (checkTaint)
- [ ] 工具输出继承输入污染 (propagate)
- [ ] 可配置封锁规则 (TaintPolicy)
- [ ] 高信任工具可执行解污染 (untaint)

**污染源枚举**:
```typescript
type TaintSource = 
  | 'fetched_url'   // 网页内容
  | 'email'         // 邮件
  | 'user_input'    // 用户输入
  | 'untrusted_file' // 不可信文件
  | 'agent_message' // 其他智能体消息
```

**默认封锁规则**:
| 工具 | 封锁的污染源 |
|------|-------------|
| email_send | fetched_url, email, agent_message, untrusted_file |
| http_post | fetched_url, email, agent_message, untrusted_file |
| file_write | fetched_url, email, agent_message |
| shell_exec | fetched_url, email, user_input, agent_message, untrusted_file |
| mcp_send | fetched_url, email, agent_message, untrusted_file |

---

#### P06: audit (审计日志)

**功能描述**:
Append-only, 内容寻址事件日志。每个命名空间独立审计日志。

**用户故事**:
```
作为审计人员
我希望在事后重建智能体的完整操作轨迹
以便进行合规审查和事故调查
```

**验收标准**:
- [ ] 每次操作写入审计日志
- [ ] 日志条目不可删除或修改
- [ ] 日志内容可寻址 (CID)
- [ ] 支持命名空间隔离查看
- [ ] 记录操作类型、时间、结果

**注**: 本版本依赖 kbot-finance 的 hash-chain log，后续版本独立实现。

---

#### P07: handoff (能力移交)

**功能描述**:
任务移交时显式降级能力范围。接收方能力必须是发送方的严格子集。

**用户故事**:
```
作为 Orchestrator
我希望在智能体之间移交任务时
确保接收方不会获得比发送方更多的权限
```

**验收标准**:
- [ ] 可将能力移交给另一个智能体
- [ ] 移交后能力必须被降级 (downscope)
- [ ] 禁止扩大 scope
- [ ] 禁止增加 max_invocations
- [ ] 禁止提前 expires_at
- [ ] 禁止变更 subject kind
- [ ] 违反任一约束返回 handoff_escalation_denied

**downscope 形式化约束**:
```
downscope(s, r) 允许 iff:
  subject(s) == subject(r)
  scope(r) ⊆ scope(s)
  max_invocations(r) ≤ min(max_invocations(s), remaining(s))
  expires_at(r) ≤ expires_at(s)
```

---

#### P08: snapshot (状态快照)

**功能描述**:
内容寻址的智能体状态冻结。相同状态产生相同 CID。

**用户故事**:
```
作为实验管理员
我希望在某个时间点保存智能体状态
以便后续分叉或回滚
```

**验收标准**:
- [ ] 可对任意智能体创建快照
- [ ] 快照包含 manifest、acaps、usage、pending_calls
- [ ] 快照 CID 由状态内容哈希生成
- [ ] 可通过 CID 恢复状态 (后续版本)

**状态**: v0.3 实现

---

#### P09: vault (凭证保险库)

**功能描述**:
服务端凭证注入。凭证不进入智能体上下文，防止 prompt 注入窃取。

**用户故事**:
```
作为安全团队
我希望在智能体调用外部 API 时注入凭证
但凭证不会暴露给智能体本身
```

**验收标准**:
- [ ] 可注册凭证引用 (不存实际值)
- [ ] 可绑定凭证到特定能力主体
- [ ] 调用时验证能力令牌绑定
- [ ] 凭证值由外部 resolver 提供
- [ ] 支持 header/query_param/bearer_token 注入
- [ ] 审计日志不包含凭证值
- [ ] 支持凭证归档

**VaultEntry 结构**:
```typescript
interface VaultEntry {
  ref: CredentialRef                    // 引用名称
  bound_to: ACapSubject                 // 绑定到哪个能力
  injection: InjectionShape             // 注入方式
  description?: string                  // 描述 (不包含凭证值)
}

type InjectionShape =
  | { kind: 'header', name: string, prefix?: string }
  | { kind: 'query_param', name: string }
  | { kind: 'bearer_token' }
```

---

#### P10: outcomes (评分迭代)

**功能描述**:
Rubric 评分的自评迭代循环。评估器判断工作产品质量，不满足则自动修订。

**用户故事**:
```
作为质量控制系统
我希望智能体在提交结果前进行自我评估
以便提高输出质量
```

**验收标准**:
- [ ] 可定义 rubric (criteria + weights)
- [ ] 可自定义 evaluator (LLM/规则/混合)
- [ ] 迭代循环: attempt → evaluate → revise
- [ ] 支持 max_iterations 上限
- [ ] 支持 AbortSignal 中断
- [ ] 返回结果包含历史迭代记录

**ResultCode**:
```typescript
type OutcomeResultCode = 
  | 'satisfied'           // 评估通过
  | 'needs_revision'     // 需要修订
  | 'max_iterations_reached' // 达到上限
  | 'failed'             // 评估器失败
  | 'interrupted'        // 被中断
```

**状态**: v0.2 实现

---

## 3. 非功能需求

### 3.1 性能需求

| 指标 | 要求 | 说明 |
|------|------|------|
| 能力验证延迟 | < 1ms | verify() 单次调用 |
| 派生延迟 | < 5ms | spawn() 包含 ID 生成 |
| 预算检查延迟 | < 0.1ms | canCharge() 纯内存操作 |
| 吞吐量 | > 10,000 ops/s | 单进程基准测试 |

### 3.2 可用性需求

| 指标 | 要求 |
|------|------|
| 正常运行时间 | 99.9% (v1.0) |
| 错误恢复 | 进程重启后状态可恢复 |
| 降级策略 | 核心功能 (spawn/acap) 优先可用 |

### 3.3 安全性需求

| 需求 | 说明 |
|------|------|
| 签名不可伪造 | HMAC/Ed25519 签名验证 |
| 凭证隔离 | 凭证值不进入智能体上下文 |
| 污染不可绕过 | 高权限工具强制检查 |
| 审计不可篡改 | Append-only + hash-chain |

### 3.4 可移植性需求

| 需求 | 说明 |
|------|------|
| Node.js 22+ | 核心运行时 |
| 零外部依赖 | 纯内置 API |
| ESM 模块 | 现代模块系统 |
| TypeScript | 类型安全 |

### 3.5 可维护性需求

| 需求 | 说明 |
|------|------|
| 单元测试覆盖 | > 80% (行覆盖率) |
| 文档完整 | 每个原语有使用示例 |
| 错误码明确 | 10 种错误码，语义清晰 |

---

## 4. 用户旅程

### 4.1 典型场景: 安全多智能体查询

```
1. 用户请求: "帮我查询 A 公司的 SEC 文件"
           │
2. Orchestrator (root agent) 接收请求
           │
3. Orchestrator 派生 Fetcher 子智能体
           │ spawn({ parent: orchestrator, budget: small })
           │
4. Orchestrator 授予 Fetcher http_get 能力 (3次调用)
           │ grant({ subject: http_get, max_invocations: 3 })
           │
5. Fetcher 获取 SEC 网页内容
           │ chexec(http_get, url)
           │ ↓
           │ checkTaint() ← 通过 (无污染)
           │ charge() ← 扣减配额
           │ audit() ← 记录操作
           │
6. SEC 内容被标记为 fetched_url 污染
           │ propagate(result, introduces: 'fetched_url')
           │
7. Fetcher 尝试发送邮件 → 被拒绝
           │ checkTaint(email_send, [fetched_url])
           │ ↓
           │ { ok: false, code: 'taint_violation' }
           │
8. Fetcher 返回内容给 Orchestrator
           │ handoff(content, acaps: [])
           │ ↓
           │ downscope(acaps) ← 降级为空
           │
9. Orchestrator 评估结果
           │ withOutcome(rubric, attempt)
           │ ↓
           │ satisfied ← 返回给用户
```

---

## 5. 错误处理

### 5.1 错误码清单

| 错误码 | 语义 | 触发场景 |
|--------|------|----------|
| capability_denied | 能力不足 | 签名无效/不在信任集合 |
| capability_expired | 能力过期 | 超出 expires_at |
| capability_exhausted | 能力耗尽 | 超出 max_invocations |
| budget_exceeded | 预算超限 | 超出 token/成本/时间/子进程限制 |
| namespace_violation | 命名空间违规 | 越界访问/凭证不存在 |
| taint_violation | 污染违规 | 污染数据流向高权限工具 |
| handoff_escalation_denied | 移交升级拒绝 | 降级约束被违反 |
| manifest_invalid | Manifest 无效 | 格式错误/重复 ID |
| snapshot_not_found | 快照未找到 | CID 不存在 |
| parent_not_found | 父智能体未找到 | parent ID 不在注册表 |

### 5.2 错误响应格式

```typescript
interface OSError {
  code: OSErrorCode
  message: string
  details?: Record<string, unknown>
}
```

---

## 6. 成功指标

### 6.1 产品指标

| 指标 | 目标 | 测量方式 |
|------|------|----------|
| npm 下载量 | > 1,000/月 (v1.0) | npm stats |
| GitHub Stars | > 100 | GitHub API |
| 集成项目数 | > 10 | GitHub 搜索 |
| 文档完整性 | 100% | 覆盖率检查 |

### 6.2 技术指标

| 指标 | 目标 | 测量方式 |
|------|------|----------|
| 测试覆盖率 | > 80% | Istanbul/coverage |
| 类型检查 | 0 errors | tsc --noEmit |
| 构建时间 | < 10s | time npm run build |
| 包大小 | < 50KB (gzipped) | gzip size |

---

## 附录: 竞品对比

| 功能 | agent-os | Claude Managed Agents | LangGraph |
|------|----------|---------------------|-----------|
| 能力令牌 | ✅ acap 可委托 | ❌ agent 级 | ❌ 无 |
| 命名空间隔离 | ✅ | ❌ 共享文件系统 | ❌ 无 |
| 资源配额 | ✅ | ❌ 仅 iteration | ⚠️ 基础 |
| 污染追踪 | ✅ | ❌ 无 | ❌ 无 |
| 凭证保险库 | ✅ | ✅ | ❌ 无 |
| 评分迭代 | ✅ | ✅ | ❌ 无 |
| 可移植性 | ✅ 开放规范 | ❌ Anthropic 绑定 | ⚠️ LangChain 绑定 |
