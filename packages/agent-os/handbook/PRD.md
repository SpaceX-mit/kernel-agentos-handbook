# agent-os 产品需求文档 (PRD)

> **文档版本**: v1.0  
> **更新时间**: 2026-07-13  
> **产品版本**: v0.2.0-alpha.0 → v1.0  

---

## 1. 产品概述

### 1.1 产品定位

**"AI Agent 的 POSIX"** — 为 AI Agent 提供操作系统级别的底层原语，让多个 Agent 系统可以共享标准化的权限、配额、隔离和审计机制。

### 1.2 解决的问题

| 问题 | 当前状态 | agent-os 方案 |
|------|----------|---------------|
| 每个 Agent 框架重复造轮子 | LangChain/AutoGen/CrewAI 各自实现权限 | 统一原语，一次定义，到处运行 |
| Prompt 注入攻击 (EchoLeak) | 依赖模型对齐 | 结构性阻止，kernel 级别拒绝 |
| 凭证泄露 | Agent 上下文暴露密钥 | 服务端注入，Agent 看不到明文 |
| 权限蔓延 | 子 Agent 权限无法控制 | downscope() 严格子集验证 |
| 审计缺失 | 操作不可追溯 | hash-chain + 内容可寻址 |

### 1.3 目标用户

| 用户类型 | 使用场景 | 价值 |
|----------|----------|------|
| **Agent 框架开发者** | 集成 agent-os 作为底层 | 专注业务，不用重复造安全轮子 |
| **企业安全团队** | 部署多 Agent 系统 | 合规审计，权限控制 |
| **金融/医疗** | 高风险自动化 | 结构性安全，而非依赖模型对齐 |
| **研究者** | 构建实验性 Agent | 可重现、可审计的实验环境 |

---

## 2. 功能需求

### 2.1 已实现功能 (v0.2)

#### P0 - 必须

| 原语 | 功能 | 文件 | 优先级 |
|------|------|------|--------|
| spawn() | Agent 派生，无隐式继承 | spawn.ts | P0 |
| acap | 签名、可撤销能力令牌 | acap.ts | P0 |
| ulimit-tok | 资源配额控制 | budget.ts | P0 |
| chexec | 污染追踪执行 | taint.ts | P0 |
| handoff | 权限移交，权限只能缩小 | acap.ts | P0 |

#### P1 - 重要

| 原语 | 功能 | 文件 | 优先级 |
|------|------|------|--------|
| vault | 服务端凭证注入 | vault.ts | P1 |
| outcomes | 评分自评循环 | outcomes.ts | P1 |

### 2.2 规划功能 (v0.3)

| 原语 | 功能 | 优先级 |
|------|------|--------|
| ns | 命名空间运行时强制 | P0 |
| audit | 命名空间隔离审计视图 | P1 |
| snapshot | 内容可寻址状态快照 | P2 |

### 2.3 未来功能 (v1.0)

| 功能 | 描述 | 优先级 |
|------|------|--------|
| Ed25519 签名 | 非对称签名，离线验证 | P1 |
| 守护进程模式 | 进程间共享内核 | P1 |
| 分布式支持 | 多机器 Agent 协作 | P2 |

---

## 3. 技术规格

### 3.1 运行环境

| 要求 | 规格 |
|------|------|
| Node.js | >= 22.0.0 |
| TypeScript | 5.6+ |
| 外部依赖 | **零依赖** (仅 Node 内置 API) |
| 运行环境 | Node.js / Bun / Deno (理论上) |

### 3.2 签名方案

| 版本 | 算法 | 说明 |
|------|------|------|
| v0.1 | HMAC-SHA256 | 与 kbot-finance 一致 |
| v0.2 | HMAC-SHA256 | 兼容 v0.1 |
| v0.3+ | Ed25519 | 非对称，离线验证 |

### 3.3 数据结构

```typescript
// 核心类型
AgentId: string
AgentManifest: { id, parent, purpose, budget, namespace }
ACap: { id, subject, scope, signature, invocations, expires_at }
OSResult<T>: { ok: true, value: T } | { ok: false, error: ErrorCode }
```

### 3.4 错误码

| 错误码 | 含义 |
|--------|------|
| `capability_expired` | 令牌已过期 |
| `capability_exhausted` | 调用次数耗尽 |
| `capability_revoked` | 令牌被撤销 |
| `capability_tampered` | 签名校验失败 |
| `capability_untrusted_signer` | 签名者不在信任列表 |
| `handoff_escalation_denied` | 尝试提升权限 |
| `budget_exceeded` | 资源配额超限 |
| `taint_violation` | 污染策略违规 |
| `namespace_violation` | 命名空间违规 |
| `manifest_invalid` | Agent 清单无效 |

---

## 4. API 设计

### 4.1 核心接口

```typescript
// Agent 生命周期
spawn(request: SpawnRequest, context: SpawnContext): OSResult<AgentHandle>
AgentRegistry.register(agent: RegisteredAgent): OSResult<true>

// 能力管理
grant(request: ACapRequest, opts: GrantOptions): ACap
verify(cap: ACap, context: VerifyContext): OSResult<true>
downscope(cap: ACap, opts: DownscopeOptions): OSResult<ACap>

// 资源配额
BudgetTracker.canCharge(input, output, cost): OSResult<true>
BudgetTracker.charge(input, output, cost): OSResult<BudgetWarning | null>

// 污染追踪
checkTaint(call: ToolCall, policy?: TaintPolicy): OSResult<true>
propagate(call: ToolCall, value, introduces?): ToolCallResult
untaint(result: ToolCallResult, by: string): OSResult<ToolCallResult>

// 凭证保险库
vault.register(entry: VaultEntry): OSResult<true>
vault.inject(ref: CredentialRef, cap: ACap): OSResult<Injection>
vault.archive(ref: CredentialRef): OSResult<true>

// 评分自评
withOutcome<T>(attempt, options, rubric, evaluator): Promise<OutcomeResult<T>>
```

### 4.2 导出结构

```typescript
// index.ts
export * from './types.js'      // 核心类型
export * from './acap.js'       // 能力令牌
export * from './budget.js'     // 资源配额
export * from './spawn.js'      // Agent 派生
export * from './taint.js'      // 污染追踪
export * from './vault.js'      // 凭证保险库
export * from './outcomes.js'   // 评分自评
```

---

## 5. 产品路线图

### 5.1 版本规划

```
v0.1 (2026-05)     v0.2 (2026-06)     v0.3 (2026-09)     v1.0 (2026-12)
    │                   │                   │                   │
    ▼                   ▼                   ▼                   ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ 5/8 原语    │  │ 7/10 原语   │  │ 10/10 原语  │  │ 生产就绪    │
├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤
│ • spawn     │  │ + vault     │  │ + ns 执行   │  │ • 分布式    │
│ • acap      │  │ + outcomes  │  │ + audit ns  │  │ • Ed25519  │
│ • ulimit    │  │             │  │ + snapshot  │  │ • 守护进程  │
│ • chexec    │  │             │  │             │  │ • 性能优化  │
│ • handoff   │  │             │  │             │  │ • 文档完善  │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

### 5.2 里程碑

| 里程碑 | 日期 | 交付物 |
|--------|------|--------|
| M1: 核心原语 | 2026-05 | spawn/acap/ulimit/chexec/handoff |
| M2: 企业功能 | 2026-06 | vault/outcomes |
| M3: 命名空间 | 2026-09 | ns 运行时强制 |
| M4: 审计快照 | 2026-09 | audit ns 隔离 + snapshot |
| M5: 签名升级 | 2026-10 | Ed25519 |
| M6: 守护进程 | 2026-11 | IPC 进程间 |
| M7: 生产就绪 | 2026-12 | v1.0 稳定版 |

---

## 6. 质量指标

### 6.1 测试覆盖

| 指标 | 目标 |
|------|------|
| 单元测试覆盖率 | >= 80% |
| 端到端测试 | 核心路径覆盖 |
| 性能基准 | 单次操作 < 10ms |
| 并发支持 | 100+ Agent 进程 |

### 6.2 兼容性

| 兼容项 | 最低版本 |
|--------|----------|
| Node.js | 22.0.0 |
| TypeScript | 5.6 |
| 浏览器 | 不支持 (Node.js only) |

---

## 7. 发布策略

### 7.1 包信息

```json
{
  "name": "@kernel.chat/agent-os",
  "version": "0.2.0-alpha.0",
  "license": "Apache-2.0",
  "publishConfig": { "access": "public" }
}
```

### 7.2 双仓库

| 仓库 | 用途 |
|------|------|
| isaacsight/kernel | 规范源码 (monorepo) |
| isaacsight/agent-os | 独立镜像 (npm 发现) |

### 7.3 许可证

**Apache 2.0** — 核心功能免费

**商业化产品** (下游):
- 多租户 kernel-as-a-service
- 认证硬件支持
- 企业 SLA + 支持
- 合规认证 (SOC2, ISO27001)

---

## 8. 风险与依赖

### 8.1 技术风险

| 风险 | 影响 | 缓解 |
|------|------|------|
| 大厂跟进 | 高 | 加速迭代，保持领先 |
| 命名空间实现复杂度 | 中 | 参考 OS 成熟设计 |
| 分布式一致性 | 高 | 借鉴 etcd/Raft |

### 8.2 市场风险

| 风险 | 影响 | 缓解 |
|------|------|------|
| 无人采用 | 高 | 展示用例，建立生态 |
| 竞品标准化 | 中 | 参与标准制定 |

### 8.3 外部依赖

| 依赖 | 用途 | 替代方案 |
|------|------|----------|
| Node.js 内置 API | 核心功能 | 无需替代 |
| kbot-finance | audit 原语 | 可独立实现 |

---

## 9. 成功指标

### 9.1 技术指标

| 指标 | 目标值 |
|------|--------|
| npm 周下载量 | v0.3: 1000+ |
| GitHub Stars | v1.0: 500+ |
| 框架集成数 | v1.0: 3+ |
| 测试覆盖率 | >= 80% |

### 9.2 生态指标

| 指标 | 目标值 |
|------|--------|
| 集成项目 | v1.0: 5+ |
| 社区贡献 | v1.0: 10+ PR |
| 文档完整性 | v1.0: 100% |

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
| **PRD.md** | 本文档 |
| [TECH-ANALYSIS.md](./TECH-ANALYSIS.md) | 技术分析 |
