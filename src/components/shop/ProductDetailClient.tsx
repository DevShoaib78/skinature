'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Minus,
  Plus,
  Leaf,
  FlaskConical,
  Heart,
  Shield,
  Package,
  BadgeCheck,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ProductCard } from '@/components/ui/ProductCard'
import { cn } from '@/lib/utils'
import { formatPaise, formatDate } from '@/lib/format'
import {
  getProductBySlug,
  getRelatedProducts,
  effectivePricePaise,
  isOnSale,
} from '@/lib/data'
import { getReviewsForProduct } from '@/lib/mock/reviews'
import { useCart } from '@/store/cart'

const tabs = ['Benefits', 'Ingredients', 'Ritual'] as const

const TRUST = [
  { icon: Leaf, label: 'Chemical-Free' },
  { icon: FlaskConical, label: 'Lab-Tested' },
  { icon: Heart, label: 'Cruelty-Free' },
  { icon: Shield, label: 'Safe for Kids' },
]

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-gold-500">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.round(rating) ? 'currentColor' : 'none'}
          strokeWidth={1.5}
          className={i < Math.round(rating) ? '' : 'text-gold-500/40'}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [activeTab, setActiveTab] = useState<string>('Benefits')
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const add = useCart((s) => s.add)

  const product = getProductBySlug(slug)

  if (!product) {
    return (
      <>
        <Navbar />
        <main
          id="main-content"
          className="pt-32 pb-24 bg-cream min-h-screen flex items-center justify-center"
        >
          <div className="text-center px-6">
            <h1 className="text-4xl font-serif text-forest-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-forest-900/60 mb-8">
              The product you are looking for does not exist or is no longer available.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
            >
              Browse the Collection
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const reviews = getReviewsForProduct(product.id)
  const related = getRelatedProducts(slug)
  const price = effectivePricePaise(product)
  const outOfStock = product.stock <= 0
  const lowStock = !outOfStock && product.stock <= 10

  const tabContent: Record<string, string> = {
    Benefits: product.benefits,
    Ingredients: product.ingredients,
    Ritual: product.ritual,
  }

  const addToCart = () => {
    add(product.id, qty)
    setQty(1)
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-28 md:pt-36 pb-28 lg:pb-24 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-forest-900/45 uppercase tracking-[0.15em]">
              <li>
                <Link href="/" className="hover:text-forest-900 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/shop" className="hover:text-forest-900 transition-colors">
                  Shop
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-forest-900/75 truncate max-w-[180px] sm:max-w-none">
                {product.name}
              </li>
            </ol>
          </nav>

          <article className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="aspect-[4/5] bg-forest-50 rounded-[2rem] relative overflow-hidden shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.gallery[activeImage] ?? product.image}
                      alt={`${product.name}, image ${activeImage + 1}`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>
                {product.badge && (
                  <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-forest-900 text-[10px] font-bold uppercase tracking-widest px-3.5 py-2 rounded-full z-10 shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.gallery.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {product.gallery.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1} of ${product.name}`}
                      aria-current={activeImage === i}
                      className={cn(
                        'relative w-20 h-24 rounded-xl overflow-hidden bg-forest-50 border-2 transition-colors',
                        activeImage === i
                          ? 'border-gold-500'
                          : 'border-transparent hover:border-forest-900/20'
                      )}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-col"
            >
              <a
                href="#reviews"
                className="mb-4 inline-flex items-center gap-2 w-fit"
                aria-label={`Rated ${product.rating} out of 5 stars based on ${product.reviewCount} reviews. Jump to reviews.`}
              >
                <Stars rating={product.rating} />
                <span className="text-forest-900/40 text-xs tracking-widest uppercase hover:text-forest-900 transition-colors">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </a>

              <h1 className="text-4xl md:text-5xl font-serif text-forest-900 mb-2 leading-tight">
                {product.name}
              </h1>
              <p className="text-gold-600 uppercase tracking-[0.2em] text-xs font-bold mb-6">
                {product.benefit}
              </p>

              <div className="mb-6 flex items-baseline gap-3">
                {isOnSale(product) && (
                  <span className="text-xl font-sans text-forest-900/40 line-through">
                    {formatPaise(product.pricePaise)}
                  </span>
                )}
                <span className="text-3xl font-sans font-medium text-forest-900">
                  {formatPaise(price)}
                </span>
                {isOnSale(product) && (
                  <span className="bg-gold-500 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                    Sale
                  </span>
                )}
              </div>

              <p className="text-forest-900/70 leading-relaxed mb-8 font-sans text-lg">
                {product.description}
              </p>

              {/* Kit contents */}
              {product.contents && (
                <div className="mb-8 bg-white rounded-2xl border border-forest-900/10 p-6">
                  <p className="flex items-center gap-2.5 text-forest-900 font-semibold text-sm uppercase tracking-[0.15em] mb-4">
                    <Package size={16} strokeWidth={1.75} className="text-gold-600" aria-hidden="true" />
                    What&apos;s Inside
                  </p>
                  <ul className="space-y-2.5">
                    {product.contents.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-forest-900/75 text-sm"
                      >
                        <Leaf size={13} className="text-gold-600 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Qty + Add to cart */}
              <div className="flex items-stretch gap-4 mb-4">
                <div className="inline-flex items-center border border-forest-900/20 rounded-full px-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                    className="w-11 h-12 flex items-center justify-center text-forest-900/60 hover:text-forest-900 transition-colors"
                  >
                    <Minus size={15} strokeWidth={2} />
                  </button>
                  <span
                    className="w-8 text-center font-medium text-forest-900 tabular-nums"
                    aria-live="polite"
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase quantity"
                    className="w-11 h-12 flex items-center justify-center text-forest-900/60 hover:text-forest-900 transition-colors"
                  >
                    <Plus size={15} strokeWidth={2} />
                  </button>
                </div>

                <button
                  onClick={addToCart}
                  disabled={outOfStock}
                  className={cn(
                    'flex-1 rounded-full text-xs md:text-sm uppercase tracking-[0.2em] font-medium transition-all duration-400',
                    outOfStock
                      ? 'bg-forest-900/10 text-forest-900/40 cursor-not-allowed'
                      : 'bg-forest-900 text-cream hover:bg-forest-800 hover:shadow-[inset_0_0_0_1px_rgba(197,160,89,0.55),0_8px_30px_rgba(26,60,52,0.25)]'
                  )}
                >
                  {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>

              {lowStock && (
                <p className="text-gold-600 text-xs uppercase tracking-[0.15em] font-semibold mb-6">
                  Only {product.stock} left in stock
                </p>
              )}

              {/* Trust strip */}
              <div className="grid grid-cols-4 gap-2 py-6 border-y border-forest-900/10 mb-8">
                {TRUST.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 text-center">
                    <Icon size={18} strokeWidth={1.5} className="text-gold-600" aria-hidden="true" />
                    <span className="text-[0.6rem] uppercase tracking-[0.12em] text-forest-900/60 leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div>
                <div
                  role="tablist"
                  aria-label="Product details"
                  className="flex gap-8 mb-6 overflow-x-auto pb-2"
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      role="tab"
                      aria-selected={activeTab === tab}
                      aria-controls={`tabpanel-${tab}`}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'uppercase text-xs tracking-[0.2em] pb-2 border-b-2 transition-all duration-300 whitespace-nowrap',
                        activeTab === tab
                          ? 'border-gold-500 text-forest-900 font-semibold'
                          : 'border-transparent text-forest-900/40 hover:text-forest-900'
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div
                  role="tabpanel"
                  id={`tabpanel-${activeTab}`}
                  aria-label={activeTab}
                  className="min-h-[110px] text-forest-900/70 text-base leading-relaxed"
                >
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeTab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      {tabContent[activeTab]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </article>

          {/* Reviews */}
          <section id="reviews" aria-labelledby="reviews-heading" className="mt-20 md:mt-28 scroll-mt-28">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <span className="text-gold-600 uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
                  In Their Words
                </span>
                <h2 id="reviews-heading" className="text-3xl md:text-4xl font-serif text-forest-900">
                  Customer Reviews
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <Stars rating={product.rating} size={18} />
                <span className="text-forest-900/60 text-sm">
                  {product.rating} out of 5 · {product.reviewCount} reviews
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((review) => (
                <figure
                  key={review.id}
                  className="bg-white rounded-2xl border border-forest-900/10 p-6 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Stars rating={review.rating} size={13} />
                    <span className="text-forest-900/40 text-xs">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <blockquote className="flex-1">
                    <p className="text-forest-900/75 text-sm leading-relaxed">
                      {review.body}
                    </p>
                  </blockquote>
                  <figcaption className="mt-4 pt-4 border-t border-forest-900/8 flex items-center justify-between">
                    <span className="text-forest-900 font-semibold text-sm">
                      {review.author}
                    </span>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1.5 text-forest-700 text-[0.65rem] uppercase tracking-[0.1em] font-semibold">
                        <BadgeCheck size={13} aria-hidden="true" />
                        Verified Buyer
                      </span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>

            <p className="text-forest-900/45 text-xs mt-6">
              Reviews come from verified buyers. After your order, you will receive a
              private review link by email.
            </p>
          </section>

          {/* Related */}
          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-20 md:mt-28">
              <div className="text-center mb-10">
                <span className="text-gold-600 uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
                  Complete the Ritual
                </span>
                <h2 id="related-heading" className="text-3xl md:text-4xl font-serif text-forest-900">
                  You May Also Like
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-forest-900/10 px-4 py-3 lg:hidden z-40 flex items-center justify-between gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="min-w-0">
          <p className="text-[0.65rem] text-forest-900/60 uppercase tracking-widest truncate">
            {product.name}
          </p>
          <p className="text-forest-900 font-bold">{formatPaise(price)}</p>
        </div>
        <button
          onClick={addToCart}
          disabled={outOfStock}
          className={cn(
            'px-7 py-3 rounded-full text-xs uppercase tracking-[0.15em] font-medium transition-colors flex-shrink-0',
            outOfStock
              ? 'bg-forest-900/10 text-forest-900/40'
              : 'bg-forest-900 text-cream hover:bg-forest-800'
          )}
        >
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      <Footer />
    </>
  )
}
