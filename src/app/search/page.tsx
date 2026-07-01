import { Suspense } from "react";
import SearchResults from "@/components/search/SearchResults";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Skinature's natural skincare and haircare products.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="pt-40 min-h-screen bg-cream" />}>
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}
