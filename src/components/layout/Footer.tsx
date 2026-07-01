'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-cream pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">

        {/* Brand */}
        <div className="md:col-span-1">
            <div className="mb-6">
                <Image
                    src="/logo without bg.png"
                    alt="Skinature"
                    width={180}
                    height={60}
                    className="h-auto brightness-0 invert opacity-90"
                />
            </div>
            <p className="text-white/60 font-sans text-sm leading-relaxed mb-6">
                Nurtured by Nature.<br/>Perfected for Your Skin.
            </p>
            <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/official.skinature"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="text-white/60 hover:text-gold-500 transition-colors"
                >
                  <Instagram size={20} strokeWidth={2} />
                </a>
                <a
                  href="https://www.youtube.com/@Officialskinature/shorts"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Watch us on YouTube"
                  className="text-white/60 hover:text-gold-500 transition-colors"
                >
                  <Youtube size={20} strokeWidth={2} />
                </a>
            </div>
        </div>

        {/* Links */}
        <nav aria-label="Shop links">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-8">Shop</h4>
            <ul className="space-y-4 text-sm text-white/80 font-sans">
                <li><Link href="/shop" className="hover:text-gold-500 transition-colors">All Products</Link></li>
                <li><Link href="/product/4" className="hover:text-gold-500 transition-colors">Hair Care Kit</Link></li>
                <li><Link href="/product/5" className="hover:text-gold-500 transition-colors">Bridal Kit</Link></li>
            </ul>
        </nav>

        <nav aria-label="Company links">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-8">Company</h4>
            <ul className="space-y-4 text-sm text-white/80 font-sans">
                <li><Link href="/our-story" className="hover:text-gold-500 transition-colors">Our Story</Link></li>
                <li><Link href="/beauty-brigade" className="hover:text-gold-500 transition-colors">Beauty Brigade</Link></li>
                <li><Link href="/#customer-reviews-heading" className="hover:text-gold-500 transition-colors">Customer Reviews</Link></li>
            </ul>
        </nav>

        {/* Newsletter */}
        <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-8">Newsletter</h4>
            <p className="text-white/60 text-sm mb-6">Join our garden. Receive exclusive offers and skincare rituals.</p>
            <form aria-label="Newsletter signup" className="flex border-b border-white/20 pb-2" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                    id="newsletter-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Your email address"
                    className="bg-transparent text-white placeholder-white/40 flex-1 outline-none text-sm"
                />
                <button type="submit" className="text-xs uppercase tracking-widest hover:text-gold-500 transition-colors">Subscribe</button>
            </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 text-center md:text-left text-xs text-white/30 uppercase tracking-wider">
        <p>&copy; {new Date().getFullYear()} Skinature. All rights reserved.</p>
      </div>
    </footer>
  )
}
