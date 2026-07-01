'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function GlobalReach() {
  return (
    <section className="py-24 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="lg:pr-10"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-forest-900 mb-8 leading-tight">
            Globally Glowing and Growing
          </h2>

          <p className="text-forest-900/70 mb-6 leading-relaxed text-lg">
            Skinature has found a home in these countries so far. We wish to receive your support to keep growing
          </p>

          <p className="text-forest-900 font-bold mb-4 leading-relaxed text-lg">
            Skinature was born out of belief.
          </p>

          <p className="text-forest-900/70 mb-6 leading-relaxed text-lg">
            Belief that skincare and haircare shouldn&apos;t be confusing, harsh, or filled with chemicals.
          </p>

          <p className="text-forest-900 font-bold mb-4 leading-relaxed text-lg">
            Belief that nature still holds the answers.
          </p>

          <p className="text-forest-900/70 leading-relaxed text-lg">
            And belief that what we put on our bodies should be as clean and pure as what we put in them.
          </p>
        </motion.div>

        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative aspect-[16/10] rounded-2xl overflow-hidden"
        >
          <Image
            src="/globalmap.webp"
            alt="Skinature Global Reach - Countries we serve"
            fill
            className="object-contain"
          />
        </motion.div>
      </div>
    </section>
  )
}
