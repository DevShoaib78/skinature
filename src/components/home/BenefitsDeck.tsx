'use client'

import { motion } from 'framer-motion'

/**
 * "Why Thousands Choose Skinature" (reference: dyou.co's typographic benefit
 * statements — big serif lines with italic accents, hairline dividers).
 * Content per the client's info doc.
 */

const BENEFITS: { title: string; accent: string; note: string }[] = [
  { title: 'Clean', accent: 'Formulas', note: 'Only ingredients with a purpose. No unnecessary fillers.' },
  { title: 'Plant', accent: 'Driven', note: 'Botanicals lead every single formula.' },
  { title: 'Lab', accent: 'Tested', note: 'Every batch is tested for quality and safety.' },
  { title: 'Cruelty', accent: 'Free', note: 'Kind to your skin. Kinder to the world.' },
  { title: 'AYUSH', accent: 'Certified', note: 'Recognised under India’s Ministry of AYUSH.' },
  { title: 'Clean', accent: 'Beauty', note: 'Nothing harsh. Nothing hidden.' },
  { title: 'Gender', accent: 'Neutral', note: 'Made for every gender.' },
]

export default function BenefitsDeck() {
  return (
    <section aria-labelledby="benefits-heading" className="py-24 md:py-32 bg-forest-900 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-14 md:mb-20">
          <span className="text-gold-300 uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
            The Skinature Standard
          </span>
          <h2 id="benefits-heading" className="text-4xl md:text-6xl font-serif text-cream leading-[1.05]">
            Why thousands
            <br />
            choose <span className="italic text-gold-300">Skinature.</span>
          </h2>
        </div>

        <ol className="divide-y divide-cream/12 border-y border-cream/12">
          {BENEFITS.map((b, i) => (
            <motion.li
              key={`${b.title}-${b.accent}`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group flex flex-col md:flex-row md:items-baseline gap-1.5 md:gap-8 py-6 md:py-7"
            >
              <span className="text-gold-300/60 font-sans text-xs tracking-[0.25em] tabular-nums w-10 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-cream leading-tight md:w-[46%] flex-shrink-0">
                {b.title} <span className="italic text-gold-300">{b.accent}</span>
              </h3>
              <p className="text-cream/60 text-base md:text-lg leading-relaxed group-hover:text-cream/85 transition-colors duration-500">
                {b.note}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
