import type { Root, Heading, PhrasingContent } from 'mdast'
import { visit } from 'unist-util-visit'
import { uniqueSlugify } from 'pd-markdown-utils'

/**
 * Extract text content from phrasing content nodes
 */
function extractText(nodes: PhrasingContent[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') {
        return node.value
      }
      if ('children' in node) {
        return extractText(node.children as PhrasingContent[])
      }
      return ''
    })
    .join('')
}

/**
 * Transform plugin that adds slug IDs to headings
 */
export function transformHeading(tree: Root): void {
  const slugs = new Set<string>()

  visit(tree, 'heading', (node: Heading) => {
    const text = extractText(node.children)
    const slug = uniqueSlugify(text, slugs)

    // Add data.id to the heading node
    const data = (node.data || {}) as Record<string, unknown>
    data.id = slug
    const hProperties = (data.hProperties || {}) as Record<string, string>
    hProperties.id = slug
    data.hProperties = hProperties
    node.data = data
  })
}
