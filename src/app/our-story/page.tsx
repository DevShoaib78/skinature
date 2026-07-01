import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

// NOTE: This copy is a faithful placeholder written from the brand's real facts.
// Swap in the founders' own words when Adnan & Hina provide them.

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How Skinature began: two people, one belief that nature still holds the answers. Chemical-free, lab-tested skincare and haircare, handcrafted in India.",
  alternates: {
    canonical: `${SITE_URL}/our-story`,
  },
  openGraph: {
    title: `Our Story | ${SITE_NAME}`,
    description:
      "How Skinature began: two people, one belief that nature still holds the answers.",
    url: `${SITE_URL}/our-story`,
    type: "website",
  },
};

export default function OurStoryPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-36 md:pt-44 pb-24 md:pb-32 bg-cream min-h-screen">
        <article className="max-w-2xl mx-auto px-6">
          {/* Header */}
          <header className="text-center mb-14 md:mb-20">
            <span className="text-gold-600 uppercase tracking-[0.25em] text-xs font-bold mb-4 block">
              Our Story
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-forest-900 font-light leading-tight mb-6">
              Born from <span className="italic text-forest-800">belief.</span>
            </h1>
            <span className="inline-block h-px w-16 bg-gold-500/70" aria-hidden="true" />
          </header>

          {/* Story */}
          <div className="space-y-7 text-forest-900/75 text-lg leading-relaxed">
            <p>
              Skinature began at home, with two people and one shared frustration.
              <span className="text-forest-900 font-medium"> Hina and Adnan</span>, wife and
              husband, kept meeting the same two problems on every shelf: products that
              promised nature but hid chemicals in the fine print, and honestly natural
              brands priced far beyond most Indian homes.
            </p>

            <p>
              So they started small, in Hyderabad, with ingredients our grandmothers never
              needed convincing about: amla, bhringraj, hibiscus, neem, turmeric. Recipes
              were tested patiently on the two people who trusted them most,
              themselves, then refined, and then lab-tested, because belief should always
              be backed by proof.
            </p>

            {/* Pull quote */}
            <blockquote className="py-8 md:py-10 text-center">
              <p className="font-serif italic text-2xl md:text-3xl text-forest-900 leading-snug">
                &ldquo;Belief that nature still holds the answers.&rdquo;
              </p>
            </blockquote>

            <p>
              One rule has never changed: if it is not safe enough for our own family,
              including the youngest in it, it does not leave the house. That is why every
              Skinature product is{" "}
              <span className="text-forest-900 font-medium">
                100% chemical-free, lab-tested, cruelty-free, safe for kids, gender-neutral,
                and made for results you can see
              </span>.
            </p>

            <p>
              What began as jars shared with family and friends now travels much further,
              to homes across India, the Gulf, and beyond. We call this growing family the{" "}
              <span className="text-forest-900 font-medium">Skinature Beauty Brigade</span>,
              and there is always room for one more.
            </p>

            <p>
              This is not a brand built in a boardroom. It is a promise made at a kitchen
              table: care that is pure, purposeful, and proudly desi.
            </p>
          </div>

          {/* Signature */}
          <footer className="mt-14 md:mt-16 pt-10 border-t border-forest-900/10 text-center">
            <p className="font-cursive text-4xl md:text-5xl text-gold-600 mb-4">
              Hina &amp; Adnan
            </p>
            <p className="text-forest-900 font-semibold">
              Hina Mushfiq &amp; Syed Adnan Touseef
            </p>
            <p className="text-forest-900/50 text-sm mt-1 uppercase tracking-[0.2em]">
              Co-Founders, Skinature
            </p>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}
