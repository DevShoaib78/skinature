import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="pt-32 pb-24 min-h-screen bg-cream flex items-center justify-center"
      >
        <div className="text-center px-6 max-w-md">
          <p className="font-cursive text-7xl md:text-8xl text-gold-600/70 mb-4" aria-hidden="true">
            404
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-forest-900 mb-4">
            This path is overgrown
          </h1>
          <p className="text-forest-900/60 leading-relaxed mb-10">
            The page you are looking for does not exist or has moved. Let us guide
            you back to the garden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-9 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/shop"
              className="px-9 py-4 border border-forest-900 text-forest-900 rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-50 transition-colors"
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
