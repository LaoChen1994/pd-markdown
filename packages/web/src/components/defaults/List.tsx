import type { FC, ReactNode } from 'react'
import type { List as ListNode, ListItem as ListItemNode } from 'mdast'

export interface ListProps {
  node: ListNode
  children: ReactNode
}

export const List: FC<ListProps> = ({ node, children }) => {
  const Tag = node.ordered ? 'ol' : 'ul'
  const start = node.ordered && node.start != null && node.start !== 1 ? node.start : undefined

  return <Tag start={start}>{children}</Tag>
}

export interface ListItemProps {
  node: ListItemNode
  children: ReactNode
}

export const ListItem: FC<ListItemProps> = ({ node, children }) => {
  // Handle task list items
  if (typeof node.checked === 'boolean') {
    return (
      <li className="task-list-item">
        <input type="checkbox" checked={node.checked} readOnly />
        <span>{children}</span>
      </li>
    )
  }

  return <li>{children}</li>
}
