import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ProductProps {
    id: string
    name: string
    price: string
    originalPrice?: string
    category: string
    image: string
    benefit: string
    badge?: string
}

export function ProductCard({ product, className }: { product: ProductProps, className?: string }) {
  return (
    <Link href={`/product/${product.id}`} className={cn("group block relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(26,60,52,0.1)] transition-all duration-700 ease-out border border-transparent hover:border-gold-100/50", className)}>
        <div className="aspect-[4/5] relative overflow-hidden bg-forest-50">
            {product.badge && (
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-forest-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-10 shadow-sm">
                    {product.badge}
                </span>
            )}
            <Image
                src={product.image}
                alt={`${product.name} — ${product.benefit}`}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Soft overlay */}
            <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/5 transition-colors duration-700" aria-hidden="true" />

            {/* Quick add button */}
            <div className="absolute bottom-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <button
                  aria-label={`Quick add ${product.name} to cart`}
                  className="bg-white text-forest-900 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-forest-900 hover:text-white transition-colors"
                  onClick={(e) => { e.preventDefault(); }}
                >
                    +
                </button>
            </div>
        </div>

        <div className="p-6 text-center transition-transform duration-500 group-hover:-translate-y-1 bg-white relative z-20">
            <p className="text-[10px] text-forest-900/40 uppercase tracking-[0.15em] mb-2 font-medium">{product.category}</p>
            <h3 className="font-serif text-xl text-forest-900 mb-1 group-hover:text-gold-600 transition-colors">{product.name}</h3>
            <p className="text-[11px] text-forest-900/50 uppercase tracking-[0.1em] mb-3">{product.benefit}</p>
            <div className="flex items-center justify-center gap-2">
              {product.originalPrice && (
                <p className="font-sans text-sm text-forest-900/40 line-through">{product.originalPrice}</p>
              )}
              <p className="font-sans text-base font-semibold text-green-700">{product.price}</p>
            </div>
        </div>
    </Link>
  )
}
