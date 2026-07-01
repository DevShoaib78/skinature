import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

/**
 * Shared shell for legal / informational pages.
 * Server-renderable: no client hooks here.
 */
export default function PolicyLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string
  lastUpdated?: string
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
        <article className="max-w-3xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-forest-900/45 uppercase tracking-[0.15em]">
              <li>
                <Link href="/" className="hover:text-forest-900 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-forest-900/75">
                {title}
              </li>
            </ol>
          </nav>

          <header className="mb-10 md:mb-14">
            <h1 className="font-serif text-4xl md:text-5xl text-forest-900 mb-4">
              {title}
            </h1>
            {lastUpdated && (
              <p className="text-forest-900/45 text-sm">Last updated: {lastUpdated}</p>
            )}
            <span className="block h-px w-16 bg-gold-500/70 mt-6" aria-hidden="true" />
          </header>

          <div className="policy-prose space-y-8 text-forest-900/75 leading-relaxed">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}

export function PolicySection({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-forest-900 mb-3">{heading}</h2>
      <div className="space-y-3 text-[0.95rem]">{children}</div>
    </section>
  )
}
