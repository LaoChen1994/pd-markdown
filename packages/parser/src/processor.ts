import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import { visit } from 'unist-util-visit'
import { parse as parseYaml } from 'yaml'
import type { Root, Yaml } from 'mdast'
import type { VFile } from 'vfile'

import type { Parser, ParserOptions, ParserPlugin, FileData } from './types'
import { transformHeading, transformList, transformTable } from './plugins'

/**
 * Default parser options
 */
const DEFAULT_OPTIONS: Required<Omit<ParserOptions, 'plugins'>> = {
  gfm: true,
  frontmatter: true,
}

/**
 * Create frontmatter extraction plugin
 */
function extractFrontmatter() {
  return (tree: Root, file: VFile) => {
    visit(tree, 'yaml', (node: Yaml) => {
      try {
        const data = parseYaml(node.value) as Record<string, unknown>
        ;(file.data as FileData).frontmatter = data
      } catch {
        // Invalid YAML, ignore
      }
    })
  }
}

/**
 * Create a markdown parser with the specified options
 *
 * @param options - Parser configuration options
 * @returns Parser instance with parse method
 */
export function createParser(options: ParserOptions = {}): Parser {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const customPlugins = options.plugins || []

  // Build processor (使用 any 绕过复杂的类型检查)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let processor: any = unified().use(remarkParse)

  // Add GFM support
  if (opts.gfm) {
    processor = processor.use(remarkGfm)
  }

  // Add frontmatter support
  if (opts.frontmatter) {
    processor = processor.use(remarkFrontmatter, ['yaml'])
  }

  // Run custom "before" plugins
  const beforePlugins = customPlugins.filter((p) => p.phase === 'before')
  for (const plugin of beforePlugins) {
    processor = processor.use(() => plugin.transform)
  }

  // Add frontmatter extraction
  if (opts.frontmatter) {
    processor = processor.use(extractFrontmatter)
  }

  // Add built-in transform plugins
  processor = processor
    .use(() => transformHeading)
    .use(() => transformList)
    .use(() => transformTable)

  // Run custom "after" plugins
  const afterPlugins = customPlugins.filter((p) => p.phase === 'after')
  for (const plugin of afterPlugins) {
    processor = processor.use(() => plugin.transform)
  }

  // Freeze processor
  processor.freeze()

  return {
    parse(content: string): Root {
      // Parse markdown to AST
      const tree = processor.parse(content) as Root

      // Run all transform plugins
      processor.runSync(tree)

      return tree
    },
  }
}

/**
 * Type-safe helper to define a parser plugin
 *
 * @param config - Plugin configuration
 * @returns Parser plugin
 */
export function definePlugin<T = void>(
  config: {
    name: string
    phase: 'before' | 'after'
    transform: (options?: T) => (tree: Root, file: VFile) => void
  },
  options?: T
): ParserPlugin {
  return {
    name: config.name,
    phase: config.phase,
    transform: config.transform(options),
  }
}
