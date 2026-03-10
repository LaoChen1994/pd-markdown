import fs from 'fs'
import path from 'path'
import { getMarkdownAst } from '../../../lib/markdown'
import { MarkdownRenderer } from 'pd-markdown/web'
import Link from 'next/link'

// Get all markdown files for static generation
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'content')
  const files = fs.readdirSync(contentDir)

  return files.map((file) => ({
    slug: file.replace('.md', ''),
  }))
}

// Ensure the page is statistically generated
export const dynamicParams = false

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Await params per Next.js 15
  const slug = (await params).slug

  const filePath = path.join(process.cwd(), 'content', `${slug}.md`)
  const content = fs.readFileSync(filePath, 'utf-8')
  
  const ast = await getMarkdownAst(content)

  return (
    <main className="py-10 max-w-4xl mx-auto px-4">
      <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">
        &larr; Back to Home
      </Link>
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 border-none">
          {slug}
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Statically generated via Next.js SSG
        </p>
      </header>

      <section className="bg-white shadow-xl border border-gray-100 rounded-2xl p-8 mb-12">
        <MarkdownRenderer ast={ast} className="prose prose-slate max-w-none" />
      </section>

      <footer className="mt-20 py-8 border-t text-sm text-gray-400 text-center">
        Built with pd-markdown - RSC & SSG Friendly
      </footer>
    </main>
  )
}
