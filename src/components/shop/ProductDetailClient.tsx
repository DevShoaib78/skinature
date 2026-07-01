'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Heart, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProductById } from '@/lib/data'

const tabs = ['Benefits', 'Ingredients', 'Ritual'] as const

export default function ProductDetailClient({ id }: { id: string }) {
   const [activeTab, setActiveTab] = useState<string>('Benefits')

   const product = getProductById(id)

   if (!product) {
     return (
       <>
         <Navbar />
         <main id="main-content" className="pt-32 pb-24 bg-cream min-h-screen flex items-center justify-center">
           <div className="text-center">
             <h1 className="text-4xl font-serif text-forest-900 mb-4">Product Not Found</h1>
             <p className="text-forest-900/60">The product you are looking for does not exist.</p>
           </div>
         </main>
         <Footer />
       </>
     )
   }

   const tabContent: Record<string, string> = {
     Benefits: product.benefits,
     Ingredients: product.ingredients,
     Ritual: product.ritual,
   }

   const fullStars = Math.floor(product.rating)

   return (
      <>
      <Navbar />
      <main id="main-content" className="pt-32 pb-24 bg-cream min-h-screen">
          <article className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              {/* Left: Images */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                  <div className="aspect-[4/5] bg-forest-50 rounded-[2rem] relative overflow-hidden shadow-lg">
                      <Image
                        src={product.image}
                        alt={`${product.name} — ${product.benefit}`}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                  </div>
              </motion.div>

              {/* Right: Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col justify-center"
              >
                  <div className="mb-4 flex items-center gap-1 text-gold-500" aria-label={`Rated ${product.rating} out of 5 stars based on ${product.reviewCount} reviews`}>
                      {Array.from({ length: fullStars }, (_, i) => (
                        <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                      ))}
                      <span className="text-forest-900/40 text-xs ml-2 tracking-widest uppercase">({product.reviewCount} Reviews)</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest-900 mb-2 leading-tight">{product.name}</h1>
                  <p className="text-gold-600 uppercase tracking-[0.2em] text-xs font-bold mb-8">{product.benefit}</p>

                  <div className="mb-8">
                     <span className="text-3xl font-sans font-medium text-forest-900">{product.price}</span>
                  </div>

                  <p className="text-forest-900/70 leading-relaxed mb-10 font-sans text-lg">
                     {product.description}
                  </p>

                  <div className="flex gap-4 mb-16">
                      <Button className="flex-1 py-4 text-sm md:text-base">Add to Cart</Button>
                      <button aria-label="Add to wishlist" className="p-4 border border-forest-900/20 rounded-full hover:bg-forest-50 hover:text-red-500 transition-colors">
                        <Heart size={20} />
                      </button>
                  </div>

                  {/* Tabs */}
                  <div className="border-t border-forest-900/10 pt-8">
                      <div role="tablist" aria-label="Product details" className="flex gap-8 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                          {tabs.map(tab => (
                              <button
                                key={tab}
                                role="tab"
                                aria-selected={activeTab === tab}
                                aria-controls={`tabpanel-${tab}`}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "uppercase text-xs tracking-[0.2em] pb-2 border-b-2 transition-all duration-300 whitespace-nowrap",
                                    activeTab === tab ? "border-gold-500 text-forest-900" : "border-transparent text-forest-900/40 hover:text-forest-900"
                                )}
                              >
                                {tab}
                              </button>
                          ))}
                      </div>
                      <div
                        role="tabpanel"
                        id={`tabpanel-${activeTab}`}
                        aria-label={activeTab}
                        className="min-h-[150px] text-forest-900/70 text-base leading-relaxed"
                      >
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            {tabContent[activeTab]}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                  </div>
              </motion.div>
          </article>
      </main>

      {/* Mobile Sticky Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-forest-900/10 p-4 lg:hidden z-40 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <div>
              <p className="text-xs text-forest-900/60 uppercase tracking-widest">{product.name}</p>
              <p className="text-forest-900 font-bold">{product.price}</p>
          </div>
          <Button className="px-8 py-3 text-xs">Add to Cart</Button>
      </div>

      <Footer />
      </>
   )
}
