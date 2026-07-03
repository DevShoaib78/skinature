/**
 * Mock data layer.
 * Shaped to mirror the future Supabase `products` schema so the swap to live data
 * is a drop-in: prices are integer paise, products carry slugs, stock, sort order,
 * and an active flag. Keep it that way.
 */

export type Category = 'Skin Care' | 'Hair Care' | 'Hair + Skin'

export interface Product {
  id: string
  slug: string
  name: string
  category: Category
  isKit: boolean
  pricePaise: number
  salePricePaise: number | null
  benefit: string
  description: string
  ingredients: string
  ritual: string
  benefits: string
  badge?: string
  rating: number
  reviewCount: number
  image: string
  gallery: string[]
  /** For kits and combos: what's inside the box. */
  contents?: string[]
  stock: number
  isActive: boolean
  sortOrder: number
}

const allProducts: Product[] = [
  {
    id: '1',
    slug: 'brightening-cleansing-mask',
    name: 'Brightening & Cleansing Mask',
    category: 'Skin Care',
    isKit: false,
    pricePaise: 49900,
    salePricePaise: null,
    benefit: 'Brightening & Detoxifying',
    description: 'Removes Tan | Fades Pigmentation | Revives Dullness',
    image: '/new mockups/Brightening and Cleansing Mask.webp',
    gallery: ['/new mockups/Brightening and Cleansing Mask.webp'],
    badge: 'Best Seller',
    rating: 4.9,
    reviewCount: 156,
    ingredients:
      'Natural botanicals, Vitamin C, Turmeric Extract, Kaolin Clay, Rose Water, Aloe Vera.',
    ritual:
      'Apply an even layer to cleansed face. Leave for 15-20 minutes. Rinse with lukewarm water. Use 2-3 times weekly for radiant skin.',
    benefits:
      'Removes tan and pigmentation, brightens complexion, revives dull skin. Gentle detoxification while nourishing and hydrating.',
    stock: 42,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: '2',
    slug: 'root-revival-hair-mask-cocktail',
    name: 'Root Revival Hair Mask & Cocktail',
    category: 'Hair Care',
    isKit: true,
    pricePaise: 60000,
    salePricePaise: null,
    benefit: 'Hair Strengthening & Growth',
    description:
      'Strengthens Hair | Reduces Hair Fall | Fights Dandruff | Stimulates Growth',
    image: '/new mockups/Hair Kit.webp',
    gallery: [
      '/new mockups/Hair Kit.webp',
      '/new mockups/Root Revival Hair Mask.webp',
      '/new mockups/Root Revival Cocktail.webp',
    ],
    badge: 'Combo Pack',
    rating: 4.8,
    reviewCount: 203,
    contents: ['Root Revival Hair Mask', 'Root Revival Cocktail'],
    ingredients:
      'Bhringraj Extract, Amla, Hibiscus, Neem, Fenugreek, Coconut Oil, Argan Oil, Biotin.',
    ritual:
      'Apply hair mask to roots and lengths. Massage gently for 5 minutes. Leave for 30 minutes. Rinse thoroughly. Follow with cocktail spray on damp hair.',
    benefits:
      'Strengthens hair from roots, reduces hair fall significantly, fights dandruff effectively. Stimulates natural hair growth and adds volume.',
    stock: 26,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: '3',
    slug: 'root-revival-hair-oil',
    name: 'Root Revival Hair Oil',
    category: 'Hair Care',
    isKit: false,
    pricePaise: 55000,
    salePricePaise: null,
    benefit: 'Deep Nourishment & Repair',
    description: 'Repairs Damage | Deeply Nourishes | Adds Shine & Smoothness',
    image: '/new mockups/Root Revival Hair Oil.webp',
    gallery: ['/new mockups/Root Revival Hair Oil.webp'],
    rating: 4.7,
    reviewCount: 178,
    ingredients:
      'Bhringraj, Brahmi, Amla, Neem, Hibiscus, Coconut Oil, Castor Oil, Sesame Oil, Vitamin E.',
    ritual:
      'Warm oil slightly. Apply to scalp and massage for 10 minutes. Distribute through hair lengths. Leave for minimum 2 hours or overnight. Wash with mild shampoo.',
    benefits:
      'Repairs damaged hair, provides deep nourishment from roots to tips. Adds natural shine, smoothness and controls frizz.',
    stock: 34,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: '4',
    slug: 'hair-care-kit',
    name: 'Hair Care Kit',
    category: 'Hair Care',
    isKit: true,
    pricePaise: 110000,
    salePricePaise: null,
    benefit: 'Complete Hair Care Solution',
    description: 'Root Revival Hair Care Combo: Oil, Mask & Cocktail',
    image: '/new mockups/Hair Care Kit.webp',
    gallery: ['/new mockups/Hair Care Kit.webp'],
    badge: 'Complete Kit',
    rating: 4.9,
    reviewCount: 145,
    contents: [
      'Root Revival Hair Oil',
      'Root Revival Hair Mask',
      'Root Revival Cocktail',
    ],
    ingredients:
      'Complete blend of Bhringraj, Amla, Hibiscus, Neem, Coconut Oil, Argan Oil, Biotin, and essential vitamins.',
    ritual:
      'Use oil treatment 2-3 times weekly. Apply mask once weekly. Use cocktail spray daily on damp or dry hair. Complete hair care routine for best results.',
    benefits:
      'Complete hair care solution. Addresses all hair concerns: strengthening, nourishment, damage repair, and growth stimulation in one comprehensive kit.',
    stock: 15,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: '5',
    slug: 'bridal-kit',
    name: 'Bridal Kit',
    category: 'Hair + Skin',
    isKit: true,
    pricePaise: 155000,
    salePricePaise: null,
    benefit: 'Complete Beauty Essentials',
    description:
      'Hair & Skin Essentials, beautifully boxed for the moments that matter.',
    image: '/new mockups/Bridal Kit Box.webp',
    gallery: ['/new mockups/Bridal Kit Box.webp', '/new mockups/Bridal Kit.webp'],
    badge: 'Premium Kit',
    rating: 5.0,
    reviewCount: 89,
    contents: [
      'Brightening & Cleansing Mask',
      'Root Revival Hair Oil',
      'Root Revival Hair Mask',
      'Root Revival Cocktail',
    ],
    ingredients:
      'Complete combination of all hair care and skin care products. Premium botanical ingredients for comprehensive beauty care.',
    ritual:
      'Follow complete hair care routine with oil, mask, and cocktail. Use brightening mask 2-3 times weekly. Perfect pre-bridal beauty regimen for glowing skin and lustrous hair.',
    benefits:
      'All-in-one beauty solution. Combines hair and skin essentials for complete transformation. Perfect for brides and special occasions. Visible results in weeks.',
    stock: 9,
    isActive: true,
    sortOrder: 5,
  },
]

/** Active catalog, in display order (what the storefront shows). */
export const products: Product[] = allProducts
  .filter((p) => p.isActive)
  .sort((a, b) => a.sortOrder - b.sortOrder)

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getBestSellers(): Product[] {
  return products.slice(0, 4)
}

/** Same-category products first, then the rest, excluding the product itself. */
export function getRelatedProducts(slug: string, count = 3): Product[] {
  const current = getProductBySlug(slug)
  if (!current) return products.slice(0, count)
  const others = products.filter((p) => p.slug !== slug)
  const sameCategory = others.filter((p) => p.category === current.category)
  const rest = others.filter((p) => p.category !== current.category)
  return [...sameCategory, ...rest].slice(0, count)
}

/** The price the customer pays right now (sale price wins when set). */
export function effectivePricePaise(p: Product): number {
  return p.salePricePaise ?? p.pricePaise
}

export function isOnSale(p: Product): boolean {
  return p.salePricePaise !== null && p.salePricePaise < p.pricePaise
}

/** Site-wide SEO constants */
export const SITE_NAME = 'Skinature'
export const SITE_TAGLINE = 'Nurtured By Nature'
export const SITE_URL = 'https://skinature.org'
export const SITE_DESCRIPTION =
  'Skinature is a premium natural skincare and haircare brand from India. 100% chemical-free, lab-tested, cruelty-free products, nurtured by nature and perfected for your skin.'
export const INSTAGRAM_URL = 'https://www.instagram.com/official.skinature'
export const YOUTUBE_URL = 'https://www.youtube.com/@Officialskinature/shorts'

/** Registered legal entity + address (from Adnan). Used for invoices, NAP, and structured data. */
export const BUSINESS_LEGAL_NAME = 'Nurtured by Nature Products'
export const BUSINESS_GSTIN = '36AAZFN8373Q1ZU'
export const BUSINESS_ADDRESS = {
  street: 'Plot No. 509-J-III, Road No. 86, Near Lotus Pond, Jubilee Hills',
  locality: 'Hyderabad',
  region: 'Telangana',
  postalCode: '500096',
  country: 'IN',
} as const
export const BUSINESS_PILLARS = [
  'Chemical-Free',
  'Lab-Tested',
  'Cruelty-Free',
  'Safe for Kids',
  'Gender-Neutral',
  'Result-Oriented',
] as const
