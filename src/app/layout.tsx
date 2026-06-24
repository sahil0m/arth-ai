import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARTH.AI — Causal Agentic Intelligence for Banking",
  description:
    "ARTH.AI is the first causally-intelligent agentic banking platform. It understands WHY customers act — not just what they did — to drive acquisition, digital adoption and engagement for SBI. Built for the SBI BI Hackathon @ GFF 2026.",
  keywords: [
    "Causal AI",
    "Agentic AI",
    "Banking",
    "SBI",
    "GFF 2026",
    "Customer Acquisition",
    "Digital Adoption",
  ],
  authors: [{ name: "Team ARTH.AI" }],
  openGraph: {
    title: "ARTH.AI — Causal Agentic Intelligence for Banking",
    description:
      "The first bank that understands WHY. Causal AI for acquisition, adoption & engagement.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <SiteNav />
        <main className="relative">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
