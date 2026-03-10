import fs from 'fs'
import path from 'path'
import Link from 'next/link'

export default function Page() {
  const contentDir = path.join(process.cwd(), 'content')
  let posts: string[] = []
  
  try {
    const files = fs.readdirSync(contentDir)
    posts = files.map(f => f.replace('.md', ''))
  } catch (e) {
    console.error(e)
  }

  return (
    <main className="py-10 max-w-4xl mx-auto px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 border-none">
          PD-Markdown SSG Demo
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Next.js Static Site Generation with Markdown.
        </p>
      </header>

      <section className="bg-white shadow-xl border border-gray-100 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6">Available Posts</h2>
        <ul className="list-disc pl-6 space-y-4">
          {posts.map((slug) => (
            <li key={slug}>
              <Link href={`/posts/${slug}`} className="text-blue-600 hover:text-blue-800 underline text-lg">
                {slug}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-20 py-8 border-t text-sm text-gray-400 text-center">
        Built with pd-markdown - RSC & SSG Friendly
      </footer>
    </main>
  )
}
