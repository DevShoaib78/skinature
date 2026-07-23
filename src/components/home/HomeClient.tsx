'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import Splash from '@/components/animations/Splash'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/home/Hero'
import BestSellers from '@/components/home/BestSellers'
import Footer from '@/components/layout/Footer'
import type { Product } from '@/lib/data'

// Landing flow per the client brief (2026-07-23):
// ticker → navbar → hero slides → products → reviews → video showcase →
// benefits → globally glowing & growing → footer.
// (About Us and Beauty Brigade moved to their own pages.)
const ReviewDeck = dynamic(() => import('@/components/home/ReviewDeck'))
const VideoShowcase = dynamic(() => import('@/components/home/VideoShowcase'))
const BenefitsDeck = dynamic(() => import('@/components/home/BenefitsDeck'))
const GlobalReach = dynamic(() => import('@/components/home/GlobalReach'))

export default function HomeClient({ products }: { products: Product[] }) {
  const [loading, setLoading] = useState(true)

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Splash onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <div className="animate-fade-in-slow">
            <Navbar />
            <main id="main-content">
                <Hero />
                <BestSellers products={products} />
                <ReviewDeck />
                <VideoShowcase />
                <BenefitsDeck />
                <GlobalReach />
            </main>
            <Footer />
        </div>
      )}
    </>
  )
}
