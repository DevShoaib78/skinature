import CustomersClient from "@/components/admin/CustomersClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
};

export default function AdminCustomersPage() {
  return <CustomersClient />;
}
