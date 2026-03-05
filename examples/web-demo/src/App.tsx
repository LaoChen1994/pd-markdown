import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import {
  MarkdownRenderer,
  StreamMarkdownRenderer,
  useStreamMarkdown,
  useMarkdown,
} from 'pd-markdown/web'
import { findNodes, traverseAst, slugify } from 'pd-markdown/utils'
import type { FC, ReactNode } from 'react'
import type { Heading } from 'mdast'

// ─── Demo Data ────────────────────────────────────────────────────────

const BASIC_MARKDOWN = `# Hello pd-markdown! 🎉

This is a **live demo** of the pd-markdown rendering components.

## Features

- **Modular architecture** with separate parser, utils, and web packages
- *Streaming support* for AI-generated content
- ~~Custom component~~ overrides
- Task lists with [x] checked and [ ] unchecked items

## Code Example

\`\`\`typescript
import { MarkdownRenderer } from 'pd-markdown-web'

function App() {
  return <MarkdownRenderer source="# Hello World" />
}
\`\`\`

Inline code: \`const x = 42\`

## Table

| Feature | Status | Notes |
|---------|--------|-------|
| Headings | ✅ | h1-h6 |
| Lists | ✅ | ordered & unordered |
| Code blocks | ✅ | with language |
| Tables | ✅ | GFM |
| Blockquotes | ✅ | nested |
| Links | ✅ | with title |
| Images | ✅ | with alt |
| Streaming | ✅ | cursor + animation |

## Blockquote

> "The best way to predict the future is to invent it."
> — *Alan Kay*

## Links

Visit [GitHub](https://github.com) for more information.

---

*This is rendered by pd-markdown ❤️*
`

const STREAMING_CONTENT = `# AI Response 🤖

I'll help you understand **React hooks** step by step.

## What are Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in **React 16.8**.

## Core Hooks

### 1. useState

\`useState\` lets you add state to function components:

\`\`\`jsx
const [count, setCount] = useState(0)
\`\`\`

### 2. useEffect

\`useEffect\` handles side effects:

\`\`\`jsx
useEffect(() => {
  document.title = \`Count: \${count}\`
}, [count])
\`\`\`

### 3. useContext

\`useContext\` reads context values:

\`\`\`jsx
const theme = useContext(ThemeContext)
\`\`\`

## Rules of Hooks

1. Only call hooks at the **top level**
2. Only call hooks from **React functions**
3. Custom hooks should start with \`use\`

## Summary

| Hook | Purpose |
|------|---------|
| useState | State management |
| useEffect | Side effects |
| useContext | Context consumption |
| useReducer | Complex state |
| useMemo | Memoization |
| useCallback | Callback memoization |

> 💡 **Tip:** Start with \`useState\` and \`useEffect\`. These cover most use cases!

That's all you need to get started with React Hooks! 🚀
`

// ─── Sections ─────────────────────────────────────────────────────────

type SectionId = 'overview' | 'basic' | 'streaming' | 'hook' | 'utils' | 'custom'

interface NavItem {
  id: SectionId
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'basic', label: 'MarkdownRenderer', icon: '📄' },
  { id: 'streaming', label: 'StreamMarkdownRenderer', icon: '⚡' },
  { id: 'hook', label: 'useStreamMarkdown', icon: '🪝' },
  { id: 'utils', label: 'AST Utilities', icon: '🔧' },
  { id: 'custom', label: 'Custom Components', icon: '🎨' },
]

// ─── App ──────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview')

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            <div className="header-logo-icon">M</div>
            <h1>pd-markdown</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <a 
              href="https://github.com/LaoChen1994/pd-markdown" 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'none' }}
            >
              GitHub
            </a>
            <span className="header-badge">v1.1.0 Demo</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'basic' && <BasicRendererSection />}
        {activeSection === 'streaming' && <StreamRendererSection />}
        {activeSection === 'hook' && <StreamHookSection />}
        {activeSection === 'utils' && <UtilsSection />}
        {activeSection === 'custom' && <CustomComponentsSection />}
      </main>

      <footer style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        borderTop: '1px solid var(--border-primary)',
        color: 'var(--text-dim)',
        fontSize: '13px'
      }}>
        pd-markdown &copy; {new Date().getFullYear()} &bull; Built with React & Vite
      </footer>
    </div>
  )
}

// ─── Overview Section ─────────────────────────────────────────────────

function OverviewSection() {
  return (
    <section className="section" id="section-overview">
      {/* Hero */}
      <div className="hero">
        <h2 className="hero-title">Powerful Markdown for React</h2>
        <p className="hero-subtitle">
          A modular markdown parsing and rendering library designed for flexibility,
          performance, and modern AI-driven streaming applications.
        </p>
        <div className="hero-badges">
          <span className="hero-badge" style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>📦 Modular</span>
          <span className="hero-badge" style={{ borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }}>⚡ Streaming</span>
          <span className="hero-badge" style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>🎨 AST-Driven</span>
          <span className="hero-badge">🔧 GFM Support</span>
          <span className="hero-badge">📱 SSR Ready</span>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="feature-grid">
        <FeatureCard
          icon="📄"
          title="MarkdownRenderer"
          desc="Core component for rendering static markdown. Supports source strings, pre-parsed ASTs, and custom component overrides."
        />
        <FeatureCard
          icon="⚡"
          title="StreamMarkdownRenderer"
          desc="Streaming-aware renderer with blinking cursor, fade-in animations, and full streaming lifecycle support."
        />
        <FeatureCard
          icon="🪝"
          title="useStreamMarkdown"
          desc="React hook for consuming streaming markdown from ReadableStream, async iterators, or SSE responses."
        />
        <FeatureCard
          icon="🔧"
          title="AST Utilities"
          desc="Power user tools to traverse, query, and transform the AST. Build TOCs, count words, or extract metadata with ease."
        />
        <FeatureCard
          icon="🎨"
          title="Custom Components"
          desc="Override any default component (heading, code, table, etc.) with your own implementations for a unique look."
        />
        <FeatureCard
          icon="🔌"
          title="Plugin System"
          desc="Built on unified/remark ecosystem. Extend the parser with existing remark plugins or create your own."
        />
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="feature-card">
      <div className="feature-card-icon">{icon}</div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-desc">{desc}</p>
    </div>
  )
}

// ─── Basic Renderer Section ───────────────────────────────────────────

function BasicRendererSection() {
  const [source, setSource] = useState(BASIC_MARKDOWN)

  return (
    <section className="section" id="section-basic">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-title-icon blue">📄</span>
          MarkdownRenderer
        </h2>
        <p className="section-desc">
          The core rendering component. Pass a <code>source</code> string and it renders to React elements.
          Try editing the markdown on the left to see live updates.
        </p>
      </div>

      <div className="demo-card">
        <div className="demo-card-header">
          <span className="demo-card-title">Live Editor</span>
          <span className="demo-card-tag">Interactive</span>
        </div>
        <div className="split-layout">
          <div className="split-pane">
            <div className="split-pane-label">Markdown Source</div>
            <textarea
              id="basic-editor"
              className="editor-textarea"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Type markdown here..."
              spellCheck={false}
            />
          </div>
          <div className="split-pane">
            <div className="split-pane-label">Rendered Output</div>
            <div className="rendered-output" id="basic-output">
              <MarkdownRenderer source={source} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Stream Renderer Section ──────────────────────────────────────────

function StreamRendererSection() {
  const [source, setSource] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [speed, setSpeed] = useState(30)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const indexRef = useRef(0)

  const startStreaming = useCallback(() => {
    setSource('')
    setIsStreaming(true)
    indexRef.current = 0

    const streamChars = () => {
      if (indexRef.current >= STREAMING_CONTENT.length) {
        setIsStreaming(false)
        return
      }

      // Stream a random chunk size (1-5 chars)
      const chunkSize = Math.floor(Math.random() * 4) + 1
      const end = Math.min(indexRef.current + chunkSize, STREAMING_CONTENT.length)
      const chunk = STREAMING_CONTENT.slice(0, end)
      indexRef.current = end

      setSource(chunk)
      timerRef.current = setTimeout(streamChars, speed)
    }

    streamChars()
  }, [speed])

  const stopStreaming = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIsStreaming(false)
  }, [])

  const resetStream = useCallback(() => {
    stopStreaming()
    setSource('')
    indexRef.current = 0
  }, [stopStreaming])

  return (
    <section className="section" id="section-streaming">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-title-icon purple">⚡</span>
          StreamMarkdownRenderer
        </h2>
        <p className="section-desc">
          A streaming-aware renderer designed for AI-generated content. Shows a blinking cursor,
          fade-in animations for new blocks, and tracks the active streaming block.
        </p>
      </div>

      <div className="demo-card">
        <div className="demo-card-header">
          <span className="demo-card-title">Streaming Demo</span>
          <span className="demo-card-tag">AI-style</span>
        </div>

        <div className="stream-controls">
          <div className="btn-group">
            <button
              id="stream-start-btn"
              className="btn btn-primary"
              onClick={startStreaming}
              disabled={isStreaming}
            >
              ▶ Start Stream
            </button>
            <button
              id="stream-stop-btn"
              className="btn btn-secondary"
              onClick={stopStreaming}
              disabled={!isStreaming}
            >
              ⏸ Stop
            </button>
            <button
              id="stream-reset-btn"
              className="btn btn-danger"
              onClick={resetStream}
            >
              ↺ Reset
            </button>
          </div>

          <div className="speed-selector">
            <label htmlFor="speed-select">Speed:</label>
            <select
              id="speed-select"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value={10}>Very Fast (10ms)</option>
              <option value={30}>Fast (30ms)</option>
              <option value={60}>Medium (60ms)</option>
              <option value={120}>Slow (120ms)</option>
            </select>
          </div>

          <div
            className={`stream-status ${isStreaming ? 'streaming' : source ? 'done' : 'idle'}`}
          >
            <span className="stream-status-dot" />
            {isStreaming ? 'Streaming...' : source ? 'Complete' : 'Ready'}
          </div>
        </div>

        <div className="demo-card-body">
          <div className="rendered-output" id="stream-output">
            {source ? (
              <StreamMarkdownRenderer
                source={source}
                isStreaming={isStreaming}
                showCursor={true}
                enableAnimation={true}
              />
            ) : (
              <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                Click "Start Stream" to simulate AI-generated streaming content...
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Stream Hook Section ──────────────────────────────────────────────

function StreamHookSection() {
  const [speed, setSpeed] = useState(30)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const indexRef = useRef(0)

  const stream = useStreamMarkdown({
    parseDebounceMs: 30,
    onStart: () => console.log('[useStreamMarkdown] Stream started'),
    onDone: (text: string) => console.log('[useStreamMarkdown] Stream done, length:', text.length),
    onChunk: (_chunk: string, full: string) => console.log('[useStreamMarkdown] Progress:', Math.round((full.length / STREAMING_CONTENT.length) * 100) + '%'),
  })

  useEffect(() => {
    return () => {
       if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const startStreaming = useCallback(() => {
    stream.reset()
    indexRef.current = 0

    const streamChars = () => {
      if (indexRef.current >= STREAMING_CONTENT.length) {
        stream.done()
        return
      }

      const chunkSize = Math.floor(Math.random() * 8) + 2
      const end = Math.min(indexRef.current + chunkSize, STREAMING_CONTENT.length)
      const chunk = STREAMING_CONTENT.slice(indexRef.current, end)
      indexRef.current = end

      stream.append(chunk)
      timerRef.current = setTimeout(streamChars, speed)
    }

    streamChars()
  }, [speed, stream])

  const stopStreaming = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    stream.done()
  }, [stream])

  const startIteratorStream = useCallback(async () => {
    async function* generateChunks() {
      let i = 0
      while (i < STREAMING_CONTENT.length) {
        const chunkSize = Math.floor(Math.random() * 10) + 3
        const end = Math.min(i + chunkSize, STREAMING_CONTENT.length)
        yield STREAMING_CONTENT.slice(i, end)
        i = end
        await new Promise((resolve) => setTimeout(resolve, speed))
      }
    }

    await stream.consumeIterator(generateChunks())
  }, [speed, stream])

  return (
    <section className="section" id="section-hook">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-title-icon green">🪝</span>
          useStreamMarkdown Hook
        </h2>
        <p className="section-desc">
          A React hook that manages the full streaming lifecycle. Provides <code>append()</code>,{' '}
          <code>done()</code>, <code>reset()</code>, <code>consume()</code>,{' '}
          <code>consumeIterator()</code>, and <code>consumeResponse()</code> methods.
        </p>
      </div>

      <div className="demo-card">
        <div className="demo-card-header">
          <span className="demo-card-title">Hook API Demo</span>
          <span className="demo-card-tag">useStreamMarkdown</span>
        </div>

        <div className="stream-controls">
          <div className="btn-group">
            <button
              id="hook-append-btn"
              className="btn btn-primary"
              onClick={startStreaming}
              disabled={stream.isStreaming}
            >
              ▶ append() Stream
            </button>
            <button
              id="hook-iterator-btn"
              className="btn btn-primary"
              onClick={startIteratorStream}
              disabled={stream.isStreaming}
              style={{ background: 'linear-gradient(135deg, #60d8c0, #38b2ac)' }}
            >
              🔄 consumeIterator()
            </button>
            <button
              id="hook-stop-btn"
              className="btn btn-secondary"
              onClick={stopStreaming}
              disabled={!stream.isStreaming}
            >
              ⏸ done()
            </button>
            <button
              id="hook-reset-btn"
              className="btn btn-danger"
              onClick={() => {
                if (timerRef.current) clearTimeout(timerRef.current)
                stream.reset()
                indexRef.current = 0
              }}
            >
              ↺ reset()
            </button>
          </div>

          <div className="speed-selector">
            <label htmlFor="hook-speed-select">Speed:</label>
            <select
              id="hook-speed-select"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value={10}>Very Fast (10ms)</option>
              <option value={30}>Fast (30ms)</option>
              <option value={60}>Medium (60ms)</option>
              <option value={120}>Slow (120ms)</option>
            </select>
          </div>

          <div
            className={`stream-status ${stream.isStreaming ? 'streaming' : stream.isDone ? 'done' : 'idle'}`}
          >
            <span className="stream-status-dot" />
            {stream.isStreaming
              ? 'Streaming...'
              : stream.isDone
                ? 'Complete'
                : 'Ready'}
          </div>
        </div>

        {/* State Inspector */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-primary)',
          background: 'rgba(0, 0, 0, 0.2)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          color: 'var(--text-secondary)',
        }}>
          <span>source.length: <strong style={{ color: 'var(--accent-primary)' }}>{stream.source.length}</strong></span>
          <span>ast.children: <strong style={{ color: 'var(--accent-secondary)' }}>{stream.ast.children.length}</strong></span>
          <span>isStreaming: <strong style={{ color: stream.isStreaming ? 'var(--accent-tertiary)' : 'var(--text-dim)' }}>{String(stream.isStreaming)}</strong></span>
          <span>isDone: <strong style={{ color: stream.isDone ? 'var(--accent-primary)' : 'var(--text-dim)' }}>{String(stream.isDone)}</strong></span>
        </div>

        <div className="demo-card-body">
          <div className="rendered-output" id="hook-output">
            {stream.source ? (
              <StreamMarkdownRenderer
                source={stream.source}
                ast={stream.ast}
                isStreaming={stream.isStreaming}
                showCursor={true}
                enableAnimation={true}
              />
            ) : (
              <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                Use the controls above to start streaming with the hook API...
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Utils Section ───────────────────────────────────────────────────

function UtilsSection() {
  const [source, setSource] = useState(BASIC_MARKDOWN)
  const ast = useMarkdown(source)

  // 1. Generate Table of Contents
  const toc = useMemo(() => {
    const headings = findNodes(ast, 'heading') as Heading[]
    return headings.map(h => {
      const text = h.children
        .filter((c: any) => c.type === 'text')
        .map((c: any) => (c as any).value)
        .join('')
      return {
        level: (h as any).depth,
        text,
        id: slugify(text)
      }
    })
  }, [ast])

  // 2. Statistics
  const stats = useMemo(() => {
    let wordCount = 0
    let imageCount = 0
    let linkCount = 0
    let codeCount = 0

    traverseAst(ast, (node: any) => {
      switch (node.type) {
        case 'text':
          wordCount += node.value.trim().split(/\s+/).length
          break
        case 'image':
          imageCount++
          break
        case 'link':
          linkCount++
          break
        case 'code':
          codeCount++
          break
      }
    })

    return {
      words: wordCount,
      images: imageCount,
      links: linkCount,
      codeBlocks: codeCount,
      readingTime: Math.ceil(wordCount / 200) // approx 200 wpm
    }
  }, [ast])

  return (
    <section className="section" id="section-utils">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-title-icon orange">🔧</span>
          AST Utilities
        </h2>
        <p className="section-desc">
          Leverage the <code>pd-markdown-utils</code> package to analyze and augment your content.
          Since we have a structured AST, we can easily build TOCs, stats, and more.
        </p>
      </div>

      <div className="demo-card">
        <div className="demo-card-header">
          <span className="demo-card-title">Analysis Demo</span>
          <span className="demo-card-tag">Insights</span>
        </div>
        <div className="split-layout">
          <div className="split-pane">
            <div className="split-pane-label">Table of Contents (Auto-Generated)</div>
            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-md)' }}>
              {toc.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {toc.map((item, i) => (
                    <li key={i} style={{ 
                      marginLeft: `${(item.level - 1) * 16}px`,
                      marginBottom: '8px',
                      fontSize: item.level === 1 ? '14px' : '13px',
                      fontWeight: item.level === 1 ? '600' : '400',
                      opacity: item.level === 1 ? 1 : 0.7
                    }}>
                      <a href={`#${item.id}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>No headings found.</div>
              )}
            </div>

            <div className="split-pane-label" style={{ marginTop: '24px' }}>Document Stats</div>
            <div className="feature-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <StatItem label="Words" value={stats.words} />
              <StatItem label="Read Time" value={`${stats.readingTime} min`} />
              <StatItem label="Links" value={stats.links} />
              <StatItem label="Images" value={stats.images} />
            </div>
          </div>
          <div className="split-pane">
            <div className="split-pane-label">Source Editor</div>
             <textarea
              className="editor-textarea"
              style={{ minHeight: '400px' }}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Type markdown..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ 
      background: 'rgba(255,255,255,0.03)', 
      padding: '12px', 
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-primary)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent-tertiary)' }}>{value}</div>
    </div>
  )
}

// ─── Custom Components Section ────────────────────────────────────────

const CUSTOM_DEMO_MD = `# Custom Styled Heading

This demonstrates **custom component** overrides.

## Code Block

\`\`\`python
def hello():
    print("Hello from custom renderer!")
    return 42
\`\`\`

## Table

| Package | Description |
|---------|-------------|
| parser | Markdown → AST |
| utils | Tree utilities |
| web | React components |

> "Customize everything." — pd-markdown

Visit the [documentation](https://github.com/LaoChen1994/pd-markdown) for more.
`

// Custom heading with gradient underline
const CustomHeading: FC<{ node: any; children: ReactNode }> = ({ node, children }) => {
  const Tag = (`h${node.depth}` as any)
  return (
    <Tag
      style={{
        background: 'linear-gradient(135deg, #6c8aff, #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        borderBottom: node.depth <= 2 ? '2px solid rgba(100, 130, 255, 0.3)' : undefined,
        paddingBottom: node.depth <= 2 ? '8px' : undefined,
        marginTop: '1.5em',
        marginBottom: '0.8em',
      }}
    >
      {node.depth === 1 ? '✨ ' : ''}{children}
    </Tag>
  )
}

// Custom code block with copy button & line numbers
const CustomCode: FC<{ node: any }> = ({ node }) => {
  const [copied, setCopied] = useState(false)
  const lines = node.value.split('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(node.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-primary)',
      margin: '1.5em 0',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        background: 'rgba(100, 130, 255, 0.08)',
        borderBottom: '1px solid var(--border-primary)',
        fontSize: '12px',
      }}>
        <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
          {node.lang || 'text'}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: 'none',
            border: 'none',
            color: copied ? 'var(--accent-tertiary)' : 'var(--text-dim)',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>

      {/* Code with line numbers */}
      <pre style={{
        margin: 0,
        padding: '16px',
        background: '#0a0a12',
        overflow: 'auto',
      }}>
        <code style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          lineHeight: '1.7',
        }}>
          {lines.map((line: string, i: number) => (
            <div key={i} style={{ display: 'flex' }}>
              <span style={{
                color: 'var(--text-dim)',
                userSelect: 'none',
                minWidth: '36px',
                textAlign: 'right',
                marginRight: '16px',
                opacity: 0.4,
              }}>
                {i + 1}
              </span>
              <span>{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

// Custom blockquote with icon
const CustomBlockquote: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <blockquote style={{
      borderLeft: '4px solid var(--accent-warm)',
      background: 'rgba(255, 138, 101, 0.05)',
      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
      padding: '16px',
      margin: '1.5em 0',
      display: 'flex',
      gap: '16px',
    }}>
      <span style={{ fontSize: '24px', flexShrink: 0, marginTop: '-4px' }}>💡</span>
      <div style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>{children}</div>
    </blockquote>
  )
}

function CustomComponentsSection() {
  const [useCustom, setUseCustom] = useState(true)

  const customComponents = useCustom
    ? {
        heading: CustomHeading,
        code: CustomCode,
        blockquote: CustomBlockquote,
      }
    : {}

  return (
    <section className="section" id="section-custom">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-title-icon orange">🎨</span>
          Custom Components
        </h2>
        <p className="section-desc">
          Override any default component with your own implementation. This demo shows
          custom Heading (gradient text), Code (line numbers + copy), and Blockquote (icon) components.
        </p>
      </div>

      <div className="demo-card">
        <div className="demo-card-header">
          <span className="demo-card-title">Component Override Demo</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}>
              <input
                id="custom-toggle"
                type="checkbox"
                checked={useCustom}
                onChange={(e) => setUseCustom(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)' }}
              />
              Custom Components
            </label>
            <span className="demo-card-tag">
              {useCustom ? 'Custom' : 'Default'}
            </span>
          </div>
        </div>

        <div className="demo-card-body">
          <div className="rendered-output" id="custom-output">
            <MarkdownRenderer
              source={CUSTOM_DEMO_MD}
              components={customComponents as any}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
