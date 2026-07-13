# 6. 演进路径逆向

## 6.1 版本演进历史

### 6.1.1 v0.1 → v0.2 变更

**证据** (README.md):
```
v0.1: 5 of 8 primitives shipped
v0.2: 7 of 10 primitives shipped
```

**变更清单**:

| 类别 | v0.1 | v0.2 | 变化原因 |
|------|------|------|----------|
| **新增原语** | — | vault, outcomes | 来自 CMA 启发 |
| **原有原语** | 5 | 5 | 无大变化 |
| **类型系统** | 基础 | 扩展 | 支持新原语 |
| **文档** | 基础 | 详细 | COMPARISON.md 新增 |

### 6.1.2 v0.2 → v0.3 路线图

**证据** (index.ts 注释):
```
3. ns                  — namespaces typed; enforcement v0.3
6. audit               — uses @kernel.chat/kbot-finance log; ns isolation v0.3
8. snapshot            — content-addressed agent state; v0.3
```

**v0.3 预期**:

| 原语 | 当前状态 | v0.3 目标 |
|------|----------|-----------|
| `ns` | 类型完备，执行缺失 | 运行时强制 |
| `audit` | 基础 | 命名空间隔离 |
| `snapshot` | 未实现 | 内容寻址快照 |

---

## 6.2 驱动因素分析

### 6.2.1 竞品驱动 (CMA)

**证据** (COMPARISON.md):
> **Action for agent-os v0.2:** add a credential proxy primitive.

**CMA 启发清单**:

| CMA 特性 | agent-os 对应 | 采纳程度 |
|----------|--------------|----------|
| Vaults | vault.ts | ✅ 直接采纳 |
| Outcomes | outcomes.ts | ✅ 直接采纳 |
| Session event log | audit | ◐ v0.3 |
| gVisor sandbox | 外部 | ❌ 外部依赖 |
| Tool confirmation | chexec | ✅ 增强 |
| Per-agent quotas | ulimit-tok | ✅ 已有 |

### 6.2.2 漏洞驱动 (CVE)

**证据** (README.md):
> The 2025 EchoLeak vulnerability (CVE-2025-32711) and the ServiceNow
> "confused deputy" pattern are the operational evidence the field needs this.

**CVE 响应时间线**:

```
2025-06  EchoLeak (CVE-2025-32711) 曝光
    ↓
    发现: 污染追踪可以阻止此类攻击
    ↓
2026-05  agent-os v0.1 发布 (含 chexec + taint)
    ↓
    ServiceNow confused deputy 事件
    ↓
    发现: downscope() 可防止权限提升
```

### 6.2.3 学术驱动

**证据** (COMPARISON.md):
> AIOS (Rutgers, COLM 2025, arxiv 2403.16971): kernel layer with scheduler
> / memory manager / tool manager / context / storage / access.

**学术引用链路**:

```
AIOS (COLM 2025)
    ├── 采纳: 8 原语框架
    ├── 增强: 污染追踪 (AIOS 无)
    └── 工程化: 从研究原型到生产代码

ASPLOS 2026 AgenticOS Workshop
    └── 定位: 学术发表机会

Letta / MemGPT
    └── 借鉴: 命名空间概念 (但 agent-os 扩展为多维)
```

---

## 6.3 技术演进路径

### 6.3.1 签名算法升级

**证据** (`acap.ts`):
```
v0.1: HMAC-SHA256
v0.2: Ed25519 (计划)
```

**升级动机**:
- **同态验证**: Ed25519 支持离线签名
- **非对称安全**: 私钥不离手，只分发公钥
- **性能**: Ed25519 签名验证比 HMAC 更快

### 6.3.2 架构演进

**证据** (`spawn.ts`):
```typescript
// In v0.1 this is in-process;
// in v0.2 it lives behind a daemon process so multiple agent
// processes can share the kernel.
export class AgentRegistry { ... }
```

**架构演进**:

```
v0.1: 单进程
┌─────────────────────────────────────┐
│  Agent Process                      │
│  ┌───────────┐  ┌───────────────┐ │
│  │  Registry │  │  BudgetTracker│ │
│  └───────────┘  └───────────────┘ │
└─────────────────────────────────────┘

v0.2: 守护进程
┌─────────────────────────────────────┐
│  Kernel Daemon                      │
│  ┌───────────┐  ┌───────────────┐ │
│  │  Registry │  │  BudgetTracker│ │
│  └───────────┘  └───────────────┘ │
│          ▲                         │
│          │ IPC                     │
│  ┌───────┴───────┐                 │
│  │ Agent Process │                 │
│  └───────────────┘                 │
└─────────────────────────────────────┘
```

### 6.3.3 命名空间执行

**证据** (types.ts):
```typescript
// ◐ typed; enforcement v0.2
export interface NamespaceSpec { ... }
```

**当前状态**: 类型完备，执行缺失

**v0.3 目标**:
- 运行时强制 namespace 边界
- 内存块访问控制
- 工具调用权限检查

---

## 6.4 竞争情报利用

### 6.4.1 CMA 监控点

**证据** (COMPARISON.md):
```
Sources: docs.anthropic.com/managed-agents, the Anthropic
Engineering blog post on "decoupling the brain from the hands,"
the May 5 finance-agents announcement, Pluto Security's red-team
writeup, and two VentureBeat pieces on vendor lock-in.
```

**监控维度**:

| CMA 动态 | 价值 | 响应 |
|----------|------|------|
| 新功能发布 | 功能差距分析 | 采纳或差异化 |
| 定价变化 | 商业策略参考 | 竞争定位 |
| 安全事件 | 威胁模型验证 | 安全增强 |
| 文档更新 | 市场需求洞察 | 产品方向 |

### 6.4.2 竞品响应模式

**证据** (COMPARISON.md):
> **Action for agent-os v0.2:** add a credential proxy primitive.

**响应模式**:

```
CMA 发布新功能
    ↓
分析: 是否填补真实需求？
    ↓
├─ 是 → 直接采纳 (vault, outcomes)
│
├─ 部分 → 差异化实现 (ns 隔离 vs 共享文件系统)
│
└─ 否 → 保持差异 (portability)
```

---

## 6.5 知识演进机制

### 6.5.1 文档即知识沉淀

**证据** (COMPARISON.md):
```
*v0.1 · 2026-05-13 · CC BY 4.0 · Update as both surfaces evolve.*
```

**知识编码流程**:

```
研究阶段
    ↓
生成文档 (frontier-2027-research.md)
    ↓
形成决策 (PLAN.md)
    ↓
实现代码 (packages/agent-os/)
    ↓
沉淀知识 (README.md, COMPARISON.md)
    ↓
归档 (CITATION.cff, LICENSE)
```

### 6.5.2 前向兼容性

**证据** (vault.ts):
```typescript
// v0.1 ships with an in-memory resolver. Production deployments register
// a custom resolver via `Vault.withResolver()`.
export class Vault {
  withResolver(resolver: CredentialResolver): void {
    this.resolver = resolver
  }
}
```

**兼容性策略**:
- 核心类型稳定
- 接口扩展而非破坏
- 保留升级路径

---

## 6.6 演进路径总结

### 6.6.1 演进路线图

```
2026-Q2 (v0.2)                    2026-Q3 (v0.3)                    2026-Q4 (v1.0)
    │                                   │                                   │
    ▼                                   ▼                                   ▼
┌───────────────────┐          ┌───────────────────┐          ┌───────────────────┐
│ 7 of 10 primitives│          │ 10 of 10 primitives│         │ Production Ready │
├───────────────────┤          ├───────────────────┤          ├───────────────────┤
│ • vault (new)     │          │ • ns enforcement  │          │ • Daemon mode     │
│ • outcomes (new)  │          │ • audit ns        │          │ • Ed25519         │
│ • HMAC-SHA256     │    ──►   │ • snapshot        │    ──►   │ • Distributed     │
│ • In-memory reg   │          │ • Daemon ready   │          │ • Snapshot/restore│
│                   │          │ • Ed25519 ready  │          │                   │
└───────────────────┘          └───────────────────┘          └───────────────────┘
```

### 6.6.2 关键里程碑

| 里程碑 | 目标 | 依赖 |
|--------|------|------|
| v0.3 | 完整原语集合 | 命名空间执行、快照 |
| v0.4 | 守护进程 | IPC、状态同步 |
| v1.0 | 生产就绪 | 性能优化、文档完善 |

### 6.6.3 风险与机会

| 类型 | 内容 | 影响 |
|------|------|------|
| **技术风险** | 命名空间执行复杂度 | 中 |
| **市场风险** | Anthropic 跟进 | 高 |
| **资源风险** | 维护成本 | 中 |
| **机会** | 行业标准制定者 | 高 |
| **机会** | 监管合规需求 | 高 |
