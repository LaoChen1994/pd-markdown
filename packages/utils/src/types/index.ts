import type { Root, Content, Parent, Literal } from 'mdast'
import type { Node as UnistNode } from 'unist'

// Re-export mdast types
export type { Root, Content, Parent, Literal }

/**
 * All possible markdown node types
 */
export type MdNode = Root | Content

/**
 * Root node of markdown AST
 */
export type MdRoot = Root

/**
 * Visitor function for AST traversal
 */
export type Visitor<T extends UnistNode = MdNode> = (
  node: T,
  index: number | undefined,
  parent: Parent | undefined
) => void | boolean

/**
 * Plugin options base interface
 */
export interface PluginOptions {
  [key: string]: unknown
}

/**
 * Position information in source
 */
export interface Position {
  line: number
  column: number
  offset?: number
}

/**
 * Location in source
 */
export interface Location {
  start: Position
  end: Position
}

/**
 * Type guard to check if node is a parent node
 */
export function isParent(node: UnistNode): node is Parent {
  return 'children' in node && Array.isArray((node as Parent).children)
}

/**
 * Type guard to check if node is a literal node
 */
export function isLiteral(node: UnistNode): node is Literal {
  return 'value' in node && typeof (node as Literal).value === 'string'
}

/**
 * Type guard to check if node has specific type
 */
export function isNodeType<T extends MdNode>(
  node: UnistNode,
  type: T['type']
): node is T {
  return node.type === type
}
