# pd-markdown/web

React 组件库，用于渲染 Markdown。

## 安装

```bash
npm install pd-markdown
```

**Peer Dependencies：**
- react >= 18.0.0
- react-dom >= 18.0.0

## 使用

### 基础使用

```tsx
import { MarkdownRenderer } from 'pd-markdown/web'

function App() {
  const markdown = `
# Hello World

This is **markdown** content.
`

  return <MarkdownRenderer source={markdown} />
}
```

### 自定义组件

```tsx
import { MarkdownRenderer, type HeadingProps } from 'pd-markdown/web'

function CustomHeading({ node, children }: HeadingProps) {
  const Tag = `h${node.depth}` as const
  return <Tag className="custom-heading">{children}</Tag>
}

function App() {
  return (
    <MarkdownRenderer 
      source={markdown}
      components={{
        heading: CustomHeading,
      }}
    />
  )
}
```

### 使用 Hook

```tsx
import { useMarkdown, MarkdownRenderer } from 'pd-markdown/web'

function Editor({ source }) {
  const ast = useMarkdown(source)
  
  // 可以对 AST 进行操作
  
  return <MarkdownRenderer ast={ast} />
}
```

### SSR 优化

```tsx
// 服务端
import { createParser } from 'pd-markdown/parser'

const parser = createParser()
const ast = parser.parse(markdownContent)

// 传递给客户端
// 客户端直接渲染，跳过解析
<MarkdownRenderer ast={ast} />
```

## API

### `<MarkdownRenderer />`

主渲染组件。

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `source` | `string` | Markdown 源字符串 |
| `ast` | `Root` | 预解析的 AST |
| `components` | `Partial<ComponentMap>` | 自定义组件 |
| `className` | `string` | 包装器类名 |
| `style` | `CSSProperties` | 包装器样式 |
| `parserOptions` | `ParserOptions` | 解析器选项 |

### `useMarkdown(source, options?)`

解析 Markdown 的 Hook。

```tsx
const ast = useMarkdown(source, { gfm: true })
```

### 可自定义组件

| 组件名 | Props 类型 | 描述 |
| --- | --- | --- |
| `heading` | `HeadingProps` | 标题 |
| `paragraph` | `ParagraphProps` | 段落 |
| `list` | `ListProps` | 列表 |
| `listItem` | `ListItemProps` | 列表项 |
| `table` | `TableProps` | 表格 |
| `tableRow` | `TableRowProps` | 表格行 |
| `tableCell` | `TableCellProps` | 表格单元格 |
| `code` | `CodeProps` | 代码块 |
| `inlineCode` | `InlineCodeProps` | 行内代码 |
| `link` | `LinkProps` | 链接 |
| `image` | `ImageProps` | 图片 |
| `blockquote` | `BlockquoteProps` | 引用块 |

## 导出

```tsx
// 组件
export { MarkdownRenderer, NodeRenderer }
export type { MarkdownRendererProps, NodeRendererProps }

// 默认组件
export {
  Heading, Paragraph, List, ListItem,
  Table, TableRow, TableCell,
  Code, InlineCodeComponent,
  Link, Image, Blockquote,
  defaultComponents,
}
export type { ComponentMap, HeadingProps, ... }

// Hooks
export { useMarkdown }

// Context
export { MarkdownContext, useMarkdownContext }
export type { MarkdownContextValue }
```

## License

MIT
