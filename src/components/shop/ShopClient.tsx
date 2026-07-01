'use client'
import { useState } from 'react'
import { ProductCard } from '@/components/ui/ProductCard'
import { cn } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { products } from '@/lib/data'

const filters = ["All", "Skin Type", "Concern", "Hair", "Kits", "Price"]

export default function ShopClient() {
  const [activeFilter, setActiveFilter] = useState("All")

  return (
    <>
    <Navbar />
    <main id="main-content" className="pt-32 pb-24 min-h-screen bg-cream">
       <div className="max-w-7xl mx-auto px-6">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="mb-12"
           >
               <h1 className="text-5xl md:text-6xl font-serif text-forest-900 mb-4">The Garden Shelf</h1>
               <p className="text-forest-900/60 font-sans max-w-xl">Curated botanicals for every skin story. Choose your ritual.</p>
           </motion.div>

           {/* Filters */}
           <nav aria-label="Product filters" className="flex flex-wrap gap-3 mb-16">
              {filters.map((f, i) => (
                  <motion.button
                    key={f}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setActiveFilter(f)}
                    aria-pressed={activeFilter === f}
                    className={cn(
                        "px-6 py-2 rounded-full border transition-all duration-300 text-xs uppercase tracking-[0.15em] font-medium",
                        activeFilter === f
                           ? "bg-forest-900 text-cream border-forest-900"
                           : "bg-transparent text-forest-900/70 border-forest-900/20 hover:border-forest-900 hover:text-forest-900"
                    )}
                  >
                    {f}
                  </motion.button>
              ))}
           </nav>

           {/* Grid (Garden Shelf) */}
           <section aria-label="Products">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                 {products.map((p, i) => (
                     <motion.div
                       key={p.id}
                       initial={{ opacity: 0, y: 30 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.6, delay: i * 0.1 }}
                     >
                         <ProductCard product={p} />
                     </motion.div>
                 ))}
             </div>
           </section>
       </div>
    </main>
    <Footer />
    </>
  )
}
