'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import Splash from '@/components/animations/Splash'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/home/Hero'
import BestSellers from '@/components/home/BestSellers'
import AboutUs from '@/components/home/AboutUs'
import Footer from '@/components/layout/Footer'

// Below-the-fold sections load as separate chunks.
const BenefitsDeck = dynamic(() => import('@/components/home/BenefitsDeck'))
const Philosophy = dynamic(() => import('@/components/home/Philosophy'))
const GlobalReach = dynamic(() => import('@/components/home/GlobalReach'))
const SkinatureBeautyBrigade = dynamic(
  () => import('@/components/home/SkinatureBeautyBrigade')
)
const CustomerReviews = dynamic(() => import('@/components/home/CustomerReviews'))

export default function HomeClient() {
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
                <BestSellers />
                <AboutUs />
                <BenefitsDeck />
                <Philosophy />
                <GlobalReach />
                <SkinatureBeautyBrigade />
                <CustomerReviews />
            </main>
            <Footer />
        </div>
      )}
    </>
  )
}
