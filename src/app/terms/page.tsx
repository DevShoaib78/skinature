import PolicyLayout, { PolicySection } from "@/components/layout/PolicyLayout";
import { SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms and conditions that govern your use of the Skinature website and purchases from our store.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated="2 July 2026">
      <PolicySection heading="Agreement">
        <p>
          By using this website and placing an order, you agree to these terms. They
          exist to keep things fair and clear for both of us. &ldquo;Skinature&rdquo;,
          &ldquo;we&rdquo;, and &ldquo;us&rdquo; refer to the Skinature brand operated
          from Telangana, India.
        </p>
      </PolicySection>

      <PolicySection heading="Products & Pricing">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>All prices are listed in Indian Rupees (₹) and include applicable taxes.</li>
          <li>Shipping charges are shown separately at checkout before you pay.</li>
          <li>
            Prices and offers may change at any time, but changes never affect an order
            you have already placed and paid for.
          </li>
          <li>
            Product images are as accurate as possible. Natural, small-batch products
            can vary slightly in colour, texture, and aroma between batches.
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="Orders & Payment">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            All orders are prepaid. Payments are processed securely by Razorpay (UPI,
            cards, netbanking, wallets). We do not offer cash on delivery at this time.
          </li>
          <li>
            An order is confirmed only after successful payment. You will receive a
            confirmation email with your invoice.
          </li>
          <li>
            We reserve the right to cancel and fully refund any order (for example, in
            case of stock or pricing errors).
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="Shipping, Returns & Refunds">
        <p>
          Shipping timelines and charges are described in our Shipping Policy. Returns,
          replacements, and refunds are governed by our Refund & Return Policy. Both
          form part of these terms.
        </p>
      </PolicySection>

      <PolicySection heading="Using Our Products Safely">
        <p>
          Our products are made from natural ingredients and are not medicines. They
          are not intended to diagnose, treat, or cure any condition. Always patch test
          before first use, and consult a doctor if you have a known allergy, a skin or
          scalp condition, or are pregnant. Discontinue use if irritation occurs.
        </p>
      </PolicySection>

      <PolicySection heading="Intellectual Property">
        <p>
          All content on this site, including the Skinature name, logo, product names,
          photography, and text, belongs to Skinature and may not be copied or used
          commercially without written permission.
        </p>
      </PolicySection>

      <PolicySection heading="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, our liability for any claim related
          to an order is limited to the amount you paid for that order.
        </p>
      </PolicySection>

      <PolicySection heading="Governing Law">
        <p>
          These terms are governed by the laws of India. Any disputes are subject to
          the jurisdiction of the courts of Hyderabad, Telangana.
        </p>
      </PolicySection>

      <PolicySection heading="Contact">
        <p>
          Questions about these terms? Reach us via the contact page or on Instagram
          (@official.skinature).
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
