import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NodeRenderer } from '../src/components/NodeRenderer'
import type { Root, Heading, Paragraph } from 'mdast'
import React from 'react'

const renderNode = (node: any, components = {}) => {
  return render(
    <NodeRenderer node={node} components={components} />
  )
}

describe('NodeRenderer', () => {
  it('should render root node', () => {
    const root: Root = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'Hello' }],
        } as Paragraph,
      ],
    }

    renderNode(root)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should render heading with correct level', () => {
    const heading: Heading = {
      type: 'heading',
      depth: 2,
      children: [{ type: 'text', value: 'Title' }],
    }

    renderNode(heading)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Title')
  })

  it('should render heading with id from data', () => {
    const heading: Heading = {
      type: 'heading',
      depth: 1,
      children: [{ type: 'text', value: 'Hello' }],
      data: { id: 'hello' },
    }

    renderNode(heading)
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'hello')
  })

  it('should render inline formatting', () => {
    const paragraph: Paragraph = {
      type: 'paragraph',
      children: [
        { type: 'text', value: 'Hello ' },
        { type: 'strong', children: [{ type: 'text', value: 'bold' }] },
        { type: 'text', value: ' and ' },
        { type: 'emphasis', children: [{ type: 'text', value: 'italic' }] },
      ],
    }

    const { container } = renderNode(paragraph)
    expect(container.querySelector('strong')).toHaveTextContent('bold')
    expect(container.querySelector('em')).toHaveTextContent('italic')
  })

  it('should handle unknown node types gracefully', () => {
    const unknown = {
      type: 'unknown-type',
      children: [
        { type: 'paragraph', children: [{ type: 'text', value: 'Content' }] },
      ],
    }

    // Should not throw and should try to render children
    renderNode(unknown)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should use custom component override', () => {
    const heading: Heading = {
      type: 'heading',
      depth: 1,
      children: [{ type: 'text', value: 'Custom' }],
    }

    const CustomHeading = ({ children }: { children: React.ReactNode }) => (
      <span data-testid="custom">{children}</span>
    )

    renderNode(heading, { heading: CustomHeading })
    expect(screen.getByTestId('custom')).toHaveTextContent('Custom')
  })
})
