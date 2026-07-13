# 8. 知识体系总结

## 8.1 核心洞察

### 8.1.1 设计哲学

| 原则 | 体现 | 效果 |
|------|------|------|
| **OS 类比** | 8 原语映射 POSIX 概念 | 降低认知门槛 |
| **零依赖** | 纯 Node 内置 API | 供应链安全 |
| **判别类型** | OSResult<T> 替代异常 | 编译期安全 |
| **显式信任** | acap + verify 显式检查 | 最小权限 |
| **污染追踪** | Taint + chexec | 阻止 prompt 注入 |
| **CVE 驱动** | EchoLeak → taint | 真实威胁建模 |

### 8.1.2 关键决策树

```
如何选择签名算法?
    │
    ├─ 同进程验证 → HMAC-SHA256 (v0.1)
    │
    └─ 跨进程/离线签名 → Ed25519 (v0.2)

如何选择污染封锁规则?
    │
    ├─ exfil 工具 (email_send, http_post) → 严格封锁
    │
    ├─ 写工具 (file_write) → 部分封锁
    │
    └─ 读工具 (http_get) → 不封锁但标记污染

如何选择命名空间隔离级别?
    │
    ├─ 类型检查 → v0.1 (已有)
    │
    └─ 运行时强制 → v0.3 (计划)
```

---

## 8.2 知识编码模式

### 8.2.1 文档即设计

**模式**:
```
README.md = 主要设计文档
    ├── 概念解释
    ├── 快速开始
    ├── 原语详解
    ├── 竞品对比
    └── FAQ

COMPARISON.md = 战略文档
    ├── 功能矩阵
    ├── 优势分析
    └── 行动项

index.ts 注释 = 实现状态
    └── 原语完成度
```

### 8.2.2 注释即知识

**证据** (每个源文件):
```typescript
/**
 * chexec — trust-channel execution with taint tracking.
 *
 * Every tool call routes through a typed channel tagged with provenance.
 * Tainted input (fetched HTML, email body, untrusted file, message from
 * another agent) cannot reach high-privilege tools without an explicit
 * untaint operation by a sufficiently-trusted agent.
 */
```

**注释特征**:
- 顶部大段文档注释
- 解释"为什么"而非"是什么"
- 引用外部来源 (CVE, 论文)

### 8.2.3 学术引用链

**引用格式**:
```markdown
Sources: docs.anthropic.com/managed-agents, the Anthropic
Engineering blog post, Pluto Security's red-team writeup,
and two VentureBeat pieces on vendor lock-in.
```

**引用层级**:
| 层级 | 来源 | 用途 |
|------|------|------|
| 论文 | AIOS, COLM | 学术基础 |
| 竞品 | CMA | 功能启发 |
| 漏洞 | CVE, Prompt Infection | 安全建模 |
| 监管 | EU AI Act, FCA | 市场需求 |

---

## 8.3 团队心智模型

### 8.3.1 核心假设

| 假设 | 来源 | 影响 |
|------|------|------|
| 多 Agent 系统会普及 | 市场趋势 | 投资 OS 层 |
| 安全问题会被放大 | CVE 历史 | 投资安全原语 |
| 可移植性有价值 | 企业需求 | 开放规范 |
| 学术+工程需要结合 | COLM, ASPLOS | 引用论文 |

### 8.3.2 风险容忍度

| 风险 | 容忍度 | 应对 |
|------|--------|------|
| 技术不成熟 | 高 | alpha 版本策略 |
| 竞品跟进 | 中 | 加速迭代 |
| 监管不确定性 | 中 | 灵活架构 |
| 资源限制 | 高 | 零依赖策略 |

### 8.3.3 决策框架

```
遇到新需求?
    │
    ├─ 是否有 CVE/事故 证明需要?
    │       ├─ 是 → 添加原语
    │       └─ 否 → 是否有竞品实现?
    │               ├─ 是 → 分析是否差异化
    │               └─ 否 → 保持简洁
    │
    └─ 是否有学术基础?
            ├─ 是 → 引用论文
            └─ 否 → 工程实践验证
```

---

## 8.4 知识迁移建议

### 8.4.1 复用到其他项目

**适用模式**:

| 模式 | 如何复用 |
|------|----------|
| OS 类比 | 用 POSIX 概念映射新领域 |
| 零依赖 | 纯语言内置 API 设计 |
| 判别类型 | 替代异常流的类型安全方案 |
| 污染追踪 | 防止 untrusted input 攻击 |
| 双仓库 | npm 包 + monorepo 同步 |

**不适用场景**:
- 需要丰富生态的快速迭代项目
- 浏览器端为主的库
- 非安全关键的简单工具

### 8.4.2 改进方向

**基于逆向分析的改进建议**:

| 维度 | 现状 | 建议 |
|------|------|------|
| 测试 | 单元测试为主 | 添加集成测试 |
| 文档 | 代码内 | 增加 ADR (Architecture Decision Records) |
| 发布 | 手动 | 添加 CI/CD |
| 监控 | 无 | 添加指标导出 |
| 性能 | 未测试 | 添加 benchmark |

---

## 8.5 总结

### 8.5.1 知识体系全景

```
┌─────────────────────────────────────────────────────────────────┐
│                    agent-os 知识体系                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  技术层                                                         │
│  ├── TypeScript + Node 22 + 零依赖                             │
│  ├── 判别类型系统 (OSResult<T>)                                 │
│  └── 8-10 原语框架                                              │
│                                                                 │
│  设计层                                                         │
│  ├── OS 类比哲学 (POSIX for Agents)                            │
│  ├── CVE 驱动安全 (EchoLeak → taint)                           │
│  └── 竞品驱动演进 (CMA → vault/outcomes)                       │
│                                                                 │
│  策略层                                                         │
│  ├── Open Core (Apache 2.0)                                    │
│  ├── 双仓库分发                                                 │
│  └── Alpha 版本策略                                             │
│                                                                 │
│  生态层                                                         │
│  ├── kernel.chat 上下文                                         │
│  ├── kbot-finance 共享审计                                      │
│  └── kbot-orchestrator 依赖 OS                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.5.2 关键指标

| 指标 | 数值 | 说明 |
|------|------|------|
| 源码行数 | ~1,350 | 7 个核心模块 |
| 测试行数 | ~800 | 5 个测试文件 |
| 测试覆盖率 | ~70% | 行数比 |
| 原语数量 | 10 | v0.2 计划 |
| 已实现 | 7 | v0.2 alpha |
| 外部依赖 | 0 | 零依赖策略 |
| 错误类型 | 10 | 判别联合 |

### 8.5.3 核心教训

1. **类比是强大的认知工具**: POSIX 类比让复杂概念易于理解
2. **漏洞是最好的需求文档**: CVE 驱动比假设更可靠
3. **零依赖是安全的基础**: 供应链风险需要从源头控制
4. **类型即文档**: TypeScript 判别类型让错误处理显式化
5. **透明赢得信任**: COMPARISON.md 诚实对比建立信誉
6. **学术+工程结合**: 引用论文增强可信度
7. **文档即设计**: README 是主要设计文档，而非代码注释

---

## 附录：文件索引

| 文件 | 描述 |
|------|------|
| [00-overview.md](./00-overview.md) | 总览与快速参考 |
| [01-tech-stack.md](./01-tech-stack.md) | 技术栈逆向分析 |
| [02-architecture.md](./02-architecture.md) | 架构设计哲学 |
| [03-security.md](./03-security.md) | 安全模型逆向 |
| [04-testing.md](./04-testing.md) | 测试策略分析 |
| [05-open-source.md](./05-open-source.md) | 开源策略逆向 |
| [06-evolution.md](./06-evolution.md) | 演进路径逆向 |
| [07-context.md](./07-context.md) | 上下文关系图谱 |
| [08-summary.md](./08-summary.md) | 知识体系总结 |
