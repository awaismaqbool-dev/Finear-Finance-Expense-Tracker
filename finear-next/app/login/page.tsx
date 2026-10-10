import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ email?: string; debugOtp?: string; reset?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="login" initialEmail={params.email} initialDebugOtp={params.debugOtp} resetSuccess={params.reset === "success"} />;
}
