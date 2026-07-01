import PolicyLayout, { PolicySection } from "@/components/layout/PolicyLayout";
import { SITE_URL } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Skinature collects, uses, and protects your personal information.",
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="2 July 2026">
      <PolicySection heading="What We Collect">
        <p>When you place an order or contact us, we collect:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Your name, email address, and phone number</li>
          <li>Your shipping address</li>
          <li>Your order history with us</li>
          <li>Messages you send us through the contact form or social media</li>
        </ul>
        <p>
          We do <strong className="text-forest-900">not</strong> collect or store your
          card, UPI, or banking details. Payments are processed securely by our payment
          partner (Razorpay), and your payment credentials never touch our servers.
        </p>
      </PolicySection>

      <PolicySection heading="How We Use It">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>To process and deliver your orders</li>
          <li>To send order confirmations, invoices, and delivery updates</li>
          <li>To respond when you contact us</li>
          <li>To invite you to review products you have purchased</li>
          <li>
            To send occasional offers or updates, only if you have opted in, and you
            can unsubscribe at any time
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="Who We Share It With">
        <p>We share the minimum necessary information with:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-forest-900">Payment processing:</strong> Razorpay,
            to complete your payment securely
          </li>
          <li>
            <strong className="text-forest-900">Delivery:</strong> our courier partners,
            to ship your order (name, address, phone)
          </li>
        </ul>
        <p>
          We never sell your personal information to anyone.
        </p>
      </PolicySection>

      <PolicySection heading="Cookies & Local Storage">
        <p>
          The site uses your browser&apos;s local storage to remember your shopping
          cart between visits. We do not use invasive tracking cookies. If we adopt
          analytics in future, it will be privacy-respecting and this policy will be
          updated.
        </p>
      </PolicySection>

      <PolicySection heading="Data Security & Retention">
        <p>
          Your data is stored on secure, access-controlled infrastructure. We retain
          order records as required for accounting and legal purposes, and delete or
          anonymise data that is no longer needed.
        </p>
      </PolicySection>

      <PolicySection heading="Your Rights">
        <p>
          You can ask us at any time to see the personal data we hold about you,
          correct it, or delete it (subject to legal record-keeping requirements).
          Reach us via the contact page and we will act on it promptly.
        </p>
      </PolicySection>

      <PolicySection heading="Changes to This Policy">
        <p>
          If we make meaningful changes to how we handle your data, we will update this
          page and revise the date at the top.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
