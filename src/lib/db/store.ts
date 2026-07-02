/**
 * Server-side storefront reads. Uses the service client but ALWAYS applies
 * the same visibility rules the public would get (active products, approved
 * reviews). Falls back to the static catalog if the database is unreachable
 * so local builds never hard-fail.
 */

import { getSupabaseService } from '@/lib/supabase/server'
import { products as staticCatalog, type Product } from '@/lib/data'
import type { Review, StoreSettings } from '@/lib/domain'
import {
  rowToProduct,
  rowToReview,
  rowToSettings,
  type ProductRow,
  type ReviewRow,
  type SettingsRow,
} from '@/lib/db/mappers'
import {
  SHIPPING_TELANGANA_PAISE,
  SHIPPING_REST_OF_INDIA_PAISE,
} from '@/lib/shipping'

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await getSupabaseService()
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    if (error) throw error
    return (data as ProductRow[]).map(rowToProduct)
  } catch (err) {
    console.warn('[db] fetchProducts failed, using static catalog:', err)
    return staticCatalog
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await getSupabaseService()
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
    if (error) throw error
    return data ? rowToProduct(data as ProductRow) : null
  } catch (err) {
    console.warn('[db] fetchProductBySlug failed, using static catalog:', err)
    return staticCatalog.find((p) => p.slug === slug) ?? null
  }
}

export async function fetchRelatedProducts(slug: string, count = 3): Promise<Product[]> {
  const all = await fetchProducts()
  const current = all.find((p) => p.slug === slug)
  const others = all.filter((p) => p.slug !== slug)
  if (!current) return others.slice(0, count)
  const same = others.filter((p) => p.category === current.category)
  const rest = others.filter((p) => p.category !== current.category)
  return [...same, ...rest].slice(0, count)
}

export async function fetchApprovedReviews(productId: string): Promise<Review[]> {
  try {
    const { data, error } = await getSupabaseService()
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as ReviewRow[]).map(rowToReview)
  } catch (err) {
    console.warn('[db] fetchApprovedReviews failed:', err)
    return []
  }
}

const DEFAULT_SETTINGS: StoreSettings = {
  shippingTelanganaPaise: SHIPPING_TELANGANA_PAISE,
  shippingRestPaise: SHIPPING_REST_OF_INDIA_PAISE,
  businessName: 'Nurtured by Nature Products',
  businessAddress:
    'Plot No. 509-J-III, Road No. 86, Near Lotus Pond, Jubilee Hills, Hyderabad - 500096, Telangana, India',
  gstin: '36AAZFN8373Q1ZU',
  notifyEmail: 'admin@skinature.org',
}

export async function fetchSettings(): Promise<StoreSettings> {
  try {
    const { data, error } = await getSupabaseService()
      .from('site_settings')
      .select('*')
      .single()
    if (error) throw error
    return rowToSettings(data as SettingsRow)
  } catch (err) {
    console.warn('[db] fetchSettings failed, using defaults:', err)
    return DEFAULT_SETTINGS
  }
}
