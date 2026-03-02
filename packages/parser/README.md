# pd-markdown/parser

基于 unified/remark 的 Markdown 解析器，将 Markdown 转换为 AST。

## 安装

```bash
npm install pd-markdown
```

## 使用

### 基础解析

```ts
import { createParser } from 'pd-markdown/parser'

const parser = createParser()
const ast = parser.parse('# Hello World')

console.log(ast)
// {
//   type: 'root',
//   children: [
//     { type: 'heading', depth: 1, children: [...] }
//   ]
// }
```

### 解析选项

```ts
const parser = createParser({
  gfm: true,           // 启用 GFM 支持（默认 true）
  frontmatter: true,   // 启用 frontmatter 解析（默认 true）
})
```

### Frontmatter 支持

解析 YAML frontmatter：

```ts
const markdown = `---
title: My Article
date: 2024-01-01
---

# Hello World
`

const parser = createParser({ frontmatter: true })
const ast = parser.parse(markdown)
```

### 自定义插件

```ts
import { createParser, definePlugin } from 'pd-markdown/parser'

const myPlugin = definePlugin({
  name: 'my-plugin',
  phase: 'after',
  transform: () => (tree, file) => {
    // 处理 AST
    console.log('Processing tree:', tree.type)
  },
})

const parser = createParser({
  plugins: [myPlugin],
})
```

## API

### `createParser(options?)`

创建解析器实例。

**参数：**
- `options.gfm` - 启用 GFM 支持（默认 `true`）
- `options.frontmatter` - 启用 frontmatter 解析（默认 `true`）
- `options.plugins` - 自定义插件数组

**返回：**
- `Parser` 实例，包含 `parse(content)` 方法

### `definePlugin(config)`

定义自定义插件。

**参数：**
- `config.name` - 插件名称
- `config.phase` - 执行阶段：`'before'` 或 `'after'`
- `config.transform` - 转换函数

## 导出

```ts
// 核心函数
export { createParser, definePlugin }

// 类型
export type {
  Parser,
  ParserOptions,
  ParserPlugin,
  PluginConfig,
  FrontmatterData,
  FileData,
}

// 内置转换插件（高级用法）
export { transformHeading, transformList, transformTable }
```

## License

MIT
