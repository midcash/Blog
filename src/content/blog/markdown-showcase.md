---
title: "示例文章：Markdown 排版演示"
description: "第二篇示例文章，用来验证新增 Markdown 文件后列表和阅读页会自动生成，并展示常见排版元素。"
pubDate: 2026-02-01
---

> 这是一篇示例文章，仅用于验证内容流程和展示排版，不代表我的真实经历或观点。

## 标题层级

### 三级标题

#### 四级标题

## 列表

无序列表：

- 第一项
- 第二项
  - 嵌套项
  - 另一个嵌套项

有序列表：

1. 第一步
2. 第二步
3. 第三步

## 链接与引用

这是一个[外部链接](https://astro.build/)。引用如下：

> 简洁是可靠的前提之一。

## 代码块

行内代码：`npm run build`。

```js
export function greet(name) {
  return `Hello, ${name}!`;
}
```

下面这一行故意写得很长，用来验证长代码块可以横向滚动，而不会撑破页面：

```js
const veryLongLine = "这是一段很长的示例内容，用来检查代码块在窄屏幕上是否只在自身内部横向滚动，而不会让整个页面出现横向溢出。The quick brown fox jumps over the lazy dog. 0123456789 abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ";
```

## 分隔线

---

示例结束。
