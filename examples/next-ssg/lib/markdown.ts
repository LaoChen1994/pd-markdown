import { createParser } from 'pd-markdown/parser'

const parser = createParser({
  gfm: true,
  frontmatter: true,
})

/**
 * Server side markdown parsing
 * @param content - the markdown source
 * @returns - a machine-readable, serializable AST
 */
export async function getMarkdownAst(content: string) {
  // Simulating an expensive server task (e.g. data fetching or processing)
  return parser.parse(content)
}
