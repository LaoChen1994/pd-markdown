import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMarkdown } from '../src/hooks/useMarkdown'

describe('useMarkdown', () => {
  it('should parse markdown string', () => {
    const { result } = renderHook(() => useMarkdown('# Hello'))

    expect(result.current.type).toBe('root')
    expect(result.current.children[0].type).toBe('heading')
  })

  it('should memoize result for same input', () => {
    const { result, rerender } = renderHook(
      ({ source }) => useMarkdown(source),
      { initialProps: { source: '# Hello' } }
    )

    const firstResult = result.current

    rerender({ source: '# Hello' })

    expect(result.current).toBe(firstResult)
  })

  it('should re-parse when source changes', () => {
    const { result, rerender } = renderHook(
      ({ source }) => useMarkdown(source),
      { initialProps: { source: '# First' } }
    )

    expect(result.current.children[0]).toHaveProperty('type', 'heading')

    rerender({ source: 'Just a paragraph' })

    expect(result.current.children[0]).toHaveProperty('type', 'paragraph')
  })

  it('should handle empty string', () => {
    const { result } = renderHook(() => useMarkdown(''))

    expect(result.current.type).toBe('root')
    expect(result.current.children).toHaveLength(0)
  })

  it('should parse complex markdown', () => {
    const { result } = renderHook(() =>
      useMarkdown(`
# Title

Paragraph with **bold** text.

- List item 1
- List item 2
      `.trim())
    )

    expect(result.current.children).toHaveLength(3)
    expect(result.current.children[0].type).toBe('heading')
    expect(result.current.children[1].type).toBe('paragraph')
    expect(result.current.children[2].type).toBe('list')
  })
})
