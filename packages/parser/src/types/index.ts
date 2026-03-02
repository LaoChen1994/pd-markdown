import type { Root } from 'mdast'
import type { VFile } from 'vfile'

/**
 * Parser plugin configuration
 */
export interface ParserPlugin {
  /** Unique plugin name */
  name: string
  /** When to run: before or after built-in transforms */
  phase: 'before' | 'after'
  /** Transform function */
  transform: (tree: Root, file: VFile) => void
}

/**
 * Parser options
 */
export interface ParserOptions {
  /** Custom plugins to add */
  plugins?: ParserPlugin[]
  /** Enable GFM syntax (default: true) */
  gfm?: boolean
  /** Enable frontmatter parsing (default: true) */
  frontmatter?: boolean
}

/**
 * Parser instance
 */
export interface Parser {
  /** Parse markdown string to AST */
  parse(content: string): Root
}

/**
 * Plugin definition helper config
 */
export interface PluginConfig<T = unknown> {
  /** Plugin name */
  name: string
  /** When to run */
  phase: 'before' | 'after'
  /** Transform function factory */
  transform: (options?: T) => (tree: Root, file: VFile) => void
}

/**
 * Frontmatter data extracted from markdown
 */
export interface FrontmatterData {
  [key: string]: unknown
}

/**
 * Extended file data with frontmatter
 */
export interface FileData {
  frontmatter?: FrontmatterData
}
