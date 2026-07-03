import HomeClient from "@/components/home/HomeClient";
import { fetchProducts } from "@/lib/db/store";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_URL,
  INSTAGRAM_URL,
  YOUTUBE_URL,
  BUSINESS_LEGAL_NAME,
  BUSINESS_GSTIN,
  BUSINESS_ADDRESS,
  BUSINESS_PILLARS,
} from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE} | Premium Natural Skincare`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} | ${SITE_TAGLINE} | Premium Natural Skincare`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
  },
};

export default async function Home() {
  const products = await fetchProducts();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Organization", "Brand"],
            "@id": `${SITE_URL}/#organization`,
            name: SITE_NAME,
            legalName: BUSINESS_LEGAL_NAME,
            slogan: SITE_TAGLINE,
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            image: `${SITE_URL}/logo.png`,
            description: SITE_DESCRIPTION,
            email: "care@skinature.org",
            taxID: BUSINESS_GSTIN,
            vatID: BUSINESS_GSTIN,
            founder: [
              { "@type": "Person", name: "Hina Mushfiq" },
              { "@type": "Person", name: "Syed Adnan Touseef" },
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: BUSINESS_ADDRESS.street,
              addressLocality: BUSINESS_ADDRESS.locality,
              addressRegion: BUSINESS_ADDRESS.region,
              postalCode: BUSINESS_ADDRESS.postalCode,
              addressCountry: BUSINESS_ADDRESS.country,
            },
            areaServed: { "@type": "Country", name: "India" },
            knowsAbout: [...BUSINESS_PILLARS],
            sameAs: [INSTAGRAM_URL, YOUTUBE_URL],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/shop?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <HomeClient products={products} />
    </>
  );
}
