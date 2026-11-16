import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Marketplace",
    template: "%s · Marketplace",
  },
  description: "Buy and sell locally. List a photo, browse by category, and message the seller.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#f0f2f5] text-[#050505] antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
