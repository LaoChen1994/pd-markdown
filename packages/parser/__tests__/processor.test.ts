import { describe, it, expect } from 'vitest'
import { createParser, definePlugin } from '../src/processor'
import type { Root, Heading, Paragraph } from 'mdast'

describe('createParser', () => {
  it('should parse basic markdown', () => {
    const parser = createParser()
    const ast = parser.parse('# Hello World')

    expect(ast.type).toBe('root')
    expect(ast.children).toHaveLength(1)
    expect(ast.children[0].type).toBe('heading')
  })

  it('should parse paragraphs', () => {
    const parser = createParser()
    const ast = parser.parse('Hello world\n\nSecond paragraph')

    expect(ast.children).toHaveLength(2)
    expect(ast.children[0].type).toBe('paragraph')
    expect(ast.children[1].type).toBe('paragraph')
  })

  it('should parse inline elements', () => {
    const parser = createParser()
    const ast = parser.parse('Hello **bold** and *italic*')

    const paragraph = ast.children[0] as Paragraph
    expect(paragraph.children).toHaveLength(4)
    expect(paragraph.children[1].type).toBe('strong')
    expect(paragraph.children[3].type).toBe('emphasis')
  })

  it('should parse code blocks', () => {
    const parser = createParser()
    const ast = parser.parse('```js\nconsole.log("hello")\n```')

    expect(ast.children[0].type).toBe('code')
  })

  it('should parse links and images', () => {
    const parser = createParser()
    const ast = parser.parse('[Link](https://example.com) ![Image](image.png)')

    const paragraph = ast.children[0] as Paragraph
    expect(paragraph.children[0].type).toBe('link')
    expect(paragraph.children[2].type).toBe('image')
  })
})

describe('createParser with GFM', () => {
  it('should parse tables when gfm is enabled', () => {
    const parser = createParser({ gfm: true })
    const ast = parser.parse('| A | B |\n|---|---|\n| 1 | 2 |')

    expect(ast.children[0].type).toBe('table')
  })

  it('should parse task lists', () => {
    const parser = createParser({ gfm: true })
    const ast = parser.parse('- [x] Done\n- [ ] Todo')

    expect(ast.children[0].type).toBe('list')
  })

  it('should parse strikethrough', () => {
    const parser = createParser({ gfm: true })
    const ast = parser.parse('~~deleted~~')

    const paragraph = ast.children[0] as Paragraph
    expect(paragraph.children[0].type).toBe('delete')
  })

  it('should not parse GFM syntax when disabled', () => {
    const parser = createParser({ gfm: false })
    const ast = parser.parse('~~not deleted~~')

    const paragraph = ast.children[0] as Paragraph
    // Should be plain text, not delete node
    expect(paragraph.children[0].type).toBe('text')
  })
})

describe('createParser with frontmatter', () => {
  it('should parse YAML frontmatter', () => {
    const parser = createParser({ frontmatter: true })
    const ast = parser.parse('---\ntitle: Hello\nauthor: John\n---\n\n# Content')

    // Frontmatter should be in AST
    expect(ast.children[0].type).toBe('yaml')
  })

  it('should not parse frontmatter when disabled', () => {
    const parser = createParser({ frontmatter: false })
    const ast = parser.parse('---\ntitle: Hello\n---\n\n# Content')

    // Should be treated as thematic break
    expect(ast.children[0].type).toBe('thematicBreak')
  })
})

describe('createParser with custom plugins', () => {
  it('should run before plugins', () => {
    let visited = false
    const plugin = definePlugin({
      name: 'test-before',
      phase: 'before',
      transform: () => (tree) => {
        visited = true
      },
    })

    const parser = createParser({ plugins: [plugin] })
    parser.parse('# Hello')

    expect(visited).toBe(true)
  })

  it('should run after plugins', () => {
    let headingHasSlug = false
    const plugin = definePlugin({
      name: 'test-after',
      phase: 'after',
      transform: () => (tree) => {
        const heading = tree.children[0] as Heading
        // After built-in transforms, heading should have slug
        headingHasSlug = Boolean(heading.data?.id)
      },
    })

    const parser = createParser({ plugins: [plugin] })
    parser.parse('# Hello')

    expect(headingHasSlug).toBe(true)
  })
})
