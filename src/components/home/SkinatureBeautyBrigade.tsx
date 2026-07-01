'use client'
import { motion } from 'framer-motion'

export default function SkinatureBeautyBrigade() {
  return (
    <section
      id="skinature-beauty-brigade"
      className="relative min-h-screen bg-gradient-to-b from-cream via-beige-100/30 to-cream py-24 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-script text-5xl md:text-7xl text-gold-600 mb-6">
            Skinature Beauty Brigade
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8" aria-hidden="true"></div>
          <p className="font-serif text-xl md:text-2xl text-forest-900/80 max-w-3xl mx-auto leading-relaxed">
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
          <h3 className="font-cursive text-5xl md:text-6xl text-forest-900 mb-8">
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
              Skinature began as a simple idea between two people—a husband and wife—who shared a love for natural living and mindful self-care.
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
              We&apos;re not here to sell quick fixes. We&apos;re here to offer time-tested care that becomes a joyful part of your daily routine—just like it has for us.
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

        {/* Placeholder Content - To be expanded */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Card 1 */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-100 flex items-center justify-center">
              <span className="text-3xl" aria-hidden="true">✨</span>
            </div>
            <h3 className="font-serif text-2xl text-forest-900 mb-4">Exclusive Access</h3>
            <p className="text-forest-900/70 leading-relaxed">
              Be the first to discover new products, limited editions, and seasonal collections
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-100 flex items-center justify-center">
              <span className="text-3xl" aria-hidden="true">🌿</span>
            </div>
            <h3 className="font-serif text-2xl text-forest-900 mb-4">Expert Tips</h3>
            <p className="text-forest-900/70 leading-relaxed">
              Learn skincare rituals and natural beauty secrets from our experts
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-100 flex items-center justify-center">
              <span className="text-3xl" aria-hidden="true">💚</span>
            </div>
            <h3 className="font-serif text-2xl text-forest-900 mb-4">Community Love</h3>
            <p className="text-forest-900/70 leading-relaxed">
              Connect with like-minded individuals who share your passion for natural beauty
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16">
          <button className="bg-forest-900 text-cream px-12 py-4 rounded-full text-sm tracking-[0.2em] uppercase font-medium hover:bg-gold-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
            Join The Brigade
          </button>
        </div>
        </div>
      </div>
    </section>
  )
}
