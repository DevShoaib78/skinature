'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

const PILLARS = ['Chemical-Free', 'Lab-Tested', 'Cruelty-Free', 'Safe for Kids']

const EASE = [0.22, 0.61, 0.36, 1] as const

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    if (prefersReducedMotion) {
      v.pause()
      return
    }

    // Force reload of the video element to ensure source resolution after hydration.
    v.load()

    const tryPlay = () => {
      // Skip if already playing
      if (!v.paused && !v.ended) return
      const p = v.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Autoplay was blocked — will retry on next event/interaction.
        })
      }
    }

    // Strategy 1: try right away
    tryPlay()

    // Strategy 2: try when video has loaded enough data
    v.addEventListener('canplay', tryPlay)
    v.addEventListener('loadeddata', tryPlay)
    v.addEventListener('canplaythrough', tryPlay)

    // Strategy 3: fall back to user interaction (Brave/Firefox/strict autoplay policies)
    // On any interaction, force the video to play. Once playing, listeners are no-ops.
    const interactionEvents = ['pointerdown', 'click', 'touchstart', 'keydown', 'wheel', 'scroll']
    const interactionHandler = () => tryPlay()

    interactionEvents.forEach((ev) =>
      window.addEventListener(ev, interactionHandler, { passive: true })
    )

    return () => {
      v.removeEventListener('canplay', tryPlay)
      v.removeEventListener('loadeddata', tryPlay)
      v.removeEventListener('canplaythrough', tryPlay)
      interactionEvents.forEach((ev) =>
        window.removeEventListener(ev, interactionHandler)
      )
    }
  }, [prefersReducedMotion])

  const fadeUp = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: EASE },
        }

  return (
    <>
    <section
      aria-label="Hero"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-cream"
    >
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Graded frost — the video defocuses beneath the text column (desktop) */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: 'blur(16px) saturate(1.05)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.05)',
            maskImage:
              'linear-gradient(to right, black 0%, rgba(0,0,0,0.85) 32%, transparent 62%)',
            WebkitMaskImage:
              'linear-gradient(to right, black 0%, rgba(0,0,0,0.85) 32%, transparent 62%)',
          }}
          aria-hidden="true"
        />

        {/* Cream wash — stronger on the left where the text lives (desktop) */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(253,252,248,0.9) 0%, rgba(253,252,248,0.66) 32%, rgba(253,252,248,0.26) 55%, rgba(253,252,248,0) 78%)',
          }}
          aria-hidden="true"
        />

        {/* Mobile readability — vertical wash */}
        <div
          className="md:hidden absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(253,252,248,0.82) 0%, rgba(253,252,248,0.45) 48%, rgba(253,252,248,0.75) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Subtle vignette for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 55%, rgba(13,31,26,0.18) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex items-center">
        <div className="w-full md:max-w-xl lg:max-w-2xl text-center md:text-left">
          {/* Headline — calm, line-level reveal */}
          <h1 className="font-serif text-forest-900 leading-[1.02] mb-6 md:mb-8">
            <motion.span
              {...fadeUp(0.2)}
              className="block text-5xl md:text-7xl lg:text-8xl font-light tracking-tight"
            >
              Nurtured by
            </motion.span>
            <motion.span
              {...fadeUp(0.35)}
              className="block text-5xl md:text-7xl lg:text-8xl font-light tracking-tight italic text-forest-800"
            >
              Nature.
            </motion.span>
          </h1>

          {/* Tagline — the brand's real claims, plainly said */}
          <motion.p
            {...fadeUp(0.6)}
            className="text-forest-900/75 text-base md:text-lg lg:text-xl leading-relaxed mb-10 md:mb-12 max-w-md mx-auto md:mx-0"
          >
            <span className="text-forest-900 font-medium">100% chemical-free</span> skincare
            and haircare. Handcrafted in India, lab-tested, and made for results you can
            see and feel.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.8)}
            className="flex flex-col sm:flex-row gap-5 sm:gap-9 items-center justify-center md:justify-start"
          >
            <Link
              href="/shop"
              className="inline-flex items-center px-9 md:px-10 py-4 bg-forest-900 text-cream rounded-full text-[0.7rem] md:text-xs uppercase tracking-[0.28em] font-medium transition-all duration-400 hover:bg-forest-800 hover:shadow-[inset_0_0_0_1px_rgba(197,160,89,0.55),0_8px_30px_rgba(26,60,52,0.25)]"
            >
              Shop the Collection
            </Link>

            <Link
              href="/our-story"
              className="text-[0.7rem] md:text-xs uppercase tracking-[0.28em] font-bold text-forest-900 hover:text-forest-800 py-4 underline decoration-gold-500/70 hover:decoration-gold-500 decoration-2 underline-offset-8 transition-colors duration-300"
            >
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>

    </section>

      {/* Pillar band — the brand's pillars, on solid ground right where the hero ends */}
      <div className="bg-beige border-y border-forest-900/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="py-4 md:py-5 flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-1.5">
            {PILLARS.map((pillar) => (
              <span
                key={pillar}
                className="text-[0.6rem] md:text-[0.7rem] uppercase tracking-[0.28em] font-semibold text-forest-900/80"
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
