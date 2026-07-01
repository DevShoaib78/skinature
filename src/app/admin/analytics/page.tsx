import AnalyticsClient from "@/components/admin/AnalyticsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AdminAnalyticsPage() {
  return <AnalyticsClient />;
}
