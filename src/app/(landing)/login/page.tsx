import type { Metadata } from "next";
import { LoginForm } from "@/landing/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In — Thalamus AI",
  description: "Log in to continue to your THALAMUS Business Brain.",
};

export default function LoginPage() {
  return <LoginForm />;
}
