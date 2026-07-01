'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Leaf, FlaskConical, Heart, Shield, Users, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const PILLARS = [
  {
    icon: Leaf,
    title: '100% Chemical Free',
    desc: 'Pure natural ingredients with no harmful chemicals, sulfates, or parabens.',
  },
  {
    icon: FlaskConical,
    title: 'Lab Tested',
    desc: 'Every product is rigorously tested to ensure safety, quality, and effectiveness.',
  },
  {
    icon: Heart,
    title: 'Cruelty Free',
    desc: 'Never tested on animals. Ethically crafted with love and compassion.',
  },
  {
    icon: Shield,
    title: 'Safe for Kids',
    desc: 'Gentle formulations that are safe for the entire family, including children.',
  },
  {
    icon: Users,
    title: 'Gender Neutral',
    desc: 'Designed for everyone. Beauty and care that transcends gender.',
  },
  {
    icon: CheckCircle,
    title: 'Result Oriented',
    desc: 'Proven formulations that deliver visible results you can see and feel.',
  },
]

/* Deterministic hand-placed tilt per card, so the pile reads organic, not generated. */
const TILT = [0, -2.2, 1.8, -1.4, 2.4, -1.8]

const VISIBLE_LAYERS = 3

export default function BenefitsDeck() {
  const wrapRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [target, setTarget] = useState(0)
  const reduce = useReducedMotion()
  const n = PILLARS.length

  // Scroll drives the deck: the section pins while its inner scroll budget
  // is spent flipping cards, then the page continues normally.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(n - 1, Math.max(0, Math.floor(v * n)))
    setTarget(idx)
  })

  // Step toward the scroll target one card at a time, so a fast flick
  // (or Lenis momentum) shuffles through cards sequentially instead of skipping.
  useEffect(() => {
    if (active === target) return
    const delay = Math.abs(target - active) > 1 ? 220 : 0
    const id = setTimeout(
      () => setActive((a) => (a === target ? a : a + Math.sign(target - a))),
      delay
    )
    return () => clearTimeout(id)
  }, [active, target])

  const scrollToIndex = (i: number) => {
    const el = wrapRef.current
    if (!el) return
    const scrollable = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    const target = top + ((i + 0.5) / n) * scrollable
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { duration: 1 })
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={wrapRef}
      aria-labelledby="benefits-heading"
      className="relative bg-cream h-[420vh]"
    >
      <div className="sticky top-0 h-svh flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Left: heading + live pillar index */}
            <div>
              <span className="text-gold-600 uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
                Why Skinature
              </span>
              <h3
                id="benefits-heading"
                className="text-3xl md:text-4xl font-serif text-forest-900 mb-6 md:mb-10 leading-tight"
              >
                Benefits of using Skinature Products
              </h3>

              <div>
                {PILLARS.map((pillar, i) => (
                  <button
                    key={pillar.title}
                    onClick={() => scrollToIndex(i)}
                    aria-current={active === i}
                    className={cn(
                      'group w-full flex items-center gap-4 text-left py-3 md:py-4 border-t border-forest-900/10 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-gold-500',
                      i === n - 1 && 'border-b'
                    )}
                  >
                    <span
                      className={cn(
                        'h-px bg-gold-500 transition-all duration-500 flex-shrink-0',
                        active === i ? 'w-8' : 'w-0 group-hover:w-4'
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        'uppercase tracking-[0.18em] text-[0.7rem] font-semibold transition-colors duration-300',
                        active === i
                          ? 'text-forest-900'
                          : 'text-forest-900/45 group-hover:text-forest-900/75'
                      )}
                    >
                      {pillar.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Screen readers get the full list; the deck below is presentational */}
            <ul className="sr-only">
              {PILLARS.map((pillar) => (
                <li key={pillar.title}>
                  {pillar.title}: {pillar.desc}
                </li>
              ))}
            </ul>

            {/* Right: the deck */}
            <div aria-hidden="true">
              <div className="relative h-[300px] sm:h-[360px] md:h-[400px] max-w-[480px] mx-auto lg:ml-auto">
                {PILLARS.map((pillar, i) => {
                  const pos = (i - active + n) % n
                  const layer = Math.min(pos, VISIBLE_LAYERS)
                  const Icon = pillar.icon
                  return (
                    <motion.div
                      key={pillar.title}
                      initial={false}
                      animate={{
                        x: layer * 22,
                        y: layer * -20,
                        scale: 1 - layer * 0.05,
                        rotate: pos === 0 ? 0 : TILT[i],
                        opacity: layer === VISIBLE_LAYERS ? 0 : 1,
                      }}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : pos === n - 1
                            ? { duration: 0.55, ease: [0.4, 0, 0.2, 1] }
                            : { type: 'spring', stiffness: 240, damping: 28 }
                      }
                      style={{ zIndex: n - pos, transformOrigin: '50% 100%' }}
                      className="absolute inset-0 bg-white rounded-[1.75rem] border border-forest-900/10 shadow-[0_30px_70px_-30px_rgba(26,60,52,0.35)] p-8 md:p-10 flex flex-col overflow-hidden"
                    >
                      {/* Watermark icon, bleeding off the upper-left */}
                      <Icon
                        size={170}
                        strokeWidth={0.7}
                        className="absolute -top-8 -left-8 text-gold-600/[0.3] pointer-events-none"
                        aria-hidden="true"
                      />

                      <div className="relative flex justify-end">
                        <span className="text-[0.65rem] md:text-xs uppercase tracking-[0.3em] text-forest-900/60 font-bold pt-1">
                          The Skinature Standard
                        </span>
                      </div>

                      <div className="relative mt-auto">
                        <h4 className="font-serif text-3xl md:text-4xl text-forest-900 mb-3">
                          {pillar.title}
                        </h4>
                        <p className="text-forest-900/65 leading-relaxed text-sm md:text-base max-w-sm">
                          {pillar.desc}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
