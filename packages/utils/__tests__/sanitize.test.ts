import { describe, it, expect } from 'vitest'
import { escapeHtml, sanitizeHtml, stripHtml } from '../src/string/sanitize'

describe('escapeHtml', () => {
  it('should escape ampersand', () => {
    expect(escapeHtml('foo & bar')).toBe('foo &amp; bar')
  })

  it('should escape less than', () => {
    expect(escapeHtml('a < b')).toBe('a &lt; b')
  })

  it('should escape greater than', () => {
    expect(escapeHtml('a > b')).toBe('a &gt; b')
  })

  it('should escape double quotes', () => {
    expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;')
  })

  it('should escape single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s')
  })

  it('should escape multiple characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  it('should preserve safe text', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123')
  })
})

describe('sanitizeHtml', () => {
  it('should remove script tags', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('')
  })

  it('should remove event handlers', () => {
    expect(sanitizeHtml('<div onclick="alert(1)">text</div>')).toBe(
      '<div>text</div>'
    )
  })

  it('should remove javascript: URLs', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">click</a>')).toBe(
      '<a href="">click</a>'
    )
  })

  it('should preserve allowed tags', () => {
    expect(sanitizeHtml('<p>Hello <strong>world</strong></p>')).toBe(
      '<p>Hello <strong>world</strong></p>'
    )
  })

  it('should preserve allowed attributes', () => {
    expect(sanitizeHtml('<a href="https://example.com" title="link">text</a>')).toBe(
      '<a href="https://example.com" title="link">text</a>'
    )
  })

  it('should remove disallowed tags', () => {
    expect(sanitizeHtml('<iframe src="evil.com"></iframe>')).toBe('')
  })

  it('should remove disallowed attributes', () => {
    expect(sanitizeHtml('<div data-evil="bad">text</div>')).toBe('<div>text</div>')
  })

  it('should handle nested script content', () => {
    expect(
      sanitizeHtml('<div><script>bad()</script>safe</div>')
    ).toBe('<div>safe</div>')
  })
})

describe('stripHtml', () => {
  it('should remove all HTML tags', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world')
  })

  it('should handle self-closing tags', () => {
    expect(stripHtml('Hello<br/>World')).toBe('HelloWorld')
  })

  it('should preserve text content', () => {
    expect(stripHtml('No tags here')).toBe('No tags here')
  })

  it('should handle nested tags', () => {
    expect(stripHtml('<div><p><span>Deep</span></p></div>')).toBe('Deep')
  })
})
