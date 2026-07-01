import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getProductById, effectivePricePaise } from '@/lib/data'

export interface CartItem {
  productId: string
  qty: number
}

interface CartState {
  items: CartItem[]
  drawerOpen: boolean
  add: (productId: string, qty?: number) => void
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

      add: (productId, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId)
          const items = existing
            ? state.items.map((i) =>
                i.productId === productId ? { ...i, qty: i.qty + qty } : i
              )
            : [...state.items, { productId, qty }]
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
      // Rehydrated manually after mount (CartHydration) to avoid SSR mismatches.
      skipHydration: true,
    }
  )
)

export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.qty, 0)
}

export function cartSubtotalPaise(items: CartItem[]): number {
  return items.reduce((sum, i) => {
    const product = getProductById(i.productId)
    return product ? sum + effectivePricePaise(product) * i.qty : sum
  }, 0)
}
