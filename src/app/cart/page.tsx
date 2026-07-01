import CartPageClient from "@/components/cart/CartPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the products in your Skinature cart.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartPageClient />;
}
