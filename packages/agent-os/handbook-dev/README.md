# Agent OS 重建开发指南

> 本目录包含重建 Agent OS 所需的完整开发文档，从产品需求到详细实现。

---

## 文档索引

| 文档 | 用途 | 受众 |
|------|------|------|
| [README.md](./README.md) | 总览与索引 | 所有读者 |
| [PRD.md](./PRD.md) | 产品需求文档 | 产品经理、架构师 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 架构设计文档 | 架构师、开发者 |
| [DETAIL-DESIGN.md](./DETAIL-DESIGN.md) | 详细设计文档 | 开发者 |
| [QUICKSTART.md](./QUICKSTART.md) | 快速开始指南 | 开发者 |

---

## 文档关系

```
PRD.md (产品需求)
    │
    └── 定义 WHAT (要做什么)
            │
            ▼
ARCHITECTURE.md (架构设计)
    │
    └── 定义 HOW (如何组织)
            │
            ▼
DETAIL-DESIGN.md (详细设计)
    │
    └── 定义 IMPLEMENTATION (具体实现)
            │
            ▼
QUICKSTART.md (快速开始)
    │
    └── 定义 TRY (尝试运行)
```

---

## 核心文件

### 产品需求 (PRD.md)

- 10 个原语定义
- 用户故事与验收标准
- 非功能需求 (性能、安全、可移植性)
- 错误码清单
- 竞品对比

### 架构设计 (ARCHITECTURE.md)

- 系统层级视图
- 数据流设计
- 核心概念模型 (Agent, ACap, Taint, Namespace, Budget)
- API 接口设计
- 安全性设计
- 性能设计
- 版本路线图

### 详细设计 (DETAIL-DESIGN.md)

- 完整项目结构 (package.json, tsconfig.json)
- 所有 TypeScript 类型定义 (types.ts)
- acap.ts 完整实现
- budget.ts 完整实现
- spawn.ts 完整实现
- taint.ts 完整实现
- vault.ts 完整实现
- outcomes.ts 完整实现
- 测试设计示例

### 快速开始 (QUICKSTART.md)

- 环境准备
- 项目初始化
- 核心类型实现
- 能力令牌实现
- 智能体派生实现
- 污染追踪实现
- 运行示例

---

## 快速参考

### 10 个原语

| # | 原语 | 功能 | 模块 |
|---|------|------|------|
| 1 | spawn | 派生智能体 | spawn.ts |
| 2 | acap | 能力令牌 | acap.ts |
| 3 | ns | 命名空间 | types.ts |
| 4 | ulimit-tok | 资源配额 | budget.ts |
| 5 | chexec | 污染追踪 | taint.ts |
| 6 | audit | 审计日志 | — |
| 7 | handoff | 能力降级 | acap.ts |
| 8 | snapshot | 状态快照 | — |
| 9 | vault | 凭证保险库 | vault.ts |
| 10 | outcomes | 评分迭代 | outcomes.ts |

### 核心类型

```typescript
// 结果类型
type OSResult<T> = { ok: true; value: T } | { ok: false; error: OSError }

// 能力令牌
type ACap = { id, subject, scope, max_invocations, granted_to, granted_by, expires_at, signature, invocations }

// 污染标记
type Taint = { source: TaintSource, origin: string, introduced_at: string }
TaintSource = 'fetched_url' | 'email' | 'user_input' | 'untrusted_file' | 'agent_message'

// 智能体
type AgentManifest = { id, parent, purpose, budget, namespace, created_at }
```

### 关键函数

```typescript
// 派生智能体
spawn(request: SpawnRequest, ctx: SpawnContext): OSResult<RegisteredAgent>

// 能力令牌
grant(request: ACapRequest, opts: GrantOptions): ACap
verify(acap: ACap, opts: VerifyOptions): OSResult<true>
downscope(source: ACap, request: Partial<ACapRequest>): OSResult<ACap>

// 配额追踪
BudgetTracker.canCharge(input, output, cost): OSResult<true>
BudgetTracker.charge(input, output, cost): OSResult<BudgetWarning | null>

// 污染追踪
checkTaint(call: ToolCall, policy?: TaintPolicy): OSResult<true>
propagate(call: ToolCall, value, introduces?): ToolCallResult
untaint(result: ToolCallResult, by: string): OSResult<ToolCallResult>

// 凭证保险库
Vault.inject(ref: CredentialRef, acap: ACap): OSResult<Injection>

// 评分迭代
withOutcome(rubric, attempt, evaluator, options): Promise<OutcomeResult<T>>
```

---

## 版本信息

- **分析日期**: 2026-07-13
- **分析版本**: v0.2.0-alpha.0
- **源码行数**: ~1,350 行 (核心模块)
- **测试行数**: ~800 行
- **依赖**: 零外部依赖

---

## 许可

本文档基于 `@kernel.chat/agent-os` 逆向分析生成，用于帮助理解和重建类似系统。
