import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarkdownRenderer } from '../src/components/MarkdownRenderer'
import { createParser } from 'pd-markdown-parser'

describe('MarkdownRenderer', () => {
  it('should render markdown string', () => {
    render(<MarkdownRenderer source="# Hello World" />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello World')
  })

  it('should render pre-parsed AST', () => {
    const parser = createParser()
    const ast = parser.parse('# From AST')

    render(<MarkdownRenderer ast={ast} />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('From AST')
  })

  it('should render nothing when no content provided', () => {
    const { container } = render(<MarkdownRenderer />)
    
    expect(container.firstChild).toBeNull()
  })

  it('should apply className', () => {
    const { container } = render(
      <MarkdownRenderer source="# Test" className="markdown-body" />
    )
    
    expect(container.firstChild).toHaveClass('markdown-body')
  })

  it('should apply inline styles', () => {
    const { container } = render(
      <MarkdownRenderer source="# Test" style={{ color: 'red' }} />
    )
    
    expect(container.firstChild).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('should support custom components override', () => {
    const CustomHeading = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-heading">{children}</div>
    )

    render(
      <MarkdownRenderer
        source="# Custom"
        components={{ heading: CustomHeading as any }}
      />
    )
    
    expect(screen.getByTestId('custom-heading')).toHaveTextContent('Custom')
  })

  it('should render multiple elements', () => {
    render(
      <MarkdownRenderer
        source={`
# Heading

Paragraph text.

- Item 1
- Item 2
        `.trim()}
      />
    )
    
    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByText('Paragraph text.')).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
  })
})

describe('MarkdownRenderer SSR compatibility', () => {
  it('should render from AST without re-parsing', () => {
    const parser = createParser()
    const ast = parser.parse('# Pre-rendered')

    // This simulates SSR where AST is passed directly
    const { container } = render(<MarkdownRenderer ast={ast} />)
    
    expect(container.querySelector('h1')).toHaveTextContent('Pre-rendered')
  })
})
