import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Finear | Your money, in focus", template: "%s | Finear" },
  description: "Your personal finance dashboard.",
  icons: { icon: "/logoIcon.png", apple: "/logoIcon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
