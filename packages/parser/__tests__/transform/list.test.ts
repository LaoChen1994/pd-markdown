import { describe, it, expect } from 'vitest'
import { createParser } from '../../src/processor'
import type { List, ListItem } from 'mdast'

describe('transformList', () => {
  const parser = createParser()

  it('should add index to unordered list items', () => {
    const ast = parser.parse(`
- First
- Second
- Third
    `.trim())

    const list = ast.children[0] as List
    expect(list.children[0].data?.index).toBe(0)
    expect(list.children[1].data?.index).toBe(1)
    expect(list.children[2].data?.index).toBe(2)
  })

  it('should add correct index to ordered list items', () => {
    const ast = parser.parse(`
1. First
2. Second
3. Third
    `.trim())

    const list = ast.children[0] as List
    expect(list.ordered).toBe(true)
    expect(list.children[0].data?.index).toBe(1)
    expect(list.children[1].data?.index).toBe(2)
    expect(list.children[2].data?.index).toBe(3)
  })

  it('should handle ordered list with custom start', () => {
    const ast = parser.parse(`
5. Fifth
6. Sixth
7. Seventh
    `.trim())

    const list = ast.children[0] as List
    expect(list.start).toBe(5)
    expect(list.children[0].data?.index).toBe(5)
    expect(list.children[1].data?.index).toBe(6)
    expect(list.children[2].data?.index).toBe(7)
  })

  it('should handle nested lists', () => {
    const ast = parser.parse(`
- Parent
  - Child 1
  - Child 2
- Another parent
    `.trim())

    const outerList = ast.children[0] as List
    expect(outerList.children[0].data?.index).toBe(0)
    expect(outerList.children[1].data?.index).toBe(1)

    // Check nested list
    const parentItem = outerList.children[0] as ListItem
    const nestedList = parentItem.children[1] as List
    expect(nestedList.children[0].data?.index).toBe(0)
    expect(nestedList.children[1].data?.index).toBe(1)
  })
})
