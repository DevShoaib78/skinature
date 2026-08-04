/**
 * Lists customers who reached the payment screen but never completed — the
 * abandoned-cart recovery list for the founders to follow up on WhatsApp.
 *
 *   node scripts/abandoned-carts.mjs           # last 30 days (default)
 *   node scripts/abandoned-carts.mjs --days 7  # narrower window
 *
 * Read-only. Prints fresh from the database each run, deliberately: the list
 * changes daily, and customer phone numbers should never be committed to the
 * repo. Excludes anyone who later completed a purchase, so the founders only
 * chase genuinely lost sales.
 *
 * Context: `pending` means the order was created and the customer reached
 * payment but no money moved — verified against the Razorpay API, every pending
 * order shows amount_paid = 0. See docs/DECISIONS.md §7b Issue D.
 */
import { readFileSync } from 'node:fs'

const env = {}
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}
const REST = `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1`
const H = { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }

const daysArg = process.argv.indexOf('--days')
const DAYS = daysArg > -1 ? Number(process.argv[daysArg + 1]) : 30
const since = new Date(Date.now() - DAYS * 86400000)

const orders = await (
  await fetch(
    `${REST}/orders?select=order_no,status,total_paise,created_at,customers(full_name,email,phone)&order=created_at.desc&limit=1000`,
    { headers: H }
  )
).json()

const key = (o) => `${o.customers?.phone || ''}|${(o.customers?.email || '').toLowerCase()}`
const paidKeys = new Set(
  orders.filter((o) => o.status !== 'pending' && o.status !== 'cancelled').map(key)
)

// Pending, inside the window, and this customer never completed any other order.
const lost = orders
  .filter((o) => o.status === 'pending')
  .filter((o) => new Date(o.created_at) >= since)
  .filter((o) => !paidKeys.has(key(o)))

// One row per customer — keep their largest basket as the reason to call.
const byCustomer = new Map()
for (const o of lost) {
  const k = key(o)
  const prev = byCustomer.get(k)
  if (!prev || o.total_paise > prev.total_paise) byCustomer.set(k, o)
}
const list = [...byCustomer.values()].sort((a, b) => b.total_paise - a.total_paise)

console.log(`\nAbandoned carts, last ${DAYS} days — customers who never completed a purchase\n`)
console.log('  ' + 'CUSTOMER'.padEnd(26) + 'PHONE'.padEnd(14) + 'VALUE'.padEnd(10) + 'WHEN')
console.log('  ' + '-'.repeat(62))
for (const o of list) {
  console.log(
    '  ' +
      (o.customers?.full_name || '?').slice(0, 24).padEnd(26) +
      (o.customers?.phone || '?').padEnd(14) +
      ('Rs' + o.total_paise / 100).padEnd(10) +
      o.created_at.slice(0, 10)
  )
}
const total = list.reduce((s, o) => s + o.total_paise, 0) / 100
console.log('  ' + '-'.repeat(62))
console.log(`  ${list.length} customers · Rs ${total.toFixed(0)} recoverable\n`)
console.log('Suggested message: "Hi <name>, we noticed your Skinature order didn\'t go')
console.log('through. Can we help you complete it?"\n')
