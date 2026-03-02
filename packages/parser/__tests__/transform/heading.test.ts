import { describe, it, expect } from 'vitest'
import { createParser } from '../../src/processor'
import type { Heading } from 'mdast'

describe('transformHeading', () => {
  const parser = createParser()

  it('should add slug to heading', () => {
    const ast = parser.parse('# Hello World')

    const heading = ast.children[0] as Heading;
    console.log('heading =>', heading)
    expect(heading.data?.id).toBe('hello-world')
  })

  it('should generate unique slugs for duplicate headings', () => {
    const ast = parser.parse(`
# Hello
# Hello
# Hello
    `.trim())

    const headings = ast.children as Heading[]
    expect(headings[0].data?.id).toBe('hello')
    expect(headings[1].data?.id).toBe('hello-1')
    expect(headings[2].data?.id).toBe('hello-2')
  })

  it('should handle headings with inline formatting', () => {
    const ast = parser.parse('# Hello **bold** and *italic*')

    const heading = ast.children[0] as Heading
    expect(heading.data?.id).toBe('hello-bold-and-italic')
  })

  it('should handle headings with special characters', () => {
    const ast = parser.parse('# What is Markdown?')

    const heading = ast.children[0] as Heading
    expect(heading.data?.id).toBe('what-is-markdown')
  })

  it('should handle Chinese headings', () => {
    const ast = parser.parse('# 你好世界')

    const heading = ast.children[0] as Heading
    expect(heading.data?.id).toBe('你好世界')
  })

  it('should add hProperties for compatibility', () => {
    const ast = parser.parse('# Test Heading')

    const heading = ast.children[0] as Heading
    expect((heading.data?.hProperties as any)?.id).toBe('test-heading')
  })
})
