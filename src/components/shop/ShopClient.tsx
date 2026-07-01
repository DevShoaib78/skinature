'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/ui/ProductCard'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import { products, type Product } from '@/lib/data'

type FilterKey = 'all' | 'skin' | 'hair' | 'kits'
type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'skin', label: 'Skin Care' },
  { key: 'hair', label: 'Hair Care' },
  { key: 'kits', label: 'Kits & Combos' },
]

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top Rated' },
]

function matchesFilter(p: Product, filter: FilterKey): boolean {
  switch (filter) {
    case 'all':
      return true
    case 'skin':
      return p.category.includes('Skin')
    case 'hair':
      return p.category.includes('Hair')
    case 'kits':
      return p.isKit
  }
}

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const sorted = [...list]
  switch (sort) {
    case 'featured':
      return sorted.sort((a, b) => a.sortOrder - b.sortOrder)
    case 'price-asc':
      return sorted.sort(
        (a, b) => (a.salePricePaise ?? a.pricePaise) - (b.salePricePaise ?? b.pricePaise)
      )
    case 'price-desc':
      return sorted.sort(
        (a, b) => (b.salePricePaise ?? b.pricePaise) - (a.salePricePaise ?? a.pricePaise)
      )
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
  }
}

function isFilterKey(v: string | null): v is FilterKey {
  return v === 'all' || v === 'skin' || v === 'hair' || v === 'kits'
}

function ShopContent() {
  const params = useSearchParams()
  const initial = params.get('cat')
  const [filter, setFilter] = useState<FilterKey>(isFilterKey(initial) ? initial : 'all')
  const [sort, setSort] = useState<SortKey>('featured')

  const visible = useMemo(
    () => sortProducts(products.filter((p) => matchesFilter(p, filter)), sort),
    [filter, sort]
  )

  return (
    <main id="main-content" className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6">
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
              Shop
            </li>
          </ol>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 md:mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-forest-900 mb-4">
            The Garden Shelf
          </h1>
          <p className="text-forest-900/60 font-sans max-w-xl">
            Curated botanicals for every skin story. Choose your ritual.
          </p>
        </motion.div>

        {/* Filters + sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 md:mb-14">
          <nav
            aria-label="Product filters"
            className="flex gap-2.5 overflow-x-auto pb-2 -mb-2 sm:pb-0 sm:mb-0 sm:flex-wrap scrollbar-none"
          >
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={cn(
                  'px-5 md:px-6 py-2.5 rounded-full border transition-all duration-300 text-xs uppercase tracking-[0.15em] font-medium whitespace-nowrap flex-shrink-0',
                  filter === f.key
                    ? 'bg-forest-900 text-cream border-forest-900'
                    : 'bg-transparent text-forest-900/70 border-forest-900/20 hover:border-forest-900 hover:text-forest-900'
                )}
              >
                {f.label}
              </button>
            ))}
          </nav>

          {/* Sort */}
          <div className="relative flex items-center gap-2 self-start sm:self-auto">
            <SlidersHorizontal
              size={14}
              className="text-forest-900/40 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="shop-sort" className="sr-only">
              Sort products
            </label>
            <div className="relative">
              <select
                id="shop-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none bg-transparent border border-forest-900/20 rounded-full pl-4 pr-9 py-2.5 text-xs uppercase tracking-[0.12em] font-medium text-forest-900/80 hover:border-forest-900 transition-colors cursor-pointer outline-none focus-visible:border-gold-500"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-900/50 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <section aria-label="Products">
          <p className="text-forest-900/40 text-xs uppercase tracking-[0.15em] mb-6">
            {visible.length} {visible.length === 1 ? 'product' : 'products'}
          </p>

          {visible.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-3xl text-forest-900 mb-3">
                Nothing here yet
              </p>
              <p className="text-forest-900/55 mb-8">
                No products match this filter. The garden is always growing.
              </p>
              <button
                onClick={() => setFilter('all')}
                className="px-8 py-3.5 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {visible.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default function ShopClient() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="pt-40 min-h-screen bg-cream" />}>
        <ShopContent />
      </Suspense>
      <Footer />
    </>
  )
}
