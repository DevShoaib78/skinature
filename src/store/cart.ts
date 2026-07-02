import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { effectivePricePaise, type Product } from '@/lib/data'

/**
 * Cart items snapshot the product at add time (name, price, image), so the
 * cart stays stable even if the catalog changes, and no catalog lookup is
 * needed to render it. The server re-prices authoritatively at checkout.
 */
export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string
  unitPricePaise: number
  qty: number
}

interface CartState {
  items: CartItem[]
  drawerOpen: boolean
  add: (product: Product, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
  setDrawer: (open: boolean) => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,

      add: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id)
          const items = existing
            ? state.items.map((i) =>
                i.productId === product.id ? { ...i, qty: i.qty + qty } : i
              )
            : [
                ...state.items,
                {
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  unitPricePaise: effectivePricePaise(product),
                  qty,
                },
              ]
          return { items, drawerOpen: true }
        }),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      setQty: (productId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, qty } : i
                ),
        })),

      clear: () => set({ items: [] }),

      setDrawer: (open) => set({ drawerOpen: open }),
    }),
    {
      name: 'skinature-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      version: 1,
      // v0 items lacked snapshots (and used catalog ids); start fresh.
      migrate: (persisted, version) => {
        if (version < 1 && persisted && typeof persisted === 'object') {
          ;(persisted as { items?: CartItem[] }).items = []
        }
        return persisted
      },
      // Rehydrated manually after mount (CartHydration) to avoid SSR mismatches.
      skipHydration: true,
    }
  )
)

export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.qty, 0)
}

export function cartSubtotalPaise(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPricePaise * i.qty, 0)
}
