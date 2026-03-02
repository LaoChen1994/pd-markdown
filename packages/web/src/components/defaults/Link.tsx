import type { FC, ReactNode } from 'react'
import type { Link as LinkNode } from 'mdast'

export interface LinkProps {
  node: LinkNode
  children: ReactNode
}

export const Link: FC<LinkProps> = ({ node, children }) => {
  // Basic security: prevent javascript: URLs
  const href = node.url?.startsWith('javascript:') ? '#' : node.url

  return (
    <a href={href} title={node.title || undefined}>
      {children}
    </a>
  )
}
