import InvoiceClient from "@/components/admin/InvoiceClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice",
};

export default async function AdminInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvoiceClient orderId={id} />;
}
