export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  category: string;
  benefit: string;
  description: string;
  image: string;
  gallery?: string[];
  badge?: string;
  rating: number;
  reviewCount: number;
  ingredients: string;
  ritual: string;
  benefits: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Brightening & Cleansing Mask",
    price: "₹499",
    category: "SKIN CARE",
    benefit: "Brightening & Detoxifying",
    description:
      "Removes Tan | Fades Pigmentation | Revives Dullness",
    image: "/new mockups/Brightening and Cleansing Mask.webp",
    badge: "Best Seller",
    rating: 4.9,
    reviewCount: 156,
    ingredients:
      "Natural botanicals, Vitamin C, Turmeric Extract, Kaolin Clay, Rose Water, Aloe Vera.",
    ritual:
      "Apply an even layer to cleansed face. Leave for 15-20 minutes. Rinse with lukewarm water. Use 2-3 times weekly for radiant skin.",
    benefits:
      "Removes tan and pigmentation, brightens complexion, revives dull skin. Gentle detoxification while nourishing and hydrating.",
  },
  {
    id: "2",
    name: "Root Revival Hair Mask & Cocktail",
    price: "₹600",
    category: "HAIR CARE",
    benefit: "Hair Strengthening & Growth",
    description:
      "Strengthens Hair | Reduces Hair Fall | Fights Dandruff | Stimulates Growth",
    image: "/new mockups/Hair Kit.webp",
    gallery: [
      "/new mockups/Hair Kit.webp",
      "/new mockups/Root Revival Hair Mask.webp",
      "/new mockups/Root Revival Cocktail.webp",
    ],
    badge: "Combo Pack",
    rating: 4.8,
    reviewCount: 203,
    ingredients:
      "Bhringraj Extract, Amla, Hibiscus, Neem, Fenugreek, Coconut Oil, Argan Oil, Biotin.",
    ritual:
      "Apply hair mask to roots and lengths. Massage gently for 5 minutes. Leave for 30 minutes. Rinse thoroughly. Follow with cocktail spray on damp hair.",
    benefits:
      "Strengthens hair from roots, reduces hair fall significantly, fights dandruff effectively. Stimulates natural hair growth and adds volume.",
  },
  {
    id: "3",
    name: "Root Revival Hair Oil",
    price: "₹550",
    category: "HAIR CARE",
    benefit: "Deep Nourishment & Repair",
    description:
      "Repairs Damage | Deeply Nourishes | Adds Shine & Smoothness",
    image: "/new mockups/Root Revival Hair Oil.webp",
    rating: 4.7,
    reviewCount: 178,
    ingredients:
      "Bhringraj, Brahmi, Amla, Neem, Hibiscus, Coconut Oil, Castor Oil, Sesame Oil, Vitamin E.",
    ritual:
      "Warm oil slightly. Apply to scalp and massage for 10 minutes. Distribute through hair lengths. Leave for minimum 2 hours or overnight. Wash with mild shampoo.",
    benefits:
      "Repairs damaged hair, provides deep nourishment from roots to tips. Adds natural shine, smoothness and controls frizz.",
  },
  {
    id: "4",
    name: "Hair Care Kit",
    price: "₹1,100",
    category: "HAIR CARE",
    benefit: "Complete Hair Care Solution",
    description:
      "Root Revival Hair Care Combo: Oil, Mask & Cocktail",
    image: "/new mockups/Hair Care Kit.webp",
    badge: "Complete Kit",
    rating: 4.9,
    reviewCount: 145,
    ingredients:
      "Complete blend of Bhringraj, Amla, Hibiscus, Neem, Coconut Oil, Argan Oil, Biotin, and essential vitamins.",
    ritual:
      "Use oil treatment 2-3 times weekly. Apply mask once weekly. Use cocktail spray daily on damp or dry hair. Complete hair care routine for best results.",
    benefits:
      "Complete hair care solution. Addresses all hair concerns: strengthening, nourishment, damage repair, and growth stimulation in one comprehensive kit.",
  },
  {
    id: "5",
    name: "Bridal Kit",
    price: "₹1,550",
    category: "HAIR CARE, SKIN CARE",
    benefit: "Complete Beauty Essentials",
    description:
      "Hair & Skin Essentials, beautifully boxed for the moments that matter.",
    image: "/new mockups/Bridal Kit Box.webp",
    gallery: [
      "/new mockups/Bridal Kit Box.webp",
      "/new mockups/Bridal Kit.webp",
    ],
    badge: "Premium Kit",
    rating: 5.0,
    reviewCount: 89,
    ingredients:
      "Complete combination of all hair care and skin care products. Premium botanical ingredients for comprehensive beauty care.",
    ritual:
      "Follow complete hair care routine with oil, mask, and cocktail. Use brightening mask 2-3 times weekly. Perfect pre-bridal beauty regimen for glowing skin and lustrous hair.",
    benefits:
      "All-in-one beauty solution. Combines hair and skin essentials for complete transformation. Perfect for brides and special occasions. Visible results in weeks.",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getBestSellers(): Product[] {
  return products.slice(0, 4);
}

/** Site-wide SEO constants */
export const SITE_NAME = "Skinature";
export const SITE_TAGLINE = "Nurtured By Nature";
export const SITE_URL = "https://skinature.com";
export const SITE_DESCRIPTION =
  "Skinature is a premium natural skincare brand offering botanical, consciously created products. Nurtured by nature, perfected for your skin.";
