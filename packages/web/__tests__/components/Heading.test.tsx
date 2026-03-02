import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Heading } from '../../src/components/defaults/Heading'
import type { Heading as HeadingNode } from 'mdast'

describe('Heading component', () => {
  it('should render h1', () => {
    const node: HeadingNode = {
      type: 'heading',
      depth: 1,
      children: [{ type: 'text', value: 'Title' }],
    }

    render(<Heading node={node}>Title</Heading>)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('should render h2', () => {
    const node: HeadingNode = {
      type: 'heading',
      depth: 2,
      children: [],
    }

    render(<Heading node={node}>Subtitle</Heading>)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('should render h3-h6', () => {
    for (let depth = 3; depth <= 6; depth++) {
      const node: HeadingNode = {
        type: 'heading',
        depth: depth as 1 | 2 | 3 | 4 | 5 | 6,
        children: [],
      }

      const { unmount } = render(<Heading node={node}>Heading</Heading>)
      expect(screen.getByRole('heading', { level: depth })).toBeInTheDocument()
      unmount()
    }
  })

  it('should add id from data', () => {
    const node: HeadingNode = {
      type: 'heading',
      depth: 1,
      children: [],
      data: { id: 'my-heading' },
    }

    render(<Heading node={node}>My Heading</Heading>)
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'my-heading')
  })

  it('should handle missing data', () => {
    const node: HeadingNode = {
      type: 'heading',
      depth: 1,
      children: [],
    }

    render(<Heading node={node}>No ID</Heading>)
    expect(screen.getByRole('heading')).not.toHaveAttribute('id')
  })
})
