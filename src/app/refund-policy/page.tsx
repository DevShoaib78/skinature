import PolicyLayout, { PolicySection } from "@/components/layout/PolicyLayout";
import { SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description:
    "Skinature's refund and return policy: damaged or incorrect items, cancellation windows, and how refunds are processed.",
  alternates: { canonical: `${SITE_URL}/refund-policy` },
};

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund & Return Policy" lastUpdated="2 July 2026">
      <PolicySection heading="The Short Version">
        <p>
          Because our products are personal care items made in small batches, we cannot
          accept returns of opened or used products for hygiene and safety reasons. If
          anything arrives damaged, defective, or incorrect, we will make it right with
          a replacement or a full refund.
        </p>
      </PolicySection>

      <PolicySection heading="Damaged, Defective, or Wrong Items">
        <p>
          If your order arrives damaged, leaking, past its shelf life, or you received
          the wrong item:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Contact us within <strong className="text-forest-900">48 hours</strong> of
            delivery via the contact page or Instagram (@official.skinature).
          </li>
          <li>
            Share your order number along with clear photos, and where possible an
            unboxing video. This helps us resolve claims quickly and fairly.
          </li>
          <li>
            Once verified, we will send a free replacement or issue a full refund,
            whichever you prefer.
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="Order Cancellations">
        <p>
          You can cancel your order any time before it is dispatched for a full refund.
          Once an order has been dispatched, it can no longer be cancelled. To cancel,
          reach out with your order number as soon as possible.
        </p>
      </PolicySection>

      <PolicySection heading="How Refunds Are Processed">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Approved refunds are issued to the original payment method through our
            payment partner.
          </li>
          <li>
            Refunds typically reflect in your account within 5 to 7 business days of
            approval, depending on your bank.
          </li>
          <li>Shipping charges are refunded when the fault is ours.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="What We Cannot Accept">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Returns of opened or used products (hygiene and safety)</li>
          <li>Claims raised more than 48 hours after delivery</li>
          <li>
            Damage caused by improper storage after delivery (for example, keeping
            products in direct sunlight or extreme heat)
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="A Note on Natural Products">
        <p>
          Our formulations use natural ingredients, and slight variations in colour,
          texture, or aroma between batches are normal and not defects. Results vary
          from person to person. We always recommend a patch test before first use.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
