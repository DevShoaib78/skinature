'use client'

import { useMemo, useSyncExternalStore } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Mail, PackageCheck, Truck } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { formatPaise } from '@/lib/format'

interface StoredOrderItem {
  productId: string
  name: string
  image: string
  qty: number
  unitPricePaise: number
}

interface StoredOrder {
  id: string
  createdAt: string
  customer: { name: string; email: string; phone: string }
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
  items: StoredOrderItem[]
  subtotalPaise: number
  shippingPaise: number
  totalPaise: number
}

const noopSubscribe = () => () => {}

export default function OrderSuccessClient() {
  // Hydration-safe read of the last order: null on the server, the stored
  // value after hydration, with no state updates inside effects.
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
  const raw = useSyncExternalStore(
    noopSubscribe,
    () => sessionStorage.getItem('skinature-last-order'),
    () => null
  )
  const order = useMemo<StoredOrder | null>(() => {
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [raw])

  if (!hydrated) {
    return (
      <>
        <Navbar />
        <main className="pt-40 min-h-screen bg-cream" />
        <Footer />
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main
          id="main-content"
          className="pt-32 pb-24 min-h-screen bg-cream flex items-center justify-center"
        >
          <div className="text-center px-6">
            <h1 className="font-serif text-4xl text-forest-900 mb-4">
              No recent order found
            </h1>
            <p className="text-forest-900/55 mb-8">
              It looks like there is no order to show here.
            </p>
            <Link
              href="/shop"
              className="inline-block px-10 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
            >
              Shop the Collection
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
        <div className="max-w-2xl mx-auto px-6">
          {/* Confirmation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200 }}
              className="inline-flex mb-6"
            >
              <CheckCircle2
                size={64}
                strokeWidth={1.25}
                className="text-forest-700"
                aria-hidden="true"
              />
            </motion.div>
            <h1 className="font-serif text-4xl md:text-5xl text-forest-900 mb-3">
              Order Confirmed
            </h1>
            <p className="text-forest-900/60 text-lg">
              Thank you, {order.customer.name.split(' ')[0]}. Nature is on its way.
            </p>
            <p className="mt-4 inline-block bg-white border border-forest-900/10 rounded-full px-5 py-2 text-sm text-forest-900 font-semibold tracking-wide">
              Order {order.id}
            </p>
          </motion.div>

          {/* What happens next */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10"
          >
            {[
              {
                icon: Mail,
                title: 'Confirmation Email',
                desc: `Invoice sent to ${order.customer.email}`,
              },
              {
                icon: PackageCheck,
                title: 'Handcrafted & Packed',
                desc: 'Your order is prepared with care',
              },
              {
                icon: Truck,
                title: 'On Its Way',
                desc: `Shipping to ${order.address.city}, ${order.address.state}`,
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-forest-900/10 p-5 text-center"
              >
                <Icon
                  size={22}
                  strokeWidth={1.5}
                  className="text-gold-600 mx-auto mb-3"
                  aria-hidden="true"
                />
                <p className="text-forest-900 font-semibold text-sm mb-1">{title}</p>
                <p className="text-forest-900/50 text-xs leading-relaxed break-words">
                  {desc}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="bg-white rounded-[1.75rem] border border-forest-900/10 p-7 mb-8"
          >
            <h2 className="font-serif text-2xl text-forest-900 mb-6">Order Summary</h2>

            <ul className="space-y-4 mb-6">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4">
                  <span className="relative w-14 h-16 rounded-lg overflow-hidden bg-forest-50 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </span>
                  <span className="flex-1 text-sm text-forest-900">
                    {item.name}
                    <span className="text-forest-900/45"> × {item.qty}</span>
                  </span>
                  <span className="text-sm font-medium text-forest-900 tabular-nums">
                    {formatPaise(item.unitPricePaise * item.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="space-y-2.5 text-sm border-t border-forest-900/10 pt-5">
              <div className="flex justify-between">
                <dt className="text-forest-900/60">Subtotal</dt>
                <dd className="font-medium text-forest-900 tabular-nums">
                  {formatPaise(order.subtotalPaise)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-forest-900/60">Shipping</dt>
                <dd className="font-medium text-forest-900 tabular-nums">
                  {formatPaise(order.shippingPaise)}
                </dd>
              </div>
              <div className="flex justify-between items-baseline border-t border-forest-900/10 pt-4 mt-4">
                <dt className="text-forest-900 font-semibold">Total Paid</dt>
                <dd className="font-serif text-2xl text-forest-900">
                  {formatPaise(order.totalPaise)}
                </dd>
              </div>
            </dl>

            <div className="border-t border-forest-900/10 mt-6 pt-6">
              <p className="text-xs uppercase tracking-[0.15em] font-semibold text-forest-900/50 mb-2">
                Delivering To
              </p>
              <p className="text-sm text-forest-900/75 leading-relaxed">
                {order.customer.name}
                <br />
                {order.address.line1}
                {order.address.line2 && (
                  <>
                    <br />
                    {order.address.line2}
                  </>
                )}
                <br />
                {order.address.city}, {order.address.state} {order.address.pincode}
                <br />
                {order.customer.phone}
              </p>
            </div>
          </motion.div>

          <div className="text-center">
            <Link
              href="/shop"
              className="inline-block px-10 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
