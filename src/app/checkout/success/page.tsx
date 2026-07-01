import OrderSuccessClient from "@/components/checkout/OrderSuccessClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Skinature order has been placed successfully.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return <OrderSuccessClient />;
}
