import { useState, useEffect, useRef, useMemo } from 'react'
import type { CSSProperties, FC, ReactNode } from 'react'
import type { Root } from 'mdast'
import { createParser, type ParserOptions } from 'pd-markdown-parser'
import { MarkdownContext } from './context'
import { NodeRenderer } from './NodeRenderer'
import type { ComponentMap } from './defaults'

// ─── Styles ───────────────────────────────────────────────────────────

const cursorKeyframes = `
@keyframes pd-md-cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes pd-md-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
`

const cursorStyle: CSSProperties = {
  display: 'inline-block',
  width: '2px',
  height: '1.1em',
  backgroundColor: 'currentColor',
  marginLeft: '2px',
  verticalAlign: 'text-bottom',
  animation: 'pd-md-cursor-blink 1s step-end infinite',
}

// ─── Types ────────────────────────────────────────────────────────────

export interface StreamMarkdownRendererProps {
  /** The streaming markdown source string — pass accumulated text */
  source: string
  /** Whether the stream is currently active/receiving data */
  isStreaming?: boolean
  /** Pre-parsed AST (skip internal parsing when using useStreamMarkdown) */
  ast?: Root
  /** Custom component overrides */
  components?: Partial<ComponentMap>
  /** CSS class name for wrapper */
  className?: string
  /** Inline styles for wrapper */
  style?: CSSProperties
  /** Parser options */
  parserOptions?: ParserOptions
  /** Whether to show a blinking cursor at the end while streaming. Default: true */
  showCursor?: boolean
  /** Custom cursor element */
  cursorElement?: ReactNode
  /** CSS class name for the animated wrapper on new content */
  animationClassName?: string
  /** Whether to enable fade-in animation for new blocks. Default: true */
  enableAnimation?: boolean
}

// ─── Internal Parsed AST Hook ─────────────────────────────────────────

function useParsedAst(source: string, options?: ParserOptions): Root {
  const parserRef = useRef<ReturnType<typeof createParser> | null>(null)
  const optionsRef = useRef(options)

  if (
    !parserRef.current ||
    JSON.stringify(optionsRef.current) !== JSON.stringify(options)
  ) {
    parserRef.current = createParser(options)
    optionsRef.current = options
  }

  return useMemo(() => {
    try {
      return parserRef.current!.parse(source)
    } catch {
      return { type: 'root' as const, children: [] }
    }
  }, [source])
}

// ─── Cursor Component ─────────────────────────────────────────────────

const StreamCursor: FC<{ customElement?: ReactNode }> = ({ customElement }) => {
  if (customElement) {
    return <>{customElement}</>
  }
  return <span style={cursorStyle} aria-hidden="true" data-streaming-cursor />
}

// ─── Main Component ──────────────────────────────────────────────────

/**
 * StreamMarkdownRenderer — A streaming-aware markdown renderer.
 *
 * This component is designed for rendering AI-generated streaming markdown.
 * It shows a blinking cursor at the end while content is being streamed,
 * and optionally animates new content blocks as they appear.
 *
 * Usage patterns:
 *
 * 1. **With `useStreamMarkdown` hook** (recommended):
 *    ```tsx
 *    const stream = useStreamMarkdown()
 *    // ... consume stream
 *    <StreamMarkdownRenderer
 *      source={stream.source}
 *      ast={stream.ast}
 *      isStreaming={stream.isStreaming}
 *    />
 *    ```
 *
 * 2. **Standalone** (pass source, let it parse internally):
 *    ```tsx
 *    <StreamMarkdownRenderer
 *      source={accumulatedText}
 *      isStreaming={isLoading}
 *    />
 *    ```
 */
export const StreamMarkdownRenderer: FC<StreamMarkdownRendererProps> = ({
  source,
  isStreaming = false,
  ast: externalAst,
  components = {},
  className,
  style,
  parserOptions,
  showCursor = true,
  cursorElement,
  animationClassName,
  enableAnimation = true,
}) => {
  // Use external AST if provided, otherwise parse internally
  const internalAst = useParsedAst(
    externalAst ? '' : source,
    parserOptions
  )
  const ast = externalAst || internalAst

  // Track previous child count for animation
  const prevChildCountRef = useRef(0)
  const [animatingIndices, setAnimatingIndices] = useState<Set<number>>(
    new Set()
  )

  // Detect new blocks for animation
  useEffect(() => {
    const currentCount = ast.children.length
    const prevCount = prevChildCountRef.current

    if (
      enableAnimation &&
      isStreaming &&
      currentCount > prevCount &&
      prevCount > 0
    ) {
      const newIndices = new Set<number>()
      for (let i = prevCount; i < currentCount; i++) {
        newIndices.add(i)
      }
      setAnimatingIndices(newIndices)

      // Clear animation flags after animation completes
      const timer = setTimeout(() => {
        setAnimatingIndices(new Set())
      }, 300)

      prevChildCountRef.current = currentCount
      return () => clearTimeout(timer)
    }

    prevChildCountRef.current = currentCount
  }, [ast.children.length, enableAnimation, isStreaming])

  // Auto-scroll ref
  const containerRef = useRef<HTMLDivElement>(null)

  // Inject keyframe styles
  useEffect(() => {
    const styleId = 'pd-md-stream-styles'
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style')
      styleEl.id = styleId
      styleEl.textContent = cursorKeyframes
      document.head.appendChild(styleEl)
    }
  }, [])

  if (!source && !externalAst) {
    return null
  }

  const wrapperStyle: CSSProperties = {
    ...style,
    position: 'relative',
  }

  return (
    <MarkdownContext.Provider value={{ components }}>
      <div ref={containerRef} className={className} style={wrapperStyle}>
        {ast.children.map((child, index) => {
          const isNewBlock = animatingIndices.has(index)
          const isLastBlock = index === ast.children.length - 1

          const blockStyle: CSSProperties =
            enableAnimation && isNewBlock
              ? {
                  animation: 'pd-md-fade-in 0.3s ease-out forwards',
                }
              : {}

          const blockClassName = isNewBlock
            ? animationClassName || undefined
            : undefined

          return (
            <div
              key={index}
              style={blockStyle}
              className={blockClassName}
              data-stream-block={isLastBlock && isStreaming ? 'active' : undefined}
            >
              <NodeRenderer node={child} />
              {/* Show cursor at the very end of the last block */}
              {showCursor && isStreaming && isLastBlock && (
                <StreamCursor customElement={cursorElement} />
              )}
            </div>
          )
        })}

        {/* If there are no children yet but streaming, show cursor */}
        {showCursor && isStreaming && ast.children.length === 0 && (
          <StreamCursor customElement={cursorElement} />
        )}
      </div>
    </MarkdownContext.Provider>
  )
}
