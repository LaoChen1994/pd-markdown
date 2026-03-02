import { describe, it, expect } from 'vitest'
import { findNodes, findNode, findNodesBy, findParent } from '../src/ast/query'
import type { Root, Paragraph, Text, Heading, Strong } from 'mdast'

describe('findNodes', () => {
  const createAst = (): Root => ({
    type: 'root',
    children: [
      {
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: 'Title' }],
      } as Heading,
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'Hello ' },
          {
            type: 'strong',
            children: [{ type: 'text', value: 'world' }],
          } as Strong,
        ],
      } as Paragraph,
      {
        type: 'heading',
        depth: 2,
        children: [{ type: 'text', value: 'Subtitle' }],
      } as Heading,
    ],
  })

  it('should find all nodes of specified type', () => {
    const ast = createAst()
    const headings = findNodes<Heading>(ast, 'heading')

    expect(headings).toHaveLength(2)
    expect(headings[0].depth).toBe(1)
    expect(headings[1].depth).toBe(2)
  })

  it('should find nested nodes', () => {
    const ast = createAst()
    const texts = findNodes<Text>(ast, 'text')

    expect(texts).toHaveLength(4)
    expect(texts.map((t) => t.value)).toEqual([
      'Title',
      'Hello ',
      'world',
      'Subtitle',
    ])
  })

  it('should return empty array when no matches', () => {
    const ast = createAst()
    const codes = findNodes(ast, 'code')

    expect(codes).toEqual([])
  })
})

describe('findNode', () => {
  const createAst = (): Root => ({
    type: 'root',
    children: [
      {
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: 'First' }],
      } as Heading,
      {
        type: 'heading',
        depth: 2,
        children: [{ type: 'text', value: 'Second' }],
      } as Heading,
    ],
  })

  it('should find first matching node', () => {
    const ast = createAst()
    const heading = findNode<Heading>(ast, 'heading')

    expect(heading).toBeDefined()
    expect(heading!.depth).toBe(1)
  })

  it('should return undefined when no match', () => {
    const ast = createAst()
    const code = findNode(ast, 'code')

    expect(code).toBeUndefined()
  })
})

describe('findNodesBy', () => {
  const createAst = (): Root => ({
    type: 'root',
    children: [
      {
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: 'H1' }],
      } as Heading,
      {
        type: 'heading',
        depth: 2,
        children: [{ type: 'text', value: 'H2' }],
      } as Heading,
      {
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: 'Another H1' }],
      } as Heading,
    ],
  })

  it('should find nodes matching predicate', () => {
    const ast = createAst()
    const h1s = findNodesBy<Heading>(
      ast,
      (node) => node.type === 'heading' && (node as Heading).depth === 1
    )

    expect(h1s).toHaveLength(2)
    expect(h1s[0].children[0]).toHaveProperty('value', 'H1')
    expect(h1s[1].children[0]).toHaveProperty('value', 'Another H1')
  })
})

describe('findParent', () => {
  it('should find parent of a node', () => {
    const textNode: Text = { type: 'text', value: 'Hello' }
    const paragraph: Paragraph = {
      type: 'paragraph',
      children: [textNode],
    }
    const ast: Root = {
      type: 'root',
      children: [paragraph],
    }

    const parent = findParent(ast, textNode)
    expect(parent).toBe(paragraph)
  })

  it('should return undefined for root node', () => {
    const ast: Root = {
      type: 'root',
      children: [],
    }

    const parent = findParent(ast, ast)
    expect(parent).toBeUndefined()
  })
})
