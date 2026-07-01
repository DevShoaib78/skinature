import LoginClient from "@/components/admin/LoginClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function AdminLoginPage() {
  return <LoginClient />;
}
