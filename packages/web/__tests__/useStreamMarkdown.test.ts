import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStreamMarkdown } from '../src/hooks/useStreamMarkdown'

describe('useStreamMarkdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useStreamMarkdown())

    expect(result.current.source).toBe('')
    expect(result.current.ast.type).toBe('root')
    expect(result.current.ast.children).toHaveLength(0)
    expect(result.current.isStreaming).toBe(false)
    expect(result.current.isDone).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should start streaming on first append', () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useStreamMarkdown({ onStart }))

    act(() => {
      result.current.append('# Hello')
    })

    expect(result.current.isStreaming).toBe(true)
    expect(result.current.isDone).toBe(false)
    expect(onStart).toHaveBeenCalledOnce()
  })

  it('should accumulate source text on append', () => {
    const { result } = renderHook(() => useStreamMarkdown())

    act(() => {
      result.current.append('# He')
      result.current.append('llo')
    })

    // Source is accumulated but parsing is debounced
    // After debounce, parse
    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current.source).toBe('# Hello')
  })

  it('should call onChunk callback with chunk and full text', () => {
    const onChunk = vi.fn()
    const { result } = renderHook(() => useStreamMarkdown({ onChunk }))

    act(() => {
      result.current.append('Hello ')
    })

    expect(onChunk).toHaveBeenCalledWith('Hello ', 'Hello ')

    act(() => {
      result.current.append('World')
    })

    expect(onChunk).toHaveBeenCalledWith('World', 'Hello World')
  })

  it('should parse AST after debounce', () => {
    const { result } = renderHook(() =>
      useStreamMarkdown({ parseDebounceMs: 50 })
    )

    act(() => {
      result.current.append('# Hello')
    })

    // Before debounce, AST may not be updated yet
    act(() => {
      vi.advanceTimersByTime(60)
    })

    expect(result.current.ast.children.length).toBeGreaterThan(0)
    expect(result.current.ast.children[0].type).toBe('heading')
  })

  it('should signal completion with done()', () => {
    const onDone = vi.fn()
    const { result } = renderHook(() => useStreamMarkdown({ onDone }))

    act(() => {
      result.current.append('# Complete')
    })

    act(() => {
      result.current.done()
    })

    expect(result.current.isStreaming).toBe(false)
    expect(result.current.isDone).toBe(true)
    expect(onDone).toHaveBeenCalledWith('# Complete')
  })

  it('should do final parse on done()', () => {
    const { result } = renderHook(() =>
      useStreamMarkdown({ parseDebounceMs: 1000 })
    )

    act(() => {
      result.current.append('# Final Parse')
    })

    // Don't wait for debounce, call done immediately
    act(() => {
      result.current.done()
    })

    // AST should be parsed even though debounce has not fired
    expect(result.current.ast.children.length).toBeGreaterThan(0)
    expect(result.current.ast.children[0].type).toBe('heading')
  })

  it('should reset state', () => {
    const { result } = renderHook(() => useStreamMarkdown())

    act(() => {
      result.current.append('# Hello')
      vi.advanceTimersByTime(100)
    })

    act(() => {
      result.current.done()
    })

    expect(result.current.isDone).toBe(true)

    act(() => {
      result.current.reset()
    })

    expect(result.current.source).toBe('')
    expect(result.current.ast.children).toHaveLength(0)
    expect(result.current.isStreaming).toBe(false)
    expect(result.current.isDone).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should not call onStart more than once per stream', () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useStreamMarkdown({ onStart }))

    act(() => {
      result.current.append('chunk1')
      result.current.append('chunk2')
      result.current.append('chunk3')
    })

    expect(onStart).toHaveBeenCalledOnce()
  })

  it('should consume async iterator', async () => {
    const { result } = renderHook(() =>
      useStreamMarkdown({ parseDebounceMs: 0 })
    )

    async function* generateChunks() {
      yield '# Hello'
      yield '\n\n'
      yield 'World'
    }

    await act(async () => {
      await result.current.consumeIterator(generateChunks())
      vi.advanceTimersByTime(100)
    })

    expect(result.current.isDone).toBe(true)
    expect(result.current.isStreaming).toBe(false)
    expect(result.current.source).toContain('# Hello')
    expect(result.current.source).toContain('World')
  })

  it('should consume ReadableStream', async () => {
    const { result } = renderHook(() =>
      useStreamMarkdown({ parseDebounceMs: 0 })
    )

    const stream = new ReadableStream<string>({
      start(controller) {
        controller.enqueue('# Read')
        controller.enqueue('able')
        controller.close()
      },
    })

    await act(async () => {
      await result.current.consume(stream)
      vi.advanceTimersByTime(100)
    })

    expect(result.current.isDone).toBe(true)
    expect(result.current.source).toContain('# Readable')
  })

  it('should handle complex markdown through streaming', () => {
    const { result } = renderHook(() =>
      useStreamMarkdown({ parseDebounceMs: 0 })
    )

    const chunks = [
      '# Title\n\n',
      'Paragraph with **bold** text.\n\n',
      '- Item 1\n',
      '- Item 2\n\n',
      '```javascript\n',
      'const x = 1\n',
      '```\n',
    ]

    act(() => {
      for (const chunk of chunks) {
        result.current.append(chunk)
      }
      result.current.done()
    })

    expect(result.current.ast.children.length).toBeGreaterThanOrEqual(3)
    expect(result.current.ast.children[0].type).toBe('heading')
    expect(result.current.ast.children[1].type).toBe('paragraph')
  })

  it('should reset abort controller on reset', async () => {
    const { result } = renderHook(() => useStreamMarkdown())

    // Start one stream and immediately reset
    act(() => {
      result.current.append('partial')
    })

    expect(result.current.isStreaming).toBe(true)

    act(() => {
      result.current.reset()
    })

    expect(result.current.isStreaming).toBe(false)
    expect(result.current.source).toBe('')
  })
})
