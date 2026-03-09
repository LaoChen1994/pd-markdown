# Next.js RSC & SSR Demo

这个示例展示了如何在 Next.js 15+ (App Router) 中使用 `pd-markdown` 进行极速的服务端渲染 (SSR/SSG)。

## 核心设计模式：纯服务端渲染 (Pure RSC)

`pd-markdown` 采用了 **Shared Component** 架构，这意味着渲染器本身不依赖任何客户端 Context，可以作为 **React Server Component (RSC)** 运行。

### 1. 优势

- **零水和成本 (Zero Hydration)**: `MarkdownRenderer` 在服务端直接生成 HTML。浏览器收到 HTML 后不需要执行任何 JS 来“激活”内容。
- **极致的 Bundle Size**: 由于渲染逻辑留在服务端，浏览器不需要加载 Markdown 的渲染组件代码（除非你在客户端也用到了它）。
- **SEO 完美**: 搜索引擎爬虫能立即看到完整的 DOM 结构。

### 2. 工作流程

- **服务端 (Server)**: 使用 `pd-markdown/parser` 将 Markdown 文本解析为 AST。
- **服务端 (Server)**: 在同一个 Server Component 中，将 AST 传给 `MarkdownRenderer` 生成 HTML。

## 运行 demo

在项目根目录下执行：

```bash
pnpm install
cd examples/nextjs-demo
pnpm run dev
```

## 代码说明

- `lib/markdown.ts`: 纯服务端逻辑，负责解析。
- `app/page.tsx`: 服务端页面 (RSC)，直接调用 `MarkdownRenderer` 完成渲染。
