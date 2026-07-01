import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { FAQ_ITEMS } from "@/lib/faq";
import { SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Skinature products, ingredients, shipping, payments, and returns.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
      <Navbar />
      <main id="main-content" className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream">
        <div className="max-w-3xl mx-auto px-6">
          <header className="mb-10 md:mb-14">
            <span className="text-gold-600 uppercase tracking-[0.25em] text-xs font-bold mb-4 block">
              Help
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-forest-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-forest-900/60 leading-relaxed">
              Everything you might want to know about our products, shipping, and
              payments. Still curious? We are one message away.
            </p>
          </header>

          <FaqAccordion items={FAQ_ITEMS} />

          <div className="mt-12 text-center bg-white rounded-[1.75rem] border border-forest-900/10 p-8">
            <p className="font-serif text-2xl text-forest-900 mb-2">
              Did not find your answer?
            </p>
            <p className="text-forest-900/55 text-sm mb-6">
              Our small team replies personally, usually within a day.
            </p>
            <Link
              href="/contact"
              className="inline-block px-9 py-3.5 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
