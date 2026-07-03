import { fetchProducts } from "@/lib/db/store";
import { effectivePricePaise, SITE_URL, INSTAGRAM_URL, YOUTUBE_URL, BUSINESS_LEGAL_NAME, BUSINESS_GSTIN } from "@/lib/data";
import { formatPaise } from "@/lib/format";

export const revalidate = 3600;

/**
 * llms.txt — a plain-text brief for AI answer engines (AEO).
 * Convention: https://llmstxt.org  (served at /llms.txt).
 */
export async function GET() {
  const products = await fetchProducts();

  const productLines = products
    .map(
      (p) =>
        `- [${p.name}](${SITE_URL}/product/${p.slug}): ${formatPaise(
          effectivePricePaise(p)
        )} — ${p.category}. ${p.description}`
    )
    .join("\n");

  const body = `# Skinature

> Skinature (brand tagline "Nurtured by Nature") is a premium, 100% chemical-free
> natural skincare and haircare brand, handcrafted in small batches in Hyderabad,
> Telangana, India. Every product is lab-tested, cruelty-free, safe for kids, and
> gender-neutral. Operated by ${BUSINESS_LEGAL_NAME} (GSTIN ${BUSINESS_GSTIN}).
> Skinature is NOT marketed as Ayurvedic. Prices are in Indian Rupees (INR).
> Payment is prepaid via Razorpay (UPI, cards, netbanking). Shipping across India:
> Rs. 60 within Telangana, Rs. 100 for the rest of India, charged once per order.

## Products

${productLines}

## Key pages

- [Shop all products](${SITE_URL}/shop)
- [Our Story](${SITE_URL}/our-story): how Skinature began, the founders, the belief behind it
- [FAQ](${SITE_URL}/faq): answers on ingredients, safety for kids, results timeline, payment, shipping, returns
- [Contact](${SITE_URL}/contact)

## Policies

- [Shipping Policy](${SITE_URL}/shipping-policy)
- [Refund & Return Policy](${SITE_URL}/refund-policy)
- [Privacy Policy](${SITE_URL}/privacy-policy)
- [Terms & Conditions](${SITE_URL}/terms)

## Brand facts

- Founders: Hina Mushfiq and Syed Adnan Touseef (husband and wife)
- Based in: Hyderabad, Telangana, India
- Six pillars: Chemical-Free, Lab-Tested, Cruelty-Free, Safe for Kids, Gender-Neutral, Result-Oriented
- Instagram: ${INSTAGRAM_URL}
- YouTube: ${YOUTUBE_URL}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
