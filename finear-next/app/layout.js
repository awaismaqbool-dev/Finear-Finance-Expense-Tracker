import "./globals.css";

export const metadata = {
  title: "Finear",
  description: "Personal finance and expense tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
