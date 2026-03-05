# pd-markdown/web

React 组件库，用于渲染 Markdown，支持静态渲染和流式输出。

## 安装

```bash
npm install pd-markdown
```

**Peer Dependencies：**
- react >= 18.0.0
- react-dom >= 18.0.0

## 使用

### 基础渲染

```tsx
import { MarkdownRenderer } from 'pd-markdown/web'

function App() {
  const markdown = '# Hello World'
  return <MarkdownRenderer source={markdown} />
}
```

### 流式渲染 (专为 AI 场景优化)

支持实时显示正在生成的 Markdown 内容，带有光标指示器和区块加载动画。

```tsx
import { StreamMarkdownRenderer, useStreamMarkdown } from 'pd-markdown/web'

function AIConversation() {
  const stream = useStreamMarkdown()

  // 当收到新的内容块时
  const onNewData = (chunk: string) => {
    stream.append(chunk)
  }

  // 结束流
  const onDataDone = () => {
    stream.done()
  }

  return (
    <StreamMarkdownRenderer 
      source={stream.source} 
      ast={stream.ast} // 使用 hook 提供的预解析 AST 性能更佳
      isStreaming={stream.isStreaming}
      showCursor={true}
    />
  )
}
```

### 自定义组件覆盖

```tsx
import { MarkdownRenderer, type ComponentMap } from 'pd-markdown/web'

const components: Partial<ComponentMap> = {
  // 覆盖标题渲染
  heading: ({ node, children }) => (
    <h2 className={`heading-level-${node.depth}`}>{children}</h2>
  ),
  // 覆盖代码块渲染
  code: ({ node }) => (
    <pre><code>{node.value}</code></pre>
  )
}

function App() {
  return <MarkdownRenderer source={md} components={components} />
}
```

## API 参考

### 组件

#### `<MarkdownRenderer />`
用于普通 Markdown 字符串或 AST 的渲染。

#### `<StreamMarkdownRenderer />`
继承自 `MarkdownRenderer`，增加了对流式状态的支持。
- `showCursor`: `boolean` - 是否显示闪烁的光标。
- `enableAnimation`: `boolean` - 是否开启新内容飞入/淡入动画。
- `isStreaming`: `boolean` - 标记流是否活跃。

### Hooks

#### `useStreamMarkdown(options?)`
管理流式内容的状态管理 Hook。返回：
- `source`: 当前累计的所有文本。
- `ast`: 当前文本对应的 Root 节点。
- `isStreaming`: 是否正在流式传输中。
- `isDone`: 是否已完成。
- `append(chunk)`: 追加新的内容块。
- `done()`: 标记流已终结。
- `reset()`: 重置所有状态。

#### `useMarkdown(source, options?)`
用于手动触发解析并获取 AST 的 Hook。

## License

MIT
