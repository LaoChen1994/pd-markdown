import { createContext, useContext } from 'react'
import type { ComponentMap } from './defaults'

/**
 * Context value for markdown renderer
 */
export interface MarkdownContextValue {
  /** Custom component overrides */
  components: Partial<ComponentMap>
}

/**
 * Context for passing configuration down the component tree
 */
export const MarkdownContext = createContext<MarkdownContextValue>({
  components: {},
})

/**
 * Hook to access markdown context
 */
export function useMarkdownContext(): MarkdownContextValue {
  return useContext(MarkdownContext)
}
