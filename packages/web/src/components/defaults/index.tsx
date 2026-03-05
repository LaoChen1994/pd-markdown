import * as React from 'react'

import { Heading } from './Heading'
import type { HeadingProps } from './Heading'
import { Paragraph } from './Paragraph'
import type { ParagraphProps } from './Paragraph'
import { List, ListItem } from './List'
import type { ListProps, ListItemProps } from './List'
import { Table, TableRow, TableCell } from './Table'
import type { TableProps, TableRowProps, TableCellProps } from './Table'
import { Code, InlineCodeComponent } from './Code'
import type { CodeProps, InlineCodeProps } from './Code'
import { Link } from './Link'
import type { LinkProps } from './Link'
import { Image } from './Image'
import type { ImageProps } from './Image'
import { Blockquote } from './Blockquote'
import type { BlockquoteProps } from './Blockquote'

// Re-export all components
export {
  Heading,
  Paragraph,
  List,
  ListItem,
  Table,
  TableRow,
  TableCell,
  Code,
  InlineCodeComponent,
  Link,
  Image,
  Blockquote,
}

// Re-export prop types
export type {
  HeadingProps,
  ParagraphProps,
  ListProps,
  ListItemProps,
  TableProps,
  TableRowProps,
  TableCellProps,
  CodeProps,
  InlineCodeProps,
  LinkProps,
  ImageProps,
  BlockquoteProps,
}

/**
 * Map of node types to their corresponding React components
 */
export interface ComponentMap {
  heading: React.FC<HeadingProps>
  paragraph: React.FC<ParagraphProps>
  list: React.FC<ListProps>
  listItem: React.FC<ListItemProps>
  table: React.FC<TableProps>
  tableRow: React.FC<TableRowProps>
  tableCell: React.FC<TableCellProps>
  code: React.FC<CodeProps>
  inlineCode: React.FC<InlineCodeProps>
  link: React.FC<LinkProps>
  image: React.FC<ImageProps>
  blockquote: React.FC<BlockquoteProps>
  // Allow custom node types
  [key: string]: React.FC<any>
}

/**
 * Default component map
 */
export const defaultComponents: ComponentMap = {
  heading: Heading,
  paragraph: Paragraph,
  list: List,
  listItem: ListItem,
  table: Table,
  tableRow: TableRow,
  tableCell: TableCell,
  code: Code,
  inlineCode: InlineCodeComponent,
  link: Link,
  image: Image,
  blockquote: Blockquote,
}
