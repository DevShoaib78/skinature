'use client'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Splash from '@/components/animations/Splash'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/home/Hero'
import AboutUs from '@/components/home/AboutUs'
import Philosophy from '@/components/home/Philosophy'
import GlobalReach from '@/components/home/GlobalReach'
import SkinatureBeautyBrigade from '@/components/home/SkinatureBeautyBrigade'
import BestSellers from '@/components/home/BestSellers'
import CustomerReviews from '@/components/home/CustomerReviews'
import Footer from '@/components/layout/Footer'

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
