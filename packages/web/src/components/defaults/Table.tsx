import type { FC, ReactNode } from 'react'
import type {
  Table as TableNode,
  TableRow as TableRowNode,
  TableCell as TableCellNode,
} from 'mdast'

export interface TableProps {
  node: TableNode
  children: ReactNode
}

export const Table: FC<TableProps> = ({ children }) => {
  return (
    <table>
      {children}
    </table>
  )
}

export interface TableRowProps {
  node: TableRowNode
  children: ReactNode
  isHeader?: boolean
}

export const TableRow: FC<TableRowProps> = ({ children, isHeader }) => {
  if (isHeader) {
    return (
      <thead>
        <tr>{children}</tr>
      </thead>
    )
  }
  return <tr>{children}</tr>
}

export interface TableCellProps {
  node: TableCellNode
  children: ReactNode
}

export const TableCell: FC<TableCellProps> = ({ node, children }) => {
  const isHeader = node.data?.isHeader
  const align = node.data?.align as 'left' | 'center' | 'right' | null
  const Tag = isHeader ? 'th' : 'td'
  const style = align ? { textAlign: align } : undefined

  return <Tag style={style}>{children}</Tag>
}
