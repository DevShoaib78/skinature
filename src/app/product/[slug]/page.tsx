import ProductDetailClient from "@/components/shop/ProductDetailClient";
import {
  getProductBySlug,
  products,
  effectivePricePaise,
  SITE_NAME,
  SITE_URL,
} from "@/lib/data";
import { getReviewsForProduct } from "@/lib/mock/reviews";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  // Fail before headers are sent so unknown slugs return a real 404 status.
  if (!product) notFound();

  const title = `${product.name} | ${product.benefit}`;
  const description = product.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/product/${slug}`,
    },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/product/${slug}`,
      type: "website",
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${SITE_NAME}`,
      description,
      images: [product.image],
    },
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// The catalog is fixed at build time: anything outside it is a hard 404.
export const dynamicParams = false;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const reviews = getReviewsForProduct(product.id);

  return (
    <>
      {product && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.name,
                description: product.description,
                image: `${SITE_URL}${encodeURI(product.image)}`,
                url: `${SITE_URL}/product/${product.slug}`,
                brand: {
                  "@type": "Brand",
                  name: SITE_NAME,
                },
                offers: {
                  "@type": "Offer",
                  price: (effectivePricePaise(product) / 100).toFixed(2),
                  priceCurrency: "INR",
                  availability:
                    product.stock > 0
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                  url: `${SITE_URL}/product/${product.slug}`,
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: product.rating,
                  reviewCount: product.reviewCount,
                },
                review: reviews.slice(0, 3).map((r) => ({
                  "@type": "Review",
                  author: { "@type": "Person", name: r.author },
                  reviewRating: { "@type": "Rating", ratingValue: r.rating },
                  reviewBody: r.body,
                  datePublished: r.createdAt,
                })),
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                  { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: product.name,
                    item: `${SITE_URL}/product/${product.slug}`,
                  },
                ],
              }),
            }}
          />
        </>
      )}
      <ProductDetailClient slug={slug} />
    </>
  );
}
