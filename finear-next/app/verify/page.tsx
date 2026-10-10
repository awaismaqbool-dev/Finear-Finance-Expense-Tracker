import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Verify your email" };

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="verify" initialEmail={params.email} />;
}
