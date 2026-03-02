import type { Node } from 'unist'
import type { Parent, MdNode, Visitor } from '../types'
import { isParent } from '../types'

/**
 * Traverse AST in depth-first order
 *
 * @param node - Root node to start traversal
 * @param visitor - Visitor function called for each node
 *                  Return `false` to skip children of current node
 *                  Return `true` or `undefined` to continue
 */
export function traverseAst<T extends Node = MdNode>(
  node: T,
  visitor: Visitor<T>
): void {
  function visit(
    current: T,
    index: number | undefined,
    parent: Parent | undefined
  ): void {
    const result = visitor(current, index, parent)

    // Skip children if visitor returns false
    if (result === false) {
      return
    }

    if (isParent(current)) {
      const children = current.children as T[]
      for (let i = 0; i < children.length; i++) {
        visit(children[i], i, current as unknown as Parent)
      }
    }
  }

  visit(node, undefined, undefined)
}

/**
 * Traverse AST with enter and leave callbacks
 *
 * @param node - Root node to start traversal
 * @param callbacks - Object with optional enter and leave functions
 */
export function traverseAstWithCallbacks<T extends Node = MdNode>(
  node: T,
  callbacks: {
    enter?: Visitor<T>
    leave?: Visitor<T>
  }
): void {
  const { enter, leave } = callbacks

  function visit(
    current: T,
    index: number | undefined,
    parent: Parent | undefined
  ): void {
    const shouldSkipChildren = enter?.(current, index, parent) === false

    if (!shouldSkipChildren && isParent(current)) {
      const children = current.children as T[]
      for (let i = 0; i < children.length; i++) {
        visit(children[i], i, current as unknown as Parent)
      }
    }

    leave?.(current, index, parent)
  }

  visit(node, undefined, undefined)
}
