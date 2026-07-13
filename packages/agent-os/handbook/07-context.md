# 7. 上下文关系图谱

## 7.1 在 kernel.chat 项目中的定位

### 7.1.1 项目全景图

**证据** (KERNEL.md):
```
kernel.chat/
├── packages/
│   ├── kbot/                    # 终端 AI Agent
│   ├── kbot-finance/            # 金融审计底座
│   ├── kbot-orchestrator/       # 多 Agent 编排
│   └── agent-os/               # ← THIS: Agent OS 层
├── src/
│   └── content/issues/          # 杂志内容
├── docs/
│   ├── agentic-engineering.md   # 领域定义
│   └── frontier-2027*.md       # 前沿研究
└── tools/                       # 工具脚本
```

### 7.1.2 层级关系

**证据** (KERNEL.md):
```
The three stack. agent-os provides the kernel primitives;
provenance engineering provides the audit substrate the kernel
writes through; orchestration engineering provides the pipeline
layer that drives multi-agent outcomes through both.
```

**层级图**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    kernel.chat 架构层级                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Application Layer (kbot, Claude Code, your-agent)             │
│                              │                                 │
│                              ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Orchestration Layer                          │ │
│  │         packages/kbot-orchestrator/                      │ │
│  │  pipelines, routing, delegation, human approval gates    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                 │
│                              ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Agent OS Layer (THIS)                        │ │
│  │         packages/agent-os/                                │ │
│  │  spawn, acap, ns, ulimit-tok, chexec, audit, handoff   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                 │
│                              ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Provenance Layer                             │ │
│  │         packages/kbot-finance/                           │ │
│  │  hash-chained logs, content-addressed audit, governance  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                 │
│                              ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Sandbox Layer                                │ │
│  │         Modal, Daytona, RunPod, E2B, Docker              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7.2 与 kbot-finance 的关系

### 7.2.1 共享基础

**证据** (COMPARISON.md):
> v0.1 uses HMAC-SHA256 — parity with kbot-finance's governance.ts.

**共享设计**:

| 组件 | agent-os | kbot-finance | 共享原因 |
|------|----------|--------------|----------|
| 签名算法 | HMAC-SHA256 | HMAC-SHA256 | 一致性 |
| 审计格式 | 内容寻址 | hash-chain | 兼容 |
| 错误码 | 判别联合 | 判别联合 | 模式一致 |

### 7.2.2 依赖关系

```
agent-os (packages/agent-os/)
    │
    ├── audit 原语使用
    │       ↓
    │   kbot-finance (packages/kbot-finance/)
    │       ├── HashChainLog
    │       └── ContentAddressedEnvelope
    │
    └── 独立演进
        ├── 无运行时依赖
        └── 可单独发布
```

---

## 7.3 与 kbot-orchestrator 的关系

### 7.3.1 编排依赖 OS

**证据** (agentic-engineering.md):
> Orchestration engineering... routing, delegation, handoff protocols,
> briefing formats, audit trails across agent boundaries, human approval
> gates at material steps.

**依赖关系**:

```
kbot-orchestrator
    │
    ├── 使用 spawn() 派生 Agent
    ├── 使用 acap + downscope() 处理权限移交
    ├── 使用 chexec() 执行工具调用
    └── 使用 audit 追踪跨边界操作
    │
    ▼
agent-os (被依赖)
```

### 7.3.2 Agent Fidelity 关联

**证据** (agentic-engineering.md):
> Agent fidelity engineering... distinguishing operator-policy refusal
> from third-party-harm refusal... primitives are roadmap for
> `@kernel.chat/kbot-orchestrator` v0.3.

**潜在集成**:
- handoff 协议增强
- 权限验证增强
- 拒绝日志审计

---

## 7.4 领域定义

### 7.4.1 Discipline 3: Agent-OS

**证据** (agentic-engineering.md):
```
### 3. System primitives — agent-OS

The discipline of building the OS-layer primitives an agent runs
on top of: permissions, namespaces, quotas, capabilities, taint
tracking.

packages/agent-os is the kernel.chat reference, positioned as
"POSIX for AI agents."
```

**Discipline 边界**:

| 包含 | 不包含 |
|------|--------|
| 权限系统 | Agent 实现逻辑 |
| 命名空间 | 业务规则 |
| 资源配额 | 用户界面 |
| 能力令牌 | 模型调用 |
| 审计追踪 | 编排流程 |

### 7.4.2 与其他 Disciplines 的关系

**证据** (agentic-engineering.md):
```
1. Substrate — provenance engineering
2. Orchestration — orchestration engineering
3. System primitives — agent-OS (THIS)
4. Curation — currently unnamed
5. Evaluation — currently named informally
6. Agent fidelity — agent fidelity engineering
7. Operations — currently unnamed
```

**关系矩阵**:

| Discipline | 与 Agent-OS 的关系 |
|------------|-------------------|
| Provenance | audit 依赖 hash-chain |
| Orchestration | 使用 agent-os 原语 |
| Curation | 无直接关系 |
| Evaluation | 无直接关系 |
| Agent Fidelity | 权限验证扩展 |
| Operations | 监控依赖审计 |

---

## 7.5 外部依赖图谱

### 7.5.1 技术雷达

**来源分析** (COMPARISON.md, frontier-2027-research.md):

| 技术/协议 | 状态 | 关系 |
|-----------|------|------|
| **MCP** | 互补 | 运行在 agent-os 之上 |
| **A2A** | 互补 | 运行在 agent-os 之上 |
| **AIOS 论文** | 学术基础 | 提供原语框架 |
| **Letta/MemGPT** | 参照 | 内存层类比 |
| **gVisor** | 外部 | sandbox 提供者 |
| **Modal/RunPod** | 外部 | sandbox 提供者 |

### 7.5.2 依赖层级

```
                    ┌─────────────────┐
                    │   MCP / A2A     │  ← Wire Formats
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   agent-os      │  ← THIS: OS Primitives
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────▼─────────┐ ┌──────▼──────┐ ┌────────▼────────┐
│   kbot-finance    │ │kbot-orchest.│ │  其他 Agent    │
│ (hash-chain audit)│ │(pipelines)  │ │  (外部实现)    │
└───────────────────┘ └─────────────┘ └────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Sandboxes     │
                    │ Modal/Docker/etc│
                    └─────────────────┘
```

---

## 7.6 学术脉络

### 7.6.1 引用链路

**证据** (frontier-2027-research.md):

```
Academic Sources:
├── AIOS (Rutgers, COLM 2025)
│   └── arxiv 2403.16971: Kernel layer paper
│       ├── 采纳: 8 原语框架
│       └── 增强: 污染追踪 (AIOS 无)
│
├── ASPLOS 2026 AgenticOS Workshop
│   └── 定位: 学术发表机会
│
└── MemGPT / Letta
    └── 借鉴: 内存层抽象
```

### 7.6.2 行业脉络

```
Industry Events:
│
├── EchoLeak (CVE-2025-32711, June 2025)
│   └── 驱动: chexec + taint tracking
│
├── ServiceNow confused deputy (2025)
│   └── 驱动: downscope()
│
├── Claude Managed Agents (Apr-May 2026)
│   ├── 驱动: vault 原语
│   └── 驱动: outcomes 原语
│
└── Prompt Infection (COLM 2025)
    └── 驱动: 污染隔离
```

---

## 7.7 上下文关系总结

### 7.7.1 关系图谱

```
┌─────────────────────────────────────────────────────────────────────┐
│                         agent-os 关系图                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     kernel.chat 项目                         │   │
│  │  ┌─────────┐  ┌──────────────┐  ┌─────────────────────┐   │   │
│  │  │ kbot    │  │ kbot-finance │  │ kbot-orchestrator   │   │   │
│  │  │ (App)   │  │ (Audit)      │  │ (Pipeline)          │   │   │
│  │  └────┬────┘  └──────┬───────┘  └──────────┬──────────┘   │   │
│  │       │               │                      │              │   │
│  │       └───────────────┼──────────────────────┘              │   │
│  │                       ▼                                     │   │
│  │              ┌─────────────────┐                           │   │
│  │              │   agent-os      │ ← 核心依赖               │   │
│  │              │  (THIS)        │                           │   │
│  │              └────────┬────────┘                           │   │
│  └───────────────────────┼─────────────────────────────────────┘   │
│                          │                                        │
│         ┌────────────────┼────────────────┐                      │
│         │                │                │                      │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐             │
│  │   MCP/A2A   │  │  AIOS 论文  │  │    CMA     │             │
│  │ (Wire层)    │  │ (学术基础)  │  │ (竞品)     │             │
│  └────────────┘  └─────────────┘  └────────────┘             │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      外部环境                               │   │
│  │  • 监管: EU AI Act, FCA, SOC2                              │   │
│  │  • 市场: 企业多 Agent 需求                                  │   │
│  │  • 威胁: EchoLeak, prompt injection                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.7.2 关键关系强度

| 关系 | 强度 | 性质 |
|------|------|------|
| ↔ kbot-finance | 中 | 共享签名、审计格式 |
| ↔ kbot-orchestrator | 强 | 依赖 agent-os 原语 |
| ↔ MCP/A2A | 弱 | 互补，运行在不同层 |
| ↔ AIOS 论文 | 中 | 学术基础，非运行时 |
| ↔ CMA | 中 | 竞品，启发新原语 |
| ↔ 监管环境 | 弱 | 市场驱动，非直接依赖 |
