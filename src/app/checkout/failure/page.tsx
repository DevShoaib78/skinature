import Link from "next/link";
import { XCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Failed",
  description: "Your payment could not be completed.",
  robots: { index: false, follow: false },
};

export default function CheckoutFailurePage() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="pt-32 pb-24 min-h-screen bg-cream flex items-center justify-center"
      >
        <div className="text-center px-6 max-w-md">
          <XCircle
            size={56}
            strokeWidth={1.25}
            className="text-red-500/80 mx-auto mb-6"
            aria-hidden="true"
          />
          <h1 className="font-serif text-4xl md:text-5xl text-forest-900 mb-4">
            Payment Failed
          </h1>
          <p className="text-forest-900/60 leading-relaxed mb-3">
            Your payment could not be completed, and no money has been deducted
            for this order.
          </p>
          <p className="text-forest-900/60 leading-relaxed mb-10">
            Your cart is exactly as you left it. You can try again whenever you
            are ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checkout"
              className="px-9 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/cart"
              className="px-9 py-4 border border-forest-900 text-forest-900 rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-50 transition-colors"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
