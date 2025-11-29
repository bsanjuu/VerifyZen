import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VerifyZen - Credential Verification Platform",
  description: "AI-powered credential verification for background checks and employment screening",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
