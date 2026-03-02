import type { Node } from 'unist'
import type { MdNode, Parent } from '../types'
import { isParent } from '../types'

/**
 * Find all nodes of a specific type in the AST
 *
 * @param node - Root node to search from
 * @param type - Node type to find
 * @returns Array of matching nodes
 */
export function findNodes<T extends Node = MdNode>(
  node: Node,
  type: string
): T[] {
  const results: T[] = []

  function visit(current: Node): void {
    if (current.type === type) {
      results.push(current as T)
    }

    if (isParent(current)) {
      for (const child of current.children) {
        visit(child)
      }
    }
  }

  visit(node)
  return results
}

/**
 * Find the first node of a specific type in the AST
 *
 * @param node - Root node to search from
 * @param type - Node type to find
 * @returns The first matching node or undefined
 */
export function findNode<T extends Node = MdNode>(
  node: Node,
  type: string
): T | undefined {
  let result: T | undefined

  function visit(current: Node): boolean {
    if (current.type === type) {
      result = current as T
      return true // Found, stop searching
    }

    if (isParent(current)) {
      for (const child of current.children) {
        if (visit(child)) {
          return true
        }
      }
    }

    return false
  }

  visit(node)
  return result
}

/**
 * Find all nodes matching a predicate
 *
 * @param node - Root node to search from
 * @param predicate - Function to test each node
 * @returns Array of matching nodes
 */
export function findNodesBy<T extends Node = MdNode>(
  node: Node,
  predicate: (node: Node) => boolean
): T[] {
  const results: T[] = []

  function visit(current: Node): void {
    if (predicate(current)) {
      results.push(current as T)
    }

    if (isParent(current)) {
      for (const child of current.children) {
        visit(child)
      }
    }
  }

  visit(node)
  return results
}

/**
 * Get the parent of a node in the AST
 * Note: This requires traversing from root, use sparingly
 *
 * @param root - Root node of the AST
 * @param target - Node to find parent of
 * @returns Parent node or undefined if not found or is root
 */
export function findParent(root: Node, target: Node): Parent | undefined {
  let result: Parent | undefined

  function visit(current: Node, parent: Parent | undefined): boolean {
    if (current === target) {
      result = parent
      return true
    }

    if (isParent(current)) {
      for (const child of current.children) {
        if (visit(child, current)) {
          return true
        }
      }
    }

    return false
  }

  visit(root, undefined)
  return result
}
