'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function AboutUs() {
  return (
    <section aria-labelledby="about-us-heading" className="py-24 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Main About Us Content with Image and Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden"
          >
            <Image
              src="/aboutuspic.webp"
              alt="Skinature natural botanical ingredients"
              fill
              className="object-cover"
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
            <h2 id="about-us-heading" className="font-cursive text-6xl md:text-7xl text-forest-900 mb-8">
              About Us
            </h2>

            <h3 className="text-3xl md:text-4xl font-serif text-forest-900 mb-6 leading-tight">
              Welcome to Skinature, Nurtured by Nature
            </h3>

            <p className="text-forest-900/70 mb-6 leading-relaxed text-lg">
              At Skinature, we believe beauty begins with <span className="text-forest-900 font-semibold">care that&apos;s honest, effective, and rooted in nature.</span> Every product we create is thoughtfully crafted with <span className="text-forest-900 font-semibold">natural ingredients</span> that are gentle on your skin, kind to your hair, and powerful in results.
            </p>

            <p className="text-forest-900/70 mb-10 leading-relaxed text-lg">
              Join the <span className="text-forest-900 font-semibold">Skinature Beauty Brigade</span> and experience self-care that&apos;s <span className="text-forest-900 font-semibold">pure, purposeful, and proudly desi.</span>
            </p>

            <Link href="#skinature-beauty-brigade">
              <Button className="px-8 py-4 text-base bg-forest-900 text-cream border-forest-900 hover:bg-forest-800">
                Skinature Beauty Brigade
              </Button>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
