'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Hero slideshow (reference: forestessentialsindia.com) — 3 product slides + 1
 * brand slide. Desktop: text overlays the banner's built-in empty left zone.
 * Mobile: split layout — image panel on top, text on a solid cream panel below
 * (no overlay), centered; overlay text on cropped art was unreadable.
 * Auto-advances every 6.5s (no hover-pause; arrows/dots reset the timer).
 */

const EASE = [0.22, 0.61, 0.36, 1] as const
const AUTO_MS = 6500

interface Slide {
  key: string
  image: string
  eyebrow: string
  titleLines: [string, string]
  copy: string
  cta: { label: string; href: string }
  accent: string
  /** Keeps the product visible when the 16:9 art is cropped on portrait screens. */
  mobilePosition: string
}

const SLIDES: Slide[] = [
  {
    key: 'hair-mask',
    image: '/AI generated mockups/Root Revival Hair Mask and Cocktail Banner.png',
    eyebrow: 'The Complete Hair Ritual',
    titleLines: ['Root Revival', 'Hair Mask & Cocktail'],
    copy: 'Fenugreek, hibiscus and sidr, brewed into a two-step ritual that strengthens hair from the roots.',
    cta: { label: 'Discover the Ritual', href: '/product/root-revival-hair-mask-cocktail' },
    accent: 'text-mauve',
    mobilePosition: 'object-[72%_center]',
  },
  {
    key: 'face-mask',
    image: '/AI generated mockups/Brightening and Cleansing Mask Banner.png',
    eyebrow: 'Glow, The Honest Way',
    titleLines: ['Brightening &', 'Cleansing Mask'],
    copy: 'Rose, orange peel and colloidal oatmeal that lift tan, unclog pores and revive dull skin.',
    cta: { label: 'Reveal Your Glow', href: '/product/brightening-cleansing-mask' },
    accent: 'text-olive',
    mobilePosition: 'object-[70%_center]',
  },
  {
    key: 'hair-oil',
    image: '/AI generated mockups/Root Revival Hair Oil Banner.png',
    eyebrow: 'Cold-Pressed Nourishment',
    titleLines: ['Root Revival', 'Hair Oil'],
    copy: 'Jojoba, almond and black seed, cold-pressed to nourish the scalp and bring back thickness.',
    cta: { label: 'Nourish Your Roots', href: '/product/root-revival-hair-oil' },
    accent: 'text-terracotta',
    mobilePosition: 'object-[72%_center]',
  },
  {
    key: 'brand',
    image: '/AI generated mockups/Skinature Family Banner.png',
    eyebrow: 'Nurtured by Nature',
    titleLines: ['Nature always knew', 'the secret.'],
    copy: 'We simply packed it for you. Clean, botanical skincare and haircare, handcrafted in India, lab-tested, made to deliver visible results.',
    cta: { label: 'Explore Our Products', href: '/shop' },
    accent: 'text-forest-800',
    mobilePosition: 'object-[68%_center]',
  },
]

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length)
  }, [])

  // Auto-advance; re-arming on every index change means any manual navigation
  // naturally resets the clock.
  useEffect(() => {
    if (prefersReducedMotion) return
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, AUTO_MS)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [prefersReducedMotion, index])

  const slide = SLIDES[index]

  return (
    <section
      aria-label="Featured products"
      className="relative h-[92svh] min-h-[640px] w-full overflow-hidden bg-cream flex flex-col md:block"
    >
      {/* Backdrop — fills the top panel on mobile, the whole section on desktop */}
      <div className="relative flex-1 overflow-hidden md:absolute md:inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 1.1, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className={cn('object-cover md:object-center', slide.mobilePosition)}
            />
            {/* Desktop: gentle left wash over the banner's text zone */}
            <div
              className="hidden md:block absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, rgba(251,247,236,0.82) 0%, rgba(251,247,236,0.35) 38%, rgba(251,247,236,0) 60%)',
              }}
              aria-hidden="true"
            />
            {/* Mobile: soft seam into the cream text panel below */}
            <div
              className="md:hidden absolute inset-x-0 bottom-0 h-14 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(251,247,236,0), #FBF7EC)',
              }}
              aria-hidden="true"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text — solid cream panel (mobile) / overlay column (desktop) */}
      <div className="relative z-10 bg-cream px-6 pt-6 pb-24 text-center md:bg-transparent md:absolute md:inset-0 md:px-10 lg:px-16 md:flex md:items-center md:text-left md:pt-0 md:pb-0">
        <div className="w-full max-w-7xl mx-auto">
          <div className="md:max-w-xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.key}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: -14 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <p className="text-[0.65rem] md:text-xs uppercase tracking-[0.32em] font-semibold text-forest-800/80 mb-3 md:mb-5">
                  {slide.eyebrow}
                </p>
                <h1 className="font-serif text-forest-900 leading-[1.06] mb-3.5 md:mb-6">
                  <span className="block text-[1.9rem] md:text-6xl lg:text-7xl font-light tracking-tight">
                    {slide.titleLines[0]}
                  </span>
                  <span
                    className={cn(
                      'block text-[1.9rem] md:text-6xl lg:text-7xl font-light tracking-tight italic',
                      slide.accent
                    )}
                  >
                    {slide.titleLines[1]}
                  </span>
                </h1>
                <p className="text-forest-900/70 text-sm md:text-lg leading-relaxed mb-6 md:mb-10 max-w-md mx-auto md:mx-0">
                  {slide.copy}
                </p>
                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center px-9 md:px-10 py-3.5 md:py-4 bg-forest-900 text-cream rounded-full text-[0.7rem] md:text-xs uppercase tracking-[0.28em] font-medium transition-all duration-400 hover:bg-forest-800 hover:shadow-[inset_0_0_0_1px_rgba(226,210,165,0.6),0_8px_30px_rgba(42,62,44,0.28)]"
                >
                  {slide.cta.label}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Controls — centered: arrow · dots · arrow */}
      <div className="absolute z-20 bottom-6 md:bottom-9 left-0 right-0">
        <div className="flex items-center justify-center gap-5 md:gap-6">
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full border border-forest-900/25 bg-cream/70 backdrop-blur-sm text-forest-900 flex items-center justify-center hover:bg-forest-900 hover:text-cream transition-colors duration-300"
          >
            <ChevronLeft size={18} strokeWidth={1.75} />
          </button>

          <div className="flex items-center gap-2.5" role="tablist" aria-label="Slides">
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${s.titleLines.join(' ')}`}
                onClick={() => go(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-400',
                  i === index
                    ? 'w-8 bg-forest-900'
                    : 'w-3 bg-forest-900/30 hover:bg-forest-900/55'
                )}
              />
            ))}
          </div>

          <button
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full border border-forest-900/25 bg-cream/70 backdrop-blur-sm text-forest-900 flex items-center justify-center hover:bg-forest-900 hover:text-cream transition-colors duration-300"
          >
            <ChevronRight size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </section>
  )
}
