'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'

export default function Philosophy() {
  return (
    <section id="our-story" className="py-24 bg-forest-50 overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden"
        >
             <Image
                src="/new mockups/Bridal Kit Box.webp"
                alt="Skinature Bridal Beauty Kit — natural hair and skin essentials"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
             />
        </motion.div>

        {/* Text Side */}
        <motion.div 
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.2 }}
           className="lg:pl-10"
        >
          <span className="text-gold-600 uppercase tracking-[0.2em] text-xs font-bold mb-4 block">Our Philosophy</span>
          <h2 className="text-4xl md:text-5xl font-serif text-forest-900 mb-8 leading-tight">
            Born from <br/>
            <span className="italic font-cursive text-5xl md:text-6xl text-gold-600">Belief</span>
          </h2>
          <p className="text-forest-900/70 mb-6 leading-relaxed text-lg">
            Skinature was born out of belief — that skincare and haircare shouldn&apos;t be confusing, harsh, or filled with chemicals. Belief that nature still holds the answers.
          </p>
          <p className="text-forest-900/70 mb-10 leading-relaxed text-lg">
            Every product is thoughtfully crafted with natural ingredients — gentle on your skin, kind to your hair, and powerful in results. Pure, purposeful, and proudly desi.
          </p>
          
          <Button variant="outline" className="border-forest-900 text-forest-900 hover:bg-forest-900 hover:text-cream">
            Read Our Story
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
