import type { FC, ReactNode } from 'react'
import type { Content, Root, PhrasingContent, Parent } from 'mdast'
import { useMarkdownContext } from './context'
import { defaultComponents } from './defaults'

export interface NodeRendererProps {
  node: Content | Root
}

/**
 * Recursive node renderer that renders AST nodes to React elements
 */
export const NodeRenderer: FC<NodeRendererProps> = ({ node }) => {
  const { components } = useMarkdownContext()

  // Get the component for this node type
  const getComponent = (type: string) => {
    return components[type] || defaultComponents[type]
  }

  // Render children nodes
  const renderChildren = (children: Content[]): ReactNode => {
    return children.map((child, index) => (
      <NodeRenderer key={index} node={child} />
    ))
  }

  // Render phrasing content (inline elements)
  const renderPhrasingContent = (children: PhrasingContent[]): ReactNode => {
    return children.map((child, index) => {
      switch (child.type) {
        case 'text':
          return child.value

        case 'strong':
          return <strong key={index}>{renderPhrasingContent(child.children)}</strong>

        case 'emphasis':
          return <em key={index}>{renderPhrasingContent(child.children)}</em>

        case 'delete':
          return <del key={index}>{renderPhrasingContent(child.children)}</del>

        case 'inlineCode': {
          const InlineCode = getComponent('inlineCode')
          return InlineCode ? <InlineCode key={index} node={child} /> : <code key={index}>{child.value}</code>
        }

        case 'link': {
          const Link = getComponent('link')
          return Link ? (
            <Link key={index} node={child}>
              {renderPhrasingContent(child.children)}
            </Link>
          ) : (
            <a key={index} href={child.url}>
              {renderPhrasingContent(child.children)}
            </a>
          )
        }

        case 'image': {
          const Image = getComponent('image')
          return Image ? <Image key={index} node={child} /> : <img key={index} src={child.url} alt={child.alt || ''} />
        }

        case 'break':
          return <br key={index} />

        case 'html':
          // For safety, render HTML as text in React
          return child.value

        default:
          // For unknown inline types, try to render as text if possible
          if ('value' in child && typeof child.value === 'string') {
            return child.value
          }
          if ('children' in child) {
            return renderPhrasingContent((child as any).children)
          }
          return null
      }
    })
  }

  // Handle different node types
  switch (node.type) {
    case 'root':
      return <>{renderChildren(node.children)}</>

    case 'heading': {
      const Heading = getComponent('heading')
      return Heading ? (
        <Heading node={node}>{renderPhrasingContent(node.children)}</Heading>
      ) : null
    }

    case 'paragraph': {
      const Paragraph = getComponent('paragraph')
      return Paragraph ? (
        <Paragraph node={node}>{renderPhrasingContent(node.children)}</Paragraph>
      ) : null
    }

    case 'list': {
      const List = getComponent('list')
      return List ? (
        <List node={node}>{renderChildren(node.children)}</List>
      ) : null
    }

    case 'listItem': {
      const ListItem = getComponent('listItem')
      const children = node.children.map((child, index) => {
        // Unwrap single paragraph in list item
        if (child.type === 'paragraph' && node.children.length === 1) {
          return renderPhrasingContent(child.children)
        }
        return <NodeRenderer key={index} node={child} />
      })
      return ListItem ? <ListItem node={node}>{children}</ListItem> : null
    }

    case 'table': {
      const Table = getComponent('table')
      const TableRow = getComponent('tableRow')
      
      if (!Table || !TableRow) return null

      const [headerRow, ...bodyRows] = node.children

      return (
        <Table node={node}>
          {headerRow && (
            <TableRow node={headerRow} isHeader>
              {headerRow.children.map((cell, index) => (
                <NodeRenderer key={index} node={cell} />
              ))}
            </TableRow>
          )}
          {bodyRows.length > 0 && (
            <tbody>
              {bodyRows.map((row, rowIndex) => (
                <TableRow key={rowIndex} node={row}>
                  {row.children.map((cell, cellIndex) => (
                    <NodeRenderer key={cellIndex} node={cell} />
                  ))}
                </TableRow>
              ))}
            </tbody>
          )}
        </Table>
      )
    }

    case 'tableCell': {
      const TableCell = getComponent('tableCell')
      return TableCell ? (
        <TableCell node={node}>{renderPhrasingContent(node.children)}</TableCell>
      ) : null
    }

    case 'code': {
      const Code = getComponent('code')
      return Code ? <Code node={node} /> : null
    }

    case 'blockquote': {
      const Blockquote = getComponent('blockquote')
      return Blockquote ? (
        <Blockquote node={node}>{renderChildren(node.children)}</Blockquote>
      ) : null
    }

    case 'thematicBreak':
      return <hr />

    case 'html':
      // For safety, don't render raw HTML by default
      return null

    case 'yaml':
      // Frontmatter shouldn't be rendered
      return null

    default: {
      // Try to find a custom component for unknown types
      const CustomComponent = getComponent(node.type)
      if (CustomComponent) {
        const children = 'children' in node 
          ? renderChildren((node as Parent).children as Content[])
          : undefined
        return <CustomComponent node={node}>{children}</CustomComponent>
      }
      
      // Fallback: try to render children if available
      if ('children' in node) {
        return <>{renderChildren((node as Parent).children as Content[])}</>
      }
      
      return null
    }
  }
}
