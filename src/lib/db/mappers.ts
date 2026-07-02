import type { Product, Category } from '@/lib/data'
import type {
  Order,
  OrderItem,
  OrderStatus,
  Review,
  ReviewStatus,
  ReviewInvite,
  StoreSettings,
} from '@/lib/domain'

/* ── Row shapes (snake_case, as returned by PostgREST) ── */

export interface ProductRow {
  id: string
  slug: string
  name: string
  category: Category
  is_kit: boolean
  price_paise: number
  sale_price_paise: number | null
  benefit: string
  description: string
  ingredients: string
  ritual: string
  benefits: string
  badge: string | null
  rating: number
  review_count: number
  image: string
  gallery: string[]
  contents: string[] | null
  stock: number
  is_active: boolean
  sort_order: number
}

export interface ReviewRow {
  id: string
  product_id: string
  author: string
  rating: number
  body: string
  verified: boolean
  status: ReviewStatus
  created_at: string
}

export interface OrderItemRow {
  product_id: string | null
  name_snapshot: string
  qty: number
  unit_price_paise: number
  line_total_paise: number
}

export interface OrderRow {
  id: string
  order_no: string
  status: OrderStatus
  subtotal_paise: number
  shipping_paise: number
  total_paise: number
  ship_name: string
  ship_line1: string
  ship_line2: string | null
  ship_city: string
  ship_state: string
  ship_pincode: string
  payment_id: string | null
  invoice_no: string | null
  created_at: string
  customers: { email: string; full_name: string; phone: string } | null
  order_items: OrderItemRow[]
}

export interface SettingsRow {
  shipping_telangana_paise: number
  shipping_rest_paise: number
  business_name: string
  business_address: string
  gstin: string
  notify_email: string
}

export interface InviteRow {
  id: string
  order_id: string
  product_id: string
  token: string
  send_after: string
  sent_at: string | null
  used_at: string | null
  products: { name: string } | null
}

/* ── Mappers ── */

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    isKit: row.is_kit,
    pricePaise: row.price_paise,
    salePricePaise: row.sale_price_paise,
    benefit: row.benefit,
    description: row.description,
    ingredients: row.ingredients,
    ritual: row.ritual,
    benefits: row.benefits,
    badge: row.badge ?? undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    image: row.image,
    gallery: row.gallery ?? [],
    contents: row.contents ?? undefined,
    stock: row.stock,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  }
}

export function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.product_id,
    author: row.author,
    rating: row.rating,
    body: row.body,
    verified: row.verified,
    status: row.status,
    createdAt: row.created_at,
  }
}

export function rowToOrder(row: OrderRow): Order {
  const items: OrderItem[] = (row.order_items ?? []).map((it) => ({
    productId: it.product_id,
    name: it.name_snapshot,
    qty: it.qty,
    unitPricePaise: it.unit_price_paise,
    lineTotalPaise: it.line_total_paise,
  }))
  return {
    id: row.id,
    orderNo: row.order_no,
    createdAt: row.created_at,
    customer: {
      name: row.customers?.full_name ?? row.ship_name,
      email: row.customers?.email ?? '',
      phone: row.customers?.phone ?? '',
    },
    address: {
      line1: row.ship_line1,
      line2: row.ship_line2 ?? undefined,
      city: row.ship_city,
      state: row.ship_state,
      pincode: row.ship_pincode,
    },
    items,
    subtotalPaise: row.subtotal_paise,
    shippingPaise: row.shipping_paise,
    totalPaise: row.total_paise,
    status: row.status,
    paymentId: row.payment_id,
    invoiceNo: row.invoice_no,
  }
}

export function rowToSettings(row: SettingsRow): StoreSettings {
  return {
    shippingTelanganaPaise: row.shipping_telangana_paise,
    shippingRestPaise: row.shipping_rest_paise,
    businessName: row.business_name,
    businessAddress: row.business_address,
    gstin: row.gstin,
    notifyEmail: row.notify_email,
  }
}

export function rowToInvite(row: InviteRow): ReviewInvite {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.products?.name ?? 'Product',
    token: row.token,
    sendAfter: row.send_after,
    sentAt: row.sent_at,
    usedAt: row.used_at,
  }
}

/** camelCase Product patch → snake_case row patch (admin edits). */
export function productPatchToRow(patch: Partial<Product>): Record<string, unknown> {
  const map: Record<string, string> = {
    slug: 'slug',
    name: 'name',
    category: 'category',
    isKit: 'is_kit',
    pricePaise: 'price_paise',
    salePricePaise: 'sale_price_paise',
    benefit: 'benefit',
    description: 'description',
    ingredients: 'ingredients',
    ritual: 'ritual',
    benefits: 'benefits',
    badge: 'badge',
    rating: 'rating',
    reviewCount: 'review_count',
    image: 'image',
    gallery: 'gallery',
    contents: 'contents',
    stock: 'stock',
    isActive: 'is_active',
    sortOrder: 'sort_order',
  }
  const row: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(patch)) {
    const col = map[key]
    if (col) row[col] = value === undefined ? null : value
  }
  return row
}

export const ORDER_SELECT =
  'id, order_no, status, subtotal_paise, shipping_paise, total_paise, ship_name, ship_line1, ship_line2, ship_city, ship_state, ship_pincode, payment_id, invoice_no, created_at, customers ( email, full_name, phone ), order_items ( product_id, name_snapshot, qty, unit_price_paise, line_total_paise )'
