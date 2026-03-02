import type { FC, ReactNode } from 'react'
import type { Code as CodeNode, InlineCode } from 'mdast'

export interface CodeProps {
  node: CodeNode
  children?: ReactNode
}

export const Code: FC<CodeProps> = ({ node }) => {
  const className = node.lang ? `language-${node.lang}` : undefined

  return (
    <pre>
      <code className={className}>{node.value}</code>
    </pre>
  )
}

export interface InlineCodeProps {
  node: InlineCode
  children?: ReactNode
}

export const InlineCodeComponent: FC<InlineCodeProps> = ({ node }) => {
  return <code>{node.value}</code>
}
