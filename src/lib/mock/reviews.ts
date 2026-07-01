/**
 * Mock product reviews. Mirrors the future `reviews` table
 * (id, product_id, author, rating, body, created_at, verified, status).
 * Only approved reviews are surfaced, matching the moderation decision.
 */

export type ReviewStatus = 'pending' | 'approved' | 'hidden'

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  body: string
  createdAt: string
  verified: boolean
  /** Reviews go live only after admin approval (docs/DECISIONS.md §6.7). */
  status: ReviewStatus
}

const reviews: Review[] = [
  // 1. Brightening & Cleansing Mask
  {
    id: 'r-101',
    productId: '1',
    author: 'Asma R.',
    rating: 5,
    body: 'The glow it leaves on my face, just wow! My sister used it when she had developed pigmentation around her neck and this mask actually helped to fade it. Alhamdulillah.',
    createdAt: '2026-06-14',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-102',
    productId: '1',
    author: 'Priya K.',
    rating: 5,
    body: 'Tan around my forehead and cheeks visibly reduced in three weeks of regular use. It feels gentle, no burning or tightness after washing off.',
    createdAt: '2026-05-28',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-103',
    productId: '1',
    author: 'Naaz O.',
    rating: 4,
    body: 'Very nice face pack. I even asked if I can use it for my daughter, she is 9, and they said yes since it is chemical free. That trust matters to me.',
    createdAt: '2026-05-10',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-104',
    productId: '1',
    author: 'Ritika S.',
    rating: 5,
    body: 'Have tried so many ubtans and masks from big brands. This one actually brightens without drying my combination skin. Restocking already.',
    createdAt: '2026-04-22',
    verified: true,
    status: 'approved',
  },

  // 2. Root Revival Hair Mask & Cocktail
  {
    id: 'r-201',
    productId: '2',
    author: 'Mehnaz A.',
    rating: 5,
    body: 'Ordered the combo at an expo and the results are mashallah, visibly seen. Hair fall in my comb reduced noticeably by the third wash.',
    createdAt: '2026-06-20',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-202',
    productId: '2',
    author: 'Shruti V.',
    rating: 5,
    body: 'The mask is rich but rinses clean, and the cocktail spray is now my daily leave-in. My frizz is finally manageable in Hyderabad humidity.',
    createdAt: '2026-06-02',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-203',
    productId: '2',
    author: 'Farhan M.',
    rating: 4,
    body: 'Bought for my wife, ended up using it myself too. Dandruff has calmed down a lot. Wish the mask tub was bigger, we finish it fast.',
    createdAt: '2026-05-15',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-204',
    productId: '2',
    author: 'Keerthana R.',
    rating: 5,
    body: 'The consistency of natural products is awesome, no harmful chemicals. My scalp feels clean, not stripped. Will restock soon inshallah.',
    createdAt: '2026-04-30',
    verified: true,
    status: 'approved',
  },

  // 3. Root Revival Hair Oil
  {
    id: 'r-301',
    productId: '3',
    author: 'Ayesha T.',
    rating: 5,
    body: 'I have been using the hair oil and trust me, it is working so well for me. Two months in, baby hairs along my hairline are filling in.',
    createdAt: '2026-06-18',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-302',
    productId: '3',
    author: 'Divya N.',
    rating: 5,
    body: 'Smells earthy and herbal, not perfumey. Overnight oiling then a mild shampoo, and my hair is softer than any serum ever made it.',
    createdAt: '2026-05-25',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-303',
    productId: '3',
    author: 'Sameer H.',
    rating: 4,
    body: 'Genuine bhringraj oil, you can tell from the colour and texture. Reduced my hair fall. Slightly heavy for daily use, perfect for weekends.',
    createdAt: '2026-05-08',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-304',
    productId: '3',
    author: 'Lubna S.',
    rating: 5,
    body: 'My mother and I both use this now. Her scalp dryness is gone and my split ends have reduced. It feels like the oils our nani used to make.',
    createdAt: '2026-04-12',
    verified: true,
    status: 'approved',
  },

  // 4. Hair Care Kit
  {
    id: 'r-401',
    productId: '4',
    author: 'Sana B.',
    rating: 5,
    body: 'The complete routine just works: oil twice a week, mask on Sunday, cocktail daily. Fourth week and my ponytail feels thicker.',
    createdAt: '2026-06-10',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-402',
    productId: '4',
    author: 'Ankita J.',
    rating: 5,
    body: 'Gifted this to my sister for her wedding prep and stole it back after seeing her hair. Better value than buying the three separately.',
    createdAt: '2026-05-20',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-403',
    productId: '4',
    author: 'Mohammed I.',
    rating: 4,
    body: 'Solid kit. The oil and mask are the stars. Delivery to Bengaluru took four days but the packaging was neat and nothing leaked.',
    createdAt: '2026-04-28',
    verified: true,
    status: 'approved',
  },

  // 5. Bridal Kit
  {
    id: 'r-501',
    productId: '5',
    author: 'Zoya F.',
    rating: 5,
    body: 'Used the full kit for two months before my nikah. My mehndi artist asked what I had done to my skin. Worth every rupee.',
    createdAt: '2026-06-05',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-502',
    productId: '5',
    author: 'Nikitha M.',
    rating: 5,
    body: 'Bought as a bridesmaid gift box. The packaging is beautiful enough to hand over as is, and the products inside are genuinely good.',
    createdAt: '2026-05-12',
    verified: true,
    status: 'approved',
  },
  {
    id: 'r-503',
    productId: '5',
    author: 'Mehreen S.',
    rating: 5,
    body: 'Stocking up before I fly back to Saudi. Nothing there compares at this price for fully natural products. My whole family uses this kit.',
    createdAt: '2026-04-18',
    verified: true,
    status: 'approved',
  },

  // Awaiting moderation (populate the admin review queue)
  {
    id: 'r-105',
    productId: '1',
    author: 'Tanvi D.',
    rating: 5,
    body: 'Second jar finished! My tanning from college commutes is almost gone. Please never discontinue this.',
    createdAt: '2026-06-29',
    verified: true,
    status: 'pending',
  },
  {
    id: 'r-205',
    productId: '2',
    author: 'Rukhsar J.',
    rating: 4,
    body: 'Hair fall reduced within two weeks. The smell of the mask is quite strong at first but it grows on you.',
    createdAt: '2026-06-28',
    verified: true,
    status: 'pending',
  },
  {
    id: 'r-305',
    productId: '3',
    author: 'Vandana P.',
    rating: 5,
    body: 'Ordered after seeing a reel. This oil has replaced three products on my shelf. My scalp has never felt healthier.',
    createdAt: '2026-06-30',
    verified: true,
    status: 'pending',
  },
]

/** Everything, for the admin moderation queue. */
export const allReviews: Review[] = reviews

/** Storefront surface: approved reviews only, newest first. */
export function getReviewsForProduct(productId: string): Review[] {
  return reviews
    .filter((r) => r.productId === productId && r.status === 'approved')
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}
