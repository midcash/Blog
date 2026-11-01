---
title: "示例文章：如何新增一篇文章"
description: "这是一篇示例文章，演示如何通过新增 Markdown 文件发布内容。"
pubDate: 2026-01-15
---

> 这是一篇示例文章，用来演示网站的发布流程。它不是我的个人经历记录，发布真实文章前可以删除或替换。

## 这个网站如何组织文章

文章保存在 `src/content/blog` 目录中，每篇文章是一个 Markdown 文件。文件名会作为文章地址的一部分。

例如：

- 文件：`src/content/blog/hello-world.md`
- 地址：`/blog/hello-world/`

新增文章时，不需要修改首页或路由代码。构建时会自动读取该目录下的所有 Markdown 文件。

## 需要准备的元数据

每篇文章开头需要一段 frontmatter，包含以下字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | 字符串 | 文章标题 |
| `description` | 字符串 | 首页展示的简介 |
| `pubDate` | 日期 | 发布日期，格式为 `YYYY-MM-DD` |

示例：

````yaml
---
title: "文章标题"
description: "一句话介绍这篇文章。"
pubDate: 2026-02-01
---
````

## 发布步骤

1. 在 `src/content/blog` 中新建 `.md` 文件。
2. 填写上面的元数据。
3. 用 Markdown 编写正文。
4. 运行 `npm run dev` 在本地预览，或运行 `npm run build` 生成静态网站。

## 支持的正文写法

正文支持标题层级、列表、链接、引用和代码块等常见 Markdown 语法。例如，这是一个[指向 Astro 文档的链接](https://docs.astro.build/)。

```js
export function greet(name) {
  return `Hello, ${name}!`;
}
```
