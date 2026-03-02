import type { FC, ReactNode } from 'react'
import type { Paragraph as ParagraphNode } from 'mdast'

export interface ParagraphProps {
  node: ParagraphNode
  children: ReactNode
}

export const Paragraph: FC<ParagraphProps> = ({ children }) => {
  return <p>{children}</p>
}
