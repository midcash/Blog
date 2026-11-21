---
title: "四步约束 AI 编程：从落契约到分层验收"
description: "先梳理“落契约、立门禁、AI 填肉、分层验收”四步 AI 协作开发流程的理论框架，再结合 pi-durable 统一触发层场景完成实践推演。"
pubDate: 2026-11-21
---

让 AI 稳定交付工程代码的关键，不是把需求一次抛给模型自由发挥，而是把**契约定义、用例设计、范围实现、分层验收**拆开：人负责立住系统边界与裁判规则，AI 在受控范围内负责填肉与自修。

---

## 一、理论框架：四步协作开发流程

### 1. 第一步：落契约（Contract）—— 写定系统的“宪法”

契约不是随便写几个类型定义，它必须包含 **4 样东西**：核心数据结构、模块接口签名、明确的错误分类，以及写成注释的**系统不变量（Invariants）**。

- **人做什么**：敲定业务规则和边界（例如：重复请求在窗口期内怎么处理？触发失败时由谁负责重试？）。
- **AI 做什么**：把口语规则翻译成严谨的类型定义和接口代码。
- **本阶段产物**：1 个纯接口文件（如 `contract.ts`，零业务逻辑，通常 50~80 行）。
- **完成标准**：逐行读完契约文件，确认所有字段、边界和错误语义完全符合预期。这份文件一旦敲定，后续阶段**禁止 AI 擅自修改**。

### 2. 第二步：立验收门禁（Acceptance Gate）—— 人定清单，AI 写测试

测试阶段最容易踩的坑，是让 AI“既写实现又自己编测试”——AI 会下意识照着自己写出来的 Bug 去凑测试断言，导致全绿但毫无意义。正确的协作方式是**把“设计用例”和“写测试代码”拆开**。

- **人做什么**：用自然语言写一张 **5~8 条的“验收测试清单”**，只盯最致命的业务路径和异常边界，不写具体测试代码。
- **AI 做什么**：基于契约文件和清单，生成可运行的自动化测试文件，以及内存版的 Fake / Mock 桩（替代真实外部依赖，保证测试毫秒级离线跑完）。
- **人如何验收测试代码**：**不用细看 Mock 和测试脚手架，只逐条核对每个 `it(...)` 里的 `expect(...)` 断言**，确认它真的在测清单里的那条规则，没有偷工减料。
- **本阶段产物**：
  - 自动化测试文件（如 `*.spec.ts`）
  - 一条一键执行的离线门禁命令（例如 `npm run typecheck && npm test` 或写入本地的 `check.py`）。此时跑门禁，结果应为**全红（Red）**，因为实现还没写。

### 3. 第三步：框定范围让 AI 填肉（Scoped Implementation）

前面两步把“边界”和“裁判”都立好了，这一步才真正放开让 AI 写代码。

- **人做什么**：只做两件事——**发范围指令**和**处理异常升级**。指令必须带明确约束：
  1. 严禁修改契约文件与测试文件；
  2. 不要引入多余的工厂类或抽象基类，逻辑保持扁平；
  3. 写完后自行运行门禁命令，直到类型检查和测试全绿。
- **AI 做什么**：写实现代码 → 跑门禁 → 报错自修 → 直到全绿。如果 AI 在写代码时发现“契约少了一个字段”或“某个边界条件契约没说清”，必须停下来汇报，**由人决定要不要回到第一步改契约**，绝不允许它自己把测试或接口改绿。
- **本阶段产物**：主干编排实现（通常 100~150 行）+ 适配层实现 + 门禁全绿的执行输出。

### 4. 第四步：分层验收与合并（Layered Review）

到这一步，不需要像传统 Code Review 那样从第 1 行看到第 1000 行，而是按文件层级分配精力：

- **机器 / AI 先做机械初筛**：
  - 跑一遍 `git diff --stat`，一眼确认改动范围——契约和测试文件有没有被偷改？有没有冒出一堆莫名其妙的辅助文件？
  - 让 AI 做一轮专项自检（比如检查未捕获的 Promise、资源或内存泄漏隐患等）。
- **人做分层精读**：
  - **主干层——逐行精读**：代码量很小，重点看数据流有没有绕过边界、核心锁与状态写入顺序对不对、异常分支有没有兜底。
  - **适配层——快速扫读**：只看有没有硬编码配置、有没有越权操作外部资源；具体的协议解析和格式拼装，只要类型检查和边界测试过了，直接放行。
- **本阶段产物**：一个边界清晰、门禁全绿、且自己完全掌握主干逻辑的 Commit / PR。

### 四个阶段总览

| 阶段 | 人的核心动作 | AI 的核心动作 | 关键产物 |
| --- | --- | --- | --- |
| **1. 落契约** | 定业务规则、数据结构、不变量 | 生成严谨接口、类型与错误定义 | `contract.ts`（纯契约，零实现） |
| **2. 立门禁** | 写 5~8 条核心与异常测试清单；审断言 | 写测试代码与内存 Fake / Mock 桩 | `*.spec.ts` + 一键门禁命令（红灯） |
| **3. AI 填肉** | 框定修改范围；审批契约变更请求 | 写主干与适配层，循环跑门禁修到绿灯 | `dispatcher.ts` + `adapters/*`（绿灯） |
| **4. 分层验收** | 检查改动边界；精读主干、扫读适配层 | 机械检查（Diff 越界、内存泄漏等） | 可直接合并的 PR / Commit |

---

## 二、实践推演：为 `pi-durable` 构建统一触发层

下面用一个具体场景把上述四步完整走一遍：**为 `pi-durable` 做一个统一触发层，支持“定时唤醒”和“外部事件（如 Webhook / IM）唤醒”，要求不重复执行、不丢状态。**

### 1. 落契约：敲定 `src/trigger/contract.ts`

先确定核心业务规则：外部来源必须先转换为统一事件格式；相同的 `idempotencyKey` 在 5 分钟去重窗口内只允许触发 1 次；触发失败时，必须能区分“已去重”“非法载荷（不重试）”和“引擎繁忙或锁冲突（上游退避重试）”。

由此落成纯接口契约文件 `src/trigger/contract.ts`：

```ts
// src/trigger/contract.ts

/** 1. 标准化事件结构（所有外部来源必须先转成这个格式） */
export interface TriggerEvent {
  eventId: string;
  idempotencyKey: string;   // 不变量：相同 key 在去重窗口内只允许触发 1 次
  source: "cron" | "webhook";
  sessionId: string;        // 要唤醒的 durable 会话 ID
  payload: Record<string, unknown>;
  occurredAt: number;       // Unix ms
}

/** 2. 明确的错误与结果分类（决定上游要不要重试） */
export type DispatchResult =
  | { status: "dispatched"; runId: string }
  | { status: "deduplicated" }                 // 已去重，上游视为成功，不要重试
  | { status: "rejected"; reason: string }     // 非法载荷，不要重试
  | { status: "retryable_error"; error: string }; // 引擎繁忙/锁冲突，上游应退避重试

/** 3. 下游依赖边界（用于解耦 pi-durable 真实引擎，方便离线测试） */
export interface DurableRuntimePort {
  resumeSession(sessionId: string, input: unknown): Promise<{ runId: string }>;
}

/** 4. 核心主干接口 */
export interface TriggerDispatcher {
  dispatch(event: TriggerEvent): Promise<DispatchResult>;
}
```

逐行审阅确认所有字段、错误分类和注释不变量无误后，冻结 `src/trigger/contract.ts`。

### 2. 立门禁：5 条验收清单与 `tests/trigger/dispatcher.spec.ts`

由人先用自然语言列出 5 条关键验收用例：

1. **正常唤醒**：合法的 `TriggerEvent` 进来，调用一次 `resumeSession`，返回 `dispatched`。
2. **幂等去重**：相同的 `idempotencyKey` 连续发两次，第二次必须返回 `deduplicated`，且 `resumeSession` 总共只被调用 1 次。
3. **并发防重**：相同的 `idempotencyKey` 在同一毫秒并发发两次，依然只允许触发 1 次。
4. **引擎异常不吞错**：`resumeSession` 抛错时，返回 `retryable_error`，且**不能**把这个 `idempotencyKey` 标记为已消费（否则后续重试会被误去重）。
5. **非法输入拦截**：缺少 `sessionId` 或 `idempotencyKey` 时，直接返回 `rejected`，绝不触碰下游引擎。

随后让 AI 基于 `src/trigger/contract.ts` 与这 5 条清单，生成 `tests/trigger/dispatcher.spec.ts` 以及内存版的 `FakeDurableRuntime`（替代真实 `pi-durable` 环境，保证测试毫秒级离线跑完）。人只需逐条检查每个 `it(...)` 中的 `expect(...)` 断言是否如实覆盖以上 5 条规则，再通过一键离线门禁命令（如 `npm run typecheck && npm test` 或本地 `check.py`）跑出 **全红（Red）** 基线。

### 3. AI 填肉：下发范围受控的实现指令

在契约与测试都冻结后，向 AI 下发带明确边界约束的指令：

> 请基于 `src/trigger/contract.ts` 实现 `src/trigger/dispatcher.ts`（主干编排）和 `src/trigger/adapters/cron.ts`（定时适配层）。要求：
>
> 1. **严禁修改 `contract.ts` 和 `tests/trigger/dispatcher.spec.ts`**；
> 2. 不要引入多余的工厂类或抽象基类，逻辑保持扁平；
> 3. 写完后自己运行门禁命令，直到类型检查和测试全绿。

AI 依次补齐主干实现 `src/trigger/dispatcher.ts`（通常 100~150 行）以及适配层 `src/trigger/adapters/cron.ts`、`src/trigger/adapters/webhook.ts`，并在循环跑门禁的过程中自行修复报错，直到类型检查与全部测试转绿（Green）。若实现过程中发现契约缺少字段或边界未约定，AI 必须停下升级问题，由人决定是否回到第一步修订契约。

### 4. 分层验收：初筛与重点精读

实现通过门禁后，按“先机械初筛、再分层精读”的方式完成合并前验收：

- **机械初筛**：
  - 执行 `git diff --stat`，确认 `src/trigger/contract.ts` 和 `tests/trigger/dispatcher.spec.ts` 未被改动，也没有多出意外的辅助文件。
  - 让 AI 针对实现做专项自检，例如检查是否存在未捕获的 Promise、内存去重表是否设置了 TTL 防止内存泄漏。
- **分层精读**：
  - **主干层（`src/trigger/dispatcher.ts`）—— 逐行精读**：重点只看 3 件事：数据流有没有绕过边界、去重锁与状态写入顺序对不对、异常分支有没有兜底。
  - **适配层（`src/trigger/adapters/*.ts`）—— 快速扫读**：只看有没有硬编码配置、有没有越权操作外部资源；Cron 与 Webhook 具体的协议解析和格式拼装，只要类型检查和边界测试通过即可放行。

确认以上检查项全部满足后，即可形成一个边界清晰、门禁全绿、且主干逻辑完全在掌控中的 Commit / PR 并推送合并。
