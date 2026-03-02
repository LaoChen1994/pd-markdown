import type { FC } from 'react'
import type { Image as ImageNode } from 'mdast'

export interface ImageProps {
  node: ImageNode
}

export const Image: FC<ImageProps> = ({ node }) => {
  return <img src={node.url} alt={node.alt || ''} title={node.title || undefined} />
}
