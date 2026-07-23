'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react'

/**
 * Video showcase (reference: dyou.co's autoplaying vertical video strip).
 * The three how-to films play muted on scroll-into-view; tap to unmute.
 */

const VIDEOS = [
  {
    src: '/New Product Mockups Latest/Root Revival Hair Mask and Cocktail Video.mp4',
    title: 'The Hair Mask Ritual',
    href: '/product/root-revival-hair-mask-cocktail',
  },
  {
    src: '/New Product Mockups Latest/Brightening and Cleansing Mask Video.mp4',
    title: 'The Glow Ritual',
    href: '/product/brightening-cleansing-mask',
  },
  {
    src: '/New Product Mockups Latest/Root Revival Hair Oil Video.mp4',
    title: 'The Root Revival Oil',
    href: '/product/root-revival-hair-oil',
  },
]

function VideoCard({ src, title, href, index }: (typeof VIDEOS)[number] & { index: number }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.35 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.12 }}
      className="group relative aspect-[9/16] rounded-[1.75rem] overflow-hidden bg-forest-950 shadow-[0_24px_50px_-20px_rgba(42,62,44,0.4)]"
    >
      <video
        ref={ref}
        src={src}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        aria-label={title}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-forest-950/85 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? `Unmute ${title}` : `Mute ${title}`}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/85 backdrop-blur text-forest-900 flex items-center justify-center hover:bg-cream transition-colors"
      >
        {muted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
      </button>
      <Link
        href={href}
        className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3"
      >
        <span className="font-serif text-cream text-xl leading-snug">{title}</span>
        <span className="w-9 h-9 rounded-full bg-cream/90 text-forest-900 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-300 transition-colors">
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </Link>
    </motion.div>
  )
}

export default function VideoShowcase() {
  return (
    <section aria-labelledby="video-heading" className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-gold-600 uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
            Watch the Rituals
          </span>
          <h2 id="video-heading" className="text-4xl md:text-5xl font-serif text-forest-900">
            See it <span className="italic text-forest-800">in action.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {VIDEOS.map((v, i) => (
            <VideoCard key={v.src} {...v} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
