import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ email?: string; debugOtp?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="reset" initialEmail={params.email} initialDebugOtp={params.debugOtp} />;
}
