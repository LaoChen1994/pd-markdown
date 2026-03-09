import type { FC, CSSProperties } from 'react'
import type { Root } from 'mdast'
import { createParser, type ParserOptions } from 'pd-markdown-parser'
import { NodeRenderer } from './NodeRenderer'
import type { ComponentMap } from './defaults'

export interface MarkdownRendererProps {
  /** Markdown source string (will be parsed) */
  source?: string
  /** Pre-parsed AST (skip parsing, useful for SSR) */
  ast?: Root
  /** Custom component overrides */
  components?: Partial<ComponentMap>
  /** CSS class name for wrapper */
  className?: string
  /** Inline styles for wrapper */
  style?: CSSProperties
  /** Parser options (only used when source is provided) */
  parserOptions?: ParserOptions
}

// Singleton parser for client-side use
let defaultParser: ReturnType<typeof createParser> | null = null

function getParser(options?: ParserOptions) {
  if (options) {
    return createParser(options)
  }
  if (!defaultParser) {
    defaultParser = createParser()
  }
  return defaultParser
}

/**
 * Main markdown renderer component
 *
 * Supports both client-side and server-side rendering:
 * - Pass `source` for automatic parsing
 * - Pass `ast` for pre-parsed content (SSR optimization)
 */
export const MarkdownRenderer: FC<MarkdownRendererProps> = ({
  source,
  ast,
  components = {},
  className,
  style,
  parserOptions,
}) => {
  // Use provided AST or parse source
  let tree: Root
  if (ast) {
    tree = ast
  } else if (source) {
    const parser = getParser(parserOptions)
    tree = parser.parse(source)
  } else {
    // No content provided
    return null
  }

  return (
    <div className={className} style={style}>
      <NodeRenderer node={tree} components={components} />
    </div>
  )
}
