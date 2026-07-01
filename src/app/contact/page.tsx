import ContactClient from "@/components/contact/ContactClient";
import { SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Skinature team about orders, products, or anything else. We reply personally.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return <ContactClient />;
}
