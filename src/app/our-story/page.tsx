import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

// About Us page per the client's info doc (2026-07-23): Story, Philosophy,
// and the Founders' Note — all copy provided by the client, verbatim in spirit.

export const metadata: Metadata = {
  title: "About Us | Our Story",
  description:
    "We created Skinature because skincare shouldn't feel complicated. Time-tested botanicals, modern testing, and honest care — the story of Hina Mushfiq & Syed Adnan Touseef.",
  alternates: {
    canonical: `${SITE_URL}/our-story`,
  },
  openGraph: {
    title: `About Us | ${SITE_NAME}`,
    description:
      "We didn't reinvent nature. We simply listened to it. The Skinature story.",
    url: `${SITE_URL}/our-story`,
    type: "website",
  },
};

export default function OurStoryPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-36 md:pt-44 pb-24 md:pb-32 bg-cream min-h-screen">
        <article className="max-w-3xl mx-auto px-6">
          {/* Header */}
          <header className="text-center mb-14 md:mb-20">
            <span className="text-gold-600 uppercase tracking-[0.25em] text-xs font-bold mb-4 block">
              About Us
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-forest-900 font-light leading-tight mb-6">
              Welcome to <span className="italic text-forest-800">Skinature.</span>
            </h1>
            <p className="font-cursive text-2xl md:text-3xl text-forest-800/80">
              Nurtured by Nature
            </p>
            <span className="inline-block h-px w-16 bg-gold-500/70 mt-6" aria-hidden="true" />
          </header>

          {/* Story */}
          <section aria-labelledby="story-heading" className="mb-16 md:mb-20">
            <h2 id="story-heading" className="sr-only">
              Our story
            </h2>
            <div className="space-y-7 text-forest-900/75 text-lg leading-relaxed">
              <p>
                We created Skinature because skincare shouldn&apos;t feel complicated.
              </p>
              <p>
                Every formula combines time-tested botanicals with modern testing,
                giving you products that are gentle, effective and made to become part
                of your everyday ritual.
              </p>
            </div>
          </section>

          {/* Philosophy */}
          <section
            aria-labelledby="philosophy-heading"
            className="mb-16 md:mb-20 bg-beige rounded-[2rem] border border-forest-900/8 px-8 py-12 md:px-14 md:py-14 text-center"
          >
            <h2
              id="philosophy-heading"
              className="text-gold-600 uppercase tracking-[0.25em] text-xs font-bold mb-8"
            >
              Our Philosophy
            </h2>
            <ul className="space-y-4">
              <li className="font-serif text-2xl md:text-3xl text-forest-900">
                No shortcuts.
              </li>
              <li className="font-serif text-2xl md:text-3xl text-forest-900">
                No unnecessary ingredients.
              </li>
              <li className="font-serif text-2xl md:text-3xl text-forest-800 italic">
                Just honest &amp; simplified care.
              </li>
            </ul>
          </section>

          {/* Founders' Note */}
          <section aria-labelledby="founders-heading" className="mb-16 md:mb-20">
            <div className="text-center mb-10">
              <h2
                id="founders-heading"
                className="font-serif text-4xl md:text-5xl text-forest-900 leading-tight"
              >
                Founders&apos; <span className="italic text-forest-800">Note</span>
              </h2>
            </div>

            <figure className="relative w-full max-w-md mx-auto mb-10">
              <span className="absolute -inset-3 rounded-[2rem] bg-beige rotate-1" aria-hidden="true" />
              <span className="relative block rounded-[1.6rem] overflow-hidden aspect-[3/4]">
                <Image
                  src="/The Cofounders.jpeg"
                  alt="Hina Mushfiq and Syed Adnan Touseef, co-founders of Skinature"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 448px"
                />
              </span>
              <figcaption className="relative text-center text-forest-900/50 text-xs uppercase tracking-[0.2em] mt-5">
                Hina Mushfiq &amp; Syed Adnan Touseef
              </figcaption>
            </figure>

            <blockquote className="text-center mb-10">
              <p className="font-serif text-2xl md:text-3xl text-forest-900 italic leading-snug">
                &ldquo;We didn&apos;t reinvent nature.
                <br />
                We simply listened to it.&rdquo;
              </p>
            </blockquote>

            <div className="space-y-6 text-forest-900/75 text-lg leading-relaxed">
              <p>
                Skinature started with two people. A husband. A wife. And one simple
                question:
              </p>
              <p className="font-serif text-xl md:text-2xl text-forest-900 italic text-center py-2">
                Why should clean beauty cost a fortune?
              </p>
              <p>
                We believed natural care should be honest, effective and accessible to
                everyone. So we started formulating products we&apos;d proudly use on
                ourselves and our family.
              </p>
              <p>
                Today, every Skinature product still follows that same promise: bringing
                your skin &amp; hair the goodness of nature&apos;s finest ingredients,
                and the gentle care they deserve.
              </p>
              <p>Thank you for being part of our journey.</p>
            </div>

            <p className="mt-10 text-center">
              <span className="font-cursive text-3xl text-forest-900 block mb-1.5">
                Hina Mushfiq &amp; Syed Adnan Touseef
              </span>
              <span className="text-forest-900/50 text-xs uppercase tracking-[0.25em]">
                Co-founders, Skinature
              </span>
            </p>
          </section>

          {/* Brigade invite */}
          <section className="text-center border-t border-forest-900/10 pt-14">
            <p className="text-forest-900/70 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Sign up and become part of the Skinature Beauty Brigade. Experience
              self-care that&apos;s intentional, simple, and rooted in nature.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
              <Link
                href="/beauty-brigade"
                className="inline-flex items-center px-9 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium transition-all duration-400 hover:bg-forest-800 hover:shadow-[inset_0_0_0_1px_rgba(226,210,165,0.6),0_8px_30px_rgba(42,62,44,0.28)]"
              >
                Join the Brigade
              </Link>
              <Link
                href="/shop"
                className="text-xs uppercase tracking-[0.25em] font-bold text-forest-900 hover:text-forest-800 py-4 underline decoration-gold-500/70 hover:decoration-gold-500 decoration-2 underline-offset-8 transition-colors duration-300"
              >
                Shop the Collection
              </Link>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
