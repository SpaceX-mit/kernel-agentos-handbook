# 4. 测试策略分析

## 4.1 测试组织结构

### 4.1.1 测试文件布局

```
packages/agent-os/
├── test/
│   ├── acap.test.ts      # 159 lines
│   ├── outcomes.test.ts   # 176 lines
│   ├── spawn.test.ts      # 170 lines
│   ├── taint.test.ts      # 146 lines
│   └── vault.test.ts      # 161 lines
└── src/
    ├── acap.ts            # 227 lines
    ├── outcomes.ts        # 264 lines
    ├── spawn.ts           # 128 lines
    ├── taint.ts           # 114 lines
    └── vault.ts           # 225 lines
```

**测试/源码行数比**:

| 模块 | 源码行数 | 测试行数 | 比例 |
|------|----------|----------|------|
| acap | 227 | 159 | 0.70 |
| outcomes | 264 | 176 | 0.67 |
| spawn | 128 | 170 | 1.33 |
| taint | 114 | 146 | 1.28 |
| vault | 225 | 161 | 0.72 |

**分析**: spawn 和 taint 测试比例 > 1.0，说明这两个模块有更复杂的测试场景覆盖。

### 4.1.2 测试命名约定

**证据**:
```typescript
describe('acap.grant + verify', () => {
  it('produces a verifiable capability', () => { ... })
  it('rejects an expired capability', () => { ... })
  it('rejects a tampered capability', () => { ... })
  it('rejects a capability from an untrusted signer', () => { ... })
  it('rejects a revoked capability', () => { ... })
  it('rejects an exhausted capability', () => { ... })
})
```

**命名模式**:
- `produces...` / `creates...`: 成功路径
- `rejects...`: 错误路径
- `allows...`: 边界条件放行

---

## 4.2 测试策略逆向

### 4.2.1 Happy Path + 错误路径覆盖

**证据** (每个测试文件):

```typescript
// 成功路径测试
it('produces a verifiable capability', () => {
  const cap = grant(baseRequest, opts)
  const v = verify(cap, { trust: TRUST })
  expect(v.ok).toBe(true)
})

// 错误路径测试
it('rejects an expired capability', () => {
  const cap = grant(baseRequest, { expires_at: pastDate })
  const v = verify(cap, { trust: TRUST })
  expect(v.ok).toBe(false)
  if (!v.ok) expect(v.error.code).toBe('capability_expired')
})
```

**覆盖矩阵**:

| 模块 | 成功路径 | 错误路径 | 边界条件 |
|------|----------|----------|-----------|
| acap | 1 | 5 | 篡改、未信任签名、过期、撤销、耗尽 |
| downscope | 1 | 4 | 添加 scope、扩大 invocations、morph subject |
| spawn | 3 | 2 | 未知 parent、child 数量超限 |
| taint | 2 | 5 | 各种污染源+工具组合 |
| vault | 6 | 4 | 注入成功、绑定失败、凭证缺失、重复注册 |

### 4.2.2 断言风格

**证据**:
```typescript
// 模式 1: 先检查 ok，再解构
const v = verify(cap, { trust: TRUST })
expect(v.ok).toBe(true)
if (!v.ok) expect(v.error.code).toBe('capability_expired')

// 模式 2: 直接检查值
expect(sub.value.max_invocations).toBe(5)

// 模式 3: 对象匹配
expect(r.error.details).toMatchObject({ tool: 'email_send', taint_source: 'email' })
```

**断言模式分析**:

| 模式 | 适用场景 | 原因 |
|------|----------|------|
| 先检查 ok | OSResult 类型 | TypeScript 类型系统不在运行时强制 |
| 直接 expect | 简单值比较 | 简洁直接 |
| toMatchObject | 部分字段匹配 | 灵活，允许额外字段 |

---

## 4.3 Mock 策略

### 4.3.1 内置 Mock 工具

**证据** (`vault.ts`):
```typescript
function makeInMemoryResolver(): CredentialResolver {
  const store = new Map<CredentialRef, CredentialValue>()
  const fn: CredentialResolver = async (ref) => store.get(ref) ?? null
  ;(fn as CredentialResolver & { set: (r: CredentialRef, v: CredentialValue) => void }).set = (
    ref,
    value,
  ) => store.set(ref, value)
  return fn
}

export function inMemoryResolver(entries: Record<string, string>): CredentialResolver {
  const store = new Map<string, string>(Object.entries(entries))
  return async (ref) => {
    const v = store.get(ref as string)
    return v !== undefined ? (v as CredentialValue) : null
  }
}
```

**Mock 策略分析**:

| Mock 类型 | 策略 | 理由 |
|-----------|------|------|
| Resolver | 内置 in-memory | 零外部依赖 |
| Trust Map | 直接构造 Map | 简单对象 |
| 时间 | Date.now() 控制 | 无专门 mock |

### 4.3.2 测试数据构建

**证据** (`test/acap.test.ts`):
```typescript
const PARENT = 'agent_parent' as AgentId
const CHILD = 'agent_child' as AgentId
const GRANDCHILD = 'agent_grandchild' as AgentId
const KEY = randomBytes(32)
const TRUST = new Map([[PARENT, KEY]])

const baseRequest: ACapRequest = {
  subject: { kind: 'tool', name: 'http_get' },
  scope: ['invoke'],
  max_invocations: 10,
  justification: 'fetch external doc for analysis',
}
```

**数据构建模式**:

1. **固定种子**: 使用固定 AgentId 名称，便于调试
2. **常量复用**: baseRequest 作为测试数据模板
3. **构造器模式**: grant() 工厂函数 + 修改选项

---

## 4.4 边界条件覆盖

### 4.4.1 acap 边界测试

**证据**:
```typescript
// 边界: 已使用部分调用次数的 acap
it('refuses to grant more invocations than source has remaining', () => {
  // Source granted 10, used 8 — remaining is 2.
  const partially_used = { ...source, invocations: 8 }
  const sub = downscope(partially_used, {
    granted_to: GRANDCHILD,
    max_invocations: 5,  // 尝试授予 5，但只剩 2
    signing_key: KEY,
  })
  expect(sub.ok).toBe(false)
})
```

**边界条件清单**:

| 条件 | 测试覆盖 |
|------|----------|
| invocations = 0 | 隐式覆盖 |
| invocations = max | ✅ exhausted 测试 |
| invocations = max - 1 | ❌ 未覆盖 |
| remaining = 0 | ✅ downscope remaining 测试 |
| remaining < requested | ✅ downscope remaining 测试 |
| scope = [] | ❌ 未覆盖 |
| scope = ['*'] | ❌ 不支持通配符 |

### 4.4.2 spawn 边界测试

**证据**:
```typescript
// 边界: exactly 达到 child limit
it('refuses spawn when parent has reached its child limit', () => {
  // max_children: 2
  // spawn 2 个 → 成功
  // spawn 第 3 个 → 失败
  const denied = spawn({ ... }, { budget: { ... max_children: 2 } })
  expect(denied.ok).toBe(false)
})
```

---

## 4.5 可验证性设计

### 4.5.1 为测试服务的代码特征

**证据** (`outcomes.ts`):
```typescript
export interface WithOutcomeOptions<T> {
  readonly max_iterations: number
  readonly serialize?: (work: T) => string
  readonly signal?: AbortSignal
}
```

**设计特征分析**:

| 特征 | 测试价值 |
|------|----------|
| `signal?: AbortSignal` | 可控制中断测试 |
| `serialize?` | 可注入自定义序列化 |
| `now?: Date` (budget.ts) | 可控制时间流 |

### 4.5.2 predicateEvaluator 测试工具

**证据** (`outcomes.ts`):
```typescript
export function predicateEvaluator(
  predicate: (work: string) => boolean,
  rubric: Rubric,
  feedback_when_failing: string,
): RubricEvaluator {
  return {
    async evaluate(work: string): Promise<RubricEvaluation> {
      const passing = predicate(work)
      // ...
    },
  }
}
```

**测试工具设计**: 提供假 evaluator 简化测试，避免真实 LLM 调用。

---

## 4.6 测试覆盖总结

### 4.6.1 覆盖矩阵

| 模块 | 核心功能 | 边界 | 错误处理 | Mock 依赖 |
|------|----------|------|----------|-----------|
| acap.grant | ✅ | ✅ | ✅ | 无 |
| acap.verify | ✅ | ✅ | ✅ | 无 |
| acap.downscope | ✅ | ✅ | ✅ | 无 |
| spawn | ✅ | ✅ | ✅ | 无 |
| checkTaint | ✅ | ✅ | ✅ | 无 |
| propagate | ✅ | ✅ | ❌ | 无 |
| untaint | ✅ | ✅ | ✅ | 无 |
| vault.inject | ✅ | ✅ | ✅ | inMemoryResolver |
| withOutcome | ✅ | ✅ | ✅ | predicateEvaluator |

### 4.6.2 测试哲学

```
┌─────────────────────────────────────────────────────────────┐
│                    测试金字塔                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ▲ 集成测试 (无)                          │
│                   ▲▲▲                                        │
│                  ▲▲▲▲▲  单元测试 (核心)                      │
│                 ▲▲▲▲▲▲▲▲                                      │
│                ▲▲▲▲▲▲▲▲▲▲                                      │
│               ▲▲▲▲▲▲▲▲▲▲▲▲                                   │
│              ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲                                  │
│                                                             │
│  特征:                                                      │
│  • 单元测试为主 (5 个测试文件，每个模块独立测试)              │
│  • 无端到端/集成测试 (alpha 版本不追求)                       │
│  • 无 mock 库依赖 (零外部依赖策略)                            │
│  • 测试即文档 (describe/it 命名清晰)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.6.3 缺失与改进空间

| 类别 | 现状 | 建议 |
|------|------|------|
| 边界值 | 部分覆盖 | 添加 invocations=max-1, scope=[] |
| 性能 | 无测试 | 添加大并发场景 |
| 安全 | 单元覆盖 | 添加 adversarial 测试 |
| 回归 | 无 CI 配置 | 添加 CI/CD 自动测试 |
