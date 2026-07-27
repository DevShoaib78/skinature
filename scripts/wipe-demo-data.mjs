/**
 * Deletes ALL demo/seed data so the store launches empty (DECISIONS.md §11).
 *
 *   node scripts/wipe-demo-data.mjs           # dry run — shows what WOULD be deleted
 *   node scripts/wipe-demo-data.mjs --confirm # actually delete
 *
 * Wipes: review_invites, reviews, order_items, orders, customers.
 * KEEPS: products, site_settings, admins (these are real configuration).
 *
 * Order matters — children before parents, or the foreign keys reject the delete.
 * Product review counts/ratings are reset to a clean slate afterwards.
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

async function count(table) {
  const r = await fetch(`${REST}/${table}?select=id`, {
    headers: { ...H, Prefer: 'count=exact', Range: '0-0' },
  })
  return (r.headers.get('content-range') || '/?').split('/')[1]
}

// Children first so foreign keys stay satisfied.
const TABLES = ['review_invites', 'reviews', 'order_items', 'orders', 'customers']

console.log(CONFIRM ? '=== WIPING DEMO DATA ===' : '=== DRY RUN (add --confirm to delete) ===\n')

console.log('current row counts:')
for (const t of TABLES) console.log(`  ${t.padEnd(16)} ${await count(t)}`)

if (!CONFIRM) {
  console.log('\nNothing deleted. Re-run with --confirm to wipe.')
  process.exit(0)
}

console.log('\ndeleting...')
for (const t of TABLES) {
  // `id=not.is.null` matches every row (PostgREST refuses an unfiltered delete).
  const r = await fetch(`${REST}/${t}?id=not.is.null`, {
    method: 'DELETE',
    headers: { ...H, Prefer: 'return=minimal' },
  })
  console.log(`  ${t.padEnd(16)} ${r.ok ? 'cleared' : 'FAILED ' + (await r.text()).slice(0, 120)}`)
}

// Reset the review aggregates shown on product cards/pages.
const rp = await fetch(`${REST}/products?id=not.is.null`, {
  method: 'PATCH',
  headers: { ...H, Prefer: 'return=minimal' },
  body: JSON.stringify({ rating: 5.0, review_count: 0 }),
})
console.log(`  ${'products (agg)'.padEnd(16)} ${rp.ok ? 'rating/review_count reset' : 'FAILED'}`)

console.log('\nfinal counts:')
for (const t of TABLES) console.log(`  ${t.padEnd(16)} ${await count(t)}`)
console.log('\nStore is empty and ready for real customers.')
