'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FaqItem } from '@/lib/faq'

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-forest-900/10 border-y border-forest-900/10">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              className="w-full flex items-center justify-between gap-6 py-5 text-left group"
            >
              <span
                className={cn(
                  'font-serif text-lg md:text-xl transition-colors',
                  isOpen ? 'text-forest-900' : 'text-forest-900/80 group-hover:text-forest-900'
                )}
              >
                {item.question}
              </span>
              <Plus
                size={18}
                strokeWidth={2}
                className={cn(
                  'flex-shrink-0 text-gold-600 transition-transform duration-300',
                  isOpen && 'rotate-45'
                )}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-forest-900/65 leading-relaxed text-[0.95rem] max-w-2xl">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
