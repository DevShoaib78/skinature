import ReviewsClient from "@/components/admin/ReviewsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews",
};

export default function AdminReviewsPage() {
  return <ReviewsClient />;
}
