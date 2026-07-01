'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

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

  return (
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

        {/* Readability overlay — soft cream fog on the left, fading to clear on the right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(253,252,248,0.78) 0%, rgba(253,252,248,0.5) 28%, rgba(253,252,248,0.18) 55%, rgba(253,252,248,0) 80%)',
          }}
          aria-hidden="true"
        />

        {/* Mobile readability — top-to-bottom subtle fade for legibility */}
        <div
          className="md:hidden absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(253,252,248,0.62) 0%, rgba(253,252,248,0.25) 50%, rgba(253,252,248,0.55) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Subtle vignette for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(13,31,26,0.22) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex items-center">
        <div className="w-full md:max-w-xl lg:max-w-2xl text-center md:text-left">
          {/* Cursive brand mark */}
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            className="font-cursive text-4xl md:text-5xl lg:text-6xl text-gold-600 block mb-2 md:mb-3"
          >
            skinature
          </motion.span>

          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="block text-[0.7rem] md:text-xs uppercase tracking-[0.4em] text-forest-800/80 mb-6 md:mb-8"
          >
            ✦ Proudly Desi ✦
          </motion.span>

          {/* Headline — word-by-word reveal */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.18, delayChildren: 0.9 },
              },
            }}
            className="font-serif text-forest-900 leading-[0.95] mb-6 md:mb-8"
          >
            <span className="block text-5xl md:text-7xl lg:text-8xl font-light tracking-tight">
              {['Nurtured', 'by'].map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
                  }}
                  transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                  className="inline-block mr-3 md:mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-light tracking-tight italic text-forest-800">
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
                }}
                transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
                className="inline-block"
              >
                Nature.
              </motion.span>
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.7, ease: 'easeOut' }}
            className="text-forest-900/75 text-base md:text-lg lg:text-xl leading-relaxed mb-10 md:mb-12 max-w-md mx-auto md:mx-0"
          >
            Honest, effective, and{' '}
            <span className="text-forest-900 font-medium">rooted in nature</span>.
            Pure botanical care, crafted for results you can see — and feel.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 items-center md:items-start sm:justify-start justify-center"
          >
            <Link
              href="#shop"
              className="group relative inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-forest-900 text-cream rounded-full text-xs md:text-sm uppercase tracking-[0.25em] font-medium overflow-hidden transition-all duration-500 hover:bg-forest-800 hover:shadow-[0_8px_30px_rgba(26,60,52,0.35)] hover:scale-[1.02]"
            >
              <span className="relative z-10">Discover the Collection</span>
              <span
                aria-hidden="true"
                className="relative z-10 transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <Link
              href="#our-story"
              className="text-xs md:text-sm uppercase tracking-[0.25em] text-forest-900/80 hover:text-forest-900 transition-colors py-4 underline-offset-8 hover:underline decoration-gold-500/60"
            >
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.4em] text-forest-900/60">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-10 bg-forest-900/40"
        />
      </motion.div>
    </section>
  )
}
