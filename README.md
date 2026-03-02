# pd-markdown

一个现代化的 Markdown 解析和渲染工具库，基于 unified/remark 构建，支持 React。

## 特性

- 🚀 **高性能解析** - 基于 unified/remark 的 Markdown 解析器
- 📝 **GFM 支持** - 完整支持 GitHub Flavored Markdown
- 📋 **Frontmatter** - 支持 YAML frontmatter 解析
- ⚛️ **React 组件** - 提供开箱即用的 React 渲染组件
- 🎨 **可定制** - 支持自定义组件和插件
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
| `pd-markdown/web` | React 组件，用于渲染 Markdown |
| `pd-markdown/utils` | 工具函数库，提供 AST 操作和字符串处理 |

## 快速开始

### 基础使用

```tsx
import { MarkdownRenderer } from 'pd-markdown/web'

function App() {
  const markdown = `
# Hello World

This is a **markdown** document.

## Features

- GFM support
- Frontmatter parsing
- Custom components
`

  return <MarkdownRenderer source={markdown} />
}
```

### 使用预解析的 AST（SSR 优化）

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

### 使用 Hook

```tsx
import { useMarkdown, MarkdownRenderer } from 'pd-markdown/web'

function MarkdownPreview({ source }) {
  const ast = useMarkdown(source)
  
  // 可以对 AST 进行自定义处理
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
  plugins: [],         // 自定义插件
})

const ast = parser.parse('# Hello World')
```

#### `definePlugin(config)`

定义自定义解析器插件。

```ts
import { definePlugin } from 'pd-markdown/parser'

const myPlugin = definePlugin({
  name: 'my-plugin',
  phase: 'after',  // 'before' | 'after'
  transform: () => (tree, file) => {
    // 处理 AST
    console.log(tree)
  },
})
```

### pd-markdown/web

#### `<MarkdownRenderer />`

主渲染组件。

```tsx
interface MarkdownRendererProps {
  /** Markdown 源字符串（将被解析） */
  source?: string
  /** 预解析的 AST（跳过解析，适用于 SSR） */
  ast?: Root
  /** 自定义组件覆盖 */
  components?: Partial<ComponentMap>
  /** 包装器 CSS 类名 */
  className?: string
  /** 包装器内联样式 */
  style?: CSSProperties
  /** 解析器选项（仅在使用 source 时生效） */
  parserOptions?: ParserOptions
}
```

#### 自定义组件

```tsx
import { MarkdownRenderer, type ComponentMap } from 'pd-markdown/web'

const customComponents: Partial<ComponentMap> = {
  heading: ({ node, children }) => (
    <h2 className="custom-heading">{children}</h2>
  ),
  code: ({ node, children }) => (
    <pre className="custom-code-block">
      <code>{children}</code>
    </pre>
  ),
}

function App() {
  return (
    <MarkdownRenderer 
      source={markdown} 
      components={customComponents}
    />
  )
}
```

#### 可自定义的组件列表

| 组件名 | 对应节点 |
| --- | --- |
| `heading` | 标题 (h1-h6) |
| `paragraph` | 段落 |
| `list` | 列表 |
| `listItem` | 列表项 |
| `table` | 表格 |
| `tableRow` | 表格行 |
| `tableCell` | 表格单元格 |
| `code` | 代码块 |
| `inlineCode` | 行内代码 |
| `link` | 链接 |
| `image` | 图片 |
| `blockquote` | 引用块 |

### pd-markdown/utils

工具函数库，提供 AST 操作和字符串处理功能。

```ts
import {
  // AST 遍历
  traverseAst,
  findNodes,
  findNode,
  // 类型守卫
  isParent,
  isLiteral,
  isNodeType,
  // 字符串处理
  slugify,
  uniqueSlugify,
  escapeHtml,
  sanitizeHtml,
} from 'pd-markdown/utils'

// 查找所有标题节点
const headings = findNodes(ast, 'heading')

// 生成 slug
const slug = slugify('Hello World') // 'hello-world'
```

## 示例

### 博客文章渲染

```tsx
import { createParser } from 'pd-markdown/parser'
import { MarkdownRenderer } from 'pd-markdown/web'

const parser = createParser()

function BlogPost({ content }) {
  const ast = parser.parse(content)
  
  return (
    <article className="prose">
      <MarkdownRenderer 
        ast={ast}
        className="markdown-body"
      />
    </article>
  )
}
```

### 代码高亮

```tsx
import { MarkdownRenderer, type CodeProps } from 'pd-markdown/web'
import Prism from 'prismjs'

function CodeBlock({ node, children }: CodeProps) {
  const lang = node.lang || 'text'
  const highlighted = Prism.highlight(
    String(children),
    Prism.languages[lang] || Prism.languages.text,
    lang
  )
  
  return (
    <pre className={`language-${lang}`}>
      <code dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  )
}

function App() {
  return (
    <MarkdownRenderer 
      source={markdown}
      components={{ code: CodeBlock }}
    />
  )
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 运行测试
pnpm test

# 类型检查
pnpm typecheck
```

## License

MIT
