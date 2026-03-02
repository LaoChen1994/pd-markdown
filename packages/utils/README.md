# pd-markdown/utils

Markdown 处理工具函数库。

## 安装

```bash
npm install pd-markdown
```

## API

### AST 遍历

```ts
import { traverseAst, traverseAstWithCallbacks } from 'pd-markdown/utils'

// 遍历所有节点
traverseAst(tree, (node, index, parent) => {
  console.log(node.type)
})

// 带回调的遍历
traverseAstWithCallbacks(tree, {
  heading: (node) => console.log('Found heading:', node.depth),
  paragraph: (node) => console.log('Found paragraph'),
})
```

### AST 查询

```ts
import { findNodes, findNode, findNodesBy, findParent } from 'pd-markdown/utils'

// 查找所有指定类型的节点
const headings = findNodes(tree, 'heading')

// 查找第一个匹配的节点
const firstHeading = findNode(tree, 'heading')

// 按条件查找
const h1Headings = findNodesBy(tree, 
  (node) => node.type === 'heading' && node.depth === 1
)

// 查找父节点
const parent = findParent(tree, someNode)
```

### 类型守卫

```ts
import { isParent, isLiteral, isNodeType } from 'pd-markdown/utils'

if (isParent(node)) {
  console.log('Children:', node.children)
}

if (isLiteral(node)) {
  console.log('Value:', node.value)
}

if (isNodeType(node, 'heading')) {
  console.log('Heading depth:', node.depth)
}
```

### Slug 生成

```ts
import { slugify, uniqueSlugify } from 'pd-markdown/utils'

// 基础 slug 生成
slugify('Hello World')        // 'hello-world'
slugify('API 参考')           // 'api-参考'
slugify('What is React?')     // 'what-is-react'

// 唯一 slug 生成（避免重复）
const slugs = new Set<string>()
slug = uniqueSlugify('Hello', slugs)  // 'hello'
slug = uniqueSlugify('Hello', slugs)  // 'hello-1'
slug = uniqueSlugify('Hello', slugs)  // 'hello-2'
```

### HTML 处理

```ts
import { escapeHtml, sanitizeHtml, stripHtml } from 'pd-markdown/utils'

// 转义 HTML 特殊字符
escapeHtml('<script>alert("xss")</script>')
// '&lt;script&gt;alert("xss")&lt;/script&gt;'

// 清理 HTML 标签
sanitizeHtml('<p>Hello</p>')  // 'Hello'

// 移除 HTML 标签
stripHtml('<p>Hello <b>World</b></p>')  // 'Hello World'
```

## 导出

```ts
// 类型
export type {
  MdNode,
  MdRoot,
  Parent,
  Literal,
  Visitor,
  PluginOptions,
  Position,
  Location,
}

// AST 操作
export { traverseAst, traverseAstWithCallbacks }
export { findNodes, findNode, findNodesBy, findParent }

// 类型守卫
export { isParent, isLiteral, isNodeType }

// 字符串处理
export { slugify, uniqueSlugify }
export { escapeHtml, sanitizeHtml, stripHtml }
```

## License

MIT
