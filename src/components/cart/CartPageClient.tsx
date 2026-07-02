'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, Leaf, FlaskConical, Heart, Shield } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCart, cartCount, cartSubtotalPaise } from '@/store/cart'
import { formatPaise } from '@/lib/format'
import {
  SHIPPING_TELANGANA_PAISE,
  SHIPPING_REST_OF_INDIA_PAISE,
} from '@/lib/shipping'

const TRUST = [
  { icon: Leaf, label: 'Chemical-Free' },
  { icon: FlaskConical, label: 'Lab-Tested' },
  { icon: Heart, label: 'Cruelty-Free' },
  { icon: Shield, label: 'Safe for Kids' },
]

export default function CartPageClient() {
  const items = useCart((s) => s.items)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)
  const clear = useCart((s) => s.clear)

  const count = cartCount(items)
  const subtotal = cartSubtotalPaise(items)

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
        <div className="max-w-6xl mx-auto px-6">
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
                Cart
              </li>
            </ol>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif text-forest-900 mb-10"
          >
            Your Cart{' '}
            {count > 0 && (
              <span className="text-forest-900/35 text-3xl">({count})</span>
            )}
          </motion.h1>

          {items.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20">
              <ShoppingBag
                size={52}
                strokeWidth={0.9}
                className="text-forest-900/20 mx-auto mb-7"
                aria-hidden="true"
              />
              <p className="font-serif text-3xl text-forest-900 mb-3">
                Your cart is empty
              </p>
              <p className="text-forest-900/55 mb-10 max-w-md mx-auto">
                Nature has plenty to offer. Begin your ritual with our best sellers.
              </p>
              <Link
                href="/shop"
                className="inline-block px-10 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
              >
                Shop the Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Items */}
              <div className="lg:col-span-2">
                <ul className="divide-y divide-forest-900/10 border-y border-forest-900/10">
                  {items.map((item) => {
                    const unit = item.unitPricePaise
                    return (
                      <li key={item.productId} className="py-6 flex gap-5">
                        <Link
                          href={`/product/${item.slug}`}
                          className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-forest-50 flex-shrink-0"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        </Link>

                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Link
                                href={`/product/${item.slug}`}
                                className="font-serif text-lg sm:text-xl text-forest-900 leading-snug hover:text-gold-600 transition-colors"
                              >
                                {item.name}
                              </Link>
                            </div>
                            <button
                              onClick={() => remove(item.productId)}
                              aria-label={`Remove ${item.name} from cart`}
                              className="text-forest-900/35 hover:text-red-600 transition-colors p-1.5"
                            >
                              <Trash2 size={17} strokeWidth={1.75} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-4">
                            <div className="inline-flex items-center border border-forest-900/15 rounded-full">
                              <button
                                onClick={() => setQty(item.productId, item.qty - 1)}
                                aria-label="Decrease quantity"
                                className="w-9 h-9 flex items-center justify-center text-forest-900/60 hover:text-forest-900 transition-colors"
                              >
                                <Minus size={14} strokeWidth={2} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-forest-900 tabular-nums">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => setQty(item.productId, item.qty + 1)}
                                aria-label="Increase quantity"
                                className="w-9 h-9 flex items-center justify-center text-forest-900/60 hover:text-forest-900 transition-colors"
                              >
                                <Plus size={14} strokeWidth={2} />
                              </button>
                            </div>

                            <div className="text-right">
                              {item.qty > 1 && (
                                <p className="text-forest-900/40 text-xs">
                                  {formatPaise(unit)} each
                                </p>
                              )}
                              <p className="font-semibold text-forest-900 tabular-nums">
                                {formatPaise(unit * item.qty)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>

                <div className="flex items-center justify-between mt-6">
                  <Link
                    href="/shop"
                    className="text-xs uppercase tracking-[0.2em] font-semibold text-forest-900/70 hover:text-forest-900 underline decoration-gold-500/60 hover:decoration-gold-500 underline-offset-8 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={clear}
                    className="text-xs uppercase tracking-[0.15em] text-forest-900/45 hover:text-red-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Summary */}
              <aside aria-label="Order summary" className="lg:sticky lg:top-32 h-fit">
                <div className="bg-white rounded-[1.75rem] border border-forest-900/10 p-7">
                  <h2 className="font-serif text-2xl text-forest-900 mb-6">
                    Order Summary
                  </h2>

                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-forest-900/60">
                        Subtotal ({count} {count === 1 ? 'item' : 'items'})
                      </dt>
                      <dd className="font-medium text-forest-900 tabular-nums">
                        {formatPaise(subtotal)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-forest-900/60">Shipping</dt>
                      <dd className="text-forest-900/60 text-right">
                        {formatPaise(SHIPPING_TELANGANA_PAISE)} Telangana
                        <br />
                        {formatPaise(SHIPPING_REST_OF_INDIA_PAISE)} rest of India
                      </dd>
                    </div>
                  </dl>

                  <div className="border-t border-forest-900/10 mt-5 pt-5 flex justify-between items-baseline">
                    <span className="text-forest-900 font-semibold">Total</span>
                    <span className="font-serif text-2xl text-forest-900">
                      {formatPaise(subtotal)}{' '}
                      <span className="text-sm text-forest-900/45 font-sans">
                        + shipping
                      </span>
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="block text-center mt-6 px-8 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 hover:shadow-[inset_0_0_0_1px_rgba(197,160,89,0.55),0_8px_30px_rgba(26,60,52,0.25)] transition-all duration-400"
                  >
                    Proceed to Checkout
                  </Link>

                  <p className="text-forest-900/45 text-xs text-center mt-4">
                    Secure prepaid checkout via UPI, cards, and netbanking.
                  </p>
                </div>

                {/* Trust strip */}
                <div className="grid grid-cols-4 gap-2 mt-6 px-2">
                  {TRUST.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                      <Icon size={16} strokeWidth={1.5} className="text-gold-600" aria-hidden="true" />
                      <span className="text-[0.55rem] uppercase tracking-[0.1em] text-forest-900/55 leading-tight">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
