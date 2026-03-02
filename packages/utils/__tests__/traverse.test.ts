import { describe, it, expect, vi } from 'vitest'
import { traverseAst, traverseAstWithCallbacks } from '../src/ast/traverse'
import type { Root, Paragraph, Text, Heading } from 'mdast'

describe('traverseAst', () => {
  const createSimpleAst = (): Root => ({
    type: 'root',
    children: [
      {
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: 'Title' }],
      } as Heading,
      {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Content' }],
      } as Paragraph,
    ],
  })

  it('should visit all nodes in depth-first order', () => {
    const ast = createSimpleAst()
    const visited: string[] = []

    traverseAst(ast, (node) => {
      visited.push(node.type)
    })

    expect(visited).toEqual(['root', 'heading', 'text', 'paragraph', 'text'])
  })

  it('should skip children when visitor returns false', () => {
    const ast = createSimpleAst()
    const visited: string[] = []

    traverseAst(ast, (node) => {
      visited.push(node.type)
      if (node.type === 'heading') {
        return false // Skip children of heading
      }
    })

    expect(visited).toEqual(['root', 'heading', 'paragraph', 'text'])
  })

  it('should provide correct index and parent', () => {
    const ast = createSimpleAst()
    const visitor = vi.fn()

    traverseAst(ast, visitor)

    // Root has no index and no parent
    expect(visitor).toHaveBeenNthCalledWith(1, ast, undefined, undefined)

    // Heading is at index 0 with root as parent
    expect(visitor).toHaveBeenNthCalledWith(2, ast.children[0], 0, ast)
  })

  it('should handle empty children', () => {
    const ast: Root = {
      type: 'root',
      children: [],
    }
    const visited: string[] = []

    traverseAst(ast, (node) => {
      visited.push(node.type)
    })

    expect(visited).toEqual(['root'])
  })
})

describe('traverseAstWithCallbacks', () => {
  const createSimpleAst = (): Root => ({
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Hello' }],
      } as Paragraph,
    ],
  })

  it('should call enter and leave in correct order', () => {
    const ast = createSimpleAst()
    const events: string[] = []

    traverseAstWithCallbacks(ast, {
      enter: (node) => {
        events.push(`enter:${node.type}`)
      },
      leave: (node) => {
        events.push(`leave:${node.type}`)
      },
    })

    expect(events).toEqual([
      'enter:root',
      'enter:paragraph',
      'enter:text',
      'leave:text',
      'leave:paragraph',
      'leave:root',
    ])
  })

  it('should skip children when enter returns false', () => {
    const ast = createSimpleAst()
    const events: string[] = []

    traverseAstWithCallbacks(ast, {
      enter: (node) => {
        events.push(`enter:${node.type}`)
        if (node.type === 'paragraph') {
          return false
        }
      },
      leave: (node) => {
        events.push(`leave:${node.type}`)
      },
    })

    expect(events).toEqual([
      'enter:root',
      'enter:paragraph',
      'leave:paragraph',
      'leave:root',
    ])
  })
})
