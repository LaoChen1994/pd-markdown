import { useState, useRef, useCallback, useEffect } from 'react'
import type { Root } from 'mdast'
import { createParser, type ParserOptions } from 'pd-markdown-parser'

export interface StreamState {
  /** The current accumulated markdown source */
  source: string
  /** The parsed AST of the current source */
  ast: Root
  /** Whether the stream is currently receiving data */
  isStreaming: boolean
  /** Whether the stream has completed */
  isDone: boolean
  /** Error if any occurred */
  error: Error | null
}

export interface UseStreamMarkdownOptions {
  /** Parser options */
  parserOptions?: ParserOptions
  /** Callback when streaming starts */
  onStart?: () => void
  /** Callback when a new chunk is received */
  onChunk?: (chunk: string, fullText: string) => void
  /** Callback when streaming completes */
  onDone?: (fullText: string) => void
  /** Callback on error */
  onError?: (error: Error) => void
  /** Debounce interval for re-parsing (ms). Default: 50 */
  parseDebounceMs?: number
}

export interface UseStreamMarkdownReturn extends StreamState {
  /** Append a chunk of markdown text */
  append: (chunk: string) => void
  /** Signal that the stream is complete */
  done: () => void
  /** Reset the stream state */
  reset: () => void
  /** Start consuming a ReadableStream */
  consume: (stream: ReadableStream<string>) => Promise<void>
  /** Start consuming an async iterator */
  consumeIterator: (iterator: AsyncIterable<string>) => Promise<void>
  /** Start consuming a fetch Response with SSE */
  consumeResponse: (
    response: Response,
    options?: { extractContent?: (data: string) => string | null }
  ) => Promise<void>
}

// Singleton parser cache
let cachedParser: ReturnType<typeof createParser> | null = null
let cachedParserOptions: ParserOptions | undefined

function getParser(options?: ParserOptions) {
  if (
    options !== cachedParserOptions ||
    (options && JSON.stringify(options) !== JSON.stringify(cachedParserOptions))
  ) {
    cachedParser = createParser(options)
    cachedParserOptions = options
  }
  if (!cachedParser) {
    cachedParser = createParser(options)
    cachedParserOptions = options
  }
  return cachedParser
}

const EMPTY_AST: Root = { type: 'root', children: [] }

/**
 * Hook for streaming markdown rendering.
 *
 * Provides a simple API to progressively append markdown text,
 * automatically re-parsing into an AST that can be rendered
 * by the MarkdownRenderer.
 *
 * Supports multiple consumption methods:
 * - Manual `append()` + `done()` calls
 * - `consume(readableStream)` for ReadableStream<string>
 * - `consumeIterator(asyncIterable)` for async iterators
 * - `consumeResponse(response)` for SSE/fetch responses
 */
export function useStreamMarkdown(
  options: UseStreamMarkdownOptions = {}
): UseStreamMarkdownReturn {
  const {
    parserOptions,
    onStart,
    onChunk,
    onDone,
    onError,
    parseDebounceMs = 50,
  } = options

  const [state, setState] = useState<StreamState>({
    source: '',
    ast: EMPTY_AST,
    isStreaming: false,
    isDone: false,
    error: null,
  })

  const sourceRef = useRef<string>('')
  const isStreamingRef = useRef(false)
  const parseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Parse the current source and update AST
  const parseSource = useCallback(
    (source: string) => {
      try {
        const parser = getParser(parserOptions)
        const ast = parser.parse(source)
        setState((prev) => ({ ...prev, source, ast }))
      } catch {
        // If parsing fails (e.g., incomplete markdown), keep previous AST
        setState((prev) => ({ ...prev, source }))
      }
    },
    [parserOptions]
  )

  // Debounced parse
  const debouncedParse = useCallback(
    (source: string) => {
      if (parseTimerRef.current) {
        clearTimeout(parseTimerRef.current)
      }
      parseTimerRef.current = setTimeout(() => {
        parseSource(source)
      }, parseDebounceMs)
    },
    [parseSource, parseDebounceMs]
  )

  // Append a chunk
  const append = useCallback(
    (chunk: string) => {
      if (!isStreamingRef.current) {
        isStreamingRef.current = true
        setState((prev) => ({
          ...prev,
          isStreaming: true,
          isDone: false,
          error: null,
        }))
        onStart?.()
      }

      sourceRef.current += chunk
      const currentSource = sourceRef.current
      onChunk?.(chunk, currentSource)
      debouncedParse(currentSource)
    },
    [debouncedParse, onStart, onChunk]
  )

  // Signal completion
  const done = useCallback(() => {
    if (parseTimerRef.current) {
      clearTimeout(parseTimerRef.current)
    }
    // Final parse with complete source
    const finalSource = sourceRef.current
    parseSource(finalSource)

    isStreamingRef.current = false
    setState((prev) => ({
      ...prev,
      isStreaming: false,
      isDone: true,
    }))
    onDone?.(finalSource)
  }, [parseSource, onDone])

  // Reset state
  const reset = useCallback(() => {
    if (parseTimerRef.current) {
      clearTimeout(parseTimerRef.current)
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    sourceRef.current = ''
    isStreamingRef.current = false
    setState({
      source: '',
      ast: EMPTY_AST,
      isStreaming: false,
      isDone: false,
      error: null,
    })
  }, [])

  // Consume a ReadableStream<string>
  const consume = useCallback(
    async (stream: ReadableStream<string>) => {
      reset()
      const reader = stream.getReader()
      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        while (true) {
          if (controller.signal.aborted) break
          const { done: readerDone, value } = await reader.read()
          if (readerDone) break
          if (value) append(value)
        }
        if (!controller.signal.aborted) done()
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setState((prev) => ({ ...prev, error, isStreaming: false }))
        onError?.(error)
      } finally {
        reader.releaseLock()
      }
    },
    [reset, append, done, onError]
  )

  // Consume an async iterator
  const consumeIterator = useCallback(
    async (iterator: AsyncIterable<string>) => {
      reset()
      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        for await (const chunk of iterator) {
          if (controller.signal.aborted) break
          append(chunk)
        }
        if (!controller.signal.aborted) done()
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setState((prev) => ({ ...prev, error, isStreaming: false }))
        onError?.(error)
      }
    },
    [reset, append, done, onError]
  )

  // Consume a fetch Response (SSE format)
  const consumeResponse = useCallback(
    async (
      response: Response,
      opts?: { extractContent?: (data: string) => string | null }
    ) => {
      if (!response.body) {
        throw new Error('Response has no body')
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      reset()
      const controller = new AbortController()
      abortControllerRef.current = controller

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      const extractContent =
        opts?.extractContent ??
        ((data: string) => {
          // Default: try to extract from SSE "data: ..." lines
          // or OpenAI-style streaming content
          try {
            const parsed = JSON.parse(data)
            // OpenAI format
            if (parsed.choices?.[0]?.delta?.content !== undefined) {
              return parsed.choices[0].delta.content
            }
            // Generic content field
            if (typeof parsed.content === 'string') {
              return parsed.content
            }
            if (typeof parsed.text === 'string') {
              return parsed.text
            }
          } catch {
            // Not JSON, return as-is
          }
          return data
        })

      try {
        let buffer = ''

        while (true) {
          if (controller.signal.aborted) break
          const { done: readerDone, value } = await reader.read()
          if (readerDone) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue
            if (trimmed === 'data: [DONE]') continue

            let data = trimmed
            if (trimmed.startsWith('data: ')) {
              data = trimmed.slice(6)
            }

            const content = extractContent(data)
            if (content !== null && content !== '') {
              append(content)
            }
          }
        }

        // Process remaining buffer
        if (buffer.trim()) {
          const data = buffer.trim().startsWith('data: ')
            ? buffer.trim().slice(6)
            : buffer.trim()
          const content = extractContent(data)
          if (content !== null && content !== '') {
            append(content)
          }
        }

        if (!controller.signal.aborted) done()
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setState((prev) => ({ ...prev, error, isStreaming: false }))
        onError?.(error)
      } finally {
        reader.releaseLock()
      }
    },
    [reset, append, done, onError]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (parseTimerRef.current) {
        clearTimeout(parseTimerRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    ...state,
    append,
    done,
    reset,
    consume,
    consumeIterator,
    consumeResponse,
  }
}
