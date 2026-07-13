# 3. 安全模型逆向

## 3.1 威胁模型还原

### 3.1.1 EchoLeak 漏洞驱动设计

**CVE 背景** (来自 COMPARISON.md):
> The 2025 EchoLeak vulnerability (CVE-2025-32711) and the ServiceNow
> "confused deputy" pattern are the operational evidence the field needs this.

**漏洞分析**:

| 漏洞 | 描述 | agent-os 应对 |
|------|------|---------------|
| **EchoLeak (CVE-2025-32711)** | M365 Copilot 零点击 prompt 注入通过邮件 | chexec + taint tracking |
| **ServiceNow confused deputy** | 跨 handoff 权限提升 | downscope() 强制降级 |
| **Prompt Infection (COLM 2025)** | LLM-to-LLM 注入传播，84% 攻击成功率 | 污染隔离 + 边界检查 |

**攻击链分析**:

```
攻击者邮件
    ↓ [污染引入]
Agent 读取邮件内容
    ↓ [污染传播]
邮件内容进入 Agent 上下文
    ↓ [恶意指令执行]
Agent 执行 exfil 操作 (发送邮件/POST)
    ↓ [数据泄露]
敏感信息到达攻击者
```

**agent-os 阻断点**:

```
污染引入点 (checkTaint)
    ↓
[拒絶] email_send + email taint → 攻击链中断
    ↓
[允许] 如果 compliance.untaint 执行解污染
```

### 3.1.2 威胁树分析

```
                    ┌─────────────────────────┐
                    │   Agent 行为失控        │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│ 越权操作      │      │ 资源耗尽      │      │ 数据泄露      │
└───────┬───────┘      └───────┬───────┘      └───────┬───────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│ acap + verify │      │ BudgetTracker │      │ taint + vault │
└───────────────┘      └───────────────┘      └───────────────┘
```

---

## 3.2 污染追踪机制

### 3.2.1 污染源枚举

**证据** (`types.ts`):
```typescript
export interface Taint {
  readonly source: 'fetched_url' | 'email' | 'user_input' | 'untrusted_file' | 'agent_message'
  readonly origin: string
  readonly introduced_at: string
}
```

**污染源分类**:

| 污染源 | 风险等级 | 典型攻击 |
|--------|----------|----------|
| `email` | 高 | EchoLeak 零点击注入 |
| `fetched_url` | 高 | HTML 注入、恶意 JS |
| `untrusted_file` | 高 | 文档宏、文件嵌入 |
| `user_input` | 中 | 用户提供的恶意指令 |
| `agent_message` | 中 | Agent 间传递的恶意内容 |

### 3.2.2 封锁规则设计

**证据** (`taint.ts`):
```typescript
export const DEFAULT_TAINT_POLICY: TaintPolicy = {
  blocks: new Map<string, ReadonlySet<Taint['source']>>([
    ['email_send', new Set(['fetched_url', 'email', 'agent_message', 'untrusted_file'])],
    ['http_post', new Set(['fetched_url', 'email', 'agent_message', 'untrusted_file'])],
    ['file_write', new Set(['fetched_url', 'email', 'agent_message'])],
    ['shell_exec', new Set(['fetched_url', 'email', 'user_input', 'agent_message', 'untrusted_file'])],
    ['mcp_send', new Set(['fetched_url', 'email', 'agent_message', 'untrusted_file'])],
  ]),
  untaint_allowlist: new Set<string>(['compliance.untaint']),
}
```

**封锁矩阵**:

| 工具 \ 污染源 | email | fetched_url | user_input | untrusted_file | agent_message |
|---------------|-------|-------------|------------|----------------|---------------|
| email_send | ❌ | ❌ | ✅ | ❌ | ❌ |
| http_post | ❌ | ❌ | ✅ | ❌ | ❌ |
| file_write | ❌ | ❌ | ✅ | ✅ | ❌ |
| shell_exec | ❌ | ❌ | ❌ | ❌ | ❌ |
| http_get | ✅ | 新增污染 | ✅ | ✅ | ✅ |

**设计洞察**:

1. **user_input 被选择性封锁**: shell_exec 拒绝，其他放行
2. **读操作不新增污染**: http_get 引入 fetched_url 污染
3. **untaint 白名单极小**: 默认只有 compliance.untaint

### 3.2.3 污染传播语义

**证据** (`taint.ts` propagate 函数):
```typescript
export function propagate(
  call: ToolCall,
  raw_value: unknown,
  introduces?: Taint['source'],
): ToolCallResult {
  const inherited = [...call.taints]
  if (introduces) {
    inherited.push({
      source: introduces,
      origin: typeof call.args === 'object' && call.args !== null && 'url' in call.args 
        ? String(call.args.url) 
        : call.tool,
      introduced_at: new Date().toISOString(),
    })
  }
  return { tool: call.tool, value: raw_value, produced_at: new Date().toISOString(), taints: inherited }
}
```

**传播规则**:

1. **输入并集**: 结果继承所有输入污染的并集
2. **新增污染**: 工具可引入新污染源 (如 http_get → fetched_url)
3. **不可逆**: 除非通过 untaint 显式清除

---

## 3.3 凭证保险库模式

### 3.3.1 安全假设

**架构决策** (来自 vault.ts 注释):
> Credentials never enter the agent's context. The agent references
> a credential by name; the OS resolves and injects it at the chexec boundary.

**攻击场景防御**:

| 攻击场景 | 传统方案风险 | vault 方案防御 |
|----------|--------------|---------------|
| Prompt 注入 | Agent 直接读取凭证 | 凭证不进入上下文 |
| 内存 dump | 凭证在进程内存 | 凭证在 Vault 进程外 |
| 日志泄露 | 日志包含凭证 | 日志不记录凭证值 |
| 错误消息 | 错误暴露凭证 | 错误只返回 ref |

### 3.3.2 注入验证流程

**证据** (`vault.ts` inject 函数):
```typescript
async inject(ref: CredentialRef, caller_acap: ACap): Promise<OSResult<Injection>> {
  // 1. 检查凭证是否存在
  const entry = this.entries.get(ref)
  if (!entry) { this.log(ref, caller_acap, undefined, 'missing'); return err(...) }
  
  // 2. 验证 acap 绑定
  if (!subjectsMatch(caller_acap.subject, entry.bound_to)) {
    this.log(ref, caller_acap, entry.bound_to, 'denied')
    return err(...)
  }
  
  // 3. 解析凭证值
  const value = await this.resolver(ref)
  if (value === null) { ... }
  
  // 4. 记录审计日志 (不含凭证值)
  this.log(ref, caller_acap, entry.bound_to, 'injected')
  
  // 5. 返回注入材料
  return ok(materialize(entry.injection, value))
}
```

**验证点分析**:

```
调用者持有 acap
       ↓
  acap 绑定检查
       ↓
  凭证引用存在检查
       ↓
  解析器返回值检查
       ↓
  注入材料生成
       ↓
  审计日志记录
```

### 3.3.3 注入形状

**证据**:
```typescript
export type InjectionShape =
  | { readonly kind: 'header'; readonly name: string; readonly prefix?: string }
  | { readonly kind: 'query_param'; readonly name: string }
  | { readonly kind: 'bearer_token' }
```

| 形状 | 适用场景 | 示例 |
|------|----------|------|
| `header` | 自定义请求头 | `Authorization: Bearer xxx` |
| `query_param` | URL 参数 | `?api_key=xxx` |
| `bearer_token` | OAuth Bearer | `Authorization: Bearer xxx` |

---

## 3.4 能力令牌安全

### 3.4.1 签名演进路径

**证据** (`acap.ts` 注释):
> v0.1 uses HMAC-SHA256 — parity with kbot-finance's governance.ts.
> v0.2 upgrades to Ed25519 so granting agents can sign offline and the OS only verifies.

**签名算法对比**:

| 版本 | 算法 | 密钥类型 | 适用场景 |
|------|------|----------|----------|
| v0.1 | HMAC-SHA256 | 对称密钥 | 同进程内验证 |
| v0.2 | Ed25519 | 非对称密钥 | 跨进程/离线签名 |

**升级动机**:
- **对称密钥问题**: HMAC 密钥必须共享，泄露风险随节点数增长
- **Ed25519 优势**: 签名私钥不离手，验证公钥可公开

### 3.4.2 downscope 强制降级

**证据** (`acap.ts` downscope 函数验证逻辑):
```typescript
// 1. Subject kind 必须完全匹配
if (subject.kind !== source.subject.kind) {
  return err('handoff_escalation_denied', `cannot change subject kind`)
}

// 2. Scope 只能缩小，不能扩大
for (const s of requestedScope) {
  if (!sourceScope.has(s)) {
    return err('handoff_escalation_denied', `cannot add scope`)
  }
}

// 3. max_invocations 不能超过 source 剩余
if (requestedMax > sourceRemaining) {
  return err('handoff_escalation_denied', `cannot grant more invocations`)
}
```

**降级约束形式化**:

```
downscope(s, r) 允许 iff:
  subject(s) == subject(r)
  scope(r) ⊆ scope(s)
  max_invocations(r) ≤ min(max_invocations(s), remaining(s))
  expires_at(r) ≤ expires_at(s)
```

---

## 3.5 审计日志设计

### 3.5.1 注入审计

**证据** (`vault.ts` InjectionLog):
```typescript
export interface InjectionLog {
  readonly cred_ref: CredentialRef
  readonly caller_acap: string
  readonly bound_subject: ACapSubject
  readonly injection_kind: InjectionShape['kind']
  readonly outcome: 'injected' | 'denied' | 'missing'
  readonly at: string
}
```

**设计原则**: 审计日志**绝对不**包含凭证值。

### 3.5.2 审计覆盖点

| 操作 | 审计内容 | 不审计内容 |
|------|----------|------------|
| 凭证注入 | ref, acap, outcome | 凭证值 |
| 能力验证 | acap_id, signer, result | 能力内容 |
| 智能体派生 | parent, child_id, budget | 内部状态 |

---

## 3.6 安全设计总结

```
┌─────────────────────────────────────────────────────────────────┐
│                      安全防御层次                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: 能力验证 (Capability Layer)                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ grant → acap → verify                     │    │
│  │ 签名验证 + 过期检查 + 撤销检查 + 耗尽检查              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ▼                                  │
│  Layer 2: 污染追踪 (Taint Layer)                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ checkTaint → propagate → untaint                      │    │
│  │ 污染源识别 + 传播追踪 + 显式清除                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ▼                                  │
│  Layer 3: 凭证保护 (Vault Layer)                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 注册引用 + 注入验证 + 解析器隔离                        │    │
│  │ 凭证不进入上下文，内存 dump 防护                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ▼                                  │
│  Layer 4: 资源配额 (Budget Layer)                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ canCharge → charge → canSpawn                         │    │
│  │ token/成本/时间/子进程 硬限制                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 安全设计哲学

1. **纵深防御**: 多层独立安全机制，单层失效不导致全面崩溃
2. **默认拒绝**: 未知工具/污染源默认拒绝，而非默认允许
3. **显式优于隐式**: 所有安全决策显式化，隐式信任被拒绝
4. **可审计性**: 所有安全相关操作记录审计日志
5. **隔离原则**: 凭证/密钥与执行上下文物理隔离
