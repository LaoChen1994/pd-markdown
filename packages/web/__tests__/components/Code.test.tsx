import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Code, InlineCodeComponent } from '../../src/components/defaults/Code'
import type { Code as CodeNode, InlineCode } from 'mdast'

describe('Code component', () => {
  it('should render code block', () => {
    const node: CodeNode = {
      type: 'code',
      value: 'const x = 1',
    }

    const { container } = render(<Code node={node} />)
    expect(container.querySelector('pre code')).toHaveTextContent('const x = 1')
  })

  it('should add language class', () => {
    const node: CodeNode = {
      type: 'code',
      lang: 'javascript',
      value: 'const x = 1',
    }

    const { container } = render(<Code node={node} />)
    expect(container.querySelector('code')).toHaveClass('language-javascript')
  })

  it('should handle missing language', () => {
    const node: CodeNode = {
      type: 'code',
      value: 'plain text',
    }

    const { container } = render(<Code node={node} />)
    expect(container.querySelector('code')).not.toHaveClass()
  })

  it('should preserve whitespace', () => {
    const node: CodeNode = {
      type: 'code',
      value: 'line 1\n  line 2\n    line 3',
    }

    const { container } = render(<Code node={node} />)
    expect(container.querySelector('code')?.textContent).toBe(
      'line 1\n  line 2\n    line 3'
    )
  })
})

describe('InlineCodeComponent', () => {
  it('should render inline code', () => {
    const node: InlineCode = {
      type: 'inlineCode',
      value: 'code',
    }

    render(<InlineCodeComponent node={node} />)
    expect(screen.getByText('code').tagName).toBe('CODE')
  })

  it('should not be wrapped in pre', () => {
    const node: InlineCode = {
      type: 'inlineCode',
      value: 'inline',
    }

    const { container } = render(<InlineCodeComponent node={node} />)
    expect(container.querySelector('pre')).not.toBeInTheDocument()
  })
})
