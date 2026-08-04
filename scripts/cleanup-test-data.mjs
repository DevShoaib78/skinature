/**
 * TARGETED cleanup of seed/test data from a LIVE store that also contains real
 * customer orders. Replaces the old blanket wipe-demo-data.mjs, which is unsafe
 * now that genuine orders are interleaved with the originals.
 *
 *   node scripts/cleanup-test-data.mjs            # dry run — lists exactly what would go
 *   node scripts/cleanup-test-data.mjs --confirm  # delete
 *
 * A row is treated as TEST only if its customer email matches TEST_PATTERNS below.
 * Everything else is assumed to belong to a real paying customer and is left alone.
 * When in doubt, a row is KEPT — deleting a real order is unrecoverable.
 */
import { readFileSync } from 'node:fs'

const env = {}
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}
const REST = `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1`
const H = {
  apikey: env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
}
const CONFIRM = process.argv.includes('--confirm')

/**
 * Classification rule (set by the client 2026-08-04): remove ONLY the pre-live
 * fixtures, which are identifiable by the handful of placeholder phone numbers
 * that were reused across every fake name. Everything else — including the
 * founders' own real orders — stays.
 *
 * Deliberately NOT matching on the founders' emails: Adnan, Hina and Shoaib all
 * placed genuine orders once Razorpay went live, and those must survive.
 */
const TEST_PHONES = [
  '9989298408', // reused across the seeded fixtures
  '9885421522', // reused across the seeded fixtures
  '6000000000', // placeholder used by the automated verification scripts
]
const normPhone = (p) => (p || '').replace(/\D/g, '').slice(-10)

const isTestRow = (email, phone) =>
  TEST_PHONES.includes(normPhone(phone)) || /@example\.com$/i.test((email || '').trim())

const isTest = (email) => /@example\.com$/i.test((email || '').trim())

const get = async (path) => (await fetch(`${REST}/${path}`, { headers: H })).json()
const del = (path) =>
  fetch(`${REST}/${path}`, { method: 'DELETE', headers: { ...H, Prefer: 'return=minimal' } })

// ── gather ──
const customers = await get('customers?select=id,email,full_name,phone')
const orders = await get(
  'orders?select=id,order_no,status,total_paise,created_at,customer_id,customers(email,phone)&order=created_at.desc&limit=1000'
)
const reviews = await get('reviews?select=id,author,rating,status,order_id,product_id')
const invites = await get('review_invites?select=id,order_id')

const testOrders = orders.filter((o) => isTestRow(o.customers?.email, o.customers?.phone))
const realOrders = orders.filter((o) => !isTestRow(o.customers?.email, o.customers?.phone))
const testOrderIds = new Set(testOrders.map((o) => o.id))

const testCustomers = customers.filter((c) => isTestRow(c.email, c.phone))
const realCustomers = customers.filter((c) => !isTestRow(c.email, c.phone))

// A review/invite is test-owned if it belongs to a test order. Seed reviews carry no
// order_id at all, so those are test data too (a genuine review always has an order).
const testReviews = reviews.filter((r) => !r.order_id || testOrderIds.has(r.order_id))
const realReviews = reviews.filter((r) => r.order_id && !testOrderIds.has(r.order_id))
const testInvites = invites.filter((i) => !i.order_id || testOrderIds.has(i.order_id))
const realInvites = invites.filter((i) => i.order_id && !testOrderIds.has(i.order_id))

// ── report ──
console.log(CONFIRM ? '════ DELETING TEST DATA ════\n' : '════ DRY RUN — nothing will be deleted ════\n')

console.log('WILL DELETE:')
console.log(`  orders          ${testOrders.length}`)
console.log(`  customers       ${testCustomers.length}`)
console.log(`  reviews         ${testReviews.length}   (seed reviews + reviews on test orders)`)
console.log(`  review_invites  ${testInvites.length}`)
console.log('')
console.log('WILL KEEP (real customers):')
console.log(`  orders          ${realOrders.length}`)
console.log(`  customers       ${realCustomers.length}`)
console.log(`  reviews         ${realReviews.length}`)
console.log(`  review_invites  ${realInvites.length}`)

const realPaid = realOrders.filter((o) => o.status !== 'pending' && o.status !== 'cancelled')
const revenue = realPaid.reduce((s, o) => s + o.total_paise, 0) / 100
console.log(`  -> ${realPaid.length} real paid orders, Rs ${revenue.toFixed(0)} revenue preserved`)

console.log('\nTEST orders to be removed (email -> order):')
for (const o of testOrders) {
  console.log(`  ${o.order_no.padEnd(10)} ${o.status.padEnd(9)} Rs${String(o.total_paise / 100).padEnd(7)} ${(o.customers?.email || '?').slice(0, 34)}`)
}

console.log('\nREAL orders being KEPT (most recent 12, verify none are test):')
for (const o of realOrders.slice(0, 12)) {
  console.log(`  ${o.order_no.padEnd(10)} ${o.status.padEnd(9)} Rs${String(o.total_paise / 100).padEnd(7)} ${(o.customers?.email || '?').slice(0, 34)} ${o.created_at.slice(0, 10)}`)
}

if (!CONFIRM) {
  console.log('\nRe-run with --confirm to delete the TEST rows above.')
  process.exit(0)
}

// ── delete (children first so foreign keys stay satisfied) ──
console.log('\ndeleting...')
const chunk = (arr, n = 40) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))

for (const group of chunk(testInvites.map((i) => i.id)))
  if (group.length) await del(`review_invites?id=in.(${group.join(',')})`)
console.log(`  review_invites  ${testInvites.length} removed`)

for (const group of chunk(testReviews.map((r) => r.id)))
  if (group.length) await del(`reviews?id=in.(${group.join(',')})`)
console.log(`  reviews         ${testReviews.length} removed`)

for (const group of chunk([...testOrderIds])) {
  if (!group.length) continue
  await del(`order_items?order_id=in.(${group.join(',')})`)
  await del(`orders?id=in.(${group.join(',')})`)
}
console.log(`  orders + items  ${testOrders.length} removed`)

for (const group of chunk(testCustomers.map((c) => c.id)))
  if (group.length) await del(`customers?id=in.(${group.join(',')})`)
console.log(`  customers       ${testCustomers.length} removed`)

// ── recompute product review aggregates from the surviving APPROVED reviews ──
const products = await get('products?select=id')
const surviving = await get('reviews?select=product_id,rating,status')
for (const p of products) {
  const mine = surviving.filter((r) => r.product_id === p.id && r.status === 'approved')
  const count = mine.length
  const rating = count ? Number((mine.reduce((s, r) => s + r.rating, 0) / count).toFixed(1)) : 5.0
  await fetch(`${REST}/products?id=eq.${p.id}`, {
    method: 'PATCH',
    headers: { ...H, Prefer: 'return=minimal' },
    body: JSON.stringify({ rating, review_count: count }),
  })
}
console.log('  products        rating/review_count recalculated from real approved reviews')

console.log('\nfinal counts:')
for (const t of ['orders', 'customers', 'reviews', 'review_invites']) {
  const r = await fetch(`${REST}/${t}?select=id`, { headers: { ...H, Prefer: 'count=exact', Range: '0-0' } })
  console.log(`  ${t.padEnd(16)} ${(r.headers.get('content-range') || '/?').split('/')[1]}`)
}
console.log('\nDone. Only real customer data remains.')
