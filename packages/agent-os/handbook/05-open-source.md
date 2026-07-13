# 5. 开源策略逆向

## 5.1 双仓库策略

### 5.1.1 仓库结构

**证据** (README.md):
> **Two homes:** the canonical source is this package in the
> `isaacsight/kernel` monorepo. A clean mirror auto-syncs to the standalone
> repo at `isaacsight/agent-os` on every push, for focused discovery,
> topic-page presence, and clone-without-the-monorepo workflows.

**仓库关系图**:

```
┌─────────────────────────────────────────────────────────────┐
│                   isaacsight/kernel                        │
│                   (Canonical Source)                        │
│                   Monorepo                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  packages/agent-os/  ← 源码位置                             │
│      ├── src/                                              │
│      ├── test/                                             │
│      └── package.json                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          │ auto-sync on push
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   isaacsight/agent-os                      │
│                   (Clean Mirror)                            │
│                   Standalone                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Same content, no monorepo context                          │
│  Better for:                                                │
│  • npm focused discovery                                   │
│  • Topic page presence (GitHub topics)                     │
│  • Clone without monorepo                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.1.2 双仓库动机分析

| 策略 | 优势 | 劣势 |
|------|------|------|
| **Monorepo only** | 单点管理，版本一致 | 包发现性差，clone 体积大 |
| **Standalone only** | 发现性好，轻量 | 版本同步复杂 |
| **双仓库 (当前)** | 兼顾发现性和管理性 | 同步维护成本 |

**用户场景分析**:

| 用户 | 推荐来源 | 理由 |
|------|----------|------|
| kernel.chat 贡献者 | monorepo | 统一开发环境 |
| agent-os 独立用户 | standalone | 快速上手 |
| 包管理器发现 | npm | 主要分发渠道 |

---

## 5.2 许可证选择

### 5.2.1 Apache 2.0 vs MIT

**证据**:
```
packages/agent-os/LICENSE: Apache-2.0
packages/agent-os/package.json: "license": "Apache-2.0"
```

**许可证对比**:

| 维度 | Apache 2.0 | MIT |
|------|------------|-----|
| 专利授权 | ✅ 内置 | ❌ 无 |
| 商标保护 | ✅ 明确 | ❌ 无 |
| 贡献者声明 | ✅ 要求 | ✅ 要求 |
| 商业友好度 | 高 | 最高 |
| 复杂度 | 较高 | 低 |

**选择理由逆向**:

1. **专利授权**: agent-os 涉及凭证、签名等专利敏感领域
2. **kernel.chat 生态一致性**: kbot-finance 也用 Apache 2.0
3. **企业采用**: Apache 2.0 在企业合规中更常见

### 5.2.2 商业化边界

**证据** (README.md):
> The package is the OS itself stays free; commercial offerings
> (multi-tenant kernel-as-a-service, certified hardware backing, etc.)
> are downstream products.

**商业模式分析**:

```
┌─────────────────────────────────────────────────────────────┐
│                   价值分层模型                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: agent-os Core (Apache 2.0, FREE)                │
│  ├── 8-10 核心原语                                          │
│  ├── 基础测试套件                                          │
│  └── 文档和示例                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 2: Enterprise Extensions (Commercial)               │
│  ├── Multi-tenant kernel-as-a-service                      │
│  ├── Certified hardware backing                            │
│  ├── Enterprise SLA + Support                             │
│  └── Compliance certifications (SOC2, ISO27001)             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 3: Managed Services (Commercial)                    │
│  ├── Hosted agent-os runtime                               │
│  ├── Managed vault services                                │
│  └── Compliance audit services                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5.3 版本策略

### 5.3.1 Alpha 版本维持

**证据**:
```json
"version": "0.2.0-alpha.0"
```

**版本号分析**:

| 版本 | 语义 | 含义 |
|------|------|------|
| `0.2.0` | Major = 0 | 尚未稳定 |
| `alpha.0` | Pre-release | 早期采用者测试 |

**Alpha 维持原因逆向**:

1. **快速迭代**: 不受 semver 兼容性约束
2. **诚实声明**: 明确告知用户"未生产就绪"
3. **反馈驱动**: 鼓励用户报告问题而非期待稳定

### 5.3.2 版本演进标记

**证据** (index.ts 注释):
```typescript
/**
 * Ten primitives (v0.2 ships 7 of 10):
 *
 *   1. spawn(manifest)     ✓ src/spawn.ts
 *   2. acap                ✓ src/acap.ts
 *   3. ns                  — namespaces typed; enforcement v0.3
 *   ...
 */
```

**演进透明度**: 每个原语标注实现状态，用户清楚哪些可用。

---

## 5.4 文档策略

### 5.4.1 README 即设计文档

**证据**: README.md 15,134 bytes，内容包括:
- 核心概念解释
- 快速开始代码
- 8 个原语详细说明
- 与竞品对比
- 架构图
- FAQ

**文档目的逆向**:

| 部分 | 目标读者 | 目的 |
|------|----------|------|
| 快速开始 | 开发者 | 5 分钟上手 |
| 8 原语详解 | 架构师 | 理解设计 |
| COMPARISON.md | 决策者 | 竞品对比 |
| FAQ | 所有 | 常见问题 |

### 5.4.2 COMPARISON.md 策略

**证据**: 9,460 bytes 竞品对比文档

**对比矩阵**:

| 维度 | agent-os | Claude Managed Agents |
|------|----------|----------------------|
| 能力令牌 | ✅ acap 可委托 | ❌ 仅 agent 级 |
| 兄弟隔离 | ✅ 命名空间 | ❌ 共享文件系统 |
| 凭证安全 | ✅ 服务端注入 | ✅ 服务端注入 |
| 可移植性 | ✅ 开放规范 | ❌ Anthropic 绑定 |

**文档策略分析**:
- **诚实承认优势**: 指出 CMA 在某些方面的优势
- **强调差异化**: portability 是核心卖点
- **不贬低竞品**: 保持专业客观

### 5.4.3 CITATION.cff 学术传播

**证据**: CITATION.cff 128 bytes

**学术传播策略**:
- 提供标准引文格式
- 关键词: agent-os, ai-agents, capability-based-security
- 指向 npm 和 GitHub 双 URL

---

## 5.5 社区运营

### 5.5.1 贡献者结构

**证据** (CITATION.cff):
```yaml
authors:
  - name: "kernel.chat contributors"
    website: "https://kernel.chat"
```

**社区策略**:
- "kernel.chat contributors" 集体署名
- 贡献者通过 GitHub 协作
- 无明确的贡献者协议

### 5.5.2 问题追踪

**证据** (package.json):
```json
"bugs": {
  "url": "https://github.com/isaacsight/kernel/issues"
}
```

**问题处理**:
- 使用 GitHub Issues
- Canonical 仓库接收 issues
- Labels 用于分类

---

## 5.6 发布配置

### 5.6.1 npm 发布配置

**证据** (package.json):
```json
{
  "name": "@kernel.chat/agent-os",
  "publishConfig": { "access": "public" },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/isaacsight/kernel.git",
    "directory": "packages/agent-os"
  },
  "keywords": [...]
}
```

**发布策略分析**:

| 配置 | 含义 |
|------|------|
| `@kernel.chat/` scope | 品牌 namespace |
| `publishConfig: public` | Scoped 包需显式 public |
| `repository.directory` | 支持 monorepo 发布 |
| 14 个 keywords | npm SEO 优化 |

### 5.6.2 发布流程推测

```bash
# 推测的发布流程 (基于 kbot 的模式)
cd packages/agent-os
npm version patch/minor
npm publish
# GitHub Actions 自动同步到 standalone 仓库
```

---

## 5.7 开源策略总结

### 5.7.1 战略定位

```
┌─────────────────────────────────────────────────────────────┐
│                    开源策略矩阵                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                         市场定位                            │
│                           │                                │
│           ┌───────────────┴───────────────┐                │
│           ▼                               ▼                │
│   ┌─────────────────┐           ┌─────────────────┐        │
│   │   Open Core     │           │  Enterprise    │        │
│   │   (Apache 2.0)  │           │  (Commercial)  │        │
│   ├─────────────────┤           ├─────────────────┤        │
│   │  • 核心原语     │           │  • 多租户托管   │        │
│   │  • 基础测试     │           │  • 合规认证     │        │
│   │  • 文档示例     │           │  • 企业支持     │        │
│   └─────────────────┘           └─────────────────┘        │
│                                                             │
│   策略: 通过开源建立事实标准，通过企业服务变现               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.7.2 关键成功因素

| 因素 | 当前状态 | 建议 |
|------|----------|------|
| 开发者体验 | ✅ 清晰文档 | 增强 Playground |
| 社区建设 | ⚠️ 基础 | 增加 Contributing Guide |
| 生态整合 | ⚠️ MCP/A2A | 更多集成示例 |
| 商业化 | ⚠️ 未启动 | 明确定价模型 |
