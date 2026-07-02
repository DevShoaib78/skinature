'use client'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Product } from '@/lib/data'

export default function BestSellers({ products: bestSellers }: { products: Product[] }) {
  return (
    <section id="shop" aria-labelledby="best-sellers-heading" className="py-24 bg-cream scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
            <span className="text-gold-600 uppercase tracking-[0.2em] text-xs font-bold mb-3 block">Favorites</span>
            <h2 id="best-sellers-heading" className="text-4xl md:text-5xl font-serif text-forest-900">Loved by Skin</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </div>

        <div className="mt-16 text-center">
            <Link href="/shop">
                <Button variant="outline" className="px-10">View All Products</Button>
            </Link>
        </div>
      </div>
    </section>
  )
}
