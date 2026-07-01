import InventoryClient from "@/components/admin/InventoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory",
};

export default function AdminInventoryPage() {
  return <InventoryClient />;
}
