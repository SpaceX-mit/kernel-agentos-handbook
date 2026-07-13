# 1. 技术栈逆向分析

## 1.1 语言与运行时

### 发现：Node.js 22+ 是刻意选择

**证据**:
```json
// package.json
"engines": { "node": ">=22.0.0" }
```

**逆向推理**:

1. **ESM First**: Node 22 默认 ESM 更稳定，agent-os 全程使用 `.js` 后缀 + `"type": "module"`
2. **crypto API 成熟度**: Node 22 的 `node:crypto` 包含 Ed25519 签名所需的完整 API，为 v0.2 升级做准备
3. **无 Deno 选择**: 生态上 npm 仍是主流，kbot 生态绑定 Node
4. **轻量化**: 无需 bundler runtime，直接 `node:crypto` / `node:crypto`

### 发现：零外部依赖策略

**证据**:
```bash
# package.json dependencies
{}
```

**逆向推理**:

| 原因 | 推导 |
|------|------|
| **安全审计简化** | 无依赖意味着无间接依赖漏洞 (供应链攻击面 = 0) |
| **冷启动速度** | `npm install` 即装即用，无 bundle 阶段 |
| **版本稳定性** | 不受第三方 breaking change 影响 |
| **审计友好** | 安全审查只看一个包的代码 |
| **POSIX 可移植性** | 纯 Node 内置 API 可移植到任何 Node 环境 |

### 发现：构建系统极简

**证据**:
```json
// package.json scripts
"build": "tsc",
"test": "vitest run",
"typecheck": "tsc --noEmit"
```

**逆向推理**:

1. **tsc 而非 esbuild/swift**: 纯类型检查 + 编译，不做 minification/bundling
2. **vitest 而非 jest**: 更快的测试运行，ESM native 支持
3. **无 rollup/vite**: 包是库而非应用，不需要 bundler

---

## 1.2 TypeScript 配置溯源

**证据**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "sourceMap": true
  }
}
```

**逆向推理**:

| 配置 | 选择理由 |
|------|----------|
| `ES2022` | Node 22 支持，顶级 await + 类字段 |
| `NodeNext` | 强制 ESM + 精确的类型解析 |
| `declaration: true` | 生成 `.d.ts` 供消费者类型检查 |
| `sourceMap: true` | 调试友好，审计时可追踪源码 |

---

## 1.3 核心 API 选择

### crypto API

**证据**:
```typescript
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
```

**逆向推理**:

| API | 用途 | 为什么用这个 |
|-----|------|--------------|
| `createHmac` | acap 签名 | v0.1 HMAC-SHA256，与 kbot-finance 一致 |
| `randomBytes` | AgentId 生成 | 密码学安全随机数 |
| `timingSafeEqual` | 签名验证 | 防止时序攻击 |

**关键发现**: 代码已预留 Ed25519 升级路径，但 v0.1/0.2 仍用 HMAC。注释明确说明:
> v0.1 uses HMAC-SHA256 for parity with kbot-finance's governance.ts.
> v0.2 upgrades to Ed25519.

### 时间 API

**证据**:
```typescript
const expires = Date.parse(acap.expires_at)
const now = (opts.now ?? new Date()).getTime()
```

**逆向推理**:
- **无 date-fns/luxon**: 零依赖策略
- **可选 now 参数**: 为测试预留时钟控制能力
- **ISO 8601 UTC**: 跨时区互操作标准

---

## 1.4 测试配置溯源

**证据**:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    testTimeout: 10_000,
  },
})
```

**逆向推理**:

| 配置 | 选择理由 |
|------|----------|
| `environment: node` | 非浏览器环境，无需 happy-dom/jsdom |
| `testTimeout: 10s` | 较长超时，预留异步 vault 操作 |
| 单一配置 | 无 env-specific 配置，代码平台无关 |

---

## 1.5 导出结构设计

**证据**:
```json
// package.json exports
{
  ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
  "./acap": { "import": "./dist/acap.js", "types": "./dist/acap.d.ts" },
  "./spawn": { "import": "./dist/spawn.js", "types": "./dist/spawn.d.ts" },
  "./audit": { "import": "./dist/audit.js" },        // 未实现
  "./vault": { "import": "./dist/vault.js" },
  "./outcomes": { "import": "./dist/outcomes.js" }
}
```

**逆向推理**:

1. **子路径导出**: 消费者可按需导入，减少打包体积
2. **`./audit` 是占位**: 注释说明 v0.2/0.3 实现
3. **条件导出**: ESM only，`"type": "module"` 确保

---

## 1.6 发布配置溯源

**证据**:
```json
// package.json
"publishConfig": { "access": "public" },
"repository": {
  "type": "git",
  "url": "git+https://github.com/isaacsight/kernel.git",
  "directory": "packages/agent-os"
}
```

**逆向推理**:

1. **public access**: npm 默认 scoped 包是 private，需显式 public
2. **directory field**: 支持 monorepo + 独立仓库双发布
3. **git+https**: 可追溯到源码，支持 GitHub 统计

---

## 1.7 技术栈决策总结

```
                    ┌─────────────────────────────┐
                    │    TypeScript + Node 22      │
                    │    零外部依赖策略            │
                    └─────────────┬───────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
   │  安全优先    │      │  可移植性    │      │  极简构建    │
   │  无供应链风险 │      │  纯内置 API  │      │  tsc + vitest│
   └──────────────┘      └──────────────┘      └──────────────┘
```

### 决策约束条件

1. **安全约束**: 金融级应用 (kbot-finance 生态)，不允许第三方依赖引入漏洞
2. **可移植性约束**: POSIX 定位暗示跨平台需求，纯 Node API 确保
3. **轻量级约束**: 包可能被嵌入各种环境，不能有沉重的依赖树
4. **kbot 生态一致性**: kbot 本身是 Node 项目，保持语言栈一致
