import type { Root, List, ListItem } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * Extended list item with index
 */
declare module 'mdast' {
  interface ListItemData {
    index?: number
  }
}

/**
 * Transform plugin that adds index to list items
 */
export function transformList(tree: Root): void {
  visit(tree, 'list', (node: List) => {
    node.children.forEach((item: ListItem, index: number) => {
      item.data = item.data || {}
      item.data.index = index

      // For ordered lists, also store the actual number
      if (node.ordered) {
        const start = node.start ?? 1
        item.data.index = start + index
      }
    })
  })
}
