import ProductDetailClient from "@/components/shop/ProductDetailClient";
import { getProductById, products, SITE_NAME, SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const title = `${product.name} — ${product.benefit}`;
  const description = product.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/product/${id}`,
    },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/product/${id}`,
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
    id: product.id,
  }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);

  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              description: product.description,
              image: product.image,
              url: `${SITE_URL}/product/${product.id}`,
              brand: {
                "@type": "Brand",
                name: SITE_NAME,
              },
              offers: {
                "@type": "Offer",
                price: product.price.replace("$", ""),
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
              },
            }),
          }}
        />
      )}
      <ProductDetailClient id={id} />
    </>
  );
}
