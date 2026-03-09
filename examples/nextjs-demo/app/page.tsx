import { getMarkdownAst } from '../lib/markdown'
import { MarkdownRenderer } from 'pd-markdown/web'

const demoMarkdown = `
# pd-markdown RSC Demo

This page is rendered using **Next.js App Router** with **Pure Server Components**.

## Zero Client-Side JS

By using \`MarkdownRenderer\` directly in this Server Component, we achieve:
1. **Zero Hydration Cost** - The HTML is generated on the server and remains static. No React Context is used internally.
2. **Leaner Bundle** - Since the renderer runs on the server, the browser doesn't need to load the rendering logic for this content.
3. **SSG Support** - This works perfectly with \`next build\` for static site generation.

### Code Block
\`\`\`ts
// This runs on the server!
const ast = await getMarkdownAst(content);
return <MarkdownRenderer ast={ast} />;
\`\`\`
`

/**
 * Next.js Server Component (Default)
 */
export default async function Page() {
  const ast = await getMarkdownAst(demoMarkdown)

  return (
    <main className="py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 border-none">
          PD-Markdown RSC
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Showing Pure Server Side Rendering with Zero Client-side Context.
        </p>
      </header>

      <section className="bg-white shadow-xl border border-gray-100 rounded-2xl p-8 mb-12">
        {/* Directly using the Shared Component in an RSC! */}
        <MarkdownRenderer ast={ast} className="prose prose-slate max-w-none" />
      </section>

      <footer className="mt-20 py-8 border-t text-sm text-gray-400 text-center">
        Built with pd-markdown - RSC & SSG Friendly
      </footer>
    </main>
  )
}
