import ShopClient from "@/components/shop/ShopClient";
import { SITE_NAME, SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

const shopDescription =
  "Browse Skinature's curated collection of premium natural skincare products. Botanical serums, creams, masks, and tools — nurtured by nature, perfected for your skin.";

export const metadata: Metadata = {
  title: "Shop Natural Skincare Products",
  description: shopDescription,
  alternates: {
    canonical: `${SITE_URL}/shop`,
  },
  openGraph: {
    title: `Shop Natural Skincare Products | ${SITE_NAME}`,
    description: shopDescription,
    url: `${SITE_URL}/shop`,
    type: "website",
  },
  twitter: {
    title: `Shop Natural Skincare Products | ${SITE_NAME}`,
    description: shopDescription,
  },
};

export default function ShopPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Shop — ${SITE_NAME}`,
            description: shopDescription,
            url: `${SITE_URL}/shop`,
            isPartOf: {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
            },
          }),
        }}
      />
      <ShopClient />
    </>
  );
}
