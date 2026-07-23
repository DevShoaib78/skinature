'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Star, BadgeCheck, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Review shuffle-deck (reference: kamaayurveda.in's stacked review cards) with
 * source badges — "one stone, two places": Google + Amazon reviews surface here.
 *
 * CURATED SET (client-approved approach): these placeholders are swapped for the
 * client's real Google / Amazon reviews as they arrive; the live Google rating
 * hook (Places API) plugs into the summary column once the business profile +
 * API key are provided.
 */

interface Testimonial {
  quote: string
  author: string
  city: string
  source: 'Google' | 'Amazon' | 'Skinature.org'
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'The hair mask and cocktail duo brought my hair back to life. Hair fall reduced within three weeks, and the shine is real.',
    author: 'Ayesha R.',
    city: 'Hyderabad',
    source: 'Google',
    rating: 5,
  },
  {
    quote:
      'The cleansing mask lifted my tan in two uses. No breakouts, no dryness, just an honest glow.',
    author: 'Priya S.',
    city: 'Bengaluru',
    source: 'Google',
    rating: 5,
  },
  {
    quote:
      'The hair oil is light, non-sticky and smells like real ingredients, not perfume. My scalp finally feels healthy.',
    author: 'Mohammed F.',
    city: 'Chennai',
    source: 'Amazon',
    rating: 5,
  },
  {
    quote:
      "Ordered the Bridal Kit for my sister's wedding. The packaging alone felt like a gift, and the products delivered.",
    author: 'Sana K.',
    city: 'Mumbai',
    source: 'Google',
    rating: 5,
  },
  {
    quote:
      'Rare to find gender-neutral, chemical-free products that actually work. The whole family uses the kit now.',
    author: 'Arjun M.',
    city: 'Pune',
    source: 'Amazon',
    rating: 4,
  },
  {
    quote:
      'You can tell everything is made with intention. Clean ingredient lists, and results you can actually see.',
    author: 'Nadia H.',
    city: 'Delhi',
    source: 'Skinature.org',
    rating: 5,
  },
]

const SOURCE_STYLE: Record<Testimonial['source'], string> = {
  Google: 'bg-forest-50 text-forest-800 border-forest-800/20',
  Amazon: 'bg-gold-100 text-gold-600 border-gold-500/30',
  'Skinature.org': 'bg-sage/40 text-forest-800 border-forest-800/15',
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 text-gold-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? 'currentColor' : 'none'}
          strokeWidth={1.5}
          className={i < rating ? '' : 'text-gold-500/35'}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

export default function ReviewDeck() {
  const [index, setIndex] = useState(0)

  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length)
  const visible = [0, 1, 2].map((o) => TESTIMONIALS[(index + o) % TESTIMONIALS.length])

  return (
    <section aria-labelledby="reviews-heading" className="py-24 md:py-32 bg-beige overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Summary column */}
        <div>
          <span className="text-gold-600 uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
            In Their Words
          </span>
          <h2 id="reviews-heading" className="text-4xl md:text-5xl font-serif text-forest-900 leading-tight mb-6">
            Real people. <span className="italic text-forest-800">Real results.</span>
          </h2>
          <p className="text-forest-900/70 text-lg leading-relaxed mb-8 max-w-md">
            From Google to Amazon to right here, the words are theirs, we just collect
            them. Shuffle through what our customers keep telling us.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-forest-900/10 text-sm text-forest-900">
              <Stars rating={5} />
              <span className="font-semibold">Rated on Google</span>
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-forest-900/10 text-sm text-forest-900">
              <BadgeCheck size={15} className="text-gold-600" aria-hidden="true" />
              <span className="font-semibold">Loved on Amazon</span>
            </span>
          </div>

          <button
            onClick={next}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
          >
            Shuffle Reviews
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>

        {/* The deck */}
        <div className="relative h-[380px] sm:h-[340px] select-none" aria-live="polite">
          <AnimatePresence initial={false}>
            {visible.map((t, depth) => (
              <motion.figure
                key={`${t.author}-${t.quote.slice(0, 12)}`}
                initial={depth === 0 ? { opacity: 0, y: -30, rotate: -3 } : false}
                animate={{
                  opacity: 1 - depth * 0.18,
                  y: depth * 18,
                  x: depth * 10,
                  rotate: depth * 1.6,
                  scale: 1 - depth * 0.045,
                  zIndex: 10 - depth,
                }}
                exit={{ opacity: 0, x: -140, rotate: -8, transition: { duration: 0.35 } }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="absolute inset-x-0 top-0 bg-white rounded-[1.5rem] border border-forest-900/10 shadow-[0_18px_45px_-18px_rgba(42,62,44,0.25)] p-7 md:p-9 cursor-pointer"
                onClick={next}
                style={{ transformOrigin: 'bottom left' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <Stars rating={t.rating} />
                  <span
                    className={cn(
                      'text-[0.6rem] uppercase tracking-[0.14em] font-bold px-3 py-1.5 rounded-full border',
                      SOURCE_STYLE[t.source]
                    )}
                  >
                    {t.source === 'Skinature.org' ? 'Verified Buyer' : `${t.source} Review`}
                  </span>
                </div>
                <blockquote>
                  <p className="font-serif text-xl md:text-2xl text-forest-900 leading-snug">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-5 text-forest-900/55 text-sm">
                  <span className="font-semibold text-forest-900">{t.author}</span> · {t.city}
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
