import SettingsClient from "@/components/admin/SettingsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function AdminSettingsPage() {
  return <SettingsClient />;
}
