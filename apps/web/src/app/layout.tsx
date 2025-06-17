import { Geist } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Client } from "revolt.js";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Reflect",
  description: "Revolt.js Client",
};

const geist = Geist({
  subsets: ['latin']
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = new Client();

  return (
    <html lang="en">
      <body
        className={`${geist.className} antialiased`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
