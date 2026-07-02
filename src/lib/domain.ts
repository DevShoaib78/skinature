/** Domain types shared by the storefront, admin, and API routes. */

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string | null
  name: string
  qty: number
  unitPricePaise: number
  lineTotalPaise: number
}

export interface Order {
  /** Database uuid. */
  id: string
  /** Human/business identifier, e.g. "SKN-1101". Used in URLs and displays. */
  orderNo: string
  createdAt: string
  customer: { name: string; email: string; phone: string }
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
  items: OrderItem[]
  subtotalPaise: number
  shippingPaise: number
  totalPaise: number
  status: OrderStatus
  paymentId: string | null
  invoiceNo: string | null
}

export interface CustomerSummary {
  name: string
  email: string
  phone: string
  city: string
  state: string
  ordersCount: number
  totalSpendPaise: number
  firstOrderAt: string
  lastOrderAt: string
}

export type ReviewStatus = 'pending' | 'approved' | 'hidden'

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  body: string
  createdAt: string
  verified: boolean
  status: ReviewStatus
}

export interface ReviewInvite {
  id: string
  orderId: string
  productId: string
  productName: string
  token: string
  sendAfter: string
  sentAt: string | null
  usedAt: string | null
}

export interface StoreSettings {
  shippingTelanganaPaise: number
  shippingRestPaise: number
  businessName: string
  businessAddress: string
  gstin: string
  notifyEmail: string
}
