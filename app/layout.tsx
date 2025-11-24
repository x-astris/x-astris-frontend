// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X-ASTRiS Financial Modelling",
  description: "Financial modelling platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* GLOBAL HEADER */}
        <header
          style={{
            width: "100%",
            padding: "14px 24px",
            background: "#111",
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            borderBottom: "2px solid #444",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          X-ASTRiS Financial Modelling
        </header>

        {children}
      </body>
    </html>
  );
}
