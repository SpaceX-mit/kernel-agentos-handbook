# 2. 架构设计哲学

## 2.1 OS 类比框架

### 核心隐喻：POSIX for AI Agents

**证据** (README.md):
> POSIX standardized the OS-level interface that every Unix program could rely on...
> agent-os is the equivalent move for AI agents.

**逆向推理**:

| POSIX 概念 | agent-os 对应 | 映射逻辑 |
|------------|--------------|----------|
| `fork()` | `spawn()` | 创建子进程/智能体 |
| `capability` (Linux) | `acap` | 能力令牌 |
| `rlimit` | `ulimit-tok` | 资源配额 |
| `execve()` | `chexec()` | 可信执行 |
| `namespace` (Linux) | `ns` | 隔离视图 |
| `process` | `agent` | 执行单元 |
| `auditd` | `audit` | 审计日志 |
| `fork() + exec()` | `handoff()` | 进程间移交 |

### 命名哲学

**发现的命名规则**:

1. **动词优先**: `spawn`, `grant`, `verify`, `downscope`, `checkTaint`, `propagate`
2. **Unix 动词**: `chexec` (chmod/chroot 模式), `downscope` (作用域缩小)
3. **缩写一致性**: `acap` = agent capability, `ulimit-tok` = user limit tokens

---

## 2.2 类型系统设计

### 2.2.1 判别联合类型替代异常

**证据** (`types.ts`):
```typescript
export type OSResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: OSError }

export function ok<T>(value: T): OSResult<T> {
  return { ok: true, value }
}

export function err(code: OSError['code'], message: string, ...): OSResult<never> {
  return { ok: false, error: { code, message, ... } }
}
```

**逆向推理**:

| 设计选择 | 理由 |
|----------|------|
| **拒绝 throw** | 跨模块边界不抛异常，防止未捕获导致进程崩溃 |
| **判别联合类型** | TypeScript 类型系统可在编译期强制穷尽检查 |
| **错误码枚举** | 10 种固定错误码，便于日志聚合和处理 |
| **可选 details** | 保留调试信息的扩展性 |

**与其他方案的对比**:

| 方案 | agent-os 选择 | 理由 |
|------|--------------|------|
| Go-style error return | ✅ 采纳 | 显式、可组合 |
| Rust Result<T, E> | ✅ 简化采纳 | 判别联合是核心 |
| throw/catch | ❌ 拒绝 | 不可组合，破坏性 |
| callback(err, result) | ❌ 拒绝 | 回调地狱 |

### 2.2.2 AgentId 品牌类型

**证据**:
```typescript
export type AgentId = string & { readonly __agent_id: unique symbol }
```

**逆向推理**:

1. **防止 ID 混淆**: `string` 和 `AgentId` 在类型系统不可互换
2. **编译期安全**: 传入普通 string 会报错
3. **minimal overhead**: 运行时仍是 string，无性能损失

### 2.2.3 ACapSubject 判别联合

**证据**:
```typescript
export type ACapSubject =
  | { readonly kind: 'tool'; readonly name: string }
  | { readonly kind: 'mcp_server'; readonly server: string }
  | { readonly kind: 'resource'; readonly uri: string }
  | { readonly kind: 'memory_block'; readonly block_id: string }
  | { readonly kind: 'audit_log'; readonly namespace: string }
  | { readonly kind: 'agent_handoff'; readonly target_pattern: string }
```

**逆向推理**:

| 设计决策 | 理由 |
|----------|------|
| **6 种固定类型** | 覆盖主流场景，不做过度设计 |
| **可扩展** | 新增 kind 需改源码，但保持了类型安全 |
| **无通配符** | 显式枚举防止绕过类型检查 |
| **与 MCP 对齐** | tool/mcp_server 映射现有协议 |

---

## 2.3 原语合成逻辑

### 8 → 10 原语演进

**证据** (index.ts 注释):
```
Ten primitives (v0.2 ships 7 of 10):

  1. spawn(manifest)     ✓ src/spawn.ts
  2. acap                ✓ src/acap.ts
  3. ns                  — namespaces typed; enforcement v0.3
  4. ulimit-tok          ✓ src/budget.ts
  5. chexec              ✓ src/taint.ts
  6. audit               — uses @kernel.chat/kbot-finance log; ns isolation v0.3
  7. handoff             ✓ src/acap.ts (downscope())
  8. snapshot            — content-addressed agent state; v0.3
  9. vault               ✓ src/vault.ts        (NEW v0.2 — from CMA)
 10. outcomes            ✓ src/outcomes.ts     (NEW v0.2 — from CMA)
```

**逆向推理**:

| 原语来源 | 分析 |
|----------|------|
| **1-8 原始集合** | 来自 AIOS 论文 + 安全研究综合 |
| **9 vault** | 来自 Claude Managed Agents，直接采纳 |
| **10 outcomes** | 来自 Claude Managed Agents，直接采纳 |

**核心发现**: 原语集合是开放的，竞品驱动是重要进化机制。

### 原语合成依据

通过 `docs/frontier-2027-research.md` 分析，原语来自三个维度：

1. **学术维度**: AIOS 论文 (COLM 2025) 提供基础集合
2. **安全维度**: EchoLeak CVE 驱动 chexec/taint 设计
3. **竞品维度**: CMA 驱动 vault/outcomes 采纳

---

## 2.4 命名空间模型

**证据** (`types.ts`):
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

**逆向推理**:

| 字段 | 作用 | 设计来源 |
|------|------|----------|
| `name` | 命名空间唯一标识 | Linux namespace |
| `memory` | 可访问的记忆块 | 隔离内存视图 |
| `tools` | 可调用的工具白名单 | capability 粒度 |
| `audit_namespace` | 审计日志归属 | 隔离审计 |
| `mounts` | 继承父命名空间 | Union-FS 概念 |

**关键发现**: `mounts` 设计借鉴了 Union-FS，支持只读/读写挂载。这比简单的继承更灵活。

---

## 2.5 AgentRegistry 设计

**证据** (`spawn.ts`):
```typescript
export class AgentRegistry {
  private readonly agents = new Map<AgentId, RegisteredAgent>()

  register(agent: RegisteredAgent): OSResult<true> { ... }
  get(id: AgentId): RegisteredAgent | undefined { ... }
  has(id: AgentId): boolean { ... }
  children(id: AgentId | null): AgentId[] { ... }
  ancestors(id: AgentId): AgentId[] { ... }
}
```

**逆向推理**:

| 方法 | 用途 | 设计模式 |
|------|------|----------|
| `register` | 注册智能体 | Registry Pattern |
| `get` | 按 ID 查找 | Map 查找 |
| `children` | 查找子智能体 | 树遍历 |
| `ancestors` | 查找祖先链 | 链表遍历 |

**版本演进**:
- **v0.1**: 内存注册表，单进程
- **v0.2**: 注释说明会拆分为 daemon，支持多进程共享

---

## 2.6 架构设计总结

```
┌─────────────────────────────────────────────────────────────────┐
│                     agent-os 架构层次                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  命名空间   │  │   能力系统  │  │   配额系统   │              │
│  │  Namespace  │  │    ACap     │  │ BudgetTracker│              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                     │
│         └────────────────┼────────────────┘                     │
│                          ▼                                      │
│                 ┌─────────────────┐                            │
│                 │  chexec 执行层   │                            │
│                 │  Taint Tracking  │                            │
│                 └────────┬────────┘                            │
│                          │                                      │
│                          ▼                                      │
│                 ┌─────────────────┐                            │
│                 │  AgentRegistry   │                            │
│                 │  (智能体注册表)   │                            │
│                 └─────────────────┘                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     OS 类比层                                    │
│  Process ←→ Agent | Syscall ←→ chexec | rlimit ←→ ulimit-tok   │
└─────────────────────────────────────────────────────────────────┘
```

### 核心设计原则

1. **类型即文档**: TypeScript 类型系统是主要的表达工具
2. **显式优于隐式**: 拒绝魔法，所有操作显式化
3. **可组合性**: 每个原语可独立使用，也可组合
4. **可验证性**: 结果类型强制调用方处理所有情况
5. **最小接口**: 暴露必要操作，隐藏实现细节
