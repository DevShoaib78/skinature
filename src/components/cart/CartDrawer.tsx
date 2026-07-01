'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart, cartCount, cartSubtotalPaise } from '@/store/cart'
import { getProductById, effectivePricePaise } from '@/lib/data'
import { formatPaise } from '@/lib/format'

export default function CartDrawer() {
  const items = useCart((s) => s.items)
  const drawerOpen = useCart((s) => s.drawerOpen)
  const setDrawer = useCart((s) => s.setDrawer)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)

  const count = cartCount(items)
  const subtotal = cartSubtotalPaise(items)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) setDrawer(false)
    },
    [drawerOpen, setDrawer]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setDrawer(false)}
            className="fixed inset-0 z-[110] bg-forest-950/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[120] w-full max-w-md bg-cream flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-forest-900/10">
              <h2 className="font-serif text-2xl text-forest-900">
                Your Cart{' '}
                {count > 0 && (
                  <span className="text-forest-900/40 text-lg">({count})</span>
                )}
              </h2>
              <button
                onClick={() => setDrawer(false)}
                aria-label="Close cart"
                className="text-forest-900 hover:text-gold-600 transition-colors p-2 -mr-2"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {items.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <ShoppingBag
                  size={44}
                  strokeWidth={1}
                  className="text-forest-900/25 mb-6"
                  aria-hidden="true"
                />
                <p className="font-serif text-2xl text-forest-900 mb-2">
                  Your cart is empty
                </p>
                <p className="text-forest-900/55 text-sm leading-relaxed mb-8">
                  Nature has plenty to offer. Start with our best sellers.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setDrawer(false)}
                  className="inline-block px-8 py-3.5 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
                >
                  Shop the Collection
                </Link>
              </div>
            ) : (
              <>
                {/* Items */}
                <ul className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-forest-900/8">
                  {items.map((item) => {
                    const product = getProductById(item.productId)
                    if (!product) return null
                    const unit = effectivePricePaise(product)
                    return (
                      <li key={item.productId} className="py-4 flex gap-4">
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={() => setDrawer(false)}
                          className="relative w-20 h-24 rounded-xl overflow-hidden bg-forest-50 flex-shrink-0"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${product.slug}`}
                              onClick={() => setDrawer(false)}
                              className="font-serif text-base text-forest-900 leading-snug hover:text-gold-600 transition-colors"
                            >
                              {product.name}
                            </Link>
                            <button
                              onClick={() => remove(item.productId)}
                              aria-label={`Remove ${product.name} from cart`}
                              className="text-forest-900/35 hover:text-red-600 transition-colors p-1 flex-shrink-0"
                            >
                              <Trash2 size={15} strokeWidth={1.75} />
                            </button>
                          </div>
                          <p className="text-forest-900/50 text-xs mt-0.5">
                            {formatPaise(unit)}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            {/* Qty stepper */}
                            <div className="inline-flex items-center border border-forest-900/15 rounded-full">
                              <button
                                onClick={() => setQty(item.productId, item.qty - 1)}
                                aria-label="Decrease quantity"
                                className="w-8 h-8 flex items-center justify-center text-forest-900/60 hover:text-forest-900 transition-colors"
                              >
                                <Minus size={13} strokeWidth={2} />
                              </button>
                              <span className="w-7 text-center text-sm font-medium text-forest-900 tabular-nums">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => setQty(item.productId, item.qty + 1)}
                                aria-label="Increase quantity"
                                className="w-8 h-8 flex items-center justify-center text-forest-900/60 hover:text-forest-900 transition-colors"
                              >
                                <Plus size={13} strokeWidth={2} />
                              </button>
                            </div>

                            <p className="font-semibold text-forest-900 text-sm tabular-nums">
                              {formatPaise(unit * item.qty)}
                            </p>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>

                {/* Footer */}
                <div className="border-t border-forest-900/10 px-6 py-5 space-y-4 bg-white/60">
                  <div className="flex items-center justify-between">
                    <span className="text-forest-900/60 text-sm">Subtotal</span>
                    <span className="font-serif text-2xl text-forest-900">
                      {formatPaise(subtotal)}
                    </span>
                  </div>
                  <p className="text-forest-900/45 text-xs">
                    Shipping calculated at checkout.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/cart"
                      onClick={() => setDrawer(false)}
                      className="text-center px-4 py-3.5 border border-forest-900 text-forest-900 rounded-full text-xs uppercase tracking-[0.2em] font-medium hover:bg-forest-50 transition-colors"
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={() => setDrawer(false)}
                      className="text-center px-4 py-3.5 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.2em] font-medium hover:bg-forest-800 transition-colors"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
