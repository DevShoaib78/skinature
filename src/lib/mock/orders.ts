/**
 * Mock orders + customers. Mirrors the future `orders` / `order_items` /
 * `customers` tables. Generated deterministically (seeded PRNG, fixed anchor
 * date) so server and client always render identical data.
 */

import { products, effectivePricePaise } from '@/lib/data'
import { shippingPaiseForState } from '@/lib/shipping'

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  name: string
  qty: number
  unitPricePaise: number
  lineTotalPaise: number
}

export interface Order {
  id: string
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

export interface Customer {
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

/* Deterministic PRNG so the mock data never shifts between renders. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const CUSTOMER_POOL = [
  { name: 'Ayesha Tabassum', email: 'ayesha.tabassum@gmail.com', phone: '9848012345', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Priya Kondapalli', email: 'priya.kondapalli@gmail.com', phone: '9866123456', city: 'Warangal', state: 'Telangana' },
  { name: 'Mehnaz Anjum', email: 'mehnaz.anjum@outlook.com', phone: '9885234567', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Farhan Mirza', email: 'farhan.mirza@gmail.com', phone: '9700345678', city: 'Nizamabad', state: 'Telangana' },
  { name: 'Keerthana Reddy', email: 'keerthana.reddy@gmail.com', phone: '9490456789', city: 'Karimnagar', state: 'Telangana' },
  { name: 'Zoya Fatima', email: 'zoya.fatima@gmail.com', phone: '9959567890', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Shruti Venkatesan', email: 'shruti.venkatesan@gmail.com', phone: '9445678901', city: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Divya Nair', email: 'divya.nair@gmail.com', phone: '9895789012', city: 'Kochi', state: 'Kerala' },
  { name: 'Sameer Hussain', email: 'sameer.hussain@gmail.com', phone: '9820890123', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Ankita Jain', email: 'ankita.jain@gmail.com', phone: '9928901234', city: 'Jaipur', state: 'Rajasthan' },
  { name: 'Mohammed Irfan', email: 'mohammed.irfan@gmail.com', phone: '9986012345', city: 'Bengaluru', state: 'Karnataka' },
  { name: 'Sana Begum', email: 'sana.begum@gmail.com', phone: '9701123456', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Ritika Sharma', email: 'ritika.sharma@gmail.com', phone: '9810234567', city: 'Delhi', state: 'Delhi' },
  { name: 'Nikitha Muppala', email: 'nikitha.muppala@gmail.com', phone: '9490345678', city: 'Vijayawada', state: 'Andhra Pradesh' },
  { name: 'Lubna Shaikh', email: 'lubna.shaikh@gmail.com', phone: '9822456789', city: 'Pune', state: 'Maharashtra' },
  { name: 'Naaz Osama', email: 'naaz.osama@gmail.com', phone: '9866567890', city: 'Hyderabad', state: 'Telangana' },
]

const ADDRESS_LINES = [
  'Flat 302, Sri Sai Residency',
  'H.No 8-2-293/82, Road No 12',
  'Plot 45, Green Meadows Colony',
  'D.No 12-11-1420, Boudha Nagar',
  '14, Jasmine Towers, 2nd Cross',
  'Villa 27, Palm Grove Layout',
  'B-604, Lake View Apartments',
  '21-1-333, Charminar Road',
]

const LOCALITIES = [
  'Banjara Hills', 'Madhapur', 'Tolichowki', 'Kukatpally', 'Mehdipatnam',
  'Secunderabad', 'Gachibowli', 'Old City',
]

/* Anchor "today" for mock data. Fixed so builds are reproducible. */
const ANCHOR = new Date('2026-07-01T18:30:00+05:30').getTime()
const DAY_MS = 24 * 60 * 60 * 1000

function buildOrders(): Order[] {
  const rand = mulberry32(20260701)
  const orders: Order[] = []
  const COUNT = 36

  for (let i = 0; i < COUNT; i++) {
    const customer = CUSTOMER_POOL[Math.floor(rand() * CUSTOMER_POOL.length)]

    // 1-3 distinct items per order
    const itemCount = rand() < 0.55 ? 1 : rand() < 0.8 ? 2 : 3
    const shuffled = [...products].sort(() => rand() - 0.5)
    const items: OrderItem[] = shuffled.slice(0, itemCount).map((p) => {
      const qty = rand() < 0.8 ? 1 : 2
      const unit = effectivePricePaise(p)
      return {
        productId: p.id,
        name: p.name,
        qty,
        unitPricePaise: unit,
        lineTotalPaise: unit * qty,
      }
    })

    const subtotalPaise = items.reduce((s, it) => s + it.lineTotalPaise, 0)
    const shippingPaise = shippingPaiseForState(customer.state)

    // Spread orders across the last ~55 days, newest first by index
    const createdAt = new Date(
      ANCHOR - Math.floor(rand() * 55 * DAY_MS) - Math.floor(rand() * 12) * 60 * 60 * 1000
    )

    // Status distribution: older orders mostly delivered, recent ones earlier in the funnel
    const ageDays = (ANCHOR - createdAt.getTime()) / DAY_MS
    let status: OrderStatus
    if (rand() < 0.06) status = 'cancelled'
    else if (ageDays > 14) status = 'delivered'
    else if (ageDays > 6) status = rand() < 0.7 ? 'delivered' : 'shipped'
    else if (ageDays > 2) status = rand() < 0.6 ? 'shipped' : 'paid'
    else status = rand() < 0.85 ? 'paid' : 'pending'

    const seq = 1040 + i
    const paid = status !== 'pending' && status !== 'cancelled'
    orders.push({
      id: `SKN-${seq}`,
      createdAt: createdAt.toISOString(),
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      address: {
        line1: ADDRESS_LINES[Math.floor(rand() * ADDRESS_LINES.length)],
        line2:
          customer.state === 'Telangana'
            ? LOCALITIES[Math.floor(rand() * LOCALITIES.length)]
            : undefined,
        city: customer.city,
        state: customer.state,
        pincode: customer.state === 'Telangana'
          ? `5000${Math.floor(rand() * 90) + 10}`.slice(0, 6)
          : `${Math.floor(rand() * 700000) + 110000}`.padStart(6, '0'),
      },
      items,
      subtotalPaise,
      shippingPaise,
      totalPaise: subtotalPaise + shippingPaise,
      status,
      paymentId: paid ? `pay_M${seq}x${Math.floor(rand() * 9000) + 1000}` : null,
      invoiceNo: paid ? `INV-2026-${seq}` : null,
    })
  }

  return orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export const mockOrders: Order[] = buildOrders()

export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((o) => o.id === id)
}

export function getMockCustomers(): Customer[] {
  const byEmail = new Map<string, Customer>()
  for (const order of [...mockOrders].reverse()) {
    if (order.status === 'cancelled') continue
    const existing = byEmail.get(order.customer.email)
    if (!existing) {
      byEmail.set(order.customer.email, {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
        city: order.address.city,
        state: order.address.state,
        ordersCount: 1,
        totalSpendPaise: order.totalPaise,
        firstOrderAt: order.createdAt,
        lastOrderAt: order.createdAt,
      })
    } else {
      existing.ordersCount += 1
      existing.totalSpendPaise += order.totalPaise
      existing.lastOrderAt = order.createdAt
    }
  }
  return [...byEmail.values()].sort((a, b) => b.totalSpendPaise - a.totalSpendPaise)
}
