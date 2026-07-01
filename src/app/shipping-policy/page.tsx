import PolicyLayout, { PolicySection } from "@/components/layout/PolicyLayout";
import { SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "How Skinature ships your order: dispatch times, delivery estimates, and shipping charges across India.",
  alternates: { canonical: `${SITE_URL}/shipping-policy` },
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy" lastUpdated="2 July 2026">
      <PolicySection heading="Where We Ship">
        <p>
          We currently ship across India. International shipping to the UAE, USA, and
          other regions is planned and will be announced on this page when it goes
          live.
        </p>
      </PolicySection>

      <PolicySection heading="Shipping Charges">
        <p>
          Shipping is charged once per order, regardless of how many products are in
          it, since everything travels together in one package:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-forest-900">Within Telangana:</strong> ₹60 per order
          </li>
          <li>
            <strong className="text-forest-900">Rest of India:</strong> ₹100 per order
          </li>
        </ul>
        <p>
          The exact charge is shown at checkout before you pay. There are no hidden
          fees.
        </p>
      </PolicySection>

      <PolicySection heading="Dispatch & Delivery Times">
        <p>
          Every Skinature product is handcrafted in small batches. Orders are usually
          packed and dispatched within 1 to 3 business days.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Hyderabad and within Telangana: typically 1 to 3 days after dispatch</li>
          <li>Metro cities: typically 3 to 5 days after dispatch</li>
          <li>Rest of India: typically 4 to 7 days after dispatch</li>
        </ul>
        <p>
          These are estimates, not guarantees. Festivals, weather, and courier delays
          can occasionally add time.
        </p>
      </PolicySection>

      <PolicySection heading="Order Updates">
        <p>
          You will receive an order confirmation with your invoice by email as soon as
          your payment succeeds. Dispatch and delivery updates are shared by email and,
          where possible, on WhatsApp.
        </p>
      </PolicySection>

      <PolicySection heading="Wrong Address or Failed Delivery">
        <p>
          Please double-check your address and phone number at checkout. If a package
          is returned to us because of an incorrect address or repeated failed delivery
          attempts, we will contact you to arrange re-shipping. A fresh shipping charge
          may apply.
        </p>
      </PolicySection>

      <PolicySection heading="Questions">
        <p>
          Write to us via the contact page or on Instagram
          (@official.skinature) and we will help you out.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
