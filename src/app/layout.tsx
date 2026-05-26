import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "CashNest",
  description: "A calm personal finance tracker for everyday money management.",
  icons: {
    icon: "/branding/logo.png"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} min-h-screen bg-stone-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
