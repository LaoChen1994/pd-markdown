import type { Root, Table, TableCell } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * Extended table data
 */
declare module 'mdast' {
  interface TableData {
    /** Header row */
    header?: TableRow
    /** Body rows */
    body?: TableRow[]
  }

  interface TableCellData {
    /** Whether this cell is in header */
    isHeader?: boolean
    /** Column alignment */
    align?: 'left' | 'center' | 'right' | null
    /** Column index */
    columnIndex?: number
  }
}

/**
 * Transform plugin that enhances table structure
 * - Separates header and body rows
 * - Adds alignment and index info to cells
 */
export function transformTable(tree: Root): void {
  visit(tree, 'table', (node: Table) => {
    if (node.children.length === 0) return

    const [headerRow, ...bodyRows] = node.children
    const align = node.align || []

    // Mark header row and cells
    if (headerRow) {
      headerRow.children.forEach((cell: TableCell, index: number) => {
        cell.data = cell.data || {}
        cell.data.isHeader = true
        cell.data.align = align[index] || null
        cell.data.columnIndex = index
      })
    }

    // Mark body cells
    bodyRows.forEach((row) => {
      row.children.forEach((cell: TableCell, index: number) => {
        cell.data = cell.data || {}
        cell.data.isHeader = false
        cell.data.align = align[index] || null
        cell.data.columnIndex = index
      })
    })

    // Store structured data on table node
    node.data = node.data || {}
    node.data.header = headerRow
    node.data.body = bodyRows
  })
}
