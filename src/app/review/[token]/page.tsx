import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import ReviewFormClient from "@/components/review/ReviewFormClient";
import { getSupabaseService } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Share Your Review",
  description: "Tell us how your Skinature products worked for you.",
  robots: { index: false, follow: false },
};

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data } = await getSupabaseService()
    .rpc("get_review_invite", { p_token: token })
    .maybeSingle<{ product_name: string; product_image: string; used: boolean }>();

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="pt-32 md:pt-40 pb-24 min-h-screen bg-cream flex items-start justify-center"
      >
        <div className="w-full max-w-lg px-6">
          {!data ? (
            <div className="text-center py-16">
              <h1 className="font-serif text-4xl text-forest-900 mb-4">
                This link is not valid
              </h1>
              <p className="text-forest-900/60 leading-relaxed mb-10">
                The review link may have expired or was mistyped. If you think this
                is a mistake, reach out to us and we will send a fresh one.
              </p>
              <Link
                href="/contact"
                className="inline-block px-9 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          ) : data.used ? (
            <div className="text-center py-16">
              <h1 className="font-serif text-4xl text-forest-900 mb-4">
                Already reviewed
              </h1>
              <p className="text-forest-900/60 leading-relaxed mb-10">
                A review was already submitted with this link. Thank you for sharing
                your experience with {data.product_name}!
              </p>
              <Link
                href="/shop"
                className="inline-block px-9 py-4 bg-forest-900 text-cream rounded-full text-xs uppercase tracking-[0.25em] font-medium hover:bg-forest-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <ReviewFormClient
              token={token}
              productName={data.product_name}
              productImage={data.product_image}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
