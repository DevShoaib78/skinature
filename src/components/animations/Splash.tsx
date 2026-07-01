'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect } from 'react'

export default function Splash({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
        onComplete()
    }, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cream"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          filter: "blur(0px)",
          transition: { 
            duration: 1.5, 
            ease: "easeOut" 
          }
        }}
        className="relative flex flex-col items-center justify-center"
      >
         <motion.div 
            className="relative w-48 h-48 md:w-64 md:h-64"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
         >
            <Image src="/logo-nobg.webp" alt="Skinature" fill className="object-contain" priority />
         </motion.div>
         
         <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-4 text-forest-900/60 text-xs tracking-[0.3em] font-sans uppercase"
         >
            Loading Serenity
         </motion.div>
      </motion.div>
    </motion.div>
  )
}
