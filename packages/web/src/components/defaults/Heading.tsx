import type { FC, ReactNode } from 'react'
import type { Heading as HeadingNode } from 'mdast'

export interface HeadingProps {
  node: HeadingNode
  children: ReactNode
}

export const Heading: FC<HeadingProps> = ({ node, children }) => {
  const Tag = `h${node.depth}` as const
  const id = node.data && 'id' in node.data ? (node.data.id as string) : undefined

  return <Tag id={id}>{children}</Tag>
}
