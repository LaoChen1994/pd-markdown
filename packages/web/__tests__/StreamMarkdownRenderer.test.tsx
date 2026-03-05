import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { StreamMarkdownRenderer } from '../src/components/StreamMarkdownRenderer'
import { createParser } from 'pd-markdown-parser'

describe('StreamMarkdownRenderer', () => {
  it('should render streaming markdown source', () => {
    render(<StreamMarkdownRenderer source="# Hello Stream" isStreaming={false} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello Stream')
  })

  it('should render nothing when no source and no ast provided', () => {
    const { container } = render(
      <StreamMarkdownRenderer source="" isStreaming={false} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should show cursor when streaming', () => {
    const { container } = render(
      <StreamMarkdownRenderer source="# Hello" isStreaming={true} showCursor={true} />
    )

    expect(container.querySelector('[data-streaming-cursor]')).toBeInTheDocument()
  })

  it('should hide cursor when not streaming', () => {
    const { container } = render(
      <StreamMarkdownRenderer source="# Hello" isStreaming={false} showCursor={true} />
    )

    expect(container.querySelector('[data-streaming-cursor]')).not.toBeInTheDocument()
  })

  it('should hide cursor when showCursor is false', () => {
    const { container } = render(
      <StreamMarkdownRenderer source="# Hello" isStreaming={true} showCursor={false} />
    )

    expect(container.querySelector('[data-streaming-cursor]')).not.toBeInTheDocument()
  })

  it('should show cursor even with no children when streaming', () => {
    // Empty source but streaming = true should still show cursor
    const { container } = render(
      <StreamMarkdownRenderer source=" " isStreaming={true} showCursor={true} />
    )

    expect(container.querySelector('[data-streaming-cursor]')).toBeInTheDocument()
  })

  it('should support custom cursor element', () => {
    const customCursor = <span data-testid="custom-cursor">|</span>

    render(
      <StreamMarkdownRenderer
        source="# Hello"
        isStreaming={true}
        cursorElement={customCursor}
      />
    )

    expect(screen.getByTestId('custom-cursor')).toBeInTheDocument()
  })

  it('should apply className to wrapper', () => {
    const { container } = render(
      <StreamMarkdownRenderer
        source="# Hello"
        isStreaming={false}
        className="stream-wrapper"
      />
    )

    expect(container.firstChild).toHaveClass('stream-wrapper')
  })

  it('should apply inline styles to wrapper', () => {
    const { container } = render(
      <StreamMarkdownRenderer
        source="# Hello"
        isStreaming={false}
        style={{ color: 'blue' }}
      />
    )

    expect(container.firstChild).toHaveStyle({ color: 'rgb(0, 0, 255)' })
  })

  it('should render pre-parsed AST', () => {
    const parser = createParser()
    const ast = parser.parse('# From AST')

    render(
      <StreamMarkdownRenderer
        source=""
        ast={ast}
        isStreaming={false}
      />
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('From AST')
  })

  it('should use external AST over internal parsing', () => {
    const parser = createParser()
    const ast = parser.parse('# External AST')

    render(
      <StreamMarkdownRenderer
        source="# Internal Source"
        ast={ast}
        isStreaming={false}
      />
    )

    // External AST should take priority
    expect(screen.getByRole('heading')).toHaveTextContent('External AST')
  })

  it('should mark last block with data-stream-block=active while streaming', () => {
    const { container } = render(
      <StreamMarkdownRenderer
        source={`# Title\n\nParagraph text`}
        isStreaming={true}
      />
    )

    const activeBlock = container.querySelector('[data-stream-block="active"]')
    expect(activeBlock).toBeInTheDocument()
  })

  it('should not have active stream block when not streaming', () => {
    const { container } = render(
      <StreamMarkdownRenderer
        source={`# Title\n\nParagraph text`}
        isStreaming={false}
      />
    )

    const activeBlock = container.querySelector('[data-stream-block="active"]')
    expect(activeBlock).not.toBeInTheDocument()
  })

  it('should render multiple markdown elements', () => {
    render(
      <StreamMarkdownRenderer
        source={`# Title\n\nSome paragraph.\n\n- Item 1\n- Item 2`}
        isStreaming={false}
      />
    )

    expect(screen.getByRole('heading')).toHaveTextContent('Title')
    expect(screen.getByText('Some paragraph.')).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('should support custom component overrides', () => {
    const CustomHeading = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-stream-heading">{children}</div>
    )

    render(
      <StreamMarkdownRenderer
        source="# Custom"
        isStreaming={false}
        components={{ heading: CustomHeading as any }}
      />
    )

    expect(screen.getByTestId('custom-stream-heading')).toHaveTextContent('Custom')
  })

  it('should inject keyframe styles into document head', () => {
    render(
      <StreamMarkdownRenderer source="# Test" isStreaming={true} />
    )

    const styleEl = document.getElementById('pd-md-stream-styles')
    expect(styleEl).toBeInTheDocument()
    expect(styleEl?.textContent).toContain('pd-md-cursor-blink')
  })
})
