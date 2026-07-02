import ProductDetailClient from "@/components/shop/ProductDetailClient";
import {
  fetchProducts,
  fetchProductBySlug,
  fetchRelatedProducts,
  fetchApprovedReviews,
} from "@/lib/db/store";
import { effectivePricePaise, SITE_NAME, SITE_URL } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 300;
// Unknown slugs must return a real 404 status; with streamed ISR fallbacks
// notFound() cannot set the status, so the slug list is fixed at build time.
// Adding a NEW product therefore needs a redeploy (docs/DECISIONS.md §8);
// edits to existing products flow through ISR within 5 minutes.
export const dynamicParams = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

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
  const products = await fetchProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([
    fetchRelatedProducts(slug),
    fetchApprovedReviews(product.id),
  ]);

  return (
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
              datePublished: r.createdAt.slice(0, 10),
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
      <ProductDetailClient product={product} related={related} reviews={reviews} />
    </>
  );
}
