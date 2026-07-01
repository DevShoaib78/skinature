'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function CustomerReviews() {
  return (
    <section aria-labelledby="customer-reviews-heading" className="py-24 md:py-32 bg-forest-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 id="customer-reviews-heading" className="font-cursive text-6xl md:text-7xl text-forest-900 mb-4">
            Customer Reviews
          </h2>
        </motion.div>

        {/* Reviews Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full"
        >
          <Image
            src="/customerreviews.webp"
            alt="Customer reviews: what our customers say about Skinature"
            width={1400}
            height={800}
            className="w-full h-auto rounded-2xl"
          />
        </motion.div>
      </div>
    </section>
  )
}
