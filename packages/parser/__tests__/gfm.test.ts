import { describe, it, expect } from 'vitest'
import { createParser } from '../src/processor'
import type { Table, List, ListItem } from 'mdast'

describe('GFM syntax support', () => {
  const parser = createParser({ gfm: true })

  describe('tables', () => {
    it('should parse basic table', () => {
      const ast = parser.parse(`
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
      `.trim())

      const table = ast.children[0] as Table
      expect(table.type).toBe('table')
      expect(table.children).toHaveLength(3) // 1 header + 2 body rows
    })

    it('should parse table with alignment', () => {
      const ast = parser.parse(`
| Left | Center | Right |
|:-----|:------:|------:|
| L    | C      | R     |
      `.trim())

      const table = ast.children[0] as Table
      expect(table.align).toEqual(['left', 'center', 'right'])
    })
  })

  describe('task lists', () => {
    it('should parse checked items', () => {
      const ast = parser.parse('- [x] Completed task')

      const list = ast.children[0] as List
      const item = list.children[0] as ListItem
      expect(item.checked).toBe(true)
    })

    it('should parse unchecked items', () => {
      const ast = parser.parse('- [ ] Pending task')

      const list = ast.children[0] as List
      const item = list.children[0] as ListItem
      expect(item.checked).toBe(false)
    })

    it('should parse mixed task list', () => {
      const ast = parser.parse(`
- [x] Done
- [ ] Not done
- Regular item
      `.trim())

      const list = ast.children[0] as List
      expect(list.children[0].checked).toBe(true)
      expect(list.children[1].checked).toBe(false)
      expect(list.children[2].checked).toBeNull()
    })
  })

  describe('strikethrough', () => {
    it('should parse strikethrough text', () => {
      const ast = parser.parse('~~deleted text~~')

      const paragraph = ast.children[0]
      expect(paragraph.type).toBe('paragraph')
      expect((paragraph as any).children[0].type).toBe('delete')
    })
  })

  describe('autolinks', () => {
    it('should parse URL autolinks', () => {
      const ast = parser.parse('Visit https://example.com for more')

      const paragraph = ast.children[0]
      expect((paragraph as any).children[1].type).toBe('link')
    })
  })
})
