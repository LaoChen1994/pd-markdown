/**
 * HTML entities that need escaping
 */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/**
 * Escape HTML special characters
 *
 * @param text - Text to escape
 * @returns Escaped text safe for HTML insertion
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] || char)
}

/**
 * Allowed HTML tags for sanitization
 */
const ALLOWED_TAGS = new Set([
  'a',
  'abbr',
  'b',
  'blockquote',
  'br',
  'code',
  'dd',
  'del',
  'div',
  'dl',
  'dt',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'ins',
  'kbd',
  'li',
  'ol',
  'p',
  'pre',
  'q',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
])

/**
 * Allowed attributes for sanitization
 */
const ALLOWED_ATTRS = new Set([
  'href',
  'src',
  'alt',
  'title',
  'class',
  'id',
  'name',
  'target',
  'rel',
  'width',
  'height',
  'align',
  'colspan',
  'rowspan',
])

/**
 * Sanitize HTML string by removing dangerous content
 *
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  let result = html

  // Remove script tags first
  result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove event handlers
  result = result.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')

  // Remove disallowed tags (keep content) and sanitize attributes
  result = result.replace(/<\/?(\w+)([^>]*)>/g, (match, tagName, attrs) => {
    const tag = tagName.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) {
      return ''
    }

    // For closing tags, just return them
    if (match.startsWith('</')) {
      return `</${tag}>`
    }

    // Sanitize attributes
    const sanitizedAttrs: string[] = []
    const attrRegex = /\s+([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g
    let attrMatch

    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      const [, attrName, v1, v2, v3] = attrMatch
      const attr = attrName.toLowerCase()
      
      if (ALLOWED_ATTRS.has(attr)) {
        let value = v1 ?? v2 ?? v3 ?? ''
        
        // Check for dangerous URLs in href/src
        if ((attr === 'href' || attr === 'src') && /^\s*javascript\s*:/i.test(value)) {
          value = ''
        }
        
        sanitizedAttrs.push(`${attr}="${value}"`)
      }
    }

    const attrStr = sanitizedAttrs.length > 0 ? ' ' + sanitizedAttrs.join(' ') : ''
    return `<${tag}${attrStr}>`
  })

  return result
}

/**
 * Strip all HTML tags from a string
 *
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}
