import { describe, it, expect } from 'vitest'
import { createParser } from '../../src/processor'
import type { Table, TableRow, TableCell } from 'mdast'

describe('transformTable', () => {
  const parser = createParser({ gfm: true })

  it('should mark header cells', () => {
    const ast = parser.parse(`
| A | B |
|---|---|
| 1 | 2 |
    `.trim())

    const table = ast.children[0] as Table
    const headerRow = table.children[0] as TableRow
    const headerCell = headerRow.children[0] as TableCell

    expect(headerCell.data?.isHeader).toBe(true)
  })

  it('should mark body cells', () => {
    const ast = parser.parse(`
| A | B |
|---|---|
| 1 | 2 |
    `.trim())

    const table = ast.children[0] as Table
    const bodyRow = table.children[1] as TableRow
    const bodyCell = bodyRow.children[0] as TableCell

    expect(bodyCell.data?.isHeader).toBe(false)
  })

  it('should add alignment info to cells', () => {
    const ast = parser.parse(`
| Left | Center | Right |
|:-----|:------:|------:|
| L    | C      | R     |
    `.trim())

    const table = ast.children[0] as Table
    const headerRow = table.children[0] as TableRow

    expect(headerRow.children[0].data?.align).toBe('left')
    expect(headerRow.children[1].data?.align).toBe('center')
    expect(headerRow.children[2].data?.align).toBe('right')

    // Body cells should also have alignment
    const bodyRow = table.children[1] as TableRow
    expect(bodyRow.children[0].data?.align).toBe('left')
    expect(bodyRow.children[1].data?.align).toBe('center')
    expect(bodyRow.children[2].data?.align).toBe('right')
  })

  it('should add column index to cells', () => {
    const ast = parser.parse(`
| A | B | C |
|---|---|---|
| 1 | 2 | 3 |
    `.trim())

    const table = ast.children[0] as Table
    const headerRow = table.children[0] as TableRow

    expect(headerRow.children[0].data?.columnIndex).toBe(0)
    expect(headerRow.children[1].data?.columnIndex).toBe(1)
    expect(headerRow.children[2].data?.columnIndex).toBe(2)
  })

  it('should store header and body in table data', () => {
    const ast = parser.parse(`
| Header |
|--------|
| Body 1 |
| Body 2 |
    `.trim())

    const table = ast.children[0] as Table

    expect(table.data?.header).toBeDefined()
    expect(table.data?.body).toHaveLength(2)
  })
})
