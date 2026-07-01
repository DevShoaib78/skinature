import OrdersClient from "@/components/admin/OrdersClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return <OrdersClient />;
}
