'use client'

import { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ui/ProductCard'
import { searchProducts } from '@/components/search/SearchOverlay'

export default function SearchResults() {
  const params = useSearchParams()
  const router = useRouter()
  const initial = params.get('q') ?? ''
  const [query, setQuery] = useState(initial)

  const results = useMemo(() => searchProducts(initial), [initial])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <main id="main-content" className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-forest-900 mb-8">
            {initial ? (
              <>
                Results for <span className="italic text-forest-800">&ldquo;{initial}&rdquo;</span>
              </>
            ) : (
              'Search'
            )}
          </h1>

          {/* Search box */}
          <form
            onSubmit={submit}
            role="search"
            className="flex items-center gap-3 max-w-xl border-b-2 border-forest-900/20 focus-within:border-gold-500 transition-colors pb-3 mb-12"
          >
            <Search size={19} strokeWidth={1.75} className="text-forest-900/50 flex-shrink-0" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, ingredients, concerns..."
              aria-label="Search products"
              className="flex-1 bg-transparent outline-none text-lg text-forest-900 placeholder:text-forest-900/30"
            />
            <button
              type="submit"
              className="text-xs uppercase tracking-[0.2em] font-semibold text-forest-900/70 hover:text-forest-900 transition-colors"
            >
              Search
            </button>
          </form>
        </motion.div>

        {initial === '' ? (
          <p className="text-forest-900/55">
            Type a product name, an ingredient, or a concern like hair fall.
          </p>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-serif text-3xl text-forest-900 mb-3">
              Nothing found for &ldquo;{initial}&rdquo;
            </p>
            <p className="text-forest-900/55 mb-8 max-w-md mx-auto">
              Try a different word, or browse the full collection. The garden is small
              but mighty.
            </p>
            <button
              onClick={() => router.push('/shop')}
              className="px-8 py-3.5 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <>
            <p className="text-forest-900/40 text-xs uppercase tracking-[0.15em] mb-6">
              {results.length} {results.length === 1 ? 'product' : 'products'} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
