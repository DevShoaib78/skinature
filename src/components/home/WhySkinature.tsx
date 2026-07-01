'use client'
import { Leaf, Droplet, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  { 
    icon: Leaf, 
    title: "Purely Botanical", 
    desc: "Every drop is pressed from petals, roots, and seeds. No fillers, just nature's essence." 
  },
  { 
    icon: Droplet, 
    title: "Deeply Hydrating", 
    desc: "Formulations that mirror your skin's natural lipid barrier for absorption, not just coverage." 
  },
  { 
    icon: Heart, 
    title: "Consciously Created", 
    desc: "Ethically sourced ingredients that respect the earth and the hands that harvest them." 
  },
]

export default function WhySkinature() {
  return (
    <section aria-labelledby="why-skinature-heading" className="py-24 md:py-32 bg-cream px-6">
      <div className="max-w-7xl mx-auto">
        <h2 id="why-skinature-heading" className="sr-only">Why Skinature</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="bg-white p-10 rounded-[2rem] shadow-[0_5px_30px_-10px_rgba(26,60,52,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(26,60,52,0.1)] transition-shadow duration-500 text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-forest-50 rounded-full flex items-center justify-center text-forest-900 group-hover:bg-forest-900 group-hover:text-gold-500 transition-colors duration-500">
                <f.icon size={28} strokeWidth={1.2} />
              </div>
              <h3 className="font-serif text-2xl text-forest-900 mb-4">{f.title}</h3>
              <p className="text-forest-900/60 leading-relaxed font-sans">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
