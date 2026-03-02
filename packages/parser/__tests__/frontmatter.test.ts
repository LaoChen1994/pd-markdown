import { describe, it, expect } from 'vitest'
import { createParser } from '../src/processor'
import type { Yaml } from 'mdast'

describe('Frontmatter support', () => {
  describe('YAML frontmatter', () => {
    it('should parse YAML frontmatter block', () => {
      const parser = createParser({ frontmatter: true })
      const ast = parser.parse(`---
title: My Article
author: John Doe
date: 2024-01-01
---

# Content here`)

      expect(ast.children[0].type).toBe('yaml')
      const yaml = ast.children[0] as Yaml
      expect(yaml.value).toContain('title: My Article')
    })

    it('should parse nested YAML values', () => {
      const parser = createParser({ frontmatter: true })
      const ast = parser.parse(`---
meta:
  keywords:
    - markdown
    - parser
  category: tech
---

Content`)

      const yaml = ast.children[0] as Yaml
      expect(yaml.value).toContain('keywords:')
    })

    it('should handle empty frontmatter', () => {
      const parser = createParser({ frontmatter: true })
      const ast = parser.parse(`---
---

Content`)

      expect(ast.children[0].type).toBe('yaml')
    })
  })

  describe('without frontmatter', () => {
    it('should not parse frontmatter when disabled', () => {
      const parser = createParser({ frontmatter: false })
      const ast = parser.parse(`---
title: Test
---

Content`)

      // First child should be thematicBreak, not yaml
      expect(ast.children[0].type).toBe('thematicBreak')
    })

    it('should parse content without frontmatter', () => {
      const parser = createParser({ frontmatter: true })
      const ast = parser.parse('# Just a heading\n\nSome content')

      expect(ast.children[0].type).toBe('heading')
    })
  })
})
