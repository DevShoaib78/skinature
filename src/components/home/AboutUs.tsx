'use client'
import { Leaf, FlaskConical, Heart, Shield, Users, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const features = [
  {
    icon: Leaf,
    title: "100% Chemical Free",
    desc: "Pure natural ingredients with no harmful chemicals, sulfates, or parabens."
  },
  {
    icon: FlaskConical,
    title: "Lab Tested",
    desc: "Every product is rigorously tested to ensure safety, quality, and effectiveness."
  },
  {
    icon: Heart,
    title: "Cruelty Free",
    desc: "Never tested on animals. Ethically crafted with love and compassion."
  },
  {
    icon: Shield,
    title: "Safe for Kids",
    desc: "Gentle formulations that are safe for the entire family, including children."
  },
  {
    icon: Users,
    title: "Gender Neutral",
    desc: "Designed for everyone. Beauty and care that transcends gender."
  },
  {
    icon: CheckCircle,
    title: "Result Oriented",
    desc: "Proven formulations that deliver visible results you can see and feel."
  },
]

export default function AboutUs() {
  return (
    <section aria-labelledby="about-us-heading" className="py-24 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Main About Us Content with Image and Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">

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
              Welcome to Skinature – Nurtured by Nature
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

        {/* Benefits Section - 6 Cards */}
        <div>
          <h3 className="text-3xl md:text-4xl font-serif text-forest-900 text-center mb-12">
            Benefits of using Skinature Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.15 }}
                className="bg-white p-8 rounded-[2rem] shadow-[0_5px_30px_-10px_rgba(26,60,52,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(26,60,52,0.1)] transition-shadow duration-500 text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-forest-50 rounded-full flex items-center justify-center text-forest-900 group-hover:bg-forest-900 group-hover:text-gold-500 transition-colors duration-500">
                  <f.icon size={28} strokeWidth={1.2} />
                </div>
                <h4 className="font-serif text-xl text-forest-900 mb-3">{f.title}</h4>
                <p className="text-forest-900/60 leading-relaxed font-sans text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
