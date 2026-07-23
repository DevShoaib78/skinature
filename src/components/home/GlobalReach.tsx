'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

/**
 * "Globally Glowing and Growing" — heading + map kept per the client brief, the
 * presentation reworked: the map floats on a beige panel with soft gold pulse
 * points, and the brand's three beliefs read as an editorial list.
 */

const BELIEFS = [
  {
    lead: 'Skinature was born out of belief.',
    body: "Belief that skincare and haircare shouldn't be confusing, harsh, or filled with chemicals.",
  },
  {
    lead: 'Belief that nature still holds the answers.',
    body: 'Time-tested botanicals, honestly formulated and lab-tested for real results.',
  },
  {
    lead: 'Belief that pure means pure.',
    body: 'What we put on our bodies should be as clean as what we put in them.',
  },
]


export default function GlobalReach() {
  return (
    <section aria-labelledby="global-heading" className="py-24 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-gold-600 uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
            Beyond Borders
          </span>
          <h2 id="global-heading" className="text-4xl md:text-5xl font-serif text-forest-900">
            Globally Glowing <span className="italic text-forest-800">and Growing</span>
          </h2>
          <p className="text-forest-900/60 text-lg mt-4 max-w-xl mx-auto">
            Skinature has found a home in these countries so far, and we&apos;re only
            getting started.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          {/* Map panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-3 relative bg-beige rounded-[2rem] border border-forest-900/8 p-6 md:p-10"
          >
            <div className="relative aspect-[16/10] animate-float">
              <Image
                src="/globalmap.webp"
                alt="Countries where Skinature ships and grows"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-center text-forest-900/45 text-xs uppercase tracking-[0.25em] mt-6">
              Proudly made in India · Loved across the world
            </p>
          </motion.div>

          {/* Beliefs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="lg:col-span-2 space-y-8"
          >
            {BELIEFS.map((b) => (
              <div key={b.lead} className="border-l-2 border-gold-500/60 pl-5">
                <p className="font-serif text-xl md:text-2xl text-forest-900 italic leading-snug mb-1.5">
                  {b.lead}
                </p>
                <p className="text-forest-900/65 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
