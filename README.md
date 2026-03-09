# pd-markdown

[![npm version](https://img.shields.io/npm/v/pd-markdown.svg?style=flat-square)](https://www.npmjs.com/package/pd-markdown)
[![tests](https://img.shields.io/badge/tests-163%20passed-success.svg?style=flat-square)](https://github.com/LaoChen1994/pd-markdown/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)

一个现代化的 Markdown 解析和渲染工具库，基于 unified/remark 构建，专为 React 和现代流式 Web 应用设计。

## 特性

- 🚀 **高性能解析** - 基于 unified/remark 的 Markdown 解析器
- ⚡ **流式渲染** - 专为 AI 场景设计的 `StreamMarkdownRenderer` 和 `useStreamMarkdown`
- 📝 **GFM 支持** - 完整支持 GitHub Flavored Markdown
- 📋 **Frontmatter** - 支持 YAML frontmatter 解析
- ⚛️ **React 组件** - 提供开箱即用的 React 渲染组件
- 🎨 **可定制** - 支持自定义组件覆盖（Heading, Code, Table 等）
- 🚀 **RSC & SSG 友好** - 完美支持 React Server Components，零水和 (Zero Hydration) 成本
- 🔗 **自动锚点** - 标题自动生成 slug 锚点
- 📦 **Tree-shakable** - 基于 ESM 设计，支持按需加载，最小化打包体积
- 🛠️ **现代兼容性** - 完美支持 Subpath Exports，确保在 Next.js、Vite 等现代开发环境下无缝解析
- 🛡️ **类型友好** - 完整的 TypeScript 定义，提供极致的开发体验

## 安装

```bash
# 使用 npm
npm install pd-markdown

# 使用 pnpm
pnpm add pd-markdown

# 使用 yarn
yarn add pd-markdown
```

## 模块结构

| 模块路径 | 描述 |
| :--- | :--- |
| `pd-markdown/parser` | **核心解析器**：将 Markdown 转换为标准 AST |
| `pd-markdown/web` | **React 渲染层**：包含渲染组件与流式处理 Hooks |
| `pd-markdown/utils` | **通用工具**：提供 AST 遍历、Slug 生成及字符串处理 |

## 快速开始

### 基础使用

```tsx
import { MarkdownRenderer } from 'pd-markdown/web'

function App() {
  const markdown = `
# Hello World

This is a **markdown** document.
`

  return <MarkdownRenderer source={markdown} />
}
```

### 在 Next.js Server Components (RSC) 中使用

`pd-markdown` 深度优化了服务端渲染场景。`MarkdownRenderer` 是一个 **Shared Component**，可以直接在服务端运行，生成纯 HTML，浏览器端**零 JS 负担**。

```tsx
// app/page.tsx (Next.js Server Component)
import { getMarkdownAst } from './lib/markdown'
import { MarkdownRenderer } from 'pd-markdown/web'

export default async function Page() {
  // 1. 服务端解析 Markdown 为 AST
  const ast = await getMarkdownAst(content)

  // 2. 服务端直接渲染为静态 HTML
  return (
    <main>
      <MarkdownRenderer ast={ast} />
    </main>
  )
}
```

> [!TIP]
> 这种模式完美支持 **SSG (静态站点生成)**，搜索引擎优化 (SEO) 友好且交互响应极快。

### 流式渲染 (AI 场景)

> [!NOTE]
> 流式渲染组件 (`StreamMarkdownRenderer`) 需要在客户端运行，已内置 `'use client'` 指令。

```tsx
import { StreamMarkdownRenderer, useStreamMarkdown } from 'pd-markdown/web'

function AIResponse() {
  const stream = useStreamMarkdown()

  // 模拟从流中读取数据
  const onNewChunk = (chunk: string) => {
    stream.append(chunk)
    if (isLastChunk) stream.done()
  }

  return (
    <StreamMarkdownRenderer 
      source={stream.source} 
      isStreaming={stream.isStreaming}
      showCursor={true}
    />
  )
}
```

### 使用预解析的 AST (SSR 优化)

```tsx
import { createParser } from 'pd-markdown/parser'
import { MarkdownRenderer } from 'pd-markdown/web'

// 服务端解析
const parser = createParser()
const ast = parser.parse(markdownContent)

// 客户端直接使用 AST，跳过解析
function Page({ ast }) {
  return <MarkdownRenderer ast={ast} />
}
```

## API 文档

### pd-markdown/parser

#### `createParser(options?)`

创建 Markdown 解析器实例。

```ts
import { createParser } from 'pd-markdown/parser'

const parser = createParser({
  gfm: true,           // 启用 GFM 支持（默认 true）
  frontmatter: true,   // 启用 frontmatter 解析（默认 true）
})

const ast = parser.parse('# Hello World')
```

### pd-markdown/web

#### `<MarkdownRenderer />`

主渲染组件。支持 `source` 字符串或预解析的 `ast`。

#### `<StreamMarkdownRenderer />`

流式渲染组件，专为实时生成的内容优化。

- `showCursor`: 是否显示打字机光标
- `enableAnimation`: 是否启用新块淡入动画
- `isStreaming`: 标记当前流是否仍在进行

#### `useStreamMarkdown(options?)`

管理流式 Markdown 状态的 Hook。

```ts
const { source, ast, append, done, reset } = useStreamMarkdown({
  parseDebounceMs: 30, // 解析防抖，优化超快流速下的性能
})
```

#### 自定义组件覆盖

`pd-markdown/web` 导出了所有的默认组件及其对应的 Props 类型（例如 `Heading`, `HeadingProps`, `Code`, `CodeProps` 等）。

你可以在自定义渲染器中引入它们，以实现**在默认样式基础上追加自定义功能**（如添加点击复制按钮、锚点链接），或者完全重写某个标签。

```tsx
import { 
  MarkdownRenderer, 
  Heading, 
  Code,
  type HeadingProps, 
  type ComponentMap 
} from 'pd-markdown/web'

const customComponents: Partial<ComponentMap> = {
  // 1. 包装默认组件 (在已有 Header 旁添加一个可点击的锚点)
  heading: (props: HeadingProps) => {
    return (
      <div className="custom-heading-wrapper group relative">
        <Heading {...props} />
        {props.node.data?.id && (
          <a 
            href={\`#\${props.node.data.id}\`} 
            className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-blue-500"
          >
            #
          </a>
        )}
      </div>
    )
  },

  // 2. 完全重写组件 (使用你自己的语法高亮库)
  code: ({ node, children }) => (
    <pre className="my-custom-pre bg-gray-900 text-white p-4 rounded">
      <code className={\`language-\${node.lang || 'text'}\`}>
        {node.value}
      </code>
    </pre>
  ),
}

function App() {
  return <MarkdownRenderer source={md} components={customComponents} />
}
```

### pd-markdown/utils

提供强大的 AST 遍历与处理工具。

```ts
import { traverseAst, findNodes, slugify } from 'pd-markdown/utils'

// 提取所有标题
const headings = findNodes(ast, 'heading')
```

## 示例 (Demos)

你可以参考 `examples` 目录下的项目：

- **[web-demo](./examples/web-demo)**: 基础的 Vite/React 客户端渲染示例。
- **[nextjs-demo](./examples/nextjs-demo)**: 基于 Next.js 15 App Router 的 **Server Components (RSC)** 与 **SSG** 最佳实践示例。

## 开发

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT
