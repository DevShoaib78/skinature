/**
 * One-shot database setup for the live Supabase project:
 *   node scripts/db-setup.mjs [--schema] [--seed] [--admin]  (no flags = all)
 *
 * Reads credentials from .env.local. Idempotent where practical.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// ── env ─────────────────────────────────────────────────────────────────
const env = {}
for (const line of readFileSync(path.join(root, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
const DB_PASSWORD = env.SUPABASE_DB_PASSWORD
const REF = new URL(SUPABASE_URL).hostname.split('.')[0]

const CANDIDATE_URLS = [
  env.SUPABASE_DB_URL,
  // IPv4-friendly session poolers (region variants)
  `postgresql://postgres.${REF}:${DB_PASSWORD}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres.${REF}:${DB_PASSWORD}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`,
].filter(Boolean)

async function connect() {
  let lastErr
  for (const url of CANDIDATE_URLS) {
    const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 12000 })
    try {
      await client.connect()
      console.log('connected via', url.replace(DB_PASSWORD, '****').split('@')[1])
      return client
    } catch (e) {
      lastErr = e
      console.log('connect failed:', url.split('@')[1] ?? url, '-', e.code ?? e.message)
    }
  }
  throw lastErr
}

// ── deterministic PRNG (matches src/lib/mock/orders.ts) ─────────────────
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ── catalog seed (mirrors src/lib/data.ts, fixed UUIDs) ──────────────────
const PRODUCTS = [
  {
    id: '5e8a1c0a-0001-4f7e-9c11-000000000001',
    slug: 'brightening-cleansing-mask',
    name: 'Brightening & Cleansing Mask',
    category: 'Skin Care',
    is_kit: false,
    price_paise: 49900,
    sale_price_paise: null,
    benefit: 'Brightening & Detoxifying',
    description: 'Removes Tan | Fades Pigmentation | Revives Dullness',
    image: '/new mockups/Brightening and Cleansing Mask.webp',
    gallery: ['/new mockups/Brightening and Cleansing Mask.webp'],
    badge: 'Best Seller',
    rating: 4.9,
    review_count: 156,
    contents: null,
    ingredients: 'Natural botanicals, Vitamin C, Turmeric Extract, Kaolin Clay, Rose Water, Aloe Vera.',
    ritual: 'Apply an even layer to cleansed face. Leave for 15-20 minutes. Rinse with lukewarm water. Use 2-3 times weekly for radiant skin.',
    benefits: 'Removes tan and pigmentation, brightens complexion, revives dull skin. Gentle detoxification while nourishing and hydrating.',
    stock: 42,
    sort_order: 1,
  },
  {
    id: '5e8a1c0a-0002-4f7e-9c11-000000000002',
    slug: 'root-revival-hair-mask-cocktail',
    name: 'Root Revival Hair Mask & Cocktail',
    category: 'Hair Care',
    is_kit: true,
    price_paise: 60000,
    sale_price_paise: null,
    benefit: 'Hair Strengthening & Growth',
    description: 'Strengthens Hair | Reduces Hair Fall | Fights Dandruff | Stimulates Growth',
    image: '/new mockups/Hair Kit.webp',
    gallery: ['/new mockups/Hair Kit.webp', '/new mockups/Root Revival Hair Mask.webp', '/new mockups/Root Revival Cocktail.webp'],
    badge: 'Combo Pack',
    rating: 4.8,
    review_count: 203,
    contents: ['Root Revival Hair Mask', 'Root Revival Cocktail'],
    ingredients: 'Bhringraj Extract, Amla, Hibiscus, Neem, Fenugreek, Coconut Oil, Argan Oil, Biotin.',
    ritual: 'Apply hair mask to roots and lengths. Massage gently for 5 minutes. Leave for 30 minutes. Rinse thoroughly. Follow with cocktail spray on damp hair.',
    benefits: 'Strengthens hair from roots, reduces hair fall significantly, fights dandruff effectively. Stimulates natural hair growth and adds volume.',
    stock: 26,
    sort_order: 2,
  },
  {
    id: '5e8a1c0a-0003-4f7e-9c11-000000000003',
    slug: 'root-revival-hair-oil',
    name: 'Root Revival Hair Oil',
    category: 'Hair Care',
    is_kit: false,
    price_paise: 55000,
    sale_price_paise: null,
    benefit: 'Deep Nourishment & Repair',
    description: 'Repairs Damage | Deeply Nourishes | Adds Shine & Smoothness',
    image: '/new mockups/Root Revival Hair Oil.webp',
    gallery: ['/new mockups/Root Revival Hair Oil.webp'],
    badge: null,
    rating: 4.7,
    review_count: 178,
    contents: null,
    ingredients: 'Bhringraj, Brahmi, Amla, Neem, Hibiscus, Coconut Oil, Castor Oil, Sesame Oil, Vitamin E.',
    ritual: 'Warm oil slightly. Apply to scalp and massage for 10 minutes. Distribute through hair lengths. Leave for minimum 2 hours or overnight. Wash with mild shampoo.',
    benefits: 'Repairs damaged hair, provides deep nourishment from roots to tips. Adds natural shine, smoothness and controls frizz.',
    stock: 34,
    sort_order: 3,
  },
  {
    id: '5e8a1c0a-0004-4f7e-9c11-000000000004',
    slug: 'hair-care-kit',
    name: 'Hair Care Kit',
    category: 'Hair Care',
    is_kit: true,
    price_paise: 110000,
    sale_price_paise: null,
    benefit: 'Complete Hair Care Solution',
    description: 'Root Revival Hair Care Combo: Oil, Mask & Cocktail',
    image: '/new mockups/Hair Care Kit.webp',
    gallery: ['/new mockups/Hair Care Kit.webp'],
    badge: 'Complete Kit',
    rating: 4.9,
    review_count: 145,
    contents: ['Root Revival Hair Oil', 'Root Revival Hair Mask', 'Root Revival Cocktail'],
    ingredients: 'Complete blend of Bhringraj, Amla, Hibiscus, Neem, Coconut Oil, Argan Oil, Biotin, and essential vitamins.',
    ritual: 'Use oil treatment 2-3 times weekly. Apply mask once weekly. Use cocktail spray daily on damp or dry hair. Complete hair care routine for best results.',
    benefits: 'Complete hair care solution. Addresses all hair concerns: strengthening, nourishment, damage repair, and growth stimulation in one comprehensive kit.',
    stock: 15,
    sort_order: 4,
  },
  {
    id: '5e8a1c0a-0005-4f7e-9c11-000000000005',
    slug: 'bridal-kit',
    name: 'Bridal Kit',
    category: 'Hair + Skin',
    is_kit: true,
    price_paise: 155000,
    sale_price_paise: null,
    benefit: 'Complete Beauty Essentials',
    description: 'Hair & Skin Essentials, beautifully boxed for the moments that matter.',
    image: '/new mockups/Bridal Kit Box.webp',
    gallery: ['/new mockups/Bridal Kit Box.webp', '/new mockups/Bridal Kit.webp'],
    badge: 'Premium Kit',
    rating: 5.0,
    review_count: 89,
    contents: ['Brightening & Cleansing Mask', 'Root Revival Hair Oil', 'Root Revival Hair Mask', 'Root Revival Cocktail'],
    ingredients: 'Complete combination of all hair care and skin care products. Premium botanical ingredients for comprehensive beauty care.',
    ritual: 'Follow complete hair care routine with oil, mask, and cocktail. Use brightening mask 2-3 times weekly. Perfect pre-bridal beauty regimen for glowing skin and lustrous hair.',
    benefits: 'All-in-one beauty solution. Combines hair and skin essentials for complete transformation. Perfect for brides and special occasions. Visible results in weeks.',
    stock: 9,
    sort_order: 5,
  },
]

const REVIEWS = [
  // [productIndex, author, rating, createdAt, status, body]
  [0, 'Asma R.', 5, '2026-06-14', 'approved', 'The glow it leaves on my face, just wow! My sister used it when she had developed pigmentation around her neck and this mask actually helped to fade it. Alhamdulillah.'],
  [0, 'Priya K.', 5, '2026-05-28', 'approved', 'Tan around my forehead and cheeks visibly reduced in three weeks of regular use. It feels gentle, no burning or tightness after washing off.'],
  [0, 'Naaz O.', 4, '2026-05-10', 'approved', 'Very nice face pack. I even asked if I can use it for my daughter, she is 9, and they said yes since it is chemical free. That trust matters to me.'],
  [0, 'Ritika S.', 5, '2026-04-22', 'approved', 'Have tried so many ubtans and masks from big brands. This one actually brightens without drying my combination skin. Restocking already.'],
  [1, 'Mehnaz A.', 5, '2026-06-20', 'approved', 'Ordered the combo at an expo and the results are mashallah, visibly seen. Hair fall in my comb reduced noticeably by the third wash.'],
  [1, 'Shruti V.', 5, '2026-06-02', 'approved', 'The mask is rich but rinses clean, and the cocktail spray is now my daily leave-in. My frizz is finally manageable in Hyderabad humidity.'],
  [1, 'Farhan M.', 4, '2026-05-15', 'approved', 'Bought for my wife, ended up using it myself too. Dandruff has calmed down a lot. Wish the mask tub was bigger, we finish it fast.'],
  [1, 'Keerthana R.', 5, '2026-04-30', 'approved', 'The consistency of natural products is awesome, no harmful chemicals. My scalp feels clean, not stripped. Will restock soon inshallah.'],
  [2, 'Ayesha T.', 5, '2026-06-18', 'approved', 'I have been using the hair oil and trust me, it is working so well for me. Two months in, baby hairs along my hairline are filling in.'],
  [2, 'Divya N.', 5, '2026-05-25', 'approved', 'Smells earthy and herbal, not perfumey. Overnight oiling then a mild shampoo, and my hair is softer than any serum ever made it.'],
  [2, 'Sameer H.', 4, '2026-05-08', 'approved', 'Genuine bhringraj oil, you can tell from the colour and texture. Reduced my hair fall. Slightly heavy for daily use, perfect for weekends.'],
  [2, 'Lubna S.', 5, '2026-04-12', 'approved', 'My mother and I both use this now. Her scalp dryness is gone and my split ends have reduced. It feels like the oils our nani used to make.'],
  [3, 'Sana B.', 5, '2026-06-10', 'approved', 'The complete routine just works: oil twice a week, mask on Sunday, cocktail daily. Fourth week and my ponytail feels thicker.'],
  [3, 'Ankita J.', 5, '2026-05-20', 'approved', 'Gifted this to my sister for her wedding prep and stole it back after seeing her hair. Better value than buying the three separately.'],
  [3, 'Mohammed I.', 4, '2026-04-28', 'approved', 'Solid kit. The oil and mask are the stars. Delivery to Bengaluru took four days but the packaging was neat and nothing leaked.'],
  [4, 'Zoya F.', 5, '2026-06-05', 'approved', 'Used the full kit for two months before my nikah. My mehndi artist asked what I had done to my skin. Worth every rupee.'],
  [4, 'Nikitha M.', 5, '2026-05-12', 'approved', 'Bought as a bridesmaid gift box. The packaging is beautiful enough to hand over as is, and the products inside are genuinely good.'],
  [4, 'Mehreen S.', 5, '2026-04-18', 'approved', 'Stocking up before I fly back to Saudi. Nothing there compares at this price for fully natural products. My whole family uses this kit.'],
  [0, 'Tanvi D.', 5, '2026-06-29', 'pending', 'Second jar finished! My tanning from college commutes is almost gone. Please never discontinue this.'],
  [1, 'Rukhsar J.', 4, '2026-06-28', 'pending', 'Hair fall reduced within two weeks. The smell of the mask is quite strong at first but it grows on you.'],
  [2, 'Vandana P.', 5, '2026-06-30', 'pending', 'Ordered after seeing a reel. This oil has replaced three products on my shelf. My scalp has never felt healthier.'],
]

// Synthetic demo customers ONLY. Emails use example.com (RFC 2606 reserved — can
// never be a real deliverable address). Phones alternate between two TEST numbers
// the developer (Shoaib) owns, so the WhatsApp send flow can be exercised safely.
// ALL of this demo data (orders, customers, reviews, these numbers) is wiped
// before launch — see docs/DECISIONS.md §11. Never seed realistic-looking Indian
// mobile numbers: the numbering space is dense enough that plausible numbers hit
// real subscribers.
const TEST_PHONE_A = '9885421522'
const TEST_PHONE_B = '9989298408'
const CUSTOMER_POOL = [
  { name: 'Ayesha Tabassum', email: 'ayesha.tabassum@example.com', phone: TEST_PHONE_A, city: 'Hyderabad', state: 'Telangana' },
  { name: 'Priya Kondapalli', email: 'priya.kondapalli@example.com', phone: TEST_PHONE_B, city: 'Warangal', state: 'Telangana' },
  { name: 'Mehnaz Anjum', email: 'mehnaz.anjum@example.com', phone: TEST_PHONE_A, city: 'Hyderabad', state: 'Telangana' },
  { name: 'Farhan Mirza', email: 'farhan.mirza@example.com', phone: TEST_PHONE_B, city: 'Nizamabad', state: 'Telangana' },
  { name: 'Keerthana Reddy', email: 'keerthana.reddy@example.com', phone: TEST_PHONE_A, city: 'Karimnagar', state: 'Telangana' },
  { name: 'Zoya Fatima', email: 'zoya.fatima@example.com', phone: TEST_PHONE_B, city: 'Hyderabad', state: 'Telangana' },
  { name: 'Shruti Venkatesan', email: 'shruti.venkatesan@example.com', phone: TEST_PHONE_A, city: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Divya Nair', email: 'divya.nair@example.com', phone: TEST_PHONE_B, city: 'Kochi', state: 'Kerala' },
  { name: 'Sameer Hussain', email: 'sameer.hussain@example.com', phone: TEST_PHONE_A, city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Ankita Jain', email: 'ankita.jain@example.com', phone: TEST_PHONE_B, city: 'Jaipur', state: 'Rajasthan' },
  { name: 'Mohammed Irfan', email: 'mohammed.irfan@example.com', phone: TEST_PHONE_A, city: 'Bengaluru', state: 'Karnataka' },
  { name: 'Sana Begum', email: 'sana.begum@example.com', phone: TEST_PHONE_B, city: 'Hyderabad', state: 'Telangana' },
  { name: 'Ritika Sharma', email: 'ritika.sharma@example.com', phone: TEST_PHONE_A, city: 'Delhi', state: 'Delhi' },
  { name: 'Nikitha Muppala', email: 'nikitha.muppala@example.com', phone: TEST_PHONE_B, city: 'Vijayawada', state: 'Andhra Pradesh' },
  { name: 'Lubna Shaikh', email: 'lubna.shaikh@example.com', phone: TEST_PHONE_A, city: 'Pune', state: 'Maharashtra' },
  { name: 'Naaz Osama', email: 'naaz.osama@example.com', phone: TEST_PHONE_B, city: 'Hyderabad', state: 'Telangana' },
]

const ADDRESS_LINES = [
  'Flat 302, Sri Sai Residency', 'H.No 8-2-293/82, Road No 12', 'Plot 45, Green Meadows Colony',
  'D.No 12-11-1420, Boudha Nagar', '14, Jasmine Towers, 2nd Cross', 'Villa 27, Palm Grove Layout',
  'B-604, Lake View Apartments', '21-1-333, Charminar Road',
]
const LOCALITIES = ['Banjara Hills', 'Madhapur', 'Tolichowki', 'Kukatpally', 'Mehdipatnam', 'Secunderabad', 'Gachibowli', 'Old City']

const ANCHOR = new Date('2026-07-01T18:30:00+05:30').getTime()
const DAY = 24 * 60 * 60 * 1000

async function applySchema(db) {
  const sql = readFileSync(path.join(root, 'supabase/migrations/001_initial_schema.sql'), 'utf8')
  await db.query(sql)
  console.log('schema applied')
}

async function seed(db) {
  // Products (upsert on slug)
  for (const p of PRODUCTS) {
    await db.query(
      `insert into public.products
        (id, slug, name, category, is_kit, price_paise, sale_price_paise, benefit, description,
         ingredients, ritual, benefits, badge, rating, review_count, image, gallery, contents,
         stock, is_active, sort_order)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,true,$20)
       on conflict (slug) do update set
         name = excluded.name, category = excluded.category, is_kit = excluded.is_kit,
         price_paise = excluded.price_paise, benefit = excluded.benefit,
         description = excluded.description, ingredients = excluded.ingredients,
         ritual = excluded.ritual, benefits = excluded.benefits, badge = excluded.badge,
         rating = excluded.rating, review_count = excluded.review_count,
         image = excluded.image, gallery = excluded.gallery, contents = excluded.contents,
         sort_order = excluded.sort_order`,
      [p.id, p.slug, p.name, p.category, p.is_kit, p.price_paise, p.sale_price_paise, p.benefit,
       p.description, p.ingredients, p.ritual, p.benefits, p.badge, p.rating, p.review_count,
       p.image, p.gallery, p.contents, p.stock, p.sort_order]
    )
  }
  console.log('products seeded:', PRODUCTS.length)

  // Reviews (skip if already seeded)
  const { rows: [{ count: reviewCount }] } = await db.query('select count(*)::int as count from public.reviews')
  if (reviewCount === 0) {
    for (const [pi, author, rating, createdAt, status, body] of REVIEWS) {
      await db.query(
        `insert into public.reviews (product_id, author, rating, body, verified, status, created_at)
         values ($1,$2,$3,$4,true,$5,$6)`,
        [PRODUCTS[pi].id, author, rating, body, status, createdAt]
      )
    }
    console.log('reviews seeded:', REVIEWS.length)
  } else {
    console.log('reviews already present, skipped')
  }

  // Orders (skip if already seeded)
  const { rows: [{ count: orderCount }] } = await db.query('select count(*)::int as count from public.orders')
  if (orderCount > 0) {
    console.log('orders already present, skipped')
    return
  }

  const rand = mulberry32(20260701)
  const customerIds = new Map()
  let seeded = 0

  for (let i = 0; i < 36; i++) {
    const c = CUSTOMER_POOL[Math.floor(rand() * CUSTOMER_POOL.length)]
    if (!customerIds.has(c.email)) {
      const { rows } = await db.query(
        `insert into public.customers (email, full_name, phone) values ($1,$2,$3)
         on conflict (email) do update set full_name = excluded.full_name
         returning id`,
        [c.email, c.name, c.phone]
      )
      customerIds.set(c.email, rows[0].id)
    }

    const itemCount = rand() < 0.55 ? 1 : rand() < 0.8 ? 2 : 3
    const shuffled = [...PRODUCTS].sort(() => rand() - 0.5)
    const items = shuffled.slice(0, itemCount).map((p) => {
      const qty = rand() < 0.8 ? 1 : 2
      return { product: p, qty, unit: p.sale_price_paise ?? p.price_paise }
    })
    const subtotal = items.reduce((s, it) => s + it.unit * it.qty, 0)
    const shipping = c.state === 'Telangana' ? 6000 : 10000

    const createdAt = new Date(ANCHOR - Math.floor(rand() * 55 * DAY) - Math.floor(rand() * 12) * 3600_000)
    const ageDays = (ANCHOR - createdAt.getTime()) / DAY
    let status
    if (rand() < 0.06) status = 'cancelled'
    else if (ageDays > 14) status = 'delivered'
    else if (ageDays > 6) status = rand() < 0.7 ? 'delivered' : 'shipped'
    else if (ageDays > 2) status = rand() < 0.6 ? 'shipped' : 'paid'
    else status = rand() < 0.85 ? 'paid' : 'pending'

    const paid = status !== 'pending' && status !== 'cancelled'
    const line2 = c.state === 'Telangana' ? LOCALITIES[Math.floor(rand() * LOCALITIES.length)] : null
    const pincode = c.state === 'Telangana'
      ? `5000${Math.floor(rand() * 90) + 10}`.slice(0, 6)
      : String(Math.floor(rand() * 700000) + 110000).padStart(6, '0')

    const { rows: [orderRow] } = await db.query(
      `insert into public.orders
        (customer_id, status, subtotal_paise, shipping_paise, total_paise,
         ship_name, ship_line1, ship_line2, ship_city, ship_state, ship_pincode,
         payment_provider, payment_id, invoice_no, created_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       returning id, order_no`,
      [customerIds.get(c.email), status, subtotal, shipping, subtotal + shipping,
       c.name, ADDRESS_LINES[Math.floor(rand() * ADDRESS_LINES.length)], line2,
       c.city, c.state, pincode,
       paid ? 'mock' : null,
       paid ? `pay_M${1040 + i}x${Math.floor(rand() * 9000) + 1000}` : null,
       null,
       createdAt.toISOString()]
    )
    if (paid) {
      await db.query('update public.orders set invoice_no = $1 where id = $2',
        [`INV-2026-${orderRow.order_no.replace('SKN-', '')}`, orderRow.id])
    }
    for (const it of items) {
      await db.query(
        `insert into public.order_items (order_id, product_id, name_snapshot, qty, unit_price_paise, line_total_paise)
         values ($1,$2,$3,$4,$5,$6)`,
        [orderRow.id, it.product.id, it.product.name, it.qty, it.unit, it.unit * it.qty]
      )
    }
    seeded++
  }
  console.log('orders seeded:', seeded)
}

async function createAdminUser(db) {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })
  const email = 'admin@skinature.org'
  const password = 'skinature@2026'

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  let userId = data?.user?.id
  if (error) {
    if (String(error.message).toLowerCase().includes('already')) {
      const { data: list } = await supabase.auth.admin.listUsers()
      userId = list?.users?.find((u) => u.email === email)?.id
      console.log('admin auth user already exists')
    } else {
      throw error
    }
  } else {
    console.log('admin auth user created')
  }

  if (!userId) throw new Error('could not resolve admin user id')
  await db.query(
    `insert into public.admins (user_id, email) values ($1,$2)
     on conflict (user_id) do nothing`,
    [userId, email]
  )
  console.log('admins table row ensured for', email)
}

const args = process.argv.slice(2)
const all = args.length === 0
const db = await connect()
try {
  if (all || args.includes('--schema')) await applySchema(db)
  if (all || args.includes('--seed')) await seed(db)
  if (all || args.includes('--admin')) await createAdminUser(db)
  console.log('DONE')
} finally {
  await db.end()
}
