'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import { products, effectivePricePaise } from '@/lib/data'
import { formatPaise } from '@/lib/format'

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return products.filter((p) =>
    [p.name, p.category, p.benefit, p.description, p.ingredients]
      .join(' ')
      .toLowerCase()
      .includes(q)
  )
}

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const results = searchProducts(query)

  // Clear the query on close so the overlay always opens fresh.
  const close = useCallback(() => {
    setQuery('')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      // Focus after the enter animation starts
      const t = setTimeout(() => inputRef.current?.focus(), 120)
      document.body.style.overflow = 'hidden'
      return () => {
        clearTimeout(t)
        document.body.style.overflow = ''
      }
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) close()
    },
    [open, close]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const submit = () => {
    if (!query.trim()) return
    const q = query.trim()
    close()
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[120] bg-cream/97 backdrop-blur-md overflow-y-auto"
        >
          <div className="max-w-3xl mx-auto px-6 pt-24 md:pt-32 pb-16">
            <button
              onClick={close}
              aria-label="Close search"
              className="absolute top-6 right-6 text-forest-900 hover:text-gold-600 transition-colors p-2"
            >
              <X size={26} strokeWidth={1.5} />
            </button>

            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex items-center gap-4 border-b-2 border-forest-900/20 focus-within:border-gold-500 transition-colors pb-4"
            >
              <Search size={22} strokeWidth={1.75} className="text-forest-900/50 flex-shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="Search products, ingredients, concerns..."
                aria-label="Search products"
                className="flex-1 bg-transparent outline-none font-serif text-2xl md:text-3xl text-forest-900 placeholder:text-forest-900/30"
              />
            </motion.div>

            {/* Results */}
            <div className="mt-8">
              {query.trim() === '' ? (
                <div>
                  <p className="text-forest-900/40 text-xs uppercase tracking-[0.2em] mb-5">
                    Popular
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['Hair Oil', 'Brightening', 'Bridal', 'Hair fall', 'Kit'].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-5 py-2.5 rounded-full border border-forest-900/15 text-sm text-forest-900/70 hover:border-forest-900 hover:text-forest-900 transition-colors"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-serif text-2xl text-forest-900 mb-2">
                    Nothing found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-forest-900/55 text-sm mb-8">
                    Try a product name, an ingredient, or a concern like hair fall.
                  </p>
                  <Link
                    href="/shop"
                    onClick={close}
                    className="inline-block px-8 py-3.5 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
                  >
                    Browse All Products
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-forest-900/8">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={close}
                        className="flex items-center gap-5 py-4 group"
                      >
                        <span className="relative w-16 h-20 rounded-xl overflow-hidden bg-forest-50 flex-shrink-0">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-serif text-lg text-forest-900 group-hover:text-gold-600 transition-colors">
                            {p.name}
                          </span>
                          <span className="block text-forest-900/50 text-xs uppercase tracking-[0.12em] mt-0.5">
                            {p.category} · {formatPaise(effectivePricePaise(p))}
                          </span>
                        </span>
                        <ArrowRight
                          size={16}
                          className="text-forest-900/30 group-hover:text-gold-600 group-hover:translate-x-1 transition-all"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
