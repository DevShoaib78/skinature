import ProductsClient from "@/components/admin/ProductsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default function AdminProductsPage() {
  return <ProductsClient />;
}
