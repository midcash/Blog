# 我的网站

一个用于发布开发实践与学习笔记的个人网站 MVP。访客可以从首页浏览文章列表，进入 Markdown 文章阅读正文，再返回首页；新增文章只需要添加一个 Markdown 文件，不需要修改路由或首页代码。

## 技术选择

- [Astro](https://astro.build/) 7.3.8：默认生成静态网站。
- Markdown：文章保存在 `src/content/blog`，通过 Astro Content Collections 读取和校验。
- 原生 CSS：样式集中在 `src/styles/global.css`，未使用主题或 UI 组件库。
- 未引入 React 或其他前端框架。
- 包管理器：npm，依赖锁定在 `package-lock.json`。

## 环境要求

| 项目 | 要求 | 本次验证使用 |
| --- | --- | --- |
| Node.js | `>=22.12.0`（Astro 7.3.8 的要求） | 22.20.0 |
| npm | `>=9.6.5` | 10.9.3 |

仓库中的 `.nvmrc` 指定了 Node.js 22。如果使用 nvm，可以运行：

```bash
nvm use
```

## 安装与运行

在项目根目录执行：

```bash
# 安装依赖（首次安装或更新依赖时）
npm install

# 按锁文件安装（CI 或干净副本推荐）
npm ci

# 启动开发服务器，默认 http://localhost:4321
npm run dev

# 生成静态网站到 dist/
npm run build

# 预览本次构建的生产版本，默认 http://localhost:4321
npm run preview
```

如果 4321 端口已被占用，可以显式指定端口：

```bash
npm run dev -- --port 4322
npm run preview -- --port 4323
```

## 修改网站信息

| 内容 | 位置 |
| --- | --- |
| 网站名称（页头、页脚、页面标题） | `src/layouts/BaseLayout.astro` 中的 `siteName` |
| 首页大标题和一句话介绍 | `src/pages/index.astro` 中的 `<h1>` 和 `.lead` 段落 |
| 关于页占位介绍 | `src/pages/about.astro` |
| 默认页面描述 | `src/layouts/BaseLayout.astro` 中 `description` 的默认值 |
| 全站样式 | `src/styles/global.css` |

关于页目前是明确的占位内容，请替换成你自己的介绍。项目中没有编造学校、公司、履历或联系方式。

## 新增文章

1. 在 `src/content/blog` 中新建一个 `.md` 文件，例如 `my-first-post.md`。
2. 在文件开头填写 frontmatter。
3. 用 Markdown 编写正文。
4. 运行 `npm run dev` 预览，或运行 `npm run build` 生成静态页面。

文件名会决定文章地址。例如 `my-first-post.md` 对应 `/blog/my-first-post/`。新增文件后，首页列表和文章阅读页会自动生成，无需修改页面代码。

### 文章元数据

每篇文章必须包含以下三个字段：

```yaml
---
title: "文章标题"
description: "首页展示的一句话简介。"
pubDate: 2026-02-01
---
```

| 字段 | 类型 | 约束 |
| --- | --- | --- |
| `title` | 字符串 | 必填，不能为空 |
| `description` | 字符串 | 必填，不能为空，用于首页简介和页面描述 |
| `pubDate` | 日期 | 必填，推荐使用 `YYYY-MM-DD` 格式 |

约束定义在 `src/content.config.ts`。字段缺失或为空时，构建会失败并给出校验错误，而不是生成不完整的页面。文章按 `pubDate` 从新到旧排序。

### 示例文章

仓库中有两篇明确标注为示例的文章：

- `src/content/blog/hello-world.md`：介绍如何新增文章。
- `src/content/blog/markdown-showcase.md`：展示标题、列表、链接、引用和代码块等排版。

它们不是站点所有者的真实经历。发布自己的内容前，可以删除或替换这两个文件。

## 目录结构

```text
.
├── public/
│   └── favicon.svg
├── src/
│   ├── content/
│   │   └── blog/                 # Markdown 文章
│   ├── content.config.ts         # 文章集合与元数据校验
│   ├── layouts/
│   │   └── BaseLayout.astro      # 全站 HTML 骨架、导航、页脚
│   ├── lib/
│   │   └── posts.ts              # 日期格式化、排序和文章路径
│   ├── pages/
│   │   ├── index.astro           # 首页文章列表
│   │   ├── about.astro           # 关于页
│   │   └── blog/
│   │       └── [...slug].astro   # 根据 Markdown 文件生成阅读页
│   └── styles/
│       └── global.css            # 全站原生 CSS
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## 构建与部署

`npm run build` 会生成纯静态文件到 `dist/`，可以把该目录部署到任意静态托管服务。本仓库本次没有配置自动部署、CI、搜索、评论、登录、数据库或访问统计，这些不在 MVP 范围内。

`node_modules/`、`dist/` 和 `.astro/` 已被 `.gitignore` 忽略，不会提交到仓库。
