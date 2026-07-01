'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Gem, Sprout, HeartHandshake } from 'lucide-react'

const PERKS = [
  {
    icon: Gem,
    title: 'Exclusive Access',
    desc: 'Be the first to discover new products, limited editions, and seasonal collections',
  },
  {
    icon: Sprout,
    title: 'Expert Tips',
    desc: 'Learn skincare rituals and natural beauty secrets from our experts',
  },
  {
    icon: HeartHandshake,
    title: 'Community Love',
    desc: 'Connect with like-minded individuals who share your passion for natural beauty',
  },
]

export default function SkinatureBeautyBrigade() {
  return (
    <section
      id="skinature-beauty-brigade"
      className="relative min-h-screen bg-gradient-to-b from-cream via-beige-100/30 to-cream py-24 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-cursive text-5xl md:text-7xl text-gold-600 mb-6">
            Skinature Beauty Brigade
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8" aria-hidden="true"></div>
          <p className="font-serif font-semibold text-xl md:text-2xl text-forest-900 max-w-3xl mx-auto leading-relaxed">
            Join our community of beauty enthusiasts who embrace natural, sustainable skincare rituals
          </p>
        </div>

        {/* Founder's Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 max-w-5xl mx-auto"
        >
          <h3 className="font-cursive text-5xl md:text-6xl text-forest-900 mb-8 text-center">
            Founder&apos;s Note
          </h3>

          <div className="text-left space-y-6">
            <h4 className="text-2xl md:text-3xl font-serif text-forest-900">
              A warm welcome to our beauty brigade,
            </h4>

            <p className="text-forest-900/70 leading-relaxed text-lg">
              We&apos;re so grateful you&apos;re here and we think its safe to call you a member of beauty brigade considering you have stumbled upon our page in search of a beauty brand that is safe and result oriented to enhance your already so unique beauty.
            </p>

            <p className="text-forest-900 font-bold leading-relaxed text-lg">
              Skinature began as a simple idea between two people, a husband and wife, who shared a love for natural living and mindful self-care.
            </p>

            <p className="leading-relaxed text-lg">
              <span className="text-forest-900/70">Skinature is not just a brand. It&apos;s a </span>
              <span className="text-forest-900 font-bold">movement towards clean, conscious, and feel-good beauty</span>
            </p>

            <p className="text-forest-900/70 leading-relaxed text-lg">
              More than anything, our duo would always be bothered with the fact that natural beauty brands are so pricey and not affordable to the masses. So we decided we wanted to create something that is Premium, Affordable, People Friendly and Planet Friendly We believe that everyone deserves:
            </p>

            <ul className="space-y-3 text-forest-900/70 text-lg ml-8">
              <li className="flex items-start">
                <span className="text-forest-900 mr-3">•</span>
                <span>Products that work without compromise</span>
              </li>
              <li className="flex items-start">
                <span className="text-forest-900 mr-3">•</span>
                <span>Pure ingredients, no nasties</span>
              </li>
              <li className="flex items-start">
                <span className="text-forest-900 mr-3">•</span>
                <span>A brand that&apos;s rooted in tradition and backed by trust</span>
              </li>
              <li className="flex items-start">
                <span className="text-forest-900 mr-3">•</span>
                <span>A skincare + haircare routine that&apos;s simple, soulful, and powerful</span>
              </li>
            </ul>

            <p className="text-forest-900/70 leading-relaxed text-lg">
              As life partners, building Skinature has been a passion project wrapped in love, trust, and intention. Every product we create is handcrafted with care, backed by time tested results, and made with ingredients your skin and scalp will thank you for.
            </p>

            <p className="text-forest-900/70 leading-relaxed text-lg italic">
              We&apos;re not here to sell quick fixes. We&apos;re here to offer time-tested care that becomes a joyful part of your daily routine, just like it has for us.
            </p>

            <p className="text-forest-900/70 leading-relaxed text-lg">
              So whether you&apos;re struggling with dull skin, hair fall, or simply looking to go natural, we welcome you with open arms into the Skinature Beauty Brigade. Let&apos;s grow together, glow together, and celebrate the skin and hair you&apos;re in.
            </p>

            <div className="mt-8 space-y-1">
              <p className="text-forest-900 font-bold text-lg">
                With gratitude and warmth,
              </p>
              <p className="text-forest-900 font-bold text-lg">
                Hina Mushfiq & Syed Adnan Touseef
              </p>
              <p className="text-forest-900 font-bold text-lg">
                Co-Founders, Skinature
              </p>
            </div>
          </div>
        </motion.div>

        <div className="text-center">

        {/* Member perks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PERKS.map((perk) => (
            <div
              key={perk.title}
              className="group relative overflow-hidden bg-white rounded-[1.75rem] border border-forest-900/10 p-8 md:p-10 text-left shadow-[0_20px_50px_-30px_rgba(26,60,52,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-[0_30px_60px_-25px_rgba(26,60,52,0.35)]"
            >
              <perk.icon
                size={120}
                strokeWidth={0.7}
                className="absolute -top-6 -left-6 text-gold-600/25 transition-colors duration-500 group-hover:text-gold-600/40 pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative pt-14">
                <h3 className="font-serif text-2xl text-forest-900 mb-3">{perk.title}</h3>
                <p className="text-forest-900/65 leading-relaxed text-sm md:text-base">
                  {perk.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16">
          <Link
            href="/beauty-brigade"
            className="inline-block bg-forest-900 text-cream px-12 py-4 rounded-full text-sm tracking-[0.2em] uppercase font-medium transition-all duration-400 hover:bg-forest-800 hover:shadow-[inset_0_0_0_1px_rgba(197,160,89,0.55),0_8px_30px_rgba(26,60,52,0.25)]"
          >
            Join The Brigade
          </Link>
        </div>
        </div>
      </div>
    </section>
  )
}
