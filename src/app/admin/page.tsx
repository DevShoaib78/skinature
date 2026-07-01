import DashboardClient from "@/components/admin/DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return <DashboardClient />;
}
