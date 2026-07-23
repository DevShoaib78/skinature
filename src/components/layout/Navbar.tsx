'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X, Instagram, Youtube, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart, cartCount } from '@/store/cart'
import CartDrawer from '@/components/cart/CartDrawer'
import SearchOverlay from '@/components/search/SearchOverlay'
import Ticker from '@/components/layout/Ticker'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'About Us', href: '/our-story' },
  { label: 'Beauty Brigade', href: '/beauty-brigade' },
]

const MOBILE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About Us', href: '/our-story' },
  { label: 'Beauty Brigade', href: '/beauty-brigade' },
  { label: 'Cart', href: '/cart' },
]

const SOCIALS = [
  {
    label: 'Follow us on Instagram',
    href: 'https://www.instagram.com/official.skinature',
    Icon: Instagram,
  },
  {
    label: 'Watch us on YouTube',
    href: 'https://www.youtube.com/@Officialskinature/shorts',
    Icon: Youtube,
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const items = useCart((s) => s.items)
  const setDrawer = useCart((s) => s.setDrawer)
  const count = cartCount(items)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    },
    [mobileMenuOpen]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <Ticker />
        <nav
          aria-label="Main navigation"
          className={cn(
            'px-6 md:px-10 lg:px-12 transition-all duration-500 ease-out border-b',
            scrolled
              ? 'bg-cream/92 backdrop-blur-lg border-forest-900/8 py-2.5 md:py-3'
              : 'bg-transparent border-transparent py-4 md:py-5'
          )}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between relative">
            {/* Mobile: menu trigger */}
            <button
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden text-forest-900 hover:text-gold-600 transition-colors duration-300 p-1 -ml-1"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            {/* Desktop: primary links */}
            <div className="hidden md:flex items-center gap-10 w-1/3">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="group relative text-forest-900 hover:text-forest-800 transition-colors duration-300 text-[0.8rem] tracking-[0.2em] uppercase font-medium whitespace-nowrap"
                >
                  {label}
                  <span
                    className="absolute -bottom-1.5 left-0 right-0 h-px bg-gold-500 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300 ease-out"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>

            {/* Logo */}
            <Link
              href="/"
              aria-label="Skinature home"
              className="absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 block flex-shrink-0"
            >
              <span
                className={cn(
                  'relative block transition-all duration-500 ease-out',
                  // logo-trimmed.webp is the mark with its transparent padding cropped
                  // out, so these boxes are the REAL visual size — keep the bar slim.
                  scrolled ? 'w-12 h-12 md:w-14 md:h-14' : 'w-14 h-14 md:w-[4.25rem] md:h-[4.25rem]'
                )}
              >
                <Image
                  src="/logo-trimmed.webp"
                  alt="Skinature, Nurtured by Nature"
                  fill
                  className="object-contain"
                  priority
                />
              </span>
            </Link>

            {/* Right: socials · search · bag */}
            <div className="flex items-center justify-end gap-4 md:gap-6 w-auto md:w-1/3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hidden md:block text-forest-900 hover:text-gold-600 transition-colors duration-300"
                >
                  <Icon size={22} strokeWidth={2} />
                </a>
              ))}

              <span className="hidden md:block h-5 w-px bg-forest-900/15" aria-hidden="true" />

              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                className="text-forest-900 hover:text-gold-600 transition-colors duration-300 p-1"
              >
                <Search size={22} strokeWidth={2} />
              </button>

              <button
                onClick={() => setDrawer(true)}
                aria-label={count > 0 ? `Cart, ${count} items` : 'Cart'}
                className="relative text-forest-900 hover:text-gold-600 transition-colors duration-300 p-1 -mr-1"
              >
                <ShoppingBag size={22} strokeWidth={2} />
                {count > 0 && (
                  <span
                    className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums"
                    aria-hidden="true"
                  >
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] bg-cream flex flex-col"
          >
            {/* Top bar: logo + close */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="relative block w-12 h-12">
                <Image
                  src="/logo-trimmed.webp"
                  alt="Skinature"
                  fill
                  className="object-contain object-left"
                />
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="text-forest-900 hover:text-gold-600 transition-colors p-2 -mr-2"
              >
                <X size={26} strokeWidth={1.5} />
              </button>
            </div>

            {/* Links */}
            <nav
              aria-label="Mobile navigation"
              className="flex-1 flex flex-col items-center justify-center gap-7 px-6"
            >
              {MOBILE_LINKS.map(({ label, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 + i * 0.06, ease: 'easeOut' }}
                >
                  <Link
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-3xl text-forest-900 hover:text-gold-600 transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Foot: socials + mantra */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-col items-center gap-6 pb-10"
            >
              <span className="h-px w-10 bg-gold-500/60" aria-hidden="true" />
              <div className="flex items-center gap-7">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-forest-900/70 hover:text-gold-600 transition-colors duration-300"
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
              <p className="text-forest-900/40 text-[0.65rem] tracking-[0.35em] uppercase">
                Nurtured by Nature
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
