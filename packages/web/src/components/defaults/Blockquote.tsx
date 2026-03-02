import type { FC, ReactNode } from 'react'
import type { Blockquote as BlockquoteNode } from 'mdast'

export interface BlockquoteProps {
  node: BlockquoteNode
  children: ReactNode
}

export const Blockquote: FC<BlockquoteProps> = ({ children }) => {
  return <blockquote>{children}</blockquote>
}
