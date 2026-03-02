import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table, TableRow, TableCell } from '../../src/components/defaults/Table'
import type {
  Table as TableNode,
  TableRow as TableRowNode,
  TableCell as TableCellNode,
} from 'mdast'

describe('Table component', () => {
  it('should render table element', () => {
    const node: TableNode = {
      type: 'table',
      children: [],
    }

    const { container } = render(<Table node={node}>Content</Table>)
    expect(container.querySelector('table')).toBeInTheDocument()
  })
})

describe('TableRow component', () => {
  it('should render tr for body rows', () => {
    const node: TableRowNode = {
      type: 'tableRow',
      children: [],
    }

    const { container } = render(<TableRow node={node}>Cells</TableRow>)
    expect(container.querySelector('tr')).toBeInTheDocument()
    expect(container.querySelector('thead')).not.toBeInTheDocument()
  })

  it('should wrap header row in thead', () => {
    const node: TableRowNode = {
      type: 'tableRow',
      children: [],
    }

    const { container } = render(
      <TableRow node={node} isHeader>
        Cells
      </TableRow>
    )
    expect(container.querySelector('thead')).toBeInTheDocument()
    expect(container.querySelector('thead tr')).toBeInTheDocument()
  })
})

describe('TableCell component', () => {
  it('should render td for body cells', () => {
    const node: TableCellNode = {
      type: 'tableCell',
      children: [],
      data: { isHeader: false },
    }

    const { container } = render(<TableCell node={node}>Content</TableCell>)
    expect(container.querySelector('td')).toBeInTheDocument()
  })

  it('should render th for header cells', () => {
    const node: TableCellNode = {
      type: 'tableCell',
      children: [],
      data: { isHeader: true },
    }

    const { container } = render(<TableCell node={node}>Header</TableCell>)
    expect(container.querySelector('th')).toBeInTheDocument()
  })

  it('should apply left alignment', () => {
    const node: TableCellNode = {
      type: 'tableCell',
      children: [],
      data: { align: 'left' },
    }

    const { container } = render(<TableCell node={node}>Left</TableCell>)
    expect(container.querySelector('td')).toHaveStyle({ textAlign: 'left' })
  })

  it('should apply center alignment', () => {
    const node: TableCellNode = {
      type: 'tableCell',
      children: [],
      data: { align: 'center' },
    }

    const { container } = render(<TableCell node={node}>Center</TableCell>)
    expect(container.querySelector('td')).toHaveStyle({ textAlign: 'center' })
  })

  it('should apply right alignment', () => {
    const node: TableCellNode = {
      type: 'tableCell',
      children: [],
      data: { align: 'right' },
    }

    const { container } = render(<TableCell node={node}>Right</TableCell>)
    expect(container.querySelector('td')).toHaveStyle({ textAlign: 'right' })
  })
})
