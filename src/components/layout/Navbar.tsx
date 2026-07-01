'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingBag, Menu, X, Instagram, Youtube } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
    <header>
      <nav
        aria-label="Main navigation"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out px-6 md:px-12",
          scrolled ? "bg-cream/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">

          {/* Mobile Menu Icon */}
          <button
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden text-forest-900 hover:text-gold-500 transition-colors z-10"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Desktop Left Links */}
          <div className="hidden md:flex items-center gap-8 w-1/3">
            <Link href="/shop" className="text-forest-900 hover:text-gold-500 transition-colors text-xs tracking-[0.2em] uppercase font-medium group relative">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-500 transition-all duration-300 group-hover:w-full" aria-hidden="true"></span>
            </Link>
            <a href="#skinature-beauty-brigade" className="text-forest-900 hover:text-gold-500 transition-colors text-xs tracking-[0.2em] uppercase font-medium group relative">
              Skinature Beauty Brigade
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-500 transition-all duration-300 group-hover:w-full" aria-hidden="true"></span>
            </a>
          </div>

          {/* Center Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 w-40 h-12 md:w-56 md:h-16 block flex-shrink-0 transition-transform hover:scale-105 duration-700">
            <Image
              src="/logo.png"
              alt="Skinature — Nurtured By Nature, go to homepage"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Right Icons */}
          <div className="flex items-center justify-end gap-6 w-1/3">
            <a
              href="https://www.instagram.com/official.skinature"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="text-forest-900 hover:text-gold-500 transition-colors hidden md:block"
            >
              <Instagram size={20} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.youtube.com/@Officialskinature/shorts"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch us on YouTube"
              className="text-forest-900 hover:text-gold-500 transition-colors hidden md:block"
            >
              <Youtube size={20} strokeWidth={1.5} />
            </a>
            <button aria-label="Search products" className="text-forest-900 hover:text-gold-500 transition-colors hidden md:block">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link href="/cart" aria-label="Shopping cart" className="text-forest-900 hover:text-gold-500 transition-colors relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gold-500 rounded-full animate-pulse" aria-hidden="true"></span>
            </Link>
          </div>
        </div>
      </nav>
    </header>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-cream flex flex-col items-center justify-center text-center"
        >
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="absolute top-6 right-6 text-forest-900 hover:text-gold-500 p-2 z-10"
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          <nav aria-label="Mobile navigation" className="flex flex-col gap-8 z-10">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-serif text-3xl text-forest-900 hover:text-gold-500 transition-colors">Home</Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="font-serif text-3xl text-forest-900 hover:text-gold-500 transition-colors">Shop</Link>
            <a href="#skinature-beauty-brigade" onClick={() => setMobileMenuOpen(false)} className="font-serif text-3xl text-forest-900 hover:text-gold-500 transition-colors">Skinature Beauty Brigade</a>
            <Link href="/journal" onClick={() => setMobileMenuOpen(false)} className="font-serif text-3xl text-forest-900 hover:text-gold-500 transition-colors">Journal</Link>
            <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="font-serif text-3xl text-forest-900 hover:text-gold-500 transition-colors">Cart</Link>
          </nav>

          <p className="absolute bottom-12 text-forest-900/40 text-xs tracking-widest uppercase z-10">
            Nurtured by Nature
          </p>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
