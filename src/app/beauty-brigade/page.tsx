import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beauty Brigade",
  description:
    "The Skinature Beauty Brigade is growing. Membership, rewards, and early access are on their way.",
  alternates: {
    canonical: `${SITE_URL}/beauty-brigade`,
  },
  // Placeholder page: keep out of search results until the program launches.
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: `Beauty Brigade | ${SITE_NAME}`,
    description: "Something beautiful is taking root. We will announce soon.",
    url: `${SITE_URL}/beauty-brigade`,
    type: "website",
  },
};

export default function BeautyBrigadePage() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-screen bg-cream flex items-center justify-center px-6 pt-28 pb-20"
      >
        <div className="text-center max-w-xl">
          <span className="text-gold-600 uppercase tracking-[0.25em] text-xs font-bold mb-6 block">
            Skinature
          </span>

          <h1 className="font-cursive text-6xl md:text-7xl text-forest-900 mb-8 leading-tight">
            Beauty Brigade
          </h1>

          <span className="inline-block h-px w-16 bg-gold-500/70 mb-8" aria-hidden="true" />

          <p className="font-serif text-2xl md:text-3xl text-forest-900 mb-4">
            Something beautiful is taking root.
          </p>

          <p className="text-forest-900/65 text-lg leading-relaxed mb-12">
            Membership, rewards, and early access are all in the works.
            We will announce soon. Until then, the garden is open on Instagram.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
            <a
              href="https://www.instagram.com/official.skinature"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-9 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium transition-all duration-400 hover:bg-forest-800 hover:shadow-[inset_0_0_0_1px_rgba(197,160,89,0.55),0_8px_30px_rgba(26,60,52,0.25)]"
            >
              <Instagram size={16} strokeWidth={2} aria-hidden="true" />
              Follow the Journey
            </a>

            <Link
              href="/shop"
              className="text-xs uppercase tracking-[0.25em] font-bold text-forest-900 hover:text-forest-800 py-4 underline decoration-gold-500/70 hover:decoration-gold-500 decoration-2 underline-offset-8 transition-colors duration-300"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
