import { useMemo } from 'react'
import type { Root } from 'mdast'
import { createParser, type ParserOptions } from 'pd-markdown-parser'

// Cached parser instance
let cachedParser: ReturnType<typeof createParser> | null = null

function getParser(options?: ParserOptions) {
  if (options) {
    return createParser(options)
  }
  if (!cachedParser) {
    cachedParser = createParser()
  }
  return cachedParser
}

/**
 * Hook for parsing markdown on the client side
 *
 * @param source - Markdown source string
 * @param options - Parser options
 * @returns Parsed AST
 */
export function useMarkdown(source: string, options?: ParserOptions): Root {
  const ast = useMemo(() => {
    const parser = getParser(options)
    return parser.parse(source)
  }, [source, options])

  return ast
}
