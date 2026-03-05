# pd-markdown

一个现代化的 Markdown 解析和渲染工具库，基于 unified/remark 构建，专为 React 和现代流式 Web 应用设计。

## 特性

- 🚀 **高性能解析** - 基于 unified/remark 的 Markdown 解析器
- ⚡ **流式渲染** - 专为 AI 场景设计的 `StreamMarkdownRenderer` 和 `useStreamMarkdown`
- 📝 **GFM 支持** - 完整支持 GitHub Flavored Markdown
- 📋 **Frontmatter** - 支持 YAML frontmatter 解析
- ⚛️ **React 组件** - 提供开箱即用的 React 渲染组件
- 🎨 **可定制** - 支持自定义组件覆盖（Heading, Code, Table 等）
- 🔗 **自动锚点** - 标题自动生成 slug 锚点
- 📦 **Tree-shakable** - 支持 ESM，优化打包体积

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
| --- | --- |
| `pd-markdown/parser` | Markdown 解析器，将 Markdown 转换为 AST |
| `pd-markdown/web` | React 组件和 Hooks，用于渲染 Markdown 和处理流式内容 |
| `pd-markdown/utils` | 工具函数库，提供 AST 操作和字符串处理 |

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

### 流式渲染 (AI 场景)

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

```tsx
import { MarkdownRenderer, type ComponentMap } from 'pd-markdown/web'

const customComponents: Partial<ComponentMap> = {
  heading: ({ node, children }) => (
    <h2 style={{ color: 'blue' }}>{children}</h2>
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

## 开发

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT
