import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stuti Traders — Premium Household Essentials",
    template: "%s | Stuti Traders",
  },
  description: "Your trusted destination for premium household essentials — kitchenware, storage, cleaning supplies, water bottles, and home care products. Quality products at the best prices.",
  keywords: ["household items", "kitchenware", "storage containers", "water bottles", "cleaning supplies", "home essentials", "Stuti Traders"],
  openGraph: {
    title: "Stuti Traders — Premium Household Essentials",
    description: "Your trusted destination for premium household essentials. Quality products at the best prices.",
    type: "website",
    locale: "en_IN",
    siteName: "Stuti Traders",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stuti Traders — Premium Household Essentials",
    description: "Your trusted destination for premium household essentials. Quality products at the best prices.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
