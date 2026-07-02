import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { products as catalog, type Product } from '@/lib/data'
import type { OrderStatus } from '@/lib/mock/orders'
import type { ReviewStatus } from '@/lib/mock/reviews'
import {
  SHIPPING_TELANGANA_PAISE,
  SHIPPING_REST_OF_INDIA_PAISE,
} from '@/lib/shipping'

/**
 * Mock admin state. Mirrors what Supabase + Auth will provide:
 * an authenticated session, editable products, order status updates,
 * review moderation, and store settings. Persisted locally so the
 * demo behaves like a real backend between visits.
 */

// Demo credentials, shown on the login screen. Replaced by Supabase Auth at launch.
export const DEMO_ADMIN_EMAIL = 'admin@skinature.org'
export const DEMO_ADMIN_PASSWORD = 'skinature@2026'

export interface AdminSettings {
  shippingTelanganaPaise: number
  shippingRestPaise: number
  businessName: string
  businessAddress: string
  gstin: string
  notifyEmail: string
}

interface AdminState {
  hydrated: boolean
  loggedIn: boolean
  adminEmail: string | null
  products: Product[]
  orderStatus: Record<string, OrderStatus>
  reviewStatus: Record<string, ReviewStatus>
  settings: AdminSettings

  login: (email: string, password: string) => boolean
  logout: () => void
  updateProduct: (id: string, patch: Partial<Product>) => void
  addProduct: (product: Product) => void
  adjustStock: (id: string, delta: number) => void
  setOrderStatus: (orderId: string, status: OrderStatus) => void
  setReviewStatus: (reviewId: string, status: ReviewStatus) => void
  updateSettings: (patch: Partial<AdminSettings>) => void
}

// Real business details provided by the client (2026-07-02). Appear on invoices.
const DEFAULT_SETTINGS: AdminSettings = {
  shippingTelanganaPaise: SHIPPING_TELANGANA_PAISE,
  shippingRestPaise: SHIPPING_REST_OF_INDIA_PAISE,
  businessName: 'Nurtured by Nature Products',
  businessAddress:
    'Plot No. 509-J-III, Road No. 86, Near Lotus Pond, Jubilee Hills, Hyderabad - 500096, Telangana, India',
  gstin: '36AAZFN8373Q1ZU',
  notifyEmail: DEMO_ADMIN_EMAIL,
}

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      hydrated: false,
      loggedIn: false,
      adminEmail: null,
      products: catalog.map((p) => ({ ...p })),
      orderStatus: {},
      reviewStatus: {},
      settings: DEFAULT_SETTINGS,

      login: (email, password) => {
        const ok =
          email.trim().toLowerCase() === DEMO_ADMIN_EMAIL &&
          password === DEMO_ADMIN_PASSWORD
        if (ok) set({ loggedIn: true, adminEmail: email.trim().toLowerCase() })
        return ok
      },

      logout: () => set({ loggedIn: false, adminEmail: null }),

      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),

      adjustStock: (id, delta) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
          ),
        })),

      setOrderStatus: (orderId, status) =>
        set((state) => ({
          orderStatus: { ...state.orderStatus, [orderId]: status },
        })),

      setReviewStatus: (reviewId, status) =>
        set((state) => ({
          reviewStatus: { ...state.reviewStatus, [reviewId]: status },
        })),

      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),
    }),
    {
      name: 'skinature-admin',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // v0 → v1: adopt the client's real business details over the old placeholders.
      migrate: (persisted, version) => {
        if (version < 1 && persisted && typeof persisted === 'object') {
          ;(persisted as { settings?: AdminSettings }).settings = DEFAULT_SETTINGS
        }
        return persisted
      },
      partialize: (state) => ({
        loggedIn: state.loggedIn,
        adminEmail: state.adminEmail,
        products: state.products,
        orderStatus: state.orderStatus,
        reviewStatus: state.reviewStatus,
        settings: state.settings,
      }),
      skipHydration: true,
    }
  )
)
