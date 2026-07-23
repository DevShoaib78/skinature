'use client'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Product } from '@/lib/data'

/**
 * Products section (reference: kamaayurveda.in) — clean white cards, serif name,
 * one benefit line, price. Copy per the client brief: "Loved by thousands &
 * counting" heading; the CTA reads "Explore Our Products".
 */
export default function BestSellers({ products }: { products: Product[] }) {
  return (
    <section id="shop" aria-labelledby="best-sellers-heading" className="py-24 bg-cream scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold-600 uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
            Our Collection
          </span>
          <h2 id="best-sellers-heading" className="text-4xl md:text-5xl font-serif text-forest-900">
            Loved by Thousands <span className="italic text-forest-800">&amp; Counting</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-7">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: index * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/shop">
            <Button variant="outline" className="px-10">Explore Our Products</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
